import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import SupportThreadItem from './SupportThreadItem';
import type { SupportThread } from './data/supportThreads';

interface SupportThreadListProps {
  threads: SupportThread[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const SupportThreadList: React.FC<SupportThreadListProps> = ({
  threads,
  selectedId,
  onSelect,
}) => {
  return (
    <div className="h-full bg-primary border-r border-[#f0f3f5] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 h-14 pl-6 pr-4 shrink-0">
        <Typography variant="heading-md" color="primary" className="flex-1 truncate">
          Support
        </Typography>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5">
        {threads.length === 0 ? (
          <div className="flex items-center justify-center py-6">
            <Typography variant="body-sm" color="tertiary">No conversations yet</Typography>
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
