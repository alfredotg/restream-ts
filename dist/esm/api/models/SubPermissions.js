import { SubPermissionFromJSON, SubPermissionToJSON, } from './SubPermission';
import { LimitByKeyFromJSON, LimitByKeyToJSON, } from './LimitByKey';
export function instanceOfSubPermissions(value) {
    if (!('subsLimits' in value) || value['subsLimits'] === undefined)
        return false;
    if (!('topics' in value) || value['topics'] === undefined)
        return false;
    return true;
}
export function SubPermissionsFromJSON(json) {
    return SubPermissionsFromJSONTyped(json, false);
}
export function SubPermissionsFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'subsLimits': (json['subs_limits'].map(LimitByKeyFromJSON)),
        'topics': (json['topics'].map(SubPermissionFromJSON)),
    };
}
export function SubPermissionsToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'subs_limits': (value['subsLimits'].map(LimitByKeyToJSON)),
        'topics': (value['topics'].map(SubPermissionToJSON)),
    };
}
//# sourceMappingURL=SubPermissions.js.map