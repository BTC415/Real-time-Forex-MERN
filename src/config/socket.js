export const SOCKET_CONFIG = {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
  transports: ['websocket', 'polling']
};

export const SOCKET_EVENTS = {
  MESSAGE: 'message',
  USER_JOINED: 'userJoined',
  USER_LEFT: 'userLeft',
  FOREX_UPDATES: 'forexUpdates',
  CHANNEL_UPDATED: 'channelUpdated'
};