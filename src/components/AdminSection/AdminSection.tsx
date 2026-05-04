import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Button } from '@circleco/compass/components/Button';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Typography } from '@circleco/compass/components/Typography';
import AvatarDropdown from '../AvatarDropdown';
import { Icon, type IconName } from '@circleco/compass/components/Icon';
import { TextInput } from '@circleco/compass/components/TextInput';
import { Tooltip } from '@circleco/compass/components/Tooltip';

import circleLogo from '../../circle-logo.svg';
import SidebarV2 from '../SidebarV2';

const PORTAL_NAV_COMMUNITIES = [
  { value: 'clarity', label: 'Clarity' },
  { value: 'elevate', label: 'Elevate' },
];
import {
  adminNavDataV5,
  ACCORDION_MANAGE_IDS,
  ACCORDION_SHOW_MORE_IDS,
  INSET_BUILD_IDS,
  INSET_BUILD_MORE_IDS,
  activeIdToAppRoute,
  type AdminNavItemV5,
} from '../SidebarV2/navDataV2';
import { CHAT_DATA } from '../../data/chatData';
import ManageAudience from '../ManageAudience';
import Community from '../CommunitySection';
import FullCommunity from '../Community';
import ContentSidebar from '../Content/ContentSidebar';
import { Posts, Spaces, Topics, Moderation, MediaManager } from '../Content';
import Workflows from '../Workflows/Workflows';
import History from '../Workflows/History';
import Coupons from '../Paywalls/Coupons';
import Paywalls from '../Paywalls/Paywalls';
import PaywallsSidebar from '../Paywalls/PaywallsSidebar';
import AccessGroups from '../AccessGroups/AccessGroups';
import Segments from '../Segments/Segments';
import BulkLogs from '../BulkLogs/BulkLogs';
import InviteLinks from '../InviteLinks/InviteLinks';
import Tags from '../Tags/Tags';
import ProfileFields from '../ProfileFields/ProfileFields';
import ActivityLogs from '../ActivityLogs/ActivityLogs';
import AIHelperChat from '../AIHelperChat';
import CopilotView, { type CopilotAsset } from '../CopilotView/CopilotView';
import AssetDetailSidebar from '../CopilotView/AssetDetailSidebar';
import LandingPageArtifact from '../CopilotView/LandingPageArtifact';
import EventDetailPanel from '../CopilotView/EventDetailPanel';
import CourseDetailPanel from '../CopilotView/CourseDetailPanel';
import FlyingInput from '../shared/FlyingInput';
import { type LaunchProjectData, type LaunchPlanStep, buildLaunchProject } from '../ProjectsPage/launchProjectData';
import LaunchProjectView from '../ProjectsPage/LaunchProjectView';
import NewCommunityFlow from '../Dashboard/NewCommunityFlow';
import AgentMessageBox from '../shared/AgentMessageBox';
import { BreadCrumbs } from '@circleco/compass/components/BreadCrumbs';
import { Menu } from '@circleco/compass/components/Menu';
import Onboarding from '../Onboarding';
import Gamification from '../Gamification';
import Live from '../Live';
import Overview from '../Marketing/Overview';
import Broadcasts from '../Marketing/Broadcasts';
import Forms from '../Marketing/Forms';
import Settings from '../Settings/Settings';
import ConfigureScreen from '../Settings/ConfigureScreen';
import {
  General,
  CustomDomain,
  CommunityAI,
  MobileApp,
  WeeklyDigest,
  Embed,
  SingleSignOn,
  Messaging,
  Legal,
} from '../Settings';
import Knowledge from '../Knowledge';
import EventsAdminPage from '../Events/EventsAdminPage';
import Agents from '../Agents';
import SubscriptionGroups from '../SubscriptionGroups';
import Transactions from '../Transactions';
import Subscriptions from '../Subscriptions';
import { PageEditor } from '../PageEditor';
import Content from '../Content/Content';
import Taxes from '../Taxes';
import ExportLogs from '../ExportLogs';
import Affiliates from '../Affiliates';
import Commissions from '../Commissions';
import HeaderNavigation from '../HeaderNavigation';
import SEO from '../SEO';
import Redirects from '../Redirects';
import Defaults from '../Defaults';
import CodeSnippets from '../CodeSnippets';
import PaywallsSettings from '../PaywallsSettings';
import AffiliatesSettings from '../AffiliatesSettings';
import BrandedApp from '../BrandedApp';
import AIInbox from '../AIInbox';
import InboxPage from '../InboxPage/InboxPage';
import Dashboard from '../Dashboard/Dashboard';
import AnalyticsOverview from '../AnalyticsSection/AnalyticsOverview';
import AgentsPage from '../AgentsPage/AgentsPage';
import AgentsManagementPage from '../AgentsManagementPage/AgentsManagementPage';
import TeamPage from '../TeamPage/TeamPage';
import AgentDetailView, { type Agent } from '../TeamPage/AgentDetailView';
import LibraryPage from '../LibraryPage/LibraryPage';
import ProjectsPage from '../ProjectsPage/ProjectsPage';
import { ViewMode, AudienceData } from '../../types';
import {
  audienceData,
  sidebarItems,
  loadAudienceData,
} from '../../data/mockData';

interface AdminSectionProps {
  onItemClick?: (itemId: string, subItemId?: string) => void;
  currentSection?: string;
  activeSubItem?: string;
  activeCommunity?: string;
  onCommunityChange?: (communityId: string) => void;
  isSwitcherMode?: boolean;
  onBackToCommunity?: () => void;
  onBuildMode?: (active: boolean) => void;
  initialView?: 'community';
  onCopilotStateChange?: (open: boolean, isNewChat?: boolean) => void;
  onStartContentFadeOut?: () => void;
  onCopilotMaximizedChange?: (maximized: boolean) => void;
  onArtifactStateChange?: (type: string | null) => void;
  onSidebarCollapsedChange?: (collapsed: boolean) => void;
  /** Portal target element for rendering admin sidebar outside the content card */
  adminOuterPortal?: HTMLDivElement | null;
  /** Portal target element for rendering copilot between nav and content card */
  copilotPortal?: HTMLDivElement | null;
}

/* ── Hover nav dropdown — no Base UI conflicts ─────────────────────── */
type NavDropdownEntry =
  | { type: 'group'; label: string; items: { label: string; onClick: () => void }[] }
  | { type: 'item'; label: string; onClick: () => void };

function NavHoverDropdown({
  entries, trigger, open, onPanelMouseEnter, onPanelMouseLeave,
}: {
  entries: NavDropdownEntry[];
  trigger: React.ReactElement;
  open: boolean;
  onPanelMouseEnter: () => void;
  onPanelMouseLeave: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.top, left: rect.right + 8 });
    }
  }, [open]);

  const triggerWithRef = React.cloneElement(trigger, { ref: btnRef });

  return (
    <>
      {triggerWithRef}
      {open && createPortal(
        <div
          style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 1000 }}
          className="nav-dropdown-panel bg-primary border border-primary rounded-md shadow-lg p-1 min-w-[180px]"
          onMouseEnter={onPanelMouseEnter}
          onMouseLeave={onPanelMouseLeave}
        >
          {entries.map((entry) =>
            entry.type === 'group' ? (
              <div key={entry.label}>
                <div className="px-2 py-1 text-label-xs text-tertiary">{entry.label}</div>
                {entry.items.map(item => (
                  <button key={item.label} type="button" onClick={item.onClick}
                    className="flex items-center w-full px-2 py-2 text-body-sm text-primary rounded-md cursor-pointer hover:bg-hover text-left">
                    {item.label}
                  </button>
                ))}
              </div>
            ) : (
              <button key={entry.label} type="button" onClick={entry.onClick}
                className="flex items-center w-full px-2 py-2 text-body-sm text-primary rounded-md cursor-pointer hover:bg-hover text-left">
                {entry.label}
              </button>
            )
          )}
        </div>,
        document.body,
      )}
    </>
  );
}

