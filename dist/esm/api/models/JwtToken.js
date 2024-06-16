import { RpcPermissionsFromJSON, RpcPermissionsToJSON, } from './RpcPermissions';
import { LimitByKeyFromJSON, LimitByKeyToJSON, } from './LimitByKey';
import { PubPermissionsFromJSON, PubPermissionsToJSON, } from './PubPermissions';
import { SubPermissionsFromJSON, SubPermissionsToJSON, } from './SubPermissions';
export function instanceOfJwtToken(value) {
    if (!('sub' in value) || value['sub'] === undefined)
        return false;
    if (!('exp' in value) || value['exp'] === undefined)
        return false;
    return true;
}
export function JwtTokenFromJSON(json) {
    return JwtTokenFromJSONTyped(json, false);
}
export function JwtTokenFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'connLimits': json['conn_limits'] == null ? undefined : (json['conn_limits'].map(LimitByKeyFromJSON)),
        'publish': json['publish'] == null ? undefined : PubPermissionsFromJSON(json['publish']),
        'rpc': json['rpc'] == null ? undefined : RpcPermissionsFromJSON(json['rpc']),
        'subscribe': json['subscribe'] == null ? undefined : SubPermissionsFromJSON(json['subscribe']),
        'sub': json['sub'],
        'exp': json['exp'],
    };
}
export function JwtTokenToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'conn_limits': value['connLimits'] == null ? undefined : (value['connLimits'].map(LimitByKeyToJSON)),
        'publish': PubPermissionsToJSON(value['publish']),
        'rpc': RpcPermissionsToJSON(value['rpc']),
        'subscribe': SubPermissionsToJSON(value['subscribe']),
        'sub': value['sub'],
        'exp': value['exp'],
    };
}
//# sourceMappingURL=JwtToken.js.map