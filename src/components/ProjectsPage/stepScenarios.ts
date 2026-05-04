import type { ThreadMessage } from './launchProjectData';

/* ── Step scenario data ──────────────────────────────────────────── */

export interface StepScenario {
  firstMessage: string;
  artifact: {
    icon: string;
    title: string;
    subtitle?: string;
    status: 'draft' | 'published';
    statusLabel: string;
    rows: { emoji?: string; label: string; detail: string; tag?: string }[];
  };
  primaryAction: string;
  secondaryActions: string[];
}

/** Map from step title prefix → scenario data */
export const STEP_SCENARIOS: Record<string, StepScenario> = {
  'Set up your spaces': {
    firstMessage: "I'll set up your community spaces. For a course community your size, I'd recommend starting lean — you can always add more later. Here's a structure based on what works for similar communities:",
    artifact: {
      icon: '📐',
      title: 'Proposed space structure',
      status: 'draft',
      statusLabel: 'Draft',
      rows: [
        { emoji: '🏠', label: 'Welcome', detail: 'First stop for new members. Houses your welcome post and community guidelines.', tag: 'Public' },
        { emoji: '💬', label: 'General Discussion', detail: 'Open conversation space. Where most daily interaction will happen.', tag: 'Public' },
        { emoji: '📚', label: 'Course Content', detail: 'Your lessons, modules, and learning materials. Gated behind membership.', tag: 'Paid only' },
        { emoji: '🙋', label: 'Q&A', detail: 'Students ask questions, get help from you and each other.', tag: 'Paid only' },
        { emoji: '🏆', label: 'Wins & Progress', detail: "Members share milestones and celebrate each other's progress.", tag: 'Paid only' },
        { emoji: '📢', label: 'Announcements', detail: 'Your updates, new content drops, and event announcements. Admin-only posting.', tag: 'Public' },
      ],
    },
    primaryAction: 'Create these spaces',
    secondaryActions: ['Customize first', 'Start from scratch'],
  },

  'Write your welcome post': {
    firstMessage: "This is the first thing new students see — it sets the tone for everything. I'll keep it short, personal, and action-oriented. Here's a draft:",
    artifact: {
      icon: '📝',
      title: 'Welcome post',
      subtitle: '→ Welcome space',
      status: 'draft',
      statusLabel: 'Draft',
      rows: [
        { label: 'Welcome to Clarity!', detail: '' },
        { label: '', detail: "Hey — glad you're here. This is where we go deeper than the course itself. Ask questions, share what you're working on, connect with others doing the same thing." },
        { label: '', detail: "→ Introduce yourself in the Welcome space — tell us who you are and what you're working on" },
        { label: '', detail: '→ Check out the Course Content space for the latest lessons and materials' },
        { label: '', detail: "→ Jump into Q&A anytime you're stuck — no question is too small" },
        { label: '', detail: "I'm here to help. Let's get started." },
      ],
    },
    primaryAction: 'Publish to Welcome space',
    secondaryActions: ['Edit in composer', 'Save as draft'],
  },

  'Configure onboarding flow': {
    firstMessage: "The onboarding flow is what a new member sees in their first few minutes. For course communities, the goal is to get them to their first lesson or their first interaction — fast. Here's what I'd set up:",
    artifact: {
      icon: '⚡',
      title: 'Onboarding flow',
      status: 'draft',
      statusLabel: 'Draft',
      rows: [
        { label: '1. Welcome message (DM)', detail: "\"Hey [name]! Welcome to Clarity. Here's how to get started...\" — sent automatically via DM from you" },
        { label: '2. Profile prompt', detail: 'Ask: "What are you working on right now?" and "What\'s your biggest challenge?" — answers show on their profile.' },
        { label: '3. Space recommendations', detail: 'Auto-direct to: Welcome, Course Content, Q&A. These 3 spaces appear highlighted in their sidebar.' },
        { label: '4. First action prompt', detail: 'Nudge: "Introduce yourself in the Welcome space" — shows as a banner on their first visit.' },
      ],
    },
    primaryAction: 'Apply this flow',
    secondaryActions: ['Customize steps', 'Preview as new member'],
  },

  'Schedule your first live session': {
    firstMessage: "Communities that host a live event in their first week see 2× higher retention. You don't need anything fancy — a casual welcome call or live Q&A works great. Let me help you set one up.\n\nWhat format works best for you?",
    artifact: {
      icon: '📅',
      title: 'Event',
      status: 'draft',
      statusLabel: 'Draft',
      rows: [
        { label: 'Live Q&A: Ask Me Anything', detail: '' },
        { label: 'Date', detail: 'Thursday at 4:00 PM CET' },
        { label: 'Duration', detail: '45 minutes' },
        { label: 'Format', detail: 'Live Room (interactive, up to 30 people)' },
        { label: 'Space', detail: 'Announcements' },
        { label: 'Description', detail: '"Got questions? Bring them. This is a casual, open session where you can ask anything about the course, your projects, or the community. No prep needed — just show up."' },
      ],
    },
    primaryAction: 'Create this event',
    secondaryActions: ['Change date/time', 'Edit details'],
  },

  'Set up pricing': {
    firstMessage: "Let's set up how you'll charge for access. Based on what I've seen in similar course communities, here's what I'd recommend as a starting point:",
    artifact: {
      icon: '💰',
      title: 'Pricing configuration',
      status: 'draft',
      statusLabel: 'Draft',
      rows: [
        { label: 'Monthly plan', detail: '$39/month' },
        { label: 'Annual plan', detail: '$290/year (save 38%)' },
        { label: 'Free trial', detail: '7 days (card required)' },
        { label: 'Free access', detail: 'Welcome, General Discussion, Announcements' },
        { label: 'Paid only', detail: 'Course Content, Q&A, Wins & Progress' },
        { label: 'Payment', detail: 'Stripe (needs to be connected) · 1% Circle + Stripe fees' },
        { label: 'Why these numbers', detail: 'Average course community membership is $48/mo. Starting at $39 is competitive and gives you room to raise later. The 38% annual discount is the sweet spot for conversion.' },
      ],
    },
    primaryAction: 'Apply this pricing',
    secondaryActions: ['Adjust prices', 'I need help connecting Stripe'],
  },

  'Invite your first': {
    firstMessage: "Your community is set up — spaces, welcome post, onboarding, event, and pricing are all ready. Now let's get your first students in. How do you want to start?",
    artifact: {
      icon: '👋',
      title: 'Invite strategy',
      status: 'draft',
      statusLabel: 'Plan',
      rows: [
        { label: 'Phase 1: Warm launch (this week)', detail: "Invite 15–20 people you know personally — existing students, email subscribers who've replied to you, people who've DM'd you on social. These are your \"founding members\" who'll set the culture." },
        { label: 'Phase 2: Soft launch (week 2)', detail: 'Share invite link with your email list. Frame it as early access, not a public launch. Creates urgency.' },
        { label: 'Phase 3: Public launch (week 3–4)', detail: 'Announce on social, newsletter, and any channels you have. By now the community has activity and social proof.' },
        { label: '⚠️ Important', detail: "Don't invite everyone at once. An empty community with 200 members feels dead. 15 active people feels alive." },
      ],
    },
    primaryAction: 'Generate my invite link',
    secondaryActions: ['Import a CSV', 'Draft an invite email'],
  },
};

