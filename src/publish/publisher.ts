import { PubError, Publish } from "../transport/commands";
import { ITransport } from "../transport/transport";

interface IPublishOptions {
    immediate?: boolean; // Don't wait for connection to be established
}

export class Publisher {
    constructor(private readonly transport: ITransport) {}

    public async publish(
        topic: string,
        message: Buffer,
        options?: IPublishOptions,
    ): Promise<PubError | undefined> {
        if (!options?.immediate) {
            await this.transport.waitConnected();
        }

        const promise = new Promise<PubError | undefined>((resolve) => {
            const cmd: Publish = {
                cmd: "publish",
                topic: topic,
                message: message,
                callback: resolve,
            };
            this.transport.publish(cmd);
        });

        try {
            await promise;
        } catch (error) {
            return new PubError(new Error("" + error));
        }
    }
}
