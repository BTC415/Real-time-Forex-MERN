import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { forexService } from '../services/forexService';
import { CURRENCY_PAIRS } from '../utils/forexConstants';

const MAX_HISTORY_POINTS = 50;

export function useForexPrices() {
  const [prices, setPrices] = useState({});
  const [priceHistory, setPriceHistory] = useState(
    Object.fromEntries(CURRENCY_PAIRS.map(pair => [pair, []]))
  );
  const { token } = useAuth();
  const { showAlert } = useAlert();

  const updatePrices = useCallback((updates) => {
    const timestamp = new Date().toISOString();
    const newPrices = {};

    updates.forEach(update => {
      const priceUpdate = { ...update, timestamp };
      newPrices[update.pair] = priceUpdate;

      setPriceHistory(prev => ({
        ...prev,
        [update.pair]: [...(prev[update.pair] || []), priceUpdate].slice(-MAX_HISTORY_POINTS)
      }));
    });

    setPrices(prev => ({ ...prev, ...newPrices }));
  }, []);

  const fetchInitialPrices = useCallback(async () => {
    if (!token) return;

    try {
      const histories = await forexService.getLatestPrices(token);

      // Set initial prices (latest from each pair)
      const latestPrices = {};
      Object.entries(histories).forEach(([pair, history]) => {
        if (history.length > 0) {
          latestPrices[pair] = history[history.length - 1];
        }
      });

      setPrices(latestPrices);
      setPriceHistory(histories);
    } catch (error) {
      showAlert('Error fetching forex prices', 'error');
      console.error('Error fetching forex prices:', error);
    }
  }, [token, showAlert]);

  useEffect(() => {
    fetchInitialPrices();
  }, [fetchInitialPrices]);

  return {
    prices,
    priceHistory,
    updatePrices,
    refreshPrices: fetchInitialPrices
  };
}