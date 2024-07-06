import { CallRpcError } from "../transport/commands";
export class JsonRpc {
    constructor(transport) {
        this.transport = transport;
    }
    async call(method, params) {
        const promise = new Promise((resolve) => {
            const cmd = {
                cmd: "call_rpc",
                method: method,
                payload: Buffer.from(JSON.stringify(params)),
                callback: (response) => {
                    resolve(response);
                },
            };
            this.transport.callRpc(cmd);
        });
        try {
            const data = await promise;
            if (data instanceof CallRpcError) {
                return data;
            }
            return JSON.parse(data.toString());
        }
        catch (error) {
            return new CallRpcError(new Error("" + error));
        }
    }
}
//# sourceMappingURL=json_rpc.js.map