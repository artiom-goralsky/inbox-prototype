import React, { useState, useEffect, useMemo } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Tabs } from '@circleco/compass/components/Tabs';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Menu } from '@circleco/compass/components/Menu';
import SortViewDropdown, { type ViewMode } from './v2/SortViewDropdown';

// Dismiss animation (same as TodayView)
type CardAnim = 'active' | 'dismissing' | 'collapsing' | 'removed';
const DISMISS_MS = 300;
const COLLAPSE_MS = 250;

const animClass = (state: CardAnim) => {
  if (state === 'dismissing') return 'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] scale-95 opacity-0 pointer-events-none';
  if (state === 'collapsing') return 'transition-all duration-[250ms] ease-out h-0 !py-0 !gap-0 overflow-hidden opacity-0 pointer-events-none';
  if (state === 'removed') return 'hidden';
  return '';
};

interface Author {
  id: string;
  name: string;
  topReason: string;
  itemCount: number;
  time: string;
  priority: 'attention' | 'routine';
}

const AUTHORS: Author[] = [
  { id: 'maria-santos',    name: 'Maria Santos',    topReason: 'Spam',                  itemCount: 4, time: '2d', priority: 'attention' },
  { id: 'bot-accounts',    name: 'Bot accounts',    topReason: 'Spam',                  itemCount: 3, time: '1d', priority: 'routine' },
  { id: 'jake-miller',     name: 'Jake Miller',     topReason: 'False positive',        itemCount: 2, time: '1d', priority: 'routine' },
  { id: 'derek-hoffman',   name: 'Derek Hoffman',   topReason: 'Self-promotion',        itemCount: 4, time: '2d', priority: 'attention' },
  { id: 'km',           name: 'Tom Brown',       topReason: 'Hate speech',           itemCount: 2, time: '9:45', priority: 'attention' },
  { id: 'kw',           name: 'Priya Sharma',    topReason: 'Misinformation',        itemCount: 1, time: '9:45', priority: 'attention' },
  { id: 'cp',           name: 'Kenji Tanaka',    topReason: 'Spam',                  itemCount: 3, time: '8:12', priority: 'attention' },
  { id: 're',           name: 'Amy Torres',      topReason: 'Self-promotion',        itemCount: 1, time: 'Yesterday', priority: 'routine' },
  { id: 'ab',           name: 'Nina Patel',      topReason: 'Inappropriate content', itemCount: 4, time: 'Mon', priority: 'attention' },
  { id: 'ww',           name: 'David Kim',       topReason: 'Off-topic',             itemCount: 1, time: 'Mon', priority: 'routine' },
];

interface ModerationThreadListProps {
  selectedId: string;
  onSelect: (id: string) => void;
  hiddenIds?: string[];
  showSortSelect?: boolean;
  enableViewModes?: boolean;
}

