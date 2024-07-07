import mqtt from "mqtt";
import { Logger, ILogObj } from "tslog";
import { QoS, UserProperties } from "mqtt-packet";
import {
    Subscribe,
    Unsubscribe,
    IncomingMessage,
    CallRpc,
    CallRpcError,
    Publish,
    PubError,
    SubError,
    SubErrorResponse,
    CreateSubscriptionError,
    CreateSubscriptionErrorResponse,
} from "./commands";
import { ConnectionState } from "./connection_state";
import { CancelableStream } from "@/sync/types";
import { ITransport } from "./transport";
import { Watch } from "@/sync/watch";
import { IReconnectStrategy, OnceConnectStrategy } from "./reconnect";
import {
    CreateSubscriptionErrorReasonFromJSON,
    instanceOfCreateSubscriptionErrorReason,
    MqttProperties,
    SubscriptionErrorReason,
    SubscriptionErrorReasonFromJSON,
} from "@/api";

export type MqttWsTransportOptions = {
    url: string;
    logger?: Logger<ILogObj>;
    debug?: boolean;
    reconnectStrategy?: IReconnectStrategy;
    tokenRefresh?: () => Promise<string>;
    keepaliveSeconds?: number;
};

const SYS_ERROR_TOPIC = "$RS/error";
const RPC_RESPONSE_TOPIC = "$RS/rpc/response";
const SUB_ID_PROPERTY_NAME = "sub_id";
const OFFSET_PROPERTY_NAME = "offset";
const RECOVERABLE_SUB_PROPERTY_NAME = "recoverable";
const CONN_ACK_REASON_NOT_AUTHORIZED = 135;

export class MqttWsTransport implements ITransport {
    private client: mqtt.MqttClient;
    private subscriptions: Map<number, Subscribe>;
    private logger?: Logger<ILogObj>;
    private stateBroadcast: Watch<ConnectionState>;
    private rpcId = 0;
    private subId = 0;
    private rpcCallbacks: Map<
        number,
        (response: Buffer | CallRpcError) => void
    > = new Map();
    private closed = false;
    private token: string | null = null;
    private subErrorReasons: Map<number, CreateSubscriptionErrorResponse> =
        new Map();

    constructor(options: MqttWsTransportOptions) {
        this.logger = options.logger;
        this.stateBroadcast = new Watch<ConnectionState>({
            cmd: "disconnected",
        });
        this.subscriptions = new Map();

        const reconnectStrategy =
            options.reconnectStrategy || new OnceConnectStrategy();

        this.client = mqtt.connect(options.url, {
            manualConnect: true,
            protocolVersion: 5,
            reconnectPeriod: 0,
            keepalive: options.keepaliveSeconds || 15,
            transformWsUrl: (url, options) => {
                if (this.token !== null) {
                    options.username = this.token;
                }
                return url;
            },
            log:
                this.logger && options.debug
                    ? (...args: any[]) => this.logger?.debug(args) // eslint-disable-line @typescript-eslint/no-explicit-any
                    : undefined,
        });

        reconnectStrategy
            .run(this.state(), async () => {
                let resolved = false;

                this.client.removeAllListeners();
                this.subErrorReasons = new Map();

                this.client.on("message", (receivedTopic, message, packet) => {
                    this.onMessage(receivedTopic, message, packet);
                });

                this.client.on("packetreceive", (packet) => {
                    if (
                        packet.cmd === "suback" &&
                        packet.granted.length !== 0 &&
                        packet.granted[0] !== 0
                    ) {
                        let subIdProperty =
                            packet.properties?.userProperties?.sub_id;
                        if (Array.isArray(subIdProperty)) {
                            subIdProperty = subIdProperty.shift();
                        }
                        if (!subIdProperty) {
                            return;
                        }
                        const subId = parseInt(subIdProperty, 10);
                        const reason = parseReasonString(
                            packet.properties?.reasonString || "",
                        );
                        if (reason) {
                            this.subErrorReasons.set(subId, reason);
                        } else {
                            this.logger?.error(
                                "Failed to parse reason string",
                                packet.properties?.reasonString,
                            );
                        }
                    }
                });

                if (this.token === null && options.tokenRefresh) {
                    this.token = await options.tokenRefresh();
                }

                return await new Promise((resolve, reject) => {
                    if (this.closed) {
                        return;
                    }

                    this.client.once("connect", () => {
                        this.logger?.info("connected");

                        this.onConnect();

                        if (!resolved) {
                            resolved = true;
                            resolve();
                        }
                    });

                    this.client.once("close", () => {
                        this.logger?.info("close");

                        this.onDisconnect();

                        if (!resolved) {
                            resolved = true;
                            reject(new Error("Disconnected"));
                        }
                    });

                    this.client.on("error", (err) => {
                        if (err instanceof mqtt.ErrorWithReasonCode) {
                            if (err.code == CONN_ACK_REASON_NOT_AUTHORIZED) {
                                this.token = null;
                            }
                        }

                        this.logger?.error(err);

                        if (!resolved) {
                            resolved = true;
                            reject(err);
                        }
                    });

                    this.logger?.info("Connecting to", options.url);

                    this.client.connect();
                });
            })
            .catch((err) => {
                this.logger?.error(err);
            });
    }

