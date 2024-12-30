import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { messageService } from '../services/messageService';
import { useAlert } from '../context/AlertContext';
import { logger } from '../services/logger';

export function useMessages(channelId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const socket = useSocket();
  const { showAlert } = useAlert();

  const fetchMessages = useCallback(async () => {
    if (!channelId || !token) return;

    setLoading(true);
    try {
      const fetchedMessages = await messageService.fetchMessages(channelId, token);
      setMessages(fetchedMessages);
    } catch (error) {
      showAlert('Failed to fetch messages', 'error');
    } finally {
      setLoading(false);
    }
  }, [channelId, token, showAlert]);

  const sendMessage = useCallback(async (messageText) => {
    if (!channelId || !token) {
      throw new Error('Cannot send message: missing channelId or token');
    }

    try {
      const newMessage = await messageService.sendMessage(channelId, messageText, token);
      // Don't add the message here as it will come through the socket
      return newMessage;
    } catch (error) {
      showAlert('Failed to send message', 'error');
      throw error;
    }
  }, [channelId, token, showAlert]);

  const handleNewMessage = useCallback((message) => {
    logger.info('Received new message:', message.message);
    setMessages((prev) => {
      if (prev.some((m) => m._id === message._id)) {
        logger.info('Message already exists, skipping');
        return prev;
      }
      return [...prev, message];
    });
  }, []);

  useEffect(() => {
    if (!socket || !channelId) return;

    socket.on('newMessage', ({ message }) => {
      handleNewMessage(message);
    });

    return () => {
      socket.off('newMessage');
    };
  }, [socket, channelId, handleNewMessage]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    sendMessage,
    fetchMessages,
    setMessages,
  };
}
