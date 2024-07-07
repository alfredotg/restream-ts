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
        this.mpcsError = new MPSCStream();
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
            if (!(value instanceof SubError)) {
                if (this.offset !== undefined && this.offset >= value.offset) {
                    continue;
                }
                this.offset = value.offset;
                this.mpcs.push(value);
                continue;
            }
            if (value.error instanceof SubErrorResponse) {
                switch (value.error.reason_code) {
                    case SubscriptionErrorReason.Lagging:
                        this.mpcs.push(value);
                        this.mpcs.cancel();
                        break;
                    case SubscriptionErrorReason.Unspecified:
                        break;
                }
            }
            this.mpcsError.push(value);
            break;
        }
    }
}
//# sourceMappingURL=recoverable_stream.js.map