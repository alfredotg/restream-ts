import { Clock, IClockInterface } from "./clock";

export interface IDelay {
    success(): void;
    fail(): Promise<void>;
    retry(): Promise<boolean>;
    reset(): void;
}

export class ExponentialDelay implements IDelay {
    private wakeUp: () => void = () => {};
    private readonly maxDelay: number;
    private readonly backoff: number;
    private retries: number = 0;
    private connectedAt: number = -1;

    public constructor(
        backoffMs: number = 600,
        maxDelayMs: number = -1,
        private readonly maxRetries: number = -1,
        private clock: IClockInterface = new Clock(),
    ) {
        this.maxDelay = maxDelayMs;
        this.backoff = backoffMs;
    }

    public success(): void {
        this.connectedAt = this.clock.now();
    }

    public async retry(): Promise<boolean> {
        if (!this.canRetry()) {
            return false;
        }
        if (this.connectedAt >= 0) {
            if (this.clock.now() - this.connectedAt > this.backoff) {
                this.retries = 0;
            } else {
                await this.clock.sleep(this.backoff);
            }
        }
        return true;
    }

    private canRetry(): boolean {
        return this.retries < this.maxRetries || this.maxRetries < 0;
    }

    public reset(): void {
        this.retries = 0;
        this.wakeUp();
    }

    public async fail(): Promise<void> {
        this.retries++;
        let delay = this.backoff * Math.pow(2, this.retries);
        if (this.maxDelay > 0) {
            delay = Math.min(this.maxDelay, delay);
        }
        await new Promise<void>((resolve) => {
            this.wakeUp = resolve;
            this.clock.sleep(delay).then(resolve);
        });
    }
}
