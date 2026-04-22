import React, { useState, useEffect } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Menu } from '@circleco/compass/components/Menu';
import { Select } from '@circleco/compass/components/Select';
import { Tabs } from '@circleco/compass/components/Tabs';
import { TextInput } from '@circleco/compass/components/TextInput';
import { Icon } from '@circleco/compass/components/Icon';
import { getThreadsForCategory, INITIAL_REVIEWED_IDS, INITIAL_DECISIONS, type V1Category } from './v1MockData';
import CourseCommentRow from '../CourseCommentRow';

const AGENT_OPTIONS = [
  { label: 'All agents', value: 'all' },
  { label: 'Support Agent', value: 'support' },
  { label: 'Clarity Bot', value: 'clarity' },
];

const COURSE_SCOPE_OPTIONS = [
  { label: 'All courses', value: 'all' },
  { label: 'Intro to Photography', value: 'Intro to Photography' },
  { label: 'Landscape Masterclass', value: 'Landscape Masterclass' },
  { label: 'Portrait Essentials', value: 'Portrait Essentials' },
  { label: 'Street Photography', value: 'Street Photography' },
  { label: 'Post-Processing Pro', value: 'Post-Processing Pro' },
];

const CATEGORY_TITLE: Record<V1Category, string> = {
  dms: 'DMs',
  moderation: 'Moderation',
  'course-comments': 'Course comments',
  'ai-inbox': 'AI Inbox',
};


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

interface ThreadListV1Props {
  category: V1Category;
  selectedId: string;
  onSelect: (id: string) => void;
  onSettingsOpen?: () => void;
  titleOverride?: string;
  onNewMessage?: () => void;
  showSortSelect?: boolean;
}

