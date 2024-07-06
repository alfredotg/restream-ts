"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfSubPermissions = instanceOfSubPermissions;
exports.SubPermissionsFromJSON = SubPermissionsFromJSON;
exports.SubPermissionsFromJSONTyped = SubPermissionsFromJSONTyped;
exports.SubPermissionsToJSON = SubPermissionsToJSON;
const SubPermission_1 = require("./SubPermission");
const LimitByKey_1 = require("./LimitByKey");
function instanceOfSubPermissions(value) {
    if (!('subsLimits' in value) || value['subsLimits'] === undefined)
        return false;
    if (!('topics' in value) || value['topics'] === undefined)
        return false;
    return true;
}
function SubPermissionsFromJSON(json) {
    return SubPermissionsFromJSONTyped(json, false);
}
function SubPermissionsFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'subsLimits': (json['subs_limits'].map(LimitByKey_1.LimitByKeyFromJSON)),
        'topics': (json['topics'].map(SubPermission_1.SubPermissionFromJSON)),
    };
}
function SubPermissionsToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'subs_limits': (value['subsLimits'].map(LimitByKey_1.LimitByKeyToJSON)),
        'topics': (value['topics'].map(SubPermission_1.SubPermissionToJSON)),
    };
}
//# sourceMappingURL=SubPermissions.js.map