import React, { useState } from 'react';
import { Divider } from '@circleco/compass/components/Divider';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Tooltip } from '@circleco/compass/components/Tooltip';
import { MyCommunitiesModal } from './MyCommunitiesModal';
import type { FirstLevelNavItem } from '@/data/firstLevelNavigation';
import circleLogo from '../../circle-logo.svg';

interface FirstLevelNavigationProps {
  items: FirstLevelNavItem[];
  onItemClick: (itemId: string) => void;
  activeItem: string;
  community?: string;
  onReorderCommunities?: (reordered: FirstLevelNavItem[]) => void;
  onCopilotClick?: () => void;
}

const FirstLevelNavigation: React.FC<FirstLevelNavigationProps> = ({
  items,
  onItemClick,
  activeItem,
  community = 'circle',
  onReorderCommunities,
  onCopilotClick,
}) => {
  const [myCommunitiesModalOpen, setMyCommunitiesModalOpen] = useState(false);
  const handleItemClick = (itemId: string) => {
    if (itemId === 'copilot' && onCopilotClick) {
      onCopilotClick();
      return;
    }
    onItemClick(itemId);
  };

  // Community items: clarity, framer, more (by id)
  const communityItems = items.filter(item =>
    ['clarity', 'framer', 'more'].includes(item.id)
  );

  // Main nav items (exclude manage and community items)
  const topItems = items.filter(
    item =>
      item.id !== 'manage' && !['clarity', 'framer', 'more'].includes(item.id)
  );
  const settingsItem = items.find(item => item.id === 'manage');

  // Filter out community items when Oprah or Future Founders is active
  const getFilteredItems = () => {
    if (community === 'oprah' || community === 'future-founders') {
      return topItems.filter(
        item => !['clarity', 'framer', 'more'].includes(item.id)
      );
    }
    return topItems;
  };

  const filteredItems = getFilteredItems();

  // Helper function to get the icon for an item (with Oprah/Future Founders logo override)
  const getItemIcon = (item: (typeof items)[0], isActive: boolean) => {
    if (item.id === 'circle' && community === 'future-founders') {
      return (
        <img
          src="/images/future-founders-logo.png"
          alt="Future Founders Logo"
          className="w-[30px] h-[30px] rounded-lg"
        />
      );
    }
    if (item.id === 'circle' && community === 'oprah') {
      return (
        <img
          src="/images/oprah-logo.png"
          alt="Oprah Logo"
          className="w-[30px] h-[30px] rounded-lg"
        />
      );
    }
    if (item.id === 'circle') {
      return <img src={circleLogo} alt="Circle" className="w-[30px] h-[30px] rounded-md" />;
    }
    return isActive && item.activeIcon ? item.activeIcon : item.icon;
  };

  return (
    <div className="bg-secondary h-full flex flex-col items-center justify-between pt-4 pb-3 px-4">
      {/* Top Section - filtered items */}
      <div className="flex flex-col gap-[10px]">
        {/* Main nav items (circle, copilot, communities) */}
        {filteredItems.map((item, index) => (
          <React.Fragment key={item.id}>
            <div className={`relative ${index === 0 ? 'pb-[6px]' : ''}`}>
              {/* Undercut shadow effect for first icon - always visible */}
              {index === 0 && (
                <div className="absolute bg-disabled -bottom-[-4px] left-1/2 transform -translate-x-1/2 w-[32px] h-[32px] rounded-lg"></div>
              )}
              <Tooltip
                content={
                  item.id === 'circle' && community === 'oprah'
                    ? 'Oprah'
                    : item.id === 'circle' && community === 'future-founders'
                      ? 'Future Founders'
                      : item.title
                }
                side="right"
                sideOffset={8}
              >
                <button
                  onClick={() => handleItemClick(item.id)}
                  className={`w-[36px] h-[36px] rounded-lg flex items-center hover:bg-hover justify-center transition-[background-color,border-color,box-shadow] duration-200 relative z-10 ${
                    activeItem === item.id
                      ? index === 0
                        ? 'border border-transparent'
                        : 'border border-primary shadow-sm'
                      : ''
                  }`}
                  aria-label={item.title}
                >
                  <div className="transition-[background-color,border-color,box-shadow] duration-200">
                    {getItemIcon(item, activeItem === item.id)}
                  </div>
                </button>
              </Tooltip>
            </div>

            {/* Oprah-only SVG buttons (after notifications) */}
            {community === 'oprah' &&
              item.id === 'notifications' &&
              index === filteredItems.length - 1 && (
                <>
                  <Tooltip content="Oprah Feature 1" side="right" sideOffset={8}>
                    <button
                      className="w-[36px] h-[36px] rounded-lg flex items-center hover:bg-hover justify-center transition-[background-color,border-color,box-shadow] duration-200"
                      aria-label="Oprah Feature 1"
                    >
                      <div className="transition-[background-color,border-color,box-shadow] duration-200">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19.25 20.2515V3.75C19.25 3.19772 18.8023 2.75 18.25 2.75H5.75C5.19772 2.75 4.75 3.19771 4.75 3.75V20.2515C4.75 21.0522 5.64414 21.5281 6.30839 21.081L11.4416 17.6259C11.7792 17.3986 12.2208 17.3986 12.5584 17.6259L17.6916 21.081C18.3559 21.5282 19.25 21.0522 19.25 20.2515Z" stroke="#545861" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </button>
                  </Tooltip>
                  <Tooltip content="Oprah Feature 2" side="right" sideOffset={8}>
                    <button
                      className="w-[36px] h-[36px] rounded-lg flex items-center hover:bg-hover justify-center transition-[background-color,border-color,box-shadow] duration-200"
                      aria-label="Oprah Feature 2"
                    >
                      <div className="transition-[background-color,border-color,box-shadow] duration-200">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 7.75V11M12 11V14.25M12 11H8.75M12 11H15.25M9.29422 18.4836L11.3593 20.2147C11.7292 20.5248 12.2679 20.5263 12.6397 20.2183L14.738 18.4799C14.9173 18.3313 15.143 18.25 15.3759 18.25H19.25C19.8023 18.25 20.25 17.8023 20.25 17.25V4.75C20.25 4.19772 19.8023 3.75 19.25 3.75H4.75C4.19772 3.75 3.75 4.19771 3.75 4.75V17.25C3.75 17.8023 4.19772 18.25 4.75 18.25H8.65182C8.88675 18.25 9.11418 18.3327 9.29422 18.4836Z" stroke="#545861" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </button>
                  </Tooltip>
                </>
              )}
          </React.Fragment>
        ))}

        {/* Separator line before community items */}
        {communityItems.length > 0 &&
          community !== 'oprah' &&
          community !== 'future-founders' && (
            <div className="w-[24px] mx-auto my-2">
              <Divider
                orientation="horizontal"
                className="border-grey-200"
              />
            </div>
          )}

        {/* Community items (clarity, framer, more) - hidden when Oprah/Future Founders active */}
        {communityItems.length > 0 &&
          community !== 'oprah' &&
          community !== 'future-founders' &&
          communityItems.map(item => (
            <Tooltip
              key={item.id}
              content={item.title}
              side="right"
              sideOffset={8}
            >
              <button
                onClick={() => handleItemClick(item.id)}
                className={`w-[36px] h-[36px] rounded-lg flex items-center hover:bg-hover justify-center transition-[background-color,border-color,box-shadow] duration-200 ${
                  activeItem === item.id
                    ? 'border border-primary shadow-sm'
                    : ''
                }`}
                aria-label={item.title}
              >
                <div className="transition-[background-color,border-color,box-shadow] duration-200">
                  {getItemIcon(item, activeItem === item.id)}
                </div>
              </button>
            </Tooltip>
          ))}

        {/* Three dots - opens My communities modal */}
        {communityItems.length > 0 && onReorderCommunities && (
          <Tooltip content="My communities" side="right" sideOffset={8}>
            <button
              type="button"
              onClick={() => setMyCommunitiesModalOpen(true)}
              className="w-[36px] h-[36px] rounded-lg hover:bg-hover border border-transparent text-primary flex items-center justify-center"
              aria-label="My communities"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="3" cy="8" r="1.5" />
                <circle cx="8" cy="8" r="1.5" />
                <circle cx="13" cy="8" r="1.5" />
              </svg>
            </button>
          </Tooltip>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        {/* Settings */}
        {settingsItem && (
          <Tooltip content={settingsItem.title} side="right" sideOffset={8}>
            <button
              onClick={() => handleItemClick(settingsItem.id)}
              className={`w-[36px] h-[36px] rounded-lg flex items-center hover:bg-hover justify-center transition-[background-color,border-color,box-shadow] duration-200 ${
                activeItem === settingsItem.id
                  ? 'border border-primary shadow-sm'
                  : ''
              }`}
              aria-label={settingsItem.title}
            >
              <div className="transition-[background-color,border-color,box-shadow] duration-200">
                {activeItem === settingsItem.id && settingsItem.activeIcon
                  ? settingsItem.activeIcon
                  : settingsItem.icon}
              </div>
            </button>
          </Tooltip>
        )}
      </div>

      {/* My communities modal - reorder communities */}
      {onReorderCommunities && (
        <MyCommunitiesModal
          open={myCommunitiesModalOpen}
          onOpenChange={setMyCommunitiesModalOpen}
          communityItems={communityItems}
          onReorder={onReorderCommunities}
          getItemIcon={item => getItemIcon(item, false)}
        />
      )}
    </div>
  );
};

export default FirstLevelNavigation;
