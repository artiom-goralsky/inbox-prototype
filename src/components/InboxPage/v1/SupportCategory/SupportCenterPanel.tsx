import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Badge } from '@circleco/compass/components/Badge';
import SupportConversationView from './SupportConversationView';
import SupportComposer from './SupportComposer';
import QueueCard from './QueueCard';
import {
  type SupportThread,
  type SupportThreadState,
} from './data/supportThreads';

interface SupportCenterPanelProps {
  thread: SupportThread;
  composerValue: string;
  onComposerChange: (value: string) => void;
  onSend: () => void;
  onMarkResolved: () => void;
  onReopen: () => void;
}

type BadgeVariant = 'success' | 'secondary';
const STATE_BADGE: Partial<Record<SupportThreadState, { label: string; variant: BadgeVariant }>> = {
  resolved: { label: 'Resolved', variant: 'secondary' },
  solved:   { label: 'Solved',   variant: 'success' },
  closed:   { label: 'Closed',   variant: 'secondary' },
};
const OPEN_BADGE: { label: string; variant: BadgeVariant } = { label: 'Open', variant: 'secondary' };

const CHANNEL_LABEL: Record<SupportThread['channel'], string> = {
  email: 'Email',
  chat: 'Live Chat',
};

const SupportCenterPanel: React.FC<SupportCenterPanelProps> = ({
  thread,
  composerValue,
  onComposerChange,
  onSend,
}) => {
  const stateBadge = STATE_BADGE[thread.state];
  const displayBadge = stateBadge ?? OPEN_BADGE;
  const isDone = !!stateBadge;
  const isChat = thread.channel === 'chat';
  const isInQueue = thread.state === 'in_queue';

  return (
    <div className="flex-1 flex flex-col bg-primary overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 pl-6 pr-4 h-14 border-b border-[#f0f3f5] shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Typography variant="heading-md" color="primary" className="truncate">
            {thread.subject}
          </Typography>
          <Typography variant="label-xs" color="secondary" className="shrink-0 whitespace-nowrap">
            {CHANNEL_LABEL[thread.channel]}
          </Typography>
        </div>
        <Badge variant={displayBadge.variant} label={displayBadge.label} />
      </div>

      {/* Conversation */}
      <SupportConversationView messages={thread.messages} />

      {/* Bottom footer: queue card + composer */}
      <div className="shrink-0 flex flex-col gap-2 px-4 pb-4">
        {isChat && isInQueue && (
          <div className="max-w-[768px] mx-auto w-full">
            <QueueCard threadId={thread.id} />
          </div>
        )}
        <SupportComposer
          value={composerValue}
          onChange={onComposerChange}
          onSend={onSend}
          placeholder={isDone ? 'This conversation is resolved.' : isChat ? 'Type your message...' : 'Message'}
          noPadding
        />
      </div>
    </div>
  );
};

export default SupportCenterPanel;
