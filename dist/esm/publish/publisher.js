import { PubError } from "../transport/commands";
export class Publisher {
    constructor(transport) {
        this.transport = transport;
    }
    async publish(topic, message, options) {
        if (!options?.immediate) {
            await this.transport.waitConnected();
        }
        const promise = new Promise((resolve) => {
            const cmd = {
                cmd: "publish",
                topic: topic,
                message: message,
                callback: resolve,
            };
            this.transport.publish(cmd);
        });
        try {
            await promise;
        }
        catch (error) {
            return new PubError(new Error("" + error));
        }
    }
}
//# sourceMappingURL=publisher.js.map