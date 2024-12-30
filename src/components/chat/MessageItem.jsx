import React from 'react';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '../../context/AuthContext';
import { MotionDiv, fadeIn } from '../animations';
import { formatTime } from '../../utils/dateUtils';
import UserAvatar from '../users/UserAvatar';

export default function MessageItem({ message }) {
  const { me } = useAuth();
  const isCurrentUser = message.user === me?._id | message.user._id === me?._id;
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <MotionDiv
      ref={ref}
      variants={fadeIn}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      className={`flex items-start gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <UserAvatar user={message.user} size="sm" />

      <div className={`max-w-[70%] ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-100'
        } rounded-lg p-3`}>
        <div className="text-sm font-medium mb-1">
          {isCurrentUser ? 'You' : message.user.name || 'Anonymous'}
        </div>
        <div className="break-words">{message.message}</div>
        <div className="text-xs mt-1 opacity-75">
          {formatTime(message.createdAt)}
        </div>
      </div>
    </MotionDiv>
  );
}