export const CreateSubscriptionErrorReason = {
    LimitExceeded: "limit_exceeded",
    Unauthorized: "unauthorized",
    NotFound: "not_found",
    InvalidOffset: "invalid_offset",
    InvalidTopic: "invalid_topic",
    InternalError: "internal_error",
    Unspecified: "unspecified",
};
export function instanceOfCreateSubscriptionErrorReason(value) {
    for (const key in CreateSubscriptionErrorReason) {
        if (Object.prototype.hasOwnProperty.call(CreateSubscriptionErrorReason, key)) {
            if (CreateSubscriptionErrorReason[key] === value) {
                return true;
            }
        }
    }
    return false;
}
export function CreateSubscriptionErrorReasonFromJSON(json) {
    return CreateSubscriptionErrorReasonFromJSONTyped(json, false);
}
export function CreateSubscriptionErrorReasonFromJSONTyped(json, ignoreDiscriminator) {
    return json;
}
export function CreateSubscriptionErrorReasonToJSON(value) {
    return value;
}
//# sourceMappingURL=CreateSubscriptionErrorReason.js.map