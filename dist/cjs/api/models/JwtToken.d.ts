import type { RpcPermissions } from './RpcPermissions';
import type { LimitByKey } from './LimitByKey';
import type { PubPermissions } from './PubPermissions';
import type { SubPermissions } from './SubPermissions';
export interface JwtToken {
    connLimits?: Array<LimitByKey>;
    publish?: PubPermissions;
    rpc?: RpcPermissions;
    subscribe?: SubPermissions;
    sub: string;
    exp: number;
}
export declare function instanceOfJwtToken(value: object): value is JwtToken;
export declare function JwtTokenFromJSON(json: any): JwtToken;
export declare function JwtTokenFromJSONTyped(json: any, ignoreDiscriminator: boolean): JwtToken;
export declare function JwtTokenToJSON(value?: JwtToken | null): any;
