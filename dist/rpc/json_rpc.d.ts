import { CallRpcError } from "../transport/commands";
import { ITransport } from "../transport/transport";
export declare class JsonRpc {
    private readonly transport;
    constructor(transport: ITransport);
    call<T>(method: string, params: any): Promise<T | CallRpcError>;
}
