export type Connected = {
    cmd: "connected";
};

export type Disconnected = {
    cmd: "disconnected";
};

export type Closed = {
    cmd: "closed";
};

export type ConnectionState = Connected | Disconnected | Closed;
