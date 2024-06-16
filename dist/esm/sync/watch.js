import { MPSCStream } from "./mpsc";
export class Watch {
    constructor(value) {
        this.value = value;
        this.listeners = [];
    }
    set(value) {
        this.value = value;
        for (const listener of this.listeners) {
            listener.clear();
            listener.push(value);
        }
        return this.listeners.length;
    }
    subscribe() {
        const listener = new MPSCStream(() => {
            this.unsubscribe(listener);
        });
        listener.push(this.value);
        this.listeners.push(listener);
        return listener;
    }
    listenersLength() {
        return this.listeners.length;
    }
    unsubscribe(listener) {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }
}
//# sourceMappingURL=watch.js.map