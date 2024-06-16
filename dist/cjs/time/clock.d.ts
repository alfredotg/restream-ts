export interface IClockInterface {
    now(): number;
    sleep(ms: number): Promise<void>;
}
export declare class Clock implements IClockInterface {
    now(): number;
    sleep(ms: number): Promise<void>;
}
export declare class FrozenClock implements IClockInterface {
    time: number;
    now(): number;
    sleep(ms: number): Promise<void>;
}
