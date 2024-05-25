
export class Notify {
    private resolve: () => void = () => {};
    private promise: Promise<void>;

    constructor() {
        this.promise = new Promise<void>((r) => this.resolve = r);
    }

    public async notified(): Promise<void> {
        await this.promise;
    }

    public notify(): void {
        const resolve = this.resolve;
        this.promise = new Promise<void>((r) => this.resolve = r);
        resolve();
    }
}