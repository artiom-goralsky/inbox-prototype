import React, { useState } from 'react';
import { Button } from '@circleco/compass/components/Button';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Select } from '@circleco/compass/components/Select';

export type SupportHelpType = 'report-bug' | 'give-feedback' | 'ask-question';
export type SupportImpact =
  | 'question-feedback'
  | 'non-critical'
  | 'critical-some'
  | 'access-issue'
  | 'major-feature';

export interface SupportTicketFormData {
  helpType: SupportHelpType;
  helpTypeLabel: string;
  impact: SupportImpact;
  impactLabel: string;
  description: string;
}

interface SupportTicketFormProps {
  initialDescription: string;
  onSubmit: (data: SupportTicketFormData) => void;
}

const HELP_OPTIONS: Array<{ label: string; value: SupportHelpType }> = [
  { label: 'Report a bug', value: 'report-bug' },
  { label: 'Give feedback', value: 'give-feedback' },
  { label: 'Ask a question', value: 'ask-question' },
];

const IMPACT_OPTIONS: Array<{ label: string; value: SupportImpact }> = [
  { label: 'I have a question or feedback', value: 'question-feedback' },
  { label: 'A non-critical issue is slowing me down', value: 'non-critical' },
  { label: 'A critical issue is impacting some members of my community', value: 'critical-some' },
  { label: 'A member or admin cannot access their account', value: 'access-issue' },
  { label: "A major feature doesn't work for my community", value: 'major-feature' },
];

const SupportTicketForm: React.FC<SupportTicketFormProps> = ({ initialDescription, onSubmit }) => {
  const [helpType, setHelpType] = useState<SupportHelpType | null>(null);
  const [impact, setImpact] = useState<SupportImpact | null>(null);
  const [description, setDescription] = useState(initialDescription);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = !submitted && helpType != null && impact != null && description.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const helpLabel = HELP_OPTIONS.find(o => o.value === helpType)?.label ?? '';
    const impactLabel = IMPACT_OPTIONS.find(o => o.value === impact)?.label ?? '';
    setSubmitted(true);
    onSubmit({
      helpType: helpType!,
      helpTypeLabel: helpLabel,
      impact: impact!,
      impactLabel,
      description: description.trim(),
    });
  };

  return (
    <div className="w-full max-w-[678px] animate-[fadeInSlide_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
      <div className="w-full bg-secondary border border-[#e4e7eb] rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="bg-white flex flex-col gap-5 px-5 py-5 rounded-t-[14px]">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-primary">What do you need help with?</span>
            <Select
              aria-label="What do you need help with?"
              placeholder="Select an option"
              options={HELP_OPTIONS}
              onValueChange={v => setHelpType((v?.value as SupportHelpType) ?? null)}
              disabled={submitted}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-primary">How is this impacting your community?</span>
            <Select
              aria-label="How is this impacting your community?"
              placeholder="Select an option"
              options={IMPACT_OPTIONS}
              onValueChange={v => setImpact((v?.value as SupportImpact) ?? null)}
              disabled={submitted}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-primary">What did you find?</span>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              disabled={submitted}
              className="w-full min-h-[120px] max-h-[280px] px-3 py-2 text-sm leading-5 text-primary placeholder:text-disabled bg-primary border border-secondary rounded-md outline-none resize-y disabled:cursor-default"
              placeholder=""
            />
            <span className="text-xs text-tertiary leading-[18px]">
              Describe what you found in as much detail as possible. Details like steps to reproduce your issue, links, or screenshots and videos help us support your best.
            </span>
          </div>
        </div>

        <div className="bg-[#f7f9fa] flex items-center justify-between px-3 py-3 rounded-b-[14px] border-t border-secondary">
          <IconButton
            type="button"
            variant="ghost"
            size="md"
            icon="paperclip"
            aria-label="Attach file"
            disabled={submitted}
          />
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketForm;
