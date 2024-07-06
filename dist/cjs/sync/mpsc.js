"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MPSCStream = void 0;
const notify_1 = require("./notify");
const denque_1 = __importDefault(require("denque"));
class MPSCStream {
    constructor(on_cancel) {
        this.events = new denque_1.default();
        this.notify = null;
        this.on_cancel = on_cancel;
        this.notify = new notify_1.Notify();
        this.stream = (async function* (self) {
            try {
                while (self.notify !== null || self.events.length > 0) {
                    while (true) {
                        const value = self.events.shift();
                        if (value === undefined) {
                            break;
                        }
                        yield value;
                    }
                    const notified = self.notify?.notified();
                    if (notified !== null) {
                        await notified;
                    }
                }
            }
            finally {
                self.callOnCancel();
            }
        })(this);
    }
    clear() {
        this.events.clear();
    }
    push(value) {
        if (this.notify === null) {
            return false;
        }
        this.events.push(value);
        this.notify.notify();
        return true;
    }
    cancel() {
        const notify = this.notify;
        if (notify === null) {
            return;
        }
        this.notify = null;
        notify.notify();
        this.callOnCancel();
    }
    isClosed() {
        return this.notify === null;
    }
    callOnCancel() {
        const on_cancel = this.on_cancel;
        this.on_cancel = undefined;
        if (on_cancel) {
            on_cancel();
        }
    }
}
exports.MPSCStream = MPSCStream;
//# sourceMappingURL=mpsc.js.map