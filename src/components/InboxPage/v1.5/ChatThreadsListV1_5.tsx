import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { IconButton } from '@circleco/compass/components/IconButton';
import { CHAT_THREAD_ITEMS, type ChatThreadItem } from './v1_5MockData';

interface ChatThreadsListV1_5Props {
  selectedId: string;
  onSelect: (id: string) => void;
}

const ChatThreadsListV1_5: React.FC<ChatThreadsListV1_5Props> = ({ selectedId, onSelect }) => {

  return (
    <div className="h-full bg-primary border-r border-[#f0f3f5] flex flex-col overflow-hidden">
      {/* Title header */}
      <div className="flex items-center gap-2 h-14 pl-6 pr-4 shrink-0">
        <Typography variant="heading-md" color="primary" className="flex-1 truncate">
          Chat threads
        </Typography>
        <div className="flex items-center shrink-0">
          <IconButton icon="checkmark-double" size="sm" variant="ghost" aria-label="Mark all read" />
        </div>
      </div>

      {/* Thread items */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5">
        {CHAT_THREAD_ITEMS.map(item => (
          <ChatThreadItemRow
            key={item.id}
            item={item}
            isSelected={selectedId === item.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};

function ChatThreadItemRow({ item, isSelected, onSelect }: { item: ChatThreadItem; isSelected: boolean; onSelect: (id: string) => void }) {
  const source = item.channelLabel === 'DM' ? 'DM' : (item.channelLabel ?? 'DM');
  const replyAuthor = item.lastReplyAuthor ?? item.avatarName;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item.id)}
      onKeyDown={e => e.key === 'Enter' && onSelect(item.id)}
      className={`flex gap-3 items-center pl-4 pr-3 py-2 cursor-pointer transition-colors rounded-[16px] ${
        isSelected ? 'bg-active' : 'hover:bg-hover'
      }`}
    >
      <Avatar name={replyAuthor} size="md" />

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {/* Row 1: Name in Source + Time */}
        <div className="flex items-center gap-2 min-w-0 whitespace-nowrap">
          <div className="flex items-center gap-1 flex-1 min-w-0 truncate">
            <Typography variant="heading-sm" color="primary" className="shrink-0">
              {replyAuthor}
            </Typography>
            <Typography variant="body-sm" color="tertiary" className="shrink-0">
              in
            </Typography>
            <Typography variant="body-sm" color="tertiary" className="truncate">
              {source}
            </Typography>
          </div>
          <Typography variant="caption" color="disabled" className="shrink-0">
            {item.time}
          </Typography>
        </div>

        {/* Row 2: Last reply */}
        <Typography variant="body-sm" color="secondary" className="truncate w-full">
          {item.lastReply}
        </Typography>
      </div>
    </div>
  );
}

export default ChatThreadsListV1_5;
