import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Avatar } from '@circleco/compass/components/Avatar';

type MessageType = 'member' | 'agent';

interface AIMessage {
  id: string;
  type: MessageType;
  text: string;
  time: string;
  senderName: string;
}

interface ConversationData {
  memberName: string;
  agentName: string;
  messages: AIMessage[];
}

const CONVERSATIONS: Record<string, ConversationData> = {
  '1': {
    memberName: 'Calvin Parks',
    agentName: 'Clarity Bot',
    messages: [
      {
        id: 'm1',
        type: 'member',
        senderName: 'Calvin Parks',
        text: "Hello, I'm having trouble with my connection. It keeps dropping.",
        time: '9:10 AM',
      },
      {
        id: 'm2',
        type: 'agent',
        senderName: 'Clarity Bot',
        text: "I'm sorry to hear that. Let's troubleshoot the issue. Have you tried restarting your modem and router?",
        time: '9:11 AM',
      },
      {
        id: 'm3',
        type: 'member',
        senderName: 'Calvin Parks',
        text: 'Yes I did, but the problem persists.',
        time: '9:13 AM',
      },
    ],
  },
  '2': {
    memberName: 'Kathryn Murphy',
    agentName: 'Clarity Bot',
    messages: [
      {
        id: 'k1',
        type: 'member',
        senderName: 'Kathryn Murphy',
        text: 'Hey, want to play?',
        time: '10:02 AM',
      },
      {
        id: 'k2',
        type: 'agent',
        senderName: 'Clarity Bot',
        text: "Hi Kathryn! I'm here to help you with anything you need. What can I assist you with today?",
        time: '10:02 AM',
      },
    ],
  },
  '3': {
    memberName: 'Kristin Watson',
    agentName: 'Support Agent',
    messages: [
      {
        id: 'w1',
        type: 'member',
        senderName: 'Kristin Watson',
        text: 'Please let me know if you have any updates on my refund request.',
        time: '11:30 AM',
      },
      {
        id: 'w2',
        type: 'agent',
        senderName: 'Support Agent',
        text: "I've reviewed your case. Your refund of $49 has been approved and will appear in your account within 3–5 business days.",
        time: '11:31 AM',
      },
    ],
  },
  'sarah-kim': {
    memberName: 'Sarah Kim',
    agentName: 'FAQ Agent',
    messages: [
      { id: 'sk1', type: 'member', senderName: 'Sarah Kim', text: "Hi! I run a photography club with about 12 members. We're looking for an online community to learn together.", time: '7:55 AM' },
      { id: 'sk2', type: 'agent', senderName: 'FAQ Agent', text: "Welcome! Our community offers courses on landscape, portrait, and street photography, plus weekly live sessions and peer feedback spaces.", time: '7:55 AM' },
      { id: 'sk3', type: 'member', senderName: 'Sarah Kim', text: "That sounds great. Do you offer group discounts for clubs like ours?", time: '8:01 AM' },
    ],
  },
  'tom-brown': {
    memberName: 'Tom Brown',
    agentName: 'FAQ Agent',
    messages: [
      { id: 'tb1', type: 'member', senderName: 'Tom Brown', text: "How do I reset my password?", time: '3:20 AM' },
      { id: 'tb2', type: 'agent', senderName: 'FAQ Agent', text: "You can reset your password by clicking 'Forgot password' on the login screen.", time: '3:20 AM' },
    ],
  },
  'lisa-wong': {
    memberName: 'Lisa Wong',
    agentName: 'FAQ Agent',
    messages: [
      { id: 'lw1', type: 'member', senderName: 'Lisa Wong', text: "What courses cover portrait photography?", time: '9:05 AM' },
      { id: 'lw2', type: 'agent', senderName: 'FAQ Agent', text: "We have 'Portrait Fundamentals' (beginner) and 'Advanced Portrait Lighting' (intermediate).", time: '9:06 AM' },
    ],
  },
};

const FALLBACK: ConversationData = {
  memberName: 'Member',
  agentName: 'Clarity Bot',
  messages: [],
};

