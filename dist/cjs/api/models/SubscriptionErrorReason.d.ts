export declare const SubscriptionErrorReason: {
    readonly Lagging: "lagging";
    readonly Unspecified: "unspecified";
};
export type SubscriptionErrorReason = (typeof SubscriptionErrorReason)[keyof typeof SubscriptionErrorReason];
export declare function instanceOfSubscriptionErrorReason(value: any): boolean;
export declare function SubscriptionErrorReasonFromJSON(json: any): SubscriptionErrorReason;
export declare function SubscriptionErrorReasonFromJSONTyped(json: any, ignoreDiscriminator: boolean): SubscriptionErrorReason;
export declare function SubscriptionErrorReasonToJSON(value?: SubscriptionErrorReason | null): any;
