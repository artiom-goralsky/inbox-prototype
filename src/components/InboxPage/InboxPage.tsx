import React, { useState, useRef, useEffect, useCallback } from 'react';
import InboxV1 from './v1/InboxV1';
import InboxV1_5 from './v1.5/InboxV1_5';
import InboxSidebar from './InboxSidebar';
import ModerationThreadList from './ModerationThreadList';
import ModerationCenterPanel from './ModerationCenterPanel';
import { Typography } from '@circleco/compass/components/Typography';
import { Icon } from '@circleco/compass/components/Icon';
import ThreadListV1 from './v1/ThreadListV1';
import DMCenterPanelV1 from './v1/DMCenterPanelV1';
import CourseCommentsCenterPanelV1 from './v1/CourseCommentsCenterPanelV1';
import AIInboxCenterPanelV1 from './v1/AIInboxCenterPanelV1';
import NewMessagePanelV1 from './v1/NewMessagePanelV1';
import ProfilePanelV1 from './v1/ProfilePanelV1';
import ModerationSettingsModal from './v1/ModerationSettingsModal';
import ChatThreadsListV1_5 from './v1.5/ChatThreadsListV1_5';
import ChatThreadsCenterPanelV1_5 from './v1.5/ChatThreadsCenterPanelV1_5';
import ConnectionRequestsListV1_5 from './v1.5/ConnectionRequestsListV1_5';
import ConnectionRequestCenterPanelV1_5 from './v1.5/ConnectionRequestCenterPanelV1_5';
import { CONNECTION_REQUEST_ITEMS, type ConnectionRequestItem } from './v1.5/v1_5MockData';
import { DM_THREADS, getProfileData, type V1Category, type ProfileData, type V1ThreadItem } from './v1/v1MockData';
import AllViewThreadList from './AllViewThreadList';
import { ALL_VIEW_ITEMS, ITEM_CENTER_MAP, type AllViewItem } from './allViewMockData';
import type { InboxSyncCommand } from '../CopilotView/InboxSession/inboxScenarioData';

type Tab = 'all' | 'dms' | 'chat-threads' | 'connection-requests' | 'moderation' | 'course-comments' | 'ai-inbox';

const MIN_PANEL_WIDTH = 160;
const MAX_PANEL_WIDTH = 440;

