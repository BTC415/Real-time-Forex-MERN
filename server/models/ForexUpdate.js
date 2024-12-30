import mongoose from 'mongoose';

const forexUpdateSchema = new mongoose.Schema({
  pair: {
    type: String,
    required: true
  },
  bid: {
    type: Number,
    required: true
  },
  ask: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ForexUpdate', forexUpdateSchema);