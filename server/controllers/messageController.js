import Message from '../models/Message.js';
import { io } from '../index.js';

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      channelId: req.params.channelId
    }).populate('user', 'email name');
    res.json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createMessage = async (req, res) => {
  try {
    const message = new Message({
      ...req.body,
      user: req.user._id,
      channelId: req.params.channelId,
    });
    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('user', 'email name');

    // Broadcast to channel members
    io.emit('newMessage', {
      message: populatedMessage
    });

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};