    async waitConnected(): Promise<void> {
        for await (const value of this.state().stream) {
            if (value.cmd === "connected") {
                break;
            }
        }
    }

    publish(command: Publish): void {
        const opts: mqtt.IClientPublishOptions = {
            qos: command.callback ? 1 : (0 as QoS),
        };
        this.client.publish(
            command.topic,
            command.message,
            opts,
            (transportError, packet) => {
                let error: PubError | undefined = undefined;

                if (transportError) {
                    error = new PubError(transportError);
                }

                if (packet?.cmd == "puback" && packet.reasonCode !== 0) {
                    if (
                        error === undefined ||
                        packet.properties?.reasonString
                    ) {
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
            },
        );
    }

    public async close(): Promise<void> {
        return new Promise((resolve) => {
            if (this.closed) {
                return resolve();
            }
            this.closed = true;
            this.client.end(() => resolve());
        });
    }

    public state(): CancelableStream<ConnectionState> {
        return this.stateBroadcast.subscribe();
    }

    public subCount(): number {
        return this.subscriptions.size;
    }

    public subscribe(command: Subscribe): number {
        this.subId++;
        const subId = this.subId;

        this.subscriptions.set(subId, command);

        const options: mqtt.IClientSubscribeOptions = {
            qos: 1 as QoS,
            properties: {
                subscriptionIdentifier: subId,
            },
        };

        const userProperties: UserProperties = {};

        if (command.offset !== undefined) {
            userProperties[OFFSET_PROPERTY_NAME] = command.offset.toString();
        }

        if (command.recoverable) {
            userProperties[RECOVERABLE_SUB_PROPERTY_NAME] = "1";
        }

        if (Object.keys(userProperties).length > 0) {
            options.properties!.userProperties = userProperties;
        }

        this.client.subscribe(command.topic, options, (err, subs) => {
            const reasonResponse = this.subErrorReasons.get(subId);
            this.subErrorReasons.delete(subId);

            if (subs) {
                const sub = subs.shift();
                if (sub && sub.qos & 0x80) {
                    if (!err) {
                        err = new Error(
                            "Failed to subscribe, code: " + sub.qos,
                        );
                    }
                }
            }

            const sub = this.subscriptions.get(subId);
            if (sub !== command) {
                return;
            }

            if (err) {
                this.logger?.error("Subscribe error", err, reasonResponse);
                this.subscriptions.delete(subId);

                this.callback(
                    () =>
                        command.suback &&
                        command.suback(
                            new CreateSubscriptionError(reasonResponse || err),
                        ),
                );
            } else {
                this.callback(
                    () =>
                        command.suback &&
                        command.suback({
                            cmd: "sub_ack",
                        }),
                );
            }
        });

        return subId;
    }

    public unsubscribe(command: Unsubscribe): void {
        const sub = this.subscriptions.get(command.sub_id);
        if (sub === undefined) {
            return;
        }
        this.subscriptions.delete(command.sub_id);

        const opts: mqtt.IClientSubscribeOptions = {
            qos: 0 as QoS,
            properties: {
                userProperties: {
                    [SUB_ID_PROPERTY_NAME]: command.sub_id.toString(),
                },
            },
        };

        this.client.unsubscribe(sub.topic, opts, (err) => {
            if (err) {
                this.logger?.error(err);
            }
        });
    }

    public callRpc(command: CallRpc): void {
        const rpc_id = this.rpcId++;
        this.rpcCallbacks.set(rpc_id, command.callback);

        const opts: mqtt.IClientPublishOptions = {
            qos: 1 as QoS,
            properties: {
                responseTopic: RPC_RESPONSE_TOPIC,
                correlationData: Buffer.from(rpc_id.toString()),
            },
        };
        this.client.publish(
            "$RS/rpc/" + command.method,
            command.payload,
            opts,
            (err) => {
                if (err) {
                    this.logger?.error(err);
                    this.onRpcError(rpc_id, err);
                }
            },
        );
    }

    private onRpcError(rpc_id: number, err: Error) {
        const callback = this.rpcCallbacks.get(rpc_id);
        if (callback) {
            this.rpcCallbacks.delete(rpc_id);
            this.callback(() => callback(new CallRpcError(err)));
        }
    }

    private onRpcResponse(body: Buffer, packet: mqtt.IPublishPacket) {
        const rpc_id = parseInt(
            packet.properties?.correlationData?.toString() || "",
        );
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

                this.callback(() =>
                    callback(
                        new CallRpcError(
                            new Error(message || "Internal server error"),
                        ),
                    ),
                );
            } else {
                this.logger?.error("Invalid status", statusHeader);

                this.callback(() =>
                    callback(new CallRpcError(new Error("Invalid status"))),
                );
            }
        }
    }

