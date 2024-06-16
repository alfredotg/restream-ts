import type { PubPermission } from './PubPermission';
export interface PubPermissions {
    topics: Array<PubPermission>;
}
export declare function instanceOfPubPermissions(value: object): value is PubPermissions;
export declare function PubPermissionsFromJSON(json: any): PubPermissions;
export declare function PubPermissionsFromJSONTyped(json: any, ignoreDiscriminator: boolean): PubPermissions;
export declare function PubPermissionsToJSON(value?: PubPermissions | null): any;
