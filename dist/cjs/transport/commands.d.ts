import { CreateSubscriptionErrorReason, SubscriptionErrorReason } from "../api";
export type Subscribe = {
    cmd: "subscribe";
    topic: string;
    offset?: number;
    recoverable?: boolean;
    suback?: (result: SubAck | CreateSubscriptionError) => void;
    callback: (message: IncomingMessage | SubError) => void;
};
export type SubAck = {
    cmd: "sub_ack";
};
export type Unsubscribe = {
    cmd: "unsubscribe";
    sub_id: number;
};
export type PublishMessage = {
    cmd: "message";
    topic: string;
    offset: number;
    message: Buffer;
};
export type OffsetPing = {
    cmd: "offset_ping";
    offset: number;
};
export type IncomingMessage = PublishMessage | OffsetPing;
export declare class CreateSubscriptionErrorResponse {
    reason_code: CreateSubscriptionErrorReason;
    message: string;
    constructor(reason_code: CreateSubscriptionErrorReason, message: string);
}
export declare class CreateSubscriptionError {
    error: CreateSubscriptionErrorResponse | Error;
    constructor(error: CreateSubscriptionErrorResponse | Error);
}
export declare class SubErrorResponse {
    reason_code: SubscriptionErrorReason;
    message: string;
    constructor(reason_code: SubscriptionErrorReason, message: string);
}
export declare class SubError {
    error: SubErrorResponse | Error;
    constructor(error: SubErrorResponse | Error);
}
export type Publish = {
    cmd: "publish";
    topic: string;
    message: Buffer;
    callback?: (error?: PubError) => void;
};
export declare class PubError {
    error: PubErrorResponse | Error;
    constructor(error: PubErrorResponse | Error);
}
export type PubErrorResponse = {
    reasonCode?: number;
    reasonString?: string;
};
export declare class CallRpcError {
    error: Error;
    constructor(error: Error);
}
export type CallRpc = {
    cmd: "call_rpc";
    method: string;
    payload: Buffer;
    callback: (response: Buffer | CallRpcError) => void;
};
