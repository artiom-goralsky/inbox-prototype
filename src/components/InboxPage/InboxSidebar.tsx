import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Icon, type IconName } from '@circleco/compass/components/Icon';
import { Avatar } from '@circleco/compass/components/Avatar';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Badge } from '@circleco/compass/components/Badge';
import { Select } from '@circleco/compass/components/Select';
import { useViews } from './views/useViews';
import CreateViewModal from './views/CreateViewModal';
import type { InboxCategory, InboxView } from './views/viewTypes';
import NotificationsPopover from './NotificationsPopover';

type Tab = 'all' | 'dms' | 'chat-threads' | 'connection-requests' | 'moderation' | 'course-comments' | 'ai-inbox';

const TAB_TO_CATEGORY: Record<Tab, InboxCategory | null> = {
  all: null,
  dms: 'dms',
  'chat-threads': null,
  'connection-requests': 'connections',
  moderation: 'moderation',
  'course-comments': 'comments',
  'ai-inbox': 'ai',
};

const CATEGORY_TO_TAB: Partial<Record<InboxCategory | 'all', Tab>> = {
  dms: 'dms',
  moderation: 'moderation',
  comments: 'course-comments',
  connections: 'connection-requests',
  ai: 'ai-inbox',
};


interface NavItem {
  id: Tab;
  label: string;
  iconType: 'avatar' | 'icon';
  iconName?: IconName;
  count?: number;
}

const MINE_CATEGORIES: NavItem[] = [
  { id: 'dms',                 label: 'DMs',                 iconType: 'avatar' },
  { id: 'chat-threads',        label: 'Chat threads',        iconType: 'icon', iconName: 'thread' },
  { id: 'connection-requests', label: 'Connection requests', iconType: 'icon', iconName: 'people-add' },
];

const SHARED_CATEGORIES: NavItem[] = [
  { id: 'moderation',      label: 'Moderation',      iconType: 'icon', iconName: 'flag' },
  { id: 'course-comments', label: 'Course comments', iconType: 'icon', iconName: 'graduate-cap' },
  { id: 'ai-inbox',        label: 'AI Inbox',        iconType: 'icon', iconName: 'ai-box' },
];

const TAB_COUNTS: Partial<Record<Tab, number>> = {
  dms: 23,
  moderation: 13,
  'ai-inbox': 7,
};

interface InboxSidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onVersionChange?: (version: 'v1' | 'v1.5' | 'v2') => void;
}

