import React, { useCallback } from 'react';
import { useMessages } from '../../hooks/useMessages';
import { useChannelSocket } from '../../hooks/useChannelSocket';
import { useAlert } from '../../context/AlertContext';
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import ChatHeader from './ChatHeader';

export default function ChatArea({ channel }) {
  const { messages, loading, sendMessage, setMessages } = useMessages(channel?._id);
  const { showAlert } = useAlert();

  const handleNewMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
  }, [setMessages]);

  useChannelSocket({
    channelId: channel?._id,
    onMessage: handleNewMessage
  });

  const handleSendMessage = async (messageText) => {
    if (!channel?._id) return;

    try {
      const newMessage = await sendMessage({ message: messageText });
      // setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      showAlert('Failed to send message', 'error');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <ChatHeader channel={channel} />
      <MessageList messages={messages} loading={loading} />
      <MessageInput onSendMessage={handleSendMessage} disabled={!channel} />
    </div>
  );
}