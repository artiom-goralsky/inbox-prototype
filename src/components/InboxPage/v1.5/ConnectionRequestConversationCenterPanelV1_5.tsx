import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Button } from '@circleco/compass/components/Button';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Menu } from '@circleco/compass/components/Menu';
import {
  CONNECTION_REQUEST_ITEMS,
  CONNECTION_REQUEST_PROFILES,
  CONNECTION_REQUEST_CONVERSATIONS,
  type V1Message,
  type V1MessageGroup,
} from './v1_5MockData';

const ADMIN_NAME = 'Rudy';
const ADMIN_AVATAR_SRC = '/images/avatars/1.png';

interface ConnectionRequestConversationCenterPanelV1_5Props {
  selectedId: string;
  onAccept: (id: string) => void;
  onIgnore: (id: string) => void;
  onBlock: (id: string) => void;
  onProfileOpen: (name: string) => void;
}

const ConnectionRequestConversationCenterPanelV1_5: React.FC<ConnectionRequestConversationCenterPanelV1_5Props> = ({
  selectedId,
  onAccept,
  onIgnore,
  onBlock,
  onProfileOpen,
}) => {
  const item = CONNECTION_REQUEST_ITEMS.find(i => i.id === selectedId);
  const profile = CONNECTION_REQUEST_PROFILES[selectedId];

  const [accepted, setAccepted] = useState(false);
  const [localMessages, setLocalMessages] = useState<V1Message[]>([]);
  const [composerText, setComposerText] = useState('');
  const composerRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setAccepted(false);
    setLocalMessages([]);
    setComposerText('');
  }, [selectedId]);

  if (!item || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-primary">
        <Typography variant="body-sm" color="tertiary">No pending requests</Typography>
      </div>
    );
  }

  const firstName = profile.name.split(' ')[0];

  const handleAccept = () => {
    setAccepted(true);
    setTimeout(() => composerRef.current?.focus(), 0);
    setTimeout(() => onAccept(selectedId), 1800);
  };

  const handleIgnore = () => onIgnore(selectedId);

  const handleSend = () => {
    if (!composerText.trim()) return;
    setLocalMessages(prev => [
      ...prev,
      { id: `local-${Date.now()}`, senderName: 'You', text: composerText.trim(), time: 'Just now' },
    ]);
    setComposerText('');
  };

  const menuOptions = [
    { label: 'View profile', icon: 'people' as const, onClick: () => onProfileOpen(profile.name) },
    { label: 'Mute', icon: 'bell-mute' as const, onClick: () => {} },
    { label: 'Block user', icon: 'circle-x' as const, danger: true, onClick: () => onBlock(selectedId) },
  ];

  // Build the rendered message groups. The prior DM history (if any) renders
  // beneath the floating banner. After accept, the accompanying message is
  // prepended as an "Earlier" group attributed to the requester.
  const priorGroups = CONNECTION_REQUEST_CONVERSATIONS[selectedId] ?? [];
  const groupsToRender: V1MessageGroup[] = [];
  if (accepted && item.message) {
    groupsToRender.push({
      label: 'Earlier',
      messages: [{ id: 'cr-accept-msg', senderName: profile.name, text: item.message, time: item.time }],
    });
  }
  priorGroups.forEach(g => groupsToRender.push({ label: g.label, messages: [...g.messages] }));
  if (localMessages.length > 0) {
    const lastIdx = groupsToRender.length - 1;
    if (lastIdx >= 0 && groupsToRender[lastIdx].label === 'Today') {
      groupsToRender[lastIdx] = {
        ...groupsToRender[lastIdx],
        messages: [...groupsToRender[lastIdx].messages, ...localMessages],
      };
    } else {
      groupsToRender.push({ label: 'Today', messages: [...localMessages] });
    }
  }

  const hasAnyContent = groupsToRender.some(g => g.messages.length > 0);
  const showStartConversationEmpty = !hasAnyContent;

  return (
    <div className="flex-1 flex flex-col bg-primary overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 h-14 pl-6 pr-6 border-b border-[#f0f3f5] shrink-0">
        <button className="flex items-center gap-2 hover:bg-hover rounded-lg pr-3 py-2" onClick={() => onProfileOpen(profile.name)}>
          <Avatar name={profile.name} size="sm" />
          <Typography variant="heading-md" color="primary">{profile.name}</Typography>
        </button>
        <div className="flex-1" />
        <Menu
          options={menuOptions}
          trigger={<IconButton icon="dot-menu" size="md" variant="ghost" aria-label="More options" />}
        />
      </div>

      {/* Banner — flat row at the top of the conversation area, not floating */}
      {!accepted && (
        <ConnectionRequestBanner
          firstName={firstName}
          message={item.message}
          onAccept={handleAccept}
          onIgnore={handleIgnore}
        />
      )}

      {/* Scrollable conversation content */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="max-w-[768px] mx-auto h-full flex flex-col">
          {showStartConversationEmpty ? (
            <EmptyConversationState
              adminName={ADMIN_NAME}
              adminAvatarSrc={ADMIN_AVATAR_SRC}
              requesterName={profile.name}
            />
          ) : (
            groupsToRender.map((group, gIdx) => (
              <div key={`${group.label}-${gIdx}`} className="flex flex-col">
                <div className="flex items-center pt-6 pb-2 px-3 border-b border-[#f0f3f5] mb-2">
                  <Typography variant="label-xs" color="tertiary">{group.label}</Typography>
                </div>
                {group.messages.map(msg => (
                  <MessageRow key={msg.id} message={msg} onNameClick={() => onProfileOpen(msg.senderName)} />
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Composer — always rendered, always active */}
      <div className="px-4 pb-4 shrink-0">
        <div className="max-w-[768px] mx-auto">
          <div className="border border-[#f0f3f5] rounded-2xl overflow-hidden">
            <textarea
              ref={composerRef}
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={`Message ${profile.name}`}
              className="w-full px-4 py-3 text-sm leading-5 resize-none outline-none bg-primary min-h-[20px]"
              rows={1}
            />
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center">
                <IconButton icon="hashtag" size="md" variant="ghost" aria-label="Hashtag" />
                <IconButton icon="paperclip" size="md" variant="ghost" aria-label="Attach" />
              </div>
              <div className="flex items-center gap-2">
                <IconButton icon="microphone" size="md" variant="ghost" aria-label="Voice" />
                <IconButton icon="arrow-up" size="md" variant="secondary" aria-label="Send" onClick={handleSend} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function ConnectionRequestBanner({
  firstName,
  message,
  onAccept,
  onIgnore,
}: {
  firstName: string;
  message?: string;
  onAccept: () => void;
  onIgnore: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const messageRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (!message) return;
    const el = messageRef.current;
    if (!el) return;
    setOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, [message]);

  return (
    <div className="bg-primary border-b border-[#f0f3f5] px-5 py-3 flex flex-col gap-3 shrink-0">
      <div className="flex items-center gap-4">
        {/* Title block */}
        <div className="flex-1 min-w-0 flex flex-col">
          <Typography variant="heading-sm" color="primary">Connection request</Typography>
          <Typography variant="caption" color="secondary">{firstName} wants to connect with you.</Typography>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onIgnore}>Ignore</Button>
          <Button variant="primary" size="sm" onClick={onAccept}>Accept</Button>
        </div>
      </div>

      {/* Quote block — only if accompanying message exists */}
      {message && (
        <div className="bg-secondary rounded-xl px-3 py-2.5">
          <p
            ref={messageRef}
            className={`text-sm leading-5 text-[color:var(--color-text-primary,#191b1f)] ${expanded ? '' : 'line-clamp-2'}`}
          >
            {message}
          </p>
          {overflowing && (
            <button
              type="button"
              onClick={() => setExpanded(e => !e)}
              className="mt-1 text-sm text-[color:var(--color-text-link,#506cf0)] hover:underline"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyConversationState({
  adminName,
  adminAvatarSrc,
  requesterName,
}: {
  adminName: string;
  adminAvatarSrc: string;
  requesterName: string;
}) {
  const adminFirst = adminName.split(' ')[0];
  const requesterFirst = requesterName.split(' ')[0];
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12">
      <div className="relative shrink-0" style={{ width: 64, height: 36 }}>
        <div className="absolute left-0 top-0">
          <Avatar src={adminAvatarSrc} name={adminName} size="md" />
        </div>
        <div className="absolute left-7 top-0 rounded-full ring-2 ring-[var(--color-background-primary-default,#fff)]">
          <Avatar name={requesterName} size="md" />
        </div>
      </div>
      <div className="flex flex-col items-center text-center gap-1 max-w-md">
        <Typography variant="heading-sm" color="primary">Start conversation</Typography>
        <Typography variant="body-sm" color="secondary">
          This is the very beginning of your direct message history with{' '}
          <span className="text-[color:var(--color-text-link,#506cf0)]">@{adminFirst}</span>
          {' '}and{' '}
          <span className="text-[color:var(--color-text-link,#506cf0)]">@{requesterFirst}</span>
          .
        </Typography>
      </div>
    </div>
  );
}

function MessageRow({ message, onNameClick }: { message: V1Message; onNameClick?: () => void }) {
  const isAdmin = message.senderName === 'You';
  return (
    <div className="flex gap-3 items-start px-3 py-2 rounded-2xl">
      <button className="shrink-0 focus:outline-none" onClick={onNameClick}>
        <Avatar src={isAdmin ? ADMIN_AVATAR_SRC : undefined} name={message.senderName} size="md" />
      </button>
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <button className="focus:outline-none" onClick={onNameClick}>
            <Typography variant="heading-sm" color="primary">{message.senderName}</Typography>
          </button>
          <Typography variant="caption" color="disabled">{message.time}</Typography>
        </div>
        <Typography variant="body-sm" color="primary">{message.text}</Typography>
      </div>
    </div>
  );
}

export default ConnectionRequestConversationCenterPanelV1_5;
