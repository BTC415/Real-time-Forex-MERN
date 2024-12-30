import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { useSocket } from '../context/SocketContext';
import { channelService } from '../services/channelService';

export function useChannels() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const { me, token } = useAuth();
  const { showAlert } = useAlert();
  const socket = useSocket();

  const fetchChannels = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const data = await channelService.getChannels(token);
      setChannels(data);
    } catch (error) {
      showAlert('Failed to fetch channels', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, showAlert]);

  const createChannel = useCallback(async (channelData) => {
    try {
      const newChannel = await channelService.createChannel(channelData, token);
      setChannels(prev => {
        if (prev.some(ch => ch.name === channelData.name)) {
          return prev;
        }
        return [...prev, newChannel];
      });
      showAlert('Channel created successfully', 'success');
      return newChannel;
    } catch (error) {
      showAlert('Failed to create channel', 'error');
      throw error;
    }
  }, [token, showAlert]);

  const updateChannel = useCallback(async (channelId, channelData) => {
    try {
      const updatedChannel = await channelService.updateChannel(channelId, channelData, token);
      setChannels(prev => prev.map(ch =>
        ch._id === channelId ? updatedChannel : ch
      ));
      showAlert('Channel updated successfully', 'success');
      return updatedChannel;
    } catch (error) {
      showAlert('Failed to update channel', 'error');
      throw error;
    }
  }, [token, showAlert]);

  const deleteChannel = useCallback(async (channelId) => {
    try {
      await channelService.deleteChannel(channelId, token);
      setChannels(prev => prev.filter(ch => ch._id !== channelId));
      showAlert('Channel deleted successfully', 'success');
    } catch (error) {
      showAlert('Failed to delete channel', 'error');
      throw error;
    }
  }, [token, showAlert]);

  // Listen for channel events
  useEffect(() => {
    if (!socket) return;

    socket.on('channelCreated', ({ channel, user }) => {
      setChannels(prev => {
        if (prev.some(ch => ch._id === channel._id)) return prev;
        return [...prev, channel];
      });
      showAlert(`${user.name} created channel "${channel.name}"`, 'info');
    });

    socket.on('channelUpdated', ({ channel, user }) => {
      setChannels(prev => prev.map(ch =>
        ch._id === channel._id ? channel : ch
      ));
      showAlert(`${user.name} updated channel "${channel.name}"`, 'info');
    });

    socket.on('channelDeleted', ({ channelId, channelName, user }) => {
      setChannels(prev => prev.filter(ch => ch._id !== channelId));
      showAlert(`${user.name} deleted channel "${channelName}"`, 'info');
    });

    socket.on('channelJoined', ({ channelId, channelName, user }) => {
      setChannels(prev => prev.map(ch =>
        ch._id === channelId ? { ...ch, members: [...ch.members, user._id] } : ch
      ));
      if (me._id !== user._id)
        showAlert(`${user.name} joined channel "${channelName}"`, 'info');
    });

    socket.on('channelLeft', ({ channelId, channelName, user }) => {
      setChannels(prev => prev.map(ch =>
        ch._id === channelId ? { ...ch, members: ch.members.filter(member => member !== user._id) } : ch
      ));
      if (me._id !== user._id)
        showAlert(`${user.name} left channel "${channelName}"`, 'info');
    });

    return () => {
      socket.off('channelCreated');
      socket.off('channelUpdated');
      socket.off('channelDeleted');
    };
  }, [socket, showAlert]);

  return {
    channels,
    loading,
    fetchChannels,
    createChannel,
    updateChannel,
    deleteChannel
  };
}