export type StateConnected = {
    cmd: "connected";
};

export type StateDisconnected = {
    cmd: "disconnected";
};

export type StateClosed = {
    cmd: "closed";
};

export type ConnectionState = StateConnected | StateDisconnected | StateClosed;
