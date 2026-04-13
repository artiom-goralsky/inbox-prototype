import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Icon } from '@circleco/compass/components/Icon';
import { Select } from '@circleco/compass/components/Select';

interface AIThread {
  id: string;
  name: string;
  preview: string;
  time: string;
  agentName: string;
  paused?: boolean;
  pauseReason?: string;
}

const THREADS: AIThread[] = [
  { id: 'sarah-kim',  name: 'Sarah Kim',    preview: 'Do you offer group discounts?',        time: '2h',        agentName: 'Support Agent',    paused: true, pauseReason: '"cancel" detected' },
  { id: '1',          name: 'Tom Richards',  preview: 'Thanks, that makes sense!',            time: '8:30',      agentName: 'Onboarding Agent' },
  { id: '2',          name: 'Priya Sharma',  preview: 'How do I update my payment method?',   time: 'Yesterday', agentName: 'Support Agent' },
  { id: '3',          name: 'James Morton',  preview: '',                                     time: 'Mon',       agentName: 'Sales Agent',      paused: true, pauseReason: '"refund" detected' },
  { id: 'tom-brown',  name: 'Tom Brown',     preview: 'How do I reset my password?',          time: '5h',        agentName: 'FAQ Agent' },
  { id: 'lisa-wong',  name: 'Lisa Wong',     preview: 'What courses cover portrait photo...', time: '1h',        agentName: 'FAQ Agent' },
];

const STATUS_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'AI Paused', value: 'paused' },
];

const AGENT_OPTIONS = [
  { label: 'All agents', value: '' },
  { label: 'Support Agent', value: 'Support Agent' },
  { label: 'Onboarding Agent', value: 'Onboarding Agent' },
  { label: 'FAQ Agent', value: 'FAQ Agent' },
  { label: 'Sales Agent', value: 'Sales Agent' },
];

interface AIInboxThreadListProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

const AIInboxThreadList: React.FC<AIInboxThreadListProps> = ({ selectedId, onSelect }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('');

  const visible = THREADS.filter(t => {
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'paused' && t.paused);
    const matchAgent = !agentFilter || t.agentName === agentFilter;
    return matchStatus && matchAgent;
  });

  return (
    <div className="w-full h-full border-r border-secondary flex flex-col bg-primary">
      {/* Filter bar */}
      <div className="px-4 pt-4 pb-3 flex gap-2 border-b border-secondary shrink-0">
        <Select
          aria-label="Filter by status"
          placeholder="All"
          options={STATUS_OPTIONS}
          onValueChange={v => setStatusFilter(v?.value ?? 'all')}
          rootClassName="flex-1 min-w-0"
        />
        <Select
          aria-label="Filter by agent"
          placeholder="All agents"
          options={AGENT_OPTIONS}
          onValueChange={v => setAgentFilter(v?.value ?? '')}
          rootClassName="flex-1 min-w-0"
        />
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto p-2">
        {visible.map(thread => (
          <div
            key={thread.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(thread.id)}
            onKeyDown={e => e.key === 'Enter' && onSelect(thread.id)}
            className={`flex items-start gap-3 pl-4 pr-3 py-2 cursor-pointer transition-colors rounded-lg ${
              selectedId === thread.id ? 'bg-active' : 'hover:bg-hover'
            }`}
          >
            <Avatar name={thread.name} size="sm" />

            <div className="flex-1 min-w-0 flex flex-col gap-1">
              {/* Row 1: name + time */}
              <div className="flex items-center gap-2 min-w-0">
                <Typography variant="heading-sm" color="primary" className="truncate">
                  {thread.name}
                </Typography>
                <Typography variant="caption" color="disabled" className="shrink-0 ml-auto">
                  {thread.time}
                </Typography>
              </div>

              {/* Row 2: agent name */}
              <Typography variant="caption" color="tertiary" className="truncate">
                {thread.agentName}
              </Typography>

              {/* Row 3: preview or paused status */}
              {thread.paused ? (
                <div className="flex items-center gap-1 min-w-0">
                  <Icon name="clock-snooze" size="sm" color="warning" />
                  <Typography variant="body-sm" color="warning" className="truncate">
                    Paused — {thread.pauseReason}
                  </Typography>
                </div>
              ) : (
                <Typography variant="body-sm" color="secondary" className="truncate">
                  {thread.preview}
                </Typography>
              )}
            </div>
          </div>
        ))}

        {visible.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <Typography variant="body-sm" color="tertiary">No conversations</Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInboxThreadList;
