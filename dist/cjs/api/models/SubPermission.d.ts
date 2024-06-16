export interface SubPermission {
    topic: string;
}
export declare function instanceOfSubPermission(value: object): value is SubPermission;
export declare function SubPermissionFromJSON(json: any): SubPermission;
export declare function SubPermissionFromJSONTyped(json: any, ignoreDiscriminator: boolean): SubPermission;
export declare function SubPermissionToJSON(value?: SubPermission | null): any;
