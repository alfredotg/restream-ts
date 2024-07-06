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
        this.start();
    }
    unsubscribe() {
        this.currentStream?.cancel();
    }
    get stream() {
        return this.mpcs;
    }
    async start() {
        while (!this.mpcs.isClosed()) {
            try {
                await this.process();
            }
            catch (e) {
                this.logger?.error(e);
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
            this.logger?.error(res.error);
            return;
        }
        this.retryDelay.success();
        this.currentStream = res;
        for await (const value of res.stream) {
            if (!(value instanceof __1.SubError)) {
                if (this.offset === undefined || this.offset >= value.offset) {
                    continue;
                }
                this.offset = value.offset;
                this.mpcs.push(value);
                continue;
            }
            this.currentStream = null;
            this.mpcs.push(value);
            res.cancel();
            if (value.error instanceof commands_1.SubErrorResponse) {
                switch (value.error.reason_code) {
                    case api_1.SubscriptionErrorReason.Lagging:
                        this.mpcs.cancel();
                        break;
                    case api_1.SubscriptionErrorReason.Unspecified:
                        break;
                }
                return;
            }
        }
    }
}
exports.RecoverableStream = RecoverableStream;
//# sourceMappingURL=recoverable_stream.js.map