import { CancelableStream } from "./../transport/transport";
import { IncomingMessage, SubError, Subscriber } from "..";
import { Logger, ILogObj } from "tslog";
import { IDelay } from "../time/delay";
export declare class RecoverableStream {
    private readonly subscriber;
    private readonly retryDelay;
    private readonly topic;
    private offset?;
    private readonly logger?;
    private readonly mpcs;
    private currentStream;
    constructor(subscriber: Subscriber, retryDelay: IDelay, topic: string, offset?: number | undefined, logger?: Logger<ILogObj> | undefined);
    private unsubscribe;
    get stream(): CancelableStream<IncomingMessage | SubError>;
    private start;
    private process;
}
