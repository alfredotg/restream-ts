import { CancelableStream } from "../sync/types";
import { IncomingMessage, SubError } from "../transport/commands";
import { ITransport } from "../transport/transport";
export interface ISubscribeOptions {
    offset?: number;
    recoverable?: boolean;
    immediately?: boolean;
}
export declare class Subscriber {
    private readonly transport;
    constructor(transport: ITransport);
    subscribe(topic: string, options?: ISubscribeOptions): Promise<CancelableStream<IncomingMessage | SubError> | SubError>;
}
