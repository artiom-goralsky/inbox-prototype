import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Icon } from '@circleco/compass/components/Icon';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Badge } from '@circleco/compass/components/Badge';
import { Select } from '@circleco/compass/components/Select';
import type { V1Category } from './v1MockData';
import NotificationsPopover from '../NotificationsPopover';

type V1CategoryOrSupport = V1Category | 'support';

interface CategoryPanelV1Props {
  activeCategory: V1CategoryOrSupport;
  onCategoryChange: (category: V1Category) => void;
  onVersionChange: (version: 'v1' | 'v1.5' | 'v2') => void;
  onSupportClick?: () => void;
  supportBadgeCount?: number;
}

const MINE_CATEGORIES: { id: V1Category; label: string; iconType: 'avatar' | 'icon'; iconName?: string; count?: number }[] = [
  { id: 'dms', label: 'DMs', iconType: 'avatar', count: 23 },
];

const SHARED_CATEGORIES: { id: V1Category; label: string; iconType: 'icon'; iconName: string; count?: number }[] = [
  { id: 'moderation', label: 'Moderation', iconType: 'icon', iconName: 'flag', count: 13 },
  { id: 'course-comments', label: 'Course comments', iconType: 'icon', iconName: 'graduate-cap' },
  { id: 'ai-inbox', label: 'AI Inbox', iconType: 'icon', iconName: 'ai-box', count: 7 },
];

const CategoryPanelV1: React.FC<CategoryPanelV1Props> = ({
  activeCategory,
  onCategoryChange,
  onVersionChange,
  onSupportClick,
  supportBadgeCount = 0,
}) => {
  const renderItem = (item: { id: V1Category; label: string; iconType: 'avatar' | 'icon'; iconName?: string; count?: number }) => (
    <button
      key={item.id}
      onClick={() => onCategoryChange(item.id)}
      className={`flex items-center gap-3 h-9 w-full px-3 py-1 rounded-lg text-left transition-colors ${
        activeCategory === item.id ? 'bg-active' : 'hover:bg-hover'
      }`}
    >
      {item.iconType === 'avatar' ? (
        <Avatar name="Admin" size="xxs" />
      ) : (
        <Icon name={item.iconName as any} size="sm" />
      )}
      <Typography variant="body-sm" color="primary" className="truncate flex-1">
        {item.label}
      </Typography>
      {item.count != null && item.count > 0 && (
        <Badge variant="secondary" label={String(item.count)} />
      )}
    </button>
  );

  return (
    <div className="w-[200px] h-full border-r border-[#f0f3f5] bg-primary flex flex-col shrink-0 overflow-hidden">
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

      {/* Footer: Support + version switcher, separated by divider from Mine/Shared */}
      <div className="shrink-0 border-t border-secondary mt-2">
        {onSupportClick && (
          <div className="px-2 pt-2">
            <button
              onClick={onSupportClick}
              className={`flex items-center gap-3 h-9 w-full px-3 py-1 rounded-lg text-left transition-colors ${
                activeCategory === 'support' ? 'bg-active' : 'hover:bg-hover'
              }`}
            >
              <Icon name="circle-questionmark" size="sm" />
              <Typography variant="body-sm" color="primary" className="truncate flex-1">
                Support
              </Typography>
              {supportBadgeCount > 0 && (
                <Badge variant="secondary" label={String(supportBadgeCount)} />
              )}
            </button>
          </div>
        )}
        <div className="p-3">
          <Select
            aria-label="Prototype version"
            placeholder="v 1"
            options={[
              { label: 'v 1', value: 'v1' },
              { label: 'v 1.5', value: 'v1.5' },
              { label: 'v 2', value: 'v2' },
            ]}
            onValueChange={(v) => {
              if (v?.value === 'v1.5') onVersionChange('v1.5');
              if (v?.value === 'v2') onVersionChange('v2');
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryPanelV1;
