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

import { mapValues } from '../runtime';
import type { RpcPermissions } from './RpcPermissions';
import {
    RpcPermissionsFromJSON,
    RpcPermissionsFromJSONTyped,
    RpcPermissionsToJSON,
} from './RpcPermissions';
import type { LimitByKey } from './LimitByKey';
import {
    LimitByKeyFromJSON,
    LimitByKeyFromJSONTyped,
    LimitByKeyToJSON,
} from './LimitByKey';
import type { PubPermissions } from './PubPermissions';
import {
    PubPermissionsFromJSON,
    PubPermissionsFromJSONTyped,
    PubPermissionsToJSON,
} from './PubPermissions';
import type { SubPermissions } from './SubPermissions';
import {
    SubPermissionsFromJSON,
    SubPermissionsFromJSONTyped,
    SubPermissionsToJSON,
} from './SubPermissions';

/**
 * 
 * @export
 * @interface ModulesClaims
 */
export interface ModulesClaims {
    /**
     * 
     * @type {Array<LimitByKey>}
     * @memberof ModulesClaims
     */
    connLimits?: Array<LimitByKey>;
    /**
     * 
     * @type {PubPermissions}
     * @memberof ModulesClaims
     */
    publish?: PubPermissions;
    /**
     * 
     * @type {RpcPermissions}
     * @memberof ModulesClaims
     */
    rpc?: RpcPermissions;
    /**
     * 
     * @type {SubPermissions}
     * @memberof ModulesClaims
     */
    subscribe?: SubPermissions;
}

/**
 * Check if a given object implements the ModulesClaims interface.
 */
export function instanceOfModulesClaims(value: object): value is ModulesClaims {
    return true;
}

export function ModulesClaimsFromJSON(json: any): ModulesClaims {
    return ModulesClaimsFromJSONTyped(json, false);
}

export function ModulesClaimsFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModulesClaims {
    if (json == null) {
        return json;
    }
    return {
        
        'connLimits': json['conn_limits'] == null ? undefined : ((json['conn_limits'] as Array<any>).map(LimitByKeyFromJSON)),
        'publish': json['publish'] == null ? undefined : PubPermissionsFromJSON(json['publish']),
        'rpc': json['rpc'] == null ? undefined : RpcPermissionsFromJSON(json['rpc']),
        'subscribe': json['subscribe'] == null ? undefined : SubPermissionsFromJSON(json['subscribe']),
    };
}

export function ModulesClaimsToJSON(value?: ModulesClaims | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'conn_limits': value['connLimits'] == null ? undefined : ((value['connLimits'] as Array<any>).map(LimitByKeyToJSON)),
        'publish': PubPermissionsToJSON(value['publish']),
        'rpc': RpcPermissionsToJSON(value['rpc']),
        'subscribe': SubPermissionsToJSON(value['subscribe']),
    };
}

