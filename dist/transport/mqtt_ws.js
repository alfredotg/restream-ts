"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttWsTransport = void 0;
const mqtt_1 = __importStar(require("mqtt"));
const commands_1 = require("./commands");
const watch_1 = require("../sync/watch");
const reconnect_1 = require("./reconnect");
const api_1 = require("../api");
const RPC_RESPONSE_TOPIC = "$RS/rpc/response";
const SUB_ID_PROPERTY_NAME = "sub_id";
const OFFSET_PROPERTY_NAME = "offset";
const RECOVERABLE_SUB_PROPERTY_NAME = "recoverable";
const CONN_ACK_REASON_NOT_AUTHORIZED = 135;
class MqttWsTransport {
    constructor(options) {
        this.rpcId = 0;
        this.subId = 0;
        this.rpcCallbacks = new Map();
        this.closed = false;
        this.token = null;
        this.subErrorReasons = new Map();
        this.logger = options.logger;
        this.stateBroadcast = new watch_1.Watch({
            cmd: "disconnected",
        });
        this.subscriptions = new Map();
        const reconnectStrategy = options.reconnectStrategy || new reconnect_1.OnceConnectStrategy();
        this.client = mqtt_1.default.connect(options.url, {
            manualConnect: true,
            protocolVersion: 5,
            reconnectPeriod: 0,
            transformWsUrl: (url, options) => {
                if (this.token !== null) {
                    options.username = this.token;
                }
                return url;
            },
            log: this.logger && options.debug
                ? (...args) => this.logger?.debug(args)
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
                if (packet.cmd === "suback" &&
                    packet.granted.length !== 0 &&
                    packet.granted[0] !== 0) {
                    let subIdProperty = packet.properties?.userProperties?.sub_id;
                    if (Array.isArray(subIdProperty)) {
                        subIdProperty = subIdProperty.shift();
                    }
                    if (!subIdProperty) {
                        return;
                    }
                    const subId = parseInt(subIdProperty, 10);
                    const reason = parseReasonString(packet.properties?.reasonString || "");
                    if (reason) {
                        this.subErrorReasons.set(subId, reason);
                    }
                    else {
                        this.logger?.error("Failed to parse reason string", packet.properties?.reasonString);
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
                    this.onConnect();
                    if (!resolved) {
                        resolved = true;
                        resolve();
                    }
                });
                this.client.once("disconnect", () => {
                    this.onDisconnect();
                    if (!resolved) {
                        resolved = true;
                        reject(new Error("Disconnected"));
                    }
                });
                this.client.on("error", (err) => {
                    if (err instanceof mqtt_1.ErrorWithReasonCode) {
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
    async waitConnected() {
        for await (const value of this.state().stream) {
            if (value.cmd === "connected") {
                break;
            }
        }
    }
    publish(command) {
        const opts = {
            qos: command.callback ? 1 : 0,
        };
        this.client.publish(command.topic, command.message, opts, (transportError, packet) => {
            let error = undefined;
            if (transportError) {
                error = new commands_1.PubError(transportError);
            }
            if (packet?.cmd == "puback" && packet.reasonCode !== 0) {
                if (error === undefined ||
                    packet.properties?.reasonString) {
                    error = new commands_1.PubError({
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
    async close() {
        return new Promise((resolve) => {
            if (this.closed) {
                return resolve();
            }
            this.closed = true;
            this.client.end(() => resolve());
        });
    }
    state() {
        return this.stateBroadcast.subscribe();
    }
    sub_count() {
        return this.subscriptions.size;
    }
    subscribe(command) {
        this.subId++;
        const subId = this.subId;
        this.subscriptions.set(subId, command);
        const options = {
            qos: 1,
            properties: {
                subscriptionIdentifier: subId,
            },
        };
        const userProperties = {};
        if (command.offset !== undefined) {
            userProperties[OFFSET_PROPERTY_NAME] = command.offset.toString();
        }
        if (command.recoverable) {
            userProperties[RECOVERABLE_SUB_PROPERTY_NAME] = "1";
        }
        if (Object.keys(userProperties).length > 0) {
            options.properties.userProperties = userProperties;
        }
        this.client.subscribe(command.topic, options, (err, subs) => {
            const reasonResponse = this.subErrorReasons.get(subId);
            this.subErrorReasons.delete(subId);
            if (subs) {
                const sub = subs.shift();
                if (sub && sub.qos & 0x80) {
                    if (!err) {
                        err = new Error("Failed to subscribe, code: " + sub.qos);
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
                this.callback(() => command.suback &&
                    command.suback(new commands_1.SubError(reasonResponse || err)));
            }
            else {
                this.callback(() => command.suback &&
                    command.suback({
                        cmd: "sub_ack",
                    }));
            }
        });
        return subId;
    }
    unsubscribe(command) {
        const sub = this.subscriptions.get(command.sub_id);
        if (sub === undefined) {
            return;
        }
        this.subscriptions.delete(command.sub_id);
        const opts = {
            qos: 0,
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
    call_rpc(command) {
        const rpc_id = this.rpcId++;
        this.rpcCallbacks.set(rpc_id, command.callback);
        const opts = {
            qos: 1,
            properties: {
                responseTopic: RPC_RESPONSE_TOPIC,
                correlationData: Buffer.from(rpc_id.toString()),
            },
        };
        this.client.publish("$RS/rpc/" + command.method, command.payload, opts, (err) => {
            if (err) {
                this.logger?.error(err);
                this.onRpcError(rpc_id, err);
            }
        });
    }
    onRpcError(rpc_id, err) {
        const callback = this.rpcCallbacks.get(rpc_id);
        if (callback) {
            this.rpcCallbacks.delete(rpc_id);
            this.callback(() => callback(new commands_1.CallRpcError(err)));
        }
    }
    onRpcResponse(body, packet) {
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
            }
            else if (status === "500") {
                this.logger?.warn("Rpc error", message);
                this.callback(() => callback(new commands_1.CallRpcError(new Error(message || "Internal server error"))));
            }
            else {
                this.logger?.error("Invalid status", statusHeader);
                this.callback(() => callback(new commands_1.CallRpcError(new Error("Invalid status"))));
            }
        }
    }
    onConnect() {
        this.stateBroadcast.set({ cmd: "connected" });
    }
    onDisconnect() {
        this.client.removeAllListeners();
        const subscriptions = this.subscriptions;
        this.subscriptions = new Map();
        for (const sub of subscriptions.values()) {
            this.callback(() => sub.callback(new commands_1.SubError(new Error("Disconnected"))));
        }
        const rpcCallbacks = this.rpcCallbacks;
        this.rpcCallbacks = new Map();
        for (const callback of rpcCallbacks.values()) {
            this.callback(() => callback(new commands_1.CallRpcError(new Error("Disconnected"))));
        }
        if (this.closed) {
            this.stateBroadcast.set({ cmd: "closed" });
        }
        else {
            this.stateBroadcast.set({ cmd: "disconnected" });
        }
    }
    onMessage(receivedTopic, body, packet) {
        if (packet.cmd === "publish") {
            if (receivedTopic === RPC_RESPONSE_TOPIC) {
                this.onRpcResponse(body, packet);
            }
            else {
                this.onSubscriptionMessage(receivedTopic, body, packet);
            }
        }
    }
    onSubscriptionMessage(receivedTopic, body, packet) {
        const maybe_message = parseMessage(receivedTopic, body, packet);
        if (maybe_message instanceof Error) {
            this.logger?.error(maybe_message);
            return;
        }
        const message = maybe_message;
        const sub = this.subscriptions.get(message.sub_id);
        if (sub !== undefined) {
            if (!this.callback(() => sub.callback(message))) {
                this.subscriptions.delete(message.sub_id);
            }
        }
    }
    callback(callback) {
        try {
            callback();
            return true;
        }
        catch (e) {
            this.logger?.error("Callback error", e);
        }
        return false;
    }
}
exports.MqttWsTransport = MqttWsTransport;
function parseMessage(topic, message, packet) {
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
function parseReasonString(reasonString) {
    const parts = reasonString.split(" ");
    const code = parts.shift();
    const message = parts.join(" ");
    if ((0, api_1.instanceOfCreateSubscriptionErrorReason)(code)) {
        return new commands_1.SubErrorResponse((0, api_1.CreateSubscriptionErrorReasonFromJSON)(code), message);
    }
    return null;
}
//# sourceMappingURL=mqtt_ws.js.map