/** Find a scenario by matching the beginning of a step title */
export function findScenario(stepTitle: string): StepScenario | undefined {
  for (const [prefix, scenario] of Object.entries(STEP_SCENARIOS)) {
    if (stepTitle.startsWith(prefix)) return scenario;
  }
  return undefined;
}

/** Options for step 4 (live session format) and step 6 (invite method) */
export const STEP_OPTIONS: Record<string, string[]> = {
  'Schedule your first live session': [
    'Live Q&A — I answer questions from members',
    'Welcome call — I introduce the community and what to expect',
    'Workshop — I teach something specific live',
    'Casual hangout — no agenda, just chatting',
  ],
  'Invite your first': [
    'Import from an email list or CSV',
    'Share an invite link on social or newsletter',
    'Send individual invites to specific people',
    'All of the above — what do you recommend?',
  ],
};

/** Find options for a step by matching title prefix */
export function findStepOptions(stepTitle: string): string[] | undefined {
  for (const [prefix, options] of Object.entries(STEP_OPTIONS)) {
    if (stepTitle.startsWith(prefix)) return options;
  }
  return undefined;
}

/** Build the initial messages for a step thread (AI first message + artifact) */
export function buildInitialMessages(stepTitle: string, stepNumber: number): ThreadMessage[] {
  const scenario = findScenario(stepTitle);
  if (!scenario) return [];

  const messages: ThreadMessage[] = [];
  const options = findStepOptions(stepTitle);

  // For steps with options (4 and 6), split: first message without artifact, then options are inline
  if (options) {
    messages.push({
      id: `init-${stepNumber}-1`,
      role: 'assistant',
      content: scenario.firstMessage,
    });
  } else {
    // First message with artifact
    messages.push({
      id: `init-${stepNumber}-1`,
      role: 'assistant',
      content: scenario.firstMessage,
      artifacts: [{
        id: `artifact-${stepNumber}-1`,
        title: scenario.artifact.title,
        content: scenario.artifact.rows.map(r =>
          r.emoji
            ? `${r.emoji}  ${r.label}${r.tag ? ` — ${r.tag}` : ''}\n${r.detail}`
            : r.label
              ? `${r.label}${r.detail ? `\n${r.detail}` : ''}`
              : r.detail
        ).join('\n\n'),
        status: scenario.artifact.status,
        sourceStepNumber: stepNumber,
      }],
    });
  }

  return messages;
}