const AdminSection: React.FC<AdminSectionProps> = ({
  onItemClick,
  currentSection: propCurrentSection,
  activeSubItem: propActiveSubItem,
  activeCommunity,
  isSwitcherMode: _isSwitcherMode,
  onBackToCommunity,
  onBuildMode,
  initialView,
  onCopilotStateChange,
  onStartContentFadeOut,
  onCopilotMaximizedChange,
  onArtifactStateChange,
  onSidebarCollapsedChange,
  adminOuterPortal,
  copilotPortal,
}) => {
  const [viewMode] = useState<ViewMode>('Admin');
  const [showCommunityInset, setShowCommunityInset] = useState(initialView === 'community');
  // Use props directly for content display, state for local updates
  const currentSection = propCurrentSection || 'audience';
  const activeSubItem = propActiveSubItem || 'manage-audience';

  // For sidebar highlighting, use the actual content being displayed
  const sidebarCurrentSection = propActiveSubItem
    ? propCurrentSection
    : propCurrentSection;
  const sidebarActiveSubItem = propActiveSubItem || 'manage-audience';

  // Keep state for local updates and transitions

  const [isCopilotMaximized, setIsCopilotMaximized] = useState(false);
  // Support inbox overlay — when CopilotView's clarification widget routes to
  // Support, render the Inbox alongside (instead of navigating away and
  // unmounting the Copilot side panel).
  const [supportInboxOpen, setSupportInboxOpen] = useState(false);
  useEffect(() => {
    const handler = () => {
      // The first listener-fire opens the overlay and unmaximizes Copilot;
      // the InboxPage we then mount has its own listener that catches a
      // re-emitted event for the prefill payload.
      if (supportInboxOpen) return;
      setSupportInboxOpen(true);
      setIsCopilotMaximized(false);
    };
    window.addEventListener('open-support', handler);
    return () => window.removeEventListener('open-support', handler);
  }, [supportInboxOpen]);
  // Re-emit the most recent open-support detail once InboxPage has mounted so
  // its internal listener picks up variant/prefill/liveChatFirstMessage.
  const pendingSupportDetailRef = useRef<unknown>(null);
  useEffect(() => {
    const captureHandler = (e: Event) => {
      pendingSupportDetailRef.current = (e as CustomEvent).detail;
    };
    window.addEventListener('open-support', captureHandler);
    return () => window.removeEventListener('open-support', captureHandler);
  }, []);
  useEffect(() => {
    if (!supportInboxOpen) return;
    const detail = pendingSupportDetailRef.current;
    if (!detail) return;
    const t = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent('open-support', { detail }));
      pendingSupportDetailRef.current = null;
    }, 50);
    return () => window.clearTimeout(t);
  }, [supportInboxOpen]);
  // Sidebar navigation should clear the support overlay so the user can return
  // to normal admin content.
  useEffect(() => {
    setSupportInboxOpen(false);
  }, [propCurrentSection, propActiveSubItem]);
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => {
      // When entering from community: collapse on narrow screens, expand on wide
      if (initialView === 'community' || onBackToCommunity) {
        return window.innerWidth < 1440;
      }
      const stored = localStorage.getItem('sidebarCollapsed');
      return stored === null ? true : stored === 'true';
    }
  );
  const [adminCommunity] = useState('clarity');
  const CONSTRAINED_BREAKPOINT = 1440;
  const [isScreenConstrained, setIsScreenConstrained] = useState(
    () => window.innerWidth < CONSTRAINED_BREAKPOINT
  );
  const [isAIHelperOpen, setIsAIHelperOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(initialView === 'community');
  const [copilotEntering, setCopilotEntering] = useState(initialView === 'community');
  // When entering from community sparkle, clear the entering state after panel is sized
  useEffect(() => {
    if (initialView === 'community') {
      const t = setTimeout(() => setCopilotEntering(false), 400);
      return () => clearTimeout(t);
    }
  }, [initialView]);
  const [copilotLeaving] = useState(false);
  const [copilotInitialMessage, setCopilotInitialMessage] = useState<string | undefined>();
  const [flyingPhase] = useState<'idle' | 'flying' | 'fading'>('idle');
  const [flyingSource] = useState<DOMRect | null>(null);
  const [flyingTarget] = useState<DOMRect | null>(null);
  const [flyingMessage] = useState('');
  const [isAssetDetailOpen, setIsAssetDetailOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<CopilotAsset | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCopilotChatId, setActiveCopilotChatId] = useState<string>(() => searchParams.get('chat') ?? '1');
  const [copilotEntryPoint, setCopilotEntryPoint] = useState<string | undefined>(undefined);
  const [dashboardInputPulse, setDashboardInputPulse] = useState(0);
  const [copilotSkillMention, setCopilotSkillMention] = useState<string | null>(null);
  const [copilotSkillUseCase, setCopilotSkillUseCase] = useState<string | null>(null);
  const [copilotShortcutTask, setCopilotShortcutTask] = useState<string | null>(null);
  const [copilotArtifact, setCopilotArtifact] = useState<CopilotAsset | null>(null);
  const [analyticsContext, setAnalyticsContext] = useState<CopilotAsset | null>(null);
  const [builderTrigger, setBuilderTrigger] = useState(0);
  const wasMaximizedRef = useRef(false);
  const copilotFromDashboardRef = useRef(false);
  const [currentAudienceData, setCurrentAudienceData] =
    useState<AudienceData>(audienceData);
  const [isContentTransitioning, setIsContentTransitioning] = useState(false);
  const [isRouteEntering, setIsRouteEntering] = useState(
    () => !onBackToCommunity
  );
  const [isPageEditorOpen, setIsPageEditorOpen] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [, setIsPreviewOpen] = useState(false);
  const [pendingProjectTitle, setPendingProjectTitle] = useState<string | null>(null);
  const [launchProjectData, setLaunchProjectData] = useState<LaunchProjectData | null>(null);
  const [projectCardShimmer, setProjectCardShimmer] = useState(false);
  const [projectStepsOverride, setProjectStepsOverride] = useState<LaunchPlanStep[] | null>(null);
  const handleUpdateProjectSteps = (newSteps: LaunchPlanStep[]) => {
    setProjectCardShimmer(true);
    setTimeout(() => {
      setProjectStepsOverride(newSteps);
      // Also update launchProjectData if it exists (inset path)
      setLaunchProjectData(prev => prev ? { ...prev, steps: newSteps } : prev);
    }, 500);
    setTimeout(() => setProjectCardShimmer(false), 3000);
  };
  const [launchConvoState, setLaunchConvoState] = useState<{ typeId: string; answers: string[] } | null>(null);
  const [launchBuildingDone, setLaunchBuildingDone] = useState(false);
  const [isCopilotDrawerOpen, setIsCopilotDrawerOpen] = useState(false);
  const [expandedBuildL1, setExpandedBuildL1] = useState<string | null>(null);
  const [communitySwitcherOpen, setCommunitySwitcherOpen] = useState(false);
  const communitySwitcherTriggerRef = useRef<HTMLDivElement>(null);
  const communitySwitcherLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleCsMouseEnter = () => {
    if (communitySwitcherLeaveTimer.current) {
      clearTimeout(communitySwitcherLeaveTimer.current);
      communitySwitcherLeaveTimer.current = null;
    }
    setCommunitySwitcherOpen(true);
  };
  const handleCsMouseLeave = () => {
    communitySwitcherLeaveTimer.current = setTimeout(() => setCommunitySwitcherOpen(false), 120);
  };
  const [showMoreBuild, setShowMoreBuild] = useState(false);
  const [openNavMenuId, setOpenNavMenuId] = useState<string | null>(null);
  const navMenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isRecentChatsOpen, setIsRecentChatsOpen] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState('');
  const [loadingChatId, setLoadingChatId] = useState<string | null>(null);
  const [, setIsCopilotGenerating] = useState(false);
  const [generatingChatIds, setGeneratingChatIds] = useState<Set<string>>(new Set());
  const [unreadChatIds, setUnreadChatIds] = useState<Set<string>>(new Set());
  const [scrollToBottomTrigger, setScrollToBottomTrigger] = useState(0);
  const isCopilotOpenRef = useRef(isCopilotOpen);
  const activeCopilotChatIdRef = useRef(activeCopilotChatId);

  /* ── Inset sidebar nav data ──────────────────────────────────────── */
  const allAdminItems = useMemo(() => adminNavDataV5.flatMap(z => z.items), []);
  const isInsetMode = !!onBackToCommunity;
  const buildManageItems = useMemo(
    () => (isInsetMode ? INSET_BUILD_IDS : ACCORDION_MANAGE_IDS).map(id => allAdminItems.find(i => i.id === id)).filter((i): i is AdminNavItemV5 => !!i),
    [allAdminItems, isInsetMode]
  );
  const buildShowMoreItems = useMemo(
    () => (isInsetMode ? INSET_BUILD_MORE_IDS : ACCORDION_SHOW_MORE_IDS).map(id => allAdminItems.find(i => i.id === id)).filter((i): i is AdminNavItemV5 => !!i),
    [allAdminItems, isInsetMode]
  );

  const insetTopLinks = useMemo(() => [
    { id: 'copilot', sectionId: 'copilot', icon: 'sparkles' as const, activeIcon: 'sparkles-filled' as const, label: 'Circle AI' },
    { id: 'new-chat', sectionId: 'dashboard', icon: 'circle-plus' as const, activeIcon: 'circle-plus-filled' as const, label: 'New chat' },
    { id: 'ai-inbox', sectionId: 'ai-inbox', icon: 'inbox-empty' as const, activeIcon: 'inbox-empty-filled' as const, label: 'Inbox' },
    // { id: 'agents-management', sectionId: 'agents-management', icon: 'sparkle-box' as const, activeIcon: 'sparkle-box-filled' as const, label: 'Agents' },
    { id: 'agents-page', sectionId: 'agents-page', icon: 'ai-box' as const, activeIcon: 'ai-box-filled' as const, label: 'Skills' },
    { id: 'projects', sectionId: 'projects', icon: 'folder' as const, activeIcon: 'folder-filled' as const, label: 'Projects' },
  ], []);

  // Keep refs in sync for use in stable callbacks
  useEffect(() => { isCopilotOpenRef.current = isCopilotOpen; }, [isCopilotOpen]);
  useEffect(() => { activeCopilotChatIdRef.current = activeCopilotChatId; }, [activeCopilotChatId]);

  // Clear unread when user views a chat
  useEffect(() => {
    if (isCopilotOpen) {
      setUnreadChatIds(prev => {
        if (!prev.has(activeCopilotChatId)) return prev;
        const next = new Set(prev);
        next.delete(activeCopilotChatId);
        return next;
      });
    }
  }, [isCopilotOpen, activeCopilotChatId]);

  const handleGenerating = useCallback((generating: boolean) => {
    const chatId = activeCopilotChatIdRef.current;
    setIsCopilotGenerating(generating);
    if (generating) {
      setGeneratingChatIds(prev => new Set(Array.from(prev).concat(chatId)));
    } else {
      setGeneratingChatIds(prev => { const next = new Set(prev); next.delete(chatId); return next; });
      const isViewingThisChat = isCopilotOpenRef.current && activeCopilotChatIdRef.current === chatId;
      if (!isViewingThisChat) {
        setUnreadChatIds(prev => new Set(Array.from(prev).concat(chatId)));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Navigate from the inset sidebar — handles state cleanup + routing */
  const handleInsetNavClick = (sectionId: string) => {
    // Copilot item toggles copilot instead of navigating
    if (sectionId === 'copilot') {
      if (isCopilotOpen) {
        closeCopilot();
      } else if (currentSection === 'dashboard' && !showCommunityInset) {
        // Special case: on New chat → pulse the message box instead of opening copilot
        setDashboardInputPulse(p => p + 1);
      } else {
        openCopilot(undefined, undefined, undefined, false);
      }
      return;
    }
    // New chat: only when copilot was opened from dashboard, fade out then close
    if (sectionId === 'dashboard' && isCopilotOpen && activeCopilotChatId !== 'new' && copilotFromDashboardRef.current) {
      onStartContentFadeOut?.();          // 0ms: start content card fade-out immediately
      setActiveCopilotChatId('new');      // 0ms: fade CopilotView content out (80ms)
      setTimeout(() => closeCopilot(), 220);                                    // 220ms: close copilot once content is invisible
      setTimeout(() => { if (onItemClick) onItemClick('dashboard'); }, 240);    // 240ms: swap to dashboard while still locked
      return;
    }
    // Close copilot so the navigated page is fully visible
    if (isCopilotOpen) closeCopilot();
    if (activeAgent) setActiveAgent(null);
    if (isAssetDetailOpen) { setIsAssetDetailOpen(false); setSelectedAsset(null); }
    if (showCommunityInset) setShowCommunityInset(false);
    onBuildMode?.(false);
    if (onItemClick) onItemClick(sectionId);
  };

  /** Navigate from Build section items */
  const handleBuildNavClick = (item: AdminNavItemV5) => {
    // Items with children: only toggle expand/collapse (accordion), don't navigate
    if (item.children && item.children.length > 0) {
      setExpandedBuildL1(prev => prev === item.id ? null : item.id);
      return;
    }
    // Items without children: navigate directly
    const effectiveId = item.landingId || item.id;
    const route = activeIdToAppRoute(effectiveId);
    if (isCopilotMaximized) setIsCopilotMaximized(false);
    if (activeAgent) setActiveAgent(null);
    if (isAssetDetailOpen) { setIsAssetDetailOpen(false); setSelectedAsset(null); }
    if (showCommunityInset) setShowCommunityInset(false);
    if (onItemClick) onItemClick(route.sectionId, route.subItemId);
  };

  /** Navigate from Build child items */
  const handleBuildChildClick = (childId: string) => {
    const route = activeIdToAppRoute(childId);
    if (isCopilotMaximized) setIsCopilotMaximized(false);
    if (activeAgent) setActiveAgent(null);
    if (isAssetDetailOpen) { setIsAssetDetailOpen(false); setSelectedAsset(null); }
    if (showCommunityInset) setShowCommunityInset(false);
    if (onItemClick) onItemClick(route.sectionId, route.subItemId);
  };

  /** Check if a section is currently active */
  // True when the user is viewing a specific saved chat (not new/shortcut)
  const isViewingRecentChat = isCopilotOpen && CHAT_DATA.some(c => c.id === activeCopilotChatId);

  const isInsetSectionActive = (sectionId: string) => {
    // When viewing a saved recent chat, nothing else in the nav is active
    if (isViewingRecentChat) return false;
    if (sectionId === 'copilot') return isCopilotOpen;
    // Don't mark 'dashboard' (New chat) as active when community inset is visible
    if (sectionId === 'dashboard' && showCommunityInset) return false;
    return propCurrentSection === sectionId;
  };

  /** Check if a Build L1 or its children is active */
  const isBuildItemActive = (item: AdminNavItemV5) => {
    if (isViewingRecentChat) return false;
    const effectiveId = item.landingId || item.children?.[0]?.id || item.id;
    const route = activeIdToAppRoute(effectiveId);
    if (propCurrentSection === route.sectionId && propActiveSubItem === route.subItemId) return true;
    if (item.children?.some(c => {
      const cRoute = activeIdToAppRoute(c.id);
      return propCurrentSection === cRoute.sectionId && propActiveSubItem === cRoute.subItemId;
    })) return true;
    return false;
  };

  const isBuildChildActive = (childId: string) => {
    const route = activeIdToAppRoute(childId);
    return propCurrentSection === route.sectionId && propActiveSubItem === route.subItemId;
  };

  // Auto-expand Build L1 when its child is active
  useEffect(() => {
    const allBuildItems = [...buildManageItems, ...buildShowMoreItems];
    for (const item of allBuildItems) {
      if (item.children?.some(c => isBuildChildActive(c.id))) {
        setExpandedBuildL1(item.id);
        // Also expand "Show more" if the item is in that group
        if (ACCORDION_SHOW_MORE_IDS.includes(item.id)) setShowMoreBuild(true);
        break;
      }
      const effectiveId = item.landingId || item.children?.[0]?.id || item.id;
      const route = activeIdToAppRoute(effectiveId);
      if (propCurrentSection === route.sectionId && propActiveSubItem === route.subItemId) {
        setExpandedBuildL1(item.id);
        if (ACCORDION_SHOW_MORE_IDS.includes(item.id)) setShowMoreBuild(true);
        break;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propCurrentSection, propActiveSubItem]);

  useEffect(() => {
    if (onBackToCommunity) return;
    const t = window.setTimeout(() => setIsRouteEntering(false), 30);
    return () => window.clearTimeout(t);
  }, [onBackToCommunity]);

  // Load data from localStorage on app start
  useEffect(() => {
    const savedData = loadAudienceData();
    setCurrentAudienceData(savedData);
  }, []);

  // Reset preview state when leaving paywalls section
  useEffect(() => {
    if (currentSection !== 'paywalls') {
      setIsPreviewOpen(false);
    }
  }, [currentSection]);

  // Report copilot state to parent for frame shadow and layout
  useEffect(() => {
    onCopilotMaximizedChange?.(isCopilotMaximized);
  }, [isCopilotMaximized, onCopilotMaximizedChange]);
  useEffect(() => {
    onArtifactStateChange?.(copilotArtifact?.type ?? null);
  }, [copilotArtifact, onArtifactStateChange]);
  useEffect(() => {
    // Reset maximized when copilot closes
    if (!isCopilotOpen) {
      setIsCopilotMaximized(false);
      copilotFromDashboardRef.current = false;
    }
    // Use fade transition when opening from new-chat dashboard context
    const isFromDashboard = copilotFromDashboardRef.current;
    onCopilotStateChange?.(isCopilotOpen, isFromDashboard || activeCopilotChatId === 'new');
  }, [isCopilotOpen, activeCopilotChatId, onCopilotStateChange]);

  useEffect(() => {
    const onResize = () => setIsScreenConstrained(window.innerWidth < CONSTRAINED_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [CONSTRAINED_BREAKPOINT]);

  // Auto-collapse nav to icon-only when copilot is open on constrained screens
  const isNavCollapsed = isCopilotOpen && isScreenConstrained;
  // Sidebar is collapsed either by copilot or by manual toggle
  const sidebarSmall = isNavCollapsed || isSidebarCollapsed;

  // Clear open nav menu when sidebar expands (so it doesn't reappear on re-collapse)
  useEffect(() => {
    if (!sidebarSmall) setOpenNavMenuId(null);
  }, [sidebarSmall]);

  const ADMIN_AGENTS: Agent[] = [
    {
      id: 'clara',
      name: 'Clara',
      avatar: '/ai-avatar.png',
      description: "Hey! I'm Clara, your Community CSM. I handle member health, onboarding flows, and retention strategy. What would you like to work on?",
      lastActive: 'Last active 3 minutes ago',
      quickActions: [
        'Show me my inactive members',
        "How are this week's new members doing?",
        'Show me the onboarding completion funnel',
      ],
    },
    {
      id: 'dan',
      name: 'Dan',
      avatar: '/ai-avatar.png',
      description: 'Your money guy. Spots trends and plans your growth.',
      lastActive: 'Last active 1 hour ago',
      quickActions: [
        'Show me revenue trends',
        'Which members are likely to upgrade?',
        'Plan my Q2 growth strategy',
      ],
    },
    {
      id: 'maya',
      name: 'Maya',
      avatar: '/ai-avatar.png',
      description: 'Content magician. Drafts posts, broadcasts and recaps discussions.',
      lastActive: 'Last active 30 minutes ago',
      quickActions: [
        'Draft a weekly broadcast',
        "Recap this week's top discussions",
        'Write a welcome post for new members',
      ],
    },
  ];

  const handleAgentClick = (agentId: string) => {
    const agent = ADMIN_AGENTS.find(a => a.id === agentId);
    if (agent) setActiveAgent(agent);
  };

  const handleSidebarItemClick = (itemId: string, subItemId?: string) => {
    // Keep copilot open — it's a companion across navigation
    // If maximized, condense back to side panel so the page is visible
    if (isCopilotMaximized) setIsCopilotMaximized(false);
    // Close agent detail when navigating
    if (activeAgent) setActiveAgent(null);
    // Close skill detail sidebar when leaving the page
    if (isAssetDetailOpen) { setIsAssetDetailOpen(false); setSelectedAsset(null); }
    // Exit community inset when navigating to an admin page
    if (showCommunityInset) setShowCommunityInset(false);

    // Use URL navigation like first level navigation does
    if (onItemClick) {
      onItemClick(itemId, subItemId);
      return;
    }

    // Fallback to local state management for smooth transitions
    setIsContentTransitioning(true);
    setTimeout(() => {
      setTimeout(() => {
        setIsContentTransitioning(false);
      }, 50);
    }, 150);
  };

  const toggleSidebar = () => {
    const next = !isSidebarCollapsed;
    setIsSidebarCollapsed(next);
    localStorage.setItem('sidebarCollapsed', String(next));
    onSidebarCollapsedChange?.(next);
  };

  const openNavMenu = (id: string | null) => {
    if (navMenuCloseTimer.current) clearTimeout(navMenuCloseTimer.current);
    setOpenNavMenuId(id);
  };
  const closeNavMenu = () => {
    navMenuCloseTimer.current = setTimeout(() => setOpenNavMenuId(null), 80);
  };

  // Navigate to a child item from collapsed hover menu — stays collapsed
  const navigateAndExpand = (id: string) => {
    setOpenNavMenuId(null);
    const route = activeIdToAppRoute(id);
    if (isCopilotMaximized) setIsCopilotMaximized(false);
    if (activeAgent) setActiveAgent(null);
    if (isAssetDetailOpen) { setIsAssetDetailOpen(false); setSelectedAsset(null); }
    if (showCommunityInset) setShowCommunityInset(false);
    if (onItemClick) onItemClick(route.sectionId, route.subItemId);
  };

  const openCopilot = (chatId?: string, message?: string, _sourceRect?: DOMRect, startMaximized = true, entryPoint?: string) => {
    // Flag fade transition when opening from dashboard (no slide animation)
    if (currentSection === 'dashboard' && !isCopilotOpen) {
      copilotFromDashboardRef.current = true;
      if (chatId && chatId !== 'new' && onItemClick) {
        setTimeout(() => onItemClick('projects'), 80);
      }
    }

    const resolvedChatId = chatId ?? (message ? 'new' : '1');
    setActiveCopilotChatId(resolvedChatId);
    setSearchParams(prev => { const next = new URLSearchParams(prev); next.set('chat', resolvedChatId); return next; }, { replace: true });
    setCopilotEntryPoint(entryPoint ?? 'Chats');
    setCopilotSkillMention(null);
    setCopilotSkillUseCase(null);
    setCopilotShortcutTask(null);
    setCopilotInitialMessage(message);
    // All conversation starts open in maximized view
    if (startMaximized) setIsCopilotMaximized(true);

    // Simple open with stagger — no flying input needed in new layout
    setCopilotEntering(true);
    setIsCopilotOpen(true);
    setTimeout(() => setCopilotEntering(false), 350);
  };

  // Listen for sparkles reference — open copilot if not already open
  useEffect(() => {
    const handler = () => {
      if (!isCopilotOpen) {
        setCopilotEntering(true);
        setIsCopilotOpen(true);
        setIsCopilotMaximized(false);
        setTimeout(() => setCopilotEntering(false), 350);
      }
    };
    window.addEventListener('copilot-add-reference', handler);
    return () => window.removeEventListener('copilot-add-reference', handler);
  }, [isCopilotOpen]);

  const closeCopilot = () => {
    setIsCopilotOpen(false);
    setCopilotSkillMention(null);
    setCopilotSkillUseCase(null);
    setCopilotShortcutTask(null);
    setCopilotArtifact(null);
  };

  const closeArtifact = () => {
    setCopilotArtifact(null);
    if (wasMaximizedRef.current) {
      setIsCopilotMaximized(true);
      wasMaximizedRef.current = false;
    }
  };

  const handleSeeAllEvents = () => {
    setCopilotArtifact(null);
    wasMaximizedRef.current = false;
    if (onItemClick) onItemClick('content', 'events');
  };

  const viewInAnalytics = () => {
    // Close artifact without restoring maximized state, shrink copilot to side panel
    wasMaximizedRef.current = false;
    setAnalyticsContext(copilotArtifact); // capture source before clearing
    setCopilotArtifact(null);
    setIsCopilotMaximized(false);
    setShowCommunityInset(false);
    onItemClick?.('analytics-overview');
  };

  const handleAssetClick = (asset: CopilotAsset) => {
    setSelectedAsset(asset);
    setIsAssetDetailOpen(true);
    setIsAIHelperOpen(false);
  };

  const handleDataChange = (newData: AudienceData) => {
    setCurrentAudienceData(newData);
  };

  const handlePageClick = (pageId: string) => {
    setSelectedPageId(pageId);
    setIsPageEditorOpen(true);
  };

  const handleCreatePage = (templateId?: string) => {
    if (templateId) {
      setSelectedPageId(templateId);
      setIsPageEditorOpen(true);
    }
  };

  const handleBackFromEditor = () => {
    setIsPageEditorOpen(false);
    setSelectedPageId(null);
  };

  const renderContent = () => {
    if (supportInboxOpen) {
      return <InboxPage />;
    }
    if (showCommunityInset) {
      return <FullCommunity communityId={activeCommunity || 'clarity'} />;
    }
    if (viewMode === 'Community') {
      return <Community />;
    }

    // Use subItem for content rendering, fallback to currentSection
    // For items without subItems (like dashboard), use currentSection directly
    const currentItem = sidebarItems.find(
      item => item.id === propCurrentSection
    );
    const hasSubItems =
      currentItem && currentItem.subItems && currentItem.subItems.length > 0;

    const displaySection = hasSubItems
      ? propActiveSubItem || propCurrentSection || 'audience'
      : propCurrentSection || 'audience';

    switch (displaySection) {
      case 'dashboard':
        return (
          <Dashboard
            onToggleSidebar={toggleSidebar}
            onOpenCopilot={openCopilot}
            onItemClick={handleAssetClick}
            pulseInput={dashboardInputPulse}
            onCreateProject={(typeId, answers) => {
              setLaunchProjectData(buildLaunchProject(typeId, answers));
              setLaunchConvoState({ typeId, answers });
              setLaunchBuildingDone(true);
              // Open copilot state so App.tsx applies the card inset styling
              setIsCopilotMaximized(false);
              setIsCopilotOpen(true);
            }}
            onShortcutClick={(label) => {
              copilotFromDashboardRef.current = true;
              setActiveCopilotChatId('shortcut');
              setCopilotShortcutTask(label);
              setCopilotSkillMention(null);
              setCopilotSkillUseCase(null);
              setIsCopilotMaximized(true);
              setCopilotEntering(true);
              setIsCopilotOpen(true);
              // Fade the whole background out (90ms) in sync with the copilot content fade (70ms)
              setIsContentTransitioning(true);
              // At 120ms everything is invisible — swap the route and copilot content
              setTimeout(() => {
                if (onItemClick) onItemClick('projects');
              }, 120);
              // At 160ms start fading everything back in together
              setTimeout(() => {
                setIsContentTransitioning(false);
                setCopilotEntering(false);
              }, 160);
            }}
          />
        );
      case 'agents-management':
        return <AgentsManagementPage />;
      case 'agents-page':
        return <AgentsPage onToggleSidebar={toggleSidebar} onItemClick={handleAssetClick} onItemClose={() => { setIsAssetDetailOpen(false); setSelectedAsset(null); }} selectedSkillId={isAssetDetailOpen ? selectedAsset?.id : undefined} />;
      case 'team':
        return <TeamPage onToggleSidebar={toggleSidebar} />;
      case 'library':
        return (
          <LibraryPage
            onItemClick={handleAssetClick}
            onItemClose={() => { setIsAssetDetailOpen(false); setSelectedAsset(null); }}
            selectedItemId={isAssetDetailOpen ? selectedAsset?.id : undefined}
          />
        );
      case 'projects':
        return (
          <ProjectsPage
            onItemClick={handleAssetClick}
            pendingProjectTitle={pendingProjectTitle}
            onClearPendingProject={() => setPendingProjectTitle(null)}
            launchProject={launchProjectData}
            onClearLaunchProject={() => setLaunchProjectData(null)}
            onOpenCopilot={() => {
              setIsCopilotMaximized(false);
              if (!isCopilotOpen) {
                setCopilotEntering(true);
                setIsCopilotOpen(true);
                setTimeout(() => setCopilotEntering(false), 350);
              }
            }}
            onNewChat={() => {
              // Open with clean new chat state — just the AI greeting + message input
              setActiveCopilotChatId('10');
              setIsCopilotMaximized(true);
              setCopilotEntering(true);
              setIsCopilotOpen(true);
              setTimeout(() => setCopilotEntering(false), 350);
            }}
            onOpenChat={(_chatId, _title, _messages) => {
              // Map project chats to existing CopilotView chat IDs
              const chatIds = ['2', '3', '4', '5', '6'];
              const mapped = chatIds[Math.abs(_chatId.charCodeAt(1) || 0) % chatIds.length];
              if (isCopilotOpen) {
                // Copilot sidebar is open — refresh its content
                setActiveCopilotChatId(mapped);
              } else {
                // Copilot closed — open full screen
                setActiveCopilotChatId(mapped);
                setIsCopilotMaximized(true);
                setCopilotEntering(true);
                setIsCopilotOpen(true);
                setTimeout(() => setCopilotEntering(false), 350);
              }
            }}
            onEntryPointChange={(label) => setCopilotEntryPoint(label)}
            shimmerProgress={projectCardShimmer}
            projectStepsOverride={projectStepsOverride}
          />
        );
      case 'manage-audience':
        return (
          <ManageAudience
            audienceData={currentAudienceData}
            onToggleSidebar={toggleSidebar}
            onDataChange={handleDataChange}
          />
        );
      case 'pages':
        return (
          <Content
            title="Pages"
            createButtonText="Create page"
            filters={[
              'Title',
              'Author',
              'Spaces',
              'Tag',
              'Published',
              'Add filter',
            ]}
            columns={['Name', 'Status', 'Author', 'Updated']}
            onToggleSidebar={toggleSidebar}
            onPageClick={handlePageClick}
            onCreatePage={handleCreatePage}
          />
        );
      case 'posts':
        return <Posts onToggleSidebar={toggleSidebar} />;
      case 'spaces':
        return <Spaces onToggleSidebar={toggleSidebar} />;
      case 'topics':
        return <Topics onToggleSidebar={toggleSidebar} onBack={() => onItemClick?.('settings')} />;
      case 'moderation':
        return <Moderation onToggleSidebar={toggleSidebar} />;
      case 'media-manager':
        return <MediaManager onToggleSidebar={toggleSidebar} />;
      case 'events':
        return <EventsAdminPage onToggleSidebar={toggleSidebar} />;
      case 'live':
        return <Live onToggleSidebar={toggleSidebar} />;
      case 'access-groups':
        return <AccessGroups onToggleSidebar={toggleSidebar} onBack={() => onItemClick?.('settings')} />;
      case 'segments':
        return <Segments onToggleSidebar={toggleSidebar} />;
      case 'bulk-logs':
        return <BulkLogs onToggleSidebar={toggleSidebar} onBack={() => onItemClick?.('settings')} />;
      case 'invite-links':
        return <InviteLinks onToggleSidebar={toggleSidebar} />;
      case 'onboarding':
        return <Onboarding onToggleSidebar={toggleSidebar} onBack={() => onItemClick?.('settings')} />;
      case 'tags':
        return <Tags onToggleSidebar={toggleSidebar} onBack={() => onItemClick?.('settings')} />;
      case 'profile-fields':
        return <ProfileFields onToggleSidebar={toggleSidebar} onBack={() => onItemClick?.('settings')} />;
      case 'gamification':
        return <Gamification onToggleSidebar={toggleSidebar} onBack={() => onItemClick?.('settings')} />;
      case 'activity-logs':
        return <ActivityLogs onToggleSidebar={toggleSidebar} onBack={() => onItemClick?.('settings')} />;
      case 'overview':
        return <Overview onToggleSidebar={toggleSidebar} />;
      case 'broadcasts':
        return <Broadcasts onToggleSidebar={toggleSidebar} />;
      case 'forms':
        return <Forms onToggleSidebar={toggleSidebar} />;
      case 'settings':
        if (!propActiveSubItem) {
          return (
            <ConfigureScreen
              onSelectItem={id => onItemClick?.('settings', id)}
              onToggleSidebar={toggleSidebar}
            />
          );
        }
        return <Settings onToggleSidebar={toggleSidebar} />;
      case 'general':
        return <General onToggleSidebar={toggleSidebar} onBack={() => onItemClick?.('settings')} />;
      case 'custom-domain':
        return <CustomDomain onToggleSidebar={toggleSidebar} onBack={() => onItemClick?.('settings')} />;
      case 'community-ai':
        return <CommunityAI onToggleSidebar={toggleSidebar} onBack={() => onItemClick?.('settings')} />;
      case 'mobile-app':
        return <MobileApp onToggleSidebar={toggleSidebar} onBack={() => onItemClick?.('settings')} />;
      case 'weekly-digest':
        return <WeeklyDigest onToggleSidebar={toggleSidebar} onBack={() => onItemClick?.('settings')} />;
      case 'embed':
        return <Embed onToggleSidebar={toggleSidebar} onBack={() => onItemClick?.('settings')} />;
      case 'single-sign-on':
        return <SingleSignOn onToggleSidebar={toggleSidebar} onBack={() => onItemClick?.('settings')} />;
      case 'messaging':
        return <Messaging onToggleSidebar={toggleSidebar} onBack={() => onItemClick?.('settings')} />;
      case 'legal':
        return <Legal onToggleSidebar={toggleSidebar} onBack={() => onItemClick?.('settings')} />;
      case 'all-workflows':
        return <Workflows onToggleSidebar={toggleSidebar} />;
      case 'history':
        return <History onToggleSidebar={toggleSidebar} />;
      case 'coupons':
        return <Coupons onToggleSidebar={toggleSidebar} />;
      case 'paywalls-sidebar':
        return (
          <PaywallsSidebar
            onToggleSidebar={toggleSidebar}
            onItemClick={handleSidebarItemClick}
            activeSubItem={activeSubItem}
          />
        );
      case 'paywalls':
        return (
          <Paywalls
            onToggleSidebar={toggleSidebar}
            isSidebarCollapsed={isSidebarCollapsed}
            isAIHelperOpen={isAIHelperOpen}
            onCloseAIHelper={() => setIsAIHelperOpen(false)}
            onPreviewToggle={setIsPreviewOpen}
          />
        );
      case 'subscription-groups':
        return <SubscriptionGroups onToggleSidebar={toggleSidebar} />;
      case 'transactions':
        return <Transactions onToggleSidebar={toggleSidebar} />;
      case 'subscriptions':
        return <Subscriptions onToggleSidebar={toggleSidebar} />;
      case 'taxes':
        return <Taxes onToggleSidebar={toggleSidebar} />;
      case 'export-logs':
        return <ExportLogs onToggleSidebar={toggleSidebar} />;
      case 'affiliates':
        return <Affiliates onToggleSidebar={toggleSidebar} />;
      case 'commissions':
        return <Commissions onToggleSidebar={toggleSidebar} />;
      case 'navigation':
        return <HeaderNavigation onToggleSidebar={toggleSidebar} />;
      case 'seo':
        return <SEO onToggleSidebar={toggleSidebar} onBack={() => onItemClick?.('settings')} />;
      case 'redirects':
        return <Redirects onToggleSidebar={toggleSidebar} onBack={() => onItemClick?.('settings')} />;
      case 'defaults':
        return <Defaults onToggleSidebar={toggleSidebar} onBack={() => onItemClick?.('settings')} />;
      case 'code-snippets':
        return <CodeSnippets onToggleSidebar={toggleSidebar} onBack={() => onItemClick?.('settings')} />;
      case 'paywalls-settings':
        return <PaywallsSettings onToggleSidebar={toggleSidebar} />;
      case 'affiliates-settings':
        return <AffiliatesSettings onToggleSidebar={toggleSidebar} />;
      case 'branded-app':
        return <BrandedApp onToggleSidebar={toggleSidebar} />;
      case 'ai-inbox':
        return <AIInbox onToggleSidebar={toggleSidebar} />;
      case 'knowledge':
        return <Knowledge onToggleSidebar={toggleSidebar} />;
      case 'agents':
        return <Agents onToggleSidebar={toggleSidebar} />;
      case 'analytics-overview':
      case 'analytics-reports':
      case 'analytics-insights':
        return <AnalyticsOverview onToggleSidebar={toggleSidebar} context={analyticsContext} />;
      default:
        return (
          <ContentSidebar
            onToggleSidebar={toggleSidebar}
            onItemClick={handleSidebarItemClick}
            activeSubItem={activeSubItem}
          />
        );
    }
  };

  // If page editor is open, show it as full screen (overrides everything)
  if (isPageEditorOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-primary">
        <PageEditor
          onToggleSidebar={toggleSidebar}
          onBackToList={handleBackFromEditor}
          selectedPageId={selectedPageId}
        />
      </div>
    );
  }

  const handleCopilotChatSelect = (chatId: string) => {
    const movingFromNewToSavedChat = activeCopilotChatId === 'new' && chatId !== 'new';
    setActiveCopilotChatId(chatId);

    // Switch background to Projects as soon as content fades out (80ms), before drawer slides
    if (movingFromNewToSavedChat && currentSection === 'dashboard' && onItemClick) {
      setTimeout(() => {
        onItemClick('projects');
      }, 80);
    }
  };

  /* ── Shared fragments ── */
  const copilotViewProps = {
    isEntering: copilotEntering,
    hideInput: flyingPhase !== 'idle',
    initialMessage: copilotInitialMessage,
    onClose: closeCopilot,
    onAssetClick: handleAssetClick,
    activeChatId: activeCopilotChatId,
    onChatSelect: handleCopilotChatSelect,
    skillMention: copilotSkillMention,
    skillUseCase: copilotSkillUseCase,
    shortcutTask: copilotShortcutTask,
    entryPointLabel: copilotEntryPoint,
    onEntryPointClick: () => {
      closeCopilot();
      const target = copilotEntryPoint === 'Chats' ? 'dashboard' : 'projects';
      if (onItemClick) onItemClick(target);
    },
    onUpdateProjectSteps: handleUpdateProjectSteps,
    onBuildMode,
    onDrawerOpenChange: setIsCopilotDrawerOpen,
    onMaximize: () => setIsCopilotMaximized(m => !m),
    isMaximized: isCopilotMaximized,
    artifactOpen: !!copilotArtifact,
    openBuilder: builderTrigger,
    onGenerating: handleGenerating,
    scrollToBottom: scrollToBottomTrigger,
    onArtifactOpen: (asset: CopilotAsset | null) => {
      if (asset) {
        wasMaximizedRef.current = isCopilotMaximized;
        setCopilotArtifact(asset);
        if (isCopilotMaximized) setIsCopilotMaximized(false);
      } else {
        setCopilotArtifact(null);
        if (wasMaximizedRef.current) setIsCopilotMaximized(true);
      }
    },
  };

  const sidebarV2Props = {
    sidebarOnly: true as const,
    sidebarCollapsed: isSidebarCollapsed,
    isCopilotActive: isNavCollapsed,
    showCollapseAffordance: isCopilotDrawerOpen,
    onToggleSidebar: toggleSidebar,
    onItemClick: handleSidebarItemClick,
    onAgentClick: handleAgentClick,
    currentSection: sidebarCurrentSection,
    activeSubItem: sidebarActiveSubItem,
  };

  const rightPanels = (
    <>
      {/* Right panel: AI Helper */}
      <div
        className={`transition-[width,opacity,transform] duration-300 shrink-0 overflow-hidden ${
          isAIHelperOpen
            ? 'w-[326px] opacity-100 transform translate-x-0'
            : 'w-0 opacity-0 transform translate-x-full ml-0'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <AIHelperChat onClose={() => setIsAIHelperOpen(false)} />
      </div>
      {/* Asset / Skill detail — drawer overlay from right */}
      <div
        className={`absolute top-0 right-0 h-full z-30 transition-transform duration-300 shadow-lg ${
          isAssetDetailOpen && selectedAsset
            ? 'translate-x-0'
            : 'translate-x-full'
        }`}
        style={{ width: 550, transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {selectedAsset && (
          <AssetDetailSidebar
            asset={selectedAsset}
            onClose={() => {
              setIsAssetDetailOpen(false);
              setSelectedAsset(null);
            }}
            onStartConversation={selectedAsset.type === 'agent' ? (skillName) => {
              const firstUseCase = selectedAsset?.agentData?.useCases?.[0]?.replace(/^"|"$/g, '') ?? null;
              setIsAssetDetailOpen(false);
              setSelectedAsset(null);
              setActiveCopilotChatId('new');
              setCopilotSkillMention(skillName);
              setCopilotSkillUseCase(firstUseCase);
              setIsCopilotMaximized(true);
              setIsCopilotOpen(true);
            } : undefined}
          />
        )}
      </div>
    </>
  );

  const mainContent = (
    <main className="flex-1 overflow-hidden min-h-0 shrink-0 relative">
      <div
        className={`absolute inset-0 transition-opacity ${
          isContentTransitioning || isRouteEntering
            ? 'opacity-0'
            : 'opacity-100'
        }`}
        style={{
          transitionDuration: isContentTransitioning ? '90ms' : '350ms',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {activeAgent ? (
          <AgentDetailView
            agent={activeAgent}
            onBack={() => setActiveAgent(null)}
          />
        ) : (
          renderContent()
        )}
      </div>

      {/* Recent chats drawer — slides in from left within content area */}
      <div
        className={`absolute top-0 left-0 bottom-0 z-40 w-[420px] bg-primary border-r border-secondary flex flex-col transition-[transform,box-shadow] duration-[250ms] ease-out ${
          isRecentChatsOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full shadow-none'
        }`}
      >
        {/* Header — 12px 16px 12px 24px */}
        <div className="flex items-center justify-between pl-6 pr-4 py-3 shrink-0">
          <Typography variant="heading-sm" color="primary">Recent chats</Typography>
          <IconButton variant="ghost" size="sm" icon="cross" aria-label="Close" onClick={() => { setIsRecentChatsOpen(false); setDrawerSearch(''); }} />
        </div>
        {/* Content — 16px padding, 8px gap */}
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto p-4 gap-2">
          {/* Search */}
          <TextInput
            placeholder="Search in chats..."
            value={drawerSearch}
            onChange={e => setDrawerSearch(e.target.value)}
          />
          {/* Chat list */}
          {(() => {
            const q = drawerSearch.toLowerCase().trim();
            const filtered = q
              ? CHAT_DATA.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
              : CHAT_DATA;
            if (filtered.length === 0) {
              return (
                <div className="flex items-center justify-center py-12">
                  <Typography variant="body-sm" color="tertiary">No chats found</Typography>
                </div>
              );
            }
            return filtered.map(chat => (
              <button
                key={chat.id}
                type="button"
                onClick={() => {
                  setIsRecentChatsOpen(false);
                  setDrawerSearch('');
                  openCopilot(chat.id, undefined, undefined, true);
                }}
                className={`w-full text-left px-5 py-4 rounded-lg border flex flex-col gap-1 transition-colors duration-[50ms] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] ${
                  activeCopilotChatId === chat.id
                    ? 'bg-secondary border-secondary'
                    : 'bg-primary border-[#F0F3F5] hover:bg-hover'
                }`}
              >
                <span className="text-xs leading-[18px] text-[color:var(--color-text-tertiary)]">{chat.date}</span>
                <span className="text-sm leading-5 font-medium text-[color:var(--color-text-primary)]">{chat.title}</span>
                <span className="text-sm leading-5 text-[color:var(--color-text-secondary)] line-clamp-2">{chat.description}</span>
              </button>
            ));
          })()}
        </div>
      </div>
      {/* Backdrop to close drawer when clicking outside */}
      {isRecentChatsOpen && (
        <div
          className="absolute inset-0 z-30"
          onClick={() => { setIsRecentChatsOpen(false); setDrawerSearch(''); }}
        />
      )}
    </main>
  );

  /* ── INSET MODE: portal sidebar + copilot outside the card, render content inside ── */
  if (onBackToCommunity) {
    return (
      <div className="h-full bg-primary flex flex-col overflow-hidden">
        {/* Hero transition: flying input from dashboard to conversation */}
        {flyingPhase !== 'idle' && flyingSource && flyingTarget && (
          <FlyingInput
            message={flyingMessage}
            sourceRect={flyingSource}
            targetRect={flyingTarget}
            fading={flyingPhase === 'fading'}
          />
        )}

        {/* Portal: admin sidebar rendered in nav column via App.tsx portal target */}
        {adminOuterPortal && viewMode === 'Admin' && createPortal(
          <div
            className="h-full flex flex-col bg-secondary transition-[width] duration-300"
            style={{ width: (isNavCollapsed || isSidebarCollapsed) ? 68 : 222, transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            {/* ── Unified nav — labels & sections hide when collapsed ── */}
            <div className="h-full flex flex-col justify-between pb-3 pt-4 px-4">
              <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hide">
                {/* Community switcher */}
                {sidebarSmall ? (
                  /* Collapsed: logo only — hover opens menu, click goes to community */
                  <div
                    className="relative"
                    onMouseEnter={handleCsMouseEnter}
                    onMouseLeave={handleCsMouseLeave}
                  >
                    <div
                      ref={communitySwitcherTriggerRef}
                      className="group relative w-9 h-9 shrink-0 cursor-pointer"
                      onClick={onBackToCommunity}
                    >
                      <div className="absolute inset-0 transition-opacity duration-200 group-hover:opacity-0 pointer-events-none">
                        <img src={circleLogo} alt="" aria-hidden="true" className="absolute rounded-md opacity-20" style={{ width: 30, height: 30, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
                        <img src="/images/clarity-logo.png" alt="Clarity" className="absolute rounded-md object-cover" style={{ width: 30, height: 30, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Icon name="arrow-left" size="sm" className="text-primary" />
                      </div>
                    </div>
                    {communitySwitcherOpen && (
                      <>
                        <div
                          className="fixed z-[9999] w-[272px] pt-4 pb-2 px-4 animate-[fadeIn_150ms_ease-out]"
                          style={{
                            top: (() => {
                              if (!communitySwitcherTriggerRef.current) return 16;
                              const rect = communitySwitcherTriggerRef.current.getBoundingClientRect();
                              return rect.top;
                            })(),
                            left: 76,
                            borderRadius: 'var(--radius-xl)',
                            border: '1px solid var(--color-border-default)',
                            background: 'var(--color-background-primary-default, white)',
                            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.06), 0 1px 4px 0 rgba(0,0,0,0.03), 0 1px 4px 0 rgba(0,0,0,0.03)',
                          }}
                          onMouseEnter={handleCsMouseEnter}
                          onMouseLeave={handleCsMouseLeave}
                        >
                          <div className="border-b border-secondary pb-3">
                            <div className="flex items-center gap-2 py-1">
                              <div className="relative w-9 h-9 shrink-0">
                                <img src={circleLogo} alt="" className="absolute rounded-md opacity-20" style={{ width: 27, height: 27, left: 5, top: 9 }} />
                                <img src="/images/clarity-logo.png" alt="Clarity" className="absolute rounded-md object-cover" style={{ width: 30, height: 30, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
                              </div>
                              <span className="text-sm font-medium text-primary flex-1">Clarity</span>
                              <Icon name="checkmark-small" size="md" style={{ color: 'var(--color-icon-primary)' }} />
                            </div>
                            <div className="flex flex-col gap-0.5 mt-2">
                              <button type="button" onClick={() => { setCommunitySwitcherOpen(false); handleInsetNavClick('settings'); }} className="flex items-center gap-3 h-9 px-2 py-1 rounded-md transition-colors duration-100 w-full text-left hover:bg-secondary">
                                <Icon name="settings-gear" size="md" className="shrink-0" style={{ color: 'var(--color-icon-primary)' }} />
                                <span className="text-sm text-primary">Settings</span>
                              </button>
                              <button type="button" onClick={() => setCommunitySwitcherOpen(false)} className="flex items-center gap-3 h-9 px-2 py-1 rounded-md transition-colors duration-100 w-full text-left hover:bg-secondary">
                                <Icon name="people-add" size="md" className="shrink-0" style={{ color: 'var(--color-icon-primary)' }} />
                                <span className="text-sm text-primary">Add members</span>
                              </button>
                              <button type="button" onClick={() => { setCommunitySwitcherOpen(false); if (onBackToCommunity) (onBackToCommunity as () => void)(); }} className="flex items-center gap-3 h-9 px-2 py-1 rounded-md transition-colors duration-100 w-full text-left hover:bg-secondary">
                                <Icon name={'wrap-left' as IconName} size="md" className="shrink-0" style={{ color: 'var(--color-icon-primary)' }} />
                                <span className="text-sm text-primary">Go back to community</span>
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 py-1 mt-1 cursor-pointer rounded-md hover:bg-secondary px-0 transition-colors duration-100">
                            <div className="relative w-9 h-9 shrink-0">
                              <img src={circleLogo} alt="" className="absolute rounded-md opacity-20" style={{ width: 27, height: 27, left: 5, top: 9 }} />
                              <div className="absolute rounded-md bg-white overflow-hidden" style={{ width: 30, height: 30, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                                <div className="w-full h-full bg-green-100 flex items-center justify-center text-green-800 font-semibold text-xs">E</div>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-primary flex-1">Elevate Community</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  /* Expanded: Select-style trigger — logo click = community, rest = open menu */
                  <div className="relative w-full">
                    <div
                      ref={communitySwitcherTriggerRef}
                      className="flex items-center gap-2 w-full rounded-lg border border-[#E4E7EB] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] cursor-pointer hover:bg-[#F7F9FA] transition-colors duration-100"
                      onClick={() => setCommunitySwitcherOpen(prev => !prev)}
                    >
                      <Tooltip content="Back to community" side="right" sideOffset={8}>
                        <div
                          className="group relative w-9 h-9 shrink-0 cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); onBackToCommunity?.(); }}
                        >
                          <div className="absolute inset-0 transition-opacity duration-200 group-hover:opacity-0 pointer-events-none">
                            <img src={circleLogo} alt="" aria-hidden="true" className="absolute rounded-md opacity-20" style={{ width: 30, height: 30, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
                            <img src="/images/clarity-logo.png" alt="Clarity" className="absolute rounded-md object-cover" style={{ width: 30, height: 30, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Icon name="arrow-left" size="sm" className="text-primary" />
                          </div>
                        </div>
                      </Tooltip>
                      <span className="text-sm font-medium text-primary truncate leading-tight flex-1">
                        {PORTAL_NAV_COMMUNITIES.find(c => c.value === adminCommunity)?.label ?? 'Clarity'}
                      </span>
                      <div className="flex items-center justify-center w-6 h-6 shrink-0 mr-1">
                        <Icon name="chevron-down" size="sm" style={{ color: 'var(--color-icon-primary)' }} />
                      </div>
                    </div>
                    {communitySwitcherOpen && (
                      <>
                        <div className="fixed inset-0 z-[9998]" onClick={() => setCommunitySwitcherOpen(false)} />
                        <div
                          className="fixed z-[9999] w-[272px] pt-4 pb-2 px-4 animate-[fadeIn_150ms_ease-out]"
                          style={{
                            top: (() => {
                              if (!communitySwitcherTriggerRef.current) return 60;
                              const rect = communitySwitcherTriggerRef.current.getBoundingClientRect();
                              return rect.bottom + 8;
                            })(),
                            left: (() => {
                              if (!communitySwitcherTriggerRef.current) return 12;
                              const rect = communitySwitcherTriggerRef.current.getBoundingClientRect();
                              return rect.left;
                            })(),
                            borderRadius: 'var(--radius-xl)',
                            border: '1px solid var(--color-border-default)',
                            background: 'var(--color-background-primary-default, white)',
                            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.06), 0 1px 4px 0 rgba(0,0,0,0.03), 0 1px 4px 0 rgba(0,0,0,0.03)',
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="border-b border-secondary pb-3">
                            <div className="flex items-center gap-2 py-1">
                              <div className="relative w-9 h-9 shrink-0">
                                <img src={circleLogo} alt="" className="absolute rounded-md opacity-20" style={{ width: 27, height: 27, left: 5, top: 9 }} />
                                <img src="/images/clarity-logo.png" alt="Clarity" className="absolute rounded-md object-cover" style={{ width: 30, height: 30, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
                              </div>
                              <span className="text-sm font-medium text-primary flex-1">Clarity</span>
                              <Icon name="checkmark-small" size="md" style={{ color: 'var(--color-icon-primary)' }} />
                            </div>
                            <div className="flex flex-col gap-0.5 mt-2">
                              <button type="button" onClick={() => { setCommunitySwitcherOpen(false); handleInsetNavClick('settings'); }} className="flex items-center gap-3 h-9 px-2 py-1 rounded-md transition-colors duration-100 w-full text-left hover:bg-secondary">
                                <Icon name="settings-gear" size="md" className="shrink-0" style={{ color: 'var(--color-icon-primary)' }} />
                                <span className="text-sm text-primary">Settings</span>
                              </button>
                              <button type="button" onClick={() => setCommunitySwitcherOpen(false)} className="flex items-center gap-3 h-9 px-2 py-1 rounded-md transition-colors duration-100 w-full text-left hover:bg-secondary">
                                <Icon name="people-add" size="md" className="shrink-0" style={{ color: 'var(--color-icon-primary)' }} />
                                <span className="text-sm text-primary">Add members</span>
                              </button>
                              <button type="button" onClick={() => { setCommunitySwitcherOpen(false); if (onBackToCommunity) (onBackToCommunity as () => void)(); }} className="flex items-center gap-3 h-9 px-2 py-1 rounded-md transition-colors duration-100 w-full text-left hover:bg-secondary">
                                <Icon name={'wrap-left' as IconName} size="md" className="shrink-0" style={{ color: 'var(--color-icon-primary)' }} />
                                <span className="text-sm text-primary">Go back to community</span>
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 py-1 mt-1 cursor-pointer rounded-md hover:bg-secondary px-0 transition-colors duration-100">
                            <div className="relative w-9 h-9 shrink-0">
                              <img src={circleLogo} alt="" className="absolute rounded-md opacity-20" style={{ width: 27, height: 27, left: 5, top: 9 }} />
                              <div className="absolute rounded-md bg-white overflow-hidden" style={{ width: 30, height: 30, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                                <div className="w-full h-full bg-green-100 flex items-center justify-center text-green-800 font-semibold text-xs">E</div>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-primary flex-1">Elevate Community</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
                {/* Top nav items */}
                <div className="flex flex-col gap-0.5">
                  {insetTopLinks.map(link => {
                    const isActive = isInsetSectionActive(link.sectionId);
                    const btn = (
                      <button
                        type="button"
                        onClick={() => handleInsetNavClick(link.sectionId)}
                        className={`flex items-center gap-3 h-9 px-2 py-1 rounded-md transition-colors duration-100 w-full text-left ${
                          isActive ? 'bg-active font-medium' : 'hover:bg-active'
                        }`}
                        aria-label={link.label}
                      >
                        <Icon name={isActive ? link.activeIcon : link.icon} size="md" className="shrink-0" style={{ color: 'var(--color-icon-primary)' }} />
                        <span className={`nav-label ${sidebarSmall ? 'nav-label-hidden' : 'nav-label-visible'} text-sm text-primary truncate ${isActive ? 'font-medium' : ''}`}>{link.label}</span>
                      </button>
                    );
                    return sidebarSmall ? (
                      <Tooltip key={link.id} content={link.label} side="right" sideOffset={8}>{btn}</Tooltip>
                    ) : (
                      <React.Fragment key={link.id}>{btn}</React.Fragment>
                    );
                  })}
                </div>
                {/* Collapsed: dividers + recent chats icon + build icons */}
                {sidebarSmall && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-9 h-px bg-secondary my-2" />
                    <Tooltip content="Recent chats" side="right" sideOffset={8}>
                      <button
                        type="button"
                        onClick={() => setIsRecentChatsOpen(true)}
                        className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-active transition-colors duration-100"
                        aria-label="Recent chats"
                      >
                        <Icon name={'clock-dash' as IconName} size="md" style={{ color: 'var(--color-icon-primary)' }} />
                      </button>
                    </Tooltip>
                    <div className="w-9 h-px bg-secondary my-2" />
                    {buildManageItems.map(item => {
                      const isActive = isBuildItemActive(item);
                      const iconName = (isActive ? item.activeIconName : item.iconName) as IconName;
                      const iconBtn = (
                        <button
                          type="button"
                          className={`flex items-center justify-center h-9 w-9 rounded-md transition-colors duration-100 ${isActive ? 'bg-active' : 'hover:bg-active'}`}
                          aria-label={item.label}
                        >
                          <Icon name={iconName} size="md" style={{ color: 'var(--color-icon-primary)' }} />
                        </button>
                      );
                      if (item.children?.length) {
                        return (
                          <div key={item.id} className="w-full flex justify-center" onMouseEnter={() => openNavMenu(item.id)} onMouseLeave={closeNavMenu}>
                            <NavHoverDropdown
                              entries={[{ type: 'group', label: item.label, items: (item.children ?? []).map(child => ({ label: child.label, onClick: () => navigateAndExpand(child.id) })) }]}
                              trigger={iconBtn}
                              open={openNavMenuId === item.id}
                              onPanelMouseEnter={() => openNavMenu(item.id)}
                              onPanelMouseLeave={closeNavMenu}
                            />
                          </div>
                        );
                      }
                      return (
                        <Tooltip key={item.id} content={item.label} side="right" sideOffset={8}>
                          <button
                            type="button"
                            onClick={() => handleBuildNavClick(item)}
                            onMouseEnter={() => openNavMenu(null)}
                            className={`flex items-center justify-center h-9 w-9 rounded-md transition-colors duration-100 ${isActive ? 'bg-active' : 'hover:bg-active'}`}
                            aria-label={item.label}
                          >
                            <Icon name={iconName} size="md" style={{ color: 'var(--color-icon-primary)' }} />
                          </button>
                        </Tooltip>
                      );
                    })}
                    {/* More — mega menu with all buildShowMoreItems grouped */}
                    {(() => {
                      return (
                        <div className="w-full flex justify-center" onMouseEnter={() => openNavMenu('__more__')} onMouseLeave={closeNavMenu}>
                          <NavHoverDropdown
                            entries={buildShowMoreItems.map(mi =>
                              mi.children?.length
                                ? { type: 'group' as const, label: mi.label, items: mi.children.map(child => ({ label: child.label, onClick: () => navigateAndExpand(child.id) })) }
                                : { type: 'item' as const, label: mi.label, onClick: () => navigateAndExpand(mi.landingId || mi.id) }
                            )}
                            trigger={
                              <button
                                type="button"
                                className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-active transition-colors duration-100"
                                aria-label="More"
                              >
                                <Icon name="dot-menu" size="md" style={{ color: 'var(--color-icon-disabled)' }} />
                              </button>
                            }
                            open={openNavMenuId === '__more__'}
                            onPanelMouseEnter={() => openNavMenu('__more__')}
                            onPanelMouseLeave={closeNavMenu}
                          />
                        </div>
                      );
                    })()}
                  </div>
                )}
                {/* Recent chats + Build — hidden when collapsed */}
                {!sidebarSmall && (
                  <>
                    {/* Recent chats section */}
                    <div className="flex flex-col gap-0.5">
                      <div className="px-2 pt-3 pb-1">
                        <span className="text-xs font-semibold text-tertiary">Recent chats</span>
                      </div>
                      {CHAT_DATA.slice(0, 2).map(chat => {
                        const isGenerating = generatingChatIds.has(chat.id);
                        const hasUnread = unreadChatIds.has(chat.id);
                        return (
                          <button
                            key={chat.id}
                            type="button"
                            onClick={() => {
                              setUnreadChatIds(prev => { const next = new Set(prev); next.delete(chat.id); return next; });
                              if (!(isCopilotOpen && activeCopilotChatId === chat.id)) {
                                setLoadingChatId(chat.id);
                                openCopilot(chat.id, undefined, undefined, true);
                                setTimeout(() => setLoadingChatId(null), 1500);
                              }
                              setScrollToBottomTrigger(t => t + 1);
                            }}
                            className={`flex items-center gap-3 h-9 px-2 py-1 rounded-md transition-colors duration-100 w-full text-left ${isCopilotOpen && activeCopilotChatId === chat.id ? 'bg-active font-medium' : 'hover:bg-active'}`}
                          >
                            {(isGenerating || loadingChatId === chat.id) ? (
                              <svg className="shrink-0 animate-spin" style={{ color: 'var(--color-icon-primary)', width: 16, height: 16 }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <Icon name={'clock' as IconName} size="md" className="shrink-0" style={{ color: 'var(--color-icon-primary)' }} />
                            )}
                            <span className="text-sm text-primary truncate flex-1">{chat.title}</span>
                            {hasUnread && (
                              <span className="shrink-0 w-2 h-2 rounded-full bg-blue-500" />
                            )}
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => setIsRecentChatsOpen(true)}
                        className="flex items-center gap-3 h-9 px-2 py-1 rounded-md transition-colors duration-100 w-full text-left hover:bg-active"
                      >
                        <Icon
                          name={'dot-menu' as IconName}
                          size="md"
                          className="shrink-0 text-disabled"
                          style={{ color: 'var(--color-icon-secondary)' }}
                        />
                        <span className="text-sm text-primary truncate">More</span>
                      </button>
                    </div>
                    {/* Build — accordion items from navDataV2 */}
                    <div className="flex flex-col gap-0.5">
                      <div className="px-2 pt-3 pb-1">
                        <span className="text-xs font-semibold text-tertiary">Build</span>
                      </div>
                      {buildManageItems.map(item => {
                        const isExpanded = expandedBuildL1 === item.id;
                        const isActive = isBuildItemActive(item);
                        const hasChildren = item.children && item.children.length > 0;
                        const iconName = (isActive ? item.activeIconName : item.iconName) as IconName;
                        return (
                          <React.Fragment key={item.id}>
                            <button
                              type="button"
                              onClick={() => handleBuildNavClick(item)}
                              className={`group flex items-center gap-3 h-9 px-2 py-1 rounded-md transition-colors duration-100 w-full text-left ${
                                isActive ? 'bg-active font-semibold text-primary' : 'hover:bg-active text-primary'
                              }`}
                            >
                              <Icon name={iconName} size="md" className="shrink-0 w-5 h-5" style={{ color: 'var(--color-icon-primary)' }} />
                              <span className="text-sm truncate flex-1">{item.label}</span>
                              {hasChildren ? (
                                <Icon name="chevron-down" size="sm" className={`shrink-0 w-4 h-4 text-secondary transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
                              ) : (
                                <Icon name="chevron-right" size="sm" className="shrink-0 w-4 h-4 text-tertiary" />
                              )}
                            </button>
                            {hasChildren && (
                              <div className={`grid transition-[grid-template-rows] duration-150 ease-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                <div className="overflow-hidden">
                                  <div className="flex flex-col gap-0.5 pb-0.5">
                                    {item.children?.map(child => {
                                      const childActive = isBuildChildActive(child.id);
                                      return (
                                        <button key={child.id} type="button" onClick={() => handleBuildChildClick(child.id)} className={`flex items-center gap-3 h-9 px-2 pr-3 py-1 rounded-md transition-colors duration-100 w-full text-left ${childActive ? 'bg-active font-medium text-primary' : 'text-secondary hover:bg-active'}`}>
                                          <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                                            <span className={`w-[5px] h-[5px] rounded-full transition-colors duration-150 ${childActive ? 'bg-[color:var(--color-text-primary)]' : 'bg-[color:var(--color-icon-disabled)]'}`} />
                                          </span>
                                          <span className="text-sm truncate">{child.label}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                      {/* Show more toggle */}
                      <button type="button" onClick={() => setShowMoreBuild(!showMoreBuild)} className="flex items-center gap-3 h-9 px-2 py-1 rounded-md hover:bg-active transition-colors duration-100 w-full text-left text-disabled">
                        <Icon name="dot-menu" size="md" className="shrink-0 w-5 h-5" />
                        <span className="text-sm flex-1 text-primary">More</span>
                        <Icon name="chevron-down" size="sm" className={`shrink-0 w-4 h-4 transition-transform duration-200 ${showMoreBuild ? 'rotate-0' : '-rotate-90'}`} />
                      </button>
                      <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${showMoreBuild ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                        <div className="overflow-hidden">
                          <div className="flex flex-col gap-0.5">
                            {buildShowMoreItems.map(item => {
                              const isExpanded = expandedBuildL1 === item.id;
                              const isActive = isBuildItemActive(item);
                              const hasChildren = item.children && item.children.length > 0;
                              const iconName = (isActive ? item.activeIconName : item.iconName) as IconName;
                              return (
                                <React.Fragment key={item.id}>
                                  <button type="button" onClick={() => handleBuildNavClick(item)} className={`group flex items-center gap-3 h-9 px-2 py-1 rounded-md transition-colors duration-100 w-full text-left ${isActive ? 'bg-active font-semibold text-primary' : 'hover:bg-active text-primary'}`}>
                                    <Icon name={iconName} size="md" className="shrink-0 w-5 h-5" style={{ color: 'var(--color-icon-primary)' }} />
                                    <span className="text-sm truncate flex-1">{item.label}</span>
                                    {hasChildren && (
                                      <Icon name="chevron-down" size="sm" className={`shrink-0 w-4 h-4 text-secondary transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
                                    )}
                                  </button>
                                  {hasChildren && (
                                    <div className={`grid transition-[grid-template-rows] duration-150 ease-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                      <div className="overflow-hidden">
                                        <div className="flex flex-col gap-0.5 pb-0.5">
                                          {item.children?.map(child => {
                                            const childActive = isBuildChildActive(child.id);
                                            return (
                                              <button key={child.id} type="button" onClick={() => handleBuildChildClick(child.id)} className={`flex items-center gap-3 h-9 px-2 pr-3 py-1 rounded-md transition-colors duration-100 w-full text-left ${childActive ? 'bg-active font-medium text-primary' : 'text-secondary hover:bg-active'}`}>
                                                <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                                                  <span className={`w-[5px] h-[5px] rounded-full transition-colors duration-150 ${childActive ? 'bg-[color:var(--color-text-primary)]' : 'bg-[color:var(--color-icon-disabled)]'}`} />
                                                </span>
                                                <span className="text-sm truncate">{child.label}</span>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {/* Bottom nav — Avatar + Collapse sidebar */}
              {sidebarSmall ? (
                <div className="flex flex-col gap-0 shrink-0 items-center">
                  <Tooltip content="Expand sidebar" side="right" sideOffset={8}>
                    <button
                      type="button"
                      onClick={toggleSidebar}
                      className="flex items-center justify-center h-9 w-9 rounded-md transition-colors duration-100 hover:bg-active"
                      aria-label="Expand sidebar"
                    >
                      <Icon name={'layout-left' as IconName} size="md" className="shrink-0" style={{ color: 'var(--color-icon-disabled)' }} />
                    </button>
                  </Tooltip>
                  <AvatarDropdown
                    trigger={
                      <button type="button" className="flex items-center justify-center h-9 w-9 rounded-md transition-colors duration-100 hover:bg-active" aria-label="Profile menu">
                        <Avatar src="/images/avatars/1.png" name="Rudy" size="xs" className="shrink-0" />
                      </button>
                    }
                    triggerClassName=""
                    menuSide="right"
                    menuAlign="end"
                  />
                </div>
              ) : (
                <div className="flex items-center shrink-0">
                  <AvatarDropdown
                    trigger={
                      <button type="button" className="flex items-center gap-3 h-9 px-2 py-1 rounded-md transition-colors duration-100 flex-1 text-left hover:bg-active min-w-0" aria-label="Profile menu">
                        <Avatar src="/images/avatars/1.png" name="Michal" size="xs" className="shrink-0" />
                        <span className="text-sm text-primary truncate">Rudy</span>
                      </button>
                    }
                    triggerClassName="flex-1 min-w-0"
                    menuSide="right"
                    menuAlign="end"
                  />
                  <button
                    type="button"
                    onClick={toggleSidebar}
                    className="flex items-center justify-center h-9 w-9 rounded-md transition-colors duration-100 shrink-0 hover:bg-active"
                    aria-label="Collapse sidebar"
                  >
                    <Icon name={'layout-left' as IconName} size="md" className="shrink-0" style={{ color: 'var(--color-icon-disabled)' }} />
                  </button>
                </div>
              )}
            </div>

          </div>,
          adminOuterPortal
        )}

        {/* Portal: copilot rendered between nav and content card */}
        {copilotPortal && createPortal(
          <div className="h-full w-full overflow-hidden">
            {launchConvoState ? (
              /* Onboarding conversation in building mode — full copilot shell */
              <div className="h-full w-full overflow-hidden bg-primary border-l border-primary shadow-2xs flex flex-col">
                {/* Header — matches CopilotView header */}
                <div className="shrink-0 px-5 py-3 flex items-center gap-2">
                  <div className="flex-1 min-w-0 overflow-hidden" onClick={(e) => {
                    const anchor = (e.target as HTMLElement).closest('a');
                    if (anchor) {
                      e.preventDefault();
                      setLaunchConvoState(null);
                      setLaunchProjectData(null);
                      closeCopilot();
                      if (onItemClick) onItemClick('projects');
                    }
                  }}>
                    <BreadCrumbs
                      size="sm"
                      items={[{ label: 'Projects', href: '#' }, { label: 'Launch your community' }]}
                      className="copilot-breadcrumb flex-1 min-w-0 overflow-hidden"
                    />
                  </div>
                  <Menu
                    options={[
                      { label: 'Delete conversation', icon: 'trash-can', onClick: () => { /* noop */ }, danger: true },
                    ]}
                    trigger={<IconButton type="button" variant="ghost" size="sm" icon="dot-menu" aria-label="More options" className="shrink-0" />}
                    side="bottom" align="end" sideOffset={4}
                  />
                  <IconButton type="button" variant="ghost" size="sm" icon="expand" aria-label="Maximize"
                    onClick={() => { setIsCopilotMaximized(true); }} className="shrink-0" />
                  <IconButton type="button" variant="ghost" size="sm" icon="arrow-wall-left" aria-label="Collapse"
                    onClick={() => { setLaunchConvoState(null); setLaunchProjectData(null); closeCopilot(); }} className="shrink-0" />
                </div>
                {/* Conversation body */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <NewCommunityFlow
                    onSkipToChat={() => { /* noop */ }}
                    onCreateProject={() => { /* noop */ }}
                    isBuilding={!launchBuildingDone}
                    initialSelectedType={launchConvoState.typeId}
                    initialAnswers={launchConvoState.answers}
                  />
                </div>
                {/* Message input */}
                <div className="shrink-0 px-4 pt-4 pb-4">
                  <AgentMessageBox placeholder="Message Circle AI..." onSubmit={() => { /* noop */ }} />
                </div>
              </div>
            ) : (
              <div className={`h-full w-full overflow-y-auto bg-primary border-l border-primary shadow-2xs ${!isCopilotOpen ? 'hidden' : ''}`}>
                <CopilotView {...copilotViewProps} />
              </div>
            )}
          </div>,
          copilotPortal
        )}

        {/* Main content + right panels (inside the card) */}
        <div className="relative flex flex-1 bg-primary min-h-0 overflow-hidden">
          {launchProjectData ? (
            /* Launch project in the content card */
            <LaunchProjectView
              project={launchProjectData}
              shimmerProgress={projectCardShimmer}
              onBack={() => {
                setLaunchProjectData(null);
                if (onItemClick) onItemClick('projects');
              }}
              onOpenThread={(thread) => {
                // Open copilot full-screen with the thread title as initial message
                openCopilot(undefined, thread.title);
              }}
              onNewConversation={() => {
                openCopilot('new');
              }}
            />
          ) : copilotArtifact ? (
            /* Artifact replaces page content when open from conversation */
            copilotArtifact.type === 'event' ? (
              <div className="h-full w-[960px] max-w-full ml-auto flex flex-col animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                <EventDetailPanel onClose={closeArtifact} onSeeAllEvents={handleSeeAllEvents} />
              </div>
            ) : copilotArtifact.type === 'course' ? (
              <div className="h-full w-[960px] max-w-full ml-auto flex flex-col animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                <CourseDetailPanel onClose={closeArtifact} />
              </div>
            ) : copilotArtifact.type === 'page' ? (
              <LandingPageArtifact
                onOpenBuilder={() => {
                  closeArtifact();
                  setBuilderTrigger(prev => prev + 1);
                }}
                onClose={closeArtifact}
              />
            ) : copilotArtifact.type === 'build-frame' ? (
              <div className="h-full w-full flex flex-col border-l border-secondary animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                {/* Header */}
                <div className="shrink-0 flex items-center justify-between px-5 py-3 border-b border-secondary">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon name="settings-gear" size="sm" className="text-tertiary shrink-0" />
                    <Typography variant="label-sm" color="primary" className="font-medium truncate">
                      {copilotArtifact.title}
                    </Typography>
                    <div className="px-1.5 py-0.5 rounded bg-secondary ml-1 shrink-0">
                      <Typography variant="caption" color="tertiary">Draft</Typography>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button type="button" variant="outline" size="sm">Save</Button>
                    <IconButton type="button" variant="ghost" size="sm" icon="cross" aria-label="Close" onClick={closeArtifact} />
                  </div>
                </div>
                {/* Empty frame area */}
                <div className="flex-1 min-h-0 bg-secondary flex flex-col items-center justify-start pt-10 overflow-auto">
                  <div
                    className="w-[90%] bg-primary rounded-xl overflow-hidden"
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.12)' }}
                  >
                    {/* Browser title bar */}
                    <div className="flex items-center gap-3 px-4 py-2.5" style={{ background: '#f2f2f4', borderBottom: '1px solid #e0e0e2' }}>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
                      </div>
                      <div className="flex-1 mx-4 flex items-center px-3 py-1.5 rounded-md text-xs" style={{ background: 'white', border: '1px solid #e0e0e2', color: '#6b7280', justifyContent: 'center' }}>
                        clarity.community
                      </div>
                    </div>
                    {/* Empty frame body */}
                    <div className="h-[480px] flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                          <Icon name="settings-gear" size="md" className="text-tertiary" />
                        </div>
                        <Typography variant="label-sm" color="tertiary">Your configuration will appear here</Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full w-[568px] flex flex-col ml-auto">
                <div className="shrink-0 flex items-center justify-between px-5 py-3">
                  <Typography variant="heading-sm" color="primary">
                    <span className="font-semibold">{copilotArtifact.title}</span>
                  </Typography>
                  <div className="flex items-center gap-1">
                    <Button type="button" variant="secondary" size="sm" onClick={viewInAnalytics}>View in analytics</Button>
                    <IconButton type="button" variant="ghost" size="sm" icon="cross" aria-label="Close" onClick={closeArtifact} />
                  </div>
                </div>
                <div className="flex-1 min-h-0 overflow-auto">
                  <AssetDetailSidebar
                    asset={copilotArtifact}
                    onClose={closeArtifact}
                    onViewInAnalytics={viewInAnalytics}
                    hideHeader
                  />
                </div>
              </div>
            )
          ) : (
            <>
              {mainContent}
              {rightPanels}
            </>
          )}
        </div>
      </div>
    );
  }

  /* ── DEFAULT MODE: classic layout (sidebar inside content area) ── */
  return (
    <div className="h-full bg-secondary flex flex-col overflow-hidden">
      {/* Hero transition: flying input from dashboard to conversation */}
      {flyingPhase !== 'idle' && flyingSource && flyingTarget && (
        <FlyingInput
          message={flyingMessage}
          sourceRect={flyingSource}
          targetRect={flyingTarget}
          fading={flyingPhase === 'fading'}
        />
      )}
      <div
        className="relative flex flex-1 bg-primary min-h-0 overflow-hidden"
      >
        {viewMode === 'Admin' && (
          <div
            className="shrink-0 h-full flex transition-[width] duration-300"
            style={{ width: isNavCollapsed || isSidebarCollapsed ? 86 : 288, transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <SidebarV2 {...sidebarV2Props} />
          </div>
        )}
        <main className="flex-1 overflow-hidden min-h-0 shrink-0 relative">
          {/* Page content (Dashboard, Library, etc.) */}
          <div
            className={`absolute inset-0 transition-opacity ${
              isContentTransitioning || isRouteEntering
                ? 'opacity-0'
                : 'opacity-100'
            }`}
            style={{
              transitionDuration: isContentTransitioning ? '90ms' : '350ms',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {activeAgent ? (
              <AgentDetailView
                agent={activeAgent}
                onBack={() => setActiveAgent(null)}
              />
            ) : (
              renderContent()
            )}
          </div>
          {/* CopilotView overlay — always mounted to preserve state during generation */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              isCopilotOpen
                ? (copilotLeaving ? 'opacity-0' : 'opacity-100')
                : 'opacity-0 pointer-events-none'
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <CopilotView {...copilotViewProps} />
          </div>
        </main>
        {rightPanels}
      </div>

    </div>
  );
};

export default AdminSection;
