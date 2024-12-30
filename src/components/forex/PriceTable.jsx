import React from 'react';
import { formatCurrency } from '../../utils/formatters';

export default function PriceTable({ prices }) {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full text-sm text-left text-gray-500">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th scope="col" className="px-4 py-2">Currency Pair</th>
            <th scope="col" className="px-4 py-2">Bid</th>
            <th scope="col" className="px-4 py-2">Ask</th>
            <th scope="col" className="px-4 py-2">Last Update</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(prices).map((pair) => {
            const { bid, ask, timestamp } = prices[pair] || {};
            return (
              <tr key={pair} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-900">{pair}</td>
                <td className="px-4 py-2 text-blue-600">
                  {bid ? formatCurrency(bid) : '-'}
                </td>
                <td className="px-4 py-2 text-red-600">
                  {ask ? formatCurrency(ask) : '-'}
                </td>
                <td className="px-4 py-2 text-gray-500">
                  {timestamp ? new Date(timestamp).toLocaleTimeString() : '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}