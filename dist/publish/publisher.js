"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publisher = void 0;
const commands_1 = require("../transport/commands");
class Publisher {
    constructor(transport) {
        this.transport = transport;
    }
    async publish(topic, message, options) {
        if (!(options === null || options === void 0 ? void 0 : options.immediate)) {
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
            return new commands_1.PubError(new Error("" + error));
        }
    }
}
exports.Publisher = Publisher;
