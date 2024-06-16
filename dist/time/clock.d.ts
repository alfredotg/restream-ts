export interface IClockInterface {
    now(): DOMHighResTimeStamp;
    sleep(ms: number): Promise<void>;
}
export declare class Clock implements IClockInterface {
    now(): DOMHighResTimeStamp;
    sleep(ms: number): Promise<void>;
}
export declare class FrozenClock implements IClockInterface {
    time: DOMHighResTimeStamp;
    now(): DOMHighResTimeStamp;
    sleep(ms: number): Promise<void>;
}
