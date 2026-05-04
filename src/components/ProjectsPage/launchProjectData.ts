/* ── Launch Project Data & Types ──────────────────────────────────── */

export type StepStatus = 'pending' | 'active' | 'awaiting-confirmation' | 'failed' | 'complete';

export type SensitiveAction =
  | 'delete-space'
  | 'delete-user'
  | 'remove-member'
  | 'overwrite-access-rules'
  | 'bulk-migrate'
  | 'revoke-access';

export interface LaunchPlanStep {
  id: string;
  number: number;
  title: string;
  skill: string;
  timeEstimate: string;
  status: StepStatus;
  messageCount: number;
  sensitive?: boolean;
  sensitiveAction?: SensitiveAction;
  confirmationMessage?: string;
}

export interface ThreadMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  artifacts?: ThreadArtifact[];
}

export interface ThreadArtifact {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  sourceStepNumber?: number;
}

export interface ProjectThread {
  id: string;
  title: string;
  stepId?: string;
  messages: ThreadMessage[];
  createdAt: number;
}

export interface LaunchProjectInstructions {
  focus: string;
  tone: string;
  customNotes: string;
}

export interface CommunityContext {
  typeId: string;
  typeLabel: string;
  answers: { question: string; answer: string }[];
}

export type PlanStatus = 'in-progress' | 'awaiting-confirmation' | 'paused' | 'failed' | 'complete';

export interface LaunchProjectData {
  id: string;
  title: string;
  description: string;
  emoji: string;
  communityContext: CommunityContext;
  steps: LaunchPlanStep[];
  threads: ProjectThread[];
  instructions: LaunchProjectInstructions;
  files: { id: string; name: string; size: string }[];
  artifacts: ThreadArtifact[];
  tipText: string;
  suggestionChips: string[];
  planStatus?: PlanStatus;
  failedAtStep?: string;
  errorMessage?: string;
  resumableFrom?: string;
  completedAt?: string;
}

/* ── Base step definition (before modifiers) ─────────────────────── */

interface BaseStep {
  title: string;
  skill: string;
  time: string;
}

/* ── Persona data ────────────────────────────────────────────────── */

const COMMUNITY_TYPE_LABELS: Record<string, string> = {
  course:     'Course or coaching',
  membership: 'Paid membership',
  brand:      'Brand or SaaS',
  creator:    'Creator or newsletter',
  nonprofit:  'Non-profit or association',
  other:      'Something else',
};

const PERSONA_DESCRIPTIONS: Record<string, string> = {
  course:     'Get your course community set up and ready for your first students.',
  membership: 'Get your membership community set up with pricing, gated content, and your first paying members.',
  brand:      'Get your customer community structured, connected to your product, and ready for your first users.',
  creator:    'Get your creator community live and your first audience members in.',
  nonprofit:  'Get your member community organized with resources, directories, and communication channels.',
  other:      'Your custom community, set up based on what you\'ve told me.',
};

const PERSONA_TIPS: Record<string, string> = {
  course:     'Complete steps 1–3 before inviting anyone. Communities that launch with structure in place see 40% higher first-week engagement.',
  membership: 'Test your checkout flow yourself before inviting anyone — a broken payment page is the fastest way to lose a potential member.',
  brand:      'Start with your top 20 most engaged customers. A small, active community feels alive — an empty one with 500 invites feels abandoned.',
  creator:    'Complete steps 1–3 before inviting anyone. Communities that launch with structure in place see 40% higher first-week engagement.',
  nonprofit:  'Set up groups before inviting — members who land in a relevant subgroup on day one are 3× more likely to post in the first week.',
  other:      'No pressure — set things up at your pace. You can always come back and adjust.',
};

