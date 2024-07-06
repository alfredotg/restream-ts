import {
    IncomingMessage,
    SubError,
    SubErrorResponse,
    MqttWsTransport,
    Publisher,
    Subscriber,
    api,
} from "../../../src/index";

import { Logger } from "tslog";
import assert from "assert";
import { create_stream, get_server_url } from "./common";
import {
    CreateSubscriptionError,
    CreateSubscriptionErrorResponse,
} from "../../../src/transport/commands";

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

describe("Subscriptions", () => {
    let transport: MqttWsTransport | null = null;
    let stream_name: string | null = null;

    beforeEach(() => {
        return (async function () {
            transport = new MqttWsTransport({
                url: get_server_url(),
            });
            stream_name = await create_stream(transport);
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
        assert(!(sub instanceof CreateSubscriptionError));
        expect(transport.subCount()).toBe(1);

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
        assert(!(stream instanceof CreateSubscriptionError));
        expect(transport.subCount()).toBe(1);

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
        assert(!(sub instanceof CreateSubscriptionError));

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
        assert(!(sub instanceof CreateSubscriptionError));
        expect(transport.subCount()).toBe(1);

        await publisher.publish(stream_name + "/test1", Buffer.from("message"));

        for await (const _ of sub.stream) {
            break;
        }

        expect(transport.subCount()).toBe(0);

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
        assert(!(sub instanceof CreateSubscriptionError));
        expect(transport.subCount()).toBe(1);

        const value: IncomingMessage = (await sub.stream.next()).value;

        expect(value.cmd).toBe("message");
        expect(value.topic).toBe("");
        expect(value.message.toString()).toBe("");
        expect(value.offset).toBe(0);
    });

    test("stream not found", async () => {
        if (transport === null || stream_name === null) {
            assert.fail("transport or stream_name is null");
        }
        const subscriber = new Subscriber(transport);

        const sub = await subscriber.subscribe(stream_name + "_NOT_FOUND/1111");
        expect(sub).toBeInstanceOf(CreateSubscriptionError);
        const response = (sub as CreateSubscriptionError)
            .error as CreateSubscriptionErrorResponse;
        expect(response.reason_code).toBe(
            api.CreateSubscriptionErrorReason.NotFound,
        );
    });

    test("lagging", async () => {
        if (transport === null) {
            assert.fail("transport is null");
        }

        const subscriber = new Subscriber(transport);
        const sub = await subscriber.subscribe("rs_debug/error/lagging");

        assert(!(sub instanceof CreateSubscriptionError));

        const error: SubError = (await sub.stream.next()).value;

        expect(error.error).toBeInstanceOf(SubErrorResponse);
        expect((error.error as SubErrorResponse).reason_code).toBe(
            api.SubscriptionErrorReason.Lagging,
        );
    });

    test("close transport", async () => {
        if (transport === null || stream_name === null) {
            assert.fail("transport or stream_name is null");
        }

        const subscriber = new Subscriber(transport);
        const sub = await subscriber.subscribe(stream_name + "/test1");

        assert(!(sub instanceof CreateSubscriptionError));

        const next = sub.stream.next();

        transport.close();

        const error: SubError = (await next).value;
        assert(error.error instanceof Error);
    });
});
