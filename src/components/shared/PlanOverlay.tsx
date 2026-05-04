import React from 'react';
import { Button } from '@circleco/compass/components/Button';
import type { PlanData } from './PlanCard';

const MAX_VISIBLE = 5;

interface PlanOverlayProps {
  plan: PlanData;
  onAccept: () => void;
  onCancel: () => void;
  sensitiveLabel?: string;
  showDetails?: boolean;
  onToggleDetails?: () => void;
}

const PlanOverlay: React.FC<PlanOverlayProps> = ({
  plan,
  onAccept,
  onCancel,
  sensitiveLabel = 'confirmation required',
  showDetails = false,
  onToggleDetails,
}) => {
  const [stepsExpanded, setStepsExpanded] = React.useState(false);
  const steps = plan.sections.map(s => ({
    label: s.title,
    sublabel: s.description !== s.title ? s.description : undefined,
    sensitive: s.sensitive,
  }));

  const visibleSteps = steps.slice(0, MAX_VISIBLE);
  const hiddenSteps = steps.slice(MAX_VISIBLE);
  const hiddenCount = hiddenSteps.length;

  const StepRow = ({ step, isLast }: { step: typeof steps[0]; isLast: boolean }) => (
    <div className="flex gap-2 items-start">
      <div className="flex flex-col items-center shrink-0 self-stretch">
        <div className="pt-[2px]">
          {step.sensitive ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="#d97706" strokeWidth="1" strokeDasharray="3 2"/>
              <path d="M8 5.5v3" stroke="#d97706" strokeWidth="1" strokeLinecap="round"/>
              <circle cx="8" cy="10.5" r="0.6" fill="#d97706"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="#d1d5db" strokeWidth="1"/>
            </svg>
          )}
        </div>
        {!isLast && (
          <div className="flex-1 w-px mt-1" style={{ borderLeft: step.sensitive ? 'none' : '1px dashed var(--color-border-default)' }} />
        )}
      </div>
      <div className={`flex flex-col ${isLast ? '' : 'pb-3'}`}>
        <div className="flex items-center gap-1.5">
          <span className={`text-sm leading-5 ${step.sensitive ? 'text-amber-700' : 'text-secondary'}`}>
            {step.label}
          </span>
          {step.sensitive && (
            <span className="inline-flex items-center gap-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-medium px-1.5 py-0 rounded-full leading-[18px]">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="shrink-0">
                <path d="M4 1L7 7H1L4 1Z" stroke="#b45309" strokeWidth="0.8" strokeLinejoin="round"/>
              </svg>
              {sensitiveLabel}
            </span>
          )}
        </div>
        {/* Detail — visible only when showDetails */}
        {showDetails && step.sublabel && (
          <span className="text-xs text-tertiary leading-[18px] mt-0.5">{step.sublabel}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)] bg-secondary border border-secondary rounded-xl shadow-2xs p-0">
      {/* Inner white card */}
      <div className="bg-primary rounded-xl">

        {/* Header */}
        <div className="flex items-center h-14 px-[18px] border-b border-secondary rounded-t-xl gap-3">
          <span className="text-sm font-semibold text-primary leading-5 flex-1">{plan.title}</span>
          {onToggleDetails && (
            <button
              type="button"
              onClick={onToggleDetails}
              className="text-xs text-[#717680] hover:text-[#191b1f] transition-colors flex items-center gap-1"
            >
              {showDetails ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Hide details
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Show details
                </>
              )}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-5 py-4 flex flex-col gap-3 rounded-b-xl border-b border-secondary">
          <div className="flex flex-col">
            {/* Always-visible steps */}
            {visibleSteps.map((step, i) => (
              <StepRow key={i} step={step} isLast={i === visibleSteps.length - 1 && hiddenCount === 0} />
            ))}

            {/* Animated hidden steps */}
            {hiddenCount > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateRows: stepsExpanded ? '1fr' : '0fr',
                  transition: 'grid-template-rows 350ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div style={{ overflow: 'hidden' }}>
                  {hiddenSteps.map((step, i) => (
                    <StepRow key={i} step={step} isLast={i === hiddenSteps.length - 1} />
                  ))}
                </div>
              </div>
            )}

            {/* Expand button — fades out when expanded */}
            {hiddenCount > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateRows: stepsExpanded ? '0fr' : '1fr',
                  transition: 'grid-template-rows 350ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div style={{ overflow: 'hidden' }}>
                  <button
                    type="button"
                    onClick={() => setStepsExpanded(true)}
                    className="text-sm text-[#3C53E7] hover:underline mt-1 text-left cursor-pointer"
                  >
                    +{hiddenCount} more steps
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-secondary flex items-center justify-end gap-2 px-3 py-3 rounded-b-xl">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" variant="primary" size="sm" onClick={onAccept}>
          Accept
        </Button>
      </div>
    </div>
  );
};

export default PlanOverlay;
