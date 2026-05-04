import React, { useState, useEffect, useRef } from 'react';
import { Icon, type IconName } from '@circleco/compass/components/Icon';

export interface ThinkingStep {
  label: string;
}

const DEFAULT_STEPS: ThinkingStep[] = [
  { label: 'Thinking...' },
  { label: 'Analyzing your community...' },
  { label: 'Researching best practices...' },
  { label: 'Generating plan...' },
];

const WORD_SPEED = 70;
const STEP_PAUSE = 400;

/* ── Circle dots spinner ─────────────────────────────────────────── */
const CircleDotsSpinner = () => (
  <svg width="20" height="20" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <circle cx="32" cy="32" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="0s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
    <circle cx="32" cy="14.08" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.123s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
    <circle cx="44.67" cy="19.33" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.247s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
    <circle cx="49.92" cy="32" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.370s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
    <circle cx="44.67" cy="44.67" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.494s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
    <circle cx="32" cy="49.92" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.617s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
    <circle cx="19.33" cy="44.67" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.741s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
    <circle cx="14.08" cy="32" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.864s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
    <circle cx="19.33" cy="19.33" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.988s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
  </svg>
);

/* ── Chevron ─────────────────────────────────────────────────────── */
const Chevron: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    width="20" height="20" viewBox="0 0 20 20" fill="none"
    className={`shrink-0 transition-transform duration-200 text-[#717680] ${open ? 'rotate-180' : 'rotate-0'}`}
  >
    <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ── Skill pill ──────────────────────────────────────────────────── */
const SkillPillInline: React.FC<{ skillId: string; skillIcon?: string; loading: boolean }> = ({ skillId, skillIcon, loading }) => (
  <div className="inline-flex items-center gap-2 bg-[#f7f9fa] border border-[#e4e7eb] rounded-[12px] px-[10px] py-[4px] shrink-0">
    <div className="w-5 h-5 rounded-[4px] bg-[#e4e7eb] flex items-center justify-center shrink-0">
      <Icon name={(skillIcon ?? 'book-filled') as IconName} size="sm" className="text-[#717680]" />
    </div>
    {loading ? (
      <span
        className="text-sm font-medium whitespace-nowrap shimmer-sweep-text"
        style={{ fontFamily: 'inherit' }}
      >
        Loading skill
      </span>
    ) : (
      <span className="text-sm text-[#717680] whitespace-nowrap">Loaded skill</span>
    )}
    <span
      className="text-sm text-[#717680] whitespace-nowrap"
      style={{ fontFamily: "'Geist Mono', 'Fira Mono', 'Courier New', monospace", fontWeight: 500 }}
    >
      &ldquo;{skillId}&rdquo;
    </span>
  </div>
);

/* ── Main component ──────────────────────────────────────────────── */
interface ThinkingIndicatorProps {
  steps?: ThinkingStep[];
  className?: string;
  skill?: string;
  skillIcon?: string;
  done?: boolean;
}

