"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallRpcError = exports.PubError = exports.SubErrorResponse = exports.SubError = void 0;
class SubError {
    constructor(error) {
        this.error = error;
    }
}
exports.SubError = SubError;
class SubErrorResponse {
    constructor(reason_code, message) {
        this.reason_code = reason_code;
        this.message = message;
    }
}
exports.SubErrorResponse = SubErrorResponse;
class PubError {
    constructor(error) {
        this.error = error;
    }
}
exports.PubError = PubError;
/**
 * Transport level error
 * e.g. connection error, incorrect message format, permission denied, etc.
 */
class CallRpcError {
    constructor(error) {
        this.error = error;
    }
}
exports.CallRpcError = CallRpcError;
//# sourceMappingURL=commands.js.map