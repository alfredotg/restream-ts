"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttProperties = void 0;
exports.instanceOfMqttProperties = instanceOfMqttProperties;
exports.MqttPropertiesFromJSON = MqttPropertiesFromJSON;
exports.MqttPropertiesFromJSONTyped = MqttPropertiesFromJSONTyped;
exports.MqttPropertiesToJSON = MqttPropertiesToJSON;
exports.MqttProperties = {
    SubId: "sub_id",
    Offset: "offset",
    Recoverable: "recoverable",
    Status: "status",
    ErrorReason: "error_reason",
};
function instanceOfMqttProperties(value) {
    for (const key in exports.MqttProperties) {
        if (Object.prototype.hasOwnProperty.call(exports.MqttProperties, key)) {
            if (exports.MqttProperties[key] ===
                value) {
                return true;
            }
        }
    }
    return false;
}
function MqttPropertiesFromJSON(json) {
    return MqttPropertiesFromJSONTyped(json, false);
}
function MqttPropertiesFromJSONTyped(json, ignoreDiscriminator) {
    return json;
}
function MqttPropertiesToJSON(value) {
    return value;
}
//# sourceMappingURL=MqttProperties.js.map