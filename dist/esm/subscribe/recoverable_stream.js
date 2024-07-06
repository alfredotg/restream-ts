import { MPSCStream } from "../sync/mpsc";
import { SubError } from "..";
import { CreateSubscriptionErrorReason, SubscriptionErrorReason } from "../api";
import { CreateSubscriptionError, SubErrorResponse, } from "../transport/commands";
export class RecoverableStream {
    constructor(subscriber, retryDelay, topic, offset, logger) {
        this.subscriber = subscriber;
        this.retryDelay = retryDelay;
        this.topic = topic;
        this.offset = offset;
        this.logger = logger;
        this.currentStream = null;
        this.mpcs = new MPSCStream(() => {
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
        if (res instanceof CreateSubscriptionError) {
            if (res.error instanceof Error) {
                throw res.error;
            }
            switch (res.error.reason_code) {
                case CreateSubscriptionErrorReason.LimitExceeded:
                case CreateSubscriptionErrorReason.Unauthorized:
                case CreateSubscriptionErrorReason.NotFound:
                case CreateSubscriptionErrorReason.InvalidOffset:
                case CreateSubscriptionErrorReason.InvalidTopic:
                    this.mpcs.push(new SubError(new Error("Failed to create subscription: " +
                        res.error.message)));
                    this.mpcs.cancel();
                    break;
                case CreateSubscriptionErrorReason.InternalError:
                case CreateSubscriptionErrorReason.Unspecified:
                    break;
            }
            this.logger?.error(res.error);
            return;
        }
        this.retryDelay.success();
        this.currentStream = res;
        for await (const value of res.stream) {
            if (!(value instanceof SubError)) {
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
            if (value.error instanceof SubErrorResponse) {
                switch (value.error.reason_code) {
                    case SubscriptionErrorReason.Lagging:
                        this.mpcs.cancel();
                        break;
                    case SubscriptionErrorReason.Unspecified:
                        break;
                }
                return;
            }
        }
    }
}
//# sourceMappingURL=recoverable_stream.js.map