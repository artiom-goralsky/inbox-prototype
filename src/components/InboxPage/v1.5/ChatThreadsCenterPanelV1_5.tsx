import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Button } from '@circleco/compass/components/Button';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Icon } from '@circleco/compass/components/Icon';
import { Menu } from '@circleco/compass/components/Menu';
import { CHAT_THREAD_ITEMS, CHAT_THREAD_CONVERSATIONS, type ChatThreadMessage } from './v1_5MockData';
import SuggestedReplyWidget from '../../shared/SuggestedReplyWidget';
import { getSuggestedReply } from '../suggestedReplyMockData';

interface ChatThreadsCenterPanelV1_5Props {
  selectedId: string;
  onProfileOpen: (name: string) => void;
  showAiAssist?: boolean;
}

const ChatThreadsCenterPanelV1_5: React.FC<ChatThreadsCenterPanelV1_5Props> = ({ selectedId, onProfileOpen, showAiAssist = false }) => {
  const thread = CHAT_THREAD_ITEMS.find(t => t.id === selectedId);
  const conversation = CHAT_THREAD_CONVERSATIONS[selectedId];
  const [composerText, setComposerText] = useState('');
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

  if (!thread || !conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-primary">
        <Typography variant="body-sm" color="tertiary">Select a thread</Typography>
      </div>
    );
  }

  const handleSend = () => {
    if (!composerText.trim()) return;
    setComposerText('');
  };

  const handleAiAssist = (msg: ChatThreadMessage) => {
    window.dispatchEvent(new CustomEvent('copilot-add-reference', {
      detail: { messageId: msg.id, authorName: msg.senderName, snippet: msg.text.slice(0, 80), category: 'chatThread' }
    }));
  };

  // Build the space/channel label for the header
  const spaceLabel = thread.channelEmoji
    ? `${thread.channelEmoji} ${thread.channelLabel}`
    : thread.channelLabel ?? 'DM';

  // Composer placeholder uses the selected thread's avatar name
  const composerPlaceholder = `Message ${thread.avatarName}`;

  return (
    <div className="flex-1 flex flex-col bg-primary overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between h-14 pl-6 pr-4 border-b border-[#f0f3f5] shrink-0">
        <div className="flex flex-1 gap-3 h-6 items-center min-w-0 whitespace-nowrap">
          <Typography variant="heading-md" color="primary">Thread</Typography>
          <Typography variant="body-sm" color="secondary">{spaceLabel}</Typography>
        </div>
        <Button variant="ghost" size="sm">Open</Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 max-w-[768px] mx-auto pt-4">
          {/* Parent message */}
          <MessageRow
            message={conversation.parentMessage}
            onNameClick={() => onProfileOpen(conversation.parentMessage.senderName)}
            onAiAssist={showAiAssist ? handleAiAssist : undefined}
          />

          {/* Reply count divider + replies */}
          <div className="flex flex-col">
            {/* Reply count */}
            <div className="flex flex-col pb-2 px-3">
              <div className="border-b border-[#f0f3f5] pb-1.5">
                <Typography variant="label-xs" color="primary">
                  {conversation.replies.length} {conversation.replies.length === 1 ? 'reply' : 'replies'}
                </Typography>
              </div>
            </div>

            {/* Replies */}
            {conversation.replies.map(reply => (
              <MessageRow
                key={reply.id}
                message={reply}
                onNameClick={() => onProfileOpen(reply.senderName)}
                onAiAssist={showAiAssist ? handleAiAssist : undefined}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Composer or Suggested Reply Widget */}
      {(() => {
        const suggestion = showAiAssist ? getSuggestedReply(selectedId) : null;
        if (suggestion && !suggestionDismissed) {
          return (
            <div className="flex flex-col items-center px-4 pb-4 shrink-0">
              <SuggestedReplyWidget
                recipientName={thread.avatarName}
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
          <div className="flex flex-col gap-2 items-center px-4 pb-4 shrink-0">
            <div className="flex flex-col gap-2 max-w-[768px] w-full">
              <div className={`rounded-[16px] overflow-hidden shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_3px_12px_-4px_rgba(0,0,0,0.1),0px_4px_16px_-8px_rgba(0,0,0,0.1)] ${showAiAssist && composerAiDraft ? 'bg-info-light' : 'bg-primary'}`}>
                {showAiAssist && composerAiDraft && (
                  <div className="flex items-center gap-1 px-4 pt-2">
                    <Icon name="sparkles" size="sm" color="info" />
                    <Typography variant="caption" color="info">AI-generated draft</Typography>
                  </div>
                )}
                <div className="flex items-center px-4 py-3">
                  <textarea
                    value={composerText}
                    onChange={e => { setComposerText(e.target.value); if (!e.target.value) setComposerAiDraft(false); }}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder={composerPlaceholder}
                    className="w-full text-sm resize-none outline-none bg-primary min-h-[20px] leading-5 text-secondary placeholder:text-secondary"
                    rows={1}
                  />
                </div>
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center">
                    <IconButton icon="paperclip" size="md" variant="ghost" aria-label="Attach" />
                    <IconButton icon="image" size="md" variant="ghost" aria-label="Image" />
                    <IconButton icon="gif-square" size="md" variant="ghost" aria-label="GIF" />
                    <IconButton icon="emoji-smiley" size="md" variant="ghost" aria-label="Emoji" />
                    <IconButton icon="microphone" size="md" variant="ghost" aria-label="Voice" />
                    <IconButton icon="at" size="md" variant="ghost" aria-label="Mention" />
                    <IconButton icon="hashtag" size="md" variant="ghost" aria-label="Hashtag" />
                  </div>
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

function MessageRow({ message, onNameClick, onAiAssist }: { message: ChatThreadMessage; onNameClick: () => void; onAiAssist?: (msg: ChatThreadMessage) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`flex gap-3 items-start px-3 py-2 rounded-2xl relative transition-colors duration-200 ${hovered ? 'bg-secondary' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button className="shrink-0 focus:outline-none" onClick={onNameClick}>
        <Avatar name={message.senderName} size="md" />
      </button>
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center gap-2">
          <button className="focus:outline-none" onClick={onNameClick}>
            <Typography variant="heading-sm" color="primary">{message.senderName}</Typography>
          </button>
          <Typography variant="caption" color="disabled">{message.time}</Typography>
        </div>
        <Typography variant="body-sm" color="primary">{message.text}</Typography>
      </div>
      {hovered && (
        <div className="absolute -top-4 right-2 flex items-center bg-primary border border-secondary rounded-lg shadow-2xs z-10 overflow-hidden">
          <IconButton icon="emoji-smiley" size="sm" variant="ghost" aria-label="React" />
          <IconButton icon="bookmark" size="sm" variant="ghost" aria-label="Save" />
          <IconButton icon="thread" size="sm" variant="ghost" aria-label="Reply in thread" />
          {onAiAssist && (
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

export default ChatThreadsCenterPanelV1_5;
