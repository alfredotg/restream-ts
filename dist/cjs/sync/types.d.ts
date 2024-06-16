export type CancelableStream<T> = {
    cancel: () => void;
    stream: AsyncGenerator<T>;
};
