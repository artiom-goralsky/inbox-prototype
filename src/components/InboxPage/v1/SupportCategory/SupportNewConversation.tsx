import React, { useEffect, useRef } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { IconButton } from '@circleco/compass/components/IconButton';

interface SupportNewConversationProps {
  subject: string;
  message: string;
  onSubjectChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  onCancel: () => void;
}

const SupportNewConversation: React.FC<SupportNewConversationProps> = ({
  subject,
  message,
  onSubjectChange,
  onMessageChange,
  onSend,
  onCancel,
}) => {
  const subjectRef = useRef<HTMLInputElement>(null);
  const canSend = subject.trim().length > 0 && message.trim().length > 0;

  const handleFieldKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (canSend) onSend();
    }
  };

  useEffect(() => {
    subjectRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div className="flex-1 flex flex-col bg-primary overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 pl-6 pr-4 py-3 border-b border-[#f0f3f5] shrink-0 h-14">
        <Typography variant="heading-md" color="primary" className="flex-1 truncate">
          New support request
        </Typography>
        <IconButton icon="cross" size="md" variant="ghost" aria-label="Cancel" onClick={onCancel} />
      </div>

      {/* Empty body — pushes the compose card to the bottom */}
      <div className="flex-1" />

      {/* Compose card */}
      <div className="px-4 pb-4 shrink-0">
        <div className="max-w-[768px] mx-auto">
          <div className="border border-[#f0f3f5] rounded-2xl bg-primary overflow-hidden relative">
            <input
              ref={subjectRef}
              type="text"
              value={subject}
              onChange={e => onSubjectChange(e.target.value)}
              onKeyDown={handleFieldKeyDown}
              placeholder="Subject"
              className="w-full px-4 py-3 text-sm leading-5 outline-none bg-primary placeholder:text-[color:var(--color-text-secondary)]"
            />
            <div className="border-t border-[#f0f3f5]" />
            <textarea
              value={message}
              onChange={e => onMessageChange(e.target.value)}
              onKeyDown={handleFieldKeyDown}
              placeholder="Message"
              className="w-full px-4 py-3 pr-14 text-sm leading-5 resize-none outline-none bg-primary min-h-[140px] max-h-[280px] overflow-y-auto placeholder:text-[color:var(--color-text-secondary)]"
              rows={5}
            />
            <div className="absolute bottom-2 right-2">
              <IconButton
                icon="arrow-up"
                size="md"
                variant="secondary"
                aria-label="Send"
                disabled={!canSend}
                onClick={onSend}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportNewConversation;
