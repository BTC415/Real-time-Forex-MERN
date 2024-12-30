import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAlert } from '../context/AlertContext';
import { SOCKET_EVENTS } from '../config/socket';
import { logger } from '../services/logger';

export function useRealTimeUpdates({
  onMessage,
  onUserJoin,
  onUserLeave,
  onForexUpdate,
  onChannelUpdate
}) {
  const socket = useSocket();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (!socket) return;

    const eventHandlers = {
      [SOCKET_EVENTS.MESSAGE]: (data) => {
        onMessage?.(data);
      },
      [SOCKET_EVENTS.USER_JOINED]: (data) => {
        onUserJoin?.(data);
        showAlert(`${data.name} joined the channel`, 'info');
      },
      [SOCKET_EVENTS.USER_LEFT]: (data) => {
        onUserLeave?.(data);
        showAlert(`${data.name} left the channel`, 'info');
      },
      [SOCKET_EVENTS.FOREX_UPDATES]: (data) => {
        onForexUpdate?.(data);
      },
      [SOCKET_EVENTS.CHANNEL_UPDATED]: (data) => {
        onChannelUpdate?.(data);
      }
    };

    // Register event handlers
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    // Cleanup
    return () => {
      Object.keys(eventHandlers).forEach(event => {
        socket.off(event);
      });
      logger.info('Cleaned up real-time event listeners');
    };
  }, [socket, onMessage, onUserJoin, onUserLeave, onForexUpdate, onChannelUpdate]);

  return socket;
}