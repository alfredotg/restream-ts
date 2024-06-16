"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSubscriptionErrorReasonToJSON = exports.CreateSubscriptionErrorReasonFromJSONTyped = exports.CreateSubscriptionErrorReasonFromJSON = exports.instanceOfCreateSubscriptionErrorReason = exports.CreateSubscriptionErrorReason = void 0;
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
exports.instanceOfCreateSubscriptionErrorReason = instanceOfCreateSubscriptionErrorReason;
function CreateSubscriptionErrorReasonFromJSON(json) {
    return CreateSubscriptionErrorReasonFromJSONTyped(json, false);
}
exports.CreateSubscriptionErrorReasonFromJSON = CreateSubscriptionErrorReasonFromJSON;
function CreateSubscriptionErrorReasonFromJSONTyped(json, ignoreDiscriminator) {
    return json;
}
exports.CreateSubscriptionErrorReasonFromJSONTyped = CreateSubscriptionErrorReasonFromJSONTyped;
function CreateSubscriptionErrorReasonToJSON(value) {
    return value;
}
exports.CreateSubscriptionErrorReasonToJSON = CreateSubscriptionErrorReasonToJSON;
//# sourceMappingURL=CreateSubscriptionErrorReason.js.map