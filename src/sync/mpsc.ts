import { CancelableStream } from "./types";
import { Notify } from "./notify";
import Denque from "denque";

export class MPSCStream<T> implements CancelableStream<T> {
    private events: Denque<T> = new Denque<T>();
    private notify: Notify | null = null;
    private on_cancel?: () => void;

    public readonly stream: AsyncGenerator<T>;

    constructor(on_cancel?: () => void) {
        this.on_cancel = on_cancel;
        this.notify = new Notify();

        this.stream = (async function* (self: MPSCStream<T>) {
            try {
                while (self.notify !== null || self.events.length > 0) {
                    while (true) {
                        const value = self.events.shift();
                        if (value === undefined) {
                            break;
                        }
                        yield value;
                    }
                    const notified = self.notify?.notified();
                    if (notified !== null) {
                        await notified;
                    }
                }
            } finally {
                self.callOnCancel();
            }
        })(this);
    }

    public clear(): void {
        this.events.clear();
    }

    public push(value: T): boolean {
        if (this.notify === null) {
            return false;
        }
        this.events.push(value);
        this.notify.notify();
        return true;
    }

    public cancel(): void {
        const notify = this.notify;
        if (notify === null) {
            return;
        }
        this.notify = null;
        notify.notify();
        this.callOnCancel();
    }

    public isClosed(): boolean {
        return this.notify === null;
    }

    private callOnCancel(): void {
        const on_cancel = this.on_cancel;
        this.on_cancel = undefined;
        if (on_cancel) {
            on_cancel();
        }
    }
}
