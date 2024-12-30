import { api } from './api';
import { logger } from './logger';

export const channelService = {
  async getChannels(token) {
    try {
      return await api.request('/api/channels', {
        token,
        action: 'fetch channels'
      });
    } catch (error) {
      logger.error('Failed to fetch channels:', error);
      throw error;
    }
  },

  async createChannel(data, token) {
    try {
      return await api.request('/api/channels', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
        action: 'create channel'
      });
    } catch (error) {
      logger.error('Failed to create channel:', error);
      throw error;
    }
  },

  async updateChannel(channelId, data, token) {
    try {
      return await api.request(`/api/channels/${channelId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
        action: 'update channel'
      });
    } catch (error) {
      logger.error('Failed to update channel:', error);
      throw error;
    }
  },

  async deleteChannel(channelId, token) {
    try {
      return await api.request(`/api/channels/${channelId}`, {
        method: 'DELETE',
        token,
        action: 'delete channel'
      });
    } catch (error) {
      logger.error('Failed to delete channel:', error);
      throw error;
    }
  },

  async joinChannel(channelId, token) {
    try {
      return await api.request(`/api/channels/${channelId}/join`, {
        method: 'POST',
        token,
        action: 'join channel'
      });
    } catch (error) {
      logger.error('Failed to join channel:', error);
      throw error;
    }
  },

  async leaveChannel(channelId, token) {
    try {
      return await api.request(`/api/channels/${channelId}/leave`, {
        method: 'POST',
        token,
        action: 'leave channel'
      });
    } catch (error) {
      logger.error('Failed to leave channel:', error);
      throw error;
    }
  }
};