import { PubPermissionFromJSON, PubPermissionToJSON, } from './PubPermission';
export function instanceOfPubPermissions(value) {
    if (!('topics' in value) || value['topics'] === undefined)
        return false;
    return true;
}
export function PubPermissionsFromJSON(json) {
    return PubPermissionsFromJSONTyped(json, false);
}
export function PubPermissionsFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'topics': (json['topics'].map(PubPermissionFromJSON)),
    };
}
export function PubPermissionsToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'topics': (value['topics'].map(PubPermissionToJSON)),
    };
}
//# sourceMappingURL=PubPermissions.js.map