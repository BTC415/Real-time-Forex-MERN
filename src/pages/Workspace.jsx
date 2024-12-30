import React, { useState, useCallback } from 'react';
import ChannelSidebar from '../components/channels/ChannelSidebar';
import ChatArea from '../components/chat/ChatArea';
import ForexPanel from '../components/forex/ForexPanel';
import { useRealTimeUpdates } from '../hooks/useRealTimeUpdates';

export default function Workspace() {
  const [currentChannel, setCurrentChannel] = useState(null);

  const handleMessage = useCallback((message) => {
    if (message.channelId === currentChannel?._id) {
      setMessages(prev => [...prev, message]);
    }
  }, [currentChannel]);

  const handleUserJoin = useCallback((userData) => {
    setOnlineUsers(prev => [...prev, userData]);
  }, []);

  const handleUserLeave = useCallback((userData) => {
    setOnlineUsers(prev => prev.filter(u => u.id !== userData.id));
  }, []);

  const handleChannelUpdate = useCallback((updatedChannel) => {
    if (currentChannel?._id === updatedChannel._id) {
      setCurrentChannel(updatedChannel);
    }
  }, [currentChannel]);

  useRealTimeUpdates({
    onMessage: handleMessage,
    onUserJoin: handleUserJoin,
    onUserLeave: handleUserLeave,
    onChannelUpdate: handleChannelUpdate
  });

  const handleChannelSelect = (channel) => {
    setCurrentChannel(channel);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ChannelSidebar
        currentChannel={currentChannel}
        onChannelSelect={handleChannelSelect}
      />
      <div className="flex-1 flex">
        <ChatArea
          channel={currentChannel}
        />
        {currentChannel?.name === 'Trading' && <ForexPanel />}
      </div>
    </div>
  );
}