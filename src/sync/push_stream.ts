import { CancebleStream } from "./types";

export class PushStream<T> implements CancebleStream<T> {
    private events: T[] = [];
    private resolve: () => void = () => {};
    private promise: Promise<void>|null = null;
    private on_cancel?: () => void;

    public readonly stream: AsyncGenerator<T>;

    constructor(on_cancel?: () => void) {
        this.on_cancel = on_cancel;
        this.promise = new Promise<void>((r) => this.resolve = r);
        
        this.stream = (async function* (self: PushStream<T>) {
            while (self.promise !== null) {
                await self.promise;
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
        if (this.promise === null) {
            return false;
        }
        this.events.push(value);
        const resolve = this.resolve;
        this.promise = new Promise<void>((r) => this.resolve = r);
        resolve();
        return true;
    }

    public cancel(): void {
        this.promise = null;
        this.resolve();
        if (this.on_cancel) {
            this.on_cancel();
        }
    }
}