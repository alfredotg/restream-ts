
import { MPSCStream } from "./../../src/sync/mpsc";

test('push stream', async () => {

    const stream = new MPSCStream<number>();
    const generator = stream.stream;
    const values: number[] = [];
    const promise = (async () => {
        for await (const value of generator) {
            values.push(value);
        }
    })();

    stream.push(1);
    stream.push(2);
    stream.push(3);
    stream.cancel();
    await promise;

    expect(values).toEqual([1, 2, 3]);
});

test('push stream empty', async () => {

    const stream = new MPSCStream<number>();
    const generator = stream.stream;
    const values: number[] = [];
    const promise = (async () => {
        for await (const value of generator) {
            values.push(value);
        }
    })();

    stream.cancel();
    await promise;

    expect(values).toEqual([]);
});

test('push stream restart', async () => {

    const stream = new MPSCStream<number>();
    const generator = stream.stream;

    const promise = generator.next();
    stream.push(1);
    let value = await promise;
    
    expect(value.value).toBe(1);

    stream.push(2);
    stream.push(3);

    value = await generator.next();
    expect(value.value).toBe(2);

    value = await generator.next();
    expect(value.value).toBe(3);
});