import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BiLogOut, BiCog } from 'react-icons/bi';
import { MotionDiv, fadeIn } from '../animations';
import UserSettingsModal from '../modals/UserSettingsModal';
import UserAvatar from './UserAvatar';

export default function UserStatus() {
  const { me, signOut, updateUser } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleUpdateUser = async (data) => {
    try {
      await updateUser(data);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <>
      <MotionDiv
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="p-4 border-t bg-gray-900"
      >
        <div className="flex items-center gap-3">
          <UserAvatar user={me} isOnline={true} />
          <div className="flex-1 min-w-0">
            <p className="text-white truncate">{me?.name}</p>
            <p className="text-xs text-gray-400">{me?.email}</p>
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="text-gray-400 hover:text-white mr-2"
            title="Settings"
          >
            <BiCog className="w-5 h-5" />
          </button>
          <button
            onClick={signOut}
            className="text-gray-400 hover:text-white"
            title="Sign out"
          >
            <BiLogOut className="w-5 h-5" />
          </button>
        </div>
      </MotionDiv>

      <UserSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={me}
        onUpdate={handleUpdateUser}
      />
    </>
  );
}