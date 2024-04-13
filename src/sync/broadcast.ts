import { PushStream } from "./push_stream";
import { CancebleStream } from "./types";

export class BroadCast<T> {
    private listeners: PushStream<T>[] = [];

    constructor() {
    }

    public broadcast(value: T): number {
        for (const listener of this.listeners) {
            listener.push(value);
        }
        return this.listeners.length;
    }

    public subscribe(): CancebleStream<T> {
        const listener = new PushStream<T>(() => {
            this.unsubscribe(listener);
        });
        this.listeners.push(listener);
        return listener;
    }

    private unsubscribe(listener: PushStream<T>): void {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }
}