import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Icon } from '@circleco/compass/components/Icon';
import { IconButton } from '@circleco/compass/components/IconButton';
import { moderationScenario, type ModerationMessage } from './moderationScenarioData';
import type { ScenarioPill } from './inboxScenarioData';
import ModerationConfirmList from './ModerationConfirmList';
import ModerationDecideList from './ModerationDecideList';

interface ModerationSessionProps {
  currentStep: number;
  pillChoices: Record<number, string>;
  onPillClick: (pill: ScenarioPill) => void;
  onConfirmComplete: (confirmed: number, remaining: string[]) => void;
  onDecideComplete: (actions: Record<string, string>) => void;
}

const ModerationMessageRenderer: React.FC<{
  message: ModerationMessage;
  onConfirmComplete: (c: number, r: string[]) => void;
  onDecideComplete: (a: Record<string, string>) => void;
}> = ({ message, onConfirmComplete, onDecideComplete }) => {
  if (message.type === 'heading') {
    return <div className="mt-3"><Typography variant="label-md" color="primary">{message.text}</Typography></div>;
  }
  if (message.type === 'summary-item') {
    return (
      <div className="flex items-start gap-2 mt-1">
        <div className="shrink-0 mt-0.5"><Icon name="circle-check-filled" color="success" size="sm" /></div>
        <Typography variant="body-md" color="primary">{message.text}</Typography>
      </div>
    );
  }
  if (message.type === 'moderation-confirm-list') {
    return <ModerationConfirmList onComplete={onConfirmComplete} />;
  }
  if (message.type === 'moderation-decide-list') {
    return <ModerationDecideList onComplete={onDecideComplete} />;
  }
  // paragraph
  return <Typography variant="body-md" color="primary" className="px-1 whitespace-pre-line">{message.text}</Typography>;
};

const ModerationSession: React.FC<ModerationSessionProps> = ({ currentStep, pillChoices, onPillClick, onConfirmComplete, onDecideComplete }) => (
  <>
    {/* Section divider */}
    <div className="flex items-center gap-3">
      <div className="flex-1 border-t border-secondary" />
      <Typography variant="label-xs" color="tertiary">Moderation session</Typography>
      <div className="flex-1 border-t border-secondary" />
    </div>

    {moderationScenario.map(step => {
      if (step.id > currentStep) return null;

      return (
        <React.Fragment key={step.id}>
          {step.id > 0 && pillChoices[step.id] && (
            <div className="flex flex-col items-end pl-6">
              <div className="bg-secondary rounded-[16px] px-4 py-[10px]">
                <Typography variant="body-md" color="primary">{pillChoices[step.id]}</Typography>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start gap-4">
              <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
              <div className="flex flex-col gap-2 w-full">
                {step.messages.map((msg, i) => (
                  <ModerationMessageRenderer key={i} message={msg} onConfirmComplete={onConfirmComplete} onDecideComplete={onDecideComplete} />
                ))}
              </div>
            </div>
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

export default ModerationSession;
