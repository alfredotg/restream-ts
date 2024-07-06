"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionErrorReason = void 0;
exports.instanceOfSubscriptionErrorReason = instanceOfSubscriptionErrorReason;
exports.SubscriptionErrorReasonFromJSON = SubscriptionErrorReasonFromJSON;
exports.SubscriptionErrorReasonFromJSONTyped = SubscriptionErrorReasonFromJSONTyped;
exports.SubscriptionErrorReasonToJSON = SubscriptionErrorReasonToJSON;
exports.SubscriptionErrorReason = {
    Lagging: "lagging",
    Unspecified: "unspecified",
};
function instanceOfSubscriptionErrorReason(value) {
    for (const key in exports.SubscriptionErrorReason) {
        if (Object.prototype.hasOwnProperty.call(exports.SubscriptionErrorReason, key)) {
            if (exports.SubscriptionErrorReason[key] === value) {
                return true;
            }
        }
    }
    return false;
}
function SubscriptionErrorReasonFromJSON(json) {
    return SubscriptionErrorReasonFromJSONTyped(json, false);
}
function SubscriptionErrorReasonFromJSONTyped(json, ignoreDiscriminator) {
    return json;
}
function SubscriptionErrorReasonToJSON(value) {
    return value;
}
//# sourceMappingURL=SubscriptionErrorReason.js.map