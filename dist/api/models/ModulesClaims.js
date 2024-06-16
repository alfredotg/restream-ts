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
exports.ModulesClaimsToJSON = exports.ModulesClaimsFromJSONTyped = exports.ModulesClaimsFromJSON = exports.instanceOfModulesClaims = void 0;
const RpcPermissions_1 = require("./RpcPermissions");
const LimitByKey_1 = require("./LimitByKey");
const PubPermissions_1 = require("./PubPermissions");
const SubPermissions_1 = require("./SubPermissions");
/**
 * Check if a given object implements the ModulesClaims interface.
 */
function instanceOfModulesClaims(value) {
    return true;
}
exports.instanceOfModulesClaims = instanceOfModulesClaims;
function ModulesClaimsFromJSON(json) {
    return ModulesClaimsFromJSONTyped(json, false);
}
exports.ModulesClaimsFromJSON = ModulesClaimsFromJSON;
function ModulesClaimsFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'connLimits': json['conn_limits'] == null ? undefined : (json['conn_limits'].map(LimitByKey_1.LimitByKeyFromJSON)),
        'publish': json['publish'] == null ? undefined : (0, PubPermissions_1.PubPermissionsFromJSON)(json['publish']),
        'rpc': json['rpc'] == null ? undefined : (0, RpcPermissions_1.RpcPermissionsFromJSON)(json['rpc']),
        'subscribe': json['subscribe'] == null ? undefined : (0, SubPermissions_1.SubPermissionsFromJSON)(json['subscribe']),
    };
}
exports.ModulesClaimsFromJSONTyped = ModulesClaimsFromJSONTyped;
function ModulesClaimsToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'conn_limits': value['connLimits'] == null ? undefined : (value['connLimits'].map(LimitByKey_1.LimitByKeyToJSON)),
        'publish': (0, PubPermissions_1.PubPermissionsToJSON)(value['publish']),
        'rpc': (0, RpcPermissions_1.RpcPermissionsToJSON)(value['rpc']),
        'subscribe': (0, SubPermissions_1.SubPermissionsToJSON)(value['subscribe']),
    };
}
exports.ModulesClaimsToJSON = ModulesClaimsToJSON;