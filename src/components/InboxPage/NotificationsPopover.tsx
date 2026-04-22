import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Button } from '@circleco/compass/components/Button';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Icon } from '@circleco/compass/components/Icon';
import { Tabs } from '@circleco/compass/components/Tabs';
import { Badge } from '@circleco/compass/components/Badge';
import { Popover } from '@circleco/compass/components/Popover';

/* ── Mock notification data ────────────────────────────── */

type NotificationType = 'comment' | 'mention' | 'live' | 'system' | 'moderation' | 'reply' | 'member';

interface MockNotification {
  id: string;
  type: NotificationType;
  name: string;
  action: string;
  postTitle?: string;
  time: string;
  isUnread: boolean;
  hasAvatar: boolean;
  iconName: string;
  iconBg?: string;
  actionButton?: string;
}

const TODAY_NOTIFICATIONS: MockNotification[] = [
  {
    id: 'n1',
    type: 'comment',
    name: 'Maya Rodriguez',
    action: 'commented on your post',
    postTitle: 'Tip: Host offline meetups to connect members & invest in photography',
    time: '3 hrs ago',
    isUnread: true,
    hasAvatar: true,
    iconName: 'message-dots',
  },
  {
    id: 'n2',
    type: 'mention',
    name: 'Alex Chen',
    action: 'mentioned you in a comment on:',
    postTitle: 'April update: Introducing the custom app builder, AI summaries',
    time: '3 hrs ago',
    isUnread: true,
    hasAvatar: true,
    iconName: 'at',
  },
  {
    id: 'n3',
    type: 'live',
    name: 'Rudy Santino',
    action: 'is live with',
    postTitle: 'How to run online courses',
    time: '3 hrs ago',
    isUnread: true,
    hasAvatar: true,
    iconName: 'video',
    iconBg: 'bg-danger',
    actionButton: 'Join live',
  },
  {
    id: 'n4',
    type: 'system',
    name: '5 new members',
    action: 'joined the community',
    time: '3 hrs ago',
    isUnread: true,
    hasAvatar: false,
    iconName: 'people-add',
    iconBg: 'bg-inverse',
  },
];

const WEEK_NOTIFICATIONS: MockNotification[] = [
  {
    id: 'n5',
    type: 'moderation',
    name: 'James Liu',
    action: 'flagged a comment for your review',
    time: '3 hrs ago',
    isUnread: true,
    hasAvatar: true,
    iconName: 'triangle-exclamation',
  },
  {
    id: 'n6',
    type: 'reply',
    name: '2 replies',
    action: 'to your comment in',
    postTitle: 'React Native as the core foundation',
    time: '3 hrs ago',
    isUnread: true,
    hasAvatar: false,
    iconName: 'arrow-share',
    iconBg: 'bg-inverse',
  },
  {
    id: 'n7',
    type: 'comment',
    name: 'Priya Sharma',
    action: 'commented on your post',
    postTitle: 'Lesson 7 focus stacking walkthrough',
    time: '3 hrs ago',
    isUnread: true,
    hasAvatar: true,
    iconName: 'message-dots',
  },
  {
    id: 'n8',
    type: 'member',
    name: 'Emily Park',
    action: 'joined the community',
    time: '3 hrs ago',
    isUnread: true,
    hasAvatar: true,
    iconName: 'people-add',
  },
];

/* ── Notification card ─────────────────────────────────── */

function NotificationCard({ notification }: { notification: MockNotification }) {
  const { name, action, postTitle, time, isUnread, hasAvatar, iconName, iconBg, actionButton } = notification;

  return (
    <div className="flex gap-3 px-4 py-3 rounded-2xl hover:bg-hover cursor-pointer transition-colors relative">
      {/* Avatar / system icon */}
      <div className="relative shrink-0 size-9">
        {hasAvatar ? (
          <>
            <Avatar name={name} size="sm" />
            <div className={`absolute -bottom-0.5 -right-1 ${iconBg ?? 'bg-primary'} rounded-2xl p-[3px] flex items-center justify-center`}>
              <Icon name={iconName as any} size="sm" color={iconBg ? 'inverse' : undefined} />
            </div>
          </>
        ) : (
          <div className={`size-9 rounded-full ${iconBg ?? 'bg-inverse'} flex items-center justify-center`}>
            <Icon name={iconName as any} size="sm" color="inverse" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5 pr-4">
        {/* Name + action + post title (wrapping) */}
        <div className="flex flex-wrap gap-x-1 items-baseline leading-5">
          <Typography variant="label-sm" color="primary" className="shrink-0">
            {name}
          </Typography>
          <Typography variant="body-sm" color="tertiary">
            {action}
          </Typography>
          {postTitle && (
            <Typography variant="label-sm" color="primary" className="truncate">
              {postTitle}
            </Typography>
          )}
        </div>

        {/* Timestamp */}
        <Typography variant="caption" color="tertiary">
          {time}
        </Typography>

        {/* Optional action button */}
        {actionButton && (
          <div className="pt-1">
            <Button variant="primary" size="sm">{actionButton}</Button>
          </div>
        )}
      </div>

      {/* Unread dot */}
      {isUnread && (
        <div className="absolute right-4 top-4 size-2 rounded-full bg-info shrink-0" />
      )}
    </div>
  );
}

/* ── Timeline section ──────────────────────────────────── */

function TimelineSection({ label, notifications }: { label: string; notifications: MockNotification[] }) {
  return (
    <div>
      <div className="flex items-end h-8 px-5 py-1">
        <Typography variant="label-sm" color="secondary">{label}</Typography>
      </div>
      {notifications.map(n => (
        <NotificationCard key={n.id} notification={n} />
      ))}
    </div>
  );
}

/* ── Popover content ───────────────────────────────────── */

function NotificationsPopoverContent() {
  const [activeTab, setActiveTab] = useState('inbox');

  return (
    <div className="w-[616px] max-h-[696px] bg-primary flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-6 px-5 pt-4">
        <Typography variant="heading-lg" color="primary" className="flex-1 min-w-0">
          Notifications
        </Typography>
        <div className="flex items-center gap-2 shrink-0">
          <IconButton icon="filter" variant="ghost" size="md" aria-label="Filter" />
          <IconButton icon="pencil" variant="ghost" size="md" aria-label="Edit" />
          <IconButton icon="square-arrow-top-right" variant="ghost" size="md" aria-label="Open in full page" />
          <IconButton icon="settings-gear" variant="ghost" size="md" aria-label="Settings" />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary">
        <div className="px-5 pt-3 pb-3">
          <Tabs.Root
            tabs={[
              { value: 'inbox', label: 'Inbox' },
              { value: 'content', label: 'Content' },
              { value: 'mentions', label: 'Mentions' },
              { value: 'following', label: 'Following' },
              { value: 'moderation', label: 'Moderation' },
              { value: 'all', label: 'All' },
            ]}
            selectedValue={activeTab}
            onValueChange={v => setActiveTab(v)}
            size="md"
          />
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto pb-2">
        <TimelineSection label="Today" notifications={TODAY_NOTIFICATIONS} />
        <TimelineSection label="Last 7 days" notifications={WEEK_NOTIFICATIONS} />
      </div>
    </div>
  );
}

/* ── Exported popover trigger ──────────────────────────── */

const NotificationsPopover: React.FC = () => (
  <Popover
    trigger={<IconButton icon="bell" variant="ghost" size="sm" aria-label="Notifications" />}
    side="bottom"
    align="start"
    className="!p-0"
  >
    <NotificationsPopoverContent />
  </Popover>
);

export default NotificationsPopover;
