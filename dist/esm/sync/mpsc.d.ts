import { CancelableStream } from "./types";
export declare class MPSCStream<T> implements CancelableStream<T> {
    private events;
    private notify;
    private on_cancel?;
    readonly stream: AsyncGenerator<T>;
    constructor(on_cancel?: () => void);
    clear(): void;
    push(value: T): boolean;
    cancel(): void;
    isClosed(): boolean;
    private callOnCancel;
}
