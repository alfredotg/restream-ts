/// <reference types="node" />
import { CreateSubscriptionErrorReason } from "@/api";
export type Subscribe = {
    cmd: "subscribe";
    topic: string;
    offset?: number;
    recoverable?: boolean;
    suback?: (result: SubAck | SubError) => void;
    callback: (message: IncomingMessage | SubError) => void;
};
export type SubAck = {
    cmd: "sub_ack";
};
export type Unsubscribe = {
    cmd: "unsubscribe";
    sub_id: number;
};
export type IncomingMessage = {
    cmd: "message";
    sub_id: number;
    topic: string;
    offset: number;
    message: Buffer;
};
export declare class SubError {
    error: SubErrorResponse | Error;
    constructor(error: SubErrorResponse | Error);
}
export declare class SubErrorResponse {
    reason_code: CreateSubscriptionErrorReason;
    message: string;
    constructor(reason_code: CreateSubscriptionErrorReason, message: string);
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
/**
 * Transport level error
 * e.g. connection error, incorrect message format, permission denied, etc.
 */
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
