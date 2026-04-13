import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  BrowserRouter as Router,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { CompassProvider } from '@circleco/compass/context/CompassProvider';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import FirstLevelNavigation from './components/FirstLevelNavigation';
import AdminSection from './components/AdminSection';
import Feed from './components/Feed';
import Discovery from './components/Discovery';
import Community from './components/Community';
import NotificationsPage from './components/NotificationsPage/NotificationsPage';
import InboxPage from './components/InboxPage/InboxPage';
import PostDetail from './components/PostDetail';
import UserProfilePage from './components/UserProfilePage';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import CommunitySwitcher from './components/CommunitySwitcher';
import {
  firstLevelNavItems,
  type FirstLevelNavItem,
} from './data/firstLevelNavigation';
import './App.css';

/** Wraps CompassProvider so portal (modals, toasts, popovers) gets dark theme via portalClassName="dark". */
function CompassProviderWithTheme({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  return <CompassProvider portalClassName={theme}>{children}</CompassProvider>;
}

/** Small floating light/dark toggle — bottom-right corner */
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="fixed bottom-4 right-4 z-[9999] flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-primary border border-secondary shadow-lg text-xs font-medium text-secondary hover:bg-secondary transition-colors"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
      )}
      {isDark ? 'Light' : 'Dark'}
    </button>
  );
}

// Main App component with routing
function App() {
  return (
    <ThemeProvider>
      <CompassProviderWithTheme>
        <ErrorBoundary>
          <Router>
            <AppContent />
          </Router>
        </ErrorBoundary>
        <ThemeToggle />
      </CompassProviderWithTheme>
    </ThemeProvider>
  );
}

