import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { logger } from '../services/logger';
import { SOCKET_CONFIG } from '../config/socket';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    let newSocket = null;

    if (token) {
      logger.info('Initializing socket connection');
      newSocket = io(import.meta.env.VITE_API_URL, {
        auth: { token },
        ...SOCKET_CONFIG
      });

      newSocket.on('connect', () => {
        logger.info('Socket connected successfully');
      });

      newSocket.on('connect_error', (error) => {
        logger.error('Socket connection error:', error);
      });

      newSocket.on('disconnect', (reason) => {
        logger.warn('Socket disconnected:', reason);
      });

      setSocket(newSocket);
    }

    return () => {
      if (newSocket) {
        logger.info('Closing socket connection');
        newSocket.disconnect();
        setSocket(null);
      }
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};