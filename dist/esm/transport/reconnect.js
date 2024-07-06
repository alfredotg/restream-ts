import { Clock } from "../time/clock";
import { ExponentialDelay } from "../time/delay";
export class OnceConnectStrategy {
    async run(state, connect) {
        for await (const value of state.stream) {
            if (value.cmd !== "disconnected") {
                continue;
            }
            await connect();
            break;
        }
    }
}
export class ExponentialReconnectStrategy {
    constructor(backoffMs = 600, maxDelayMs = -1, maxRetries = -1, clock = new Clock()) {
        this.delay = new ExponentialDelay(backoffMs, maxDelayMs, maxRetries, clock);
    }
    async run(state, connect) {
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
                }
                catch (e) {
                    await this.delay.fail();
                }
            }
        }
    }
    reset() {
        this.delay.reset();
    }
}
//# sourceMappingURL=reconnect.js.map