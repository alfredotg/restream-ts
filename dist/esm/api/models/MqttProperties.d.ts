export declare const MqttProperties: {
    readonly SubId: "sub_id";
    readonly Offset: "offset";
    readonly Recoverable: "recoverable";
    readonly Status: "status";
    readonly ErrorReason: "error_reason";
};
export type MqttProperties = (typeof MqttProperties)[keyof typeof MqttProperties];
export declare function instanceOfMqttProperties(value: any): boolean;
export declare function MqttPropertiesFromJSON(json: any): MqttProperties;
export declare function MqttPropertiesFromJSONTyped(json: any, ignoreDiscriminator: boolean): MqttProperties;
export declare function MqttPropertiesToJSON(value?: MqttProperties | null): any;
