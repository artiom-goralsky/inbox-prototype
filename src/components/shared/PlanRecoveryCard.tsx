import React from 'react';
import { Button } from '@circleco/compass/components/Button';
import { Typography } from '@circleco/compass/components/Typography';

export interface PlanRecoveryCardProps {
  planTitle: string;
  completedSteps: number;
  totalSteps: number;
  failedStep?: string;
  errorMessage?: string;
  onResume: () => void;
  onSkip?: () => void;
  onDiscard: () => void;
}

const IconError = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="#dc2626" strokeWidth="1.3" />
    <path d="M7 4v3.5" stroke="#dc2626" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="7" cy="10" r="0.65" fill="#dc2626" />
  </svg>
);

const PlanRecoveryCard: React.FC<PlanRecoveryCardProps> = ({
  planTitle,
  completedSteps,
  totalSteps,
  failedStep,
  errorMessage,
  onResume,
  onSkip,
  onDiscard,
}) => (
  <div className="animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)] bg-[#f7f9fa] border border-[#e4e7eb] rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
    <div className="bg-white rounded-t-xl">
      {/* Header */}
      <div className="flex items-center gap-3 px-[18px] h-14 border-b border-[#f0f3f5]">
        <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
          <IconError />
        </div>
        <div className="flex flex-col">
          <Typography variant="label-sm" color="primary">
            <span className="font-semibold">{planTitle} — stopped</span>
          </Typography>
          <Typography variant="caption" color="secondary">
            {completedSteps} of {totalSteps} steps completed
          </Typography>
        </div>
      </div>

      {/* Progress + details */}
      <div className="px-[18px] py-4 flex flex-col gap-3">
        {/* Step progress bar */}
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i < completedSteps
                  ? 'bg-[#3C53E7]'
                  : i === completedSteps
                  ? 'bg-red-400'
                  : 'bg-[#e4e7eb]'
              }`}
            />
          ))}
        </div>

        {failedStep && (
          <div className="flex flex-col gap-0.5">
            <Typography variant="label-xs" color="secondary">Stopped at</Typography>
            <Typography variant="body-sm" color="primary">{failedStep}</Typography>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            <Typography variant="body-sm" color="secondary">{errorMessage}</Typography>
          </div>
        )}
      </div>
    </div>

    {/* Footer */}
    <div className="bg-[#f7f9fa] flex items-center justify-between px-3 py-3">
      <Button type="button" variant="ghost" size="sm" onClick={onDiscard}>
        Discard
      </Button>
      <div className="flex items-center gap-2">
        {onSkip && (
          <Button type="button" variant="outline" size="sm" onClick={onSkip}>
            Skip step
          </Button>
        )}
        <Button type="button" variant="primary" size="sm" onClick={onResume}>
          Resume plan
        </Button>
      </div>
    </div>
  </div>
);

export default PlanRecoveryCard;