const PERSONA_STEPS: Record<string, BaseStep[]> = {
  course: [
    { title: 'Set up your spaces',                skill: 'Space scaffolder',  time: '~2 min' },
    { title: 'Write your welcome post',           skill: 'Content creator',   time: '~1 min' },
    { title: 'Configure onboarding flow',         skill: 'Workflow builder',  time: '~3 min' },
    { title: 'Invite your audience',               skill: 'Member inviter',   time: '~2 min' },
    { title: 'Schedule your first live session',   skill: '',                  time: '~2 min' },
    { title: 'Set up pricing and access',          skill: '',                  time: '~5 min' },
  ],
  membership: [
    { title: 'Set up your spaces',                skill: 'Space scaffolder',  time: '~2 min' },
    { title: 'Set up pricing and tiers',           skill: '',                  time: '~5 min' },
    { title: 'Create your gated content areas',   skill: 'Content creator',   time: '~3 min' },
    { title: 'Write your welcome post',           skill: 'Content creator',   time: '~1 min' },
    { title: 'Configure member onboarding flow',  skill: 'Workflow builder',  time: '~3 min' },
    { title: 'Connect payments and test checkout', skill: '',                  time: '~3 min' },
    { title: 'Invite your first members',          skill: 'Member inviter',   time: '~2 min' },
  ],
  brand: [
    { title: 'Set up your spaces',                skill: 'Space scaffolder',  time: '~2 min' },
    { title: 'Create your knowledge base structure', skill: 'Content creator', time: '~3 min' },
    { title: 'Write your welcome post',           skill: 'Content creator',   time: '~1 min' },
    { title: 'Set up SSO or invite rules',         skill: '',                  time: '~5 min' },
    { title: 'Configure moderation settings',      skill: '',                  time: '~2 min' },
    { title: 'Invite your first customers',        skill: 'Member inviter',   time: '~2 min' },
  ],
  creator: [
    { title: 'Set up your spaces',                skill: 'Space scaffolder',  time: '~2 min' },
    { title: 'Write your welcome post',           skill: 'Content creator',   time: '~1 min' },
    { title: 'Customize your community look',      skill: '',                  time: '~3 min' },
    { title: 'Connect your newsletter or social',  skill: '',                  time: '~2 min' },
    { title: 'Set up pricing and access',          skill: '',                  time: '~3 min' },
    { title: 'Invite your first members',          skill: 'Member inviter',   time: '~2 min' },
  ],
  nonprofit: [
    { title: 'Set up your spaces',                skill: 'Space scaffolder',  time: '~2 min' },
    { title: 'Create your resource library',      skill: 'Content creator',   time: '~3 min' },
    { title: 'Write your welcome post',           skill: 'Content creator',   time: '~1 min' },
    { title: 'Set up member groups and roles',     skill: '',                  time: '~3 min' },
    { title: 'Configure member directory',         skill: '',                  time: '~2 min' },
    { title: 'Invite your first members',          skill: 'Member inviter',   time: '~2 min' },
  ],
  other: [
    { title: 'Set up your spaces',                skill: 'Space scaffolder',  time: '~2 min' },
    { title: 'Write your welcome post',           skill: 'Content creator',   time: '~1 min' },
    { title: 'Customize your look and feel',       skill: '',                  time: '~3 min' },
    { title: 'Configure onboarding flow',         skill: 'Workflow builder',  time: '~3 min' },
    { title: 'Set up pricing (optional)',          skill: '',                  time: '~3 min' },
    { title: 'Invite your first members',          skill: 'Member inviter',   time: '~2 min' },
  ],
};

const SUGGESTION_CHIPS: Record<string, string[]> = {
  course: [
    'Add a milestone: grow to 100 members by May',
    'Create a content calendar for April',
    'Help me prepare for my first cohort launch',
    'Plan my course pricing strategy',
  ],
  membership: [
    'Add a milestone: grow to 100 members by May',
    'Plan a Black Friday promotion for my tiers',
    'Create a content calendar for April',
    'Help me design my membership tiers',
  ],
  brand: [
    'Add a milestone: grow to 100 members by May',
    'Create a content calendar for April',
    'Help me plan a product feedback program',
    'Design a customer advocacy program',
  ],
  creator: [
    'Add a milestone: grow to 100 members by May',
    'Create a content calendar for April',
    'Plan a Black Friday promotion for my tiers',
    'Help me prepare for my first cohort launch',
  ],
  nonprofit: [
    'Add a milestone: grow to 100 members by May',
    'Create a content calendar for April',
    'Help me plan our annual fundraiser',
    'Design a volunteer coordination system',
  ],
  other: [
    'Add a milestone: grow to 100 members by May',
    'Create a content calendar for April',
    'Help me figure out my community model',
    'Plan my first member event',
  ],
};

/* ── Question text for community context ─────────────────────────── */

const QUESTION_TEXTS = [
  'How big is your audience today?',
  'Will you charge members?',
  'What matters most right now?',
];

/* ── Onboarding thread builder ──────────────────────────────────── */

const TRANSITION_MESSAGES: Record<string, string> = {
  course:     "Here's your launch plan — set up your course structure first, then invite your first students.",
  membership: "Here's your launch plan — I've included pricing and access setup early since you're charging from day one.",
  brand:      "Here's your launch plan — focused on getting your customer community structured and connected to your product.",
  creator:    "Here's your launch plan — 6 steps to get your community live and your first members in.",
  nonprofit:  "Here's your launch plan — built around organizing your members and getting resources in place.",
  other:      "Based on what you've told me, here's a launch plan. You can reorder or skip any step.",
};

