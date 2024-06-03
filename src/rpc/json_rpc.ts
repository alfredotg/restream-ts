import { CallRpc, CallRpcError } from "../transport/commands";
import { ITransport } from "../transport/transport";

export class JsonRpc {
    public constructor(private readonly transport: ITransport) {}

    public async call<T>(
        method: string,
        params: any,
    ): Promise<T | CallRpcError> {
        const promise = new Promise<Buffer | CallRpcError>(
            (resolve, reject) => {
                const cmd: CallRpc = {
                    cmd: "call_rpc",
                    method: method,
                    payload: Buffer.from(JSON.stringify(params)),
                    callback: (response) => {
                        resolve(response);
                    },
                };
                this.transport.call_rpc(cmd);
            },
        );

        try {
            const data = await promise;
            if (data instanceof CallRpcError) {
                return data;
            }
            return JSON.parse(data.toString());
        } catch (error) {
            return new CallRpcError(new Error("" + error));
        }
    }
}
