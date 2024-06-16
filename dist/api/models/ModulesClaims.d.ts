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
import type { RpcPermissions } from './RpcPermissions';
import type { LimitByKey } from './LimitByKey';
import type { PubPermissions } from './PubPermissions';
import type { SubPermissions } from './SubPermissions';
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
export declare function instanceOfModulesClaims(value: object): value is ModulesClaims;
export declare function ModulesClaimsFromJSON(json: any): ModulesClaims;
export declare function ModulesClaimsFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModulesClaims;
export declare function ModulesClaimsToJSON(value?: ModulesClaims | null): any;