import React from 'react';
import { Icon } from '@circleco/compass/components/Icon';
import type { SupportThread } from './data/supportThreads';

interface SupportThreadItemProps {
  thread: SupportThread;
  isSelected: boolean;
  onClick: () => void;
}

function getPreview(thread: SupportThread): { text: string; italic?: boolean } {
  if (thread.state === 'has_draft' && thread.messages.length === 0) {
    return { text: `Draft: ${thread.draft ?? ''}`, italic: true };
  }
  const lastNonSystem = [...thread.messages].reverse().find(m => m.sender !== 'system') ?? null;
  if (!lastNonSystem) {
    return { text: thread.state === 'in_queue' ? 'In queue' : '' };
  }
  const senderName = lastNonSystem.sender === 'admin'
    ? 'You'
    : (lastNonSystem.agentName?.split(' ')[0] ?? 'Circle');
  return { text: `${senderName}: ${lastNonSystem.body}` };
}

const SupportThreadItem: React.FC<SupportThreadItemProps> = ({ thread, isSelected, onClick }) => {
  const isUnread = thread.state === 'new_reply' || thread.state === 'awaiting_user';
  const preview = getPreview(thread);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      className={[
        'group flex gap-3 items-center pl-4 pr-3 py-2 cursor-pointer transition-colors rounded-[16px] w-full',
        isSelected ? 'bg-active' : 'hover:bg-hover',
      ].join(' ')}
    >
      {/* Avatar tile 32×32 */}
      <div className={[
        'size-8 rounded-lg border border-[#e4e7eb] flex items-center justify-center shrink-0 transition-colors',
        isSelected ? 'bg-primary' : 'bg-secondary group-hover:bg-primary',
      ].join(' ')}>
        <Icon name={thread.channel === 'email' ? 'email' : 'message'} size="sm" color="secondary" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {/* Row 1: title | unread dot slot | time */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex-1 min-w-0 truncate text-sm font-semibold text-primary leading-5">
            {thread.subject}
          </span>
          <div className="size-4 flex items-center justify-center shrink-0">
            {isUnread && (
              <span className="size-[7px] rounded-full bg-[#506CF0]" aria-label="Unread" />
            )}
          </div>
          <span className="text-xs text-tertiary whitespace-nowrap leading-[18px]">
            {thread.lastActivity}
          </span>
        </div>
        {/* Row 2: preview */}
        <span className={[
          'text-sm leading-5 truncate w-full',
          preview.italic ? 'italic text-primary' : 'text-secondary',
        ].join(' ')}>
          {preview.text}
        </span>
      </div>
    </div>
  );
};

export default SupportThreadItem;
