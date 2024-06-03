import { Subscribe } from "./transport/commands";
import { MqttWsTransport } from "./transport/mqtt_ws";

export function divide(a: number, b: number): number {
    if (b === 0) throw new Error("Cannot divide by zero");
    return a / b;
}
