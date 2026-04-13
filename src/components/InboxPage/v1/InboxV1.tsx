import React, { useState, useRef, useEffect } from 'react';
import CategoryPanelV1 from './CategoryPanelV1';
import ThreadListV1 from './ThreadListV1';
import CenterPanelV1 from './CenterPanelV1';
import ProfilePanelV1 from './ProfilePanelV1';
import ModerationSettingsModal from './ModerationSettingsModal';
import { getFirstThreadId, getProfileData, type V1Category, type ProfileData } from './v1MockData';

const MIN_PANEL_WIDTH = 160;
const MAX_PANEL_WIDTH = 440;

interface InboxV1Props {
  onVersionChange: (version: 'v1' | 'v2') => void;
}

const InboxV1: React.FC<InboxV1Props> = ({ onVersionChange }) => {
  const [activeCategory, setActiveCategory] = useState<V1Category>('dms');
  const [selectedThreadId, setSelectedThreadId] = useState<string>('dm-3');
  const [panelWidth, setPanelWidth] = useState(364);

  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [showModSettings, setShowModSettings] = useState(false);


  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(364);

  const handleCategoryChange = (category: V1Category) => {
    setActiveCategory(category);
    setSelectedThreadId(getFirstThreadId(category));
    setShowProfile(false);
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
    // Close any other open drawers first
    window.dispatchEvent(new CustomEvent('drawer-open'));
    setProfileData(getProfileData(name));
    setShowProfile(true);
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
      />
      <div className="flex flex-1 min-h-0 relative overflow-hidden">
        <div style={{ width: panelWidth }} className="shrink-0 h-full relative overflow-visible">
          <ThreadListV1
            category={activeCategory}
            selectedId={selectedThreadId}
            onSelect={setSelectedThreadId}
            onSettingsOpen={() => setShowModSettings(true)}
          />
          <div
            className="absolute inset-y-0 right-0 w-[4px] cursor-col-resize z-20 group"
            onMouseDown={handleDragStart}
          >
            <div className="absolute inset-y-0 left-[1px] w-[2px] group-hover:bg-info/40 transition-colors rounded-full" />
          </div>
        </div>
        <CenterPanelV1
          category={activeCategory}
          selectedId={selectedThreadId}
          onProfileOpen={handleProfileOpen}
        />
        {showProfile && profileData && (
          <ProfilePanelV1
            data={profileData}
            onClose={() => setShowProfile(false)}
          />
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
