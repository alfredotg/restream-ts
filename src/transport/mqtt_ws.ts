import mqtt, { IClientPublishOptions, IClientSubscribeOptions } from "mqtt";
import { Logger, ILogObj } from "tslog";
import { QoS } from "mqtt-packet";
import { Subscribe, Unsubscribe, IncomingMessage, CallRpc, CallRpcError, Publish, PubError, SubError } from "./commands";
import { ConnectionState } from "./connection_state";
import { CancebleStream } from "../sync/types";
import { BroadCast } from "../sync/broadcast";
import { ITransport } from "./transport";

export type MqttWsTransportOptions = {
    url: string;
    token?: string;
    logger?: Logger<ILogObj>;
    debug?: boolean;
};

const RPC_RESPONSE_TOPIC = "$RS/rpc/response";

export class MqttWsTransport implements ITransport {
    private client: mqtt.MqttClient;
    private subscribtions: Map<number, Subscribe>;
    private logger?: Logger<ILogObj>;
    private stateBroadcast: BroadCast<ConnectionState>;
    private rpcId = 0;
    private subId = 0;
    private rpcCallbacks: Map<number, (response: Buffer | CallRpcError) => void> = new Map();

    constructor(options: MqttWsTransportOptions) {
        this.logger = options.logger;
        this.stateBroadcast = new BroadCast();
        this.subscribtions = new Map();
        this.client = mqtt.connect(
            options.url,
            {
                protocolVersion: 5,
                reconnectPeriod: 0,
                log: this.logger && options.debug ? (...args: any[]) => this.logger?.debug(args) : undefined,
            },
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

    publish(command: Publish): void {
        const opts: IClientPublishOptions = {
            qos: command.callback ? 1 : 0 as QoS,
        };
        this.client.publish(command.topic, command.message, opts, (trasportError, packet) => {
            let error: PubError | undefined = undefined;

            if (trasportError) {
                error = new PubError(trasportError);
            } 
            
            if (packet?.cmd == 'puback' && packet.reasonCode !== 0) {
                if (error === undefined || packet.properties?.reasonString) {
                    error = new PubError({
                        reasonCode: packet.reasonCode,
                        reasonString: packet.properties?.reasonString,
                    });
                }
            }

            if (error) {
                this.logger?.error(error);
            }

            if (command.callback) {
                command.callback(error);
            }
        });
    }

    public close() {
        this.client.end();
    }

    public state(): CancebleStream<ConnectionState> {
        return this.stateBroadcast.subscribe();
    }

    public subscribe(command: Subscribe): void {
        this.subId++;
        const subId = this.subId;

        this.subscribtions.set(subId, command);
 
        let options : IClientSubscribeOptions = {
            qos: 1 as QoS,
            properties: {
                subscriptionIdentifier: subId,
            },
        };
        if (command.offset !== undefined) {
            const userProperties = {
                "offset": command.offset.toString()
            };
            options.properties!.userProperties = userProperties;
        }

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

            const sub = this.subscribtions.get(subId);
            if (sub !== command) {
                return;
            }

            if (err) {
                this.logger?.error("Subscribe error", err);
                this.subscribtions.delete(subId);
                this.callback(() => command.suback && command.suback(new SubError(reason_code ? { reason_code } : err)));
            } else {
                this.callback(() => command.suback && command.suback({cmd: "sub_ack"}));
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

    public call_rpc(command: CallRpc): void {
        const rpc_id = this.rpcId++;
        this.rpcCallbacks.set(rpc_id, command.callback);

        const opts: IClientPublishOptions = {
            qos: 1 as QoS,
            properties: {
                responseTopic: RPC_RESPONSE_TOPIC,
                correlationData: Buffer.from(rpc_id.toString()),
            }
        };
        this.client.publish("$RS/rpc/" + command.method, command.payload, opts, (err) => {
            if (err) {
                this.logger?.error(err);
                this.onRpcError(rpc_id, err);
            }
        });
    }

    private onRpcError(rpc_id: number, err: Error) {
        const callback = this.rpcCallbacks.get(rpc_id);
        if (callback) {
            this.rpcCallbacks.delete(rpc_id);
            this.callback(() => callback(new CallRpcError(err)));
        }
    }

    private onRpcResponse(body: Buffer, packet: mqtt.IPublishPacket) {
        const rpc_id = parseInt(packet.properties?.correlationData?.toString() || "");
        if (isNaN(rpc_id)) {
            this.logger?.error("Missing rpc id");
            return;
        }

        const callback = this.rpcCallbacks.get(rpc_id);
        if (callback) {
            this.rpcCallbacks.delete(rpc_id);

            let statusHeader = packet.properties?.userProperties?.status;
            if (Array.isArray(statusHeader)) {
                statusHeader = statusHeader.shift();
            }

            const statusParts = statusHeader?.split(" ");
            const status = statusParts?.shift();
            const message = statusParts?.join(" ");

            if (status === "200") {
                this.callback(() => callback(body));
            } else if (status === "500") {
                this.logger?.warn("Rpc error", message);

                this.callback(() => callback(new CallRpcError(new Error(message || "Internal server error"))));
            } else {
                this.logger?.error("Invalid status", statusHeader);

                this.callback(() => callback(new CallRpcError(new Error("Invalid status"))));
            }
        }
    }

    private onConnect() {
        this.stateBroadcast.broadcast({ cmd: "connected" });
    }

    private onDisconnect() {
        this.stateBroadcast.broadcast({ cmd: "disconnected" });

        const subscribtions = this.subscribtions;
        this.subscribtions = new Map();
        for (const sub of subscribtions.values()) {
            this.callback(() => sub.callback(new SubError(new Error("Disconnected"))));
        }
    }

    private onMessage(receivedTopic: string, body: Buffer, packet: mqtt.Packet) {
        if (packet.cmd === "publish") {
            if (receivedTopic === RPC_RESPONSE_TOPIC) {
                this.onRpcResponse(body, packet);
            } else {
                this.onSubscriptionMessage(receivedTopic, body, packet);
            }
        }
    }

    private onSubscriptionMessage(receivedTopic: string, body: Buffer, packet: mqtt.IPublishPacket) {
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