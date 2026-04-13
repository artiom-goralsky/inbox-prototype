import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Tabs } from '@circleco/compass/components/Tabs';
import { Select } from '@circleco/compass/components/Select';

const BASE_TABS = [
  { value: 'dms',             label: 'My DMs' },
  { value: 'moderation',      label: 'Moderation' },
  { value: 'course-comments', label: 'Course comments' },
  { value: 'ai-inbox',        label: 'AI Inbox' },
];

const VIEWS_OPTIONS = [
  { label: 'Default', value: 'default' },
  { label: 'Compact', value: 'compact' },
];

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabCounts?: Partial<Record<string, number>>;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange, tabCounts = {} }) => {
  const tabs = BASE_TABS.map(t => ({
    ...t,
    ...(tabCounts[t.value] ? { badge: String(tabCounts[t.value]) } : {}),
  }));

  return (
    <div className="relative h-[60px] flex items-center px-6 border-b border-secondary shrink-0 bg-primary">
      {/* Left: title */}
      <Typography variant="heading-md" color="primary">Inbox</Typography>

      {/* Center: tabs (absolutely centered) */}
      <div className="absolute left-1/2 -translate-x-1/2 [&_button]:whitespace-nowrap">
        <Tabs.Root
          tabs={tabs}
          selectedValue={activeTab}
          onValueChange={onTabChange}
        />
      </div>

      {/* Right: views select */}
      <div className="ml-auto">
        <Select
          aria-label="Views"
          placeholder="Views"
          options={VIEWS_OPTIONS}
        />
      </div>
    </div>
  );
};

export default TabBar;
