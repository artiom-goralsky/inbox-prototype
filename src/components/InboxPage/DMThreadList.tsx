import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Select } from '@circleco/compass/components/Select';

interface Thread {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread?: boolean;
}

const THREADS: Thread[] = [
  // Scenario DM threads (12 unread)
  { id: 'james-liu',    name: 'James Liu',     preview: 'Thanks for the camera settings tip...',       time: '5h',  unread: true },
  { id: 'emily-park',   name: 'Emily Park',    preview: 'The landscape composition lesson was...',     time: '8h',  unread: true },
  { id: 'david-kim',    name: 'David Kim',     preview: 'Just wanted to say the community is...',      time: '1d',  unread: true },
  { id: 'amy-torres',   name: 'Amy Torres',    preview: 'Thanks for the feedback on my portrait...',   time: '1d',  unread: true },
  { id: 'chen-wei',     name: 'Chen Wei',      preview: 'How do I access lesson 3?',                  time: '6h',  unread: true },
  { id: 'maria-santos', name: 'Maria Santos',  preview: 'When is the next live session?',             time: '8h',  unread: true },
  { id: 'chris-lee',    name: 'Chris Lee',     preview: 'Can I download the lesson videos?',          time: '10h', unread: true },
  { id: 'nina-patel',   name: 'Nina Patel',    preview: 'Video in Portrait Pro lesson 7 stops...',    time: '4h',  unread: true },
  { id: 'omar-hassan',  name: 'Omar Hassan',   preview: 'My payment failed when trying to renew...',  time: '12h', unread: true },
  { id: 'tom-brown',    name: 'Tom Brown',     preview: 'Any chance of a guest pass for my friend?',  time: '7h',  unread: true },
  { id: 'lisa-wong',    name: 'Lisa Wong',     preview: 'Want to switch from monthly to annual...',   time: '9h',  unread: true },
  { id: 'alex-chen',    name: 'Alex Chen',     preview: "I'd like to request a refund for...",        time: '4h',  unread: true },
];

const FILTER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
];

interface DMThreadListProps {
  selectedId: string;
  onSelect: (id: string) => void;
  readIds?: Set<string>;
  sentReplies?: Record<string, string>;
  onRead?: (id: string) => void;
}

const DMThreadList: React.FC<DMThreadListProps> = ({ selectedId, onSelect, readIds, sentReplies, onRead }) => {
  const [filter, setFilter] = useState('all');

  const threads = THREADS.map(t => ({
    ...t,
    unread: t.unread && !readIds?.has(t.id),
    preview: sentReplies?.[t.id] ? `You: ${sentReplies[t.id].slice(0, 40)}...` : t.preview,
  }));
  const visible = filter === 'unread' ? threads.filter(t => t.unread) : threads;

  return (
    <div className="w-full h-full border-r border-secondary flex flex-col bg-primary">
      {/* Filter bar */}
      <div className="px-4 pt-4 pb-3 border-b border-secondary shrink-0">
        <Select
          aria-label="Filter messages"
          placeholder="All"
          options={FILTER_OPTIONS}
          onValueChange={v => setFilter(v?.value ?? 'all')}
        />
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto p-2">
        {visible.map(thread => (
          <div
            key={thread.id}
            role="button"
            tabIndex={0}
            onClick={() => { onSelect(thread.id); onRead?.(thread.id); }}
            onKeyDown={e => { if (e.key === 'Enter') { onSelect(thread.id); onRead?.(thread.id); } }}
            className={`flex items-center gap-3 pl-4 pr-3 h-14 shrink-0 cursor-pointer transition-colors rounded-lg ${
              selectedId === thread.id ? 'bg-active' : 'hover:bg-hover'
            }`}
          >
            <Avatar name={thread.name} size="sm" />

            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <Typography variant="heading-sm" color="primary" className="truncate">
                  {thread.name}
                </Typography>
                <Typography variant="caption" color="disabled" className="shrink-0">
                  {thread.time}
                </Typography>
              </div>
              <Typography variant="body-sm" color="tertiary" className="truncate">
                {thread.preview}
              </Typography>
            </div>

            {thread.unread && (
              <div className="w-1.5 h-1.5 rounded-full bg-info shrink-0" />
            )}
          </div>
        ))}

        {visible.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <Typography variant="body-sm" color="tertiary">No messages</Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default DMThreadList;
