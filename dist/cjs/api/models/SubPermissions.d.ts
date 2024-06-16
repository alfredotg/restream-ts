import type { SubPermission } from './SubPermission';
import type { LimitByKey } from './LimitByKey';
export interface SubPermissions {
    subsLimits: Array<LimitByKey>;
    topics: Array<SubPermission>;
}
export declare function instanceOfSubPermissions(value: object): value is SubPermissions;
export declare function SubPermissionsFromJSON(json: any): SubPermissions;
export declare function SubPermissionsFromJSONTyped(json: any, ignoreDiscriminator: boolean): SubPermissions;
export declare function SubPermissionsToJSON(value?: SubPermissions | null): any;
