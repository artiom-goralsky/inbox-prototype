import React, { useState } from 'react';
import { Tooltip } from '@circleco/compass/components/Tooltip';

interface Community {
  id: string;
  name: string;
  logo: string;
}

interface CommunitySwitcherProps {
  communities: Community[];
  activeCommunity: string;
  onCommunityChange: (communityId: string) => void;
  adminInsetNoDockEnabled: boolean;
  onAdminInsetNoDockChange: (enabled: boolean) => void;
}

const CommunitySwitcher: React.FC<CommunitySwitcherProps> = ({
  communities,
  activeCommunity,
  onCommunityChange,
  adminInsetNoDockEnabled,
  onAdminInsetNoDockChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCommunityClick = (communityId: string) => {
    onCommunityChange(communityId);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Hover trigger area */}
      <div
        className="absolute bottom-0 right-0 w-24 h-24"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      />

      {/* Community switcher panel */}
      <div
        className={`bg-primary border border-primary rounded-2xl shadow-lg transition-[transform,opacity] duration-300 ${
          isOpen
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-8 pointer-events-none'
        }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="flex flex-col gap-2 p-3">
          {communities.slice(0, 2).map((community, index) => {
            const tooltipTexts = [
              'Regular community',
              'White-label community enterprise customer',
            ];

            return (
              <Tooltip
                key={community.id}
                content={tooltipTexts[index]}
                side="left"
                sideOffset={8}
              >
                <button
                  onClick={() => handleCommunityClick(community.id)}
                  type="button"
                  className={`w-9 h-9 rounded-lg min-h-0 px-0 flex items-center justify-center text-sm font-medium transition-colors ${
                    activeCommunity === community.id
                      ? 'bg-secondary border border-primary text-primary'
                      : 'bg-transparent border border-transparent text-secondary hover:bg-secondary'
                  }`}
                >
                  {index + 1}
                </button>
              </Tooltip>
            );
          })}

          <Tooltip
            content="Admin inset (no left dock)"
            side="left"
            sideOffset={8}
          >
            <button
              type="button"
              onClick={() => onAdminInsetNoDockChange(!adminInsetNoDockEnabled)}
              className={`w-9 h-9 rounded-lg min-h-0 px-0 flex items-center justify-center text-sm font-medium transition-colors ${
                adminInsetNoDockEnabled
                  ? 'bg-secondary border border-primary text-primary'
                  : 'bg-transparent border border-transparent text-secondary hover:bg-secondary'
              }`}
            >
              3
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default CommunitySwitcher;
