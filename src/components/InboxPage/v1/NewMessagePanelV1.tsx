import React, { useState, useRef, useEffect } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Icon } from '@circleco/compass/components/Icon';
import { IconButton } from '@circleco/compass/components/IconButton';
import { AvatarGroup } from '@circleco/compass/components/AvatarGroup';

/** Suggested names for autocomplete demo. */
const SUGGESTIONS = [
  'John Dahl', 'James Liu', 'Kathryn Murphy', 'Kristin Watson', 'Calvin Parks',
  'Courtney Henry', 'Ralph Edwards', 'Jane Cooper', 'Annette Black', 'Wade Warren',
  'Cody Fisher', 'Dianne Russell', 'Jacob Jones', 'Albert Flores', 'Ronald Richards',
];

interface NewMessagePanelV1Props {
  onSend: (recipients: string[], message: string) => void;
}

const NewMessagePanelV1: React.FC<NewMessagePanelV1Props> = ({ onSend }) => {
  const [recipients, setRecipients] = useState<string[]>([]);
  const [toInput, setToInput] = useState('');
  const [composerText, setComposerText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the To input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filteredSuggestions = toInput.trim()
    ? SUGGESTIONS.filter(
        s => s.toLowerCase().includes(toInput.toLowerCase()) && !recipients.includes(s),
      ).slice(0, 5)
    : [];

  const addRecipient = (name: string) => {
    setRecipients(prev => [...prev, name]);
    setToInput('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeRecipient = (name: string) => {
    setRecipients(prev => prev.filter(r => r !== name));
  };

  const handleSend = () => {
    if (!composerText.trim() || recipients.length === 0) return;
    onSend(recipients, composerText.trim());
  };

  const recipientNames = recipients.join(', ');
  const placeholder = recipients.length > 0
    ? `Message ${recipientNames}`
    : 'Type a message...';

  return (
    <div className="flex-1 flex flex-col bg-primary overflow-hidden">
      {/* Header */}
      <div className="flex items-center h-14 px-6 shrink-0">
        <Typography variant="heading-md" color="primary">New Message</Typography>
      </div>

      {/* To: field */}
      <div className="flex items-center gap-2 px-6 pb-3 pt-1.5 border-b border-[#f0f3f5] shrink-0 relative">
        <Typography variant="label-sm" color="primary" className="shrink-0 text-right">To:</Typography>
        <div className="flex items-center gap-1 flex-wrap flex-1 min-w-0">
          {recipients.map(name => (
            <div
              key={name}
              className="flex items-center gap-1 h-7 pl-1 pr-2 border border-[#e4e7eb] rounded-full bg-primary"
            >
              <Avatar name={name} size="xs" />
              <Typography variant="body-sm" color="primary" className="whitespace-nowrap">{name}</Typography>
              <button className="focus:outline-none shrink-0" onClick={() => removeRecipient(name)}>
                <Icon name="cross" size="sm" color="tertiary" />
              </button>
            </div>
          ))}
          <input
            ref={inputRef}
            value={toInput}
            onChange={e => { setToInput(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={e => {
              if (e.key === 'Enter' && filteredSuggestions.length > 0) {
                e.preventDefault();
                addRecipient(filteredSuggestions[0]);
              }
              if (e.key === 'Backspace' && !toInput && recipients.length > 0) {
                removeRecipient(recipients[recipients.length - 1]);
              }
            }}
            placeholder={recipients.length === 0 ? 'Search for a name...' : ''}
            className="flex-1 min-w-[120px] text-sm outline-none bg-primary py-1"
          />
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute left-6 right-6 top-full z-50 bg-primary border border-[#e4e7eb] rounded-xl shadow-lg mt-1 overflow-hidden">
            {filteredSuggestions.map(name => (
              <button
                key={name}
                className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-hover text-left transition-colors"
                onMouseDown={e => { e.preventDefault(); addRecipient(name); }}
              >
                <Avatar name={name} size="sm" />
                <Typography variant="body-sm" color="primary">{name}</Typography>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Conversation area */}
      <div className="flex-1 flex flex-col items-start justify-end p-2 overflow-y-auto">
        {recipients.length > 0 && (
          <div className="flex flex-col gap-4 px-5 py-4">
            <div className="flex -space-x-3">
              {recipients.slice(0, 3).map(name => (
                <Avatar key={name} name={name} size="3xl" />
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <Typography variant="heading-sm" color="primary">Start conversation</Typography>
              <Typography variant="body-sm" color="secondary">
                This is the very beginning of your direct message history with{' '}
                {recipients.map((name, i) => (
                  <span key={name}>
                    {i > 0 && (i === recipients.length - 1 ? ' and ' : ', ')}
                    <span className="text-info">@{name.split(' ')[0]}</span>
                  </span>
                ))}.
              </Typography>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="px-4 pb-4 shrink-0">
        <div className="border border-[#f0f3f5] rounded-[16px] overflow-hidden shadow-[0px_1px_4px_0px_rgba(0,0,0,0.03),0px_1px_4px_0px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col items-start justify-center px-4 py-3">
            <textarea
              value={composerText}
              onChange={e => setComposerText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={placeholder}
              className="w-full text-sm resize-none outline-none bg-primary min-h-[20px] leading-5 text-primary placeholder:text-secondary"
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
            <IconButton
              icon="arrow-up"
              size="md"
              variant="secondary"
              disabled={!composerText.trim() || recipients.length === 0}
              aria-label="Send"
              onClick={handleSend}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMessagePanelV1;
