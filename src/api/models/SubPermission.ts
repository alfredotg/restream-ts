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
/**
 * 
 * @export
 * @interface SubPermission
 */
export interface SubPermission {
    /**
     * 
     * @type {string}
     * @memberof SubPermission
     */
    topic: string;
}

/**
 * Check if a given object implements the SubPermission interface.
 */
export function instanceOfSubPermission(value: object): value is SubPermission {
    if (!('topic' in value) || value['topic'] === undefined) return false;
    return true;
}

export function SubPermissionFromJSON(json: any): SubPermission {
    return SubPermissionFromJSONTyped(json, false);
}

export function SubPermissionFromJSONTyped(json: any, ignoreDiscriminator: boolean): SubPermission {
    if (json == null) {
        return json;
    }
    return {
        
        'topic': json['topic'],
    };
}

export function SubPermissionToJSON(value?: SubPermission | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'topic': value['topic'],
    };
}

