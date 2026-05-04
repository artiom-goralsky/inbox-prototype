import React, { useState } from 'react';
import { ViewMode } from '../types';
import { Icon } from '@circleco/compass/components/Icon';
import { TextInput } from '@circleco/compass/components/TextInput';
import { IconButton } from '@circleco/compass/components/IconButton';
import AvatarDropdown from './AvatarDropdown';

interface NavbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleAIHelper: () => void;
  onToggleCopilot?: () => void;
  isCopilotOpen?: boolean;
  activeCommunity?: string;
  isSwitcherMode?: boolean;
  onBackToCommunity?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onToggleAIHelper,
  onToggleCopilot,
  isCopilotOpen = false,
  activeCommunity,
  isSwitcherMode = false,
  onBackToCommunity,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const communities = [
    {
      id: 'Community 2',
      name: 'Future Founders',
      logo: '/images/future-founders-logo.png',
    },
    { id: 'Community 3', name: 'Oprah Daily', logo: '/images/oprah-logo.png' },
    {
      id: 'clarity',
      name: 'Clarity Community',
      logo: '/images/clarity-logo-v2.png',
    },
    {
      id: 'framer',
      name: 'Framer Community',
      logo: '/images/framer-logo-v2.png',
    },
  ];
  const communityIdMap: { [key: string]: string } = {
    'future-founders': 'Community 2',
    oprah: 'Community 3',
    circle: 'Community 2',
    clarity: 'clarity',
    framer: 'framer',
  };
  const selectedId = communityIdMap[activeCommunity || ''] || 'Community 2';
  const selectedCommunityData = communities.find(c => c.id === selectedId);

  return (
    <nav
      className={[
        'bg-primary border-b border-secondary pr-[30px] h-16 relative',
        onBackToCommunity ? 'pl-[16px]' : 'pl-[30px]',
      ].join(' ')}
    >
      <div className="flex items-center justify-between h-full">
        {/* Left – isti kao Community, ali BEZ dropdowna (samo logo + naziv) */}
        {activeCommunity === 'oprah' && !isSwitcherMode ? (
          <div className="flex items-center gap-3">
            {onBackToCommunity ? (
              <IconButton
                type="button"
                variant="ghost"
                size="lg"
                icon="arrow-left"
                aria-label="Back to community"
                onClick={onBackToCommunity}
              />
            ) : null}
            <img
              src="/images/oprah-logo.png"
              alt="Oprah Logo"
              className="h-[34px] w-auto shrink-0 object-contain"
            />
          </div>
        ) : selectedCommunityData ? (
          <div className="flex items-center gap-3">
            {onBackToCommunity ? (
              <IconButton
                type="button"
                variant="ghost"
                size="lg"
                icon="arrow-left"
                aria-label="Back to community"
                onClick={onBackToCommunity}
              />
            ) : null}
            <img
              src={selectedCommunityData.logo}
              alt={selectedCommunityData.name}
              className="h-[34px] w-auto shrink-0 object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {onBackToCommunity ? (
              <IconButton
                type="button"
                variant="ghost"
                size="lg"
                icon="arrow-left"
                aria-label="Back to community"
                onClick={onBackToCommunity}
              />
            ) : null}
            <img
              src="/images/future-founders-logo.png"
              alt="Logo"
              className="h-[34px] w-auto shrink-0 object-contain"
            />
          </div>
        )}

        {/* Center – search bar */}
        <div className="flex items-center flex-1 justify-center max-w-xl mx-4">
          <div className="w-full max-w-[340px]">
            <TextInput
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              icon="magnifying-glass"
            />
          </div>
        </div>

        {/* Right – iste ikonice kao Community, OSIM search (bell, message, people-sparkle, bookmark, avatar, AI) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0">
            <IconButton
              variant="ghost"
              size="sm"
              icon="bell"
              aria-label="Notifications"
            />
            <IconButton
              variant="ghost"
              size="sm"
              icon="message"
              aria-label="Messages"
            />
            <IconButton
              variant="ghost"
              size="sm"
              icon="people-sparkle"
              aria-label="Members"
            />
            <IconButton
              variant="ghost"
              size="sm"
              icon="bookmark"
              aria-label="Saved"
            />
          </div>
          <AvatarDropdown />
          {onToggleCopilot && (
            <IconButton
              variant={isCopilotOpen ? 'outline' : 'ghost'}
              size="sm"
              icon="sparkle"
              aria-label="Toggle copilot"
              onClick={onToggleCopilot}
            />
          )}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-active rounded-lg"
            aria-label="Menu"
          >
            <Icon
              name="hamburger-menu"
              size="lg"
              color="secondary"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-primary">
          <div className="pt-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 px-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-disabled"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <TextInput
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-primary rounded-lg text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Mobile Menu Items */}
            <div className="flex flex-col space-y-2">
              <button className="flex items-center space-x-3 p-2 hover:bg-primary/10 rounded-lg transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <span>Inbox</span>
              </button>
              <button className="flex items-center space-x-3 p-2 hover:bg-primary/10 rounded-lg transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>Messages</span>
              </button>
              <button className="flex items-center space-x-3 p-2 hover:bg-primary/10 rounded-lg transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                <span>Favorites</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
