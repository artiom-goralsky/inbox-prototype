import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Icon } from '@circleco/compass/components/Icon';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Select } from '@circleco/compass/components/Select';
import type { V1_5Category } from './v1_5MockData';
import NotificationsPopover from '../NotificationsPopover';

interface CategoryPanelV1_5Props {
  activeCategory: V1_5Category;
  onCategoryChange: (category: V1_5Category) => void;
  onVersionChange: (version: 'v1' | 'v1.5' | 'v2') => void;
}

const MINE_CATEGORIES: { id: V1_5Category; label: string; iconType: 'avatar' | 'icon'; iconName?: string }[] = [
  { id: 'dms', label: 'DMs', iconType: 'avatar' },
  { id: 'chat-threads', label: 'Chat threads', iconType: 'icon', iconName: 'thread' },
  { id: 'connection-requests', label: 'Connection requests', iconType: 'icon', iconName: 'people-add' },
];

const SHARED_CATEGORIES: { id: V1_5Category; label: string; iconType: 'icon'; iconName: string }[] = [
  { id: 'moderation' as V1_5Category, label: 'Moderation', iconType: 'icon' as const, iconName: 'flag' },
  { id: 'course-comments' as V1_5Category, label: 'Course comments', iconType: 'icon' as const, iconName: 'graduate-cap' },
  { id: 'ai-inbox' as V1_5Category, label: 'AI Inbox', iconType: 'icon' as const, iconName: 'ai-box' },
];

const CategoryPanelV1_5: React.FC<CategoryPanelV1_5Props> = ({ activeCategory, onCategoryChange, onVersionChange }) => {
  const renderItem = (item: { id: V1_5Category; label: string; iconType: 'avatar' | 'icon'; iconName?: string }) => (
    <button
      key={item.id}
      onClick={() => onCategoryChange(item.id)}
      className={`flex items-center gap-3 h-9 w-full px-3 py-1 rounded-lg text-left transition-colors ${
        activeCategory === item.id ? 'bg-active' : 'hover:bg-hover'
      }`}
    >
      {item.iconType === 'avatar' ? (
        <Avatar src="/images/avatars/1.png" name="Rudy" size="xxs" />
      ) : (
        <Icon name={item.iconName as any} size="sm" />
      )}
      <Typography variant="body-sm" color="primary" className="truncate flex-1">
        {item.label}
      </Typography>
    </button>
  );

  return (
    <div className="w-[220px] h-full border-r border-[#f0f3f5] bg-primary flex flex-col shrink-0 overflow-hidden">
      {/* Header */}
      <div className="p-4 shrink-0 flex items-center justify-between">
        <Typography variant="heading-md" color="primary">Inbox</Typography>
        <NotificationsPopover />
      </div>

      {/* Categories */}
      <div className="px-2 flex flex-col flex-1 gap-4">
        {/* Mine */}
        <div className="flex flex-col gap-0.5">
          <div className="pt-3 pb-1 px-3">
            <Typography variant="label-xs" color="tertiary">Mine</Typography>
          </div>
          {MINE_CATEGORIES.map(renderItem)}
        </div>

        {/* Shared */}
        <div className="flex flex-col gap-0.5">
          <div className="pt-3 pb-1 px-3">
            <Typography variant="label-xs" color="tertiary">Shared</Typography>
          </div>
          {SHARED_CATEGORIES.map(renderItem)}
        </div>
      </div>

      {/* Version switcher */}
      <div className="p-3 shrink-0">
        <Select
          aria-label="Prototype version"
          placeholder="v 1.5"
          options={[
            { label: 'v 1', value: 'v1' },
            { label: 'v 1.5', value: 'v1.5' },
            { label: 'v 2', value: 'v2' },
          ]}
          onValueChange={(v) => {
            if (v?.value === 'v1') onVersionChange('v1');
            if (v?.value === 'v2') onVersionChange('v2');
          }}
        />
      </div>
    </div>
  );
};

export default CategoryPanelV1_5;
