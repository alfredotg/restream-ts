export declare const CreateSubscriptionErrorReason: {
    readonly LimitExceeded: "limit_exceeded";
    readonly Unauthorized: "unauthorized";
    readonly NotFound: "not_found";
    readonly InvalidOffset: "invalid_offset";
    readonly InvalidTopic: "invalid_topic";
    readonly InternalError: "internal_error";
    readonly Unspecified: "unspecified";
};
export type CreateSubscriptionErrorReason = (typeof CreateSubscriptionErrorReason)[keyof typeof CreateSubscriptionErrorReason];
export declare function instanceOfCreateSubscriptionErrorReason(value: any): boolean;
export declare function CreateSubscriptionErrorReasonFromJSON(json: any): CreateSubscriptionErrorReason;
export declare function CreateSubscriptionErrorReasonFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateSubscriptionErrorReason;
export declare function CreateSubscriptionErrorReasonToJSON(value?: CreateSubscriptionErrorReason | null): any;
