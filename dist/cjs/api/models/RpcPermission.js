"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfRpcPermission = instanceOfRpcPermission;
exports.RpcPermissionFromJSON = RpcPermissionFromJSON;
exports.RpcPermissionFromJSONTyped = RpcPermissionFromJSONTyped;
exports.RpcPermissionToJSON = RpcPermissionToJSON;
function instanceOfRpcPermission(value) {
    if (!('topic' in value) || value['topic'] === undefined)
        return false;
    return true;
}
function RpcPermissionFromJSON(json) {
    return RpcPermissionFromJSONTyped(json, false);
}
function RpcPermissionFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'topic': json['topic'],
    };
}
function RpcPermissionToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'topic': value['topic'],
    };
}
//# sourceMappingURL=RpcPermission.js.map