import React, { useState, useEffect } from 'react';
import { SidebarItem } from '../types';
import { Tooltip } from '@circleco/compass/components/Tooltip';

interface SidebarProps {
  items: SidebarItem[];
  onItemClick: (itemId: string, subItemId?: string) => void;
  isCollapsed?: boolean;
  currentSection?: string;
  activeSubItem?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  items,
  onItemClick,
  isCollapsed = false,
  currentSection,
  activeSubItem: propActiveSubItem,
}) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(
    currentSection || 'audience'
  );
  const [activeSubItem, setActiveSubItem] = useState<string>(
    propActiveSubItem || 'manage-audience'
  );
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(true);

  // Update activeSubItem when prop changes
  useEffect(() => {
    if (propActiveSubItem) {
      setActiveSubItem(propActiveSubItem);
    }
  }, [propActiveSubItem]);

  // Update expandedItem when currentSection changes
  useEffect(() => {
    if (currentSection) {
      setExpandedItem(currentSection);
    }
  }, [currentSection]);

  // Track collapse state changes
  useEffect(() => {
    if (isCollapsed) {
      // Hide content after width animation starts (for smooth closing transition)
      setTimeout(() => {
        setIsContentVisible(false);
      }, 50);
    } else {
      // Show content after width animation completes (for smooth opening transition)
      setTimeout(() => {
        setIsContentVisible(true);
      }, 300);
    }
  }, [isCollapsed]);

  const handleItemClick = (itemId: string) => {
    // Only change the active item, don't toggle sidebar expansion
    setExpandedItem(itemId);

    // Find the item to get its first sub-item
    const item = items.find(i => i.id === itemId);

    // If item has sub-items, navigate to the first one
    if (item && item.subItems && item.subItems.length > 0) {
      const firstSubItem = item.subItems[0];
      setActiveSubItem(firstSubItem.id);
      // Navigate to the first sub-item instead of just the main item
      onItemClick(itemId, firstSubItem.id);
    } else {
      // If no sub-items, navigate to the main item
      onItemClick(itemId);
    }
  };

  const handleSubItemClick = (itemId: string, subItemId: string) => {
    setActiveSubItem(subItemId);
    onItemClick(itemId, subItemId);
    // Close mobile menu on item click
    setIsMobileOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent, itemId: string) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleItemClick(itemId);
        break;
      case 'Escape':
        setIsMobileOpen(false);
        break;
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-primary h-full flex fixed lg:relative z-2 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform duration-300`}
      >
        {/* Icon Column */}
        <div
          className={`bg-primary flex flex-col gap-4 flex flex-col items-center py-4 px-2 ${
            isCollapsed ? 'rounded-lg' : 'border-r border-secondary'
          }`}
        >
          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-1 hover:bg-active rounded"
          >
            <svg
              className="w-6 h-6 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* All items including settings */}
          <div className="flex flex-col gap-4">
            {items.map(item => (
              <Tooltip
                key={item.id}
                content={item.title}
                side="right"
                sideOffset={8}
              >
                <button
                  onClick={() => handleItemClick(item.id)}
                  onKeyDown={e => handleKeyDown(e, item.id)}
                  className={`p-1 w-[36px] h-[36px] rounded-lg flex items-center justify-center text-lg transition-[background-color,border-color,box-shadow] duration-200 border ${
                    expandedItem === item.id
                      ? 'border-primary bg-secondary shadow-xs'
                      : 'border-transparent hover:bg-active'
                  }`}
                  aria-label={item.title}
                  aria-expanded={expandedItem === item.id}
                  aria-haspopup="true"
                >
                  <div
                    className={`transition-colors duration-200 ${
                      expandedItem === item.id
                        ? 'text-primary'
                        : 'text-tertiary'
                    }`}
                  >
                    {expandedItem === item.id && item.activeIcon
                      ? item.activeIcon
                      : item.icon}
                  </div>
                </button>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Expanded Menu */}
        <div
          className={`flex flex-col gap-4 bg-primary py-4 px-2 rounded-r-2xl overflow-hidden ${
            expandedItem && !isCollapsed ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            width: expandedItem && !isCollapsed ? '216px' : '0px',
            maxWidth: expandedItem && !isCollapsed ? '216px' : '0px',
            minWidth: expandedItem && !isCollapsed ? '216px' : '0px',
            transition:
              'width 300ms cubic-bezier(0.4, 0, 0.2, 1), max-width 300ms cubic-bezier(0.4, 0, 0.2, 1), min-width 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'width, max-width, min-width, opacity',
          }}
        >
          {/* Dynamic Title */}
          <div
            className={`px-4 py-1 transition-opacity duration-200 ease-out ${
              isContentVisible ? 'block' : 'hidden'
            }`}
          >
            <h2 className="text-md font-bold text-primary py-[2px]">
              {items.find(item => item.id === expandedItem)?.title || 'Menu'}
            </h2>
          </div>

          <div
            className={`transition-opacity duration-200 ease-out ${
              isContentVisible ? 'block' : 'hidden'
            }`}
          >
            {items
              .filter(item => item.id === expandedItem)
              .map(item => (
                <div key={item.id}>
                  {item.subItems &&
                    currentSection !== 'branded-app' &&
                    currentSection !== 'ai-inbox' && (
                      <ul role="menu">
                        {item.subItems.map(subItem => (
                          <li key={subItem.id} role="none">
                            <button
                              onClick={() =>
                                handleSubItemClick(item.id, subItem.id)
                              }
                              className={`w-full text-left px-3 py-[7px] rounded-lg text-sm transition-colors duration-150 ${
                                activeSubItem === subItem.id
                                  ? ' text-primary font-semibold bg-secondary border border-primary shadow-xs'
                                  : ' text-tertiary font-medium hover:bg-active border border-transparent hover:text-primary'
                              }`}
                              role="menuitem"
                              aria-current={subItem.active ? 'page' : undefined}
                            >
                              {subItem.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-4 left-4 z-30 bg-blue-600 text-white p-3 rounded-full  hover:bg-blue-700 transition-colors"
        aria-label="Open sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </>
  );
};

export default Sidebar;
