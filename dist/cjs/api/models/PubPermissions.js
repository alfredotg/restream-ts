"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubPermissionsToJSON = exports.PubPermissionsFromJSONTyped = exports.PubPermissionsFromJSON = exports.instanceOfPubPermissions = void 0;
const PubPermission_1 = require("./PubPermission");
function instanceOfPubPermissions(value) {
    if (!('topics' in value) || value['topics'] === undefined)
        return false;
    return true;
}
exports.instanceOfPubPermissions = instanceOfPubPermissions;
function PubPermissionsFromJSON(json) {
    return PubPermissionsFromJSONTyped(json, false);
}
exports.PubPermissionsFromJSON = PubPermissionsFromJSON;
function PubPermissionsFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'topics': (json['topics'].map(PubPermission_1.PubPermissionFromJSON)),
    };
}
exports.PubPermissionsFromJSONTyped = PubPermissionsFromJSONTyped;
function PubPermissionsToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'topics': (value['topics'].map(PubPermission_1.PubPermissionToJSON)),
    };
}
exports.PubPermissionsToJSON = PubPermissionsToJSON;
//# sourceMappingURL=PubPermissions.js.map