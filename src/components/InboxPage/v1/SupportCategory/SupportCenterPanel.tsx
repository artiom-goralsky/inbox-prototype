import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Badge } from '@circleco/compass/components/Badge';
import { Icon } from '@circleco/compass/components/Icon';
import SupportConversationView from './SupportConversationView';
import SupportComposer from './SupportComposer';
import {
  LIVE_CHAT_WAIT_LABEL,
  getThreadStatus,
  type SupportStatus,
  type SupportThread,
} from './data/supportThreads';

interface SupportCenterPanelProps {
  thread: SupportThread;
  composerValue: string;
  onComposerChange: (value: string) => void;
  onSend: () => void;
  onMarkResolved: () => void;
  onReopen: () => void;
}

type BadgeVariant = 'info' | 'success' | 'secondary';
const STATUS_BADGE: Record<SupportStatus, { label: string; variant: BadgeVariant }> = {
  open: { label: 'Open', variant: 'info' },
  solved: { label: 'Solved', variant: 'success' },
  closed: { label: 'Closed', variant: 'secondary' },
};

const CHANNEL_LABEL: Record<SupportThread['channel'], string> = {
  email: 'Email',
  chat: 'Live chat',
};

const SupportCenterPanel: React.FC<SupportCenterPanelProps> = ({
  thread,
  composerValue,
  onComposerChange,
  onSend,
}) => {
  const status = getThreadStatus(thread);
  const badge = STATUS_BADGE[status];
  const isResolved = thread.state === 'resolved';
  const isChat = thread.channel === 'chat';
  const isInQueue = thread.state === 'in_queue';
  const isActive = thread.state === 'active';

  return (
    <div className="flex-1 flex flex-col bg-primary overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-3 pl-6 pr-4 py-3 border-b border-[#f0f3f5] shrink-0">
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <div className="flex items-center gap-2 min-w-0">
            <Typography variant="heading-md" color="primary" className="truncate">
              {thread.subject}
            </Typography>
            <Badge variant={badge.variant} label={badge.label} />
          </div>
          <div className="flex items-center gap-1.5">
            {isChat && isActive && (
              <span className="size-1.5 rounded-full bg-success shrink-0" aria-label="Live" />
            )}
            <Typography variant="caption" color="tertiary">
              {CHANNEL_LABEL[thread.channel]}
              {isChat && isInQueue ? ' · In queue' : ''}
              {isChat && isActive ? ' · Live' : ''}
            </Typography>
          </div>
        </div>
      </div>

      {/* In-queue banner — only for live chat in_queue state */}
      {isChat && isInQueue && (
        <div className="px-4 pt-3 shrink-0">
          <div className="max-w-[768px] mx-auto flex items-start gap-3 bg-secondary rounded-xl px-4 py-3">
            <Icon name="message" size="md" color="info" />
            <div className="flex flex-col gap-0.5">
              <Typography variant="heading-sm" color="primary">Connecting you with Circle Support</Typography>
              <Typography variant="body-sm" color="secondary">{LIVE_CHAT_WAIT_LABEL}</Typography>
            </div>
          </div>
        </div>
      )}

      {/* Conversation */}
      <SupportConversationView messages={thread.messages} />

      {/* Composer */}
      <SupportComposer
        value={composerValue}
        onChange={onComposerChange}
        onSend={onSend}
        placeholder={isResolved ? 'This conversation is resolved.' : isChat ? 'Type your message...' : 'Message'}
      />
    </div>
  );
};

export default SupportCenterPanel;
