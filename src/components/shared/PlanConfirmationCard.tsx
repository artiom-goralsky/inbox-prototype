import React from 'react';
import { Button } from '@circleco/compass/components/Button';
import { Typography } from '@circleco/compass/components/Typography';

export interface PlanConfirmationCardProps {
  stepTitle: string;
  message: string;
  consequence?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const IconWarning = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1.5L12.5 12H1.5L7 1.5Z" stroke="#b45309" strokeWidth="1.3" strokeLinejoin="round" fill="none" />
    <path d="M7 5.5v3" stroke="#b45309" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="7" cy="10" r="0.65" fill="#b45309" />
  </svg>
);

const PlanConfirmationCard: React.FC<PlanConfirmationCardProps> = ({
  stepTitle,
  message,
  consequence,
  onConfirm,
  onCancel,
}) => (
  <div className="animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)] bg-secondary border border-secondary rounded-xl shadow-2xs p-[2px]">
    <div className="bg-primary rounded-t-xl">
      {/* Header */}
      <div className="flex items-center gap-3 h-14 px-[18px] border-b border-secondary">
        <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
          <IconWarning />
        </div>
        <Typography variant="label-sm" color="primary">
          <span className="font-semibold">{stepTitle}</span>
        </Typography>
      </div>

      {/* Body */}
      <div className="px-[18px] py-4 flex flex-col gap-3">
        <Typography variant="body-sm" color="primary">{message}</Typography>
        {consequence && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <Typography variant="body-sm" color="secondary">{consequence}</Typography>
          </div>
        )}
      </div>
    </div>

    {/* Footer */}
    <div className="bg-secondary flex items-center justify-end gap-2 px-3 py-3 rounded-b-xl">
      <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="button" variant="primary" size="sm" onClick={onConfirm}>
        Confirm &amp; continue
      </Button>
    </div>
  </div>
);

export default PlanConfirmationCard;
