import React, { useState, useEffect } from 'react';
import { Reasoning, ReasoningTrigger, ReasoningContent } from './Reasoning';

export interface ThinkingStep {
  label: string;
}

const DEFAULT_STEPS: ThinkingStep[] = [
  { label: 'Thinking...' },
  { label: 'Analyzing your community...' },
  { label: 'Researching best practices...' },
  { label: 'Generating plan...' },
];

const WORD_SPEED = 90;   // ms per word
const STEP_PAUSE = 500;  // ms pause before advancing to next step

interface ThinkingIndicatorProps {
  steps?: ThinkingStep[];
  className?: string;
}

const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({
  steps = DEFAULT_STEPS,
  className,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const currentWords = steps[activeStep]?.label.split(' ') ?? [];
  const stepDone = wordCount >= currentWords.length;

  useEffect(() => {
    if (activeStep >= steps.length) return;

    if (!stepDone) {
      const t = setTimeout(() => setWordCount(w => w + 1), WORD_SPEED);
      return () => clearTimeout(t);
    }

    if (activeStep < steps.length - 1) {
      const t = setTimeout(() => {
        setActiveStep(s => s + 1);
        setWordCount(0);
      }, STEP_PAUSE);
      return () => clearTimeout(t);
    }
  }, [activeStep, wordCount, stepDone, steps.length]);

  return (
    <Reasoning isStreaming className={className}>
      <ReasoningTrigger
        getThinkingMessage={() => <span className="shimmer-text">Thinking...</span>}
      />
      <ReasoningContent>
        <div className="flex flex-col gap-2 py-0.5 text-left">
          {steps.map((step, i) => {
            if (i > activeStep) return null;
            const words = step.label.split(' ');
            const isActive = i === activeStep;
            const shown = isActive ? words.slice(0, wordCount).join(' ') : step.label;
            const printing = isActive && !stepDone;
            return (
              <p key={i} className="text-sm text-tertiary leading-relaxed m-0">
                {shown}
                {printing && (
                  <span className="inline-block w-[1px] h-[0.85em] bg-current align-middle mx-[1px] animate-[blink_0.9s_steps(1)_infinite]" />
                )}
              </p>
            );
          })}
        </div>
      </ReasoningContent>
    </Reasoning>
  );
};

export default ThinkingIndicator;
