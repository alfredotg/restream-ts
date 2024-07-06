"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfSubPermission = instanceOfSubPermission;
exports.SubPermissionFromJSON = SubPermissionFromJSON;
exports.SubPermissionFromJSONTyped = SubPermissionFromJSONTyped;
exports.SubPermissionToJSON = SubPermissionToJSON;
function instanceOfSubPermission(value) {
    if (!('topic' in value) || value['topic'] === undefined)
        return false;
    return true;
}
function SubPermissionFromJSON(json) {
    return SubPermissionFromJSONTyped(json, false);
}
function SubPermissionFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'topic': json['topic'],
    };
}
function SubPermissionToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'topic': value['topic'],
    };
}
//# sourceMappingURL=SubPermission.js.map