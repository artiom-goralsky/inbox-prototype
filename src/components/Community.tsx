import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import Home from './Community/Home';
import Events from './Community/Events';
import Courses from './Community/Courses';
import Members from './Community/Members';
import Leaderboard from './Community/Leaderboard';
import LoadingSpinner from './LoadingSpinner';
import AIHelperChat from './AIHelperChat';
import AgentMessageBox from './shared/AgentMessageBox';
import { Icon } from '@circleco/compass/components/Icon';
import { Typography } from '@circleco/compass/components/Typography';
import { Button } from '@circleco/compass/components/Button';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Menu, type MenuOptions } from '@circleco/compass/components/Menu';
import AvatarDropdown from './AvatarDropdown';

/** Logo + ime firme za svaki community (Home header). Same logo in admin for mode consistency. */
const COMMUNITY_BRANDING: Record<string, { logo: string; name: string }> = {
  clarity: {
    logo: '/images/clarity-logo-v2.png',
    name: 'Clarity Community',
  },
  framer: {
    logo: '/images/framer-logo-v2.png',
    name: 'Framer Community',
  },
  more: {
    logo: '/images/circle-logo.png',
    name: 'Circle Community',
  },
};


interface CommunityProps {
  /** ID community-ja iz navigacije (clarity, framer, more) – za logo i ime u headeru */
  communityId?: string;
  communityType?: 'oprah' | 'clarity' | 'framer' | 'default';
  /** When set (admin inset no-dock mode), App handles dock hide, loading, and navigation. */
  onStartAdminTransition?: (path: string, fromSparkle?: boolean) => void;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

const Community: React.FC<CommunityProps> = ({
  communityId,
  communityType = 'default',
  onStartAdminTransition,
  colors = {
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#F59E0B',
    background: '#F9FAFB',
    text: '#111827',
  },
}) => {
  const navigate = useNavigate();

  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'home' | 'events' | 'courses' | 'members' | 'leaderboard'
  >('home');
  const [isLoading, setIsLoading] = useState(false);
  const [isAIHelperOpen, setIsAIHelperOpen] = useState(false);
  const [isCopilotPanelOpen] = useState(false);
  const [isLeavingToAdmin, setIsLeavingToAdmin] = useState(false);
  const [isCommunityContentExiting, setIsCommunityContentExiting] =
    useState(false);
  const transitionTimeoutsRef = useRef<number[]>([]);

  const clearTransitionTimeouts = (): void => {
    transitionTimeoutsRef.current.forEach(id => window.clearTimeout(id));
    transitionTimeoutsRef.current = [];
  };

  const startAdminNavigation = useCallback(
    (path: string, fromSparkle = false): void => {
      if (isLeavingToAdmin) return;
      if (onStartAdminTransition) {
        onStartAdminTransition(path, fromSparkle);
        return;
      }
      setIsLeavingToAdmin(true);
      setIsCommunityContentExiting(true);
      transitionTimeoutsRef.current.push(
        window.setTimeout(() => {
          navigate(path);
        }, 200)
      );
    },
    [isLeavingToAdmin, navigate, onStartAdminTransition]
  );

  const aiMenuOptions: MenuOptions = useMemo(
    () => [
      { label: 'New chat', icon: 'circle-plus', onClick: () => startAdminNavigation('/manage/dashboard') },
      { label: 'Inbox', icon: 'inbox-empty', onClick: () => startAdminNavigation('/manage/ai-inbox') },
      { label: 'Skills', icon: 'sparkle-box', onClick: () => startAdminNavigation('/manage/agents-page') },
      { label: 'Projects', icon: 'folder', onClick: () => startAdminNavigation('/manage/projects') },
      { label: 'Library', icon: 'layers', onClick: () => startAdminNavigation('/manage/library') },
    ],
    [startAdminNavigation]
  );

  const handleAiMenuOpenChange = useCallback((nextOpen: boolean): void => {
    if (nextOpen) {
      setAdminMenuOpen(true);
      setTimeout(() => {
        const menus = document.querySelectorAll('[role="menu"]');
        const menu = menus.length ? menus[menus.length - 1] : null;
        if (menu instanceof HTMLElement) {
          menu.style.width = '132px';
          menu.style.minWidth = '132px';
          menu.style.borderRadius = '12px';
          menu.style.border = '1px solid var(--color-border-primary)';
          menu.style.background = 'var(--color-background-primary)';
          menu.style.boxShadow = '0 4px 20px 0 rgba(0, 0, 0, 0.06), 0 1px 4px 0 rgba(0, 0, 0, 0.03), 0 1px 4px 0 rgba(0, 0, 0, 0.03)';
        }
      }, 0);
    } else {
      setAdminMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTransitionTimeouts();
    };
  }, []);

  // Handle tab change with loading state
  const handleTabChange = (tab: typeof activeTab) => {
    if (tab !== activeTab) {
      setIsLoading(true);
      setActiveTab(tab);
    }
  };

  // Hide loader after content loads
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300); // Short delay to show loader
      return () => clearTimeout(timer);
    }
  }, [isLoading, activeTab]);
  // Get community-specific styling
  const getCommunityStyling = () => {
    switch (communityType) {
      case 'oprah':
        return {
          bgColor: 'bg-pink-50',
          headerBg: 'bg-primary',
          logoBg: 'bg-red-500',
          logoText: 'text-white',
          brandText: 'text-primary',
          primaryButton: 'bg-inverse text-white',
          accentColor: 'bg-pink-500',
          welcomeBg: 'bg-gradient-to-r from-pink-400 to-orange-400',
          welcomeText: 'text-white',
          welcomeButton: 'bg-gray-800 text-white',
        };
      case 'clarity':
        return {
          bgColor: 'bg-blue-50',
          headerBg: 'bg-primary',
          logoBg: 'bg-blue-500',
          logoText: 'text-white',
          brandText: 'text-primary',
          primaryButton: 'bg-blue-600 text-white',
          accentColor: 'bg-blue-500',
          welcomeBg: 'bg-gradient-to-r from-blue-400 to-purple-400',
          welcomeText: 'text-white',
          welcomeButton: 'bg-primary text-link',
        };
      default:
        return {
          bgColor: 'bg-secondary',
          headerBg: 'bg-primary',
          logoBg: 'bg-blue-500',
          logoText: 'text-white',
          brandText: 'text-primary',
          primaryButton: 'bg-blue-600 text-white',
          accentColor: 'bg-blue-500',
          welcomeBg: 'bg-gradient-to-r from-green-400 to-blue-400',
          welcomeText: 'text-white',
          welcomeButton: 'bg-primary text-green-600',
        };
    }
  };

  const styling = getCommunityStyling();

  return (
    <div className={`h-full ${styling.bgColor} flex flex-col`}>
      {/* Header */}
      <div
        className={[
          `${styling.headerBg} border-b border-primary px-[30px] h-16`,
          'transition-[transform,opacity] duration-300',
          isLeavingToAdmin
            ? '-translate-y-4 opacity-0'
            : 'translate-y-0 opacity-100',
        ].join(' ')}
      >
        <div className="flex items-center justify-between h-full">
          {/* Left - Brand: logo + AI menu trigger (12px gap) */}
          <div className="flex items-center gap-3">
            {communityId && COMMUNITY_BRANDING[communityId] ? (
              <img
                src={COMMUNITY_BRANDING[communityId].logo}
                alt=""
                className="h-[34px] w-auto shrink-0 object-contain"
              />
            ) : communityType === 'oprah' ? (
              <img
                src="/images/oprah-daily.png"
                alt="Oprah"
                className="h-[34px] w-auto shrink-0 object-contain"
              />
            ) : communityType === 'clarity' ? (
              <img
                src="/images/clarity-logo-v2.png"
                alt="Clarity"
                className="h-[34px] w-auto shrink-0 object-contain"
              />
            ) : (
              <img
                src="/images/circle-logo.png"
                alt="Circle"
                className="h-[34px] w-auto shrink-0 object-contain"
              />
            )}
            <Menu
              options={aiMenuOptions}
              trigger={
                <IconButton
                  icon="chevron-down"
                  variant={adminMenuOpen ? 'secondary' : 'ghost'}
                  size="sm"
                  aria-label="Open AI menu"
                />
              }
              open={adminMenuOpen}
              onOpenChange={handleAiMenuOpenChange}
              align="start"
              side="bottom"
              sideOffset={8}
            />
          </div>

          {/* Center - Navigation */}
          <div className="flex items-center space-x-[6px]">
            <Button
              type="button"
              onClick={() => handleTabChange('home')}
              variant={activeTab === 'home' ? 'secondary' : 'ghost'}
              size="sm"
            >
              Home
            </Button>
            <Button
              type="button"
              onClick={() => handleTabChange('courses')}
              variant={activeTab === 'courses' ? 'secondary' : 'ghost'}
              size="sm"
            >
              Courses
            </Button>
            <Button
              type="button"
              onClick={() => handleTabChange('events')}
              variant={activeTab === 'events' ? 'secondary' : 'ghost'}
              size="sm"
            >
              Events
            </Button>
            <Button
              type="button"
              onClick={() => handleTabChange('members')}
              variant={activeTab === 'members' ? 'secondary' : 'ghost'}
              size="sm"
            >
              Members
            </Button>
            <Button
              type="button"
              onClick={() => handleTabChange('leaderboard')}
              variant={activeTab === 'leaderboard' ? 'secondary' : 'ghost'}
              size="sm"
            >
              Leaderboard
            </Button>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0">
              <IconButton
                variant="ghost"
                size="sm"
                icon="magnifying-glass"
                aria-label="Search"
              />
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-1 overflow-hidden relative ${
          isAIHelperOpen ? '' : 'pr-0'
        }`}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-primary z-50 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {/* Copilot Conversation Panel */}
        <div
          className={`copilot-panel ${isCopilotPanelOpen ? 'border-r' : ''} border-primary bg-primary`}
          style={{ flex: isCopilotPanelOpen ? '0 0 380px' : '0 0 0px' }}
        >
          <div className="h-full flex flex-col w-[380px]">
            {/* Scrollable conversation */}
            <div className="flex-1 overflow-y-auto px-5 pt-6 pb-4">
              <div className="flex flex-col gap-5">
                {/* Clara message 1 */}
                <div className="flex gap-3">
                  <img
                    src="/ai-avatar.png"
                    alt="Clara"
                    className="w-[22px] h-[22px] rounded-full object-cover shrink-0"
                  />
                  <div className="flex flex-col gap-2">
                    <Typography variant="body-sm" color="secondary">
                      Hey! I&apos;m Clara, your Community CSM. I handle member
                      health, onboarding flows, and retention strategy. What
                      would you like to work on?
                    </Typography>
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-6 text-tertiary"><IconButton variant="ghost" size="sm" icon="thumbup" aria-label="Like" /></div>
                      <div className="w-6 h-6 text-tertiary"><IconButton variant="ghost" size="sm" icon="cross" aria-label="Dislike" /></div>
                      <div className="w-6 h-6 text-tertiary"><IconButton variant="ghost" size="sm" icon="copy" aria-label="Copy" /></div>
                    </div>
                  </div>
                </div>

                {/* User message */}
                <div className="flex justify-end">
                  <div className="bg-secondary rounded-xl px-4 py-2.5 max-w-[85%]">
                    <Typography variant="body-sm" color="primary">
                      How are this week&apos;s new members doing?
                    </Typography>
                  </div>
                </div>

                {/* Clara response */}
                <div className="flex gap-3">
                  <img
                    src="/ai-avatar.png"
                    alt="Clara"
                    className="w-[22px] h-[22px] rounded-full object-cover shrink-0"
                  />
                  <div className="flex flex-col gap-3">
                    <Typography variant="body-sm" color="secondary">
                      This week we had{' '}
                      <strong className="text-primary">
                        12 new signups. 8 have completed onboarding
                      </strong>{' '}
                      (67% completion rate), and 3 have already posted
                      introductions. The biggest drop-off is still at the goals
                      survey step — I&apos;ve been testing a shorter version that&apos;s
                      showing 15% better completion in the last batch.
                    </Typography>
                    {/* Chart card */}
                    <div className="border border-secondary rounded-lg px-4 py-3 flex flex-col gap-1 cursor-pointer hover:bg-hover transition-colors shadow-2xs">
                      <div className="text-secondary"><Icon name="chart-square" size="md" /></div>
                      <Typography variant="label-sm" color="primary">
                        Onboarding breakdown
                      </Typography>
                      <Typography variant="caption" color="tertiary">
                        This week
                      </Typography>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-6 text-tertiary"><IconButton variant="ghost" size="sm" icon="thumbup" aria-label="Like" /></div>
                      <div className="w-6 h-6 text-tertiary"><IconButton variant="ghost" size="sm" icon="cross" aria-label="Dislike" /></div>
                      <div className="w-6 h-6 text-tertiary"><IconButton variant="ghost" size="sm" icon="copy" aria-label="Copy" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reply input */}
            <div className="shrink-0 px-4 pb-4">
              <AgentMessageBox placeholder="Reply to Clara..." />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div
          className={[
            'flex-1 flex overflow-hidden relative transition-[transform,opacity] duration-200',
            isCommunityContentExiting
              ? 'opacity-0 translate-y-2'
              : 'opacity-100 translate-y-0',
          ].join(' ')}
        >
          {/* Left Sidebar - Only for Home (Figma dizajn, Compass ikone) */}
          {activeTab === 'home' && (
            <aside className="w-[233px] shrink-0 border-r border-primary bg-primary h-full overflow-y-auto flex flex-col">
              <div className="p-5 flex flex-col gap-5">
                {/* Feed */}
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    className="flex items-center justify-start gap-2 px-2.5 py-0 rounded-md min-h-[28px] text-left w-full hover:bg-hover transition-colors"
                  >
                    <Icon name="bullet-list" size="sm" />
                    <Typography variant="body-sm" color="secondary">
                      Feed
                    </Typography>
                  </button>
                </div>

                {/* Welcome */}
                <div className="flex flex-col gap-2">
                  <div className="px-2.5 py-0.5">
                    <Typography
                      variant="body-sm"
                      color="primary"
                    >
                      <span className="font-semibold">Welcome</span>
                    </Typography>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      className="flex items-center justify-start gap-2 px-2.5 py-0 rounded-md min-h-[28px] text-left w-full bg-secondary hover:bg-hover transition-colors"
                    >
                      <Icon name="pin-location" size="sm" />
                      <Typography variant="body-sm" color="secondary">
                        Start Here
                      </Typography>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-start gap-2 px-2.5 py-0 rounded-md min-h-[28px] text-left w-full hover:bg-hover transition-colors"
                    >
                      <Icon name="message" size="sm" />
                      <Typography variant="body-sm" color="secondary">
                        Say Hello
                      </Typography>
                    </button>
                  </div>
                </div>

                {/* Community */}
                <div className="flex flex-col gap-2">
                  <div className="px-2.5 py-0.5">
                    <Typography
                      variant="body-sm"
                      color="primary"
                    >
                      <span className="font-semibold">Community</span>
                    </Typography>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      className="flex items-center justify-start gap-2 px-2.5 py-0 rounded-md min-h-[28px] text-left w-full hover:bg-hover transition-colors"
                    >
                      <Icon name="bell" size="sm" />
                      <Typography variant="body-sm" color="secondary">
                        Announcements
                      </Typography>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-start gap-2 px-2.5 py-0 rounded-md min-h-[28px] text-left w-full hover:bg-hover transition-colors"
                    >
                      <Icon name="growth" size="sm" />
                      <Typography variant="body-sm" color="secondary">
                        Resources
                      </Typography>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-start gap-2 px-2.5 py-0 rounded-md min-h-[28px] text-left w-full hover:bg-hover transition-colors"
                    >
                      <Icon name="target" size="sm" />
                      <Typography variant="body-sm" color="secondary">
                        Discussions
                      </Typography>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-start gap-2 px-2.5 py-0 rounded-md min-h-[28px] text-left w-full hover:bg-hover transition-colors"
                    >
                      <Icon name="trophy" size="sm" />
                      <Typography variant="body-sm" color="secondary">
                        Wins
                      </Typography>
                    </button>
                  </div>
                </div>

                {/* Events */}
                <div className="flex flex-col gap-2">
                  <div className="px-2.5 py-0.5">
                    <Typography
                      variant="body-sm"
                      color="primary"
                    >
                      <span className="font-semibold">Events</span>
                    </Typography>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      className="flex items-center justify-start gap-2 px-2.5 py-0 rounded-md min-h-[28px] text-left w-full hover:bg-hover transition-colors"
                    >
                      <Icon name="calendar" size="sm" />
                      <Typography variant="body-sm" color="secondary">
                        Recordings
                      </Typography>
                    </button>
                  </div>
                </div>
              </div>

              {/* Go live */}
              <div className="mt-auto border-t border-primary p-5">
                <button
                  type="button"
                  className="flex items-center justify-center w-full rounded-full h-8 gap-2 bg-secondary hover:bg-hover transition-colors text-sm font-medium"
                >
                  <Icon name="video" size="sm" />
                  Go live
                </button>
              </div>
            </aside>
          )}
          {/* Main Content - Conditional Rendering */}
          {activeTab === 'home' && (
            <Home communityType={communityType} colors={colors} />
          )}
          {activeTab === 'events' && <Events />}
          {activeTab === 'courses' && (
            <div className="flex-1 flex-col overflow-hidden">
              <Courses />
            </div>
          )}
          {activeTab === 'members' && (
            <div className="flex-1 flex-col overflow-hidden">
              <Members />
            </div>
          )}
          {activeTab === 'leaderboard' && (
            <div className="flex-1 flex-col overflow-hidden">
              <Leaderboard />
            </div>
          )}
        </div>
        {/* AI Helper Sidebar */}
        <div
          className={`transition-[width,opacity,transform] duration-300 ${
            isAIHelperOpen
              ? 'w-[326px] opacity-100 transform translate-x-0'
              : 'w-0 opacity-0 transform translate-x-full ml-0 overflow-hidden'
          }`}
        >
          <AIHelperChat onClose={() => setIsAIHelperOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default Community;
