export const SubscriptionErrorReason = {
    Lagging: "lagging",
    Unspecified: "unspecified",
};
export function instanceOfSubscriptionErrorReason(value) {
    for (const key in SubscriptionErrorReason) {
        if (Object.prototype.hasOwnProperty.call(SubscriptionErrorReason, key)) {
            if (SubscriptionErrorReason[key] === value) {
                return true;
            }
        }
    }
    return false;
}
export function SubscriptionErrorReasonFromJSON(json) {
    return SubscriptionErrorReasonFromJSONTyped(json, false);
}
export function SubscriptionErrorReasonFromJSONTyped(json, ignoreDiscriminator) {
    return json;
}
export function SubscriptionErrorReasonToJSON(value) {
    return value;
}
//# sourceMappingURL=SubscriptionErrorReason.js.map