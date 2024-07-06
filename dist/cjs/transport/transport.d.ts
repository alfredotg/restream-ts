import { CancelableStream } from "../sync/types";
import { Subscribe, Unsubscribe, CallRpc, Publish } from "./commands";
import { ConnectionState } from "./connection_state";
export interface ITransport {
    waitConnected(): Promise<void>;
    state(): CancelableStream<ConnectionState>;
    close(): void;
    subCount(): number;
    subscribe(command: Subscribe): number;
    unsubscribe(command: Unsubscribe): void;
    callRpc(command: CallRpc): void;
    publish(command: Publish): void;
}
export { CancelableStream, ConnectionState };
