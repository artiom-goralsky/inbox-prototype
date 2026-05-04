import React, { useState, useRef, useEffect } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Badge } from '@circleco/compass/components/Badge';
import { Button } from '@circleco/compass/components/Button';
import { RadioGroup } from '@circleco/compass/components/RadioGroup';
import AgentMessageBox from '../shared/AgentMessageBox';
import ClarifyingQuestions, { type ClarifyingQuestion } from '../shared/ClarifyingQuestions';
import ClarificationAnswersBubble from '../shared/ClarificationAnswersBubble';
import ThinkingIndicator from '../shared/ThinkingIndicator';

/* ── Community type data (from Figma) ────────────────────────────── */

const COMMUNITY_TYPES = [
  { id: 'creator',    emoji: '🎙', label: 'Creator or newsletter',    description: 'Grow your audience with discussion, events, and content' },
  { id: 'membership', emoji: '💎', label: 'Paid membership',          description: 'Gate content, connect members, build recurring revenue' },
  { id: 'brand',      emoji: '🏢', label: 'Brand or SaaS',            description: 'Support customers, gather feedback, build advocates' },
  { id: 'course',     emoji: '🎓', label: 'Course or coaching',       description: 'Deliver programs, run cohorts, track progress' },
  { id: 'nonprofit',  emoji: '🌍', label: 'Non-profit or association', description: 'Organize members, share resources, coordinate action' },
  { id: 'other',      emoji: '✦',  label: 'Something else',           description: "Tell me what you're building — I'll figure out the rest" },
];

/* ── Persona-specific transition messages ────────────────────────── */

const TRANSITION_MESSAGES: Record<string, string> = {
  course:     "Here's your launch plan — set up your course structure first, then invite your first students. Click any step to start.",
  membership: "Here's your launch plan — I've included pricing and access setup early since you're charging from day one. Click any step to start.",
  brand:      "Here's your launch plan — focused on getting your customer community structured and connected to your product. Click any step to start.",
  creator:    "Here's your launch plan — 6 steps to get your community live and your first members in. Click any step to get started.",
  nonprofit:  "Here's your launch plan — built around organizing your members and getting resources in place. Click any step to start.",
  other:      "Based on what you've told me, here's a launch plan. You can reorder or skip any step. Click any to start.",
};

/* ── Launch plan steps per persona ───────────────────────────────── */

export interface PlanStep {
  title: string;
  skill?: string;
  time: string;
}

const PLAN_STEPS: Record<string, PlanStep[]> = {
  course: [
    { title: 'Set up your spaces and structure', skill: 'Set up', time: '5 min' },
    { title: 'Create your first course module', skill: 'Content', time: '10 min' },
    { title: 'Configure pricing and access levels', skill: 'Monetize', time: '5 min' },
    { title: 'Design your student onboarding flow', skill: 'Members', time: '8 min' },
    { title: 'Build your landing page', skill: 'Grow', time: '10 min' },
    { title: 'Invite your first students', skill: 'Members', time: '3 min' },
  ],
  membership: [
    { title: 'Set up your spaces and structure', skill: 'Set up', time: '5 min' },
    { title: 'Configure pricing and paid tiers', skill: 'Monetize', time: '8 min' },
    { title: 'Set up access levels and gating', skill: 'Set up', time: '5 min' },
    { title: 'Create your welcome content', skill: 'Content', time: '10 min' },
    { title: 'Build your landing page', skill: 'Grow', time: '10 min' },
    { title: 'Design your member onboarding', skill: 'Members', time: '8 min' },
  ],
  brand: [
    { title: 'Set up your spaces and structure', skill: 'Set up', time: '5 min' },
    { title: 'Connect your product and branding', skill: 'Set up', time: '8 min' },
    { title: 'Create a welcome space for customers', skill: 'Content', time: '5 min' },
    { title: 'Set up support and feedback channels', skill: 'Content', time: '8 min' },
    { title: 'Configure roles and permissions', skill: 'Members', time: '5 min' },
    { title: 'Invite your first customer advocates', skill: 'Members', time: '3 min' },
  ],
  creator: [
    { title: 'Set up your spaces and structure', skill: 'Set up', time: '5 min' },
    { title: 'Create your first content and posts', skill: 'Content', time: '10 min' },
    { title: 'Set up events and discussions', skill: 'Content', time: '8 min' },
    { title: 'Build your landing page', skill: 'Grow', time: '10 min' },
    { title: 'Design your member onboarding', skill: 'Members', time: '8 min' },
    { title: 'Invite your first members', skill: 'Members', time: '3 min' },
  ],
  nonprofit: [
    { title: 'Set up your spaces and structure', skill: 'Set up', time: '5 min' },
    { title: 'Create your member directory', skill: 'Members', time: '8 min' },
    { title: 'Set up resource library', skill: 'Content', time: '10 min' },
    { title: 'Configure roles and permissions', skill: 'Members', time: '5 min' },
    { title: 'Build your landing page', skill: 'Grow', time: '10 min' },
    { title: 'Invite your first members', skill: 'Members', time: '3 min' },
  ],
  other: [
    { title: 'Set up your spaces and structure', skill: 'Set up', time: '5 min' },
    { title: 'Create your first content', skill: 'Content', time: '10 min' },
    { title: 'Configure access and permissions', skill: 'Set up', time: '5 min' },
    { title: 'Build your landing page', skill: 'Grow', time: '10 min' },
    { title: 'Design your member onboarding', skill: 'Members', time: '8 min' },
    { title: 'Invite your first members', skill: 'Members', time: '3 min' },
  ],
};

