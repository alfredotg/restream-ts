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
            var _a;
            try {
                while (self.notify !== null || self.events.length > 0) {
                    while (true) {
                        const value = self.events.shift();
                        if (value === undefined) {
                            break;
                        }
                        yield value;
                    }
                    const notified = (_a = self.notify) === null || _a === void 0 ? void 0 : _a.notified();
                    if (notified !== null) {
                        await notified;
                    }
                }
            }
            finally {
                self.call_on_cancel();
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
        this.call_on_cancel();
    }
    call_on_cancel() {
        const on_cancel = this.on_cancel;
        this.on_cancel = undefined;
        if (on_cancel) {
            on_cancel();
        }
    }
}
exports.MPSCStream = MPSCStream;
