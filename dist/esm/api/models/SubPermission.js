export function instanceOfSubPermission(value) {
    if (!('topic' in value) || value['topic'] === undefined)
        return false;
    return true;
}
export function SubPermissionFromJSON(json) {
    return SubPermissionFromJSONTyped(json, false);
}
export function SubPermissionFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'topic': json['topic'],
    };
}
export function SubPermissionToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'topic': value['topic'],
    };
}
//# sourceMappingURL=SubPermission.js.map