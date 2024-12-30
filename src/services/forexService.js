import { api } from './api';
import { logger } from './logger';

export const forexService = {
  async getLatestPrices(token) {
    try {
      return await api.request('/api/forex/history', {
        token,
        action: 'fetch forex price history'
      });
    } catch (error) {
      logger.error('Failed to fetch forex prices:', error);
      throw error;
    }
  }
};