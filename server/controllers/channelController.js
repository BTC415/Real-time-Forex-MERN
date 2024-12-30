import Channel from '../models/Channel.js';
import { io } from '../index.js';

export const getChannels = async (req, res) => {
  try {
    const isGuest = req.user.role === 'guest';

    const channels = await Channel.find(
      isGuest ? { isPrivate: false } : {},
    );
    res.json(channels);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createChannel = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      throw new Error('Only admins can create channels');
    }

    const channel = new Channel({
      ...req.body,
      createdBy: req.user._id
    });
    await channel.save();

    // Broadcast to all connected clients
    io.emit('channelCreated', {
      channel,
      user: { name: req.user.name }
    });

    res.status(201).json(channel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findByIdAndUpdate(
      req.params.channelId,
      req.body,
      { new: true }
    );

    if (!channel) {
      throw new Error('Channel not found');
    }

    // Broadcast to all connected clients
    io.emit('channelUpdated', {
      channel,
      user: { name: req.user.name }
    });

    res.json(channel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.channelId);
    if (!channel) {
      throw new Error('Channel not found');
    }

    await Channel.deleteOne({ _id: req.params.channelId });

    // Broadcast to all connected clients
    io.emit('channelDeleted', {
      channelId: req.params.channelId,
      channelName: channel.name,
      user: { name: req.user.name }
    });

    res.json({ message: 'Channel deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Join a channel
export const joinChannel = async (user, channelId) => {
  try {
    const channel = await Channel.findById(channelId);

    if (!channel) {
      throw new Error('Channel not found');
    }

    // Add user to channel members if not already a member
    if (!channel.members.includes(user._id)) {
      channel.members.push(user._id);
      await channel.save();
    }

    io.to(channelId).emit('channelJoined', {
      channelId: channel._id,
      channelName: channel.name,
      user: user
    });
  } catch (error) {
    throw new Error({ error: error.message });
  }
};

// Leave a channel
export const leaveChannel = async (user, channelId) => {
  try {
    const channel = await Channel.findById(channelId);

    if (!channel) {
      throw new Error('Channel not found');
    }

    // Remove user from channel members if they are a member
    if (channel.members.includes(user._id)) {
      channel.members = channel.members.filter(
        (member) => member.toString() !== user._id.toString()
      );
      await channel.save();
    }

    io.to(channelId).emit('channelLeft', {
      channelId: channel._id,
      channelName: channel.name,
      user: user
    });
  } catch (error) {
    throw new Error({ error: error.message });
  }
};