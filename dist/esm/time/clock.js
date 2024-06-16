export class Clock {
    now() {
        return performance.now();
    }
    async sleep(ms) {
        await new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}
export class FrozenClock {
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
//# sourceMappingURL=clock.js.map