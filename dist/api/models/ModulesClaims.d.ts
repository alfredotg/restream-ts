import type { RpcPermissions } from './RpcPermissions';
import type { LimitByKey } from './LimitByKey';
import type { PubPermissions } from './PubPermissions';
import type { SubPermissions } from './SubPermissions';
export interface ModulesClaims {
    connLimits?: Array<LimitByKey>;
    publish?: PubPermissions;
    rpc?: RpcPermissions;
    subscribe?: SubPermissions;
}
export declare function instanceOfModulesClaims(value: object): value is ModulesClaims;
export declare function ModulesClaimsFromJSON(json: any): ModulesClaims;
export declare function ModulesClaimsFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModulesClaims;
export declare function ModulesClaimsToJSON(value?: ModulesClaims | null): any;
