import { useEffect, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAlert } from '../context/AlertContext';

export function useSocketEvents() {
  const socket = useSocket();
  const { showAlert } = useAlert();

  const emitEvent = useCallback((eventName, data) => {
    if (socket) {
      socket.emit(eventName, data);
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      const handleError = (error) => {
        showAlert(error.message || 'Socket error occurred', 'error');
      };

      const handleReconnect = () => {
        showAlert('Reconnected to server', 'success');
      };

      const handleDisconnect = () => {
        showAlert('Lost connection to server', 'error');
      };

      socket.on('error', handleError);
      socket.on('reconnect', handleReconnect);
      socket.on('disconnect', handleDisconnect);

      return () => {
        socket.off('error', handleError);
        socket.off('reconnect', handleReconnect);
        socket.off('disconnect', handleDisconnect);
      };
    }
  }, [socket, showAlert]);

  return { emitEvent };
}