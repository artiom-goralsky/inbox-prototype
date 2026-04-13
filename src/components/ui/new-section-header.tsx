import React from 'react';
import { Tabs } from '@circleco/compass/components/Tabs';
import { Button } from '@circleco/compass/components/Button';
import { Typography } from '@circleco/compass/components/Typography';
import { useScrollHideTabs } from '../../hooks/useScrollHideTabs';
import { Divider } from '@circleco/compass/components/Divider';

interface NewSectionHeaderProps {
  title: string;
  onBack: () => void;
  breadcrumb?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    icon: string;
    onClick: () => void;
    ariaLabel: string;
  };
  tabs?: {
    id: string;
    label: string;
  }[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

const NewSectionHeader: React.FC<NewSectionHeaderProps> = ({
  title,
  onBack,
  breadcrumb,
  primaryAction,
  secondaryAction,
  tabs,
  activeTab,
  onTabChange,
  scrollContainerRef,
}) => {
  const isTabsVisible = useScrollHideTabs({
    scrollContainerRef,
    enabled: tabs && tabs.length > 0,
  });

  if (!title) {
    return null;
  }

  return (
    <div className="bg-primary w-full overflow-visible px-16">
      <div className="max-w-[1280px] mx-auto">
        {/* Breadcrumb row */}
        {breadcrumb && (
          <div className="pt-10 pb-1">
            <button
              onClick={onBack}
              className="text-sm text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              {breadcrumb}
            </button>
          </div>
        )}

        {/* Title + Actions row */}
        <div
          className={`flex flex-row justify-between items-center pb-5 ${breadcrumb ? 'pt-2' : 'pt-16'}`}
        >
          <Typography color="primary" component="h1" variant="heading-2xl">
            {title}
          </Typography>

          <div className="flex gap-2 items-center">
            {primaryAction && (
              <Button variant="primary" size="sm" onClick={primaryAction.onClick}>
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant="secondary"
                size="sm"
                onClick={secondaryAction.onClick}
                aria-label={secondaryAction.ariaLabel}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.99989 2.7334C10.6069 2.73338 13.1461 4.23222 14.8471 7.08956C15.1809 7.65037 15.1809 8.34968 14.8471 8.91049L14.8471 8.91051C13.1461 11.7679 10.6069 13.2667 7.9999 13.2667C5.39292 13.2668 2.85365 11.7679 1.15272 8.91059L1.66828 8.60367L1.15272 8.91059C0.818874 8.34978 0.818902 7.65048 1.1527 7.08967L1.15272 7.08963C2.85365 4.23229 5.39291 2.73342 7.99989 2.7334ZM2.18385 7.70345C2.07516 7.88609 2.07519 8.11424 2.18385 8.29676L2.18385 8.29676C3.70786 10.8569 5.88773 12.0668 7.99989 12.0667C10.1121 12.0667 12.2919 10.8568 13.8159 8.2967C13.9246 8.11406 13.9246 7.88591 13.816 7.7034L13.8159 7.70338C12.2919 5.14325 10.1121 3.93338 7.9999 3.9334C5.88775 3.93341 3.70788 5.1433 2.18387 7.70341M7.9999 6.60007C7.22667 6.60007 6.5999 7.22684 6.5999 8.00007C6.5999 8.7733 7.22667 9.40007 7.9999 9.40007C8.77313 9.40007 9.3999 8.7733 9.3999 8.00007C9.3999 7.22684 8.77313 6.60007 7.9999 6.60007ZM5.3999 8.00007C5.3999 6.5641 6.56393 5.40007 7.9999 5.40007C9.43587 5.40007 10.5999 6.5641 10.5999 8.00007C10.5999 9.43604 9.43587 10.6001 7.9999 10.6001C6.56393 10.6001 5.3999 9.43604 5.3999 8.00007Z"
                    fill="currentColor"
                  />
                </svg>
              </Button>
            )}
          </div>
        </div>

        {/* Tabs row */}
        {tabs && tabs.length > 0 && (
          <div
            className={`flex flex-col items-start w-full transition-[max-height,opacity,padding] duration-200 overflow-hidden ${
              isTabsVisible
                ? 'max-h-20 opacity-100 pb-4'
                : 'max-h-0 opacity-0 pb-0'
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <Tabs.Root
              tabs={tabs.map(tab => ({
                label: tab.label,
                value: tab.id,
              }))}
              selectedValue={activeTab}
              onValueChange={onTabChange}
            >
              <></>
            </Tabs.Root>
          </div>
        )}

        <Divider orientation="horizontal" />
      </div>
    </div>
  );
};

export default NewSectionHeader;
