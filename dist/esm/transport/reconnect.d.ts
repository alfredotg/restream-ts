import { CancelableStream } from "../sync/types";
import { IClockInterface } from "../time/clock";
import { ConnectionState } from "./connection_state";
type ConnectCallback = () => Promise<void>;
export interface IReconnectStrategy {
    run(state: CancelableStream<ConnectionState>, connect: ConnectCallback): Promise<void>;
}
export declare class OnceConnectStrategy implements IReconnectStrategy {
    run(state: CancelableStream<ConnectionState>, connect: ConnectCallback): Promise<void>;
}
export declare class ExponentialReconnectStrategy implements IReconnectStrategy {
    private readonly delay;
    constructor(backoffMs?: number, maxDelayMs?: number, maxRetries?: number, clock?: IClockInterface);
    run(state: CancelableStream<ConnectionState>, connect: ConnectCallback): Promise<void>;
    reset(): void;
}
export {};
