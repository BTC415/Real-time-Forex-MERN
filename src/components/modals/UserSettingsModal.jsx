import React, { useState } from 'react';
import { BiUser } from 'react-icons/bi';
import Modal from './Modal';
import UserAvatar from '@/components/users/UserAvatar';
import FormInput from '../ui/FormInput';
import FormSelect from '../ui/FormSelect';
// import { validateAvatar } from '@/utils/validators';

export default function UserSettingsModal({ isOpen, onClose, user, onUpdate }) {
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || '');
  // const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // if (avatarUrl && !validateAvatar(avatarUrl)) {
    //   setError('Please enter a valid image URL');
    //   return;
    // }

    try {
      await onUpdate({ name, role });
      // await onUpdate({ name, role, avatar_url: avatarUrl });
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Settings">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-center mb-6">
          {user ? (
            <UserAvatar user={{ ...user }} size="lg" />
            // <UserAvatar user={{ ...user, avatar_url: avatarUrl }} size="lg" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <BiUser className="w-12 h-12 text-gray-500" />
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <FormInput
          label="Display Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
        />

        <FormSelect
          label="Role"
          options={['admin', 'trader', 'guest']}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        {/* <FormInput
          label="Avatar URL"
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://example.com/avatar.jpg"
        /> */}

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
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}