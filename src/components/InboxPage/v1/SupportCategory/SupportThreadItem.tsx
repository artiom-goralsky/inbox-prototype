import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Icon } from '@circleco/compass/components/Icon';
import { Badge } from '@circleco/compass/components/Badge';
import { getThreadStatus, type SupportStatus, type SupportThread } from './data/supportThreads';

type BadgeVariant = 'info' | 'success' | 'secondary';
const STATUS_BADGE: Record<SupportStatus, { label: string; variant: BadgeVariant }> = {
  open: { label: 'Open', variant: 'info' },
  solved: { label: 'Solved', variant: 'success' },
  closed: { label: 'Closed', variant: 'secondary' },
};

interface SupportThreadItemProps {
  thread: SupportThread;
  isSelected: boolean;
  onClick: () => void;
}

const SupportThreadItem: React.FC<SupportThreadItemProps> = ({ thread, isSelected, onClick }) => {
  const status = getThreadStatus(thread);
  const isNewReply = thread.state === 'new_reply' || thread.state === 'awaiting_user';
  const isInQueue = thread.state === 'in_queue';
  const isActive = thread.state === 'active';
  const isHasDraft = thread.state === 'has_draft';
  const badge = STATUS_BADGE[status];

  const lastMessage = thread.messages.length > 0 ? thread.messages[thread.messages.length - 1] : null;
  const lastNonSystem = [...thread.messages].reverse().find(m => m.sender !== 'system') ?? null;
  const previewBody = isHasDraft
    ? (thread.draft ?? '')
    : (lastNonSystem?.body ?? lastMessage?.body ?? '');

  const channelIcon = thread.channel === 'email' ? 'email' : 'message';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      className={[
        'flex gap-3 items-center pl-4 pr-3 py-2 cursor-pointer transition-colors rounded-xl',
        isSelected ? 'bg-active' : 'hover:bg-hover',
      ].filter(Boolean).join(' ')}
    >
      {/* Channel icon — 32×32 square anchor in place of avatar */}
      <div className="size-8 rounded-md border border-secondary flex items-center justify-center shrink-0 bg-primary">
        <Icon name={channelIcon as any} size="sm" color="tertiary" />
      </div>

      {/* Subject + preview */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center gap-2 min-w-0">
          {isNewReply && (
            <span className="size-1.5 rounded-full bg-info shrink-0" aria-label="Unread" />
          )}
          {isActive && (
            <span className="size-1.5 rounded-full bg-success shrink-0" aria-label="Live" />
          )}
          {isInQueue && (
            <Icon name="clock" size="sm" color="tertiary" className="shrink-0" />
          )}
          <Typography
            variant="heading-sm"
            color="primary"
            className="flex-1 min-w-0 truncate"
          >
            {thread.subject}
          </Typography>
          <Badge variant={badge.variant} label={badge.label} />
          <Typography variant="caption" color="tertiary" className="shrink-0">
            {thread.lastActivity}
          </Typography>
        </div>
        <Typography
          variant="body-sm"
          color="secondary"
          className="min-w-0 truncate"
        >
          {isInQueue && !lastNonSystem ? 'In queue' : previewBody}
        </Typography>
      </div>
    </div>
  );
};

export default SupportThreadItem;
