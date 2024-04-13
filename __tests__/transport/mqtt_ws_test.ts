import { MqttWsTransport } from "./../../src/transport/mqtt_ws";
import { Logger } from "tslog";

function get_server_url(): string {
    return process.env.MQTT_WS_URL || "ws://127.0.0.1:8083";
}

test('connect', async () => {
    const transport = new MqttWsTransport({
        url: get_server_url(),
        logger: new Logger(),
    });
    let state_stream = transport.state();
    let state = await state_stream.stream.next();
    expect(state.value.cmd).toBe("connected");
    transport.close();
});