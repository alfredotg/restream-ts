"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallRpcError = exports.PubError = exports.SubError = exports.SubErrorResponse = exports.CreateSubscriptionError = exports.CreateSubscriptionErrorResponse = void 0;
class CreateSubscriptionErrorResponse {
    constructor(reason_code, message) {
        this.reason_code = reason_code;
        this.message = message;
    }
}
exports.CreateSubscriptionErrorResponse = CreateSubscriptionErrorResponse;
class CreateSubscriptionError {
    constructor(error) {
        this.error = error;
    }
}
exports.CreateSubscriptionError = CreateSubscriptionError;
class SubErrorResponse {
    constructor(reason_code, message) {
        this.reason_code = reason_code;
        this.message = message;
    }
}
exports.SubErrorResponse = SubErrorResponse;
class SubError {
    constructor(error) {
        this.error = error;
    }
}
exports.SubError = SubError;
class PubError {
    constructor(error) {
        this.error = error;
    }
}
exports.PubError = PubError;
class CallRpcError {
    constructor(error) {
        this.error = error;
    }
}
exports.CallRpcError = CallRpcError;
//# sourceMappingURL=commands.js.map