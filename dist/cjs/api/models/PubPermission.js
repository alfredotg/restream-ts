"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubPermissionToJSON = exports.PubPermissionFromJSONTyped = exports.PubPermissionFromJSON = exports.instanceOfPubPermission = void 0;
function instanceOfPubPermission(value) {
    if (!('topic' in value) || value['topic'] === undefined)
        return false;
    return true;
}
exports.instanceOfPubPermission = instanceOfPubPermission;
function PubPermissionFromJSON(json) {
    return PubPermissionFromJSONTyped(json, false);
}
exports.PubPermissionFromJSON = PubPermissionFromJSON;
function PubPermissionFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'topic': json['topic'],
    };
}
exports.PubPermissionFromJSONTyped = PubPermissionFromJSONTyped;
function PubPermissionToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'topic': value['topic'],
    };
}
exports.PubPermissionToJSON = PubPermissionToJSON;
//# sourceMappingURL=PubPermission.js.map