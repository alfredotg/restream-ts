import { MPSCStream } from "./mpsc";
import { CancebleStream } from "./types";

export class BroadCast<T> {
    private listeners: MPSCStream<T>[] = [];

    constructor() {
    }

    public broadcast(value: T): number {
        for (const listener of this.listeners) {
            listener.push(value);
        }
        return this.listeners.length;
    }

    public subscribe(): CancebleStream<T> {
        const listener = new MPSCStream<T>(() => {
            this.unsubscribe(listener);
        });
        this.listeners.push(listener);
        return listener;
    }

    private unsubscribe(listener: MPSCStream<T>): void {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }
}