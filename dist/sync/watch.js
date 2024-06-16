"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Watch = void 0;
const mpsc_1 = require("./mpsc");
class Watch {
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
        const listener = new mpsc_1.MPSCStream(() => {
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
exports.Watch = Watch;
