import { MPSCStream } from "./mpsc";
import { CancelableStream } from "./types";

export class Watch<T> {
    private readonly listeners: MPSCStream<T>[] = [];

    constructor(private value: T) {}

    public set(value: T): number {
        this.value = value;

        for (const listener of this.listeners) {
            listener.clear();
            listener.push(value);
        }
        return this.listeners.length;
    }

    public subscribe(): CancelableStream<T> {
        const listener = new MPSCStream<T>(() => {
            this.unsubscribe(listener);
        });
        listener.push(this.value);
        this.listeners.push(listener);
        return listener;
    }

    public listenersLength(): number {
        return this.listeners.length;
    }

    private unsubscribe(listener: MPSCStream<T>): void {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }
}
