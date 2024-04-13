import mqtt, { IClientSubscribeOptions } from "mqtt";
import { Logger, ILogObj } from "tslog";
import { QoS } from "mqtt-packet";
import { Subscribe, Unsubscribe, IncomingMessage } from "./commands";
import { ConnectionState } from "./connection_state";
import { CancebleStream } from "../sync/types";
import { BroadCast } from "../sync/broadcast";

export type MqttWsTransportOptions = {
    url: string;
    token?: string;
    logger?: Logger<ILogObj>;
};

export class MqttWsTransport {
    private client: mqtt.MqttClient;
    private subscribtions: Map<number, Subscribe>;
    private logger?: Logger<ILogObj>;
    private state_broadcast: BroadCast<ConnectionState>;

    constructor(options: MqttWsTransportOptions) {
        this.logger = options.logger;
        this.state_broadcast = new BroadCast();
        this.subscribtions = new Map();
        this.client = mqtt.connect(
            options.url,
            {
                protocolVersion: 5,
                reconnectPeriod: 0,
            }
        );
        this.client.on("connect", () => {
            this.onConnect();
        });
        this.client.on("disconnect", () => {
            this.onDisconnect();
        });
        this.client.on("message", (receivedTopic, message, packet) => {
            this.onMessage(receivedTopic, message, packet);
        });
        this.client.on("error", (err) => {
            this.logger?.error(err);
        });
        this.logger?.info("Connecting to", options.url);
    }

    public close() {
        this.client.end();
    }

    public state(): CancebleStream<ConnectionState> {
        return this.state_broadcast.subscribe();
    }

    public subscribe(command: Subscribe): void {

        this.subscribtions.set(command.sub_id, command);

        const userProperties: { [index: string]: string } = {};
        if (command.offset) {
            userProperties["offset"] = command.offset.toString();
        }
        let options = {
            properties: {
                subscriptionIdentifier: command.sub_id,
                userProperties,
            },
        };

        this.client.subscribe(command.topic, options, (err, subs) => {
            let reason_code: number | undefined = undefined;
            if (subs) {
                const sub = subs.shift();
                if (sub && sub.qos & 0x80) {
                    if (!err) {
                        err = new Error("Failed to subscribe, code: " + sub.qos);
                    }
                    reason_code = sub.qos;
                }
            }

            const sub = this.subscribtions.get(command.sub_id);
            if (sub !== command) {
                return;
            }

            if (err) {
                this.logger?.error("Subscribe error", err);
                this.subscribtions.delete(command.sub_id);
                this.callback(() => command.callback({
                    cmd: "sub_error",
                    sub_id:
                        command.sub_id,
                    error: reason_code ? { reason_code } : err,
                }));
            }
        });
    }

    public unsubscribe(command: Unsubscribe): void {
        const sub = this.subscribtions.get(command.sub_id);
        if (sub === undefined) {
            return;
        }
        this.subscribtions.delete(command.sub_id);

        const opts: IClientSubscribeOptions = {
            qos: 0 as QoS,
            properties: {
                subscriptionIdentifier: command.sub_id,
            },
        };

        this.client.unsubscribe(sub.topic, opts, (err) => {
            if (err) {
                this.logger?.error(err);
            }
        });
    }

    private onConnect() {
        this.state_broadcast.broadcast({cmd: "connected"});
        for (const sub of this.subscribtions.values()) {
            this.subscribe(sub);
        }
    }

    private onDisconnect() {
        this.state_broadcast.broadcast({cmd: "disconnected"});
    }

    private onMessage(receivedTopic: string, body: Buffer, packet: mqtt.Packet) {
        if (packet.cmd === "publish") {
            const maybe_message = parseMessage(receivedTopic, body, packet);
            if (maybe_message instanceof Error) {
                this.logger?.error(maybe_message);
                return;
            }
            const message = maybe_message;
            const sub = this.subscribtions.get(message.sub_id);
            if (sub !== undefined) {
                if (!this.callback(() => sub.callback(message))) {
                    this.subscribtions.delete(message.sub_id);
                }
            }
        }
    }

    private callback(callback: () => void): boolean {
        try {
            callback();
            return true;
        } catch (e) {
            this.logger?.error("Callback error", e);
        }
        return false;
    }
}

function parseMessage(topic: string, message: Buffer, packet: mqtt.IPublishPacket): IncomingMessage | Error {
    let sub_id = packet.properties?.subscriptionIdentifier;
    if (sub_id && Array.isArray(sub_id)) {
        sub_id = sub_id.shift();
    }
    if (sub_id === undefined || isNaN(sub_id)) {
        return new Error("Missing subscription identifier");
    }

    let offsetProp = packet.properties?.userProperties?.offset;
    if (Array.isArray(offsetProp)) {
        offsetProp = offsetProp.shift();
    }
    const offset = offsetProp ? parseInt(offsetProp) : undefined;
    if (offset === undefined || isNaN(offset)) {
        return new Error("Missing offset");
    }

    return {
        cmd: "message",
        sub_id,
        topic,
        offset,
        message,
    };
}