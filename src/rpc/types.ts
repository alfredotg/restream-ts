export type RpcResponse<T> =
    | { ok: T }
    | { error: { message: string; details?: string } };

export type EmptyResponse = {};
