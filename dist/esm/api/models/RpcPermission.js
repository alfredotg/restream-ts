export function instanceOfRpcPermission(value) {
    if (!('topic' in value) || value['topic'] === undefined)
        return false;
    return true;
}
export function RpcPermissionFromJSON(json) {
    return RpcPermissionFromJSONTyped(json, false);
}
export function RpcPermissionFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'topic': json['topic'],
    };
}
export function RpcPermissionToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'topic': value['topic'],
    };
}
//# sourceMappingURL=RpcPermission.js.map