const ThreadListV1: React.FC<ThreadListV1Props> = ({ category, selectedId, onSelect, onSettingsOpen, titleOverride, onNewMessage, showSortSelect = false }) => {
  const threads = getThreadsForCategory(category);

  // Moderation: local reviewed set + decisions + dismiss animation
  const [localReviewed, setLocalReviewed] = useState<Set<string>>(() => new Set(INITIAL_REVIEWED_IDS));
  const [decisions, setDecisions] = useState<Record<string, 'approved' | 'removed'>>(() => ({ ...INITIAL_DECISIONS }));
  const [itemAnims, setItemAnims] = useState<Record<string, CardAnim>>({});

  useEffect(() => {
    if (category !== 'moderation') return;
    const reviewHandler = (e: Event) => {
      const { id, action } = (e as CustomEvent).detail as { id: string; action: 'approved' | 'removed' };
      setLocalReviewed(prev => {
        const next = new Set(prev);
        next.add(id);
        // Auto-advance to next pending item
        const pending = threads.filter(t => !next.has(t.id));
        if (pending.length > 0) {
          onSelect(pending[0].id);
        }
        return next;
      });
      setDecisions(prev => ({ ...prev, [id]: action }));
      setItemAnims(p => ({ ...p, [id]: 'dismissing' }));
      setTimeout(() => setItemAnims(p => ({ ...p, [id]: 'collapsing' })), DISMISS_MS);
      setTimeout(() => setItemAnims(p => ({ ...p, [id]: 'removed' })), DISMISS_MS + COLLAPSE_MS);
    };
    const navHandler = (e: Event) => {
      const { id } = (e as CustomEvent).detail as { id: string };
      // Switch to the correct tab based on whether the target is reviewed or pending
      setModStatus(prev => {
        if (!localReviewed.has(id)) return prev === 'inbox' ? prev : 'inbox';
        const decision = decisions[id];
        const targetTab = decision === 'removed' ? 'rejected' : 'approved';
        if (prev !== targetTab) return targetTab;
        return prev;
      });
      onSelect(id);
    };
    window.addEventListener('moderation-reviewed', reviewHandler);
    window.addEventListener('moderation-navigate', navHandler);
    return () => {
      window.removeEventListener('moderation-reviewed', reviewHandler);
      window.removeEventListener('moderation-navigate', navHandler);
    };
  }, [category, localReviewed, onSelect]);

  // Status filters
  const [dmStatus, setDmStatus] = useState<'all' | 'unread'>('all');
  const [modStatus, setModStatus] = useState<'inbox' | 'approved' | 'rejected'>('inbox');
  const [courseStatus, setCourseStatus] = useState<'all' | 'unanswered'>('all');
  const [aiStatusFilter, setAiStatusFilter] = useState<'all' | 'paused'>('all');

  // Scope filters
  const [dmScope, setDmScope] = useState<'all' | 'people' | 'ai'>('all');
  const [courseScope, setCourseScope] = useState('all');
  const [aiAgent, setAiAgent] = useState('all');

  // Sort state
  const [sortMode, setSortMode] = useState('newest');

  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');

  const toggleSearch = () => {
    if (searchOpen) setSearch('');
    setSearchOpen(p => !p);
  };

  const getFilteredThreads = () => {
    switch (category) {
      case 'dms':
        return threads.filter(t => {
          if (dmStatus === 'unread' && !t.unread) return false;
          if (dmScope === 'people' && t.isAgent) return false;
          if (dmScope === 'ai' && !t.isAgent) return false;
          if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
          return true;
        });
      case 'moderation': {
        if (modStatus === 'approved') {
          return threads.filter(t => localReviewed.has(t.id) && decisions[t.id] === 'approved');
        }
        if (modStatus === 'rejected') {
          return threads.filter(t => localReviewed.has(t.id) && decisions[t.id] === 'removed');
        }
        // Inbox: show items not yet reviewed, plus items still animating out
        return threads.filter(t => {
          const anim = itemAnims[t.id];
          if (anim && anim !== 'removed') return true;
          if (localReviewed.has(t.id)) return false;
          return true;
        });
      }
      case 'course-comments':
        return threads.filter(t => {
          if (courseScope !== 'all' && t.lessonName !== courseScope) return false;
          return true;
        });
      case 'ai-inbox':
        return threads.filter(t => {
          if (aiStatusFilter === 'paused' && t.aiStatus !== 'paused') return false;
          if (aiAgent !== 'all' && t.agentId !== aiAgent) return false;
          if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
          return true;
        });
    }
  };

  const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };
  const PRIORITY_LEVELS: Array<{ key: string; label: string; dotColor: string; estimate: string }> = [
    { key: 'high', label: 'High priority', dotColor: '#E24B4A', estimate: '~2 min' },
    { key: 'medium', label: 'Medium priority', dotColor: '#BA7517', estimate: '~3 min' },
    { key: 'low', label: 'Low priority', dotColor: 'var(--color-text-tertiary, #717680)', estimate: '~2 min' },
  ];
  const filtered = getFilteredThreads();
  const filteredThreads = sortMode === 'ai-priority'
    ? [...filtered].sort((a, b) => PRIORITY_ORDER[a.priority ?? 'low'] - PRIORITY_ORDER[b.priority ?? 'low'])
    : filtered;
  const isAiPriority = sortMode === 'ai-priority';

  // Sort options per category
  const getSortOptions = () => {
    switch (category) {
      case 'dms': return [
        { label: 'AI priority', value: 'ai-priority' },
        { label: 'Last activity', value: 'newest' },
        { label: 'Oldest unanswered', value: 'oldest' },
      ];
      case 'moderation': return [
        { label: 'AI priority', value: 'ai-priority' },
        { label: 'Newest', value: 'newest' },
        { label: 'Most reports', value: 'most-reports' },
      ];
      case 'course-comments': return [
        { label: 'AI priority', value: 'ai-priority' },
        { label: 'Newest', value: 'newest' },
        { label: 'By course', value: 'by-course' },
      ];
      case 'ai-inbox': return [
        { label: 'AI priority', value: 'ai-priority' },
        { label: 'Last activity', value: 'newest' },
        { label: 'Paused first', value: 'paused-first' },
      ];
    }
  };

  const renderTitleIcons = () => {
    switch (category) {
      case 'dms':
        return (
          <>
            <IconButton icon="magnifying-glass" size="md" variant="ghost" aria-label="Search" onClick={toggleSearch} />
            <IconButton icon="checkmark-double" size="md" variant="ghost" aria-label="Mark all read" />
            <IconButton icon="plus" size="md" variant="ghost" aria-label="New message" onClick={onNewMessage} />
          </>
        );
      case 'moderation':
        return (
          <IconButton icon="settings-gear" size="md" variant="ghost" aria-label="Settings" onClick={onSettingsOpen} />
        );
      case 'course-comments':
        return null;
      case 'ai-inbox':
        return (
          <IconButton icon="magnifying-glass" size="md" variant="ghost" aria-label="Search" onClick={toggleSearch} />
        );
    }
  };

  const renderFilterBar = () => {
    switch (category) {
      case 'dms': {
        const dmTab = dmScope === 'ai' ? 'agents' : dmStatus === 'unread' ? 'unread' : 'all';
        return (
          <div className="flex items-center justify-between w-full">
            <Tabs.Root
              tabs={[{ value: 'all', label: 'Inbox' }, { value: 'unread', label: 'Unread' }, { value: 'agents', label: 'Agents' }]}
              selectedValue={dmTab}
              onValueChange={v => {
                if (v === 'agents') {
                  setDmScope('ai');
                  setDmStatus('all');
                } else {
                  setDmScope('all');
                  setDmStatus(v as 'all' | 'unread');
                }
              }}
              size="md"
            />
            {showSortSelect && (
              <Menu
                options={getSortOptions().map(o => ({ label: o.label, onClick: () => setSortMode(o.value) }))}
                trigger={<IconButton icon="arrow-bottom-top" size="md" variant="outline" aria-label="Sort" />}
              />
            )}
          </div>
        );
      }
      case 'moderation':
        return (
          <Tabs.Root
            tabs={[{ value: 'inbox', label: 'Inbox' }, { value: 'approved', label: 'Approved' }, { value: 'rejected', label: 'Rejected' }]}
            selectedValue={modStatus}
            onValueChange={v => setModStatus(v as 'inbox' | 'approved' | 'rejected')}
            size="md"
          />
        );
      case 'course-comments':
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center shrink-0">
              <Select
                aria-label="Course scope"
                value={{ label: COURSE_SCOPE_OPTIONS.find(o => o.value === courseScope)?.label ?? 'All courses', value: courseScope }}
                placeholder="All courses"
                options={COURSE_SCOPE_OPTIONS}
                onValueChange={v => setCourseScope((v as any)?.value ?? 'all')}
              />
            </div>
            <Menu
              options={getSortOptions().map(o => ({ label: o.label, onClick: () => setSortMode(o.value) }))}
              trigger={<IconButton icon="arrow-bottom-top" size="md" variant="outline" aria-label="Sort" />}
            />
          </div>
        );
      case 'ai-inbox':
        return (
          <div className="flex items-center justify-between w-full">
            <Tabs.Root
              tabs={[{ value: 'all', label: 'All' }, { value: 'paused', label: 'Paused' }]}
              selectedValue={aiStatusFilter}
              onValueChange={v => setAiStatusFilter(v as 'all' | 'paused')}
              size="md"
            />
            <div className="flex items-center gap-2 shrink-0">
              <Select
                aria-label="Agent filter"
                value={{ label: AGENT_OPTIONS.find(o => o.value === aiAgent)?.label ?? 'All agents', value: aiAgent }}
                placeholder="All agents"
                options={AGENT_OPTIONS}
                onValueChange={v => setAiAgent((v as any)?.value ?? 'all')}
              />
              <Menu
                options={getSortOptions().map(o => ({ label: o.label, onClick: () => setSortMode(o.value) }))}
                trigger={<IconButton icon="arrow-bottom-top" size="md" variant="outline" aria-label="Sort" />}
              />
            </div>
          </div>
        );
    }
  };

  const renderThreadItem = (item: ReturnType<typeof getThreadsForCategory>[number]) => {
    const isSelected = selectedId === item.id;
    const isMod = category === 'moderation';
    const itemAnimState = isMod && modStatus === 'inbox' ? (itemAnims[item.id] ?? 'active') : 'active';

    return (
      <div
        key={item.id}
        role="button"
        tabIndex={0}
        onClick={() => onSelect(item.id)}
        onKeyDown={(e) => e.key === 'Enter' && onSelect(item.id)}
        className={`flex gap-3 items-center pl-4 pr-3 py-2 cursor-pointer transition-colors rounded-xl ${
          isSelected ? 'bg-active' : 'hover:bg-hover'
        } ${animClass(itemAnimState)}`}
      >
        {category === 'course-comments' && item.lessonName ? (
          <CourseCommentRow
            lessonTitle={item.lessonName}
            lastCommenter={item.name}
            lastCommentPreview={item.preview}
            time={item.time}
          />
        ) : (
          <>
            {item.isAgent ? (
              <img src="/images/agent-avatar.svg" alt={item.name} className="size-8 rounded-full shrink-0" />
            ) : (
              <Avatar name={item.name} size="md" />
            )}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <Typography variant="heading-sm" color="primary" className={isMod ? 'shrink-0 truncate' : 'flex-1 truncate'}>
                  {item.name}
                </Typography>
                {isMod && item.badgeLabel && (
                  <Typography variant="caption" color="tertiary" className="shrink-0">{item.badgeLabel}</Typography>
                )}
                <Typography variant="caption" color="disabled" className={isMod ? 'flex-1 text-right shrink-0' : 'shrink-0'}>
                  {item.time}
                </Typography>
                {category === 'ai-inbox' && item.aiStatus === 'paused' && (
                  <Icon name="clock-snooze" size="sm" color="tertiary" />
                )}
                {category === 'ai-inbox' && item.aiStatus === 'active' && (
                  <div className="size-2 rounded-full bg-info shrink-0" aria-label="Active" />
                )}
                {!isMod && category === 'dms' && item.unread && (
                  <div className="size-2 rounded-full bg-info shrink-0" aria-label="Unread" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Typography variant="body-sm" color="secondary" className="truncate flex-1">
                  {item.preview}
                </Typography>
                {isMod && decisions[item.id] === 'approved' && (
                  <Icon name="circle-check-filled" size="sm" color="success" />
                )}
                {isMod && decisions[item.id] === 'removed' && (
                  <Icon name="circle-x-filled" size="sm" color="danger" />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-primary border-r border-[#f0f3f5] flex flex-col overflow-hidden">

      {/* Title header */}
      <div className="flex items-center gap-2 h-14 pl-6 pr-4 shrink-0">
        <Typography variant="heading-md" color="primary" className="flex-1 truncate">
          {titleOverride ?? CATEGORY_TITLE[category]}
        </Typography>
        <div className="flex items-center gap-1 shrink-0">
          {renderTitleIcons()}
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col shrink-0 border-b border-[#f0f3f5]">
        <div className="px-4 h-10 flex items-center pb-3 box-content">
          {renderFilterBar()}
        </div>
        {searchOpen && (
          <div className="px-3 pb-2">
            <TextInput
              icon="magnifying-glass"
              placeholder="Search for a name"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Thread items */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5">
        {filteredThreads.length === 0 ? (
          <div className="flex items-center justify-center flex-1 py-8">
            <Typography variant="body-sm" color="tertiary">No results</Typography>
          </div>
        ) : isAiPriority ? (
          PRIORITY_LEVELS.map(({ key, label, dotColor, estimate }) => {
            const groupItems = filteredThreads.filter(i => (i.priority ?? 'low') === key);
            if (groupItems.length === 0) return null;
            return (
              <div key={key}>
                <div className="sticky top-0 z-10 flex items-center gap-2 h-9 pl-4 pr-3 bg-primary">
                  <div className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
                  <Typography variant="caption" color="tertiary" className="font-semibold">
                    {label} · {groupItems.length}
                  </Typography>
                  <Typography variant="caption" color="tertiary" className="ml-auto shrink-0">
                    {estimate}
                  </Typography>
                </div>
                {groupItems.map(item => renderThreadItem(item))}
              </div>
            );
          })
        ) : (
          filteredThreads.map((item) => renderThreadItem(item))
        )}
      </div>
    </div>
  );
};

export default ThreadListV1;
