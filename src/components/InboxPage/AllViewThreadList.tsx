import React, { useState, useMemo } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Icon } from '@circleco/compass/components/Icon';
import { IconButton } from '@circleco/compass/components/IconButton';
import {
  TYPE_ICON,
  TYPE_LABEL,
  GROUP_ORDER,
  type AllViewItem,
} from './allViewMockData';
import SortViewDropdown, { type ViewMode } from './v2/SortViewDropdown';

interface AllViewThreadListProps {
  items: AllViewItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const SORT_OPTIONS = [
  { label: 'AI priority', value: 'ai-priority' },
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest unanswered', value: 'oldest' },
];

const PRIORITY_ORDER: Record<string, number> = { attention: 0, routine: 1 };

const PRIORITY_LEVELS: Array<{ key: 'attention' | 'routine'; label: string }> = [
  { key: 'attention', label: 'Needs attention' },
  { key: 'routine', label: 'Routine' },
];

// Dismiss animation
type CardAnim = 'active' | 'dismissing' | 'collapsing' | 'removed';

const AllViewThreadList: React.FC<AllViewThreadListProps> = ({ items, selectedId, onSelect }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('flat');
  const [sortMode, setSortMode] = useState<string>('ai-priority');
  const [itemAnims, setItemAnims] = useState<Record<string, CardAnim>>({});

  const visibleItems = useMemo(() => {
    const filtered = items.filter(item => {
      if (item.resolvedAt) return false;
      const anim = itemAnims[item.id];
      if (anim === 'removed') return false;
      return true;
    });

    if (sortMode === 'ai-priority') {
      return [...filtered].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    }
    return filtered;
  }, [items, itemAnims, sortMode]);

  const animClass = (state?: CardAnim) => {
    if (state === 'dismissing') return 'transition-all duration-200 ease-out opacity-0 pointer-events-none';
    if (state === 'collapsing') return 'transition-all duration-150 ease-out h-0 !py-0 overflow-hidden opacity-0 pointer-events-none';
    if (state === 'removed') return 'hidden';
    return '';
  };

  const renderItem = (item: AllViewItem) => {
    const isSelected = selectedId === item.id;
    const anim = itemAnims[item.id];

    return (
      <div
        key={item.id}
        role="button"
        tabIndex={0}
        onClick={() => onSelect(item.id)}
        onKeyDown={e => e.key === 'Enter' && onSelect(item.id)}
        className={`flex gap-3 items-center pl-4 pr-3 py-2 cursor-pointer transition-colors rounded-[16px] ${
          isSelected ? 'bg-active' : 'hover:bg-hover'
        } ${animClass(anim)}`}
      >
        {item.type === 'courseComment' && item.lessonLabel ? (
          <>
            {/* Avatar with type modifier */}
            <div className="relative shrink-0 size-8">
              <Avatar name={item.avatarName} size="md" />
              <div className="absolute -bottom-1 -right-2 bg-primary rounded-full p-0.5">
                <Icon name={TYPE_ICON[item.type] as any} size="sm" />
              </div>
            </div>

            {/* Lesson-led content */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Typography variant="heading-sm" color="primary" className="flex-1 min-w-0 truncate">
                  {item.lessonLabel}
                </Typography>
                <Typography variant="caption" color="tertiary" className="shrink-0">
                  {item.time}
                </Typography>
              </div>
              <div className="flex items-center gap-1 min-w-0">
                <Typography variant="body-sm" color="secondary" className="shrink-0">
                  {item.name}:
                </Typography>
                <Typography variant="body-sm" color="secondary" className="flex-1 min-w-0 truncate">
                  {item.commentPreview}
                </Typography>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Avatar with type modifier */}
            <div className="relative shrink-0 size-8">
              <Avatar name={item.avatarName} size="md" />
              <div className="absolute -bottom-1 -right-2 bg-primary rounded-full p-0.5">
                <Icon name={TYPE_ICON[item.type] as any} size="sm" />
              </div>
            </div>

            {/* Content — varies by type */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              {renderItemContent(item)}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderGroupedView = () => {
    // When AI priority sort: group by priority bucket.
    if (sortMode === 'ai-priority') {
      return PRIORITY_LEVELS.map(({ key, label }) => {
        const groupItems = visibleItems.filter(i => i.priority === key);
        if (groupItems.length === 0) return null;
        return (
          <div key={key}>
            <div className="sticky top-0 z-10 flex items-center h-9 pl-4 pr-3 bg-primary">
              <Typography variant="caption" color="tertiary" className="font-medium">
                {label} · {groupItems.length}
              </Typography>
            </div>
            {groupItems.map(renderItem)}
          </div>
        );
      });
    }

    // Otherwise: group by category, in left-nav order.
    return GROUP_ORDER.map(type => {
      const groupItems = visibleItems.filter(i => i.type === type);
      if (groupItems.length === 0) return null;
      return (
        <div key={type}>
          <div className="sticky top-0 z-10 flex items-center h-9 pl-4 pr-3 bg-primary">
            <Typography variant="caption" color="tertiary" className="font-medium">
              {TYPE_LABEL[type]} · {groupItems.length}
            </Typography>
          </div>
          {groupItems.map(renderItem)}
        </div>
      );
    });
  };

  return (
    <div className="h-full bg-primary border-r border-[#f0f3f5] flex flex-col overflow-hidden">
      {/* Title header */}
      <div className="flex items-center gap-2 h-14 pl-6 pr-4 shrink-0">
        <Typography variant="heading-md" color="primary" className="flex-1 truncate">
          Inbox
        </Typography>
        <IconButton icon="magnifying-glass" size="sm" variant="ghost" aria-label="Search" />
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-end px-4 pb-3 border-b border-[#f0f3f5] shrink-0">
        <SortViewDropdown
          sortOptions={SORT_OPTIONS}
          sortValue={sortMode}
          onSortChange={setSortMode}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showViewSection
        />
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto pt-1 pb-2 px-2 flex flex-col gap-0.5">
        {visibleItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 py-12">
            <Icon name="circle-check" size="lg" color="tertiary" />
            <div className="text-center">
              <Typography variant="heading-sm" color="tertiary">You're all caught up</Typography>
              <Typography variant="body-sm" color="tertiary" className="mt-1">No items need your attention right now</Typography>
            </div>
          </div>
        ) : viewMode === 'grouped' ? (
          renderGroupedView()
        ) : (
          visibleItems.map(renderItem)
        )}
      </div>
    </div>
  );
};

function renderItemContent(item: AllViewItem) {
  switch (item.type) {
    case 'dm':
      return (
        <>
          <div className="flex items-center h-3.5">
            <div className="flex flex-1 gap-1.5 items-center min-w-0 whitespace-nowrap">
              <Typography variant="heading-sm" color="primary" className="flex-1 min-w-0 truncate">
                {item.name}
              </Typography>
              <Typography variant="caption" color="tertiary" className="shrink-0">
                {item.time}
              </Typography>
            </div>
          </div>
          <Typography variant="body-sm" color="secondary" className="truncate">
            {item.preview}
          </Typography>
        </>
      );

    case 'chatThread': {
      const chatSource = item.channelLabel === 'DM' ? 'DM' : (item.channelLabel ?? 'DM');
      return (
        <>
          <div className="flex items-center gap-2 min-w-0 whitespace-nowrap">
            <div className="flex items-center gap-1 flex-1 min-w-0 truncate">
              <Typography variant="heading-sm" color="primary" className="shrink-0">
                {item.name}
              </Typography>
              <Typography variant="body-sm" color="tertiary" className="shrink-0">
                in
              </Typography>
              <Typography variant="body-sm" color="tertiary" className="truncate">
                {chatSource}
              </Typography>
            </div>
            <Typography variant="caption" color="tertiary" className="shrink-0">
              {item.time}
            </Typography>
          </div>
          <Typography variant="body-sm" color="secondary" className="truncate w-full">
            {item.lastReply}
          </Typography>
        </>
      );
    }

    case 'connectionRequest':
      return (
        <>
          <div className="flex items-center h-3.5">
            <div className="flex flex-1 gap-2 items-center min-w-0 whitespace-nowrap">
              <Typography variant="heading-sm" color="primary" className="flex-1 min-w-0 truncate">
                {item.name}
              </Typography>
              <Typography variant="caption" color="tertiary" className="shrink-0">
                {item.time}
              </Typography>
            </div>
          </div>
          <div className="flex flex-col gap-0.5 whitespace-nowrap">
            {item.role && (
              <div className="flex gap-1 items-start leading-[18px]">
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
            {item.message && (
              <Typography variant="body-sm" color="secondary" className="truncate w-full">
                {item.message}
              </Typography>
            )}
          </div>
        </>
      );

    case 'moderation':
      return (
        <>
          <div className="flex items-center h-3.5">
            <div className="flex flex-1 gap-2 items-center min-w-0">
              <Typography variant="heading-sm" color="primary" className="shrink-0 truncate">
                {item.name}
              </Typography>
              <Typography variant="caption" color="tertiary" className="flex-1 text-right shrink-0">
                {item.time}
              </Typography>
            </div>
          </div>
          <Typography variant="body-sm" color="secondary" className="truncate">
            {item.violationReason} · {item.itemCount} items
          </Typography>
        </>
      );

    case 'courseComment':
      return (
        <>
          <div className="flex items-center h-3.5">
            <div className="flex flex-1 gap-2 items-center min-w-0 whitespace-nowrap">
              <Typography variant="heading-sm" color="primary" className="flex-1 min-w-0 truncate">
                {item.name}
              </Typography>
              <Typography variant="caption" color="tertiary" className="shrink-0">
                {item.time}
              </Typography>
            </div>
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <Typography variant="caption" color="tertiary">
              {item.lessonLabel}
            </Typography>
            <Typography variant="body-sm" color="secondary" className="truncate w-full">
              {item.commentPreview}
            </Typography>
          </div>
        </>
      );

    case 'aiInbox':
      return (
        <>
          <div className="flex items-center h-3.5">
            <div className="flex flex-1 gap-2 items-center min-w-0 whitespace-nowrap">
              <Typography variant="heading-sm" color="primary" className="flex-1 min-w-0 truncate">
                {item.name}
              </Typography>
              <Typography variant="caption" color="tertiary" className="shrink-0">
                {item.time}
              </Typography>
            </div>
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <Typography variant="caption" color="tertiary">
              {item.agentName}
            </Typography>
            <Typography variant="body-sm" color="secondary" className="truncate w-full">
              {item.aiPreview}
            </Typography>
          </div>
        </>
      );
  }
}

export default AllViewThreadList;
