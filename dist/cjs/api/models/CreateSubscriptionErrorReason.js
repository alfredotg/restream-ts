"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSubscriptionErrorReason = void 0;
exports.instanceOfCreateSubscriptionErrorReason = instanceOfCreateSubscriptionErrorReason;
exports.CreateSubscriptionErrorReasonFromJSON = CreateSubscriptionErrorReasonFromJSON;
exports.CreateSubscriptionErrorReasonFromJSONTyped = CreateSubscriptionErrorReasonFromJSONTyped;
exports.CreateSubscriptionErrorReasonToJSON = CreateSubscriptionErrorReasonToJSON;
exports.CreateSubscriptionErrorReason = {
    LimitExceeded: "limit_exceeded",
    Unauthorized: "unauthorized",
    NotFound: "not_found",
    InvalidOffset: "invalid_offset",
    InvalidTopic: "invalid_topic",
    InternalError: "internal_error",
    Unspecified: "unspecified",
};
function instanceOfCreateSubscriptionErrorReason(value) {
    for (const key in exports.CreateSubscriptionErrorReason) {
        if (Object.prototype.hasOwnProperty.call(exports.CreateSubscriptionErrorReason, key)) {
            if (exports.CreateSubscriptionErrorReason[key] === value) {
                return true;
            }
        }
    }
    return false;
}
function CreateSubscriptionErrorReasonFromJSON(json) {
    return CreateSubscriptionErrorReasonFromJSONTyped(json, false);
}
function CreateSubscriptionErrorReasonFromJSONTyped(json, ignoreDiscriminator) {
    return json;
}
function CreateSubscriptionErrorReasonToJSON(value) {
    return value;
}
//# sourceMappingURL=CreateSubscriptionErrorReason.js.map