import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Icon } from '@circleco/compass/components/Icon';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Menu } from '@circleco/compass/components/Menu';
import { DM_THREADS, DM_CONVERSATIONS, type V1Message } from './v1MockData';
import SearchPanelV1 from './SearchPanelV1';
import ThreadPanelV1 from './ThreadPanelV1';
import SuggestedReplyWidget from '../../shared/SuggestedReplyWidget';
import { getSuggestedReply } from '../suggestedReplyMockData';

interface DMCenterPanelV1Props {
  selectedId: string;
  onProfileOpen: (name: string) => void;
  initialDraft?: string;
  showAiAssist?: boolean;
}

const DMCenterPanelV1: React.FC<DMCenterPanelV1Props> = ({ selectedId, onProfileOpen, initialDraft, showAiAssist = false }) => {
  const thread = DM_THREADS.find((t) => t.id === selectedId);
  const groups = DM_CONVERSATIONS[selectedId];
  const [composerText, setComposerText] = useState(initialDraft ?? '');
  const [searchOpen, setSearchOpen] = useState(false);
  const [localMessages, setLocalMessages] = useState<V1Message[]>([]);
  const [threadMessage, setThreadMessage] = useState<V1Message | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [composerAiDraft, setComposerAiDraft] = useState(false);
  const [suggestionDismissed, setSuggestionDismissed] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  // Listen for search-highlight events
  useEffect(() => {
    const handler = (e: Event) => {
      const { messageId } = (e as CustomEvent).detail as { messageId: string };
      const el = messagesRef.current?.querySelector(`[data-msg-id="${messageId}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedId(messageId);
        setTimeout(() => setHighlightedId(null), 1500);
      }
    };
    window.addEventListener('search-highlight', handler);
    return () => window.removeEventListener('search-highlight', handler);
  }, []);

  // Close local drawers + reset suggestion when conversation changes
  useEffect(() => {
    setSearchOpen(false);
    setThreadMessage(null);
    setSuggestionDismissed(false);
  }, [selectedId]);

  // Close local drawers when another drawer opens
  useEffect(() => {
    const handler = () => { setSearchOpen(false); setThreadMessage(null); };
    window.addEventListener('drawer-open', handler);
    return () => window.removeEventListener('drawer-open', handler);
  }, []);

  const openSearch = () => { window.dispatchEvent(new CustomEvent('drawer-open')); setSearchOpen(true); };
  const openThread = (msg: V1Message) => { window.dispatchEvent(new CustomEvent('drawer-open')); setThreadMessage(msg); };

  useEffect(() => {
    if (initialDraft) setComposerText(initialDraft);
  }, [initialDraft]);

  // Listen for AI assist "Add to composer" events
  useEffect(() => {
    const handler = (e: Event) => {
      const { text } = (e as CustomEvent).detail as { text: string };
      setComposerText(text);
      setComposerAiDraft(true);
      setSuggestionDismissed(true);
    };
    window.addEventListener('composer-set-draft', handler);
    return () => window.removeEventListener('composer-set-draft', handler);
  }, []);

  const allMessages = useMemo(() => {
    const msgs: { id: string; senderName: string; text: string; time: string }[] = [];
    if (groups) {
      groups.forEach(g => g.messages.forEach(m => msgs.push(m)));
    } else if (thread) {
      msgs.push({ id: 'placeholder', senderName: thread.name, text: thread.preview, time: '9:45 AM' });
    }
    localMessages.forEach(m => msgs.push(m));
    return msgs;
  }, [groups, thread, localMessages]);

  if (!thread) {
    return (
      <div className="flex-1 flex items-center justify-center bg-primary">
        <Typography variant="body-sm" color="tertiary">Select a conversation</Typography>
      </div>
    );
  }

  const handleAiAssist = (msg: V1Message) => {
    window.dispatchEvent(new CustomEvent('copilot-add-reference', {
      detail: { messageId: msg.id, authorName: msg.senderName, snippet: msg.text.slice(0, 80), category: 'dm' }
    }));
  };

  const handleSend = () => {
    if (!composerText.trim()) return;
    setLocalMessages((prev) => [
      ...prev,
      { id: `local-${Date.now()}`, senderName: 'You', text: composerText.trim(), time: 'Just now' },
    ]);
    setComposerText('');
  };

  const menuOptions = [
    { label: 'Search', icon: 'magnifying-glass' as const, onClick: openSearch },
    { label: 'View profile', icon: 'people' as const, onClick: () => onProfileOpen(thread.name) },
    { label: 'Mute', icon: 'bell-mute' as const, onClick: () => {} },
    { label: 'Archive', icon: 'inbox-empty' as const, danger: true, onClick: () => {} },
  ];

  return (
    <div className="flex-1 flex flex-col bg-primary overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 h-14 pl-6 pr-6 border-b border-[#f0f3f5] shrink-0">
          <button className="flex items-center gap-2 hover:bg-hover rounded-lg pr-3 py-2" onClick={() => onProfileOpen(thread.name)}>
            <Avatar name={thread.name} size="sm" />
            <Typography variant="heading-md" color="primary">{thread.name}</Typography>
          </button>
          <div className="flex-1" />
          <Menu
            options={menuOptions}
            trigger={<IconButton icon="dot-menu" size="md" variant="ghost" aria-label="More options" />}
          />
        </div>

        {/* Messages */}
        <div ref={messagesRef} className="flex-1 overflow-y-auto px-4 py-2">
          <div className="max-w-[768px] mx-auto">
          {groups ? (
            groups.map((group) => (
              <div key={group.label} className="flex flex-col">
                <div className="flex items-center pt-6 pb-2 px-3 border-b border-[#f0f3f5] mb-2">
                  <Typography variant="label-xs" color="tertiary">{group.label}</Typography>
                </div>
                {group.messages.map((msg) => (
                  <MessageRow key={msg.id} message={msg} highlighted={highlightedId === msg.id} onNameClick={() => onProfileOpen(msg.senderName)} onOpenThread={openThread} onAiAssist={showAiAssist ? handleAiAssist : undefined} />
                ))}
              </div>
            ))
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center pt-6 pb-2 px-3 border-b border-[#f0f3f5] mb-2">
                <Typography variant="label-xs" color="tertiary">Today</Typography>
              </div>
              <MessageRow message={{ id: 'placeholder', senderName: thread.name, text: thread.preview, time: '9:45 AM' }} highlighted={highlightedId === 'placeholder'} onNameClick={() => onProfileOpen(thread.name)} onAiAssist={handleAiAssist} />
            </div>
          )}
          {localMessages.map((msg) => (
            <MessageRow key={msg.id} message={msg} highlighted={highlightedId === msg.id} onNameClick={() => onProfileOpen(msg.senderName)} onOpenThread={openThread} onAiAssist={showAiAssist ? handleAiAssist : undefined} />
          ))}
          </div>
        </div>

        {/* Composer or Suggested Reply Widget */}
        {(() => {
          const suggestion = showAiAssist ? getSuggestedReply(selectedId) : null;
          if (suggestion && !suggestionDismissed) {
            return (
              <div className="flex flex-col items-center px-4 pb-4 shrink-0">
                <SuggestedReplyWidget
                  recipientName={thread.name}
                  draftText={suggestion.draftText}
                  sources={suggestion.sources}
                  reasoning={suggestion.reasoning}
                  conversationId={selectedId}
                  onTakeOver={(text) => { setComposerText(text); setComposerAiDraft(false); setSuggestionDismissed(true); }}
                  onDiscard={() => setSuggestionDismissed(true)}
                />
              </div>
            );
          }
          return (
            <div className="px-4 pb-4 shrink-0">
              <div className="max-w-[768px] mx-auto">
              <div className={`border rounded-2xl overflow-hidden ${showAiAssist && composerAiDraft ? 'border-info bg-info-light' : 'border-[#f0f3f5]'}`}>
                {showAiAssist && composerAiDraft && (
                  <div className="flex items-center gap-1 px-4 pt-2">
                    <Icon name="sparkles" size="sm" color="info" />
                    <Typography variant="caption" color="info">AI-generated draft</Typography>
                  </div>
                )}
                <textarea
                  value={composerText}
                  onChange={(e) => { setComposerText(e.target.value); if (!e.target.value) setComposerAiDraft(false); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder={`Message ${thread.name}`}
                  className="w-full px-4 py-3 text-sm resize-none outline-none bg-primary min-h-[80px] max-h-[120px] overflow-y-auto"
                  rows={3}
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
          );
        })()}
      {searchOpen && <SearchPanelV1 onClose={() => setSearchOpen(false)} messages={allMessages} />}
      {threadMessage && (
        <ThreadPanelV1
          parentMessage={threadMessage}
          replies={threadMessage.replies ?? []}
          onClose={() => setThreadMessage(null)}
        />
      )}
    </div>
  );
};

function MessageRow({ message, highlighted, onNameClick, onOpenThread, onAiAssist }: { message: V1Message; highlighted?: boolean; onNameClick?: () => void; onOpenThread?: (msg: V1Message) => void; onAiAssist?: (msg: V1Message) => void }) {
  const [hovered, setHovered] = useState(false);
  const hasReplies = message.replies && message.replies.length > 0;

  return (
    <div
      data-msg-id={message.id}
      className={`flex gap-3 items-start px-3 py-2 rounded-2xl relative transition-colors duration-200 ${highlighted ? 'bg-highlight' : hovered ? 'bg-secondary' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button className="shrink-0 focus:outline-none" onClick={onNameClick}>
        <Avatar name={message.senderName} size="md" />
      </button>
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <button className="focus:outline-none" onClick={onNameClick}>
            <Typography variant="heading-sm" color="primary">{message.senderName}</Typography>
          </button>
          <Typography variant="caption" color="disabled">{message.time}</Typography>
        </div>
        <Typography variant="body-sm" color="primary">{message.text}</Typography>
        {/* Thread indicator */}
        {hasReplies && (
          <button
            className="flex items-center gap-1 px-2 py-1 border border-secondary rounded-2xl w-fit hover:bg-hover"
            onClick={() => onOpenThread?.(message)}
          >
            <div className="flex -space-x-1">
              {message.replies!.slice(0, 3).map(r => (
                <Avatar key={r.id} name={r.senderName} size="xxs" />
              ))}
            </div>
            <Typography variant="label-xs" color="info">{message.replies!.length} {message.replies!.length === 1 ? 'reply' : 'replies'}</Typography>
            <Typography variant="caption" color="tertiary">just now</Typography>
          </button>
        )}
      </div>
      {hovered && (
        <div className="absolute -top-4 right-2 flex items-center bg-primary border border-secondary rounded-lg shadow-2xs z-10 overflow-hidden">
          <IconButton icon="emoji-smiley" size="sm" variant="ghost" aria-label="React" />
          <IconButton icon="bookmark" size="sm" variant="ghost" aria-label="Save" />
          <IconButton icon="thread" size="sm" variant="ghost" aria-label="Reply in thread" onClick={() => onOpenThread?.(message)} />
          {message.senderName !== 'You' && onAiAssist && (
            <IconButton icon="sparkles" size="sm" variant="ghost" aria-label="AI assist" onClick={() => onAiAssist(message)} />
          )}
          <Menu
            options={[
              { label: 'Edit', icon: 'pencil' as const, onClick: () => {} },
              { label: 'Mark unread', icon: 'page-edit' as const, onClick: () => {} },
              { label: 'Pin', icon: 'pin' as const, onClick: () => {} },
              { label: 'Copy link', icon: 'chain-link' as const, onClick: () => {} },
              { label: 'Report', icon: 'flag' as const, onClick: () => {} },
              { label: 'Delete', icon: 'trash-can' as const, danger: true, onClick: () => {} },
            ]}
            trigger={<IconButton icon="dot-menu" size="sm" variant="ghost" aria-label="More" />}
          />
        </div>
      )}
    </div>
  );
}

export default DMCenterPanelV1;
