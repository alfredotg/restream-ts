"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadCast = void 0;
const mpsc_1 = require("./mpsc");
class BroadCast {
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
        const listener = new mpsc_1.MPSCStream(() => {
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
exports.BroadCast = BroadCast;