/* Bot avatar — brand circle with sparkle icon */
const BotAvatar: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <div
    className="rounded-full bg-brand flex items-center justify-center shrink-0"
    style={{ width: size, height: size }}
    aria-label="AI agent"
  >
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1L9.5 6H14.5L10.5 9L12 14L8 11L4 14L5.5 9L1.5 6H6.5L8 1Z"
        fill="white"
        fillOpacity="0.9"
      />
    </svg>
  </div>
);

interface AIInboxCenterPanelProps {
  selectedId: string;
  onOpenProfile?: (name: string) => void;
}

const AIInboxCenterPanel: React.FC<AIInboxCenterPanelProps> = ({ selectedId, onOpenProfile }) => {
  const data = CONVERSATIONS[selectedId] ?? FALLBACK;
  const { memberName, agentName, messages } = data;
  const isSarahKim = selectedId === 'sarah-kim';

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full bg-primary">
      {/* Header */}
      <div className="h-14 px-4 flex items-center gap-3 border-b border-secondary shrink-0">
        <button
          className="focus:outline-none"
          onClick={() => onOpenProfile?.(memberName)}
          aria-label={`View ${memberName}'s profile`}
        >
          <Avatar name={memberName} size="md" />
        </button>
        <button
          className="focus:outline-none"
          onClick={() => onOpenProfile?.(memberName)}
        >
          <Typography variant="heading-sm" color="primary">{memberName}</Typography>
        </button>
      </div>

      {/* Chat history */}
      <div className="flex-1 overflow-y-auto py-2 flex flex-col">
        {messages.map(msg => {
          if (msg.type === 'agent') {
            return (
              <div key={msg.id} className="flex gap-3 items-start px-3 py-2">
                <BotAvatar size={36} />
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  <div className="flex gap-2 items-center">
                    <Typography variant="heading-sm" color="primary">{agentName}</Typography>
                    <div className="px-1.5 py-0.5 rounded-full bg-info-light">
                      <Typography variant="caption" color="info">AI</Typography>
                    </div>
                    <Typography variant="caption" color="disabled">{msg.time}</Typography>
                  </div>
                  <Typography variant="body-sm" color="primary">{msg.text}</Typography>
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex gap-3 items-start px-3 py-2">
              <button
                className="shrink-0 focus:outline-none"
                onClick={() => onOpenProfile?.(memberName)}
                aria-label={`View ${memberName}'s profile`}
              >
                <Avatar name={memberName} size="md" />
              </button>
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <div className="flex gap-2 items-center">
                  <button
                    className="focus:outline-none"
                    onClick={() => onOpenProfile?.(memberName)}
                  >
                    <Typography variant="heading-sm" color="primary">{memberName}</Typography>
                  </button>
                  <Typography variant="caption" color="disabled">{msg.time}</Typography>
                </div>
                <Typography variant="body-sm" color="primary">{msg.text}</Typography>
              </div>
            </div>
          );
        })}

        {isSarahKim && (
          <div className="flex items-center gap-3 mx-3 my-3">
            <div className="flex-1 border-t border-dashed border-warning" />
            <Typography variant="label-sm" color="warning">Agent paused — "group discount" detected</Typography>
            <div className="flex-1 border-t border-dashed border-warning" />
          </div>
        )}

        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-16">
            <Typography variant="body-md" color="tertiary">No messages yet</Typography>
          </div>
        )}
      </div>

      {/* Reply composer */}
      <div className="shrink-0 border-t border-secondary">
        <div className="mx-4 my-3 border border-secondary rounded-2xl shadow-xs px-4 py-3 flex flex-col gap-3">
          <Typography variant="body-md" color="secondary">
            {isSarahKim ? 'Replying as You (Admin)' : 'Type to reply...'}
          </Typography>
          <div className="flex items-center gap-1">
            <IconButton variant="outline" size="sm" icon="hashtag" aria-label="Add topic" />
            <IconButton variant="outline" size="sm" icon="paperclip" aria-label="Attach file" />
            <div className="ml-auto flex items-center gap-1">
              <IconButton variant="ghost" size="sm" icon="microphone" aria-label="Voice message" />
              <IconButton variant="primary" size="sm" icon="arrow-up" aria-label="Send message" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInboxCenterPanel;
