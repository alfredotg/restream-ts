"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubPermissionToJSON = exports.SubPermissionFromJSONTyped = exports.SubPermissionFromJSON = exports.instanceOfSubPermission = void 0;
function instanceOfSubPermission(value) {
    if (!('topic' in value) || value['topic'] === undefined)
        return false;
    return true;
}
exports.instanceOfSubPermission = instanceOfSubPermission;
function SubPermissionFromJSON(json) {
    return SubPermissionFromJSONTyped(json, false);
}
exports.SubPermissionFromJSON = SubPermissionFromJSON;
function SubPermissionFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'topic': json['topic'],
    };
}
exports.SubPermissionFromJSONTyped = SubPermissionFromJSONTyped;
function SubPermissionToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'topic': value['topic'],
    };
}
exports.SubPermissionToJSON = SubPermissionToJSON;
//# sourceMappingURL=SubPermission.js.map