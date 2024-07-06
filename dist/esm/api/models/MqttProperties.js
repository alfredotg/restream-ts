export const MqttProperties = {
    SubId: "sub_id",
    Offset: "offset",
    Recoverable: "recoverable",
    Status: "status",
    ErrorReason: "error_reason",
};
export function instanceOfMqttProperties(value) {
    for (const key in MqttProperties) {
        if (Object.prototype.hasOwnProperty.call(MqttProperties, key)) {
            if (MqttProperties[key] ===
                value) {
                return true;
            }
        }
    }
    return false;
}
export function MqttPropertiesFromJSON(json) {
    return MqttPropertiesFromJSONTyped(json, false);
}
export function MqttPropertiesFromJSONTyped(json, ignoreDiscriminator) {
    return json;
}
export function MqttPropertiesToJSON(value) {
    return value;
}
//# sourceMappingURL=MqttProperties.js.map