// App content component that uses routing
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeCommunity, setActiveCommunity] = useState<string>('circle');
  const [isSwitcherMode, setIsSwitcherMode] = useState<boolean>(false);
  const [switcherActiveCommunity, setSwitcherActiveCommunity] =
    useState<string>('circle');
  const [adminInsetNoDockEnabled, setAdminInsetNoDockEnabled] =
    useState<boolean>(true);
  const [dockHiddenOverride, setDockHiddenOverride] = useState<boolean>(false);
  const [buildPreviewActive, setBuildPreviewActive] = useState<boolean>(false);
  const [enteredViaSparkle, setEnteredViaSparkle] = useState<boolean>(false);
  const [adminCopilotOpen, setAdminCopilotOpen] = useState<boolean>(false);
  const [adminCopilotMaximized, setAdminCopilotMaximized] = useState<boolean>(false);
  const [contentCardFaded, setContentCardFaded] = useState(false);

  const handleCopilotStateChange = (open: boolean, isNewChat?: boolean) => {
    if (open && !adminCopilotOpen && isNewChat) {
      setContentCardFaded(true);
      requestAnimationFrame(() => {
        setAdminCopilotOpen(true);
        setTimeout(() => setContentCardFaded(false), 320);
      });
    } else {
      setAdminCopilotOpen(open);
    }
  };
  const CONSTRAINED_BREAKPOINT = 1440;
  const [isScreenConstrained, setIsScreenConstrained] = useState(
    () => window.innerWidth < CONSTRAINED_BREAKPOINT
  );
  useEffect(() => {
    const onResize = () => setIsScreenConstrained(window.innerWidth < CONSTRAINED_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [CONSTRAINED_BREAKPOINT]);
  const [adminArtifactOpen, setAdminArtifactOpen] = useState<string | null>(null);
  const lastCommunityRouteRef = useRef<string>('/clarity');

  /** Admin inset (no dock): hide dock + resize container, then navigate and show admin.
   *  fromSparkle=true → opens copilot + community inset; false → opens admin page with expanded nav */
  const handleStartAdminTransition = useCallback(
    (path: string, fromSparkle = false) => {
      const firstSegment = location.pathname.replace(/^\//, '').split('/')[0];
      const fromCommunity = firstSegment
        ? decodeURIComponent(firstSegment)
        : '';
      if (['clarity', 'framer', 'more'].includes(fromCommunity)) {
        setActiveCommunity(fromCommunity);
      }
      setDockHiddenOverride(true);
      setEnteredViaSparkle(fromSparkle);
      setIsLoading(true);
      window.setTimeout(() => {
        navigate(path);
        window.setTimeout(() => setIsLoading(false), 200);
      }, 500);
    },
    [navigate, location.pathname]
  );

  /** Back to community: navigate immediately, admin nav slides out via CSS transition. */
  const handleBackToCommunity = useCallback(() => {
    setIsLoading(true);
    setDockHiddenOverride(false);
    setEnteredViaSparkle(false);
    setAdminCopilotOpen(false);
    // Navigate immediately — the admin overlay fades out via CSS transition
    navigate(lastCommunityRouteRef.current);
    window.setTimeout(() => setIsLoading(false), 350);
  }, [navigate]);

  const [navItems, setNavItems] = useState<FirstLevelNavItem[]>(
    () => firstLevelNavItems
  );

  const handleReorderCommunities = (reordered: FirstLevelNavItem[]) => {
    setNavItems(prev => {
      const communityIds = ['clarity', 'framer', 'more'];
      const nonCommunity = prev.filter(item => !communityIds.includes(item.id));
      const manage = prev.find(item => item.id === 'manage');
      return [...nonCommunity, ...reordered, ...(manage ? [manage] : [])];
    });
  };

  // Communities data (same logo as community/admin for consistency)
  const communities = [
    { id: 'circle', name: 'Circle', logo: '/images/circle-logo.png' },
    { id: 'oprah', name: 'Oprah Daily', logo: '/images/oprah-logo.png' },
    { id: 'clarity', name: 'Clarity', logo: '/images/clarity-logo-v2.png' },
  ];

  // Extract route parameters from URL (decode so "obama%20foundation" -> "obama foundation")
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const firstLevel = pathSegments[0]
    ? decodeURIComponent(pathSegments[0])
    : 'discover';
  const secondLevel = pathSegments[1]
    ? decodeURIComponent(pathSegments[1])
    : undefined;
  const subItem = pathSegments[2]
    ? decodeURIComponent(pathSegments[2])
    : undefined;

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7657/ingest/fd01d022-d456-47e7-9ee3-eabbb6756821',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'adbd37'},body:JSON.stringify({sessionId:'adbd37',runId:'initial',hypothesisId:'H2',location:'src/App.tsx:186',message:'AppContent mounted with route state',data:{pathname:location.pathname,firstLevel,secondLevel:secondLevel ?? null,subItem:subItem ?? null,sidebarCollapsedRaw:localStorage.getItem('sidebarCollapsed')},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }, [location.pathname, firstLevel, secondLevel, subItem]);

  const isAdminRoute = firstLevel === 'manage';
  const shouldHideDock =
    (adminInsetNoDockEnabled && isAdminRoute) || dockHiddenOverride;

  useEffect(() => {
    // Track last community route for "Back to community" in admin (prototype)
    if (
      firstLevel === 'clarity' ||
      firstLevel === 'framer' ||
      firstLevel === 'more'
    ) {
      lastCommunityRouteRef.current = `/${firstLevel}`;
    }
  }, [firstLevel]);

  const previousFirstLevelRef = useRef<string | null>(null);
  useEffect(() => {
    // Community-driven default theming (on navigation only).
    // Important: do NOT keep enforcing theme while user is on the page,
    // otherwise the user can't manually switch light/dark from the user menu.
    const previous = previousFirstLevelRef.current;
    previousFirstLevelRef.current = firstLevel;
    if (previous === null) return; // initial mount: honor stored/manual theme

    if (firstLevel === 'framer') setTheme('dark');
    if (firstLevel === 'clarity') setTheme('light');
  }, [firstLevel, setTheme]);

  const handleFirstLevelNavigationClick = (itemId: string) => {
    const resolvedId = itemId === 'circle' ? 'discover' : itemId;
    if (resolvedId === firstLevel) return; // Don't reload if same item

    // Show loading spinner
    setIsLoading(true);

    // Navigate to new route (encode path so "obama foundation" -> /obama%20foundation)
    setTimeout(() => {
      navigate(`/${encodeURIComponent(resolvedId)}`);
    }, 200);

    // Hide spinner after content has started changing
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleSidebarClick = (itemId: string, subItemId?: string) => {
    // Always navigate to /manage/... for admin sidebar so section and content stay in sync
    const base = '/manage';
    if (subItemId) {
      navigate(`${base}/${itemId}/${subItemId}`);
    } else {
      navigate(`${base}/${itemId}`);
    }
  };

  type PostClickEntity = { id: string };
  type UserClickEntity = {
    id?: string;
    name: string;
    handle: string;
    avatar: string;
    bio: string;
    socialLinks: Record<string, unknown>;
  };

  const handlePostClick = (post: PostClickEntity) => {
    setIsLoading(true);
    // Navigate while spinner is still visible
    setTimeout(() => {
      navigate(`/${firstLevel}/post/${post.id}`);
    }, 200);
    // Hide spinner after content has started changing
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleUserClick = (user: UserClickEntity) => {
    setIsLoading(true);
    const userKey = user.id ?? user.handle;
    // Navigate while spinner is still visible
    setTimeout(() => {
      navigate(`/${firstLevel}/user/${userKey}`);
    }, 200);
    // Hide spinner after content has started changing
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCommunityChange = (communityId: string, fromSwitcher = false) => {
    if (communityId === activeCommunity && !fromSwitcher) return;

    // Show loading overlay for the entire content area when changing community
    setIsLoading(true);

    // Switcher button controls whether dropdown exists (isSwitcherMode)
    // Dropdown only changes activeCommunity, never changes switcherActiveCommunity
    if (fromSwitcher) {
      // Change came from switcher button - this controls switcher mode
      if (communityId === 'clarity') {
        // Button 3 clicked - activate switcher mode and show dropdown
        // Set default activeCommunity to 'future-founders' when switcher mode is activated
        setIsSwitcherMode(true);
        setSwitcherActiveCommunity('clarity');
        setActiveCommunity('future-founders');
      } else {
        // Button 1 or 2 clicked - disable switcher mode and hide dropdown
        setIsSwitcherMode(false);
        setSwitcherActiveCommunity(communityId);
        setActiveCommunity(communityId);
      }
    } else {
      // Change came from Navbar dropdown - only update activeCommunity
      // This only works when switcher mode is active (isSwitcherMode === true)
      // Keep switcherActiveCommunity unchanged (stays as 'clarity' if switcher mode is active)
      // This ensures switcher button 3 remains active even when changing community via dropdown
      if (isSwitcherMode) {
        setActiveCommunity(communityId);
      }
    }

    // Hide loading after content has changed
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  const renderContent = () => {
    // #region agent log
    fetch('http://127.0.0.1:7657/ingest/fd01d022-d456-47e7-9ee3-eabbb6756821',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'adbd37'},body:JSON.stringify({sessionId:'adbd37',runId:'initial',hypothesisId:'H3',location:'src/App.tsx:324',message:'renderContent executing',data:{firstLevel,secondLevel:secondLevel ?? null,hasPostSegment:Boolean(pathSegments[2]),isAdminRoute:firstLevel === 'manage'},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    // Handle post detail routes
    if (secondLevel === 'post' && pathSegments[2]) {
      const postId = pathSegments[2];
      // In a real app, you'd fetch the post by ID
      const post = {
        id: postId,
        title: 'Sample Post',
        author: 'Sample Author',
        handle: 'sample-author',
        avatar: '/images/avatars/1.png',
        content: 'This is a sample post content.',
        image: '/images/placeholders/image-1.png',
        images: ['/images/placeholders/image-1.png'],
        likes: 42,
        comments: 5,
        isSaved: false,
        timeAgo: '2h',
        timestamp: new Date().toISOString(),
        bio: 'Sample author bio',
        socialLinks: {},
      };
      return (
        <PostDetail
          post={post}
          onBack={handleBack}
          onUserClick={handleUserClick}
        />
      );
    }

    // Handle user profile routes
    if (secondLevel === 'user' && pathSegments[2]) {
      const userId = pathSegments[2];
      // In a real app, you'd fetch the user by ID
      const user = {
        id: userId,
        name: 'Sample User',
        handle: 'sample-user',
        avatar: '/images/avatars/1.png',
        bio: 'This is a sample user bio.',
        socialLinks: {},
        postCount: 10,
      };
      return (
        <UserProfilePage
          user={user}
          onBack={handleBack}
          onPostClick={handlePostClick}
        />
      );
    }

    // Handle first level navigation with community-aware content
    switch (firstLevel) {
      case 'circle':
        return (
          <Feed onUserClick={handleUserClick} community={activeCommunity} />
        );
      case 'discover':
        return <Discovery />;
      case 'inbox':
        return <InboxPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'manage':
        return (
          <AdminSection
            onItemClick={handleSidebarClick}
            currentSection={secondLevel || 'audience'}
            activeSubItem={
              secondLevel === 'settings' && !subItem
                ? undefined
                : subItem || 'manage-audience'
            }
            activeCommunity={activeCommunity}
            onCommunityChange={handleCommunityChange}
            isSwitcherMode={isSwitcherMode}
            onBuildMode={setBuildPreviewActive}
            onBackToCommunity={
              adminInsetNoDockEnabled ? handleBackToCommunity : undefined
            }
            initialView={enteredViaSparkle ? 'community' : undefined}
            onCopilotStateChange={handleCopilotStateChange}
            onCopilotMaximizedChange={setAdminCopilotMaximized}
            onArtifactStateChange={(type) => setAdminArtifactOpen(type)}
            onSidebarCollapsedChange={setAdminSidebarCollapsed}
            adminOuterPortal={adminOuterEl}
            copilotPortal={copilotPortalEl}
          />
        );
      case 'clarity':
      case 'framer':
      case 'more':
        return (
          <Community
            communityId={firstLevel}
            onStartAdminTransition={
              adminInsetNoDockEnabled ? handleStartAdminTransition : undefined
            }
          />
        );
      default:
        return (
          <AdminSection
            onItemClick={handleSidebarClick}
            currentSection={secondLevel || 'audience'}
            activeSubItem={subItem || 'manage-audience'}
            activeCommunity={activeCommunity}
          />
        );
    }
  };

  // Portal targets for admin sidebar and copilot (rendered outside the content card)
  const [adminOuterEl, setAdminOuterEl] = useState<HTMLDivElement | null>(null);
  const [copilotPortalEl, setCopilotPortalEl] = useState<HTMLDivElement | null>(null);
  const [adminSidebarCollapsed, setAdminSidebarCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === 'true');

  const isAdminInset = shouldHideDock && isAdminRoute;

  return (
    <div className="h-screen bg-secondary overflow-hidden">
      <div
        className={[
          'h-full flex app-main-flex',
          shouldHideDock ? 'dock-hidden' : '',
          buildPreviewActive ? 'build-preview-open' : '',
        ].join(' ')}
      >
        {/* Nav column — shows dock OR admin sidebar, takes proper layout space */}
        <div
          className="shrink-0 h-full transition-[width] duration-300"
          style={{ width: isAdminInset ? ((adminCopilotOpen && isScreenConstrained) || adminSidebarCollapsed ? 68 : 222) : 68, transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          {isAdminInset ? (
            /* Admin sidebar — takes full column space */
            <div ref={setAdminOuterEl} className="h-full" />
          ) : (
            /* Community dock — fades in place, not carried by width */
            <div className="dock-appear h-full" style={{ width: 68 }}>
              <FirstLevelNavigation
                key={`nav-${activeCommunity}`}
                items={navItems}
                onItemClick={handleFirstLevelNavigationClick}
                activeItem={firstLevel === 'discover' ? 'circle' : firstLevel}
                community={activeCommunity}
                onReorderCommunities={handleReorderCommunities}
                onCopilotClick={() => handleStartAdminTransition('/manage/dashboard', true)}
              />
            </div>
          )}
        </div>

        {/* Content inset — 12px padding on top, right, bottom; horizontal gap only when copilot is open */}
        <div
          className={[
            'flex-1 min-w-0 min-h-0 flex bg-primary',
            isAdminInset && adminCopilotOpen ? 'gap-3' : 'gap-0',
          ].join(' ')}
        >
          {/* Copilot portal target — between nav and card */}
          <div
            ref={setCopilotPortalEl}
            className="h-full copilot-panel"
            style={{ flex: isAdminInset && adminCopilotMaximized ? 7 : isAdminInset && adminCopilotOpen ? 3 : 0 }}
          />

          {/* Unified content card */}
          <div
            className={[
              'overflow-hidden relative content-card-panel',
              isAdminInset && adminCopilotMaximized
                ? 'border-0'
                : isAdminInset && adminCopilotOpen
                  ? 'border border-secondary my-3 rounded-2xl mr-3'
                  : 'border-x border-primary',
              isAdminInset && adminCopilotMaximized
                ? 'shadow-none'
                : isAdminInset && adminCopilotOpen
                  ? 'shadow-[0_4px_20px_0_rgba(0,0,0,0.06),_0_1px_4px_0_rgba(0,0,0,0.03)]'
                  : 'shadow-2xs',
            ].join(' ')}
            style={{
              flex: isAdminInset && adminCopilotMaximized && !adminArtifactOpen ? 0 : adminArtifactOpen === 'page' ? 7 : adminArtifactOpen ? 'none' : 7,
              width: adminArtifactOpen && adminArtifactOpen !== 'page' ? (adminArtifactOpen === 'build-frame' ? 720 : 568) : undefined,
              opacity: contentCardFaded ? 0 : 1,
              transition: contentCardFaded ? 'none' : 'flex 380ms cubic-bezier(0.23, 1, 0.32, 1), opacity 250ms ease-in-out',
            }}
          >
            <div
              className={`h-full relative ${isLoading ? 'invisible' : ''}`}
            >
              {renderContent()}
            </div>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-primary z-10">
                <LoadingSpinner size="lg" />
              </div>
            )}
          </div>

          {/* Build preview */}
          {buildPreviewActive && (
            <div className="shrink-0 overflow-hidden rounded-2xl border border-primary bg-primary app-preview-column">
              <Community communityId="clarity" />
            </div>
          )}
        </div>
      </div>

      {/* Community Switcher */}
      <CommunitySwitcher
        communities={communities}
        activeCommunity={
          isSwitcherMode ? switcherActiveCommunity : activeCommunity
        }
        onCommunityChange={communityId =>
          handleCommunityChange(communityId, true)
        }
        adminInsetNoDockEnabled={adminInsetNoDockEnabled}
        onAdminInsetNoDockChange={enabled => {
          setAdminInsetNoDockEnabled(enabled);
          setDockHiddenOverride(false);
        }}
      />
    </div>
  );
}

export default App;
