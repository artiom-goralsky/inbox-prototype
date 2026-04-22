import React, { useState, useMemo } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Button } from '@circleco/compass/components/Button';
import { Icon } from '@circleco/compass/components/Icon';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Menu } from '@circleco/compass/components/Menu';
import { AI_THREADS, AI_CONVERSATIONS, type V1Message } from './v1MockData';
import SuggestedReplyWidget from '../../shared/SuggestedReplyWidget';
import { getSuggestedReply } from '../suggestedReplyMockData';

interface AIInboxCenterPanelV1Props {
  selectedId: string;
  onProfileOpen: (name: string) => void;
  showAiAssist?: boolean;
}

function BotAvatar() {
  return <img src="/images/agent-avatar.svg" alt="AI Agent" className="size-8 rounded-full shrink-0" />;
}

const AIInboxCenterPanelV1: React.FC<AIInboxCenterPanelV1Props> = ({ selectedId, onProfileOpen, showAiAssist = false }) => {
  const thread = AI_THREADS.find((t) => t.id === selectedId);
  const conversation = AI_CONVERSATIONS[selectedId];
  const [composerText, setComposerText] = useState('');
  const [localMessages, setLocalMessages] = useState<V1Message[]>([]);
  const [composerAiDraft, setComposerAiDraft] = useState(false);
  const [suggestionDismissed, setSuggestionDismissed] = useState(false);

  React.useEffect(() => { setSuggestionDismissed(false); }, [selectedId]);

  React.useEffect(() => {
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
    if (conversation) {
      conversation.groups.forEach(g => g.messages.forEach(m => msgs.push(m)));
    } else if (thread) {
      msgs.push({ id: 'placeholder', senderName: thread.name, text: thread.preview, time: '9:45 AM' });
    }
    localMessages.forEach(m => msgs.push(m));
    return msgs;
  }, [conversation, thread, localMessages]);

  if (!thread) {
    return (
      <div className="flex-1 flex items-center justify-center bg-primary">
        <Typography variant="body-sm" color="tertiary">Select a conversation</Typography>
      </div>
    );
  }

  const agentName = conversation?.agentName ?? 'AI Agent';
  const memberName = conversation?.memberName ?? thread.name;

  const handleSend = () => {
    if (!composerText.trim()) return;
    setLocalMessages((prev) => [
      ...prev,
      { id: `local-${Date.now()}`, senderName: 'You', text: composerText.trim(), time: 'Just now' },
    ]);
    setComposerText('');
    setComposerAiDraft(false);
  };

  const handleAiAssist = (msg: { senderName: string; text: string; id?: string }) => {
    window.dispatchEvent(new CustomEvent('copilot-add-reference', {
      detail: { messageId: msg.id ?? `ai-msg-${Date.now()}`, authorName: msg.senderName, snippet: msg.text.slice(0, 80), category: 'aiInbox' }
    }));
  };

  return (
    <div className="flex-1 flex flex-col bg-primary overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 h-14 pl-6 pr-6 border-b border-[#f0f3f5] shrink-0">
          <button className="flex items-center gap-2 hover:bg-hover rounded-lg pr-3 py-2" onClick={() => onProfileOpen(memberName)}>
            <Avatar name={memberName} size="sm" />
            <Typography variant="heading-md" color="primary">{memberName}</Typography>
          </button>
          <div className="flex-1" />
          {thread.aiStatus === 'paused' ? (
            <Button variant="primary" size="sm" startIcon="sparkles">Resume AI</Button>
          ) : (
            <Button variant="secondary" size="sm" startIcon="clock-snooze">Pause AI</Button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="max-w-[768px] mx-auto">
          {conversation ? (
            conversation.groups.map((group) => (
              <div key={group.label} className="flex flex-col">
                <div className="flex items-center pt-6 pb-2 px-3 border-b border-[#f0f3f5] mb-2">
                  <Typography variant="label-xs" color="tertiary">{group.label}</Typography>
                </div>
                {group.messages.map((msg) => (
                  <AIMessageRow key={msg.id} msg={msg} onAiAssist={showAiAssist ? handleAiAssist : undefined} />
                ))}
              </div>
            ))
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center pt-6 pb-2 px-3 border-b border-[#f0f3f5] mb-2">
                <Typography variant="label-xs" color="tertiary">Today</Typography>
              </div>
              <div className="flex gap-3 items-start px-3 py-2">
                <Avatar name={thread.name} size="md" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <Typography variant="heading-sm" color="primary">{thread.name}</Typography>
                    <Typography variant="caption" color="disabled">9:45 AM</Typography>
                  </div>
                  <Typography variant="body-sm" color="primary">{thread.preview}</Typography>
                </div>
              </div>
            </div>
          )}
          {/* AI Paused divider */}
          {thread.aiStatus === 'paused' && (
            <div className="flex items-center gap-2 px-3 py-3">
              <div className="flex-1 border-b border-secondary" />
              <div className="flex items-center gap-1.5 shrink-0">
                <Typography variant="label-xs-uppercase" color="tertiary">AI Paused</Typography>
                <Icon name="sparkle" size="sm" color="tertiary" />
              </div>
              <div className="flex-1 border-b border-secondary" />
            </div>
          )}
          {localMessages.map((msg) => (
            <div key={msg.id} className="flex gap-3 items-start px-3 py-2">
              <Avatar name={msg.senderName} size="md" />
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Typography variant="heading-sm" color="primary">{msg.senderName}</Typography>
                  <Typography variant="caption" color="disabled">{msg.time}</Typography>
                </div>
                <Typography variant="body-sm" color="primary">{msg.text}</Typography>
              </div>
            </div>
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
                  recipientName={memberName}
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
                <div className={`rounded-[16px] overflow-hidden shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_3px_12px_-4px_rgba(0,0,0,0.1),0px_4px_16px_-8px_rgba(0,0,0,0.1)] ${showAiAssist && composerAiDraft ? 'bg-info-light' : 'bg-primary'}`}>
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
                    placeholder={`Message ${memberName}`}
                    className="w-full px-4 py-3 text-sm resize-none outline-none bg-transparent min-h-[80px] max-h-[120px] overflow-y-auto"
                    rows={3}
                  />
                  <div className="flex items-center justify-end p-2">
                    <IconButton icon="arrow-up" size="md" variant="secondary" aria-label="Send" onClick={handleSend} />
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

function AIMessageRow({ msg, onAiAssist }: { msg: V1Message & { isBot?: boolean }; onAiAssist?: (msg: { senderName: string; text: string }) => void }) {
  const [hovered, setHovered] = useState(false);
  const isIncoming = !msg.isBot && msg.senderName !== 'You';

  return (
    <div
      className={`flex gap-3 items-start px-3 py-2 rounded-2xl relative transition-colors duration-200 ${hovered ? 'bg-secondary' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {msg.isBot ? (
        <BotAvatar />
      ) : (
        <Avatar name={msg.senderName} size="md" />
      )}
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Typography variant="heading-sm" color="primary">{msg.senderName}</Typography>
          <Typography variant="caption" color="disabled">{msg.time}</Typography>
        </div>
        <Typography variant="body-sm" color="primary">{msg.text}</Typography>
      </div>
      {hovered && (
        <div className="absolute -top-4 right-2 flex items-center bg-primary border border-secondary rounded-lg shadow-2xs z-10 overflow-hidden">
          <IconButton icon="emoji-smiley" size="sm" variant="ghost" aria-label="React" />
          <IconButton icon="bookmark" size="sm" variant="ghost" aria-label="Save" />
          {isIncoming && onAiAssist && (
            <IconButton icon="sparkles" size="sm" variant="ghost" aria-label="AI assist" onClick={() => onAiAssist(msg)} />
          )}
          <Menu
            options={[
              { label: 'Copy text', icon: 'copy' as const, onClick: () => {} },
              { label: 'Report', icon: 'flag' as const, onClick: () => {} },
            ]}
            trigger={<IconButton icon="dot-menu" size="sm" variant="ghost" aria-label="More" />}
          />
        </div>
      )}
    </div>
  );
}

export default AIInboxCenterPanelV1;
