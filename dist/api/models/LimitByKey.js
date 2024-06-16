"use strict";
/* tslint:disable */
/* eslint-disable */
/**
 * restream
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LimitByKeyToJSON = exports.LimitByKeyFromJSONTyped = exports.LimitByKeyFromJSON = exports.instanceOfLimitByKey = void 0;
/**
 * Check if a given object implements the LimitByKey interface.
 */
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