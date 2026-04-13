import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Button } from '@circleco/compass/components/Button';
import { Avatar } from '@circleco/compass/components/Avatar';
import type { Conversation } from './ChatList';

const RUDY_AVATAR = '/ai-avatar.png';

interface Message {
  id: string;
  type: 'outgoing' | 'incoming' | 'system';
  content: string;
  meta?: string;
  senderColor?: string;
  senderName?: string;
}

const MESSAGES: Message[] = [
  {
    id: '1',
    type: 'outgoing',
    content: 'Hi 😊 Have a look around! Let us know if you have any questions.',
    meta: 'Seen · 3y · Chat',
  },
  {
    id: '2',
    type: 'incoming',
    content: 'soughaodirghiaejhrgqerg',
    meta: '3y',
    senderColor: '#22c55e',
    senderName: 'User',
  },
  {
    id: '3',
    type: 'system',
    content: 'Circle will reply as soon as they can.',
    meta: '3y',
  },
  {
    id: '4',
    type: 'system',
    content: 'Give Rudy and the team a way to reach you:',
    meta: '3y',
  },
  {
    id: '5',
    type: 'outgoing',
    content: 'Snooze',
    meta: 'Not seen · 2y',
  },
];

interface ChatWindowProps {
  conversation: Conversation | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation }) => {
  const [reply, setReply] = useState('');

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-primary">
        <Typography variant="body-md" color="tertiary">
          Select a conversation to view messages
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-primary min-h-0 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-secondary shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Typography variant="label-md" color="primary">
            <span className="font-semibold truncate">{conversation.title}</span>
          </Typography>
          <IconButton variant="ghost" size="sm" icon="star" aria-label="Star conversation" />
          <IconButton variant="ghost" size="sm" icon="dot-menu" aria-label="More options" />
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <IconButton variant="ghost" size="sm" icon="message-text" aria-label="Chat" />
          <IconButton variant="ghost" size="sm" icon="phone" aria-label="Phone" />
          <IconButton variant="ghost" size="sm" icon="moon" aria-label="Snooze" />
          <img src={RUDY_AVATAR} alt="Rudy" className="w-[22px] h-[22px] rounded-full" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
        {MESSAGES.map(msg => {
          if (msg.type === 'system') {
            return (
              <div key={msg.id} className="flex items-center gap-2">
                <div className="flex-1 h-px bg-secondary" />
                <Typography variant="body-sm" color="tertiary" className="shrink-0">
                  {msg.content}
                </Typography>
                {msg.meta && (
                  <Typography variant="caption" color="tertiary" className="shrink-0">
                    {msg.meta}
                  </Typography>
                )}
                <div className="flex-1 h-px bg-secondary" />
              </div>
            );
          }

          if (msg.type === 'incoming') {
            return (
              <div key={msg.id} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full shrink-0"
                  style={{ backgroundColor: msg.senderColor }}
                />
                <div className="flex flex-col gap-1">
                  <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-sm">
                    <Typography variant="body-sm" color="primary">
                      {msg.content}
                    </Typography>
                  </div>
                  {msg.meta && (
                    <Typography variant="caption" color="tertiary">
                      {msg.meta}
                    </Typography>
                  )}
                </div>
              </div>
            );
          }

          // outgoing
          return (
            <div key={msg.id} className="flex items-end justify-end gap-3">
              <div className="flex flex-col items-end gap-1">
                <div className="bg-[#eef2ff] rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-sm">
                  <Typography variant="body-sm" color="primary">
                    {msg.content}
                  </Typography>
                </div>
                {msg.meta && (
                  <Typography variant="caption" color="tertiary">
                    {msg.meta}
                  </Typography>
                )}
              </div>
              <img src={RUDY_AVATAR} alt="Rudy" className="w-[22px] h-[22px] rounded-full" />
            </div>
          );
        })}
      </div>

      {/* Reply composer */}
      <div className="shrink-0 border-t border-secondary p-4">
        <div className="border border-secondary rounded-xl overflow-hidden">
          {/* Toolbar top */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-secondary">
            <div className="flex items-center gap-1 cursor-pointer">
              <Typography variant="label-sm" color="primary">
                <span className="font-medium">Reply</span>
              </Typography>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Text area */}
          <div className="px-4 py-3 min-h-[60px]">
            {reply === '' && (
              <Typography variant="body-sm" color="tertiary">
                Use ⌘K for shortcuts
              </Typography>
            )}
            <div
              contentEditable
              suppressContentEditableWarning
              onInput={e => setReply((e.target as HTMLDivElement).textContent || '')}
              className="outline-none text-sm text-primary"
            />
          </div>

          {/* Bottom action bar */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-secondary">
            <IconButton variant="ghost" size="sm" icon="sparkle" aria-label="Quick actions" />
            <Button variant="primary" size="sm" endIcon="chevron-down">
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