// Show all steps in preview (no truncation)

/* ── Context chat questions (per community type) ─────────────────── */

const buildQuestions = (typeId: string): ClarifyingQuestion[] => {
  const questions: ClarifyingQuestion[] = [
    {
      question: 'How big is your audience today?',
      options: [
        'Just getting started — no audience yet',
        'Small but growing — under 500',
        'Established — 500–5,000 across channels',
        'Large — 5,000+',
      ],
    },
  ];

  if (typeId !== 'brand' && typeId !== 'nonprofit') {
    questions.push({
      question: 'Will you charge members?',
      options: [
        'Yes — paid from day one',
        'Free to start, paid later',
        'Mix of free and paid tiers',
        'No — this will be free',
      ],
    });
  }

  questions.push({
    question: 'What matters most right now?',
    options: [
      'Set up my structure and launch',
      'Build content before inviting anyone',
      'Migrate members from another platform',
      'Just exploring — figuring it out',
    ],
  });

  return questions;
};

/* ── Main component ──────────────────────────────────────────────── */

type FlowStep = 'type-selection' | 'context-chat';
type ChatPhase = 'intro-thinking' | 'questions' | 'plan-thinking' | 'plan-preview' | 'offer';

interface NewCommunityFlowProps {
  communityName?: string;
  onSkipToChat?: (message: string) => void;
  onCreateProject?: (typeId: string, steps: PlanStep[], answers: string[]) => void;
  /** When true, conversation shows a building state (project is being created) */
  isBuilding?: boolean;
  /** Restore conversation from a previous session (type + answers) */
  initialSelectedType?: string;
  initialAnswers?: string[];
}

