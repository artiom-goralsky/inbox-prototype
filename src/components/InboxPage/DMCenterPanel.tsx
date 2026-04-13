import React, { useState, useEffect, useRef } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Avatar } from '@circleco/compass/components/Avatar';

const PERSON_MESSAGES: Record<string, string> = {
  'james-liu':    "Thanks for the camera settings tip in yesterday's live session!",
  'emily-park':   'The landscape composition lesson was exactly what I needed.',
  'david-kim':    'Just wanted to say the community is awesome. Learned more here than in 2 years of YouTube.',
  'amy-torres':   'Thanks for the feedback on my portrait series!',
  'chen-wei':     "How do I access lesson 3? I bought the Landscape Basics course but can't find it in my dashboard.",
  'maria-santos': "When is the next live session? I want to make sure I don't miss it.",
  'chris-lee':    'Can I download the lesson videos for offline viewing?',
  'nina-patel':   "The video in Portrait Pro lesson 7 stops playing at 3:42. I've tried different browsers and it's the same issue.",
  'omar-hassan':  "My payment failed when trying to renew. I still want to stay \u2014 can you help?",
  'tom-brown':    "Hey! My friend is a photographer and would love to check out the community. Any chance of a guest pass or trial?",
  'lisa-wong':    "I'm on the monthly plan but want to switch to annual. Is there a way to do that and get the savings applied right away?",
};

const PERSON_NAMES: Record<string, string> = {
  'james-liu':    'James Liu',
  'emily-park':   'Emily Park',
  'david-kim':    'David Kim',
  'amy-torres':   'Amy Torres',
  'chen-wei':     'Chen Wei',
  'maria-santos': 'Maria Santos',
  'chris-lee':    'Chris Lee',
  'nina-patel':   'Nina Patel',
  'omar-hassan':  'Omar Hassan',
  'tom-brown':    'Tom Brown',
  'lisa-wong':    'Lisa Wong',
  'alex-chen':    'Alex Chen',
  '1':  'Kathryn Murphy',
  '2':  'Kristin Watson',
  '3':  'Calvin Parks',
  '4':  'Courtney Henry',
  '5':  'Ralph Edwards',
  '6':  'Jane Cooper',
  '7':  'Annette Black',
  '8':  'Wade Warren',
  '9':  'Cody Fisher',
  '10': 'Dianne Russell',
  '11': 'Jacob Jones',
  '12': 'Albert Flores',
};

interface Message {
  id: string;
  type: 'incoming' | 'outgoing';
  text: string;
  time: string;
}

const ALEX_MESSAGES: Message[] = [
  { id: 'a1', type: 'incoming', text: "Hi, I'd like to request a refund for the Advanced Lighting course. The instructor hasn't posted new lessons in 3 weeks and I feel like I'm not getting what I paid for. I've been a member since the beginning and this is the first time I've had an issue.", time: '8:42 AM' },
];

const DateSeparator: React.FC<{ label: string }> = ({ label }) => (
  <div className="pb-2 px-3">
    <div className="border-b border-secondary pb-1.5">
      <Typography variant="caption" color="tertiary">{label}</Typography>
    </div>
  </div>
);

interface MessageRowProps {
  message: Message;
  personName: string;
  onNameClick?: () => void;
}

const MessageRow: React.FC<MessageRowProps> = ({ message, personName, onNameClick }) => {
  const isOutgoing = message.type === 'outgoing';
  const name = isOutgoing ? 'You' : personName;

  return (
    <div className="flex gap-3 items-start px-3 py-2">
      <button
        className="shrink-0 focus:outline-none"
        onClick={!isOutgoing ? onNameClick : undefined}
        aria-label={!isOutgoing ? `View ${name}'s profile` : undefined}
      >
        <Avatar name={name} size="md" />
      </button>
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className="flex gap-2 items-center">
          <button
            className="focus:outline-none"
            onClick={!isOutgoing ? onNameClick : undefined}
          >
            <Typography variant="heading-sm" color="primary">{name}</Typography>
          </button>
          <Typography variant="caption" color="disabled">{message.time}</Typography>
        </div>
        <Typography variant="body-sm" color="primary">{message.text}</Typography>
      </div>
    </div>
  );
};

interface DMCenterPanelProps {
  selectedId: string;
  onOpenProfile?: (name: string) => void;
  sentReply?: string;
  composerDraft?: { text: string; recipientName: string } | null;
  onSendReply?: (threadId: string, text: string) => void;
  onClose?: () => void;
}

