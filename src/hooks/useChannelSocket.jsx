import { useEffect, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { logger } from '../services/logger';

export function useChannelSocket({ channelId, onMessage }) {
  const socket = useSocket();

  const joinChannel = useCallback(() => {
    if (socket && channelId) {
      socket.emit('joinChannel', channelId);
      logger.info(`Joined channel: ${channelId}`);
    }
  }, [socket, channelId]);

  const leaveChannel = useCallback(() => {
    if (socket && channelId) {
      socket.emit('leaveChannel', channelId);
      logger.info(`Left channel: ${channelId}`);
    }
  }, [socket, channelId]);

  useEffect(() => {
    if (!socket) return;

    // Join channel on mount
    joinChannel();

    // Listen for messages in this channel
    socket.on('message', (message) => {
      if (message.channelId === channelId) {
        onMessage(message);
      }
    });

    // Cleanup on unmount
    return () => {
      leaveChannel();
      socket.off('message');
    };
  }, [socket, channelId, joinChannel, leaveChannel, onMessage]);

  return { joinChannel, leaveChannel };
}