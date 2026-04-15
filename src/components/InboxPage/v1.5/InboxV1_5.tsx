import React, { useState, useRef, useEffect, useCallback } from 'react';
import CategoryPanelV1_5 from './CategoryPanelV1_5';
import CenterPanelV1_5 from './CenterPanelV1_5';
import ChatThreadsListV1_5 from './ChatThreadsListV1_5';
import ConnectionRequestsListV1_5 from './ConnectionRequestsListV1_5';
import ThreadListV1 from '../v1/ThreadListV1';
import NewMessagePanelV1 from '../v1/NewMessagePanelV1';
import ProfilePanelV1 from '../v1/ProfilePanelV1';
import ModerationSettingsModal from '../v1/ModerationSettingsModal';
import { getFirstThreadIdV1_5, getProfileData, CONNECTION_REQUEST_ITEMS, DM_THREADS, type V1_5Category, type V1Category, type ProfileData, type ConnectionRequestItem, type V1ThreadItem } from './v1_5MockData';

const MIN_PANEL_WIDTH = 160;
const MAX_PANEL_WIDTH = 440;

interface InboxV1_5Props {
  onVersionChange: (version: 'v1' | 'v1.5' | 'v2') => void;
}

const InboxV1_5: React.FC<InboxV1_5Props> = ({ onVersionChange }) => {
  const [activeCategory, setActiveCategory] = useState<V1_5Category>('dms');
  const [selectedThreadId, setSelectedThreadId] = useState<string>('dm-3');
  const [panelWidth, setPanelWidth] = useState(364);

  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [showModSettings, setShowModSettings] = useState(false);
  const [showNewMessage, setShowNewMessage] = useState(false);

  // Connection requests local state
  const [connectionItems, setConnectionItems] = useState<ConnectionRequestItem[]>(() => [...CONNECTION_REQUEST_ITEMS]);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(364);

  const handleCategoryChange = (category: V1_5Category) => {
    setActiveCategory(category);
    setSelectedThreadId(getFirstThreadIdV1_5(category));
    setShowProfile(false);
    setShowNewMessage(false);
  };

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

  // Handle connection request actions (accept, ignore, block)
  const handleConnectionAction = useCallback((id: string, _action: 'accept' | 'ignore' | 'block') => {
    setConnectionItems(prev => {
      const next = prev.filter(item => item.id !== id);
      // Auto-select next item
      if (next.length > 0) {
        const currentIdx = prev.findIndex(item => item.id === id);
        const nextItem = next[Math.min(currentIdx, next.length - 1)];
        setSelectedThreadId(nextItem.id);
      } else {
        setSelectedThreadId('');
      }
      return next;
    });
  }, []);

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

  // Categories that reuse the v1 ThreadListV1
  const isV1Category = (cat: V1_5Category): cat is V1Category =>
    cat === 'dms' || cat === 'moderation' || cat === 'course-comments' || cat === 'ai-inbox';

  return (
    <div className="h-full flex min-h-0 bg-primary">
      <CategoryPanelV1_5
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        onVersionChange={onVersionChange}
      />
      <div className="flex flex-1 min-h-0 relative overflow-hidden">
        <div style={{ width: panelWidth }} className="shrink-0 h-full relative overflow-visible">
          {activeCategory === 'chat-threads' ? (
            <ChatThreadsListV1_5
              selectedId={selectedThreadId}
              onSelect={handleSelectThread}
            />
          ) : activeCategory === 'connection-requests' ? (
            <ConnectionRequestsListV1_5
              items={connectionItems}
              selectedId={selectedThreadId}
              onSelect={handleSelectThread}
            />
          ) : isV1Category(activeCategory) ? (
            <ThreadListV1
              category={activeCategory}
              selectedId={selectedThreadId}
              onSelect={handleSelectThread}
              onSettingsOpen={() => setShowModSettings(true)}
              titleOverride={activeCategory === 'dms' ? 'DMs' : undefined}
              onNewMessage={() => setShowNewMessage(true)}
            />
          ) : null}
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
          <CenterPanelV1_5
            category={activeCategory}
            selectedId={selectedThreadId}
            onProfileOpen={handleProfileOpen}
            onConnectionAction={handleConnectionAction}
          />
        )}
        {showProfile && profileData && (
          <ProfilePanelV1 data={profileData} onClose={() => setShowProfile(false)} />
        )}
      </div>
      <ModerationSettingsModal open={showModSettings} onOpenChange={setShowModSettings} />
    </div>
  );
};

export default InboxV1_5;
