import { CreateSubscriptionErrorReason, SubscriptionErrorReason } from "@/api";

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

export type IncomingMessage = {
    cmd: "message";
    topic: string;
    offset: number;
    message: Buffer;
};

export class CreateSubscriptionErrorResponse {
    public constructor(
        public reason_code: CreateSubscriptionErrorReason,
        public message: string,
    ) {}
}

export class CreateSubscriptionError {
    public constructor(public error: CreateSubscriptionErrorResponse | Error) {}
}

export class SubErrorResponse {
    public constructor(
        public reason_code: SubscriptionErrorReason,
        public message: string,
    ) {}
}

export class SubError {
    public constructor(public error: SubErrorResponse | Error) {}
}

export type Publish = {
    cmd: "publish";
    topic: string;
    message: Buffer;
    callback?: (error?: PubError) => void;
};

export class PubError {
    public constructor(public error: PubErrorResponse | Error) {}
}

export type PubErrorResponse = {
    reasonCode?: number;
    reasonString?: string;
};

/**
 * Transport level error
 * e.g. connection error, incorrect message format, permission denied, etc.
 */
export class CallRpcError {
    public constructor(public error: Error) {}
}

export type CallRpc = {
    cmd: "call_rpc";
    method: string;
    payload: Buffer;
    callback: (response: Buffer | CallRpcError) => void;
};