function buildOnboardingThread(typeId: string, answers: string[]): ProjectThread {
  const typeLabel = COMMUNITY_TYPE_LABELS[typeId] || typeId;
  const hasMonetizationQ = typeId !== 'brand' && typeId !== 'nonprofit';
  const steps = PERSONA_STEPS[typeId] || PERSONA_STEPS.other;
  const planText = steps.map((s, i) => `${i + 1}. ${s.title}`).join('\n');

  const messages: ThreadMessage[] = [];
  let msgId = 0;
  const id = () => `onboarding-msg-${++msgId}`;

  // User's type selection
  messages.push({ id: id(), role: 'user', content: typeLabel });

  // AI asks questions
  messages.push({ id: id(), role: 'assistant', content: 'Got it — a few quick questions so I can set things up right:' });

  // User answers
  if (answers[0]) messages.push({ id: id(), role: 'user', content: answers[0] });
  if (hasMonetizationQ && answers[1]) messages.push({ id: id(), role: 'user', content: answers[1] });
  const priorityAnswer = hasMonetizationQ ? answers[2] : answers[1];
  if (priorityAnswer) messages.push({ id: id(), role: 'user', content: priorityAnswer });

  // AI presents plan as conversational artifact
  const transitionMsg = TRANSITION_MESSAGES[typeId] || TRANSITION_MESSAGES.other;
  messages.push({
    id: id(),
    role: 'assistant',
    content: transitionMsg,
    artifacts: [{
      id: `artifact-onboarding-plan`,
      title: 'Launch plan',
      content: planText,
      status: 'draft' as const,
    }],
  });

  // AI offers project creation
  messages.push({
    id: id(),
    role: 'assistant',
    content: "Want me to set this up as a project? I'll track your progress and you can work through each step with me whenever you're ready.",
  });

  // User accepts
  messages.push({ id: id(), role: 'user', content: 'Create launch project' });

  // AI confirms
  messages.push({
    id: id(),
    role: 'assistant',
    content: "Done — your project is created. You can start any of these steps by opening a new conversation. Let me know what you want to tackle first.",
  });

  return {
    id: `thread-onboarding-${Date.now()}`,
    title: 'Setting up your community',
    messages,
    createdAt: Date.now(),
  };
}

/* ── Full project builder ────────────────────────────────────────── */

export function buildLaunchProject(
  typeId: string,
  answers: string[],
): LaunchProjectData {
  // Build community context with Q&A pairs
  const hasMonetizationQ = typeId !== 'brand' && typeId !== 'nonprofit';
  const contextAnswers: { question: string; answer: string }[] = [
    { question: QUESTION_TEXTS[0], answer: answers[0] || 'N/A' },
  ];
  if (hasMonetizationQ) {
    contextAnswers.push({ question: QUESTION_TEXTS[1], answer: answers[1] || 'N/A' });
    contextAnswers.push({ question: QUESTION_TEXTS[2], answer: answers[2] || 'N/A' });
  } else {
    contextAnswers.push({ question: QUESTION_TEXTS[1], answer: 'N/A' });
    contextAnswers.push({ question: QUESTION_TEXTS[2], answer: answers[1] || 'N/A' });
  }

  // Single onboarding thread with the conversation from setup
  const onboardingThread = buildOnboardingThread(typeId, answers);

  return {
    id: `launch-${typeId}-${Date.now()}`,
    title: 'Launch your community',
    description: PERSONA_DESCRIPTIONS[typeId] || PERSONA_DESCRIPTIONS.other,
    emoji: '🚀',
    communityContext: {
      typeId,
      typeLabel: COMMUNITY_TYPE_LABELS[typeId] || typeId,
      answers: contextAnswers,
    },
    steps: (PERSONA_STEPS[typeId] || PERSONA_STEPS.other).map((s, i) => ({
      id: `step-${i + 1}`,
      number: i + 1,
      title: s.title,
      skill: s.skill,
      timeEstimate: s.time,
      status: (i < 2 ? 'complete' : 'pending') as StepStatus,
      messageCount: 0,
    })),
    threads: [onboardingThread],
    instructions: {
      focus: '',
      tone: 'Friendly and encouraging',
      customNotes: '',
    },
    files: [],
    artifacts: [],
    tipText: '',
    suggestionChips: [],
  };
}
