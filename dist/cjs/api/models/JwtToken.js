"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfJwtToken = instanceOfJwtToken;
exports.JwtTokenFromJSON = JwtTokenFromJSON;
exports.JwtTokenFromJSONTyped = JwtTokenFromJSONTyped;
exports.JwtTokenToJSON = JwtTokenToJSON;
const RpcPermissions_1 = require("./RpcPermissions");
const LimitByKey_1 = require("./LimitByKey");
const PubPermissions_1 = require("./PubPermissions");
const SubPermissions_1 = require("./SubPermissions");
function instanceOfJwtToken(value) {
    if (!('sub' in value) || value['sub'] === undefined)
        return false;
    if (!('exp' in value) || value['exp'] === undefined)
        return false;
    return true;
}
function JwtTokenFromJSON(json) {
    return JwtTokenFromJSONTyped(json, false);
}
function JwtTokenFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'connLimits': json['conn_limits'] == null ? undefined : (json['conn_limits'].map(LimitByKey_1.LimitByKeyFromJSON)),
        'publish': json['publish'] == null ? undefined : (0, PubPermissions_1.PubPermissionsFromJSON)(json['publish']),
        'rpc': json['rpc'] == null ? undefined : (0, RpcPermissions_1.RpcPermissionsFromJSON)(json['rpc']),
        'subscribe': json['subscribe'] == null ? undefined : (0, SubPermissions_1.SubPermissionsFromJSON)(json['subscribe']),
        'sub': json['sub'],
        'exp': json['exp'],
    };
}
function JwtTokenToJSON(value) {
    if (value == null) {
        return value;
    }
    return {
        'conn_limits': value['connLimits'] == null ? undefined : (value['connLimits'].map(LimitByKey_1.LimitByKeyToJSON)),
        'publish': (0, PubPermissions_1.PubPermissionsToJSON)(value['publish']),
        'rpc': (0, RpcPermissions_1.RpcPermissionsToJSON)(value['rpc']),
        'subscribe': (0, SubPermissions_1.SubPermissionsToJSON)(value['subscribe']),
        'sub': value['sub'],
        'exp': value['exp'],
    };
}
//# sourceMappingURL=JwtToken.js.map