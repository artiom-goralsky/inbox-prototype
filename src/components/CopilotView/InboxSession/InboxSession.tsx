import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { IconButton } from '@circleco/compass/components/IconButton';
import { inboxScenario, type ScenarioPill } from './inboxScenarioData';
import InboxMessage from './InboxMessage';

interface DeferredInfo {
  sent: number;
  remaining: string[];
}

interface InboxSessionProps {
  currentStep: number;
  pillChoices: Record<number, string>;
  onPillClick: (pill: ScenarioPill) => void;
  onBatchSent?: () => void;
  onNeedsComplete?: (sentCount: number, remainingNames: string[]) => void;
  deferredInfo?: DeferredInfo | null;
}

const InboxSession: React.FC<InboxSessionProps> = ({ currentStep, pillChoices, onPillClick, onBatchSent, onNeedsComplete, deferredInfo }) => (
  <>
    {/* Section divider */}
    <div className="flex items-center gap-3">
      <div className="flex-1 border-t border-secondary" />
      <Typography variant="label-xs" color="tertiary">Inbox session</Typography>
      <div className="flex-1 border-t border-secondary" />
    </div>

    {inboxScenario.map(step => {
      if (step.id > currentStep) return null;

      // Dynamic text for deferred nudge (step 3)
      const messages = step.id === 3 && deferredInfo
        ? step.messages.map(msg => {
            if (msg.type === 'paragraph' && msg.text === '__DEFERRED_TEXT__') {
              const r = deferredInfo.remaining.length;
              const names = deferredInfo.remaining.join(', ');
              return { ...msg, text: `${deferredInfo.sent} handled. ${r} still open \u2014 ${names}. Come back later?` };
            }
            return msg;
          })
        : step.messages;

      return (
        <React.Fragment key={step.id}>
          {/* User pill bubble */}
          {step.id > 0 && pillChoices[step.id] && (
            <div className="flex flex-col items-end pl-6">
              <div className="bg-secondary rounded-[16px] px-4 py-[10px]">
                <Typography variant="body-md" color="primary">{pillChoices[step.id]}</Typography>
              </div>
            </div>
          )}

          {/* AI message group */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start gap-4">
              <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
              <div className="flex flex-col gap-2 w-full">
                {messages.map((msg, i) => (
                  <InboxMessage
                    key={i}
                    message={msg}
                    isFirst={i === 0}
                    onBatchSent={onBatchSent}
                    onNeedsComplete={onNeedsComplete}
                  />
                ))}
              </div>
            </div>

            {/* Reaction row */}
            <div className="flex items-center gap-[5px]">
              <IconButton type="button" variant="ghost" size="sm" icon="thumbup" aria-label="Like" className="text-tertiary" />
              <div className="-scale-y-100">
                <IconButton type="button" variant="ghost" size="sm" icon="thumbup" aria-label="Dislike" className="text-tertiary" />
              </div>
              <IconButton type="button" variant="ghost" size="sm" icon="copy" aria-label="Copy" className="text-tertiary" />
            </div>
          </div>
        </React.Fragment>
      );
    })}
  </>
);

export default InboxSession;
