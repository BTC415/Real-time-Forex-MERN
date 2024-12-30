// Utility functions for forex calculations
export const calculateMeanPrice = (data) => {
  if (!data || data.length === 0) return 0;

  const sum = data.reduce((acc, point) => {
    const midPrice = (point.bid + point.ask) / 2;
    return acc + midPrice;
  }, 0);

  return sum / data.length;
};

export const calculatePriceChange = (currentPrice, previousPrice) => {
  if (!currentPrice || !previousPrice) return 0;
  const currentMid = (currentPrice.bid + currentPrice.ask) / 2;
  const previousMid = (previousPrice.bid + previousPrice.ask) / 2;
  return ((currentMid - previousMid) / previousMid) * 100;
};