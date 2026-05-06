import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Select } from '@circleco/compass/components/Select';
import SupportThreadItem from './SupportThreadItem';
import type { SupportThread } from './data/supportThreads';

const FILTER_OPTIONS = [
  { label: 'Open', value: 'open' },
  { label: 'Resolved', value: 'resolved' },
] as const;

interface SupportThreadListProps {
  threads: SupportThread[];
  selectedId: string | null;
  filter: 'open' | 'resolved';
  onFilterChange: (filter: 'open' | 'resolved') => void;
  onSelect: (id: string) => void;
}

const SupportThreadList: React.FC<SupportThreadListProps> = ({
  threads,
  selectedId,
  filter,
  onFilterChange,
  onSelect,
}) => {
  const emptyText = filter === 'resolved' ? 'No resolved conversations yet' : 'No open conversations';

  return (
    <div className="h-full bg-primary border-r border-[#f0f3f5] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center h-14 pl-6 pr-4 shrink-0">
        <Typography variant="heading-md" color="primary" className="flex-1 truncate">
          Support
        </Typography>
      </div>

      {/* Filter row */}
      <div className="pb-3 px-4 border-b border-[#f0f3f5] shrink-0">
        <Select
          aria-label="Filter conversations"
          options={FILTER_OPTIONS as unknown as Array<{ label: string; value: string }>}
          value={FILTER_OPTIONS.find(o => o.value === filter) as unknown as { label: string; value: string }}
          onValueChange={v => v && onFilterChange(v.value as 'open' | 'resolved')}
        />
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto pt-1 pb-2 px-2 flex flex-col gap-[2px]">
        {threads.length === 0 ? (
          <div className="flex items-center justify-center py-8 px-4">
            <Typography variant="body-sm" color="tertiary" className="text-center">{emptyText}</Typography>
          </div>
        ) : (
          threads.map(thread => (
            <SupportThreadItem
              key={thread.id}
              thread={thread}
              isSelected={selectedId === thread.id}
              onClick={() => onSelect(thread.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SupportThreadList;