const InboxPage: React.FC = () => {
  const [prototypeVersion, setPrototypeVersion] = useState<'v1' | 'v1.5' | 'v2'>('v1');
  const [activeTab, setActiveTab] = useState<Tab>('all');

  // Selected IDs per category
  const [dmSelectedId, setDmSelectedId] = useState('dm-3');
  const [modSelectedId, setModSelectedId] = useState('cp');
  const [ccSelectedId, setCcSelectedId] = useState('1');
  const [aiSelectedId, setAiSelectedId] = useState('1');
  const [chatThreadSelectedId, setChatThreadSelectedId] = useState('ct-1');
  const [connReqSelectedId, setConnReqSelectedId] = useState('cr-1');
  const [allSelectedId, setAllSelectedId] = useState('all-dm-1');
  const [allItems, setAllItems] = useState<AllViewItem[]>(() => [...ALL_VIEW_ITEMS]);

  const [panelWidth, setPanelWidth] = useState(364);
  const [hiddenModIds, setHiddenModIds] = useState<string[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [sentReplies, setSentReplies] = useState<Record<string, string>>({});

  // Profile drawer (v1 style)
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  // New message mode
  const [showNewMessage, setShowNewMessage] = useState(false);

  // Moderation settings
  const [showModSettings, setShowModSettings] = useState(false);

  // Connection requests local state
  const [connectionItems, setConnectionItems] = useState<ConnectionRequestItem[]>(() => [...CONNECTION_REQUEST_ITEMS]);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const activeTabRef = useRef<Tab>(activeTab);
  activeTabRef.current = activeTab;

  // Listen for inbox-sync events from CopilotView
  useEffect(() => {
    const syncHandler = (e: Event) => {
      const sync = (e as CustomEvent).detail as InboxSyncCommand;
      if (sync.activeTab) setActiveTab(sync.activeTab as Tab);
      if (sync.selectedThread !== undefined) {
        if (sync.selectedThread) {
          const tab = (sync.activeTab ?? activeTabRef.current) as Tab;
          if (tab === 'dms')             setDmSelectedId(sync.selectedThread);
          if (tab === 'moderation')      setModSelectedId(sync.selectedThread);
          if (tab === 'ai-inbox')        setAiSelectedId(sync.selectedThread);
          if (tab === 'course-comments') setCcSelectedId(sync.selectedThread);
        }
      }
      if (sync.markRead) {
        setReadIds(prev => {
          const next = new Set(Array.from(prev));
          next.add(sync.markRead!);
          return next;
        });
      }
      if (sync.badgeUpdates) {
        if (sync.badgeUpdates.moderation !== undefined) {
          setHiddenModIds(['maria-santos']);
        }
      }
    };

    const sentHandler = (e: Event) => {
      const { threadId, replyText } = (e as CustomEvent).detail as { threadId: string; replyText: string };
      setSentReplies(prev => ({ ...prev, [threadId]: replyText }));
      setReadIds(prev => {
        const next = new Set(Array.from(prev));
        next.add(threadId);
        return next;
      });
    };

    window.addEventListener('inbox-sync', syncHandler);
    window.addEventListener('inbox-message-sent', sentHandler);
    return () => {
      window.removeEventListener('inbox-sync', syncHandler);
      window.removeEventListener('inbox-message-sent', sentHandler);
    };
  }, []);

  // Close profile when drawer-open fires
  useEffect(() => {
    const handler = () => setShowProfile(false);
    window.addEventListener('drawer-open', handler);
    return () => window.removeEventListener('drawer-open', handler);
  }, []);

  const handleProfileOpen = (name: string) => {
    window.dispatchEvent(new CustomEvent('drawer-open'));
    setProfileData(getProfileData(name));
    setShowProfile(true);
  };

  const handleConnectionAction = useCallback((id: string, _action: 'accept' | 'ignore' | 'block') => {
    setConnectionItems(prev => {
      const next = prev.filter(item => item.id !== id);
      if (next.length > 0) {
        const currentIdx = prev.findIndex(item => item.id === id);
        const nextItem = next[Math.min(currentIdx, next.length - 1)];
        setConnReqSelectedId(nextItem.id);
      } else {
        setConnReqSelectedId('');
      }
      return next;
    });
  }, []);

  const handleAllResolve = useCallback((itemId: string) => {
    setAllItems(prev => {
      const next = prev.map(item =>
        item.id === itemId ? { ...item, resolvedAt: Date.now() } : item
      );
      const unresolvedItems = next.filter(i => !i.resolvedAt);
      if (unresolvedItems.length > 0) {
        const currentIdx = prev.findIndex(i => i.id === itemId);
        const nextUnresolved = unresolvedItems.find((_, idx) => idx >= currentIdx) ?? unresolvedItems[0];
        setAllSelectedId(nextUnresolved.id);
      } else {
        setAllSelectedId('');
      }
      return next;
    });
  }, []);

  // When a moderation item is reviewed, resolve the matching all-view item
  useEffect(() => {
    const handler = (e: Event) => {
      const { id } = (e as CustomEvent).detail as { id: string };
      const allViewItemId = Object.entries(ITEM_CENTER_MAP).find(
        ([, mapping]) => mapping.tab === 'moderation' && mapping.selectedId === id
      )?.[0];
      if (allViewItemId) {
        handleAllResolve(allViewItemId);
      }
    };
    window.addEventListener('moderation-reviewed', handler);
    return () => window.removeEventListener('moderation-reviewed', handler);
  }, [handleAllResolve]);

  const handleNewMessageSend = useCallback((recipients: string[], message: string) => {
    const newId = `dm-new-${Date.now()}`;
    const newThread: V1ThreadItem = {
      id: newId,
      name: recipients.join(', '),
      preview: message,
      time: 'Just now',
      unread: false,
    };
    DM_THREADS.unshift(newThread);
    setShowNewMessage(false);
    setDmSelectedId(newId);
  }, []);

  const handleDmSelect = (id: string) => {
    setDmSelectedId(id);
    setShowNewMessage(false);
  };

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = panelWidth;

    const onMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startX.current;
      const next = Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, startWidth.current + delta));
      setPanelWidth(next);
    };

    const onUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const wrapThreadPanel = (children: React.ReactNode) => (
    <div style={{ width: panelWidth }} className="shrink-0 h-full relative overflow-visible">
      {children}
      <div
        className="absolute inset-y-0 -right-[4px] w-[8px] cursor-col-resize z-20 group"
        onMouseDown={handleDragStart}
      >
        <div className="absolute inset-y-0 left-[3px] w-[2px] group-hover:bg-info/40 transition-colors rounded-full" />
      </div>
    </div>
  );

  if (prototypeVersion === 'v1') {
    return <InboxV1 onVersionChange={setPrototypeVersion} />;
  }

  if (prototypeVersion === 'v1.5') {
    return <InboxV1_5 onVersionChange={setPrototypeVersion} />;
  }

  // Determine which v1 category maps to active tab for ThreadListV1
  const isV1ThreadCategory = (tab: Tab): tab is V1Category =>
    tab === 'dms' || tab === 'course-comments' || tab === 'ai-inbox';

  const getSelectedId = (): string => {
    switch (activeTab) {
      case 'all': return allSelectedId;
      case 'dms': return dmSelectedId;
      case 'moderation': return modSelectedId;
      case 'course-comments': return ccSelectedId;
      case 'ai-inbox': return aiSelectedId;
      case 'chat-threads': return chatThreadSelectedId;
      case 'connection-requests': return connReqSelectedId;
    }
  };

  const getOnSelect = (): ((id: string) => void) => {
    switch (activeTab) {
      case 'all': return setAllSelectedId;
      case 'dms': return handleDmSelect;
      case 'moderation': return setModSelectedId;
      case 'course-comments': return setCcSelectedId;
      case 'ai-inbox': return setAiSelectedId;
      case 'chat-threads': return setChatThreadSelectedId;
      case 'connection-requests': return setConnReqSelectedId;
    }
  };

  // Get the center panel mapping for the currently selected All-view item
  const allSelectedItem = allItems.find(i => i.id === allSelectedId);
  const allCenterMapping = allSelectedId ? ITEM_CENTER_MAP[allSelectedId] : null;

  const renderThreadList = () => {
    switch (activeTab) {
      case 'all':
        return (
          <AllViewThreadList
            items={allItems}
            selectedId={allSelectedId}
            onSelect={setAllSelectedId}
          />
        );
      case 'dms':
      case 'course-comments':
      case 'ai-inbox':
        return (
          <ThreadListV1
            category={activeTab}
            selectedId={getSelectedId()}
            onSelect={getOnSelect()}
            onSettingsOpen={() => setShowModSettings(true)}
            onNewMessage={activeTab === 'dms' ? () => setShowNewMessage(true) : undefined}
            showSortSelect
          />
        );
      case 'moderation':
        return (
          <ModerationThreadList
            selectedId={modSelectedId}
            onSelect={setModSelectedId}
            showSortSelect
            hiddenIds={hiddenModIds}
          />
        );
      case 'chat-threads':
        return (
          <ChatThreadsListV1_5
            selectedId={chatThreadSelectedId}
            onSelect={setChatThreadSelectedId}
          />
        );
      case 'connection-requests':
        return (
          <ConnectionRequestsListV1_5
            items={connectionItems}
            selectedId={connReqSelectedId}
            onSelect={setConnReqSelectedId}
          />
        );
    }
  };

  const renderCenterPanel = () => {
    if (showNewMessage && activeTab === 'dms') {
      return <NewMessagePanelV1 onSend={handleNewMessageSend} />;
    }

    // All view — route to the correct center panel based on selected item type
    if (activeTab === 'all' && allSelectedItem && allCenterMapping) {
      switch (allSelectedItem.type) {
        case 'dm':
          return <DMCenterPanelV1 selectedId={allCenterMapping.selectedId} onProfileOpen={handleProfileOpen} showAiAssist />;
        case 'chatThread':
          return <ChatThreadsCenterPanelV1_5 selectedId={allCenterMapping.selectedId} onProfileOpen={handleProfileOpen} showAiAssist />;
        case 'connectionRequest':
          return (
            <ConnectionRequestCenterPanelV1_5
              selectedId={allCenterMapping.selectedId}
              onAccept={() => handleAllResolve(allSelectedId)}
              onIgnore={() => handleAllResolve(allSelectedId)}
              onBlock={() => handleAllResolve(allSelectedId)}
              onProfileOpen={handleProfileOpen}
            />
          );
        case 'moderation':
          return <ModerationCenterPanel selectedId={allCenterMapping.selectedId} onOpenProfile={handleProfileOpen} />;
        case 'courseComment':
          return <CourseCommentsCenterPanelV1 selectedId={allCenterMapping.selectedId} onProfileOpen={handleProfileOpen} showAiAssist />;
        case 'aiInbox':
          return <AIInboxCenterPanelV1 selectedId={allCenterMapping.selectedId} onProfileOpen={handleProfileOpen} showAiAssist />;
      }
    }

    if (activeTab === 'all') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-primary gap-3">
          <Icon name="circle-check" size="lg" color="tertiary" />
          <div className="text-center">
            <Typography variant="heading-sm" color="tertiary">You're all caught up</Typography>
            <Typography variant="body-sm" color="tertiary" className="mt-1">No items need your attention right now</Typography>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dms':
        return <DMCenterPanelV1 selectedId={dmSelectedId} onProfileOpen={handleProfileOpen} showAiAssist />;
      case 'moderation':
        return <ModerationCenterPanel selectedId={modSelectedId} onOpenProfile={handleProfileOpen} />;
      case 'course-comments':
        return <CourseCommentsCenterPanelV1 selectedId={ccSelectedId} onProfileOpen={handleProfileOpen} showAiAssist />;
      case 'ai-inbox':
        return <AIInboxCenterPanelV1 selectedId={aiSelectedId} onProfileOpen={handleProfileOpen} showAiAssist />;
      case 'chat-threads':
        return <ChatThreadsCenterPanelV1_5 selectedId={chatThreadSelectedId} onProfileOpen={handleProfileOpen} showAiAssist />;
      case 'connection-requests':
        return (
          <ConnectionRequestCenterPanelV1_5
            selectedId={connReqSelectedId}
            onAccept={id => handleConnectionAction(id, 'accept')}
            onIgnore={id => handleConnectionAction(id, 'ignore')}
            onBlock={id => handleConnectionAction(id, 'block')}
            onProfileOpen={handleProfileOpen}
          />
        );
    }
  };

  return (
    <div className="h-full flex min-h-0 bg-primary">
      <InboxSidebar
        activeTab={activeTab}
        onTabChange={t => { setActiveTab(t as Tab); setShowNewMessage(false); setShowProfile(false); }}
        onVersionChange={setPrototypeVersion}
      />
      <div className="flex flex-1 min-h-0 relative overflow-hidden">
        {wrapThreadPanel(renderThreadList())}
        {renderCenterPanel()}
        {showProfile && profileData && (
          <ProfilePanelV1 data={profileData} onClose={() => setShowProfile(false)} />
        )}
      </div>
      <ModerationSettingsModal open={showModSettings} onOpenChange={setShowModSettings} />
    </div>
  );
};

export default InboxPage;
