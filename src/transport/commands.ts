
export type Subscribe = {
    cmd: 'subscribe';
    sub_id: number;
    topic: string;
    offset?: number;
    callback: (message: IncomingMessage | SubError) => void;
};

export type Unsubscribe = {
    cmd: 'unsubscribe';
    sub_id: number;
};

export type IncomingMessage = {
    cmd: 'message';
    sub_id: number;
    topic: string;
    offset: number;
    message: Buffer;
};

export type SubError = {
    cmd: 'sub_error';
    sub_id: number;
    error: SubErrorResponse|Error;
};

export type SubErrorResponse = {
    reason_code: number;
};