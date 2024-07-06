"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExponentialReconnectStrategy = exports.OnceConnectStrategy = void 0;
const clock_1 = require("../time/clock");
const delay_1 = require("../time/delay");
class OnceConnectStrategy {
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
exports.OnceConnectStrategy = OnceConnectStrategy;
class ExponentialReconnectStrategy {
    constructor(backoffMs = 600, maxDelayMs = -1, maxRetries = -1, clock = new clock_1.Clock()) {
        this.delay = new delay_1.ExponentialDelay(backoffMs, maxDelayMs, maxRetries, clock);
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
exports.ExponentialReconnectStrategy = ExponentialReconnectStrategy;
//# sourceMappingURL=reconnect.js.map