    private onConnect() {
        this.stateBroadcast.set({ cmd: "connected" });
    }

    private onDisconnect() {
        this.client.removeAllListeners();

        const subscriptions = this.subscriptions;
        this.subscriptions = new Map();
        for (const sub of subscriptions.values()) {
            this.callback(() => {
                sub.callback(new SubError(new Error("Disconnected")));
            });
        }

        const rpcCallbacks = this.rpcCallbacks;
        this.rpcCallbacks = new Map();
        for (const callback of rpcCallbacks.values()) {
            this.callback(() =>
                callback(new CallRpcError(new Error("Disconnected"))),
            );
        }

        if (this.closed) {
            this.stateBroadcast.set({ cmd: "closed" });
        } else {
            this.stateBroadcast.set({ cmd: "disconnected" });
        }
    }

    private onMessage(
        receivedTopic: string,
        body: Buffer,
        packet: mqtt.Packet,
    ) {
        if (packet.cmd === "publish") {
            if (receivedTopic === RPC_RESPONSE_TOPIC) {
                this.onRpcResponse(body, packet);
            } else {
                this.onSubscriptionMessage(receivedTopic, body, packet);
            }
        }
    }

    private onSubscriptionMessage(
        receivedTopic: string,
        body: Buffer,
        packet: mqtt.IPublishPacket,
    ) {
        const maybe_message = parseMessage(receivedTopic, body, packet);
        if (maybe_message instanceof Error) {
            this.logger?.error(maybe_message);
            return;
        }
        const [sub_id, message] = maybe_message;
        const sub = this.subscriptions.get(sub_id);
        if (sub !== undefined) {
            if (!this.callback(() => sub.callback(message))) {
                this.unsubscribe({ cmd: "unsubscribe", sub_id });
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

function parseMessage(
    topic: string,
    message: Buffer,
    packet: mqtt.IPublishPacket,
): [number, IncomingMessage | SubError] | Error {
    let sub_id = packet.properties?.subscriptionIdentifier;
    if (sub_id && Array.isArray(sub_id)) {
        sub_id = sub_id.shift();
    }
    if (sub_id === undefined || isNaN(sub_id)) {
        return new Error("Missing subscription identifier");
    }

    if (topic === SYS_ERROR_TOPIC) {
        let reason: SubscriptionErrorReason =
            SubscriptionErrorReason.Unspecified;
        if (
            packet.properties &&
            packet.properties.userProperties &&
            MqttProperties.ErrorReason in packet.properties.userProperties
        ) {
            reason = SubscriptionErrorReasonFromJSON(
                packet.properties.userProperties[MqttProperties.ErrorReason],
            );
        }

        return [
            sub_id,
            new SubError(new SubErrorResponse(reason, message.toString())),
        ];
    }

    let offsetProp = packet.properties?.userProperties?.offset;
    if (Array.isArray(offsetProp)) {
        offsetProp = offsetProp.shift();
    }
    const offset = offsetProp ? parseInt(offsetProp) : undefined;
    if (offset === undefined || isNaN(offset)) {
        return new Error("Missing offset");
    }

    if (topic === "") {
        return [
            sub_id,
            {
                cmd: "offset_ping",
                offset,
            },
        ];
    }

    return [
        sub_id,
        {
            cmd: "message",
            topic,
            offset,
            message,
        },
    ];
}

function parseReasonString(
    reasonString: string,
): CreateSubscriptionErrorResponse | null {
    const parts = reasonString.split(" ");
    const code = parts.shift();
    const message = parts.join(" ");

    if (instanceOfCreateSubscriptionErrorReason(code)) {
        return new CreateSubscriptionErrorResponse(
            CreateSubscriptionErrorReasonFromJSON(code),
            message,
        );
    }

    return null;
}
