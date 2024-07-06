"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfPubPermission = instanceOfPubPermission;
exports.PubPermissionFromJSON = PubPermissionFromJSON;
exports.PubPermissionFromJSONTyped = PubPermissionFromJSONTyped;
exports.PubPermissionToJSON = PubPermissionToJSON;
function instanceOfPubPermission(value) {
    if (!('topic' in value) || value['topic'] === undefined)
        return false;
    return true;
}
function PubPermissionFromJSON(json) {
    return PubPermissionFromJSONTyped(json, false);
}
function PubPermissionFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'topic': json['topic'],
    };
}
function PubPermissionToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'topic': value['topic'],
    };
}
//# sourceMappingURL=PubPermission.js.map