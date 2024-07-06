"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfRpcPermissions = instanceOfRpcPermissions;
exports.RpcPermissionsFromJSON = RpcPermissionsFromJSON;
exports.RpcPermissionsFromJSONTyped = RpcPermissionsFromJSONTyped;
exports.RpcPermissionsToJSON = RpcPermissionsToJSON;
const RpcPermission_1 = require("./RpcPermission");
function instanceOfRpcPermissions(value) {
    if (!('topics' in value) || value['topics'] === undefined)
        return false;
    return true;
}
function RpcPermissionsFromJSON(json) {
    return RpcPermissionsFromJSONTyped(json, false);
}
function RpcPermissionsFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'topics': (json['topics'].map(RpcPermission_1.RpcPermissionFromJSON)),
    };
}
function RpcPermissionsToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'topics': (value['topics'].map(RpcPermission_1.RpcPermissionToJSON)),
    };
}
//# sourceMappingURL=RpcPermissions.js.map