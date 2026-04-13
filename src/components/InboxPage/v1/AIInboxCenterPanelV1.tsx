import React, { useState, useMemo } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Button } from '@circleco/compass/components/Button';
import { Icon } from '@circleco/compass/components/Icon';
import { IconButton } from '@circleco/compass/components/IconButton';
import { AI_THREADS, AI_CONVERSATIONS, type V1Message } from './v1MockData';

interface AIInboxCenterPanelV1Props {
  selectedId: string;
  onProfileOpen: (name: string) => void;
}

function BotAvatar() {
  return <img src="/images/agent-avatar.svg" alt="AI Agent" className="size-8 rounded-full shrink-0" />;
}

const AIInboxCenterPanelV1: React.FC<AIInboxCenterPanelV1Props> = ({ selectedId, onProfileOpen }) => {
  const thread = AI_THREADS.find((t) => t.id === selectedId);
  const conversation = AI_CONVERSATIONS[selectedId];
  const [composerText, setComposerText] = useState('');
  const [localMessages, setLocalMessages] = useState<V1Message[]>([]);

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
                  <div key={msg.id} className="flex gap-3 items-start px-3 py-2 rounded-2xl">
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
                  </div>
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

        {/* Composer */}
        <div className="px-4 pb-4 shrink-0">
          <div className="max-w-[768px] mx-auto">
            <div className="border border-[#f0f3f5] rounded-2xl overflow-hidden">
              <textarea
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={`Message ${memberName}`}
                className="w-full px-4 py-3 text-sm resize-none outline-none bg-primary min-h-[44px]"
                rows={1}
              />
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center">
                  <IconButton icon="hashtag" size="md" variant="ghost" aria-label="Hashtag" />
                  <IconButton icon="paperclip" size="md" variant="ghost" aria-label="Attach" />
                </div>
                <div className="flex items-center gap-1">
                  <IconButton icon="arrow-up" size="md" variant="secondary" aria-label="Send" onClick={handleSend} />
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default AIInboxCenterPanelV1;
