import { CancebleStream } from "./types";
import { Notify } from "./notify";

export class MPSCStream<T> implements CancebleStream<T> {
    private events: T[] = [];
    private notify: Notify|null = null;
    private on_cancel?: () => void;

    public readonly stream: AsyncGenerator<T>;

    constructor(on_cancel?: () => void) {
        this.on_cancel = on_cancel;
        this.notify = new Notify();

        this.stream = (async function* (self: MPSCStream<T>) {
            while (self.notify !== null) {
                await self.notify.notified();
                while (true) {
                    let value = self.events.shift();
                    if (value === undefined) {
                        break;
                    }
                    yield value;
                }
            }
        })(this);
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
        if (this.on_cancel) {
            this.on_cancel();
        }
    }
}