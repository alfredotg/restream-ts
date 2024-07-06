import { CancelableStream } from "../sync/types";
import { CreateSubscriptionError, IncomingMessage, SubError } from "../transport/commands";
import { ITransport } from "../transport/transport";
export interface ISubscribeOptions {
    offset?: number;
    recoverable?: boolean;
    immediately?: boolean;
}
export declare class Subscriber {
    private readonly transport;
    constructor(transport: ITransport);
    subscribe(topic: string, options?: ISubscribeOptions): Promise<CancelableStream<IncomingMessage | SubError> | CreateSubscriptionError>;
}
