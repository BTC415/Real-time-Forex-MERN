import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import { logger } from '../services/logger';
import { api } from '../services/api';

const UserStatusContext = createContext();

export const useUserStatus = () => useContext(UserStatusContext);

export const UserStatusProvider = ({ children }) => {
  const [userStatuses, setUserStatuses] = useState({});
  const { me, token } = useAuth();
  const socket = useSocket();

  const fetchInitialUserStatus = useCallback(async () => {
    if (!token) return;

    try {
      const statuses = await api.request('/api/users/status', {
        token,
        action: 'fetch user online statuses'
      });
      logger.info('Fetched user online statuses:', statuses);

      setUserStatuses(statuses);
    } catch (error) {
      console.error('Error fetching user online statuses:', error);
    }
  }, [token]);

  // Handle incoming status updates
  const handleStatusUpdate = useCallback(({ userId, status }) => {
    logger.info(`Received status update for user ${userId}: ${status}`);

    setUserStatuses((prevStatuses) => {
      const updatedStatuses = {
        ...prevStatuses,
        [userId]: status, // Use [userId] to dynamically set the key
      };
      logger.info(`Updated User Status:`, updatedStatuses); // Log the updated state here
      return updatedStatuses;
    });
  }, []);

  // Broadcast current user as online
  const broadcastOnlineStatus = useCallback(() => {
    if (socket && me?._id) {
      socket.emit('userOnline', me._id);
      logger.info(`Broadcasted user ${me._id} as online`);
    }
  }, [socket, me]);

  // Broadcast current user as offline
  const broadcastOfflineStatus = useCallback(() => {
    if (socket && me?._id) {
      socket.emit('userOffline', me._id);
      logger.info(`Broadcasted user ${me._id} as offline`);
    }
  }, [socket, me]);

  // Listen for server events and handle cleanup
  useEffect(() => {
    if (!socket) return;

    // Broadcast online status on connect
    broadcastOnlineStatus();
    fetchInitialUserStatus();

    socket.on('userStatusUpdate', handleStatusUpdate);

    // Cleanup listeners on unmount
    return () => {
      socket.off('userStatusUpdate', handleStatusUpdate);
      broadcastOfflineStatus(); // Mark user offline when unmounting
    };
  }, [socket, handleStatusUpdate, broadcastOnlineStatus, broadcastOfflineStatus]);

  return (
    <UserStatusContext.Provider value={{ userStatuses }}>
      {children}
    </UserStatusContext.Provider>
  );
};