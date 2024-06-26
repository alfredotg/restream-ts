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
import type { SubPermission } from './SubPermission';
import {
    SubPermissionFromJSON,
    SubPermissionFromJSONTyped,
    SubPermissionToJSON,
} from './SubPermission';
import type { LimitByKey } from './LimitByKey';
import {
    LimitByKeyFromJSON,
    LimitByKeyFromJSONTyped,
    LimitByKeyToJSON,
} from './LimitByKey';

/**
 * 
 * @export
 * @interface SubPermissions
 */
export interface SubPermissions {
    /**
     * 
     * @type {Array<LimitByKey>}
     * @memberof SubPermissions
     */
    subsLimits: Array<LimitByKey>;
    /**
     * 
     * @type {Array<SubPermission>}
     * @memberof SubPermissions
     */
    topics: Array<SubPermission>;
}

/**
 * Check if a given object implements the SubPermissions interface.
 */
export function instanceOfSubPermissions(value: object): value is SubPermissions {
    if (!('subsLimits' in value) || value['subsLimits'] === undefined) return false;
    if (!('topics' in value) || value['topics'] === undefined) return false;
    return true;
}

export function SubPermissionsFromJSON(json: any): SubPermissions {
    return SubPermissionsFromJSONTyped(json, false);
}

export function SubPermissionsFromJSONTyped(json: any, ignoreDiscriminator: boolean): SubPermissions {
    if (json == null) {
        return json;
    }
    return {
        
        'subsLimits': ((json['subs_limits'] as Array<any>).map(LimitByKeyFromJSON)),
        'topics': ((json['topics'] as Array<any>).map(SubPermissionFromJSON)),
    };
}

export function SubPermissionsToJSON(value?: SubPermissions | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'subs_limits': ((value['subsLimits'] as Array<any>).map(LimitByKeyToJSON)),
        'topics': ((value['topics'] as Array<any>).map(SubPermissionToJSON)),
    };
}

