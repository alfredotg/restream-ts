"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExponentialDelay = void 0;
const clock_1 = require("./clock");
class ExponentialDelay {
    constructor(backoffMs = 600, maxDelayMs = -1, maxRetries = -1, clock = new clock_1.Clock()) {
        this.maxRetries = maxRetries;
        this.clock = clock;
        this.wakeUp = () => { };
        this.retries = 0;
        this.connectedAt = -1;
        this.maxDelay = maxDelayMs;
        this.backoff = backoffMs;
    }
    success() {
        this.connectedAt = this.clock.now();
    }
    async retry() {
        if (!this.canRetry()) {
            return false;
        }
        if (this.connectedAt >= 0) {
            if (this.clock.now() - this.connectedAt > this.backoff) {
                this.retries = 0;
            }
            else {
                await this.clock.sleep(this.backoff);
            }
        }
        return true;
    }
    canRetry() {
        return this.retries < this.maxRetries || this.maxRetries < 0;
    }
    reset() {
        this.retries = 0;
        this.wakeUp();
    }
    async fail() {
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
exports.ExponentialDelay = ExponentialDelay;
//# sourceMappingURL=delay.js.map