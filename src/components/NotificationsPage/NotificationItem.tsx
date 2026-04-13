import React from 'react';
import { Avatar } from '@circleco/compass/components/Avatar';

interface NotificationItemProps {
  id: string;
  type: 'comment' | 'live' | 'member' | 'mention' | 'connection';
  avatar?: string;
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  timestamp: string;
  isUnread: boolean;
  actionButtons?: React.ReactNode;
  joinButton?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  type,
  avatar,
  icon,
  title,
  subtitle,
  timestamp,
  isUnread,
  actionButtons,
  joinButton,
}) => {
  const getDefaultIcon = () => {
    switch (type) {
      case 'comment':
        return (
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-danger"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case 'live':
        return (
          <div className="relative">
            {avatar && <Avatar src={avatar} name="User" size="md" />}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center">
              <svg
                className="w-2 h-2 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        );
      case 'member':
        return (
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-link"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
        );
      case 'mention':
        return (
          <div className="relative">
            {avatar && <Avatar src={avatar} name="User" size="md" />}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center">
              <svg
                className="w-2 h-2 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        );
      case 'connection':
        return (
          <div className="relative">
            {avatar && <Avatar src={avatar} name="User" size="md" />}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center">
              <svg
                className="w-2 h-2 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        );
      default:
        return icon;
    }
  };

  return (
    <div className="flex items-start space-x-3 p-4 hover:bg-secondary transition-colors">
      {/* Avatar/Icon */}
      <div className="shrink-0">{getDefaultIcon()}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-primary">{title}</p>
            {subtitle && (
              <p className="text-sm text-secondary mt-1">{subtitle}</p>
            )}
            <p className="text-xs text-tertiary mt-1">{timestamp}</p>
          </div>

          {/* Unread indicator */}
          {isUnread && (
            <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-2"></div>
          )}
        </div>

        {/* Action buttons */}
        {actionButtons && (
          <div className="mt-3 flex space-x-2">{actionButtons}</div>
        )}

        {/* Join button */}
        {joinButton && (
          <button className="mt-3 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-inverse transition-colors">
            Join live
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
