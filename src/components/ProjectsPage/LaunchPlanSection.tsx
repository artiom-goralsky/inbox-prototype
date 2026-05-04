import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Badge } from '@circleco/compass/components/Badge';
import { Icon } from '@circleco/compass/components/Icon';
import { ProgressBar } from '@circleco/compass/components/ProgressBar';
import type { LaunchPlanStep } from './launchProjectData';

interface LaunchPlanSectionProps {
  steps: LaunchPlanStep[];
  tipText: string;
  onStepClick: (step: LaunchPlanStep) => void;
}

const LaunchPlanSection: React.FC<LaunchPlanSectionProps> = ({ steps, tipText, onStepClick }) => {
  const completedCount = steps.filter(s => s.status === 'complete').length;
  const totalCount = steps.length;
  const progressValue = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Typography variant="label-md" color="primary">
          <span className="font-semibold">Launch plan</span>
        </Typography>
        <Badge label={`${completedCount}/${totalCount}`} variant="secondary" />
        <Typography variant="body-sm" color="tertiary">
          Created from onboarding
        </Typography>
      </div>

      {/* Progress bar */}
      <ProgressBar value={progressValue} hideValue layout="horizontal" />

      {/* Step list */}
      <div className="flex flex-col rounded-xl border border-secondary overflow-hidden">
        {steps.map((step) => {
          const isActive = step.status === 'active';
          const isComplete = step.status === 'complete';
          const isPending = step.status === 'pending';

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick(step)}
              className={`flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-secondary last:border-b-0 ${
                isActive ? 'bg-hover' : 'hover:bg-hover'
              } ${isComplete ? 'opacity-55' : ''}`}
            >
              {/* Circle indicator */}
              {isComplete ? (
                <span className="w-6 h-6 rounded-full bg-[#191B1F] flex items-center justify-center shrink-0">
                  <Icon name="checkmark-small" size="sm" className="text-white" />
                </span>
              ) : (
                <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  isActive
                    ? 'bg-[#191B1F] text-white'
                    : 'bg-secondary border border-secondary'
                }`}>
                  <Typography variant="label-xs" color={isActive ? undefined : 'secondary'}>
                    <span className={isActive ? 'text-white' : ''}>{step.number}</span>
                  </Typography>
                </span>
              )}

              {/* Title */}
              <Typography variant="body-sm" color="primary" className={`flex-1 min-w-0 ${isComplete ? 'line-through' : ''}`}>
                {step.title}
              </Typography>

              {/* Skill badge */}
              {step.skill && (
                <Badge label={`✦ ${step.skill}`} variant="secondary" className="shrink-0" />
              )}

              {/* Right side: time / continue / message count */}
              {isPending && (
                <Typography variant="caption" color="tertiary" className="shrink-0">
                  {step.timeEstimate}
                </Typography>
              )}
              {isActive && (
                <Typography variant="label-xs" color="primary" className="shrink-0">
                  Continue →
                </Typography>
              )}
              {isComplete && step.messageCount > 0 && (
                <Typography variant="caption" color="tertiary" className="shrink-0">
                  {step.messageCount} messages
                </Typography>
              )}
            </button>
          );
        })}
      </div>

      {/* Tip box */}
      {tipText && (
        <div className="rounded-xl border border-secondary bg-hover p-4 flex gap-3">
          <Icon name="sparkle" size="sm" className="text-tertiary shrink-0 mt-0.5" />
          <Typography variant="body-sm" color="secondary">
            {tipText}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default LaunchPlanSection;
