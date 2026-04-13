import React from 'react';

interface TabType {
  id: string;
  label: string;
  count: number;
}

interface TabsProps {
  tabs: TabType[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-primary mb-6 overflow-x-auto">
      <div className="flex min-w-max">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-3 px-4 font-medium border border-secondary text-sm transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border border-hover border-b-0 rounded-t-lg text-primary bg-primary'
                : 'border-transparent text-tertiary hover:text-gray-700'
            }`}
          >
            {tab.label} {tab.count.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