const InboxSidebar: React.FC<InboxSidebarProps> = ({ activeTab, onTabChange, onVersionChange }) => {
  const [isCreateViewOpen, setIsCreateViewOpen] = useState(false);
  const { views, activeViewId, addView, removeView, selectView } = useViews();

  const inboxCategory = TAB_TO_CATEGORY[activeTab];

  const handleViewClick = (view: InboxView) => {
    if (activeViewId === view.id) {
      selectView(null);
    } else {
      selectView(view.id);
      const tab = CATEGORY_TO_TAB[view.category];
      if (tab) onTabChange(tab);
    }
  };

  return (
    <>
      <div className="w-[200px] h-full border-r border-secondary bg-primary flex flex-col shrink-0">
        {/* Header */}
        <div className="p-4 shrink-0 flex items-center justify-between">
          <Typography variant="heading-md" color="primary">Inbox</Typography>
          <NotificationsPopover />
        </div>

        {/* Body */}
        <div className="p-2 flex flex-col gap-4 flex-1 overflow-y-auto">
          {/* All — top-level item */}
          <div className="flex flex-col">
            <button
              onClick={() => { onTabChange('all'); selectView(null); }}
              className={`flex items-center gap-3 h-9 w-full px-3 py-1 rounded-xl text-left transition-colors ${
                activeTab === 'all' && !activeViewId ? 'bg-active' : 'hover:bg-hover'
              }`}
            >
              <div className="shrink-0 w-4 h-4 flex items-center justify-center overflow-hidden">
                <Icon name="inbox-empty" size="sm" />
              </div>
              <Typography variant="body-sm" color="primary" className="truncate flex-1">
                Inbox
              </Typography>
            </button>
          </div>

          {/* Categories — Mine */}
          <div className="flex flex-col gap-0.5">
            <div className="pt-3 pb-1 px-3">
              <Typography variant="label-xs" color="tertiary">Mine</Typography>
            </div>
            {MINE_CATEGORIES.map(item => {
              const count = TAB_COUNTS[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => { onTabChange(item.id); selectView(null); }}
                  className={`flex items-center gap-3 h-9 w-full px-3 py-1 rounded-xl text-left transition-colors ${
                    activeTab === item.id && !activeViewId ? 'bg-active' : 'hover:bg-hover'
                  }`}
                >
                  <div className="shrink-0 w-4 h-4 flex items-center justify-center overflow-hidden">
                    {item.iconType === 'avatar' ? (
                      <Avatar name="Me" size="xxs" />
                    ) : (
                      <Icon name={item.iconName!} size="sm" />
                    )}
                  </div>
                  <Typography variant="body-sm" color="primary" className="truncate flex-1">
                    {item.label}
                  </Typography>
                  {count != null && count > 0 && (
                    <Badge variant="secondary" label={String(count)} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Categories — Shared */}
          <div className="flex flex-col gap-0.5">
            <div className="pt-3 pb-1 px-3">
              <Typography variant="label-xs" color="tertiary">Shared</Typography>
            </div>
            {SHARED_CATEGORIES.map(item => {
              const count = TAB_COUNTS[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => { onTabChange(item.id); selectView(null); }}
                  className={`flex items-center gap-3 h-9 w-full px-3 py-1 rounded-xl text-left transition-colors ${
                    activeTab === item.id && !activeViewId ? 'bg-active' : 'hover:bg-hover'
                  }`}
                >
                  <div className="shrink-0 w-4 h-4 flex items-center justify-center overflow-hidden">
                    <Icon name={item.iconName!} size="sm" />
                  </div>
                  <Typography variant="body-sm" color="primary" className="truncate flex-1">
                    {item.label}
                  </Typography>
                  {count != null && count > 0 && (
                    <Badge variant="secondary" label={String(count)} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Views — always visible */}
          <div className="flex flex-col">
            {/* Views header with "+" on hover */}
            <div className="group flex items-center pt-3 pb-1 px-3">
              <Typography variant="label-xs" color="tertiary">Views</Typography>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <IconButton
                  icon="plus"
                  size="sm"
                  variant="ghost"
                  aria-label="Create view"
                  onClick={() => setIsCreateViewOpen(true)}
                />
              </div>
            </div>

            {/* View items */}
            {views.map(view => (
              <div key={view.id} className="group relative">
                <button
                  onClick={() => handleViewClick(view)}
                  className={`flex items-center gap-2 h-9 w-full px-3 py-1 rounded-xl text-left transition-colors ${
                    activeViewId === view.id ? 'bg-active' : 'hover:bg-hover'
                  }`}
                >
                  <span className="shrink-0 text-sm leading-none">{view.icon}</span>
                  <Typography variant="body-sm" color="primary" className="truncate flex-1">
                    {view.name}
                  </Typography>
                  <Badge variant="secondary" label={String(view.count)} />
                </button>
                {/* More options on hover */}
                <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <IconButton
                    icon="dot-menu"
                    size="sm"
                    variant="ghost"
                    aria-label={`More options for ${view.name}`}
                    onClick={e => { e.stopPropagation(); }}
                  />
                </div>
              </div>
            ))}

            {views.length === 0 && (
              <button
                className="flex items-center h-9 w-full px-3 py-1 rounded-xl text-left transition-colors hover:bg-hover"
                onClick={() => setIsCreateViewOpen(true)}
              >
                <Typography variant="body-sm" color="tertiary">
                  + Create a view
                </Typography>
              </button>
            )}
          </div>
        </div>

        {/* Version switcher */}
        <div className="p-3 shrink-0">
          <Select
            aria-label="Prototype version"
            placeholder="v 2"
            options={[
              { label: 'v 1', value: 'v1' },
              { label: 'v 1.5', value: 'v1.5' },
              { label: 'v 2', value: 'v2' },
            ]}
            onValueChange={(v) => {
              if (v?.value === 'v1') onVersionChange?.('v1');
              if (v?.value === 'v1.5') onVersionChange?.('v1.5');
            }}
          />
        </div>
      </div>

      <CreateViewModal
        isOpen={isCreateViewOpen}
        onClose={() => setIsCreateViewOpen(false)}
        onSave={viewData => { addView(viewData); setIsCreateViewOpen(false); }}
        currentCategory={inboxCategory ?? undefined}
      />
    </>
  );
};

export default InboxSidebar;
