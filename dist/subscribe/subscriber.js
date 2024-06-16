"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscriber = void 0;
const mpsc_1 = require("../sync/mpsc");
const commands_1 = require("../transport/commands");
class Subscriber {
    constructor(transport) {
        this.transport = transport;
    }
    async subscribe(topic, options) {
        let subId = null;
        const stream = new mpsc_1.MPSCStream(() => {
            if (subId !== null) {
                this.transport.unsubscribe({
                    cmd: "unsubscribe",
                    sub_id: subId,
                });
                subId = null;
            }
        });
        if (!(options === null || options === void 0 ? void 0 : options.immediately)) {
            await this.transport.waitConnected();
        }
        return new Promise((resolve) => {
            const cmd = {
                cmd: "subscribe",
                topic: topic,
                offset: options === null || options === void 0 ? void 0 : options.offset,
                recoverable: options === null || options === void 0 ? void 0 : options.recoverable,
                suback: (result) => {
                    if (result instanceof commands_1.SubError) {
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
exports.Subscriber = Subscriber;
