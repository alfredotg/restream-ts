import { RpcPermissionFromJSON, RpcPermissionToJSON, } from './RpcPermission';
export function instanceOfRpcPermissions(value) {
    if (!('topics' in value) || value['topics'] === undefined)
        return false;
    return true;
}
export function RpcPermissionsFromJSON(json) {
    return RpcPermissionsFromJSONTyped(json, false);
}
export function RpcPermissionsFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'topics': (json['topics'].map(RpcPermissionFromJSON)),
    };
}
export function RpcPermissionsToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'topics': (value['topics'].map(RpcPermissionToJSON)),
    };
}
//# sourceMappingURL=RpcPermissions.js.map