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
exports.SubPermissionToJSON = exports.SubPermissionFromJSONTyped = exports.SubPermissionFromJSON = exports.instanceOfSubPermission = void 0;
/**
 * Check if a given object implements the SubPermission interface.
 */
function instanceOfSubPermission(value) {
    if (!('topic' in value) || value['topic'] === undefined)
        return false;
    return true;
}
exports.instanceOfSubPermission = instanceOfSubPermission;
function SubPermissionFromJSON(json) {
    return SubPermissionFromJSONTyped(json, false);
}
exports.SubPermissionFromJSON = SubPermissionFromJSON;
function SubPermissionFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'topic': json['topic'],
    };
}
exports.SubPermissionFromJSONTyped = SubPermissionFromJSONTyped;
function SubPermissionToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'topic': value['topic'],
    };
}
exports.SubPermissionToJSON = SubPermissionToJSON;
