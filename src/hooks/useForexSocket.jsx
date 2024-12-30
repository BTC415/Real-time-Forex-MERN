import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { logger } from '../services/logger';

export function useForexSocket({ onPriceUpdate }) {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Listen for forex updates
    socket.on('forexUpdates', (updates) => {
      logger.info('Received forex updates:', updates);
      onPriceUpdate(updates);
    });

    // Cleanup
    return () => {
      socket.off('forexUpdates');
    };
  }, [socket, onPriceUpdate]);

  return {};
}