const DMCenterPanel: React.FC<DMCenterPanelProps> = ({ selectedId, onOpenProfile, sentReply, composerDraft, onSendReply, onClose }) => {
  const personName = PERSON_NAMES[selectedId] ?? 'Calvin Parks';
  const isAlexChen = selectedId === 'alex-chen';
  const [composerText, setComposerText] = useState('');
  const [hasDraft, setHasDraft] = useState(false);
  const [localSentMessages, setLocalSentMessages] = useState<Message[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load composer draft when it arrives
  useEffect(() => {
    if (composerDraft) {
      setComposerText(composerDraft.text);
      setHasDraft(true);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [composerDraft]);

  // Clear local sent messages only when switching threads
  useEffect(() => {
    setLocalSentMessages([]);
  }, [selectedId]);

  // Clear draft when switching threads or draft is revoked
  useEffect(() => {
    if (!composerDraft || composerDraft.recipientName !== personName) {
      setComposerText('');
      setHasDraft(false);
    }
  }, [selectedId, composerDraft, personName]);

  const handleSend = () => {
    if (!composerText.trim()) return;
    const text = composerText;
    onSendReply?.(selectedId, text);
    setLocalSentMessages(prev => [...prev, { id: `local-${Date.now()}`, type: 'outgoing', text, time: 'Just now' }]);
    setComposerText('');
    setHasDraft(false);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full bg-primary">
      {/* Header */}
      <div className="h-14 px-4 flex items-center gap-3 border-b border-secondary shrink-0">
        <button
          className="focus:outline-none"
          onClick={() => onOpenProfile?.(personName)}
          aria-label={`View ${personName}'s profile`}
        >
          <Avatar name={personName} size="md" />
        </button>
        <button
          className="focus:outline-none flex-1 text-left"
          onClick={() => onOpenProfile?.(personName)}
        >
          <Typography variant="heading-sm" color="primary">{personName}</Typography>
        </button>
        {onClose && (
          <IconButton icon="cross" size="sm" variant="ghost" aria-label="Close" onClick={onClose} />
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto py-2 flex flex-col">
        {isAlexChen ? (
          <>
            <DateSeparator label="Today" />
            {ALEX_MESSAGES.map(msg => (
              <MessageRow key={msg.id} message={msg} personName={personName} onNameClick={() => onOpenProfile?.(personName)} />
            ))}
          </>
        ) : (
          <>
            <DateSeparator label="Today" />
            <MessageRow
              message={{ id: 'member-msg', type: 'incoming', text: PERSON_MESSAGES[selectedId] ?? 'Hey there!', time: 'Earlier' }}
              personName={personName}
              onNameClick={() => onOpenProfile?.(personName)}
            />
          </>
        )}

        {/* Sent reply from Copilot (standalone DMs view) */}
        {sentReply && (
          <MessageRow
            message={{ id: 'sent-reply', type: 'outgoing', text: sentReply, time: 'Just now' }}
            personName="You"
          />
        )}
        {/* Sent messages from context panel */}
        {localSentMessages.map(msg => (
          <MessageRow key={msg.id} message={msg} personName="You" />
        ))}
      </div>

      {/* Reply composer */}
      {!sentReply && (
      <div className="shrink-0 border-t border-secondary">
        {hasDraft && composerDraft && (
          <div className="mx-4 mt-2">
            <Typography variant="label-xs" color="info">
              Copilot draft for {composerDraft.recipientName} &mdash; edit and send
            </Typography>
          </div>
        )}
        <div className="mx-4 my-3 border border-secondary rounded-2xl shadow-xs px-4 py-3 flex flex-col gap-3">
          {hasDraft ? (
            <textarea
              ref={textareaRef}
              className="w-full min-h-[44px] text-sm leading-[1.4] text-primary bg-transparent resize-y focus:outline-none"
              value={composerText}
              onChange={e => setComposerText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (!e.shiftKey || e.metaKey || e.ctrlKey)) { e.preventDefault(); handleSend(); } }}
            />
          ) : (
            <Typography variant="body-md" color="secondary">Message {personName}</Typography>
          )}
          <div className="flex items-center gap-1">
            <IconButton variant="ghost" size="md" icon="paperclip" aria-label="Attach file" />
            <IconButton variant="ghost" size="md" icon="image" aria-label="Add image" />
            <IconButton variant="ghost" size="md" icon="gif-square" aria-label="Add GIF" />
            <IconButton variant="ghost" size="md" icon="emoji-smiley" aria-label="Add emoji" />
            <IconButton variant="ghost" size="md" icon="microphone" aria-label="Voice message" />
            <IconButton variant="ghost" size="md" icon="at" aria-label="Mention" />
            <IconButton variant="ghost" size="md" icon="hashtag" aria-label="Add topic" />
            <div className="ml-auto">
              <IconButton variant="primary" size="sm" icon="arrow-up" aria-label="Send message" onClick={handleSend} />
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default DMCenterPanel;
