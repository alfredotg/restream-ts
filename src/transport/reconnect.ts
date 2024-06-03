import { CancelableStream } from "../sync/types";
import { Clock, IClockInterface } from "../time/clock";
import { ConnectionState } from "./connection_state";

type ConnectCallback = () => Promise<void>;

export interface IReconnectStrategy {
    run(
        state: CancelableStream<ConnectionState>,
        connect: ConnectCallback,
    ): Promise<void>;
}

export class OnceConnectStrategy implements IReconnectStrategy {
    public async run(
        state: CancelableStream<ConnectionState>,
        connect: ConnectCallback,
    ): Promise<void> {
        for await (const value of state.stream) {
            if (value.cmd !== "disconnected") {
                continue;
            }
            await connect();
            break;
        }
    }
}

export class ExponentialReconnectStrategy implements IReconnectStrategy {
    private readonly maxDelay: number;
    private readonly maxRetries: number;
    private readonly backoff: number;
    private retries: number = 0;
    private wakeUp: () => void = () => {};
    private connectedAt: DOMHighResTimeStamp = -1;
    public clock: IClockInterface = new Clock();

    public constructor(
        backoffMs: number = 600,
        maxDelayMs: number = -1,
        maxRetries: number = -1,
    ) {
        this.maxDelay = maxDelayMs;
        this.maxRetries = maxRetries;
        this.backoff = backoffMs;
    }

    public async run(
        state: CancelableStream<ConnectionState>,
        connect: ConnectCallback,
    ): Promise<void> {
        for await (const value of state.stream) {
            if (value.cmd === "connected") {
                this.connectedAt = this.clock.now();
                continue;
            }

            if (value.cmd === "closed") {
                return;
            }

            if (value.cmd !== "disconnected") {
                continue;
            }

            if (this.connectedAt >= 0) {
                if (this.clock.now() - this.connectedAt > this.backoff) {
                    this.retries = 0;
                } else {
                    this.clock.sleep(this.backoff);
                }
            }

            while (this.retries < this.maxRetries || this.maxRetries < 0) {
                try {
                    await connect();
                    break;
                } catch (e) {
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
        }
    }

    public reset(): void {
        this.retries = 0;
        this.wakeUp();
    }
}
