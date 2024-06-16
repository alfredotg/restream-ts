export interface RpcPermission {
    topic: string;
}
export declare function instanceOfRpcPermission(value: object): value is RpcPermission;
export declare function RpcPermissionFromJSON(json: any): RpcPermission;
export declare function RpcPermissionFromJSONTyped(json: any, ignoreDiscriminator: boolean): RpcPermission;
export declare function RpcPermissionToJSON(value?: RpcPermission | null): any;
