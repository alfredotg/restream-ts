export class Notify {
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
//# sourceMappingURL=notify.js.map