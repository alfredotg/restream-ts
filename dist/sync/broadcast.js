import { MPSCStream } from "./mpsc";
export class BroadCast {
    constructor() {
        this.listeners = [];
    }
    broadcast(value) {
        for (const listener of this.listeners) {
            listener.push(value);
        }
        return this.listeners.length;
    }
    subscribe() {
        const listener = new MPSCStream(() => {
            this.unsubscribe(listener);
        });
        this.listeners.push(listener);
        return listener;
    }
    unsubscribe(listener) {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }
}
//# sourceMappingURL=broadcast.js.map