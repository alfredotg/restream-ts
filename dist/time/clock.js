"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrozenClock = exports.Clock = void 0;
class Clock {
    now() {
        return performance.now();
    }
    async sleep(ms) {
        await new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}
exports.Clock = Clock;
class FrozenClock {
    constructor() {
        this.time = 0;
    }
    now() {
        return this.time;
    }
    async sleep(ms) {
        this.time += ms;
    }
}
exports.FrozenClock = FrozenClock;
