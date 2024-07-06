"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfPubPermissions = instanceOfPubPermissions;
exports.PubPermissionsFromJSON = PubPermissionsFromJSON;
exports.PubPermissionsFromJSONTyped = PubPermissionsFromJSONTyped;
exports.PubPermissionsToJSON = PubPermissionsToJSON;
const PubPermission_1 = require("./PubPermission");
function instanceOfPubPermissions(value) {
    if (!('topics' in value) || value['topics'] === undefined)
        return false;
    return true;
}
function PubPermissionsFromJSON(json) {
    return PubPermissionsFromJSONTyped(json, false);
}
function PubPermissionsFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'topics': (json['topics'].map(PubPermission_1.PubPermissionFromJSON)),
    };
}
function PubPermissionsToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'topics': (value['topics'].map(PubPermission_1.PubPermissionToJSON)),
    };
}
//# sourceMappingURL=PubPermissions.js.map