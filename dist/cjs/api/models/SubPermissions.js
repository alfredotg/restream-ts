"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubPermissionsToJSON = exports.SubPermissionsFromJSONTyped = exports.SubPermissionsFromJSON = exports.instanceOfSubPermissions = void 0;
const SubPermission_1 = require("./SubPermission");
const LimitByKey_1 = require("./LimitByKey");
function instanceOfSubPermissions(value) {
    if (!('subsLimits' in value) || value['subsLimits'] === undefined)
        return false;
    if (!('topics' in value) || value['topics'] === undefined)
        return false;
    return true;
}
exports.instanceOfSubPermissions = instanceOfSubPermissions;
function SubPermissionsFromJSON(json) {
    return SubPermissionsFromJSONTyped(json, false);
}
exports.SubPermissionsFromJSON = SubPermissionsFromJSON;
function SubPermissionsFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'subsLimits': (json['subs_limits'].map(LimitByKey_1.LimitByKeyFromJSON)),
        'topics': (json['topics'].map(SubPermission_1.SubPermissionFromJSON)),
    };
}
exports.SubPermissionsFromJSONTyped = SubPermissionsFromJSONTyped;
function SubPermissionsToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'subs_limits': (value['subsLimits'].map(LimitByKey_1.LimitByKeyToJSON)),
        'topics': (value['topics'].map(SubPermission_1.SubPermissionToJSON)),
    };
}
exports.SubPermissionsToJSON = SubPermissionsToJSON;
//# sourceMappingURL=SubPermissions.js.map