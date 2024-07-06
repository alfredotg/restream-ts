import {
    MqttWsTransport,
    Subscriber,
    SubError,
    SubErrorResponse,
    ExponentialReconnectStrategy,
    api,
} from "../../../src/index";

import assert from "assert";
import {
    create_stream,
    create_token,
    get_server_url,
    get_server_url_with_auth,
} from "./common";
import {
    CreateSubscriptionError,
    CreateSubscriptionErrorResponse,
} from "../../../src/transport/commands";
import { CreateSubscriptionErrorReason } from "../../../src/api";

test("connect", async () => {
    const transport = new MqttWsTransport({
        url: get_server_url(),
    });
    let state_stream = transport.state();
    let state = await state_stream.stream.next();
    expect(state.value.cmd).toBe("disconnected");
    state = await state_stream.stream.next();
    expect(state.value.cmd).toBe("connected");

    transport.close();
});

test("subscribe on closed", async () => {
    const transport = new MqttWsTransport({
        url: get_server_url(),
    });
    let state_stream = transport.state();
    let state = await state_stream.stream.next();
    expect(state.value.cmd).toBe("disconnected");
    state = await state_stream.stream.next();
    expect(state.value.cmd).toBe("connected");

    transport.close();

    state = await state_stream.stream.next();
    expect(state.value.cmd).toBe("closed");

    const subscriber = new Subscriber(transport);
    const stream = await subscriber.subscribe("test", {
        immediately: true,
    });

    assert(stream instanceof CreateSubscriptionError);
});

test("connect denied", async () => {
    const transport = new MqttWsTransport({
        url: get_server_url_with_auth(),
    });
    let state_stream = transport.state();
    let state = await state_stream.stream.next();
    expect(state.value.cmd).toBe("disconnected");

    transport.close();
});

test("connect with auth", async () => {
    const transport = new MqttWsTransport({
        url: get_server_url_with_auth(),
        tokenRefresh: async () => {
            return create_token();
        },
    });
    let state_stream = transport.state();
    let state = await state_stream.stream.next();
    expect(state.value.cmd).toBe("disconnected");
    state = await state_stream.stream.next();
    expect(state.value.cmd).toBe("connected");

    transport.close();
});

test("auth failed requires new token", async () => {
    let tokens = ["invalid", create_token()];

    const transport = new MqttWsTransport({
        url: get_server_url_with_auth(),
        tokenRefresh: async () => {
            return tokens.shift() ?? "";
        },
        reconnectStrategy: new ExponentialReconnectStrategy(1),
    });
    let state_stream = transport.state();
    let state = await state_stream.stream.next();
    expect(state.value.cmd).toBe("disconnected");
    state = await state_stream.stream.next();
    expect(state.value.cmd).toBe("connected");

    transport.close();
});

test("subscribe with permission", async () => {
    let stream_name: string;

    {
        const transport = new MqttWsTransport({
            url: get_server_url(),
        });

        stream_name = await create_stream(transport);

        transport.close();
    }

    let tokens = [
        create_token({
            subscribe: {
                subsLimits: [],
                topics: [{ topic: stream_name + "/test" }],
            },
        }),
    ];

    const transport = new MqttWsTransport({
        url: get_server_url_with_auth(),
        tokenRefresh: async () => {
            let token = tokens.shift() ?? null;
            if (token === null) {
                expect(false).toBe(true);
                throw new Error("No more tokens");
            }
            return token;
        },
    });

    let state_stream = transport.state();
    await state_stream.stream.next();
    const state = await state_stream.stream.next();
    expect(state.value.cmd).toBe("connected");

    const subscriber = new Subscriber(transport);
    let stream = await subscriber.subscribe(stream_name + "/test", {
        immediately: true,
    });

    expect(!(stream instanceof SubError)).toBe(true);

    stream = await subscriber.subscribe(stream_name + "/test2", {
        immediately: true,
    });

    expect(stream instanceof CreateSubscriptionError).toBe(true);
    const response = (stream as CreateSubscriptionError)
        .error as CreateSubscriptionErrorResponse;
    expect(response.reason_code).toBe(
        api.CreateSubscriptionErrorReason.Unauthorized,
    );

    await transport.close();
});
