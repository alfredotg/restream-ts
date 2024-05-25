import { CancebleStream } from "../sync/types";
import { Subscribe, Unsubscribe, CallRpc, Publish } from "./commands";
import { ConnectionState } from "./connection_state";

export interface ITransport {
    state(): CancebleStream<ConnectionState>;
    close(): void;
    subscribe(command: Subscribe): void;
    unsubscribe(command: Unsubscribe): void;
    call_rpc(command: CallRpc): void;
    publish(command: Publish): void;
}