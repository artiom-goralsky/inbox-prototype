import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { IconButton } from '@circleco/compass/components/IconButton';

export interface Conversation {
  id: string;
  color: string;
  title: string;
  sub: string;
  time: string;
  isReply?: boolean;
}

const CONVERSATIONS: Conversation[] = [
  { id: '1', color: '#6366f1', title: 'Indigo Megaphone from C...', sub: 'Snooze', time: '2y' },
  { id: '2', color: '#9ca3af', title: 'Preview User', sub: 'Cristi: asdasdas', time: '2y' },
  { id: '3', color: '#eab308', title: 'Yellow Deer from Tampa', sub: 'Circle: dffdf', time: '2y' },
  { id: '4', color: '#f97316', title: 'Orange Anchor from Tampa', sub: 'asdgasdgjhadofihgadiig', time: '3y' },
  { id: '5', color: '#f43f5e', title: 'Rose Radio from Cascais', sub: 'ouhargiuhqeruhg', time: '3y' },
  { id: '6', color: '#a855f7', title: 'Purple Suitcase from Casc...', sub: 'Hi there', time: '3y' },
  { id: '7', color: '#f43f5e', title: 'Turquoise Spaceship from ...', sub: 'Sending a second one', time: '3y' },
  { id: '8', color: '#f43f5e', title: 'Turquoise Birdhouse from ...', sub: 'Hi there!', time: '3y' },
  { id: '9', color: '#eab308', title: 'Cyan Cello from Cascais', sub: 'Hi there!', time: '3y' },
  { id: '10', color: '#9ca3af', title: 'magnus · Circle', sub: 'Yooooo', time: '3y', isReply: true },
  { id: '11', color: '#f97316', title: 'This a really big name and ...', sub: 'Hi there, hows it going?', time: '3y' },
];

interface ChatListProps {
  selectedId: string;
  onSelect: (conv: Conversation) => void;
}

const ChatList: React.FC<ChatListProps> = ({ selectedId, onSelect }) => {
  const [activeView, setActiveView] = useState<'grid' | 'list'>('list');

  return (
    <div className="w-[260px] shrink-0 bg-primary border-r border-secondary flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-secondary">
        <Typography variant="heading-sm" color="primary">
          <span className="font-semibold">Rudy</span>
        </Typography>
        <IconButton variant="ghost" size="sm" icon="magnifying-glass" aria-label="Search conversations" />
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-secondary">
        <Typography variant="label-sm" color="primary">
          <span className="font-medium">{CONVERSATIONS.length} Open</span>
        </Typography>
        <div className="flex items-center gap-1 ml-auto">
          <Typography variant="body-sm" color="tertiary">
            Last activity
          </Typography>
          <IconButton variant="ghost" size="sm" icon="filter" aria-label="Filter" />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {CONVERSATIONS.map(conv => (
          <div
            key={conv.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(conv)}
            onKeyDown={e => e.key === 'Enter' && onSelect(conv)}
            className={`flex items-start gap-3 px-3 py-3 cursor-pointer border-b border-secondary transition-colors ${
              selectedId === conv.id ? 'bg-active' : 'hover:bg-hover'
            }`}
          >
            {/* Color indicator */}
            <div className="shrink-0 mt-1">
              {conv.isReply ? (
                <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 7L4 4.5L1.5 2M5.5 8.5H7C7.83 8.5 8.5 7.83 8.5 7V3.5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full" style={{ backgroundColor: conv.color }} />
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-1">
                <Typography variant="label-sm" color="primary">
                  <span className="truncate font-medium">{conv.title}</span>
                </Typography>
                <Typography variant="caption" color="tertiary" className="shrink-0">
                  {conv.time}
                </Typography>
              </div>
              <Typography variant="body-sm" color="tertiary" className="truncate mt-0.5">
                {conv.sub}
              </Typography>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom layout toggle */}
      <div className="flex items-center gap-1 px-3 py-2 border-t border-secondary">
        <IconButton
          variant={activeView === 'grid' ? 'outline' : 'ghost'}
          size="sm"
          icon="layout-grid"
          aria-label="Grid view"
          onClick={() => setActiveView('grid')}
        />
        <IconButton
          variant={activeView === 'list' ? 'outline' : 'ghost'}
          size="sm"
          icon="layout-left"
          aria-label="List view"
          onClick={() => setActiveView('list')}
        />
      </div>
    </div>
  );
};

export default ChatList;
