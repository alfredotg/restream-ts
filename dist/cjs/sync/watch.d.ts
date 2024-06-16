import { CancelableStream } from "./types";
export declare class Watch<T> {
    private value;
    private readonly listeners;
    constructor(value: T);
    set(value: T): number;
    subscribe(): CancelableStream<T>;
    listenersLength(): number;
    private unsubscribe;
}
