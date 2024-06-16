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
exports.RpcPermissionToJSON = exports.RpcPermissionFromJSONTyped = exports.RpcPermissionFromJSON = exports.instanceOfRpcPermission = void 0;
/**
 * Check if a given object implements the RpcPermission interface.
 */
function instanceOfRpcPermission(value) {
    if (!('topic' in value) || value['topic'] === undefined)
        return false;
    return true;
}
exports.instanceOfRpcPermission = instanceOfRpcPermission;
function RpcPermissionFromJSON(json) {
    return RpcPermissionFromJSONTyped(json, false);
}
exports.RpcPermissionFromJSON = RpcPermissionFromJSON;
function RpcPermissionFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'topic': json['topic'],
    };
}
exports.RpcPermissionFromJSONTyped = RpcPermissionFromJSONTyped;
function RpcPermissionToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'topic': value['topic'],
    };
}
exports.RpcPermissionToJSON = RpcPermissionToJSON;
