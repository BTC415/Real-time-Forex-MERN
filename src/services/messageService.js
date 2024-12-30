import { api } from './api';
import { logger } from './logger';

export const messageService = {
  async sendMessage(channelId, messageText, token) {
    try {
      return await api.request(`/api/channels/${channelId}/messages`, {
        method: 'POST',
        body: JSON.stringify(messageText),
        token,
        action: 'send messages'
      });
    } catch (error) {
      logger.error('Failed to send messages:', error);
      throw error;
    }
  },

  async fetchMessages(channelId, token) {
      try {
        return await api.request(`/api/channels/${channelId}/messages`, {
          token,
          action: 'fetch messages'
        });
      } catch (error) {
        logger.error('Failed to fetch messages:', error);
        throw error;
      }
  },
};