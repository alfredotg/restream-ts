"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LimitByKeyToJSON = exports.LimitByKeyFromJSONTyped = exports.LimitByKeyFromJSON = exports.instanceOfLimitByKey = void 0;
function instanceOfLimitByKey(value) {
    if (!('key' in value) || value['key'] === undefined)
        return false;
    if (!('limit' in value) || value['limit'] === undefined)
        return false;
    return true;
}
exports.instanceOfLimitByKey = instanceOfLimitByKey;
function LimitByKeyFromJSON(json) {
    return LimitByKeyFromJSONTyped(json, false);
}
exports.LimitByKeyFromJSON = LimitByKeyFromJSON;
function LimitByKeyFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'key': json['key'],
        'limit': json['limit'],
    };
}
exports.LimitByKeyFromJSONTyped = LimitByKeyFromJSONTyped;
function LimitByKeyToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'key': value['key'],
        'limit': value['limit'],
    };
}
exports.LimitByKeyToJSON = LimitByKeyToJSON;
//# sourceMappingURL=LimitByKey.js.map