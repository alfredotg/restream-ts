export function instanceOfLimitByKey(value) {
    if (!('key' in value) || value['key'] === undefined)
        return false;
    if (!('limit' in value) || value['limit'] === undefined)
        return false;
    return true;
}
export function LimitByKeyFromJSON(json) {
    return LimitByKeyFromJSONTyped(json, false);
}
export function LimitByKeyFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'key': json['key'],
        'limit': json['limit'],
    };
}
export function LimitByKeyToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'key': value['key'],
        'limit': value['limit'],
    };
}
//# sourceMappingURL=LimitByKey.js.map