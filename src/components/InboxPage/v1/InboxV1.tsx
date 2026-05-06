import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import CategoryPanelV1 from './CategoryPanelV1';
import ThreadListV1 from './ThreadListV1';
import CenterPanelV1 from './CenterPanelV1';
import NewMessagePanelV1 from './NewMessagePanelV1';
import ProfilePanelV1 from './ProfilePanelV1';
import ModerationSettingsModal from './ModerationSettingsModal';
import SupportCategory from './SupportCategory/SupportCategory';
import { mockSupportThreads, type SupportNewVariant, type SupportPrefill } from './SupportCategory/data/supportThreads';
import { getFirstThreadId, getProfileData, DM_THREADS, type V1Category, type ProfileData, type V1ThreadItem } from './v1MockData';

type V1CategoryOrSupport = V1Category | 'support';

const MIN_PANEL_WIDTH = 160;
const MAX_PANEL_WIDTH = 440;

interface InboxV1Props {
  onVersionChange: (version: 'v1' | 'v1.5' | 'v2') => void;
}

const InboxV1: React.FC<InboxV1Props> = ({ onVersionChange }) => {
  const [activeCategory, setActiveCategory] = useState<V1CategoryOrSupport>('dms');
  const [selectedThreadId, setSelectedThreadId] = useState<string>('dm-3');
  const [panelWidth, setPanelWidth] = useState(364);

  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [showModSettings, setShowModSettings] = useState(false);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [supportPrefill, setSupportPrefill] = useState<SupportPrefill | null>(null);
  const [supportVariant, setSupportVariant] = useState<SupportNewVariant | null>(null);
  const [supportSelectedThreadId, setSupportSelectedThreadId] = useState<string | null>(null);

  // Support badge: count of new_reply threads in initial mock (no live mutation feedback to nav,
  // matches spec — count is read once for visual cue).
  const supportBadgeCount = useMemo(
    () => mockSupportThreads.filter(t => t.state === 'new_reply').length,
    [],
  );

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(364);

  const handleCategoryChange = (category: V1Category) => {
    setActiveCategory(category);
    setSelectedThreadId(getFirstThreadId(category));
    setShowProfile(false);
    setShowNewMessage(false);
  };

  const handleSupportClick = useCallback(() => {
    setActiveCategory('support');
    setShowProfile(false);
    setShowNewMessage(false);
  }, []);

  // Listen for an external 'open-support' event so other surfaces (e.g. the Copilot
  // QueueCard) can route into Support. Detail shape:
  //   { variant?: 'email'; prefill?: SupportPrefill; threadId?: string }
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | { variant?: SupportNewVariant; prefill?: SupportPrefill; threadId?: string }
        | undefined;
      setActiveCategory('support');
      setShowProfile(false);
      setShowNewMessage(false);
      if (detail?.variant === 'email') setSupportVariant('email');
      if (detail?.prefill) setSupportPrefill(detail.prefill);
      if (detail?.threadId) setSupportSelectedThreadId(detail.threadId);
    };
    window.addEventListener('open-support', handler);
    return () => window.removeEventListener('open-support', handler);
  }, []);

  // Close profile panel when switching conversations
  useEffect(() => {
    setShowProfile(false);
  }, [selectedThreadId]);

  // Close profile when another drawer opens
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

  const handleNewMessageSend = useCallback((recipients: string[], message: string) => {
    // Create a new thread item and add it to the top of the list
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
    setSelectedThreadId(newId);
  }, []);

  const handleSelectThread = (id: string) => {
    setSelectedThreadId(id);
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

  return (
    <div className="h-full flex min-h-0 bg-primary">
      <CategoryPanelV1
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        onVersionChange={onVersionChange}
        onSupportClick={handleSupportClick}
        supportBadgeCount={supportBadgeCount}
      />
      <div className="flex flex-1 min-h-0 relative overflow-hidden">
        {activeCategory === 'support' ? (
          <SupportCategory
            prefill={supportPrefill}
            newVariant={supportVariant}
            selectedThreadIdOverride={supportSelectedThreadId}
            onPrefillConsumed={() => {
              setSupportPrefill(null);
              setSupportVariant(null);
              setSupportSelectedThreadId(null);
            }}
          />
        ) : (
          <>
            <div style={{ width: panelWidth }} className="shrink-0 h-full relative overflow-visible">
              <ThreadListV1
                category={activeCategory as V1Category}
                selectedId={selectedThreadId}
                onSelect={handleSelectThread}
                onSettingsOpen={() => setShowModSettings(true)}
                onNewMessage={() => setShowNewMessage(true)}
              />
              <div
                className="absolute inset-y-0 right-0 w-[4px] cursor-col-resize z-20 group"
                onMouseDown={handleDragStart}
              >
                <div className="absolute inset-y-0 left-[1px] w-[2px] group-hover:bg-info/40 transition-colors rounded-full" />
              </div>
            </div>
            {showNewMessage && activeCategory === 'dms' ? (
              <NewMessagePanelV1 onSend={handleNewMessageSend} />
            ) : (
              <CenterPanelV1
                category={activeCategory as V1Category}
                selectedId={selectedThreadId}
                onProfileOpen={handleProfileOpen}
              />
            )}
            {showProfile && profileData && (
              <ProfilePanelV1
                data={profileData}
                onClose={() => setShowProfile(false)}
              />
            )}
          </>
        )}
      </div>
      <ModerationSettingsModal
        open={showModSettings}
        onOpenChange={setShowModSettings}
      />
    </div>
  );
};

export default InboxV1;
