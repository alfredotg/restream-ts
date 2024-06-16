import { Notify } from "./notify";
import Denque from "denque";
export class MPSCStream {
    constructor(on_cancel) {
        this.events = new Denque();
        this.notify = null;
        this.on_cancel = on_cancel;
        this.notify = new Notify();
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
//# sourceMappingURL=mpsc.js.map