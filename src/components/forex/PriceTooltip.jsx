import React from 'react';
import { BiTrendingUp, BiTrendingDown } from 'react-icons/bi';

export default function PriceTooltip({ active, payload, label, data, meanPrice }) {
  if (!active || !payload || !payload.length) return null;

  const currentIndex = data.findIndex(d => d.time === label);
  const previousIndex = currentIndex > 0 ? currentIndex - 1 : null;

  const currentMid = (payload[0].value + payload[1].value) / 2;
  const previousMid = previousIndex !== null
    ? (data[previousIndex].bid + data[previousIndex].ask) / 2
    : currentMid;

  const changePercent = ((currentMid - previousMid) / previousMid) * 100;
  const isPositive = changePercent >= 0;

  return (
    <div className="bg-white p-3 border rounded-lg shadow-lg">
      <p className="font-semibold mb-1">{label}</p>
      <div className="space-y-1">
        <p className="text-blue-600">Bid: {payload[0].value.toFixed(4)}</p>
        <p className="text-red-600">Ask: {payload[1].value.toFixed(4)}</p>
        <p className="text-gray-600">Avg: {meanPrice.toFixed(4)}</p>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
          {isPositive ? (
            <BiTrendingUp className="w-4 h-4" />
          ) : (
            <BiTrendingDown className="w-4 h-4" />
          )}
          <span>{Math.abs(changePercent).toFixed(4)}%</span>
        </div>
      </div>
    </div>
  );
}