const ModerationThreadList: React.FC<ModerationThreadListProps> = ({ selectedId, onSelect, hiddenIds = [], showSortSelect = false, enableViewModes = false }) => {
  const [localReviewed, setLocalReviewed] = useState<Set<string>>(new Set());
  const [itemAnims, setItemAnims] = useState<Record<string, CardAnim>>({});

  useEffect(() => {
    const handler = (e: Event) => {
      const { id } = (e as CustomEvent).detail as { id: string };
      // Mark as reviewed immediately so it shows in Reviewed tab
      setLocalReviewed(prev => { const next = new Set(prev); next.add(id); return next; });
      // Start dismiss animation for Pending tab
      setItemAnims(p => ({ ...p, [id]: 'dismissing' }));
      setTimeout(() => setItemAnims(p => ({ ...p, [id]: 'collapsing' })), DISMISS_MS);
      setTimeout(() => setItemAnims(p => ({ ...p, [id]: 'removed' })), DISMISS_MS + COLLAPSE_MS);
    };
    window.addEventListener('moderation-reviewed', handler);
    return () => window.removeEventListener('moderation-reviewed', handler);
  }, []);

  const [modFilter, setModFilter] = useState<'inbox' | 'approved' | 'rejected'>('inbox');
  const [sortMode, setSortMode] = useState('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('flat');

  const handleSortChange = (next: string) => {
    setSortMode(next);
    if (enableViewModes && next !== 'ai-priority') setViewMode('flat');
  };

  const PRIORITY_LEVELS: Array<{ key: 'attention' | 'routine'; label: string }> = [
    { key: 'attention', label: 'Needs attention' },
    { key: 'routine', label: 'Routine' },
  ];

  const MOD_SORT_OPTIONS = [
    { label: 'AI priority', value: 'ai-priority' },
    { label: 'Newest', value: 'newest' },
    { label: 'Most reports', value: 'most-reports' },
  ];

  const PRIORITY_ORDER: Record<string, number> = { attention: 0, routine: 1 };

  const visible = useMemo(() => {
    const filtered = AUTHORS.filter(a => {
      if (hiddenIds.includes(a.id)) return false;
      if (modFilter === 'approved') return localReviewed.has(a.id);
      if (modFilter === 'rejected') return localReviewed.has(a.id);
      // Inbox: pending items + animating out
      const anim = itemAnims[a.id];
      if (anim && anim !== 'removed') return true;
      return !localReviewed.has(a.id);
    });
    if (sortMode === 'ai-priority') {
      return [...filtered].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    }
    return filtered;
  }, [hiddenIds, modFilter, localReviewed, itemAnims, sortMode]);

  return (
    <div className="w-full h-full border-r border-[#f0f3f5] flex flex-col bg-primary overflow-hidden">
      {/* Title header */}
      <div className="flex items-center gap-2 h-14 pl-6 pr-4 shrink-0">
        <Typography variant="heading-md" color="primary" className="flex-1 truncate">
          Moderation
        </Typography>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col shrink-0 border-b border-[#f0f3f5]">
        <div className="px-4 h-10 flex items-center pb-3 box-content">
          <div className="flex items-center justify-between w-full">
            <Tabs.Root
              tabs={[{ value: 'inbox', label: 'Inbox' }, { value: 'approved', label: 'Approved' }, { value: 'rejected', label: 'Rejected' }]}
              selectedValue={modFilter}
              onValueChange={v => setModFilter(v as 'inbox' | 'approved' | 'rejected')}
              size="md"
            />
            {showSortSelect && (
              enableViewModes ? (
                <SortViewDropdown
                  sortOptions={MOD_SORT_OPTIONS}
                  sortValue={sortMode}
                  onSortChange={handleSortChange}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  showViewSection={sortMode === 'ai-priority'}
                />
              ) : (
                <Menu
                  options={MOD_SORT_OPTIONS.map(o => ({ label: o.label, onClick: () => setSortMode(o.value) }))}
                  trigger={<IconButton icon="arrow-bottom-top" size="md" variant="outline" aria-label="Sort" />}
                />
              )
            )}
          </div>
        </div>
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5">
        {(() => {
          const renderItem = (author: Author) => {
            const anim = modFilter === 'inbox' ? (itemAnims[author.id] ?? 'active') : 'active';
            return (
              <div
                key={author.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(author.id)}
                onKeyDown={e => e.key === 'Enter' && onSelect(author.id)}
                className={`flex items-center gap-3 pl-4 pr-3 py-2 cursor-pointer transition-colors rounded-[16px] ${
                  selectedId === author.id ? 'bg-active' : 'hover:bg-hover'
                } ${animClass(anim)}`}
              >
                <Avatar name={author.name} size="md" />

                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  {/* Row 1: name + time */}
                  <div className="flex items-center h-3.5">
                    <div className="flex flex-1 gap-2 items-center min-w-0">
                      <Typography variant="heading-sm" color="primary" className="truncate">
                        {author.name}
                      </Typography>
                      <Typography variant="caption" color="tertiary" className="shrink-0 ml-auto">
                        {author.time}
                      </Typography>
                    </div>
                  </div>

                  {/* Row 2: reason + item count */}
                  <Typography variant="body-sm" color="secondary" className="truncate">
                    {author.topReason}{author.itemCount > 1 ? ` · ${author.itemCount} items` : ''}
                  </Typography>
                </div>
              </div>
            );
          };

          const isGrouped = enableViewModes && viewMode === 'grouped' && sortMode === 'ai-priority';
          if (!isGrouped) return visible.map(renderItem);

          return PRIORITY_LEVELS.map(({ key, label }) => {
            const groupItems = visible.filter(a => a.priority === key);
            if (groupItems.length === 0) return null;
            return (
              <div key={key}>
                <div className="sticky top-0 z-10 flex items-center gap-2 h-9 pl-4 pr-3 bg-primary">
                  <Typography variant="caption" color="tertiary" className="font-medium">
                    {label} · {groupItems.length}
                  </Typography>
                </div>
                {groupItems.map(renderItem)}
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
};

export default ModerationThreadList;
