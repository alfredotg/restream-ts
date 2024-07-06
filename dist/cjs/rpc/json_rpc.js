"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpc = void 0;
const commands_1 = require("../transport/commands");
class JsonRpc {
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
            if (data instanceof commands_1.CallRpcError) {
                return data;
            }
            return JSON.parse(data.toString());
        }
        catch (error) {
            return new commands_1.CallRpcError(new Error("" + error));
        }
    }
}
exports.JsonRpc = JsonRpc;
//# sourceMappingURL=json_rpc.js.map