import { IClockInterface } from "./clock";
export interface IDelay {
    success(): void;
    fail(): Promise<void>;
    retry(): Promise<boolean>;
    reset(): void;
}
export declare class ExponentialDelay implements IDelay {
    private readonly maxRetries;
    private clock;
    private wakeUp;
    private readonly maxDelay;
    private readonly backoff;
    private retries;
    private connectedAt;
    constructor(backoffMs?: number, maxDelayMs?: number, maxRetries?: number, clock?: IClockInterface);
    success(): void;
    retry(): Promise<boolean>;
    private canRetry;
    reset(): void;
    fail(): Promise<void>;
}
