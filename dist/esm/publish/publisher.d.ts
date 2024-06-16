/// <reference types="node" />
import { PubError } from "../transport/commands";
import { ITransport } from "../transport/transport";
interface IPublishOptions {
    immediate?: boolean;
}
export declare class Publisher {
    private readonly transport;
    constructor(transport: ITransport);
    publish(topic: string, message: Buffer, options?: IPublishOptions): Promise<PubError | undefined>;
}
export {};
