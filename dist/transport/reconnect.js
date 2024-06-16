import { Clock } from "../time/clock";
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
    constructor(backoffMs = 600, maxDelayMs = -1, maxRetries = -1) {
        this.retries = 0;
        this.wakeUp = () => { };
        this.connectedAt = -1;
        this.clock = new Clock();
        this.maxDelay = maxDelayMs;
        this.maxRetries = maxRetries;
        this.backoff = backoffMs;
    }
    async run(state, connect) {
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
                }
                else {
                    this.clock.sleep(this.backoff);
                }
            }
            while (this.retries < this.maxRetries || this.maxRetries < 0) {
                try {
                    await connect();
                    break;
                }
                catch (e) {
                    this.retries++;
                    let delay = this.backoff * Math.pow(2, this.retries);
                    if (this.maxDelay > 0) {
                        delay = Math.min(this.maxDelay, delay);
                    }
                    await new Promise((resolve) => {
                        this.wakeUp = resolve;
                        this.clock.sleep(delay).then(resolve);
                    });
                }
            }
        }
    }
    reset() {
        this.retries = 0;
        this.wakeUp();
    }
}
//# sourceMappingURL=reconnect.js.map