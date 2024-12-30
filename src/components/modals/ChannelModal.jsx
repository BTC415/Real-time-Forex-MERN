import React, { useState } from 'react';
import { BiLock } from 'react-icons/bi';
import Modal from './Modal';

export default function ChannelModal({ isOpen, onClose, onSubmit, channel }) {
  const [name, setName] = useState(channel ? channel.name : '');
  const [isPrivate, setIsPrivate] = useState(channel ? channel.isPrivate : false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, isPrivate });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={channel ? 'Edit Channel' : 'Create Channel'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Channel Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="general"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPrivate"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="isPrivate" className="ml-2 flex items-center gap-1">
            <BiLock className="w-4 h-4" />
            Private Channel
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {channel ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}