import React from 'react';
import { BiHash, BiLock, BiWorld } from 'react-icons/bi';
import { MotionDiv, slideIn } from '../animations';

export default function ChatHeader({ channel }) {
  return (
    <div className="h-16 p-4 border-b bg-gray-50 flex items-center">
      {!channel ? (
        <p className="text-gray-500 flex items-center gap-2">
          <BiHash className="w-5 h-5" />
          Select a channel to start messaging
        </p>
      ) : (
        <MotionDiv
          variants={slideIn}
          initial="initial"
          animate="animate"
          className="flex flex-col justify-center"
        >
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BiHash className="w-5 h-5" />
            {channel.name}
          </h2>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            {channel.isPrivate ? (
              <BiLock className="w-4 h-4" />
            ) : (
              <BiWorld className="w-4 h-4" />
            )}
            {channel.isPrivate ? 'Private Channel' : 'Public Channel'}
          </p>
        </MotionDiv>
      )}
    </div>
  );
}