const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({
  steps = DEFAULT_STEPS,
  className,
  skill,
  skillIcon,
  done = false,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [showTrace, setShowTrace] = useState(false);
  const [finished, setFinished] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startTimeRef = useRef(Date.now());

  const currentWords = steps[activeStep]?.label.split(' ') ?? [];
  const stepDone = wordCount >= currentWords.length;
  const allStepsDone = activeStep >= steps.length - 1 && stepDone;

  // Show trace after short delay
  useEffect(() => {
    const t = setTimeout(() => setShowTrace(true), 400);
    return () => clearTimeout(t);
  }, []);

  // Word-by-word printing
  useEffect(() => {
    if (!showTrace || finished) return;
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
  }, [activeStep, wordCount, stepDone, steps.length, showTrace, finished]);

  // Transition to finished
  useEffect(() => {
    if (finished) return;
    if (done) {
      setElapsedSeconds(Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000)));
      setFinished(true);
      return;
    }
    if (!allStepsDone) return;
    const t = setTimeout(() => {
      setElapsedSeconds(Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000)));
      setFinished(true);
    }, 800);
    return () => clearTimeout(t);
  }, [allStepsDone, finished, done]);

  /* ── Done / collapsed state ── */
  if (finished) {
    return (
      <div className={`flex flex-col gap-0 ${className ?? ''}`}>
        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-sm text-[#717680] leading-5">
            Thought for {elapsedSeconds} second{elapsedSeconds !== 1 ? 's' : ''}
          </span>
          <Chevron open={expanded} />
        </button>

        {/* Expandable trace */}
        <div
          className="grid transition-[grid-template-rows] overflow-hidden"
          style={{
            gridTemplateRows: expanded ? '1fr' : '0fr',
            transitionDuration: '250ms',
            transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-4 pt-4 pl-1">
              {skill && (
                <div className="flex gap-4 items-center">
                  <div className="w-px self-stretch bg-[#e4e7eb] shrink-0" />
                  <SkillPillInline skillId={skill} skillIcon={skillIcon} loading={false} />
                </div>
              )}
              <div className="flex flex-col">
                {steps.map((step, i) => (
                  <div key={i} className={`flex gap-3 items-start ${i < steps.length - 1 ? 'mb-3' : ''}`}>
                    <div className="w-px self-stretch bg-[#e4e7eb] shrink-0" style={{ minHeight: 20 }} />
                    <p className="text-sm text-[#717680] leading-relaxed m-0">{step.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Streaming state ── */
  return (
    <div className={`flex flex-col gap-4 ${className ?? ''}`}>
      {/* Header: spinner + gradient "Thinking..." + chevron */}
      <div className="flex items-center justify-between w-full" style={{ height: 20 }}>
        <div className="flex items-center gap-2">
          <CircleDotsSpinner />
          <span
            className="text-sm font-medium leading-5"
            style={{
              background: 'linear-gradient(89.34deg, #3C53E7 2.15%, #8994DC 102.27%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Thinking...
          </span>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          className="shrink-0"
          aria-label="Toggle trace"
        >
          <Chevron open={!expanded} />
        </button>
      </div>

      {/* Expandable trace — open by default while streaming */}
      {showTrace && (
        <div
          className="grid transition-[grid-template-rows] overflow-hidden"
          style={{
            gridTemplateRows: !expanded ? '1fr' : '0fr',
            transitionDuration: '200ms',
            transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        >
          <div className="overflow-hidden">
            <div
              className="flex flex-col gap-4 pl-1"
              style={{ opacity: 0, animation: 'thinkingFadeIn 300ms cubic-bezier(0.23,1,0.32,1) forwards' }}
            >
              {/* Skill pill row */}
              {skill && (
                <div className="flex gap-4 items-center">
                  <div className="w-px self-stretch bg-[#e4e7eb] shrink-0" />
                  <SkillPillInline skillId={skill} skillIcon={skillIcon} loading />
                </div>
              )}

              {/* Reasoning text rows — one border line per step */}
              <div className="flex flex-col">
                {steps.map((step, i) => {
                  if (i > activeStep) return null;
                  const words = step.label.split(' ');
                  const isActive = i === activeStep;
                  const visibleWords = isActive ? words.slice(0, wordCount) : words;
                  const printing = isActive && !stepDone;
                  const isLast = i === activeStep;
                  return (
                    <div key={i} className={`flex gap-3 items-start ${!isLast ? 'mb-3' : ''}`}>
                      <div className="w-px self-stretch bg-[#e4e7eb] shrink-0" style={{ minHeight: 20 }} />
                      <p className="text-sm text-[#717680] leading-relaxed m-0 flex-1 min-w-0">
                        {visibleWords.map((word, wi) => (
                          <span key={wi}>{word}{wi < visibleWords.length - 1 ? ' ' : ''}</span>
                        ))}
                        {printing && (
                          <span className="inline-block w-[1px] h-[0.85em] bg-[#717680] align-middle mx-[1px] animate-[blink_0.9s_steps(1)_infinite]" />
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThinkingIndicator;
