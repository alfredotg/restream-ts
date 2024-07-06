import { MPSCStream } from "../sync/mpsc";
import { CreateSubscriptionError, } from "../transport/commands";
export class Subscriber {
    constructor(transport) {
        this.transport = transport;
    }
    async subscribe(topic, options) {
        let subId = null;
        const stream = new MPSCStream(() => {
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
            const cmd = {
                cmd: "subscribe",
                topic: topic,
                offset: options?.offset,
                recoverable: options?.recoverable,
                suback: (result) => {
                    if (result instanceof CreateSubscriptionError) {
                        resolve(result);
                    }
                    else {
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
//# sourceMappingURL=subscriber.js.map