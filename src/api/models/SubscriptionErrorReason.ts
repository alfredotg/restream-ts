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
 * The reason for a subscription error.
 * @export
 */
export const SubscriptionErrorReason = {
    Lagging: "lagging",
    Unspecified: "unspecified",
} as const;
export type SubscriptionErrorReason =
    (typeof SubscriptionErrorReason)[keyof typeof SubscriptionErrorReason];

export function instanceOfSubscriptionErrorReason(value: any): boolean {
    for (const key in SubscriptionErrorReason) {
        if (
            Object.prototype.hasOwnProperty.call(SubscriptionErrorReason, key)
        ) {
            if (
                (
                    SubscriptionErrorReason as Record<
                        string,
                        SubscriptionErrorReason
                    >
                )[key] === value
            ) {
                return true;
            }
        }
    }
    return false;
}

export function SubscriptionErrorReasonFromJSON(
    json: any,
): SubscriptionErrorReason {
    return SubscriptionErrorReasonFromJSONTyped(json, false);
}

export function SubscriptionErrorReasonFromJSONTyped(
    json: any,
    ignoreDiscriminator: boolean,
): SubscriptionErrorReason {
    return json as SubscriptionErrorReason;
}

export function SubscriptionErrorReasonToJSON(
    value?: SubscriptionErrorReason | null,
): any {
    return value as any;
}