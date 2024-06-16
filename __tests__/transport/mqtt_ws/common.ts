import jwt from "jsonwebtoken";
import {
    api,
    ITransport,
    JsonRpc,
    RpcResponse,
    EmptyResponse,
} from "../../../src/index";

export function get_server_url(): string {
    return process.env.MQTT_WS_URL || "ws://127.0.0.1:7081";
}

export function get_server_url_with_auth(): string {
    return process.env.MQTT_WS_URL || "ws://127.0.0.1:7082";
}

// Warning: Never create tokens on the client side in production code.
export function create_token(claims?: api.ModulesClaims): string {
    const token: api.JwtToken = { sub: "user", exp: 9223372036854775807 };

    if (claims) {
        token.connLimits = claims.connLimits;
        token.publish = claims.publish;
        token.rpc = claims.rpc;
        token.subscribe = claims.subscribe;
    }

    return jwt.sign(api.JwtTokenToJSON(token), "secret");
}

let stream_name_prefix = "ts_test_stream_";
let stream_counter = 0;

export async function create_stream(transport: ITransport): Promise<string> {
    let transport_state = transport.state();
    while (true) {
        const state = await transport_state.stream.next();
        if (state.value.cmd === "connected") {
            break;
        }
    }

    let stream_name = stream_name_prefix + stream_counter.toString();
    stream_counter++;

    let rpc = new JsonRpc(transport);

    let response = await rpc.call<RpcResponse<EmptyResponse>>(
        "streams/delete",
        { name: stream_name },
    );
    expect("ok" in response).toBe(true);

    response = await rpc.call<RpcResponse<EmptyResponse>>("streams/create", {
        name: stream_name,
    });
    expect("ok" in response).toBe(true);

    return stream_name;
}

test("", () => {});
