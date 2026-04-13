import React, { useState } from 'react';
import NotificationsHeader from './NotificationsHeader';
import NotificationItem from './NotificationItem';

type Notification = {
  id: string;
  type: 'comment' | 'live' | 'member' | 'mention' | 'connection';
  title: string;
  subtitle?: string;
  timestamp: string;
  isUnread: boolean;
  icon?: React.ReactNode;
  avatar?: string;
  joinButton?: boolean;
  actionButtons?: React.ReactNode;
};

const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('unread');

  const allNotifications: {
    today: Notification[];
    last7days: Notification[];
    older: Notification[];
  } = {
    today: [
      {
        id: '1',
        type: 'comment' as const,
        icon: (
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-danger">HBS</span>
          </div>
        ),
        title: '5 new comments on your post',
        subtitle:
          'Tip: Host offline meetups to connect members & invest in photography.',
        timestamp: '3 hrs ago',
        isUnread: true,
      },
      {
        id: '2',
        type: 'live' as const,
        avatar: '/images/avatars/1.png',
        title: 'Owen Sinclair is live with How to run online courses',
        timestamp: '3 hrs ago',
        isUnread: true,
        joinButton: true,
      },
      {
        id: '3',
        type: 'member' as const,
        title: '5 new members joined the community',
        timestamp: '3 hrs ago',
        isUnread: true,
      },
      {
        id: '4',
        type: 'mention' as const,
        avatar: '/images/avatars/2.png',
        title:
          'Calvin Parks mentioned you in a comment on: April update: Introducing the custom app builder, AI summaries',
        timestamp: '3 hrs ago',
        isUnread: true,
      },
      {
        id: '5',
        type: 'connection' as const,
        avatar: '/images/avatars/3.png',
        title: 'Cody Fished wants to connect with you',
        timestamp: '3 hrs ago',
        isUnread: true,
        actionButtons: (
          <>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-primary border border-hover rounded-lg hover:bg-secondary transition-colors">
              Ignore
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-inverse transition-colors">
              Accept
            </button>
          </>
        ),
      },
    ],
    last7days: [
      {
        id: '6',
        type: 'comment' as const,
        avatar: '/images/avatars/4.png',
        title: 'Maria Suarez commented on your post',
        subtitle:
          'Tip: Host offline meetups to connect members & invest in photography.',
        timestamp: '3 hrs ago',
        isUnread: false,
      },
      {
        id: '7',
        type: 'mention' as const,
        avatar: '/images/avatars/2.png',
        title:
          'Calvin Parks mentioned you in a comment on: April update: Introducing the custom app builder, AI summaries',
        timestamp: '3 hrs ago',
        isUnread: false,
      },
    ],
    older: [
      {
        id: '8',
        type: 'comment' as const,
        avatar: '/images/avatars/4.png',
        title: 'Maria Suarez commented on your post',
        subtitle:
          'Tip: Host offline meetups to connect members & invest in photography.',
        timestamp: '3 hrs ago',
        isUnread: false,
      },
      {
        id: '9',
        type: 'mention' as const,
        avatar: '/images/avatars/2.png',
        title:
          'Calvin Parks mentioned you in a comment on: April update: Introducing the custom app builder, AI summaries',
        timestamp: '3 hrs ago',
        isUnread: false,
      },
    ],
  };

  // Filter function based on active tab
  const filterNotifications = (notificationList: Notification[]) => {
    switch (activeTab) {
      case 'all':
        return notificationList;
      case 'unread':
        return notificationList.filter(n => n.isUnread);
      case 'content':
        return notificationList.filter(
          n => n.type === 'comment' || n.type === 'live'
        );
      case 'mentions':
        return notificationList.filter(n => n.type === 'mention');
      case 'following':
        return notificationList.filter(
          n => n.type === 'connection' || n.type === 'member'
        );
      case 'moderation':
        return notificationList.filter(n => n.type === 'member');
      default:
        return notificationList;
    }
  };

  // Get filtered notifications
  const notifications = {
    today: filterNotifications(allNotifications.today),
    last7days: filterNotifications(allNotifications.last7days),
    older: filterNotifications(allNotifications.older),
  };

  // Calculate unread count
  const unreadCount =
    allNotifications.today.filter(n => n.isUnread).length +
    allNotifications.last7days.filter(n => n.isUnread).length +
    allNotifications.older.filter(n => n.isUnread).length;

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'content', label: 'Content' },
    { id: 'mentions', label: 'Mentions' },
    { id: 'following', label: 'Following' },
    { id: 'moderation', label: 'Moderation' },
  ];

  return (
    <div className="h-full bg-primary flex flex-col">
      <NotificationsHeader />

      {/* Filter Tabs */}
      <div className="bg-primary px-6 py-4">
        <div className="max-w-[680px] mx-auto">
          <div className="flex space-x-1 rounded-lg p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary border border-primary shadow-sm'
                    : 'text-secondary hover:text-primary border border-transparent'
                }`}
              >
                {tab.label}
                {tab.count && (
                  <span className="mx-2 border border-primary text-gray-700 text-xs px-2 py-1 rounded-lg">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        <div
          className="flex-1 max-w-4xl mx-auto rounded-lg"
          style={{ maxWidth: '680px' }}
        >
          {/* Today */}
          {notifications.today.length > 0 && (
            <div>
              <div className="px-6 py-3">
                <h3 className="text-sm font-semibold text-primary">Today</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {notifications.today.map(notification => (
                  <NotificationItem key={notification.id} {...notification} />
                ))}
              </div>
            </div>
          )}

          {/* Last 7 days */}
          {notifications.last7days.length > 0 && (
            <div>
              <div className="px-6 py-3">
                <h3 className="text-sm font-semibold text-primary">
                  Last 7 days
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {notifications.last7days.map(notification => (
                  <NotificationItem key={notification.id} {...notification} />
                ))}
              </div>
            </div>
          )}

          {/* Older */}
          {notifications.older.length > 0 && (
            <div>
              <div className="px-6 py-3">
                <h3 className="text-sm font-semibold text-primary">Older</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {notifications.older.map(notification => (
                  <NotificationItem key={notification.id} {...notification} />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {notifications.today.length === 0 &&
            notifications.last7days.length === 0 &&
            notifications.older.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-tertiary">
                  No notifications found for this filter.
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
