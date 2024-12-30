import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import PriceChart from './PriceChart';

export default function PriceCard({ pair, currentPrice, priceHistory }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">{pair}</h3>
        <div className="text-xs text-gray-500">
          Last update: {currentPrice?.timestamp ? new Date(currentPrice.timestamp).toLocaleTimeString() : '-'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <div className="text-sm text-gray-500">Bid</div>
          <div className="font-mono text-blue-600">
            {currentPrice?.bid ? formatCurrency(currentPrice.bid) : '-'}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Ask</div>
          <div className="font-mono text-red-600">
            {currentPrice?.ask ? formatCurrency(currentPrice.ask) : '-'}
          </div>
        </div>
      </div>

      <PriceChart data={priceHistory} pair={pair} />
    </div>
  );
}