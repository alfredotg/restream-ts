/* tslint:disable */
/* eslint-disable */
/**
 * restream
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * The reason for a subscription creation error.
 * @export
 */
export const CreateSubscriptionErrorReason = {
    LimitExceeded: "limit_exceeded",
    Unauthorized: "unauthorized",
    NotFound: "not_found",
    InvalidOffset: "invalid_offset",
    InvalidTopic: "invalid_topic",
    InternalError: "internal_error",
    Unspecified: "unspecified",
} as const;
export type CreateSubscriptionErrorReason =
    (typeof CreateSubscriptionErrorReason)[keyof typeof CreateSubscriptionErrorReason];

export function instanceOfCreateSubscriptionErrorReason(value: any): boolean {
    for (const key in CreateSubscriptionErrorReason) {
        if (
            Object.prototype.hasOwnProperty.call(
                CreateSubscriptionErrorReason,
                key,
            )
        ) {
            if (
                (
                    CreateSubscriptionErrorReason as Record<
                        string,
                        CreateSubscriptionErrorReason
                    >
                )[key] === value
            ) {
                return true;
            }
        }
    }
    return false;
}

export function CreateSubscriptionErrorReasonFromJSON(
    json: any,
): CreateSubscriptionErrorReason {
    return CreateSubscriptionErrorReasonFromJSONTyped(json, false);
}

export function CreateSubscriptionErrorReasonFromJSONTyped(
    json: any,
    ignoreDiscriminator: boolean,
): CreateSubscriptionErrorReason {
    return json as CreateSubscriptionErrorReason;
}

export function CreateSubscriptionErrorReasonToJSON(
    value?: CreateSubscriptionErrorReason | null,
): any {
    return value as any;
}
