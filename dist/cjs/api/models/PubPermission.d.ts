export interface PubPermission {
    topic: string;
}
export declare function instanceOfPubPermission(value: object): value is PubPermission;
export declare function PubPermissionFromJSON(json: any): PubPermission;
export declare function PubPermissionFromJSONTyped(json: any, ignoreDiscriminator: boolean): PubPermission;
export declare function PubPermissionToJSON(value?: PubPermission | null): any;
