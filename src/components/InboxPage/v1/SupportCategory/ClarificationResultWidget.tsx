import React, { useState } from 'react';
import { Button } from '@circleco/compass/components/Button';
import { clarificationWidgetCopy, type ClarificationChoice } from './data/clarificationWidgetData';

interface ClarificationResultWidgetProps {
  /** Which option (if any) the user has confirmed — locks the widget. */
  selected?: ClarificationChoice | null;
  /** Fires on Approve. customText is set when the user typed a reply instead of selecting a row. */
  onChoose: (choice: ClarificationChoice, customText?: string) => void;
  onSkip?: () => void;
}

const OPTIONS: Array<{ value: ClarificationChoice; label: string }> = [
  { value: 'live_chat', label: clarificationWidgetCopy.options.liveChat.label },
  { value: 'email', label: clarificationWidgetCopy.options.email.label },
];

const ClarificationResultWidget: React.FC<ClarificationResultWidgetProps> = ({
  selected,
  onChoose,
  onSkip,
}) => {
  const [pending, setPending] = useState<ClarificationChoice | null>(null);
  const [customText, setCustomText] = useState('');
  // Soft lock: live-chat selection greys only its row; email or no-selection
  // keeps the email row + custom input usable so the user can switch paths.
  const liveChatLocked = selected != null;
  const emailLocked = selected === 'email';
  const inputLocked = selected === 'email';
  const isHardLocked = selected === 'email';
  const active = selected ?? pending;
  const canApprove = !isHardLocked && (pending != null || customText.trim().length > 0);

  const handleApprove = () => {
    if (!canApprove) return;
    if (pending) {
      onChoose(pending);
    } else if (customText.trim()) {
      // Custom-text path — treat as email with the user's reply as body.
      onChoose('email', customText.trim());
    }
  };

  return (
    <div className="w-full max-w-[678px] animate-[fadeInSlide_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
      <div className="w-full bg-secondary border border-[#e4e7eb] rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="bg-white border-b border-[#f0f3f5] flex h-14 items-center px-[18px] py-3 rounded-t-[14px]">
          <span className="text-sm font-semibold text-[#191b1f]">{clarificationWidgetCopy.question}</span>
        </div>
        <div className="bg-white flex flex-col rounded-b-[12px] border-b border-secondary">
          {OPTIONS.map(opt => {
            const isSel = active === opt.value;
            const rowLocked = opt.value === 'live_chat' ? liveChatLocked : emailLocked;
            return (
              <button
                key={opt.value}
                type="button"
                disabled={rowLocked}
                onClick={() => { setPending(opt.value); setCustomText(''); }}
                className={`flex gap-3 items-center px-3 py-3 w-full text-left border-b border-secondary transition-colors ${
                  isSel ? 'bg-secondary' : 'bg-white hover:bg-secondary'
                } ${rowLocked && !isSel ? 'opacity-60' : ''} ${rowLocked ? 'cursor-default' : ''}`}
              >
                <div className="shrink-0 w-4 h-4 flex items-center justify-center">
                  {isSel ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" fill="white" stroke="#191b1f" strokeWidth="1.5" />
                      <circle cx="8" cy="8" r="3.5" fill="#191b1f" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" fill="white" stroke="#d1d5db" strokeWidth="1.5" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-[#191b1f]">{opt.label}</span>
              </button>
            );
          })}
          <div className="flex items-center pl-3 pr-3 py-3 bg-white border-b border-secondary rounded-b-[12px]">
            <input
              type="text"
              value={customText}
              disabled={inputLocked}
              onChange={e => { setCustomText(e.target.value); setPending(null); }}
              onKeyDown={e => {
                if (e.key === 'Enter' && canApprove) {
                  e.preventDefault();
                  handleApprove();
                }
              }}
              placeholder="Type your reply..."
              className="w-full text-sm text-[#191b1f] placeholder-[#717680] bg-transparent outline-none disabled:cursor-default"
            />
          </div>
        </div>
        <div className="bg-[#f7f9fa] flex items-center justify-between px-3 py-3 rounded-b-[14px]">
          <span className="text-xs text-[#545861]">Question 1 of 1</span>
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="sm" disabled={isHardLocked} onClick={() => onSkip?.()}>
              Skip
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={!canApprove}
              onClick={handleApprove}
            >
              Approve
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClarificationResultWidget;
