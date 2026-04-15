import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Icon } from '@circleco/compass/components/Icon';
import type { ConnectionRequestItem } from './v1_5MockData';

interface ConnectionRequestsListV1_5Props {
  items: ConnectionRequestItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const ConnectionRequestsListV1_5: React.FC<ConnectionRequestsListV1_5Props> = ({ items, selectedId, onSelect }) => {
  return (
    <div className="h-full bg-primary border-r border-[#f0f3f5] flex flex-col overflow-hidden">
      {/* Title header */}
      <div className="flex items-center gap-2 h-14 pl-6 pr-4 shrink-0">
        <Typography variant="heading-md" color="primary" className="flex-1 truncate">
          Connection requests
        </Typography>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-8 gap-2">
            <Icon name="people-add" size="md" color="tertiary" />
            <Typography variant="body-sm" color="tertiary">No pending requests</Typography>
          </div>
        ) : (
          items.map(item => (
            <ConnectionRequestItemRow
              key={item.id}
              item={item}
              isSelected={selectedId === item.id}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
};

function ConnectionRequestItemRow({ item, isSelected, onSelect }: {
  item: ConnectionRequestItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item.id)}
      onKeyDown={e => e.key === 'Enter' && onSelect(item.id)}
      className={`flex gap-3 items-start pl-4 pr-3 py-2 cursor-pointer transition-colors rounded-[16px] ${
        isSelected ? 'bg-active' : 'hover:bg-hover'
      }`}
    >
      <Avatar name={item.name} size="md" />

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {/* Line 1: Name + time */}
        <div className="flex items-center h-3.5">
          <div className="flex flex-1 gap-2 items-center min-w-0 whitespace-nowrap">
            <Typography variant="heading-sm" color="primary" className="flex-1 min-w-0 truncate">
              {item.name}
            </Typography>
            <Typography variant="caption" color="disabled" className="shrink-0 text-right">
              {item.time}
            </Typography>
          </div>
        </div>

        {/* Line 2 + 3 */}
        <div className="flex flex-col gap-0.5 whitespace-nowrap">
          {/* Line 2: Role · Role detail */}
          {item.role && (
            <div className="flex gap-1 items-start leading-[18px] text-tertiary">
              <Typography variant="caption" color="tertiary" className="shrink-0">
                {item.role}
              </Typography>
              {item.roleDetail && (
                <>
                  <Typography variant="caption" color="tertiary" className="shrink-0">·</Typography>
                  <Typography variant="caption" color="tertiary" className="flex-1 min-w-0 truncate">
                    {item.roleDetail}
                  </Typography>
                </>
              )}
            </div>
          )}

          {/* Line 3: Message preview */}
          {item.message && (
            <Typography variant="body-sm" color="secondary" className="truncate w-full">
              {item.message}
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConnectionRequestsListV1_5;
