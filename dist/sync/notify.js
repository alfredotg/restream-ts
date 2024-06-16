"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notify = void 0;
class Notify {
    constructor() {
        this.resolve = () => { };
        this.promise = new Promise((r) => (this.resolve = r));
    }
    async notified() {
        await this.promise;
    }
    notify() {
        const resolve = this.resolve;
        this.promise = new Promise((r) => (this.resolve = r));
        resolve();
    }
}
exports.Notify = Notify;
//# sourceMappingURL=notify.js.map