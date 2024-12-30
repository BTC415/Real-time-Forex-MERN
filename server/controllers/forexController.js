import Channel from '../models/Channel.js';
import ForexUpdate from '../models/ForexUpdate.js';
import { generateForexPrice } from '../utils/forexGenerator.js';

const CURRENCY_PAIRS = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF'];
const HISTORY_LIMIT = 50;

export const getLatestPrices = async (req, res) => {
  try {
    const priceHistories = await Promise.all(
      CURRENCY_PAIRS.map(async (pair) => {
        const history = await ForexUpdate.find({ pair })
          .sort({ timestamp: -1 })
          .limit(HISTORY_LIMIT);

        // If no history exists, generate initial data points
        if (history.length === 0) {
          const initialPrices = Array.from({ length: HISTORY_LIMIT }, (_, i) => {
            const timestamp = new Date(Date.now() - (HISTORY_LIMIT - i) * 1000);
            const { bid, ask } = generateForexPrice(pair);
            return { pair, bid, ask, timestamp };
          });

          await ForexUpdate.insertMany(initialPrices);
          return initialPrices;
        }

        return history.reverse(); // Return in chronological order
      })
    );

    // Transform into the expected format
    const formattedHistory = priceHistories.reduce((acc, history, index) => {
      acc[CURRENCY_PAIRS[index]] = history;
      return acc;
    }, {});

    res.json(formattedHistory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updatePrices = async (io) => {
  try {
    const tradingChannel = await Channel.findOne({ name: 'Trading' });
    if (!tradingChannel) {
      throw new Error('Trading Channel not found');
    }

    const updates = await Promise.all(
      CURRENCY_PAIRS.map(async (pair) => {
        const { bid, ask } = generateForexPrice(pair);
        const update = new ForexUpdate({ pair, bid, ask });
        await update.save();
        return update;
      })
    );
    io.to(tradingChannel._id.toString()).emit('forexUpdates', updates);
  } catch (error) {
    console.error('Error updating forex prices:', error);
  }
};