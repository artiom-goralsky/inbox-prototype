import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Tooltip } from '@circleco/compass/components/Tooltip';

type NavItem = {
  id: string;
  label: string;
  count?: number;
  emoji?: string;
  icon: string;
};

const MAIN_NAV: NavItem[] = [
  { id: 'all', label: 'All', count: 11, icon: 'layout-grid' },
  { id: 'my-dms', label: 'My DMs', count: 3, icon: 'message-text' },
  { id: 'content-moderation', label: 'Content moderation', count: 2, icon: 'eye-open' },
  { id: 'course-engagement', label: 'Course engagement', count: 5, icon: 'graduate-cap' },
  { id: 'ai-inbox', label: 'AI Inbox', count: 8, icon: 'sparkle' },
];

const VIEWS: NavItem[] = [
  { id: 'cohort-a', label: 'Cohort A', count: 1, icon: 'star' },
  { id: 'site-1', label: 'Site #1', count: 11, icon: 'star' },
];

const FIN_AI_NAV: NavItem[] = [
  { id: 'all-conversations', label: 'All', icon: 'message' },
  { id: 'paused', label: 'Paused', icon: 'clock' },
];

interface InboxNavbarProps {
  activeItem: string;
  onItemClick: (id: string) => void;
  onClose?: () => void;
}

const NavAffordance: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <Tooltip content="Close" side="right" sideOffset={8}>
    <button
      onClick={onClose}
      className="group/affordance relative flex items-center justify-center cursor-pointer shrink-0 z-10 h-full bg-transparent border-none p-0 outline-none"
      style={{ width: 26 }}
      aria-label="Close sidebar"
    >
      <div className="rounded-[45px] transition-[width,background-color] duration-150 h-6 w-[2px] bg-[#a5a9ad] group-hover/affordance:w-1 group-hover/affordance:bg-[#42464d]" />
    </button>
  </Tooltip>
);

const ChevronDown: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    className={`shrink-0 transition-transform ${open ? '' : '-rotate-90'}`}
  >
    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const InboxNavbar: React.FC<InboxNavbarProps> = ({ activeItem, onItemClick, onClose }) => {
  const [viewsOpen, setViewsOpen] = useState(true);
  const [finOpen, setFinOpen] = useState(true);

  const NavRow: React.FC<{ item: NavItem }> = ({ item }) => (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onItemClick(item.id)}
      onKeyDown={e => e.key === 'Enter' && onItemClick(item.id)}
      className={`flex items-center justify-between px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
        activeItem === item.id ? 'bg-active' : 'hover:bg-hover'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        {item.emoji && <span className="text-sm leading-none">{item.emoji}</span>}
        <Typography variant="body-sm" color="primary" className="truncate">
          {item.label}
        </Typography>
      </div>
      {item.count !== undefined && (
        <Typography variant="body-sm" color="tertiary">
          {item.count}
        </Typography>
      )}
    </div>
  );

  const SectionHeader: React.FC<{
    label: string;
    open: boolean;
    onToggle: () => void;
    onAdd?: () => void;
    showExpand?: boolean;
  }> = ({ label, open, onToggle, onAdd, showExpand = true }) => (
    <div className="flex items-center justify-between px-3 py-1 mt-2">
      <div
        role="button"
        tabIndex={0}
        className="flex items-center gap-1 cursor-pointer text-tertiary"
        onClick={onToggle}
        onKeyDown={e => e.key === 'Enter' && onToggle()}
      >
        <Typography variant="label-xs" color="tertiary">
          <span className="uppercase tracking-wide text-[10px]">{label}</span>
        </Typography>
        {showExpand && <ChevronDown open={open} />}
        {!showExpand && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-tertiary">
            <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      {onAdd && (
        <IconButton variant="ghost" size="sm" icon="plus" aria-label={`Add ${label}`} onClick={onAdd} />
      )}
    </div>
  );

  return (
    <div className="flex shrink-0 h-full">
    <div className="w-[220px] bg-primary flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-secondary">
        <Typography variant="heading-sm" color="primary">
          <span className="font-semibold">Inbox</span>
        </Typography>
        <IconButton variant="ghost" size="sm" icon="plus" aria-label="New conversation" />
      </div>

      {/* Main nav */}
      <div className="flex flex-col gap-0.5 px-2 py-2">
        {MAIN_NAV.map(item => (
          <NavRow key={item.id} item={item} />
        ))}
      </div>

      {/* Views */}
      <div className="px-2">
        <SectionHeader label="Views" open={viewsOpen} onToggle={() => setViewsOpen(v => !v)} showExpand />
        {viewsOpen && (
          <div className="flex flex-col gap-0.5 mt-0.5">
            {VIEWS.map(item => (
              <NavRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Fin AI Agent */}
      <div className="px-2">
        <SectionHeader label="AI Inbox" open={finOpen} onToggle={() => setFinOpen(v => !v)} onAdd={() => {}} showExpand />
        {finOpen && (
          <div className="flex flex-col gap-0.5 mt-0.5">
            {FIN_AI_NAV.map(item => (
              <NavRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
    {onClose && <NavAffordance onClose={onClose} />}
    </div>
  );
};

export default InboxNavbar;
