import { MPSCStream } from "../sync/mpsc";
import { IncomingMessage, SubAck, SubError, Subscribe } from "../transport/commands";
import { ITransport } from "../transport/transport";

export class Subscriber {
    public constructor(
        private readonly transport: ITransport
    ) {
    }

    public subscribe(topic: string, offset?: number): Promise<AsyncGenerator<IncomingMessage | SubError> | SubError> {
        const stream = new MPSCStream<IncomingMessage | SubError>();

        return new Promise((resolve, reject) => {
            const cmd : Subscribe = {
                cmd: 'subscribe',
                topic: topic,
                offset,
                suback: (result) => {
                    if (result instanceof SubError) {
                        resolve(result);
                    } else {
                        resolve(stream.stream);
                    }
                },
                callback: (message) => {
                    stream.push(message);
                }
            };

            this.transport.subscribe(cmd);
        });
    }
}