
import { BroadCast } from "./../../src/sync/broadcast";

test('broadcast', async () => {

    const broadcast = new BroadCast<number>();
    const listener1 = broadcast.subscribe();

    const values1: number[] = [];
    const values2: number[] = [];

    const promise1 = (async () => {
        for await (const value of listener1.stream) {
            values1.push(value);
        }
    })();

    expect(broadcast.broadcast(1)).toBe(1);

    const listener2 = broadcast.subscribe();

    const promise2 = (async () => {
        for await (const value of listener2.stream) {
            values2.push(value);
        }
    })();

    expect(broadcast.broadcast(2)).toBe(2);
    expect(broadcast.broadcast(3)).toBe(2);

    listener1.cancel();
    listener2.cancel();

    await promise1;
    await promise2;

    expect(values1).toEqual([1, 2, 3]);
    expect(values2).toEqual([2, 3]);
});

test('broadcast cancel', async () => {

    const broadcast = new BroadCast<number>();
    const listener1 = broadcast.subscribe();

    expect(broadcast.broadcast(1)).toBe(1);

    listener1.cancel();

    expect(broadcast.broadcast(1)).toBe(0);

});