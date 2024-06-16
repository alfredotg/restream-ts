import { CancelableStream } from "./types";
export declare class BroadCast<T> {
    private listeners;
    constructor();
    broadcast(value: T): number;
    subscribe(): CancelableStream<T>;
    private unsubscribe;
}
