import React, { useState, useRef, useEffect } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Button } from '@circleco/compass/components/Button';
import { mergeClasses } from '../../lib/utils';
import AgentMessageBox from '../shared/AgentMessageBox';

/* ── Constants ──────────────────────────────────────────────────────── */

const COMMUNITY_TYPES = [
  'Course / Coaching',
  'Membership / Subscription',
  'Brand / Creator',
  'Professional Network',
  'Nonprofit / Cause',
];

const ACTIVITIES = [
  'Discussion & Q&A',
  'Live events & workshops',
  'Course content / lessons',
  'Member introductions',
  'Resource library',
  'Accountability / challenges',
];

const ACCESS_MODELS = [
  'Everything open to all members',
  'Free tier + paid tier (some spaces locked)',
  'Multiple paid tiers / levels',
];

const NEXT_STEPS = [
  'Write a welcome post',
  'Schedule a live event',
  "I'm good for now",
];

const SPACE_PLAN = [
  {
    group: 'Welcome',
    groupAccess: 'visible to everyone',
    spaces: [
      { name: 'Start Here', type: 'Posts', access: 'Open', purpose: 'Onboarding guide, community rules, first steps' },
      { name: 'Introductions', type: 'Posts', access: 'Open', purpose: 'New members introduce themselves' },
      { name: 'Announcements', type: 'Posts', access: 'Open', purpose: 'Community-wide updates (admin-only posting)' },
    ],
  },
  {
    group: 'Community',
    groupAccess: 'visible to everyone',
    spaces: [
      { name: 'General Discussion', type: 'Posts', access: 'Open', purpose: 'Main conversation hub for all members' },
      { name: 'Q&A', type: 'Posts', access: 'Open', purpose: 'Ask questions, get answers from peers and coaches' },
      { name: 'Live Events', type: 'Events', access: 'Open', purpose: 'Weekly workshops, office hours, guest sessions' },
    ],
  },
  {
    group: 'Program',
    groupAccess: 'paid members only',
    spaces: [
      { name: 'Course Library', type: 'Course', access: 'Locked', purpose: 'Your course content and lessons' },
      { name: 'Private Coaching', type: 'Posts', access: 'Locked', purpose: 'Exclusive discussion for paying members' },
      { name: 'Resources & Templates', type: 'Posts', access: 'Locked', purpose: 'Downloadable guides, worksheets, templates' },
    ],
  },
];

const BUILD_GROUPS = ['Welcome', 'Community', 'Program'];
const BUILD_SPACES = [
  'Start Here (Posts — Open)',
  'Introductions (Posts — Open)',
  'Announcements (Posts — Open)',
  'General Discussion (Posts — Open)',
  'Q&A (Posts — Open)',
  'Live Events (Events — Open)',
  'Course Library (Course — Locked)',
  'Private Coaching (Posts — Locked)',
  'Resources & Templates (Posts — Locked)',
];
const BUILD_TOTAL = BUILD_GROUPS.length + BUILD_SPACES.length + 1;

const PROJECT_CHECKLIST = [
  { label: 'Define community purpose and audience', done: true },
  { label: 'Set up space structure', done: true, current: true },
  { label: 'Configure branding (logo, colors)', done: false },
  { label: 'Set up member onboarding flow', done: false },
  { label: 'Create invite links', done: false },
  { label: 'Publish seed content', done: false },
  { label: 'Soft launch with founding members', done: false },
];

/* ── Helper Components ──────────────────────────────────────────────── */

