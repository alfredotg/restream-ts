export interface LimitByKey {
    key: string;
    limit: number;
}
export declare function instanceOfLimitByKey(value: object): value is LimitByKey;
export declare function LimitByKeyFromJSON(json: any): LimitByKey;
export declare function LimitByKeyFromJSONTyped(json: any, ignoreDiscriminator: boolean): LimitByKey;
export declare function LimitByKeyToJSON(value?: LimitByKey | null): any;
