import React, { useState } from 'react';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Typography } from '@circleco/compass/components/Typography';
import { Badge } from '@circleco/compass/components/Badge';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Tabs } from '@circleco/compass/components/Tabs';
import { SegmentedControl } from '@circleco/compass/components/SegmentedControl';
import type { AssetItem } from '../shared/AssetDetailSidebar';

const AI_AVATAR = '/ai-avatar.png';

type ItemType = 'insight' | 'email-draft' | 'post-draft' | 'file' | 'media';

interface LibraryItem {
  id: string;
  type: ItemType;
  title: string;
  description: string;
  agent: string;
  agentAvatar: string;
}

const ITEMS: LibraryItem[] = [
  {
    id: '1',
    type: 'insight',
    title: 'Weekly community health report',
    description:
      'Revenue is up 12% MoM. 34 new members joined this week, with a 78% activation rate.',
    agent: 'Dan',
    agentAvatar: AI_AVATAR,
  },
  {
    id: '2',
    type: 'insight',
    title: 'Churn analysis - february exits',
    description:
      "12 members churned in February. Primary reasons: 42% 'not enough time', 33% 'didn't find relevant content...",
    agent: 'Dan',
    agentAvatar: AI_AVATAR,
  },
  {
    id: '3',
    type: 'email-draft',
    title: 'Onboarding welcome sequence',
    description:
      "12 members churned in February. Primary reasons: 42% 'not enough time', 33% 'didn't find relevant content...",
    agent: 'Clara',
    agentAvatar: AI_AVATAR,
  },
  {
    id: '4',
    type: 'post-draft',
    title: 'Course launch plan - growth...',
    description:
      "12 members churned in February. Primary reasons: 42% 'not enough time', 33% 'didn't find relevant content...",
    agent: 'Clara',
    agentAvatar: AI_AVATAR,
  },
  {
    id: '5',
    type: 'post-draft',
    title: 'Course launch plan - growth...',
    description:
      "12 members churned in February. Primary reasons: 42% 'not enough time', 33% 'didn't find relevant content...",
    agent: 'Clara',
    agentAvatar: AI_AVATAR,
  },
  {
    id: '6',
    type: 'email-draft',
    title: 'Onboarding welcome sequence',
    description:
      "12 members churned in February. Primary reasons: 42% 'not enough time', 33% 'didn't find relevant content...",
    agent: 'Clara',
    agentAvatar: AI_AVATAR,
  },
  {
    id: '7',
    type: 'insight',
    title: 'Weekly community health report',
    description:
      'Revenue is up 12% MoM. 34 new members joined this week, with a 78% activation rate.',
    agent: 'Dan',
    agentAvatar: AI_AVATAR,
  },
  {
    id: '8',
    type: 'insight',
    title: 'Churn analysis - february exits',
    description:
      "12 members churned in February. Primary reasons: 42% 'not enough time', 33% 'didn't find relevant content...",
    agent: 'Dan',
    agentAvatar: AI_AVATAR,
  },
];

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'insights', label: 'Insights' },
  { value: 'drafts', label: 'Drafts' },
  { value: 'files', label: 'Files' },
  { value: 'media', label: 'Media' },
];

function getBadgeProps(type: ItemType): { icon: string; label: string } {
  switch (type) {
    case 'insight':
      return { icon: 'chart-square', label: 'Insight' };
    case 'email-draft':
      return { icon: 'send', label: 'Email draft' };
    case 'post-draft':
      return { icon: 'send', label: 'Post draft' };
    case 'file':
      return { icon: 'folder', label: 'File' };
    case 'media':
      return { icon: 'image', label: 'Media' };
  }
}

function filterItems(items: LibraryItem[], tab: string): LibraryItem[] {
  switch (tab) {
    case 'insights':
      return items.filter(i => i.type === 'insight');
    case 'drafts':
      return items.filter(
        i => i.type === 'email-draft' || i.type === 'post-draft'
      );
    case 'files':
      return items.filter(i => i.type === 'file');
    case 'media':
      return items.filter(i => i.type === 'media');
    default:
      return items;
  }
}

interface LibraryCardProps {
  item: LibraryItem;
  selected?: boolean;
  onClick?: () => void;
}

