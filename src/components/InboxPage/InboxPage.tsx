import React, { useState, useRef, useEffect } from 'react';
import InboxV1 from './v1/InboxV1';
import InboxV1_5 from './v1.5/InboxV1_5';
import InboxSidebar from './InboxSidebar';
import TodayView from './TodayView';
import DMThreadList from './DMThreadList';
import DMCenterPanel from './DMCenterPanel';
import ModerationThreadList from './ModerationThreadList';
import ModerationCenterPanel from './ModerationCenterPanel';
import CourseCommentsThreadList from './CourseCommentsThreadList';
import CourseCommentsCenterPanel from './CourseCommentsCenterPanel';
import AIInboxThreadList from './AIInboxThreadList';
import AIInboxCenterPanel from './AIInboxCenterPanel';
import ConnectionsThreadList from './ConnectionsThreadList';
import PersonProfilePanel from './PersonProfilePanel';
import type { InboxSyncCommand } from '../CopilotView/InboxSession/inboxScenarioData';
import { Typography } from '@circleco/compass/components/Typography';

type Tab = 'today' | 'dms' | 'moderation' | 'course-comments' | 'connections' | 'ai-inbox';

const MIN_PANEL_WIDTH = 160;
const MAX_PANEL_WIDTH = 440;

const INITIAL_TAB_COUNTS: Partial<Record<Tab, number>> = {
  dms: 12,
  moderation: 6,
  'course-comments': 3,
  connections: 3,
  'ai-inbox': 3,
};

const InboxPage: React.FC = () => {
  const [prototypeVersion, setPrototypeVersion] = useState<'v1' | 'v1.5' | 'v2'>('v1');
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [dmSelectedId, setDmSelectedId] = useState('james-liu');
  const [modSelectedId, setModSelectedId] = useState('cp');
  const [ccSelectedId, setCcSelectedId] = useState('1');
  const [connSelectedId, setConnSelectedId] = useState('c1');
  const [aiSelectedId, setAiSelectedId] = useState('1');
  const [panelWidth, setPanelWidth] = useState(364);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [tabCounts, setTabCounts] = useState<Partial<Record<Tab, number>>>(INITIAL_TAB_COUNTS);
  const [hiddenModIds, setHiddenModIds] = useState<string[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [sentReplies, setSentReplies] = useState<Record<string, string>>({});
  const [composerDraft, setComposerDraft] = useState<{ text: string; recipientName: string } | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const activeTabRef = useRef<Tab>(activeTab);
  activeTabRef.current = activeTab;

  // Listen for inbox-sync events from CopilotView
  useEffect(() => {
    const syncHandler = (e: Event) => {
      const sync = (e as CustomEvent).detail as InboxSyncCommand;
      if (sync.activeTab) setActiveTab(sync.activeTab);
      if (sync.selectedThread !== undefined) {
        if (sync.selectedThread) {
          const tab = sync.activeTab ?? activeTabRef.current;
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
          setTabCounts(tc => ({ ...tc, dms: 12 - next.size }));
          return next;
        });
      }
      if (sync.badgeUpdates) {
        setTabCounts(prev => ({ ...prev, ...sync.badgeUpdates } as Partial<Record<Tab, number>>));
        if (sync.badgeUpdates.moderation !== undefined) {
          setHiddenModIds(['maria-santos']);
        }
      }
      if (sync.composerDraft !== undefined) setComposerDraft(sync.composerDraft);
    };

    // Listen for sent messages from BatchCardList
    const sentHandler = (e: Event) => {
      const { threadId, replyText } = (e as CustomEvent).detail as { threadId: string; replyText: string };
      setSentReplies(prev => ({ ...prev, [threadId]: replyText }));
      setReadIds(prev => {
        const next = new Set(Array.from(prev));
        next.add(threadId);
        setTabCounts(tc => ({ ...tc, dms: 12 - next.size }));
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

  return (
    <div className="h-full flex min-h-0 bg-primary">
      <InboxSidebar activeTab={activeTab} onTabChange={t => setActiveTab(t as Tab)} onVersionChange={setPrototypeVersion} />
      <div className="flex flex-1 min-h-0 relative overflow-hidden">
        {activeTab === 'today' && (
          <TodayView />
        )}
        {activeTab === 'dms' && (
          <>
            {wrapThreadPanel(
              <DMThreadList
                selectedId={dmSelectedId}
                onSelect={setDmSelectedId}
                readIds={readIds}
                sentReplies={sentReplies}
                onRead={(id) => setReadIds(prev => {
                  const next = new Set(Array.from(prev));
                  next.add(id);
                  setTabCounts(tc => ({ ...tc, dms: 12 - next.size }));
                  return next;
                })}
              />
            )}
            <DMCenterPanel
              selectedId={dmSelectedId}
              onOpenProfile={setProfileName}
              sentReply={sentReplies[dmSelectedId]}
              composerDraft={composerDraft}
              onSendReply={(threadId, text) => {
                setSentReplies(prev => ({ ...prev, [threadId]: text }));
                setReadIds(prev => {
                  const next = new Set(Array.from(prev));
                  next.add(threadId);
                  setTabCounts(tc => ({ ...tc, dms: 12 - next.size }));
                  return next;
                });
                setComposerDraft(null);
                window.dispatchEvent(new CustomEvent('inbox-reply-sent', { detail: { threadId } }));
                window.dispatchEvent(new CustomEvent('inbox-message-sent', { detail: { threadId, replyText: text } }));
              }}
            />
          </>
        )}
        {activeTab === 'moderation' && (
          <>
            {wrapThreadPanel(<ModerationThreadList selectedId={modSelectedId} onSelect={setModSelectedId} hiddenIds={hiddenModIds} />)}
            <ModerationCenterPanel selectedId={modSelectedId} onOpenProfile={setProfileName} />
          </>
        )}
        {activeTab === 'course-comments' && (
          <>
            {wrapThreadPanel(<CourseCommentsThreadList selectedId={ccSelectedId} onSelect={setCcSelectedId} />)}
            <CourseCommentsCenterPanel selectedId={ccSelectedId} onOpenProfile={setProfileName} />
          </>
        )}
        {activeTab === 'connections' && (
          <>
            {wrapThreadPanel(<ConnectionsThreadList selectedId={connSelectedId} onSelect={setConnSelectedId} />)}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Typography variant="heading-sm" color="tertiary">Connection details</Typography>
                <Typography variant="body-sm" color="tertiary" className="mt-1">Coming soon</Typography>
              </div>
            </div>
          </>
        )}
        {activeTab === 'ai-inbox' && (
          <>
            {wrapThreadPanel(<AIInboxThreadList selectedId={aiSelectedId} onSelect={setAiSelectedId} />)}
            <AIInboxCenterPanel selectedId={aiSelectedId} onOpenProfile={setProfileName} />
          </>
        )}
        <PersonProfilePanel name={profileName} onClose={() => setProfileName(null)} />
      </div>
    </div>
  );
};

export default InboxPage;
