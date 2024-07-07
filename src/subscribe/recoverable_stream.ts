import { MPSCStream } from "@/sync/mpsc";
import { CancelableStream } from "./../transport/transport";
import { IncomingMessage, SubError, Subscriber } from "..";
import { Logger, ILogObj } from "tslog";
import { CreateSubscriptionErrorReason, SubscriptionErrorReason } from "@/api";
import {
    CreateSubscriptionError,
    SubErrorResponse,
} from "@/transport/commands";
import { IDelay } from "@/time/delay";

type ErrorStreamItem = SubError | CreateSubscriptionError | Error;

export class RecoverableStream {
    private readonly mpcs: MPSCStream<IncomingMessage | SubError>;
    private readonly mpcsError: MPSCStream<ErrorStreamItem>;

    private currentStream: CancelableStream<IncomingMessage | SubError> | null =
        null;

    public constructor(
        private readonly subscriber: Subscriber,
        private readonly retryDelay: IDelay,
        private readonly topic: string,
        private offset?: number,
        private readonly logger?: Logger<ILogObj>,
    ) {
        this.mpcs = new MPSCStream<IncomingMessage | SubError>(() => {
            this.unsubscribe();
        });
        this.mpcsError = new MPSCStream<
            SubError | CreateSubscriptionError | Error
        >();
        this.start();
    }

    private unsubscribe() {
        this.currentStream?.cancel();
    }

    public get stream(): CancelableStream<IncomingMessage | SubError> {
        return this.mpcs;
    }

    public get errorStream(): CancelableStream<ErrorStreamItem> {
        return this.errorStream;
    }

    private async start() {
        while (!this.mpcs.isClosed()) {
            try {
                await this.process();
            } catch (e) {
                this.logger?.error(e);
                if (e instanceof Error) {
                    this.mpcsError.push(e);
                }
            } finally {
                this.currentStream?.cancel();
                this.currentStream = null;
            }
            if (!this.mpcs.isClosed()) {
                await this.retryDelay.fail();
            }
        }
    }

    private async process() {
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
                    this.mpcs.push(
                        new SubError(
                            new Error(
                                "Failed to create subscription: " +
                                    res.error.message,
                            ),
                        ),
                    );
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
