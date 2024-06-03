import { MPSCStream } from "../../src/sync/mpsc";
import { FrozenClock } from "../../src/time/clock";
import { ConnectionState } from "../../src/transport/connection_state";
import { ExponentialReconnectStrategy } from "../../src/transport/reconnect";

describe("Exponential Reconnect Strategy", () => {
    beforeEach(() => {});

    test("disconnect right after connected", async () => {
        // arrange
        const state = new MPSCStream<ConnectionState>();
        let connectCalls = 0;
        const connect = async () => {
            state.push({ cmd: "connected" });
            connectCalls++;
            if (connectCalls >= 3) {
                state.push({ cmd: "closed" });
            } else {
                state.push({ cmd: "disconnected" });
            }
        };

        const strategy = new ExponentialReconnectStrategy(1, 100, 3);
        strategy.clock = new FrozenClock();

        // act
        state.push({ cmd: "disconnected" });
        const promise = strategy.run(state, connect);

        await promise;

        // assert
        expect(connectCalls).toBe(3);
        expect(strategy.clock.now()).toBe(2);
    });

    test("failed to connect", async () => {
        // arrange
        const state = new MPSCStream<ConnectionState>();
        let connectCalls = 0;
        const connect = async () => {
            connectCalls++;

            if (connectCalls >= 3) {
                state.push({ cmd: "closed" });
                return;
            }
            throw new Error("failed to connect");
        };

        const strategy = new ExponentialReconnectStrategy(1, 100, 3);
        strategy.clock = new FrozenClock();

        // act
        state.push({ cmd: "disconnected" });
        const promise = strategy.run(state, connect);

        await promise;

        // assert
        expect(connectCalls).toBe(3);
        expect(strategy.clock.now()).toBe(6);
    });
});
