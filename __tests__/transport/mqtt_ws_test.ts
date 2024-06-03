import { IncomingMessage, SubError } from "../../src/transport/commands";
import { MqttWsTransport } from "./../../src/transport/mqtt_ws";
import { Logger } from "tslog";
import { JsonRpc } from "../../src/rpc/json_rpc";
import { EmptyResponse, RpcResponse } from "../../src/rpc/types";
import assert from "assert";
import { Publisher } from "../../src/publish/publisher";
import { Subscriber } from "../../src/subscribe/subscriber";
import mqtt from "mqtt";

function get_server_url(): string {
    return process.env.MQTT_WS_URL || "ws://127.0.0.1:8083";
}

test("connect", async () => {
    const transport = new MqttWsTransport({
        url: get_server_url(),
        logger: new Logger(),
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
        logger: new Logger(),
    });
    let state_stream = transport.state();
    let state = await state_stream.stream.next();
    expect(state.value.cmd).toBe("disconnected");
    state = await state_stream.stream.next();
    expect(state.value.cmd).toBe("connected");

    transport.close();

    state = await state_stream.stream.next();
    expect(state.value.cmd).toBe("disconnected");

    const subscriber = new Subscriber(transport);
    const stream = await subscriber.subscribe("test", {
        immediately: true,
    });

    assert(stream instanceof SubError);
});

describe("Subscriptions", () => {
    let transport: MqttWsTransport | null = null;
    let stream_name_prefix = "ts_test_stream_";
    let stream_counter = 0;
    let stream_name: string | null = null;
    let rpc: JsonRpc | null = null;

    beforeEach(() => {
        return (async function () {
            transport = new MqttWsTransport({
                url: get_server_url(),
                logger: new Logger(),
            });
            let state_stream = transport.state();
            await state_stream.stream.next();
            const state = await state_stream.stream.next();
            expect(state.value.cmd).toBe("connected");

            stream_name = stream_name_prefix + stream_counter.toString();
            stream_counter++;

            rpc = new JsonRpc(transport);

            let response = await rpc.call<RpcResponse<EmptyResponse>>(
                "streams/delete",
                { name: stream_name },
            );
            expect("ok" in response).toBe(true);

            response = await rpc.call<RpcResponse<EmptyResponse>>(
                "streams/create",
                {
                    name: stream_name,
                },
            );
            expect("ok" in response).toBe(true);
        })();
    });

    afterEach(() => {
        return (async function () {
            transport?.close();
        })();
    });

    test("subscribe", async () => {
        if (transport === null || stream_name === null) {
            assert.fail("transport or stream_name is null");
        }
        const publisher = new Publisher(transport);
        const subscriber = new Subscriber(transport);

        const sub = await subscriber.subscribe(stream_name + "/test1");
        assert(!(sub instanceof SubError));
        expect(transport.sub_count()).toBe(1);

        const pubRes = await publisher.publish(
            stream_name + "/test1",
            Buffer.from("message 1"),
        );
        expect(pubRes).toBe(undefined);

        const value: IncomingMessage = (await sub.stream.next()).value;
        expect(value.cmd).toBe("message");
        expect(value.topic).toBe(stream_name + "/test1");
        expect(value.message.toString()).toBe("message 1");
    });

    test("unsubscribe", async () => {
        if (transport === null || stream_name === null) {
            assert.fail("transport or stream_name is null");
        }
        const subscriber = new Subscriber(transport);

        const stream = await subscriber.subscribe(stream_name + "/test1");
        assert(!(stream instanceof SubError));
        expect(transport.sub_count()).toBe(1);

        stream.cancel();
    });

    test("subscribe offset", async () => {
        if (transport === null || stream_name === null) {
            assert.fail("transport or stream_name is null");
        }
        const publisher = new Publisher(transport);
        const subscriber = new Subscriber(transport);

        for (let i = 0; i < 3; i++) {
            const pubRes = await publisher.publish(
                stream_name + "/test1",
                Buffer.from("message " + i),
            );
            expect(pubRes).toBe(undefined);
        }

        const sub = await subscriber.subscribe(stream_name + "/test1", {
            offset: 1,
        });
        assert(!(sub instanceof SubError));

        const first: IncomingMessage = (await sub.stream.next()).value;
        expect(first.cmd).toBe("message");
        expect(first.topic).toBe(stream_name + "/test1");
        expect(first.message.toString()).toBe("message 1");

        const second: IncomingMessage = (await sub.stream.next()).value;
        expect(second.cmd).toBe("message");
        expect(second.message.toString()).toBe("message 2");
    });

    test("unsubscribe on break", async () => {
        if (transport === null || stream_name === null) {
            assert.fail("transport or stream_name is null");
        }
        const subscriber = new Subscriber(transport);
        const publisher = new Publisher(transport);

        const sub = await subscriber.subscribe(stream_name + "/test1");
        assert(!(sub instanceof SubError));
        expect(transport.sub_count()).toBe(1);

        await publisher.publish(stream_name + "/test1", Buffer.from("message"));

        for await (const _ of sub.stream) {
            break;
        }

        expect(transport.sub_count()).toBe(0);

        await transport.close();
    });

    test("recoverable offset pings", async () => {
        if (transport === null || stream_name === null) {
            assert.fail("transport or stream_name is null");
        }
        const subscriber = new Subscriber(transport);

        const sub = await subscriber.subscribe(
            stream_name + "/test/" + Math.random() * 10000,
            { recoverable: true },
        );
        assert(!(sub instanceof SubError));
        expect(transport.sub_count()).toBe(1);

        const value: IncomingMessage = (await sub.stream.next()).value;

        expect(value.cmd).toBe("message");
        expect(value.topic).toBe("");
        expect(value.message.toString()).toBe("");
        expect(value.offset).toBe(0);
    });
});
