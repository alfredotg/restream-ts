import { MPSCStream } from "../sync/mpsc";
import { CancelableStream } from "../sync/types";
import { IncomingMessage, SubError, Subscribe } from "../transport/commands";
import { ITransport } from "../transport/transport";

interface ISubscribeOptions {
    offset?: number;
    recoverable?: boolean;
    immediately?: boolean; // Don't wait for connection to be established
}

export class Subscriber {
    public constructor(private readonly transport: ITransport) {}

    public async subscribe(
        topic: string,
        options?: ISubscribeOptions,
    ): Promise<CancelableStream<IncomingMessage | SubError> | SubError> {
        let subId: number | null = null;

        const stream = new MPSCStream<IncomingMessage | SubError>(() => {
            if (subId !== null) {
                this.transport.unsubscribe({
                    cmd: "unsubscribe",
                    sub_id: subId,
                });
                subId = null;
            }
        });

        if (!options?.immediately) {
            await this.transport.waitConnected();
        }

        return new Promise((resolve) => {
            const cmd: Subscribe = {
                cmd: "subscribe",
                topic: topic,
                offset: options?.offset,
                recoverable: options?.recoverable,
                suback: (result) => {
                    if (result instanceof SubError) {
                        resolve(result);
                    } else {
                        resolve(stream);
                    }
                },
                callback: (message) => {
                    stream.push(message);
                },
            };

            subId = this.transport.subscribe(cmd);
        });
    }
}
