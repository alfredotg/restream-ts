
export type CancebleStream<T> = {
    cancel: () => void;
    stream: AsyncGenerator<T>;
}