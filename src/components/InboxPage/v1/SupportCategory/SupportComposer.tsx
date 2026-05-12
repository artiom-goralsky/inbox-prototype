import React from 'react';
import { IconButton } from '@circleco/compass/components/IconButton';

interface SupportComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  noPadding?: boolean;
}

/** Reply composer for an existing Support thread. */
const SupportComposer: React.FC<SupportComposerProps> = ({
  value,
  onChange,
  onSend,
  placeholder = 'Message',
  noPadding = false,
}) => {
  const canSend = value.trim().length > 0;

  return (
    <div className={noPadding ? '' : 'px-4 pb-4 shrink-0'}>
      <div className="max-w-[768px] mx-auto">
        <div className="border border-[#f0f3f5] rounded-2xl overflow-hidden">
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                if (canSend) onSend();
              }
            }}
            placeholder={placeholder}
            className="w-full px-4 py-3 text-sm leading-5 resize-none outline-none bg-primary min-h-[20px]"
            rows={1}
          />
          <div className="flex items-center justify-end p-2">
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
  );
};

export default SupportComposer;
