export class SubError {
    constructor(error) {
        this.error = error;
    }
}
export class SubErrorResponse {
    constructor(reason_code, message) {
        this.reason_code = reason_code;
        this.message = message;
    }
}
export class PubError {
    constructor(error) {
        this.error = error;
    }
}
export class CallRpcError {
    constructor(error) {
        this.error = error;
    }
}
//# sourceMappingURL=commands.js.map