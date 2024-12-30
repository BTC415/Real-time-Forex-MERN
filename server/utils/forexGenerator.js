// Utility to generate mock forex price updates
export const generateForexPrice = (pair) => {
  const basePrice = {
    'EUR/USD': 1.05,
    'GBP/USD': 1.25,
    'USD/JPY': 150.0,
    'USD/CHF': 0.90
  }[pair];

  const variation = (Math.random() - 0.5) * 0.002;
  const bid = basePrice + variation;
  const ask = bid + 0.0002;

  return { bid, ask };
};