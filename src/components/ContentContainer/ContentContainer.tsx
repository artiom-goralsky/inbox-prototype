import React, { useRef } from 'react';
import { Tabs } from '@circleco/compass/components/Tabs';
import EnhancedFilters from '../ui/enhanced-filters';
import { FilterOption, FilterCondition } from '../ui/filter-modal';
import { Divider } from '@circleco/compass/components/Divider';
import { useScrollHideTabs } from '../../hooks/useScrollHideTabs';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Typography } from '@circleco/compass/components/Typography';

interface Tab {
  label: string;
  value: string;
  badge?: string | number;
}

interface ContentContainerProps {
  children: React.ReactNode;
  onToggleSidebar: () => void;
  title: string;
  actions?: React.ReactNode;
  className?: string;
  // Breadcrumb props
  breadcrumb?: string;
  onBreadcrumbClick?: () => void;
  // Tabs props
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  // Filters props
  filters?: FilterOption[];
  activeFilters?: FilterCondition[];
  onFilterChange?: (filters: FilterCondition[]) => void;
  showAllFilters?: boolean;
  onShowAllFiltersChange?: (show: boolean) => void;
}

const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  onToggleSidebar,
  title,
  actions,
  className = '',
  breadcrumb,
  onBreadcrumbClick,
  tabs,
  activeTab,
  onTabChange,
  filters,
  activeFilters = [],
  onFilterChange,
  showAllFilters,
  onShowAllFiltersChange,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasTabs = tabs && tabs.length > 0;
  const hasFilters = Boolean(filters && filters.length > 0 && onFilterChange);
  const shouldEnableScrollHide = hasTabs || hasFilters;

  const isTabsAndFiltersVisible = useScrollHideTabs({
    scrollContainerRef,
    enabled: shouldEnableScrollHide,
  });

  return (
    <div
      className={`bg-primary h-full flex flex-col overflow-hidden ${className}`}
    >
      <div className="shrink-0 px-16">
        <div className="max-w-[1280px] mx-auto">
          {/* Breadcrumb */}
          {breadcrumb && (
            <div className="pt-10 pb-1">
              <button
                onClick={onBreadcrumbClick}
                className="text-sm text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                {breadcrumb}
              </button>
            </div>
          )}

          {/* Header */}
          <div className={`${breadcrumb ? 'pt-2' : 'pt-16'} pb-5 flex flex-col sm:flex-row sm:justify-between sm:items-center`}>
            <div className="flex items-center space-x-4">
              <Typography color="primary" component="h1" variant="heading-2xl">
                {title}
              </Typography>
            </div>
            {actions && (
              <div className="flex items-center space-x-3">{actions}</div>
            )}
          </div>

          {/* Tabs */}
          {hasTabs && (
            <div
              className={`transition-[max-height,opacity,padding] duration-200 overflow-hidden ${
                isTabsAndFiltersVisible
                  ? 'max-h-20 opacity-100 pb-4'
                  : 'max-h-0 opacity-0 pb-0'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              <Tabs.Root
                tabs={tabs.map(tab => ({
                  label: tab.label,
                  value: tab.value,
                  badge: tab.badge ? String(tab.badge) : undefined,
                }))}
                selectedValue={activeTab}
                onValueChange={onTabChange}
              >
                <></>
              </Tabs.Root>
            </div>
          )}

          {/* Filters */}
          {hasFilters && filters && onFilterChange && (
            <div
              className={`transition-[max-height,opacity] duration-200 overflow-hidden ${
                isTabsAndFiltersVisible
                  ? 'max-h-[600px] opacity-100'
                  : 'max-h-0 opacity-0'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              <EnhancedFilters
                filters={filters}
                activeFilters={activeFilters}
                onFilterChange={onFilterChange}
                showAllFilters={showAllFilters}
                onShowAllFiltersChange={onShowAllFiltersChange}
              />
            </div>
          )}
          <Divider orientation="horizontal" />
        </div>
      </div>

      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="flex-1 min-h-0 flex flex-col overflow-auto px-16"
        >
          <div className="max-w-[1280px] mx-auto w-full flex-1 min-h-0 flex flex-col">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentContainer;
