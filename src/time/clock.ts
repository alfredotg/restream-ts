export interface IClockInterface {
    now(): number;
    sleep(ms: number): Promise<void>;
}

export class Clock implements IClockInterface {
    public now(): number {
        return performance.now();
    }

    public async sleep(ms: number): Promise<void> {
        await new Promise<void>((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}

export class FrozenClock implements IClockInterface {
    public time: number = 0;

    public now(): number {
        return this.time;
    }

    public async sleep(ms: number): Promise<void> {
        this.time += ms;
    }
}