function CopilotMsg({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-1 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
      <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
      <div className="flex-1 min-w-0 w-full px-1">{children}</div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-end gap-1 animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
      <div className="bg-secondary rounded-[16px] px-4 py-[10px]">
        <Typography variant="body-md" color="primary">{text}</Typography>
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="flex flex-col items-start gap-1 animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
      <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
      <div className="flex items-center gap-2 px-1">
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-[bounce_1s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
          <span className="w-2 h-2 rounded-full bg-tertiary animate-[bounce_1s_cubic-bezier(0.65,0,0.35,1)_0.15s_infinite]" />
          <span className="w-2 h-2 rounded-full bg-tertiary animate-[bounce_1s_cubic-bezier(0.65,0,0.35,1)_0.3s_infinite]" />
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ done }: { done: boolean }) {
  if (done) {
    return (
      <div className="w-[18px] h-[18px] rounded-full bg-[#22c55e] flex items-center justify-center shrink-0">
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
          <path d="M13.5 4.5L6 12L2.5 8.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  return <div className="w-[18px] h-[18px] rounded-full border-2 border-tertiary shrink-0" />;
}

function BuildSection({ title, items, progress, startIndex }: {
  title: string; items: string[]; progress: number; startIndex: number;
}) {
  return (
    <div>
      <Typography variant="body-sm" color="secondary" className="mb-1.5"><span className="font-semibold">{title}</span></Typography>
      <div className="flex flex-col gap-1">
        {items.map((item, i) => (
          <div key={item} className="flex items-center gap-2">
            <CheckCircle done={progress > startIndex + i} />
            <Typography variant="body-sm" color={progress > startIndex + i ? 'primary' : 'tertiary'}>{item}</Typography>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────── */

interface SpaceSetupFlowProps {
  onBuildModeChange?: (active: boolean) => void;
}

const SpaceSetupFlow: React.FC<SpaceSetupFlowProps> = ({ onBuildModeChange }) => {
  const [step, setStep] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [communityType, setCommunityType] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [activitiesConfirmed, setActivitiesConfirmed] = useState(false);
  const [accessModel, setAccessModel] = useState('');
  const [actionChoice, setActionChoice] = useState('');
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildMode, setBuildMode] = useState(false);
  const [nextStepChoice, setNextStepChoice] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    const t = setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 150);
    return () => clearTimeout(t);
  }, [step, thinking, buildProgress]);

  // Build animation (step 4)
  useEffect(() => {
    if (step !== 4) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < BUILD_TOTAL; i++) {
      timers.push(setTimeout(() => setBuildProgress(i + 1), 350 * (i + 1)));
    }
    timers.push(setTimeout(() => setStep(5), 350 * BUILD_TOTAL + 600));
    return () => timers.forEach(clearTimeout);
  }, [step]);

  const advanceWithThinking = (nextStep: number) => {
    setThinking(true);
    setTimeout(() => { setStep(nextStep); setThinking(false); }, 800);
  };

  const handleCommunityType = (type: string) => {
    setCommunityType(type);
    advanceWithThinking(1);
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity) ? prev.filter(a => a !== activity) : [...prev, activity]
    );
  };

  const confirmActivities = () => {
    setActivitiesConfirmed(true);
    advanceWithThinking(2);
  };

  const handleAccessModel = (model: string) => {
    setAccessModel(model);
    advanceWithThinking(3);
  };

  const handleBuild = () => {
    setActionChoice('Build this structure');
    setBuildProgress(0);
    setBuildMode(true);
    onBuildModeChange?.(true);
    setThinking(true);
    setTimeout(() => { setStep(4); setThinking(false); }, 600);
  };

  const handleStartOver = () => {
    setStep(0);
    setCommunityType('');
    setSelectedActivities([]);
    setActivitiesConfirmed(false);
    setAccessModel('');
    setActionChoice('');
    setBuildProgress(0);
    setBuildMode(false);
    onBuildModeChange?.(false);
    setNextStepChoice('');
    setThinking(false);
  };

  const handleNextStep = (choice: string) => {
    setNextStepChoice(choice);
    advanceWithThinking(6);
  };

  const bp = step >= 5 ? BUILD_TOTAL : buildProgress;

  const chatContent = (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto px-6 py-9">
        <div className={mergeClasses('w-full mx-auto flex flex-col gap-8', buildMode ? 'max-w-none' : 'max-w-[600px]')}>

          {/* ── Step 0: Greeting + community type ── */}
          <CopilotMsg>
            <Typography variant="body-md" color="primary">
              Hey! I&apos;m going to help you set up your community&apos;s spaces. Spaces are where your members will post, discuss, and engage — and space groups are the folders that organize them.
            </Typography>
            <Typography variant="body-md" color="primary" className="mt-3">
              To design the right structure for you, I have a few quick questions.
            </Typography>
            <Typography variant="body-md" color="primary" className="mt-4">
              <span className="font-semibold">What best describes your community?</span>
            </Typography>
            {!communityType && !thinking && (
              <div className="flex flex-wrap gap-2 mt-3">
                {COMMUNITY_TYPES.map(type => (
                  <Button
                    key={type}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => handleCommunityType(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            )}
          </CopilotMsg>

          {communityType && <UserBubble text={communityType} />}

          {/* ── Step 1: Activities (multi-select) ── */}
          {step >= 1 && (
            <CopilotMsg>
              <Typography variant="body-md" color="primary">
                Great — coaching and course communities do really well on Circle. Now let me understand what your members will actually <em>do</em> here day-to-day.
              </Typography>
              <Typography variant="body-md" color="primary" className="mt-4">
                <span className="font-semibold">What are the main activities you want members to have access to?</span>
              </Typography>
              <Typography variant="body-sm" color="tertiary" className="mt-0.5">Pick all that apply.</Typography>
              {step === 1 && !activitiesConfirmed && !thinking && (
                <div className="flex flex-col gap-2 mt-3">
                  <div className="flex flex-wrap gap-2">
                    {ACTIVITIES.map(activity => (
                      <Button
                        key={activity}
                        type="button"
                        size="sm"
                        variant={selectedActivities.includes(activity) ? 'secondary' : 'outline'}
                        className="rounded-full"
                        onClick={() => toggleActivity(activity)}
                      >
                        {activity}
                      </Button>
                    ))}
                  </div>
                  {selectedActivities.length > 0 && (
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      className="self-start rounded-full mt-1"
                      onClick={confirmActivities}
                    >
                      Continue
                    </Button>
                  )}
                </div>
              )}
            </CopilotMsg>
          )}

          {activitiesConfirmed && <UserBubble text={selectedActivities.join(', ')} />}

          {/* ── Step 2: Access model ── */}
          {step >= 2 && (
            <CopilotMsg>
              <Typography variant="body-md" color="primary">
                Perfect. Last question — this one shapes how we set access levels on your spaces.
              </Typography>
              <Typography variant="body-md" color="primary" className="mt-4">
                <span className="font-semibold">How do you want to control access to content?</span>
              </Typography>
              {step === 2 && !accessModel && !thinking && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {ACCESS_MODELS.map(model => (
                    <Button
                      key={model}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleAccessModel(model)}
                    >
                      {model}
                    </Button>
                  ))}
                </div>
              )}
            </CopilotMsg>
          )}

          {accessModel && <UserBubble text={accessModel} />}

          {/* ── Step 3: Space plan artifact ── */}
          {step >= 3 && (
            <CopilotMsg>
              <Typography variant="body-md" color="primary">
                Got it. Based on what you&apos;ve told me, here&apos;s a space structure I&apos;d recommend:
              </Typography>

              <div className="rounded-2xl border border-secondary overflow-hidden mt-3">
                {/* Artifact header */}
                <div className="px-4 py-3 border-b border-secondary flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-tertiary shrink-0">
                    <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <Typography variant="label-md" color="primary"><span className="font-semibold">Space Structure Plan</span></Typography>
                </div>

                {/* Space groups */}
                <div className="px-4 py-4 flex flex-col gap-5">
                  {SPACE_PLAN.map(({ group, groupAccess, spaces }) => (
                    <div key={group}>
                      <div className="flex items-baseline gap-2 mb-2">
                        <Typography variant="label-sm" color="primary"><span className="font-semibold">{group}</span></Typography>
                        <Typography variant="caption" color="tertiary">— {groupAccess}</Typography>
                      </div>
                      <div className="rounded-lg border border-secondary overflow-hidden">
                        {spaces.map((space, i) => (
                          <div key={space.name} className={mergeClasses('px-3 py-2.5', i > 0 && 'border-t border-secondary')}>
                            <div className="flex items-center gap-2">
                              <Typography variant="body-sm" color="primary"><span className="font-medium">{space.name}</span></Typography>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-secondary text-tertiary">{space.type}</span>
                              <span className={mergeClasses(
                                'px-1.5 py-0.5 rounded text-[10px] font-medium',
                                space.access === 'Locked' ? 'bg-secondary text-primary font-semibold' : 'bg-secondary text-tertiary'
                              )}>{space.access}</span>
                            </div>
                            <Typography variant="caption" color="tertiary" className="mt-0.5">{space.purpose}</Typography>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Summary */}
                  <div className="rounded-lg bg-secondary/50 px-3 py-2.5">
                    <Typography variant="body-sm" color="primary">
                      <strong>Summary:</strong> 3 space groups, 9 spaces (6 open, 3 locked behind paywall)
                    </Typography>
                    <Typography variant="caption" color="tertiary" className="mt-1">
                      The <strong>Welcome</strong> group gives new members a clear starting point. The <strong>Community</strong> group keeps free-tier members engaged. The <strong>Program</strong> group is gated behind a paywall for your paid offering.
                    </Typography>
                  </div>
                </div>

                {/* Action buttons */}
                {step === 3 && !actionChoice && (
                  <div className="px-4 py-3 border-t border-secondary flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      startIcon="sparkle"
                      onClick={handleBuild}
                    >
                      Build it
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => setActionChoice('Edit before building')}
                    >
                      Edit before building
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={handleStartOver}
                    >
                      Start over
                    </Button>
                  </div>
                )}
              </div>
            </CopilotMsg>
          )}

          {actionChoice && <UserBubble text={actionChoice} />}

          {/* ── Step 4+: Build progress ── */}
          {step >= 4 && (
            <CopilotMsg>
              <Typography variant="body-md" color="primary">
                <span className="font-medium">Building your spaces now...</span>
              </Typography>
              <div className="flex flex-col gap-4 mt-3">
                <BuildSection title="Creating space groups..." items={BUILD_GROUPS} progress={bp} startIndex={0} />
                {bp >= BUILD_GROUPS.length && (
                  <BuildSection title="Creating spaces..." items={BUILD_SPACES} progress={bp} startIndex={BUILD_GROUPS.length} />
                )}
                {bp >= BUILD_GROUPS.length + BUILD_SPACES.length && (
                  <BuildSection
                    title="Configuring access..."
                    items={['Program spaces linked to paywall access group']}
                    progress={bp}
                    startIndex={BUILD_GROUPS.length + BUILD_SPACES.length}
                  />
                )}
              </div>
            </CopilotMsg>
          )}

          {/* ── Step 5: Completion + next steps ── */}
          {step >= 5 && (
            <CopilotMsg>
              <Typography variant="body-md" color="primary">
                Done! Your community now has <strong>3 space groups</strong> and <strong>9 spaces</strong> ready to go.
              </Typography>
              <Typography variant="body-md" color="primary" className="mt-3">
                Here&apos;s what I&apos;d suggest doing next:
              </Typography>
              <ol className="mt-2 flex flex-col gap-1 list-decimal list-inside">
                <li className="text-[14px] text-primary"><strong>Add a welcome post</strong> to your Start Here space</li>
                <li className="text-[14px] text-primary"><strong>Schedule your first live event</strong> to give members a reason to come back</li>
                <li className="text-[14px] text-primary"><strong>Upload your first course lesson</strong> to the Course Library</li>
              </ol>
              <Typography variant="body-md" color="primary" className="mt-3">
                Want me to help with any of these?
              </Typography>
              {step === 5 && !nextStepChoice && !thinking && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {NEXT_STEPS.map(choice => (
                    <Button
                      key={choice}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleNextStep(choice)}
                    >
                      {choice}
                    </Button>
                  ))}
                </div>
              )}
            </CopilotMsg>
          )}

          {nextStepChoice && <UserBubble text={nextStepChoice} />}

          {/* ── Step 6: Final — project checklist ── */}
          {step >= 6 && (
            <CopilotMsg>
              <Typography variant="body-md" color="primary">
                You&apos;re all set! Your spaces are live and ready for members. You can always come back to this project to add more spaces, adjust access levels, or reorganize your structure.
              </Typography>
              <div className="mt-4 rounded-xl border border-secondary p-4">
                <Typography variant="label-sm" color="primary" className="mb-3"><span className="font-semibold">Project progress updated:</span></Typography>
                <div className="flex flex-col gap-2">
                  {PROJECT_CHECKLIST.map(item => (
                    <div key={item.label} className="flex items-center gap-2.5">
                      <CheckCircle done={item.done} />
                      <Typography variant="body-sm" color={item.done ? 'primary' : 'tertiary'}>
                        <span className={item.current ? 'font-medium' : ''}>
                          {item.label}
                          {item.current && <span className="text-tertiary ml-1">← just completed</span>}
                        </span>
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            </CopilotMsg>
          )}

          {/* Thinking dots */}
          {thinking && <ThinkingDots />}

          <div ref={endRef} />
        </div>
      </div>

      {/* Reply input */}
      <div className="shrink-0 px-4 py-4">
        <div className={mergeClasses('w-full mx-auto', buildMode ? 'max-w-none' : 'max-w-[600px]')}>
          <AgentMessageBox placeholder="Reply to Clara..." onSubmit={() => {}} />
        </div>
      </div>
    </div>
  );

  return <>{chatContent}</>;
};

export default SpaceSetupFlow;
