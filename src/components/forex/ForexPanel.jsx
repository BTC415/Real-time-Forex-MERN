import React from 'react';
import { useForexPrices } from '../../hooks/useForexPrices';
import { useForexSocket } from '../../hooks/useForexSocket';
import PriceTable from './PriceTable';
import PriceCard from './PriceCard';
import { CURRENCY_PAIRS } from '../../utils/forexConstants';

export default function ForexPanel() {
  const { prices, priceHistory, updatePrices } = useForexPrices();

  useForexSocket({
    onPriceUpdate: updatePrices
  });

  return (
    <div className="max-w-md w-full bg-gray-50 border-l flex flex-col">
      <div className="h-16 p-4 border-b flex items-center">
        <h2 className="text-xl font-bold">Forex Prices</h2>
      </div>
      <div className="p-4">
        {/* Add the PriceTable component */}
        <PriceTable prices={prices} />
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {CURRENCY_PAIRS.map((pair) => (
          <PriceCard
            key={pair}
            pair={pair}
            currentPrice={prices[pair]}
            priceHistory={priceHistory[pair] || []}
          />
        ))}
      </div>
    </div>
  );
}