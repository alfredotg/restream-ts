export interface IClockInterface {
    now(): DOMHighResTimeStamp;
    sleep(ms: number): Promise<void>;
}

export class Clock implements IClockInterface {
    public now(): DOMHighResTimeStamp {
        return performance.now();
    }

    public async sleep(ms: number): Promise<void> {
        await new Promise<void>((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}

export class FrozenClock implements IClockInterface {
    public time: DOMHighResTimeStamp = 0;

    public now(): DOMHighResTimeStamp {
        return this.time;
    }

    public async sleep(ms: number): Promise<void> {
        this.time += ms;
    }
}
