import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChannels } from '@/hooks/useChannels';
import { BiPlus, BiHash, BiLock, BiPencil, BiTrash } from 'react-icons/bi';
import { MotionDiv, slideIn } from '@/components/animations';
import ChannelModal from '@/components/modals/ChannelModal';
import ConfirmModal from '@/components/modals/ConfirmModal';
import UserStatus from '@/components/users/UserStatus';

export default function ChannelSidebar({ currentChannel, onChannelSelect }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [channelToDelete, setChannelToDelete] = useState(null);
  const [editingChannel, setEditingChannel] = useState(null);
  const { me } = useAuth();

  const {
    channels,
    loading,
    fetchChannels,
    createChannel,
    updateChannel,
    deleteChannel
  } = useChannels();

  useEffect(() => {
    fetchChannels();
  }, [me, fetchChannels]);

  const handleChannelSubmit = async (data) => {
    try {
      if (editingChannel) {
        await updateChannel(editingChannel._id, data);
      } else {
        await createChannel(data);
      }
      setIsModalOpen(false);
      setEditingChannel(null);
    } catch (error) {
      console.error('Channel operation failed:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!channelToDelete) return;

    try {
      await deleteChannel(channelToDelete._id);
      if (currentChannel?._id === channelToDelete._id) {
        onChannelSelect(null);
      }
      setChannelToDelete(null);
      setIsConfirmOpen(false);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div className="w-64 bg-gray-800 flex flex-col">
      <div className="h-16 p-4 border-b border-gray-700">
        <h2 className="text-white text-lg font-semibold flex items-center justify-between">
          Channels
          {me?.role === 'admin' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-1 hover:bg-gray-700 rounded"
            >
              <BiPlus className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {loading ? (
          <div className="text-gray-400 text-center p-4">Loading channels...</div>
        ) : (
          channels.map(channel => (
            <MotionDiv
              key={channel._id}
              variants={slideIn}
              initial="initial"
              animate="animate"
              className={`flex items-center justify-between p-2 rounded group cursor-pointer ${currentChannel?._id === channel._id
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              onClick={() => onChannelSelect(channel)}
            >
              <div className="flex items-center space-x-2">
                {channel.isPrivate ? (
                  <BiLock className="w-4 h-4 text-gray-400" />
                ) : (
                  <BiHash className="w-4 h-4 text-gray-400" />
                )}
                <span className="truncate">{channel.name}</span>
              </div>

              {me?.role === 'admin' && (
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingChannel(channel);
                      setIsModalOpen(true);
                    }}
                    className="p-1 hover:bg-gray-600 rounded"
                  >
                    <BiPencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setChannelToDelete(channel);
                      setIsConfirmOpen(true);
                    }}
                    className="p-1 hover:bg-gray-600 rounded"
                  >
                    <BiTrash className="w-4 h-4" />
                  </button>
                </div>
              )}
            </MotionDiv>
          ))
        )}
      </div>

      <UserStatus />

      <ChannelModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingChannel(null);
        }}
        onSubmit={handleChannelSubmit}
        channel={editingChannel}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setChannelToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Channel"
        message={`Are you sure you want to delete ${channelToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
}