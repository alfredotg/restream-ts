"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfLimitByKey = instanceOfLimitByKey;
exports.LimitByKeyFromJSON = LimitByKeyFromJSON;
exports.LimitByKeyFromJSONTyped = LimitByKeyFromJSONTyped;
exports.LimitByKeyToJSON = LimitByKeyToJSON;
function instanceOfLimitByKey(value) {
    if (!('key' in value) || value['key'] === undefined)
        return false;
    if (!('limit' in value) || value['limit'] === undefined)
        return false;
    return true;
}
function LimitByKeyFromJSON(json) {
    return LimitByKeyFromJSONTyped(json, false);
}
function LimitByKeyFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'key': json['key'],
        'limit': json['limit'],
    };
}
function LimitByKeyToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'key': value['key'],
        'limit': value['limit'],
    };
}
//# sourceMappingURL=LimitByKey.js.map