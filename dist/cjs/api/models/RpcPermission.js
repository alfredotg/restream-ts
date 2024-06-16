"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpcPermissionToJSON = exports.RpcPermissionFromJSONTyped = exports.RpcPermissionFromJSON = exports.instanceOfRpcPermission = void 0;
function instanceOfRpcPermission(value) {
    if (!('topic' in value) || value['topic'] === undefined)
        return false;
    return true;
}
exports.instanceOfRpcPermission = instanceOfRpcPermission;
function RpcPermissionFromJSON(json) {
    return RpcPermissionFromJSONTyped(json, false);
}
exports.RpcPermissionFromJSON = RpcPermissionFromJSON;
function RpcPermissionFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'topic': json['topic'],
    };
}
exports.RpcPermissionFromJSONTyped = RpcPermissionFromJSONTyped;
function RpcPermissionToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'topic': value['topic'],
    };
}
exports.RpcPermissionToJSON = RpcPermissionToJSON;
//# sourceMappingURL=RpcPermission.js.map