import type { RpcPermission } from './RpcPermission';
export interface RpcPermissions {
    topics: Array<RpcPermission>;
}
export declare function instanceOfRpcPermissions(value: object): value is RpcPermissions;
export declare function RpcPermissionsFromJSON(json: any): RpcPermissions;
export declare function RpcPermissionsFromJSONTyped(json: any, ignoreDiscriminator: boolean): RpcPermissions;
export declare function RpcPermissionsToJSON(value?: RpcPermissions | null): any;