const NewCommunityFlow: React.FC<NewCommunityFlowProps> = ({
  communityName: _communityName,
  onSkipToChat,
  onCreateProject: _onCreateProject,
  isBuilding = false,
  initialSelectedType,
  initialAnswers,
}) => {
  // When restoring from saved state, skip straight to the offer phase
  const hasInitialState = !!(initialSelectedType && initialAnswers?.length);
  const [step, setStep] = useState<FlowStep>(hasInitialState ? 'context-chat' : 'type-selection');
  const [selectedType, setSelectedType] = useState<string | null>(initialSelectedType ?? null);
  const [fadeOut, setFadeOut] = useState(false);

  /* ── Context chat state ── */
  const [chatPhase, setChatPhase] = useState<ChatPhase>(hasInitialState ? 'offer' : 'intro-thinking');
  const [completedAnswers, setCompletedAnswers] = useState<string[]>(initialAnswers ?? []);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [showOffer, setShowOffer] = useState(hasInitialState);

  const questions = selectedType ? buildQuestions(selectedType) : [];
  const planSteps = PLAN_STEPS[selectedType || 'other'] || PLAN_STEPS.other;
  const transitionMessage = TRANSITION_MESSAGES[selectedType || 'other'];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatPhase, completedAnswers, showOffer]);

  /* ── Type selection → chat transition ── */
  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setStep('context-chat');
        setFadeOut(false);
        setTimeout(() => setChatPhase('questions'), 2000);
      }, 250);
    }, 400);
  };

  /* ── Questions completed ── */
  const handleQuestionsComplete = (answers: string[]) => {
    setCompletedAnswers(answers);
    setChatPhase('plan-thinking');
    setTimeout(() => {
      setChatPhase('plan-preview');
      // Show offer message after plan is visible
      setTimeout(() => {
        setChatPhase('offer');
        setShowOffer(true);
      }, 1200);
    }, 2500);
  };

  const handleQuestionsDismiss = () => {
    setChatPhase('plan-thinking');
    setTimeout(() => {
      setChatPhase('plan-preview');
      setTimeout(() => {
        setChatPhase('offer');
        setShowOffer(true);
      }, 1200);
    }, 2500);
  };

  /* ── "Or..." free-text submit — skip to existing path ── */
  const handleFreeTextSubmit = (message: string) => {
    if (!message.trim()) return;
    onSkipToChat?.(message.trim());
  };

  /* ── Step 1: Type Selection ── */
  if (step === 'type-selection') {
    return (
      <div className={`h-full flex flex-col min-h-0 overflow-auto transition-opacity duration-250 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
        <div className="w-full max-w-[652px] mx-auto flex flex-col items-center gap-10 py-16 my-auto">
          {/* Community logo */}
          <img src="/images/clarity-logo.png" alt="Clarity" className="w-9 h-9 rounded-lg" />

          {/* Heading */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-[32px] font-semibold leading-[48px] tracking-[-1px] text-primary" style={{ fontFamily: "'Inter Variable', Inter, sans-serif" }}>
              Let&apos;s build your community together
            </h1>
            <Typography variant="body-md" color="secondary">
              Pick what fits best — I&apos;ll set things up and help you launch.
            </Typography>
          </div>

          {/* Community type cards */}
          <RadioGroup
            legend=""
            legendProps={{ className: 'sr-only' }}
            variant="option-cards"
            optionCardColumns={2}
            optionCardLayout="vertical"
            value={selectedType ?? undefined}
            onValueChange={(value) => handleTypeSelect(value)}
            options={COMMUNITY_TYPES.map(t => ({
              value: t.id,
              label: (
                <span className="flex items-center gap-2">
                  <span className="text-base">{t.emoji}</span>
                  <span>{t.label}</span>
                </span>
              ),
              description: t.description,
            }))}
          />

          {/* "Or..." divider + message box */}
          <div className="flex flex-col items-center gap-6 w-full">
            <Typography variant="body-md" color="secondary">
              Or...
            </Typography>
            <div className="w-full">
              <AgentMessageBox
                placeholder="Tell me what you have in mind..."
                onSubmit={handleFreeTextSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Step 2: Context Gathering Chat ── */
  const selectedLabel = COMMUNITY_TYPES.find(t => t.id === selectedType)?.label ?? '';

  return (
    <div className="h-full flex flex-col min-h-0 animate-[fadeIn_300ms_ease-out]">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-6 py-9">
        <div className="w-full max-w-[678px] mx-auto flex flex-col gap-10">

          {/* User's type selection as a message bubble */}
          <div className="flex flex-col items-end pl-6 animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="bg-secondary rounded-[16px] px-4 py-[10px]">
              <Typography variant="body-md" color="primary">
                {selectedLabel}
              </Typography>
            </div>
          </div>

          {/* Thinking indicator while AI prepares questions (hidden once plan-thinking starts) */}
          {chatPhase === 'intro-thinking' && (
            <div className="animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
              <ThinkingIndicator
                steps={[
                  { label: 'Understanding your community type and preparing relevant questions.' },
                ]}
              />
            </div>
          )}

          {/* AI intro message */}
          {chatPhase !== 'intro-thinking' && (
            <div className="flex flex-col items-start gap-4 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
              <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
              <Typography variant="body-md" color="primary">
                Got it — a few quick questions so I can set things up right:
              </Typography>
            </div>
          )}

          {/* Completed answers — single Q/A bubble */}
          {completedAnswers.length > 0 && (
            <ClarificationAnswersBubble
              pairs={questions.map((q, i) => ({
                question: q.question,
                answer: completedAnswers[i] ?? '',
              }))}
            />
          )}

          {/* Thinking indicator — building plan (stays for trace) */}
          {(chatPhase === 'plan-thinking' || chatPhase === 'plan-preview' || chatPhase === 'offer') && (
            <div className="animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
              <ThinkingIndicator
                done={chatPhase !== 'plan-thinking'}
                steps={[
                  { label: 'Analyzing your answers to create a personalized launch plan.' },
                  { label: 'Building project structure with recommended steps and resources.' },
                ]}
              />
            </div>
          )}

          {/* AI transition message + plan preview card */}
          {(chatPhase === 'plan-preview' || chatPhase === 'offer') && (
            <div className="flex flex-col items-start gap-4 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
              <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
              <div className="flex flex-col gap-4 w-full">
                <Typography variant="body-md" color="primary">
                  {transitionMessage}
                </Typography>

                {/* Compact plan preview card */}
                <div className="rounded-xl border border-secondary bg-primary shadow-sm overflow-hidden">
                  {planSteps.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-4 py-3 border-b border-secondary last:border-b-0"
                    >
                      <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        <Typography variant="label-xs" color="secondary">{i + 1}</Typography>
                      </span>
                      <Typography variant="body-sm" color="primary" className="flex-1 min-w-0">
                        {s.title}
                      </Typography>
                      {s.skill && (
                        <Badge label={s.skill} variant="secondary" />
                      )}
                      <Typography variant="caption" color="tertiary" className="shrink-0">
                        {s.time}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Project creation offer — only when not in portal/restored mode */}
          {showOffer && chatPhase === 'offer' && !hasInitialState && (
            <div className="flex flex-col items-start gap-4 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
              <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
              <div className="flex flex-col gap-4">
                <Typography variant="body-md" color="primary">
                  Want me to set this up as a project? I&apos;ll track your progress and you can work through each step with me whenever you&apos;re ready.
                </Typography>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={() => {
                      _onCreateProject?.(selectedType || 'other', planSteps, completedAnswers);
                    }}
                  >
                    Create launch project
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => {}}
                  >
                    Just chat for now
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Building state — thinking indicator while project is being created */}
          {hasInitialState && isBuilding && (
            <div className="animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
              <ThinkingIndicator
                steps={[
                  { label: 'Creating your project and generating the launch plan...' },
                  { label: 'Setting up step threads so you can work through each one with me.' },
                  { label: 'Saving your community context and preferences.' },
                ]}
              />
            </div>
          )}

          {/* Done message — after building completes */}
          {hasInitialState && !isBuilding && (
            <div className="flex flex-col items-start gap-4 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
              <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
              <Typography variant="body-md" color="primary">
                Done — your project is created. Let me know what you want to do next.
              </Typography>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Clarifying questions — float above input */}
      <div className="shrink-0 px-4">
        <div className="w-full max-w-[678px] mx-auto">
          {chatPhase === 'questions' && (
            <div className="mb-3">
              <ClarifyingQuestions
                questions={questions}
                onComplete={handleQuestionsComplete}
                onDismiss={handleQuestionsDismiss}
              />
            </div>
          )}
        </div>
      </div>

      {/* Message input — hidden during clarifying questions, building, and portal mode */}
      {chatPhase !== 'questions' && !isBuilding && !hasInitialState && (
        <div className="shrink-0 px-4 pt-4 pb-4">
          <div className="w-full max-w-[678px] mx-auto">
            <AgentMessageBox
              placeholder="Message Circle AI..."
              onSubmit={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NewCommunityFlow;
