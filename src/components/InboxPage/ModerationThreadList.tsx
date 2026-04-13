import React, { useState, useEffect } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Tabs } from '@circleco/compass/components/Tabs';

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
}

const AUTHORS: Author[] = [
  { id: 'maria-santos',    name: 'Maria Santos',    topReason: 'Spam',                  itemCount: 5, time: '2d' },
  { id: 'bot-accounts',    name: 'Bot accounts',    topReason: 'Spam',                  itemCount: 3, time: '1d' },
  { id: 'jake-miller',     name: 'Jake Miller',     topReason: 'False positive',        itemCount: 2, time: '1d' },
  { id: 'derek-hoffman',   name: 'Derek Hoffman',   topReason: 'Self-promotion',        itemCount: 4, time: '2d' },
  { id: 'km',           name: 'Kathryn Murphy', topReason: 'Hate speech',           itemCount: 2, time: '9:45' },
  { id: 'kw',           name: 'Kristin Watson', topReason: 'Misinformation',        itemCount: 1, time: '9:45' },
  { id: 'cp',           name: 'Calvin Parks',   topReason: 'Spam',                  itemCount: 3, time: '8:12' },
  { id: 're',           name: 'Ralph Edwards',  topReason: 'Self-promotion',        itemCount: 1, time: 'Yesterday' },
  { id: 'ab',           name: 'Annette Black',  topReason: 'Inappropriate content', itemCount: 4, time: 'Mon' },
  { id: 'ww',           name: 'Wade Warren',    topReason: 'Off-topic',             itemCount: 1, time: 'Mon' },
];

interface ModerationThreadListProps {
  selectedId: string;
  onSelect: (id: string) => void;
  hiddenIds?: string[];
}

const ModerationThreadList: React.FC<ModerationThreadListProps> = ({ selectedId, onSelect, hiddenIds = [] }) => {
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

  const [modFilter, setModFilter] = useState<'pending' | 'reviewed'>('pending');

  const visible = AUTHORS.filter(a => {
    if (hiddenIds.includes(a.id)) return false;
    if (modFilter === 'reviewed') return localReviewed.has(a.id);
    // Pending: show non-reviewed + still-animating items
    const anim = itemAnims[a.id];
    if (anim && anim !== 'removed') return true;
    return !localReviewed.has(a.id);
  });

  return (
    <div className="w-full h-full border-r border-secondary flex flex-col bg-primary">
      {/* Filter bar */}
      <div className="px-4 pt-4 pb-3 shrink-0">
        <Tabs.Root
          tabs={[{ value: 'pending', label: 'Pending' }, { value: 'reviewed', label: 'Reviewed' }]}
          selectedValue={modFilter}
          onValueChange={v => setModFilter(v as 'pending' | 'reviewed')}
          size="md"
        />
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto p-2">
        {visible.map(author => {
          const anim = modFilter === 'pending' ? (itemAnims[author.id] ?? 'active') : 'active';
          return (
            <div
              key={author.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(author.id)}
              onKeyDown={e => e.key === 'Enter' && onSelect(author.id)}
              className={`flex items-center gap-3 pl-4 pr-3 py-3 cursor-pointer transition-colors rounded-lg ${
                selectedId === author.id ? 'bg-active' : 'hover:bg-hover'
              } ${animClass(anim)}`}
            >
              <Avatar name={author.name} size="sm" />

              <div className="flex-1 min-w-0 flex flex-col gap-1">
                {/* Row 1: name + time */}
                <div className="flex items-center gap-2 min-w-0">
                  <Typography variant="heading-sm" color="primary" className="truncate">
                    {author.name}
                  </Typography>
                  <Typography variant="caption" color="disabled" className="shrink-0 ml-auto">
                    {author.time}
                  </Typography>
                </div>

                {/* Row 2: reason + item count */}
                <Typography variant="body-sm" color="secondary" className="truncate">
                  {author.topReason}{author.itemCount > 1 ? ` · ${author.itemCount} items` : ''}
                </Typography>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModerationThreadList;
