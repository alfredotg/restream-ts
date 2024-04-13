
export type Connected = {
    cmd: 'connected';
};

export type Disconnected = {
    cmd: 'disconnected';
};

export type ConnectionState = Connected | Disconnected;