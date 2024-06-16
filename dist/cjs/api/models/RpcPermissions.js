"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpcPermissionsToJSON = exports.RpcPermissionsFromJSONTyped = exports.RpcPermissionsFromJSON = exports.instanceOfRpcPermissions = void 0;
const RpcPermission_1 = require("./RpcPermission");
function instanceOfRpcPermissions(value) {
    if (!('topics' in value) || value['topics'] === undefined)
        return false;
    return true;
}
exports.instanceOfRpcPermissions = instanceOfRpcPermissions;
function RpcPermissionsFromJSON(json) {
    return RpcPermissionsFromJSONTyped(json, false);
}
exports.RpcPermissionsFromJSON = RpcPermissionsFromJSON;
function RpcPermissionsFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'topics': (json['topics'].map(RpcPermission_1.RpcPermissionFromJSON)),
    };
}
exports.RpcPermissionsFromJSONTyped = RpcPermissionsFromJSONTyped;
function RpcPermissionsToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'topics': (value['topics'].map(RpcPermission_1.RpcPermissionToJSON)),
    };
}
exports.RpcPermissionsToJSON = RpcPermissionsToJSON;
//# sourceMappingURL=RpcPermissions.js.map