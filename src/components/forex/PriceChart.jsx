import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { formatTime } from '../../utils/dateUtils';
import { calculateMeanPrice } from '../../utils/forexCalculations';
import PriceTooltip from './PriceTooltip';

export default function PriceChart({ data, pair }) {
  const { chartData, meanPrice } = useMemo(() => {
    if (data.length === 0) return { chartData: [], meanPrice: 0 };

    const formattedData = data.map(point => ({
      time: formatTime(point.timestamp),
      bid: Number(point.bid.toFixed(4)),
      ask: Number(point.ask.toFixed(4))
    }));

    return {
      chartData: formattedData,
      meanPrice: calculateMeanPrice(data)
    };
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="h-40 mt-2 flex items-center justify-center text-gray-500">
        Waiting for price updates...
      </div>
    );
  }

  return (
    <div className="h-40 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
        >
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10 }}
            interval="preserveEnd"
            minTickGap={30}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fontSize: 10 }}
            tickCount={5}
            width={60}
          />
          <Tooltip
            content={
              <PriceTooltip
                data={chartData}
                meanPrice={meanPrice}
              />
            }
          />
          <ReferenceLine
            y={meanPrice}
            stroke="#9CA3AF"
            strokeDasharray="3 3"
            label={{
              value: `Mean: ${meanPrice.toFixed(4)}`,
              position: 'right',
              fill: '#6B7280',
              fontSize: 10
            }}
          />
          <Line
            type="linear"
            dataKey="bid"
            stroke="#2563eb"
            dot={false}
            strokeWidth={2}
            name="Bid"
            isAnimationActive={false}
          />
          <Line
            type="linear"
            dataKey="ask"
            stroke="#dc2626"
            dot={false}
            strokeWidth={2}
            name="Ask"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}