const LibraryCard: React.FC<LibraryCardProps> = ({ item, selected, onClick }) => {
  const badge = getBadgeProps(item.type);
  return (
    <div
      onClick={onClick}
      className={[
        'bg-primary flex flex-col gap-4 px-5 py-4 rounded-lg shadow-2xs transition-shadow cursor-pointer',
        selected
          ? 'border border-[#717680] shadow-[0px_0px_0px_3px_rgba(113,118,128,0.3)]'
          : 'border border-secondary hover:shadow-[0px_2px_8px_-2px_rgba(0,0,0,0.08)]',
      ].join(' ')}
    >
      <div className="flex flex-col gap-2 flex-1">
        <Badge
          variant="secondary"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          icon={badge.icon as any}
          label={badge.label}
          className="w-fit self-start"
        />
        <Typography variant="label-md" color="primary">
          <span className="line-clamp-2">{item.title}</span>
        </Typography>
        <Typography variant="body-sm" color="tertiary">
          <span className="line-clamp-3">{item.description}</span>
        </Typography>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <img src={item.agentAvatar} alt={item.agent} className="w-[22px] h-[22px] rounded-full shrink-0" />
        </div>
        <IconButton
          variant="ghost"
          size="sm"
          icon="dot-menu"
          aria-label="More options"
          onClick={e => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

interface LibraryRowProps {
  item: LibraryItem;
  selected?: boolean;
  onClick?: () => void;
}

const LibraryRow: React.FC<LibraryRowProps> = ({ item, selected, onClick }) => {
  const badge = getBadgeProps(item.type);
  return (
    <div
      onClick={onClick}
      className={[
        'bg-primary flex items-center gap-4 px-5 py-4 rounded-lg shadow-2xs transition-[background-color,box-shadow] cursor-pointer',
        selected
          ? 'border border-[#717680] shadow-[0px_0px_0px_3px_rgba(113,118,128,0.3)]'
          : 'border border-secondary hover:bg-hover',
      ].join(' ')}
    >
      <Badge
        variant="secondary"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        icon={badge.icon as any}
        label={badge.label}
        className="shrink-0 w-fit"
      />
      <div className="flex-1 min-w-0">
        <Typography variant="label-md" color="primary">
          <span className="truncate block">{item.title}</span>
        </Typography>
        <Typography variant="body-sm" color="tertiary">
          <span className="truncate block">{item.description}</span>
        </Typography>
      </div>
      <div className="flex items-center shrink-0">
        <img src={item.agentAvatar} alt={item.agent} className="w-[22px] h-[22px] rounded-full shrink-0" />
      </div>
      <IconButton
        variant="ghost"
        size="sm"
        icon="dot-menu"
        aria-label="More options"
        onClick={e => e.stopPropagation()}
      />
    </div>
  );
};

interface LibraryPageProps {
  onItemClick?: (item: AssetItem) => void;
  onItemClose?: () => void;
  /** Externally controlled selected item — clears selection when drawer closes */
  selectedItemId?: string | null;
}

const LibraryPage: React.FC<LibraryPageProps> = ({ onItemClick, onItemClose, selectedItemId }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = filterItems(ITEMS, activeTab);

  const handleItemClick = (item: LibraryItem) => {
    if (selectedItemId === item.id) {
      onItemClose?.();
      return;
    }
    onItemClick?.({ id: item.id, title: item.title, description: item.description, type: 'asset' });
  };

  return (
    <div className="bg-primary h-full overflow-auto px-16">
      <div className="w-full max-w-[1280px] mx-auto pt-16 pb-10 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Typography color="primary" component="h1" variant="heading-2xl">
              Library
            </Typography>
          </div>
        </div>

        {/* Tabs + SegmentedControl row */}
        <div className="flex items-center justify-between gap-4">
          <Tabs.Root
            tabs={TABS}
            selectedValue={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 min-w-0"
          >
            <></>
          </Tabs.Root>
          <SegmentedControl
            required
            value={viewMode}
            onValueChange={v => {
              if (v === 'grid' || v === 'list') setViewMode(v);
            }}
            options={[
              { value: 'grid', icon: 'layout-grid', label: '' },
              { value: 'list', icon: 'layout-third', label: '' },
            ]}
            className="shrink-0"
          />
        </div>

        {/* Content */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <Typography variant="body-md" color="tertiary">
              No items found.
            </Typography>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-4 gap-4">
            {filtered.map(item => (
              <LibraryCard
                key={item.id}
                item={item}
                selected={selectedItemId === item.id}
                onClick={() => handleItemClick(item)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map(item => (
              <LibraryRow
                key={item.id}
                item={item}
                selected={selectedItemId === item.id}
                onClick={() => handleItemClick(item)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
