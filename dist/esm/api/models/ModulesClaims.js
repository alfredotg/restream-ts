import { RpcPermissionsFromJSON, RpcPermissionsToJSON, } from './RpcPermissions';
import { LimitByKeyFromJSON, LimitByKeyToJSON, } from './LimitByKey';
import { PubPermissionsFromJSON, PubPermissionsToJSON, } from './PubPermissions';
import { SubPermissionsFromJSON, SubPermissionsToJSON, } from './SubPermissions';
export function instanceOfModulesClaims(value) {
    return true;
}
export function ModulesClaimsFromJSON(json) {
    return ModulesClaimsFromJSONTyped(json, false);
}
export function ModulesClaimsFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'connLimits': json['conn_limits'] == null ? undefined : (json['conn_limits'].map(LimitByKeyFromJSON)),
        'publish': json['publish'] == null ? undefined : PubPermissionsFromJSON(json['publish']),
        'rpc': json['rpc'] == null ? undefined : RpcPermissionsFromJSON(json['rpc']),
        'subscribe': json['subscribe'] == null ? undefined : SubPermissionsFromJSON(json['subscribe']),
    };
}
export function ModulesClaimsToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'conn_limits': value['connLimits'] == null ? undefined : (value['connLimits'].map(LimitByKeyToJSON)),
        'publish': PubPermissionsToJSON(value['publish']),
        'rpc': RpcPermissionsToJSON(value['rpc']),
        'subscribe': SubPermissionsToJSON(value['subscribe']),
    };
}
//# sourceMappingURL=ModulesClaims.js.map