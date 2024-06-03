import { Watch } from "./../../src/sync/watch";

test("watch", async () => {
    const watch = new Watch<number>(10);

    expect(watch.set(1)).toBe(0);

    const listener1 = watch.subscribe();

    expect(watch.set(2)).toBe(1);

    const listener2 = watch.subscribe();

    expect(watch.set(3)).toBe(2);

    const result1 = await listener1.stream.next();
    const result2 = await listener2.stream.next();

    expect(result1.value).toEqual(3);
    expect(result2.value).toEqual(3);
});

test("first set", async () => {
    const watch = new Watch<number>(10);

    const listener = watch.subscribe();

    const stream = listener.stream;
    const result = await stream.next();

    expect(result.value).toBe(10);
});

test("unsubscribe on break", async () => {
    const watch = new Watch<number>(10);

    const listener = watch.subscribe();

    expect(watch.listenersLength()).toBe(1);

    for await (const _ of listener.stream) {
        break;
    }

    expect(watch.listenersLength()).toBe(0);
});
