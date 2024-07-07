"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoverableStream = void 0;
const mpsc_1 = require("../sync/mpsc");
const __1 = require("..");
const api_1 = require("../api");
const commands_1 = require("../transport/commands");
class RecoverableStream {
    constructor(subscriber, retryDelay, topic, offset, logger) {
        this.subscriber = subscriber;
        this.retryDelay = retryDelay;
        this.topic = topic;
        this.offset = offset;
        this.logger = logger;
        this.currentStream = null;
        this.mpcs = new mpsc_1.MPSCStream(() => {
            this.unsubscribe();
        });
        this.mpcsError = new mpsc_1.MPSCStream();
        this.start();
    }
    unsubscribe() {
        this.currentStream?.cancel();
    }
    get stream() {
        return this.mpcs;
    }
    get errorStream() {
        return this.mpcsError;
    }
    async start() {
        while (!this.mpcs.isClosed()) {
            try {
                await this.process();
            }
            catch (e) {
                this.logger?.error(e);
                if (e instanceof Error) {
                    this.mpcsError.push(e);
                }
            }
            finally {
                this.currentStream?.cancel();
                this.currentStream = null;
            }
            if (!this.mpcs.isClosed()) {
                await this.retryDelay.fail();
            }
        }
    }
    async process() {
        if (!(await this.retryDelay.retry())) {
            this.mpcs.cancel();
            return;
        }
        const res = await this.subscriber.subscribe(this.topic, {
            offset: this.offset,
            recoverable: true,
            immediately: false,
        });
        if (res instanceof commands_1.CreateSubscriptionError) {
            if (res.error instanceof Error) {
                throw res.error;
            }
            switch (res.error.reason_code) {
                case api_1.CreateSubscriptionErrorReason.LimitExceeded:
                case api_1.CreateSubscriptionErrorReason.Unauthorized:
                case api_1.CreateSubscriptionErrorReason.NotFound:
                case api_1.CreateSubscriptionErrorReason.InvalidOffset:
                case api_1.CreateSubscriptionErrorReason.InvalidTopic:
                    this.mpcs.push(new __1.SubError(new Error("Failed to create subscription: " +
                        res.error.message)));
                    this.mpcs.cancel();
                    break;
                case api_1.CreateSubscriptionErrorReason.InternalError:
                case api_1.CreateSubscriptionErrorReason.Unspecified:
                    break;
            }
            this.mpcsError.push(res);
            this.logger?.error(res.error);
            return;
        }
        this.retryDelay.success();
        this.currentStream = res;
        for await (const value of res.stream) {
            if (this.mpcs.isClosed()) {
                break;
            }
            if (!(value instanceof __1.SubError)) {
                if (this.offset !== undefined && this.offset >= value.offset) {
                    continue;
                }
                this.offset = value.offset;
                this.mpcs.push(value);
                continue;
            }
            if (value.error instanceof commands_1.SubErrorResponse) {
                switch (value.error.reason_code) {
                    case api_1.SubscriptionErrorReason.Lagging:
                        this.mpcs.push(value);
                        this.mpcs.cancel();
                        break;
                    case api_1.SubscriptionErrorReason.Unspecified:
                        break;
                }
            }
            this.mpcsError.push(value);
            break;
        }
    }
}
exports.RecoverableStream = RecoverableStream;
//# sourceMappingURL=recoverable_stream.js.map