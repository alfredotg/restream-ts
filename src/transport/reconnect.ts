import { CancelableStream } from "@/sync/types";
import { Clock, IClockInterface } from "@/time/clock";
import { ConnectionState } from "./connection_state";
import { ExponentialDelay } from "@/time/delay";

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
    private readonly delay: ExponentialDelay;

    public constructor(
        backoffMs: number = 600,
        maxDelayMs: number = -1,
        maxRetries: number = -1,
        clock: IClockInterface = new Clock(),
    ) {
        this.delay = new ExponentialDelay(
            backoffMs,
            maxDelayMs,
            maxRetries,
            clock,
        );
    }

    public async run(
        state: CancelableStream<ConnectionState>,
        connect: ConnectCallback,
    ): Promise<void> {
        for await (const value of state.stream) {
            if (value.cmd === "connected") {
                this.delay.success();
                continue;
            }

            if (value.cmd === "closed") {
                return;
            }

            if (value.cmd !== "disconnected") {
                continue;
            }

            while (await this.delay.retry()) {
                try {
                    await connect();
                    break;
                } catch (e) {
                    await this.delay.fail();
                }
            }
        }
    }

    public reset(): void {
        this.delay.reset();
    }
}
