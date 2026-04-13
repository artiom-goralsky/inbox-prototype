import React, { useState, useEffect, useRef } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Icon } from '@circleco/compass/components/Icon';
import { TextInput } from '@circleco/compass/components/TextInput';
import { IconButton } from '@circleco/compass/components/IconButton';
import { BreadCrumbs } from '@circleco/compass/components/BreadCrumbs';
import { mergeClasses } from '../../lib/utils';
import AgentMessageBox from '../shared/AgentMessageBox';
import ClarifyingQuestions, { type ClarifyingQuestion } from '../shared/ClarifyingQuestions';
import PlanCard, { type PlanData } from '../shared/PlanCard';
import ThinkingIndicator from '../shared/ThinkingIndicator';
import SpaceSetupFlow from './SpaceSetupFlow';
import PageBuilderMode from './PageBuilderMode';
import InboxSession from './InboxSession/InboxSession';
import InboxPills from './InboxSession/InboxPills';
import ModerationSession from './InboxSession/ModerationSession';
import { inboxScenario, type ScenarioPill } from './InboxSession/inboxScenarioData';
import { moderationScenario } from './InboxSession/moderationScenarioData';

import { type AssetItem } from '../shared/AssetDetailSidebar';
export type { AssetItem as CopilotAsset } from '../shared/AssetDetailSidebar';
type CopilotAsset = AssetItem;

import { CHAT_DATA } from '../../data/chatData';
const RECENT_CHATS = CHAT_DATA;

const ONBOARDING_ASSET: CopilotAsset = {
  id: 'onboarding',
  title: 'Onboarding breakdown',
  subtitle: 'This week',
  type: 'asset',
};

const LANDING_PAGE_ASSET: CopilotAsset = {
  id: 'landing-page',
  title: 'Landing page',
  type: 'page',
};

const SHORTCUT_BUILD_ASSET: CopilotAsset = {
  id: 'shortcut-build',
  title: 'Build result',
  type: 'build-frame',
};

/* ── Plan flow data ───────────────────────────────────────────────── */

const PLAN_QUESTIONS: ClarifyingQuestion[] = [
  {
    question: 'What type of project are you planning?',
    options: [
      'Community or membership platform',
      'Course or education product',
      'Content library or resource hub',
      'Marketing or growth campaign',
    ],
  },
  {
    question: 'What\'s your budget per night for this trip?',
    options: ['$250-400/night', '$400-600/night', '$600+/night'],
  },
  {
    question: 'What\'s the main goal?',
    options: [
      'Launch something new from scratch',
      'Improve or optimize what I have',
      'Automate and scale operations',
      'Grow revenue or membership',
    ],
  },
  {
    question: 'How soon do you need this done?',
    options: ['This week', 'Within 2 weeks', 'Within a month', 'No rush — planning ahead'],
  },
];

const generatePlan = (_answers: string[]): PlanData => ({
  title: 'Creative Request Library',
  iconColor: '#dcfce7',
  sections: [
    {
      title: 'Manage creative request intake',
      description: 'Centralize all incoming creative requests through standardized intake forms to eliminate scattered submissions and ensure complete project briefs.',
      details: [
        'Create a Requests table with fields for request name, description, request type, priority, due date, status, and assigned team member',
        'Create a Stakeholders table to manage information about requesters including name, email, department, and role',
        'Create a Creative Request Intake Form connected to the Requests table with required fields for project details, timeline, and requirements',
        'Create a Creative Requests Dashboard with charts showing requests by status, priority, and type, plus metrics for active and upcoming requests',
        'Create an automation that sends email notifications to the creative team when new requests are submitted through the intake form',
      ],
    },
    {
      title: 'Coordinate multi-stage review process',
      description: 'Guide creative projects through structured review stages with clear handoffs and approval checkpoints to maintain quality and accountability.',
      details: [
        'Create an Assets table to track deliverables with fields for asset name, file type, version number, and approval status',
        'Create a Review Process Kanban page that organizes requests by status (New Request, In Progress, In Review, Revisions Needed, Approved, Delivered)',
        'Link the Requests table to the Assets table to connect creative requests with their deliverables',
        'Link the Stakeholders table to the Requests table to identify requesters and reviewers',
      ],
    },
    {
      title: 'Track request status and delivery',
      description: 'Provide real-time visibility into request progress and final asset delivery to keep stakeholders informed and projects on schedule.',
      details: [
        'Create a Request Tracker list page showing all creative requests with their details, status, due dates, and assigned team members',
        'Add filtering capabilities to the Request Tracker by status, priority, and due date',
        'Extend the Creative Requests Dashboard to include metrics on request progress and completion rates',
        'Create an automation that sends reminder emails when request due dates are approaching (3 days before)',
      ],
    },
  ],
});

/* ── Fresh conversation reply generator ──────────────────────────── */

function generateFreshReply(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('member') || lower.includes('onboard') || lower.includes('churn') || lower.includes('retention')) {
    return "I've pulled the latest member data for you. This week we had 6 new sign-ups — 4 have completed onboarding (67% completion), and 2 are still stuck at the goals survey step. The biggest churn signal right now is members who haven't posted in their first 7 days. Want me to build a re-engagement sequence for that segment?";
  }
  if (lower.includes('revenue') || lower.includes('payment') || lower.includes('subscription') || lower.includes('paywall')) {
    return "I'm looking at your revenue metrics now. MRR is up 4.2% this month, driven mostly by annual plan conversions. You have 3 trials expiring in the next 48 hours — I can draft a nudge sequence for those if you'd like. Anything specific you want to dig into?";
  }
  if (lower.includes('content') || lower.includes('post') || lower.includes('space') || lower.includes('course')) {
    return "Here's what I'm seeing in your content data: your top 3 spaces by engagement are General Discussion, Resource Library, and Weekly Check-ins. Posts with questions get 3× more replies than announcements. Want me to suggest a content calendar based on what's working?";
  }
  if (lower.includes('email') || lower.includes('broadcast') || lower.includes('campaign')) {
    return "Your last broadcast had a 41% open rate — well above average. I can see 3 segments that haven't been reached in the last 30 days. Want me to draft a targeted re-engagement campaign for each, or would you prefer to focus on one first?";
  }
  if (lower.includes('setup') || lower.includes('configure') || lower.includes('setting') || lower.includes('domain')) {
    return "I can walk you through that configuration. Let me check your current setup first — I'm reading your community settings, active spaces, and any pending configuration items. Give me a moment and I'll tell you exactly what needs attention.";
  }
  return "Got it. I'm pulling relevant context from your community — member activity, recent content, and configuration — to make sure my response is grounded in what's actually happening. What would you like to focus on first?";
}

/* ── Shortcut task flow — dynamic questions & plans per task ──────── */

interface ShortcutFlowData {
  greeting: string;
  questions: ClarifyingQuestion[];
  generatePlan: (answers: string[]) => PlanData;
  planIntro: string;
}

function getShortcutFlowData(task: string): ShortcutFlowData {
  const lower = task.toLowerCase();

  if (lower.includes('spaces') || lower.includes('community structure')) {
    return {
      greeting: `Great choice! I'll help you create your spaces and community structure. Let me ask a few questions so I can build the right plan for you.`,
      questions: [
        { question: 'What type of community are you building?', options: ['Professional/networking', 'Course/education', 'Membership/subscription', 'Brand community'] },
        { question: 'How many spaces do you need to start?', options: ['1-3 focused spaces', '4-6 spaces', '7+ spaces with categories'] },
      ],
      planIntro: `Here's a plan to set up your community structure with the right spaces, permissions, and organization.`,
      generatePlan: () => ({
        title: 'Community Structure Setup',
        iconColor: '#dbeafe',
        sections: [
          { title: 'Create core spaces', description: 'Set up your primary community spaces with descriptions, icons, and welcome posts.', details: ['Create a Welcome & Introductions space for new member onboarding', 'Create a General Discussion space for community-wide conversations', 'Create topic-specific spaces based on your community focus areas', 'Add space descriptions, cover images, and posting guidelines'] },
          { title: 'Configure space permissions', description: 'Set up who can access, post, and moderate each space.', details: ['Configure access groups for each space (public, members-only, premium)', 'Assign moderators to each space', 'Set posting permissions (open discussion vs. curated content)'] },
          { title: 'Set up navigation and discovery', description: 'Organize your spaces so members can easily find and engage with content.', details: ['Organize spaces into categories in your navigation', 'Pin important spaces to the top of the sidebar', 'Create a community map or welcome guide linking to key spaces'] },
        ],
      }),
    };
  }

  if (lower.includes('access group') || lower.includes('permission')) {
    return {
      greeting: `I'll help you set up access groups and permissions. Let me understand your needs first.`,
      questions: [
        { question: 'What access levels do you need?', options: ['Free + paid tiers', 'Multiple membership levels', 'Role-based (admin, mod, member)', 'Course-specific access'] },
        { question: 'How many distinct groups?', options: ['2-3 groups', '4-5 groups', '6+ groups'] },
      ],
      planIntro: `Here's a plan to configure your access groups and permissions structure.`,
      generatePlan: () => ({
        title: 'Access Groups & Permissions',
        iconColor: '#fef3c7',
        sections: [
          { title: 'Define access tiers', description: 'Create your membership tiers with clear boundaries on what each level unlocks.', details: ['Create a Free tier with access to public spaces and limited content', 'Create a Premium tier with full community access and exclusive content', 'Set up a VIP/Founder tier with early access and special perks'] },
          { title: 'Configure space-level permissions', description: 'Map each space to the appropriate access groups.', details: ['Assign public spaces to all members', 'Lock premium spaces behind paid access groups', 'Set up moderation permissions per tier'] },
          { title: 'Set up automated access management', description: 'Automate member access based on sign-up, purchase, or activity.', details: ['Connect paywall purchases to automatic access group assignment', 'Create workflows for trial-to-paid conversions', 'Set up access revocation for expired subscriptions'] },
        ],
      }),
    };
  }

  if (lower.includes('domain') || lower.includes('branding')) {
    return {
      greeting: `Let's get your custom domain and branding set up! A few quick questions first.`,
      questions: [
        { question: 'Do you already have a domain?', options: ['Yes, I have a domain ready', 'No, I need to purchase one', 'I want to use a subdomain for now'] },
        { question: 'What branding assets do you have?', options: ['Logo + brand colors', 'Full brand kit (logo, colors, fonts)', 'Starting from scratch'] },
      ],
      planIntro: `Here's your plan for setting up custom branding and domain configuration.`,
      generatePlan: () => ({
        title: 'Custom Domain & Branding',
        iconColor: '#ede9fe',
        sections: [
          { title: 'Configure custom domain', description: 'Point your domain to your community and set up SSL for secure access.', details: ['Add your custom domain in community settings', 'Configure DNS records (CNAME/A record) at your registrar', 'Verify domain and enable SSL certificate'] },
          { title: 'Apply brand identity', description: 'Customize colors, logos, and typography to match your brand.', details: ['Upload primary and secondary logos', 'Set brand colors for buttons, links, and accents', 'Customize email templates with your branding'] },
          { title: 'Customize landing pages', description: 'Design your public-facing pages to convert visitors into members.', details: ['Customize your community homepage layout', 'Design your sign-up and login pages', 'Set up a custom 404 page and favicon'] },
        ],
      }),
    };
  }

  if (lower.includes('invite') || lower.includes('onboard') || lower.includes('first member')) {
    return {
      greeting: `Let's get your first members in and set up a great onboarding experience! A couple of questions first.`,
      questions: [
        { question: 'Where are your members coming from?', options: ['Email list', 'Social media following', 'Existing course/product customers', 'Starting from zero'] },
        { question: 'What should onboarding include?', options: ['Just a welcome message', 'Profile setup + intro post', 'Full guided tour with milestones', 'Automated drip sequence'] },
      ],
      planIntro: `Here's a plan to invite and onboard your first members with a great first experience.`,
      generatePlan: () => ({
        title: 'Member Invitation & Onboarding',
        iconColor: '#dcfce7',
        sections: [
          { title: 'Set up invitation channels', description: 'Create invite links and email campaigns to bring in your first members.', details: ['Generate shareable invite links for different channels', 'Draft invitation email templates', 'Set up social sharing cards with community preview'] },
          { title: 'Build onboarding flow', description: 'Guide new members through their first experience to maximize activation.', details: ['Create a welcome message sequence', 'Set up profile completion prompts', 'Design an introduction post template for new members', 'Add onboarding checklist with key first actions'] },
          { title: 'Automate follow-ups', description: 'Keep new members engaged with automated touchpoints.', details: ['Send day-1, day-3, and day-7 follow-up emails', 'Trigger notifications when peers engage with their intro post', 'Create a re-engagement workflow for members who haven\'t completed onboarding'] },
        ],
      }),
    };
  }

  if (lower.includes('paywall') || lower.includes('pricing')) {
    return {
      greeting: `Let's set up your paywall and pricing. A few questions to get the right structure.`,
      questions: [
        { question: 'What pricing model do you prefer?', options: ['Monthly subscription', 'Annual subscription', 'One-time payment', 'Tiered pricing (multiple plans)'] },
        { question: 'What\'s your target price range?', options: ['Under $20/month', '$20-50/month', '$50-100/month', '$100+/month'] },
      ],
      planIntro: `Here's your monetization plan with paywall setup and pricing tiers.`,
      generatePlan: () => ({
        title: 'Paywall & Pricing Setup',
        iconColor: '#dcfce7',
        sections: [
          { title: 'Configure pricing tiers', description: 'Set up your membership plans with clear value propositions for each level.', details: ['Create your primary membership plan with monthly and annual pricing', 'Set up a free tier or trial period to lower the barrier to entry', 'Add premium add-ons or higher tiers for power users'] },
          { title: 'Connect payment processing', description: 'Set up Stripe integration and configure payment settings.', details: ['Connect your Stripe account', 'Configure currency and tax settings', 'Set up invoice and receipt email templates'] },
          { title: 'Build conversion funnels', description: 'Create compelling sales pages and upgrade prompts.', details: ['Design your pricing page with feature comparisons', 'Set up upgrade prompts within free-tier spaces', 'Create a checkout flow with testimonials and social proof'] },
        ],
      }),
    };
  }

  if (lower.includes('course') || lower.includes('lesson')) {
    return {
      greeting: `I'll help you build out your course structure. Let me ask a couple of things first.`,
      questions: [
        { question: 'What type of course?', options: ['Self-paced video course', 'Cohort-based live course', 'Drip content over time', 'Mixed (videos + live sessions)'] },
        { question: 'How many lessons/modules?', options: ['Under 10 lessons', '10-20 lessons', '20+ lessons across multiple modules'] },
      ],
      planIntro: `Here's a plan to build your course with lessons, modules, and scheduling.`,
      generatePlan: () => ({
        title: 'Course Creation Plan',
        iconColor: '#fef3c7',
        sections: [
          { title: 'Structure your curriculum', description: 'Organize your course into logical modules and lessons.', details: ['Define your course modules and learning outcomes', 'Create lesson outlines for each module', 'Set up prerequisite relationships between lessons'] },
          { title: 'Build course content', description: 'Upload media, create lesson pages, and configure assessments.', details: ['Upload or record video content for each lesson', 'Add supplementary materials (PDFs, worksheets, resources)', 'Create quizzes or assignments for knowledge checks'] },
          { title: 'Configure delivery and access', description: 'Set up drip schedules, access rules, and completion tracking.', details: ['Configure drip schedule for content release', 'Connect course access to your paywall tiers', 'Set up completion certificates and badges', 'Enable progress tracking and analytics'] },
        ],
      }),
    };
  }

  if (lower.includes('engagement') || lower.includes('gamification') || lower.includes('participation')) {
    return {
      greeting: `Let's boost your community engagement! A few questions to tailor the right strategy.`,
      questions: [
        { question: 'What\'s your current engagement level?', options: ['Just launched, building from zero', 'Some activity, want more', 'Active but want deeper engagement', 'Declining, need to re-engage'] },
        { question: 'What engagement mechanics interest you?', options: ['Points and leaderboards', 'Badges and achievements', 'Challenges and streaks', 'All of the above'] },
      ],
      planIntro: `Here's a plan to boost engagement with gamification and community-driven participation.`,
      generatePlan: () => ({
        title: 'Engagement & Gamification Plan',
        iconColor: '#fce7f3',
        sections: [
          { title: 'Set up gamification system', description: 'Create a points and rewards system that encourages meaningful participation.', details: ['Configure point values for different actions (posting, commenting, reacting)', 'Create a leaderboard visible to all members', 'Design badges for key milestones (first post, 10 comments, 30-day streak)'] },
          { title: 'Launch engagement campaigns', description: 'Create structured activities that drive regular participation.', details: ['Set up weekly discussion prompts', 'Create monthly challenges with prizes or recognition', 'Design a welcome challenge for new members'] },
          { title: 'Monitor and optimize', description: 'Track engagement metrics and iterate on what works.', details: ['Set up engagement dashboards to track participation trends', 'Identify top contributors and at-risk members', 'A/B test different engagement strategies'] },
        ],
      }),
    };
  }

  if (lower.includes('navigation') || lower.includes('landing page')) {
    return {
      greeting: `I'll help you set up navigation and landing pages! Let me ask a couple of questions first.`,
      questions: [
        { question: 'What type of landing page do you need?', options: ['Community homepage', 'Sales / conversion page', 'Event registration page', 'Course enrollment page'] },
        { question: 'What sections should the page include?', options: ['Hero + features + CTA', 'Hero + testimonials + pricing', 'Full page with all sections', 'Minimal — hero and CTA only'] },
      ],
      planIntro: `Here's a plan for your landing page with navigation setup. I've also generated a draft you can preview and edit.`,
      generatePlan: () => ({
        title: 'Navigation & Landing Page Setup',
        iconColor: '#dbeafe',
        sections: [
          { title: 'Design landing page', description: 'Create a high-converting landing page with hero, features, testimonials, and CTA sections.', details: ['Design hero section with headline, description, and call-to-action', 'Build features grid showcasing key community offerings', 'Add social proof with member testimonials', 'Create a compelling final CTA section'] },
          { title: 'Configure navigation', description: 'Set up your community navigation to guide visitors and members.', details: ['Configure top navigation with key pages', 'Set up sidebar navigation for community spaces', 'Add footer links for legal and support pages'] },
          { title: 'Optimize for conversion', description: 'Fine-tune your landing page for maximum sign-ups.', details: ['Add meta tags and social sharing preview', 'Optimize page load speed and mobile responsiveness', 'Set up analytics tracking for conversion events'] },
        ],
      }),
    };
  }

  // Default fallback for any other task
  return {
    greeting: `I'll help you with that! Let me ask a few questions so I can create the right plan for you.`,
    questions: [
      { question: 'What\'s your top priority for this?', options: ['Get it done quickly', 'Do it thoroughly and right', 'Start small and iterate', 'Need a full strategy first'] },
      { question: 'How much have you already set up?', options: ['Starting from scratch', 'Some basics in place', 'Most things configured, need optimization'] },
    ],
    planIntro: `Here's a plan based on your goals. Does this look right, or would you like to adjust anything?`,
    generatePlan: () => ({
      title: task,
      iconColor: '#dbeafe',
      sections: [
        { title: 'Assess current state', description: `Review your existing setup and identify gaps for "${task}".`, details: ['Audit current configuration and settings', 'Identify quick wins and high-impact changes', 'Document requirements and success criteria'] },
        { title: 'Implement core changes', description: 'Make the key configuration changes and set up the foundation.', details: ['Configure primary settings and integrations', 'Set up any required automations or workflows', 'Create necessary content or templates'] },
        { title: 'Test and optimize', description: 'Verify everything works and optimize based on initial results.', details: ['Test the complete flow end-to-end', 'Gather feedback from a small group', 'Iterate and refine based on results'] },
      ],
    }),
  };
}

interface CopilotViewProps {
  onClose: () => void;
  onAssetClick: (asset: CopilotAsset) => void;
  activeChatId: string;
  onChatSelect: (chatId: string) => void;
  /** Used by overlay for entrance transition */
  isEntering?: boolean;
  initialMessage?: string;
  hideInput?: boolean;
  skillMention?: string | null;
  skillUseCase?: string | null;
  /** When set, opens a new chat and auto-starts a task flow for this shortcut */
  shortcutTask?: string | null;
  onBuildMode?: (active: boolean) => void;
  /** Notify parent when the recent chats drawer is opened or closed. */
  onDrawerOpenChange?: (open: boolean) => void;
  /** Toggle maximized state */
  onMaximize?: () => void;
  /** Whether copilot is currently maximized */
  isMaximized?: boolean;
  /** Open an artifact in a separate panel outside the conversation */
  onArtifactOpen?: (asset: CopilotAsset | null) => void;
  /** Whether an artifact panel is currently open */
  artifactOpen?: boolean;
  /** When toggled (incremented), opens the page builder */
  openBuilder?: number;
}

const CopilotView: React.FC<CopilotViewProps> = ({
  onClose,
  onAssetClick: _onAssetClick,
  activeChatId,
  onChatSelect,
  isEntering = false,
  initialMessage,
  hideInput = false,
  skillMention,
  skillUseCase: _skillUseCase,
  shortcutTask,
  onBuildMode,
  onDrawerOpenChange,
  onMaximize,
  isMaximized = false,
  onArtifactOpen,
  artifactOpen = false,
  openBuilder = 0,
}) => {
  const isNewChat = activeChatId === 'new';
  const isShortcutChat = activeChatId === 'shortcut';
  const [showGreeting, setShowGreeting] = useState(false);

  // Two-phase crossfade: new-chat content fades OUT first, then new content fades IN
  const prevChatIdRef = useRef(activeChatId);
  const [displayChatId, setDisplayChatId] = useState(activeChatId);
  const [contentVisible, setContentVisible] = useState(true);
  const [suppressDrawerTransition, setSuppressDrawerTransition] = useState(false);
  useEffect(() => {
    const prev = prevChatIdRef.current;
    prevChatIdRef.current = activeChatId;
    if (prev === 'new' && activeChatId !== 'new') {
      // Phase 1: instantly hide old content (0ms transition)
      setContentVisible(false);
      // Phase 2: swap content on next frame, then ease-in new content
      requestAnimationFrame(() => {
        setDisplayChatId(activeChatId);
        requestAnimationFrame(() => setContentVisible(true));
      });
      return;
    } else {
      setDisplayChatId(activeChatId);
    }
  }, [activeChatId]);

  const isNewChatDisplay = displayChatId === 'new';
  const isShortcutChatDisplay = displayChatId === 'shortcut';
  const [setupFlowActive] = useState(false);
  const [, setSetupBuildMode] = useState(false);
  const [planBuildMode, setPlanBuildMode] = useState(false);

  // Planning flow state
  type PlanPhase = 'idle' | 'questions' | 'thinking' | 'done';
  const [planPhase, setPlanPhase] = useState<PlanPhase>('idle');
  const [planPrompt, setPlanPrompt] = useState('');
  const [planResult, setPlanResult] = useState<PlanData | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Shortcut task flow state
  type ShortcutPhase = 'greeting' | 'thinking' | 'questions' | 'plan-thinking' | 'done' | 'building' | 'built';
  const [shortcutPhase, setShortcutPhase] = useState<ShortcutPhase | null>(null);
  const [shortcutFlow, setShortcutFlow] = useState<ShortcutFlowData | null>(null);
  const [shortcutPlanResult, setShortcutPlanResult] = useState<PlanData | null>(null);
  const [shortcutBuildMode, setShortcutBuildMode] = useState(false);
  const [builderOpen, setBuilderOpen] = useState(false);
  const shortcutEndRef = useRef<HTMLDivElement>(null);

  // Inbox session state
  const [inboxPhase, setInboxPhase] = useState(-1);
  const [inboxPillChoices, setInboxPillChoices] = useState<Record<number, string>>({});
  const [deferredInfo, setDeferredInfo] = useState<{ sent: number; remaining: string[] } | null>(null);

  // Moderation session state
  const [moderationPhase, setModerationPhase] = useState(-1);
  const [moderationPillChoices, setModerationPillChoices] = useState<Record<number, string>>({});

  // Fresh conversation state — triggered when isNewChat + initialMessage
  type FreshPhase = 'user-message' | 'thinking' | 'reply';
  const [freshPhase, setFreshPhase] = useState<FreshPhase | null>(null);
  const [freshReply, setFreshReply] = useState('');
  const freshChatEndRef = useRef<HTMLDivElement>(null);

  // Inbox session pill handler
  const handleInboxPillClick = (pill: ScenarioPill) => {
    if (pill.targetStep === -1) { setInboxPhase(-1); return; }
    if (pill.targetStep === 100) {
      // Launch moderation session directly
      setModerationPillChoices(prev => ({ ...prev, [0]: pill.label }));
      setModerationPhase(0);
      const sync = moderationScenario[0]?.inboxSync;
      if (sync) window.dispatchEvent(new CustomEvent('inbox-sync', { detail: sync }));
      return;
    }
    setInboxPillChoices(prev => ({ ...prev, [pill.targetStep]: pill.label }));
    setInboxPhase(pill.targetStep);
    const sync = inboxScenario[pill.targetStep]?.inboxSync;
    if (sync) {
      window.dispatchEvent(new CustomEvent('inbox-sync', { detail: sync }));
    }
  };

  // Auto-scroll on inbox phase change
  useEffect(() => {
    if (inboxPhase >= 0) {
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [inboxPhase]);

  // "Ready to send" batch sent → advance to step 1 ("Needs you")
  const handleBatchSent = () => {
    setInboxPhase(1);
    setInboxPillChoices(prev => ({ ...prev, [1]: 'Send all 9' }));
  };

  // "Needs you" completion → wrap-up (step 3) or deferred (step 2)
  const handleNeedsComplete = (sentCount: number, remainingNames: string[]) => {
    if (sentCount >= 3) {
      setInboxPhase(3);
      setInboxPillChoices(prev => ({ ...prev, [3]: 'All handled' }));
      const sync = inboxScenario[3]?.inboxSync;
      if (sync) window.dispatchEvent(new CustomEvent('inbox-sync', { detail: sync }));
    } else {
      setDeferredInfo({ sent: sentCount, remaining: remainingNames });
      setInboxPhase(2);
      setInboxPillChoices(prev => ({ ...prev, [2]: 'Done reviewing' }));
    }
  };

  // Moderation pill handler
  const handleModerationPillClick = (pill: ScenarioPill) => {
    if (pill.targetStep === -1) { setModerationPhase(-1); return; }
    setModerationPillChoices(prev => ({ ...prev, [pill.targetStep]: pill.label }));
    setModerationPhase(pill.targetStep);
    const sync = moderationScenario[pill.targetStep]?.inboxSync;
    if (sync) window.dispatchEvent(new CustomEvent('inbox-sync', { detail: sync }));
  };

  const handleConfirmComplete = () => {
    setModerationPhase(1);
    setModerationPillChoices(prev => ({ ...prev, [1]: 'All confirmed' }));
  };

  const handleDecideComplete = () => {
    setModerationPhase(2);
    setModerationPillChoices(prev => ({ ...prev, [2]: 'All decided' }));
  };

  // Auto-scroll on moderation phase change
  useEffect(() => {
    if (moderationPhase >= 0) {
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [moderationPhase]);

  // Open builder when parent increments the openBuilder counter
  useEffect(() => {
    if (openBuilder > 0) setBuilderOpen(true);
  }, [openBuilder]);

  useEffect(() => {
    if (isNewChat && skillMention) {
      setShowGreeting(false);
      const timer = setTimeout(() => setShowGreeting(true), 1000);
      return () => clearTimeout(timer);
    }
    setShowGreeting(false);
  }, [isNewChat, skillMention]);

  // Shortcut task auto-flow
  useEffect(() => {
    if (!isShortcutChat || !shortcutTask) return;
    const flow = getShortcutFlowData(shortcutTask);
    setShortcutFlow(flow);
    setShortcutPhase('greeting');
    setShortcutPlanResult(null);

    // After 1s show thinking, then after 2.5s show questions
    const t1 = setTimeout(() => setShortcutPhase('thinking'), 1000);
    const t2 = setTimeout(() => setShortcutPhase('questions'), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isShortcutChat, shortcutTask]);

  // Scroll shortcut flow
  useEffect(() => {
    if (shortcutPhase) {
      setTimeout(() => shortcutEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [shortcutPhase]);

  // Fresh conversation — start state machine when isNewChat + initialMessage
  useEffect(() => {
    if (!isNewChat || !initialMessage) return;
    setFreshPhase('user-message');
    const t1 = setTimeout(() => setFreshPhase('thinking'), 400);
    const t2 = setTimeout(() => {
      setFreshReply(generateFreshReply(initialMessage));
      setFreshPhase('reply');
    }, 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNewChat, initialMessage]);

  // Scroll fresh conversation to bottom when phase advances
  useEffect(() => {
    if (freshPhase) {
      setTimeout(() => freshChatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [freshPhase]);


  const handleShortcutQuestionsComplete = (answers: string[]) => {
    setShortcutPhase('plan-thinking');
    setTimeout(() => {
      if (shortcutFlow) {
        setShortcutPlanResult(shortcutFlow.generatePlan(answers));
      }
      setShortcutPhase('done');
    }, 3500);
  };

  const handleShortcutQuestionsDismiss = () => {
    // Skip questions, go straight to plan
    setShortcutPhase('plan-thinking');
    setTimeout(() => {
      if (shortcutFlow) {
        setShortcutPlanResult(shortcutFlow.generatePlan([]));
      }
      setShortcutPhase('done');
    }, 3500);
  };

  // Scroll to bottom when plan phases change
  useEffect(() => {
    if (planPhase === 'thinking' || planPhase === 'done') {
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [planPhase]);

  const handleChatSubmit = (message: string) => {
    if (message.toLowerCase().includes('create a plan') || message.toLowerCase().includes('make a plan') || message.toLowerCase().includes('build a plan')) {
      setPlanPrompt(message);
      setPlanPhase('questions');
    }
  };

  const handleQuestionsComplete = (answers: string[]) => {
    setPlanPhase('thinking');
    // Simulate AI thinking for 2 seconds, then show plan
    setTimeout(() => {
      setPlanResult(generatePlan(answers));
      setPlanPhase('done');
    }, 2000);
  };

  const handleQuestionsDismiss = () => {
    setPlanPhase('idle');
    setPlanPrompt('');
  };

  const isLandingPageTask = shortcutTask
    ? /landing|navigation|page/i.test(shortcutTask)
    : false;

  const handleShortcutBuild = () => {
    if (isLandingPageTask) {
      setShortcutPhase('building');
      onArtifactOpen?.(LANDING_PAGE_ASSET);
      setTimeout(() => setShortcutPhase('built'), 3500);
    } else {
      setShortcutPhase('building');
      setTimeout(() => {
        setShortcutPhase('built');
        onArtifactOpen?.({ ...SHORTCUT_BUILD_ASSET, title: shortcutTask || 'Build result' });
      }, 3500);
    }
  };

  const [builderClosing, setBuilderClosing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState('');
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on outside click
  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) { setDrawerOpen(false); setDrawerSearch(''); }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [drawerOpen]);

  // Notify parent when drawer open state changes
  useEffect(() => {
    onDrawerOpenChange?.(drawerOpen);
  }, [drawerOpen, onDrawerOpenChange]);

  const handleBuilderClose = () => {
    setBuilderClosing(true);
    setTimeout(() => {
      setBuilderOpen(false);
      setBuilderClosing(false);
      onArtifactOpen?.(LANDING_PAGE_ASSET);
    }, 220);
  };

  // Full-screen builder mode — fixed overlay above everything
  if (builderOpen) {
    return (
      <div className={`fixed inset-0 z-50 bg-primary ${builderClosing ? 'animate-[fadeOut_200ms_cubic-bezier(0.55,0,1,0.45)_both]' : 'animate-[fadeIn_280ms_cubic-bezier(0.16,1,0.3,1)_both]'}`}>
        <PageBuilderMode onClose={handleBuilderClose} />
      </div>
    );
  }

  return (
    <div className="h-full relative overflow-hidden">
      {/* Recent chats drawer — slides in from left */}
      <div
        ref={drawerRef}
        className={`absolute left-0 top-0 bottom-0 w-[300px] border-r border-secondary z-40 bg-primary flex flex-col transition-[transform,box-shadow] duration-250 ease-out ${
          drawerOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full shadow-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <Typography variant="label-md" color="primary">Chats</Typography>
          <IconButton variant="ghost" size="sm" icon="cross" aria-label="Close" onClick={() => { setDrawerOpen(false); setDrawerSearch(''); }} />
        </div>
        <nav className="flex flex-col gap-0.5 flex-1 min-h-0 overflow-y-auto px-3 py-2">
          {RECENT_CHATS.map(chat => (
            <button
              key={chat.id}
              type="button"
              onClick={() => { onChatSelect(chat.id); setDrawerOpen(false); }}
              className={mergeClasses(
                'w-full text-left px-3 py-2.5 text-sm leading-5 rounded-lg transition-colors truncate',
                activeChatId === chat.id ? 'bg-secondary font-medium' : 'hover:bg-hover'
              )}
            >
              {chat.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Main — full width, centered */}
      <main className="h-full flex flex-col min-w-0 min-h-0 overflow-hidden">
        {/* Header — full width */}
        <div className={`shrink-0 px-4 py-3 flex items-center gap-2 transition-opacity duration-300 ease-out delay-100 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
          {/* History */}
          <IconButton
            type="button"
            variant="ghost"
            size="sm"
            icon="clock-dash"
            aria-label="Recent chats"
            onClick={() => setDrawerOpen(o => !o)}
            className="shrink-0"
          />
          {/* Conversation title */}
          <div className="flex-1 min-w-0">
            <BreadCrumbs
              size="sm"
              items={[
                {
                  label: setupFlowActive
                    ? 'Set up your spaces'
                    : isShortcutChat
                    ? (shortcutTask ?? 'New task')
                    : isNewChat
                    ? 'New conversation'
                    : (RECENT_CHATS.find(c => c.id === activeChatId)?.title ??
                    'Recent chats'),
                },
              ]}
            />
          </div>
          {/* Maximize / minimize */}
          {onMaximize && (
            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              icon="expand"
              aria-label={isMaximized ? 'Minimize' : 'Maximize'}
              onClick={onMaximize}
              className="shrink-0"
            />
          )}
          {/* Collapse — close conversation */}
          <IconButton
            type="button"
            variant="ghost"
            size="sm"
            icon="arrow-wall-left"
            aria-label="Collapse conversation"
            onClick={onClose}
            className="shrink-0"
          />
        </div>

        <div
          className={`w-full flex flex-col flex-1 min-h-0 overflow-hidden transition-opacity ease-in-out ${contentVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDuration: contentVisible ? '500ms' : '180ms' }}
        >
        {setupFlowActive ? (
          <SpaceSetupFlow onBuildModeChange={(active) => { setSetupBuildMode(active); onBuildMode?.(active); }} />
        ) : isShortcutChatDisplay && shortcutTask ? (
          (() => {
            const chatPane = (
              <div className={`w-full flex-1 flex flex-col min-h-0 transition-opacity duration-300 delay-200 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
                {/* Shortcut task flow — auto-started from dashboard dropdown */}
                <div className="flex-1 overflow-y-auto px-6 py-9">
                  <div className={mergeClasses('w-full mx-auto flex flex-col gap-10', shortcutBuildMode ? 'max-w-none' : 'max-w-[678px]')}>
                    {/* User's request bubble */}
                    <div className="flex flex-col items-end gap-1 animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                      <div className="bg-secondary rounded-[16px] px-4 py-[10px]">
                        <Typography variant="body-md" color="primary">
                          {shortcutTask}
                        </Typography>
                      </div>
                    </div>

                    {/* Clara's greeting */}
                    {shortcutPhase && shortcutPhase !== 'greeting' && shortcutFlow && (
                      <div className="flex flex-col items-start gap-3 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                        <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                        <div className="flex-1 min-w-0 w-full">
                          <Typography variant="body-md" color="primary" className="px-1">
                            {shortcutFlow.greeting}
                          </Typography>
                        </div>
                      </div>
                    )}

                    {/* Thinking — initial greeting */}
                    {shortcutPhase === 'greeting' && (
                      <div className="animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                        <ThinkingIndicator
                          steps={[
                            { label: 'Reading through your request to understand the intent, scope, and expected output before taking any action.' },
                            { label: 'Loading workspace context — community settings, active spaces, member count, and recent activity signals.' },
                            { label: 'Checking available skills, agents, and automation workflows that can assist with executing this request.' },
                            { label: 'Identifying any gaps or clarifications needed before generating a response or kicking off a workflow.' },
                          ]}
                        />
                      </div>
                    )}

                    {/* Thinking — building plan */}
                    {shortcutPhase === 'plan-thinking' && (
                      <div className="animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                        <ThinkingIndicator
                          steps={[
                            { label: 'Analyzing your community structure — reading through active spaces, member segmentation, and content engagement from the last 30 days.' },
                            { label: 'Running your setup against patterns from 200+ high-performing communities in similar verticals to surface what\'s working and what\'s missing.' },
                            { label: 'Scoring opportunities by impact and effort — filtering out low-leverage actions and surfacing the 3–5 moves most likely to accelerate growth.' },
                            { label: 'Drafting a structured plan with phased milestones, clear ownership for each step, and measurable outcomes you can track over time.' },
                          ]}
                        />
                      </div>
                    )}

                    {/* Plan result */}
                    {shortcutPhase === 'done' && shortcutPlanResult && shortcutFlow && (
                      <div className="flex flex-col items-start gap-3 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                      <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                        <div className="flex-1 min-w-0 w-full flex flex-col gap-3">
                          <Typography variant="body-md" color="primary" className="px-1">
                            {shortcutFlow.planIntro}
                          </Typography>
                          <PlanCard plan={shortcutPlanResult} onBuild={handleShortcutBuild} />
                        </div>
                      </div>
                    )}

                    {/* Building — hide plan, show execution steps */}
                    {shortcutPhase === 'building' && (
                      <div className="animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                        <ThinkingIndicator
                          steps={isLandingPageTask ? [
                            { label: 'Extracting brand identity — reading your color palette, typography choices, and tone of voice across existing community content and posts.' },
                            { label: 'Scanning 847 member profiles and last 90 days of engagement data to identify the messaging angles and page structures that drive sign-ups.' },
                            { label: 'Generating hero section copy — testing 6 headline variants against your community\'s core value proposition and selecting the highest-confidence option.' },
                            { label: 'Building the features grid — selecting your top 3 differentiators and writing card-level copy drawn directly from your documentation and member feedback.' },
                            { label: 'Curating social proof — pulling your highest-rated testimonials, formatting author details, and pairing with engagement stats for credibility.' },
                            { label: 'Finalizing layout and tokens — applying Clarity brand values, tightening spacing rhythm, and running a conversion audit on CTA placement and hierarchy.' },
                          ] : [
                            { label: 'Reading your current domain configuration and verifying DNS records.' },
                            { label: 'Analyzing your existing brand colors, fonts, and logo assets across community pages.' },
                            { label: 'Generating brand token system — mapping your palette to design variables for consistent theming.' },
                            { label: 'Configuring SSL certificate and mapping custom domain to your community.' },
                            { label: 'Applying brand identity to email templates, member pages, and landing screens.' },
                            { label: 'Running verification checks and publishing your updated configuration.' },
                          ]}
                        />
                      </div>
                    )}

                    {/* Built — completion message + artifact card */}
                    {shortcutPhase === 'built' && (
                      <div className="flex flex-col items-start gap-3 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                      <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                        <div className="flex-1 min-w-0 w-full flex flex-col gap-3">
                          <Typography variant="body-md" color="primary" className="px-1">
                            {isLandingPageTask
                              ? 'Your landing page is ready. Click any section to edit it directly, or open the full builder.'
                              : 'Done! Your configuration is ready to review.'}
                          </Typography>
                          {/* Artifact card — toggles panel open/closed */}
                          <button
                            type="button"
                            onClick={() => artifactOpen ? onArtifactOpen?.(null) : onArtifactOpen?.(isLandingPageTask ? LANDING_PAGE_ASSET : { ...SHORTCUT_BUILD_ASSET, title: shortcutTask || 'Build result' })}
                            className={`w-full flex flex-col gap-2 rounded-md p-4 bg-primary border text-left transition-[border-color,box-shadow] duration-200 ${
                              artifactOpen
                                ? 'border-[#717680] shadow-[0px_0px_0px_3px_rgba(113,118,128,0.3)]'
                                : 'border-secondary shadow-2xs hover:bg-hover'
                            }`}
                          >
                            <Icon name={isLandingPageTask ? 'file' : 'settings-gear'} size="md" aria-hidden />
                            <Typography variant="label-sm" color="primary">
                              {isLandingPageTask ? 'Landing page' : shortcutTask || 'Build result'}
                            </Typography>
                            <Typography variant="body-sm" color="secondary">
                              {isLandingPageTask ? 'clarity.community/welcome · Draft' : 'Ready to review'}
                            </Typography>
                          </button>
                        </div>
                      </div>
                    )}

                    <div ref={shortcutEndRef} />
                  </div>
                </div>

                {/* Clarifying questions — float above input */}
                <div className="shrink-0 px-4">
                  <div className={mergeClasses('w-full mx-auto', shortcutBuildMode ? 'max-w-none' : 'max-w-[678px]')}>
                    {shortcutPhase === 'questions' && shortcutFlow && (
                      <div className="mb-3">
                        <ClarifyingQuestions
                          questions={shortcutFlow.questions}
                          onComplete={handleShortcutQuestionsComplete}
                          onDismiss={handleShortcutQuestionsDismiss}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className={`shrink-0 px-4 pt-4 pb-2 ${hideInput ? 'opacity-0' : 'transition-opacity duration-200 ease-out'}`}>
                  <div className={mergeClasses('w-full mx-auto', shortcutBuildMode ? 'max-w-none' : 'max-w-[678px]')}>
                    <AgentMessageBox
                      placeholder="Message Circle AI..."
                      onSubmit={() => { /* placeholder */ }}
                    />
                  </div>
                </div>
              </div>
            );

            return chatPane;
          })()
        ) : isNewChatDisplay ? (
          <div className={`w-full flex-1 flex flex-col min-h-0 transition-opacity duration-300 delay-200 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex-1 overflow-y-auto px-6 py-9">
              <div className="w-full max-w-[678px] mx-auto flex flex-col gap-10">

                {/* Skill greeting */}
                {showGreeting && skillMention && (
                  <div className="flex flex-col items-start gap-1 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                    <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                    <div className="flex-1 min-w-0 w-full">
                      <Typography variant="body-md" color="primary" className="px-1">
                        I&apos;m ready to help with {skillMention}. What would you like to do?
                      </Typography>
                    </div>
                  </div>
                )}

                {/* Fresh conversation */}
                {freshPhase && initialMessage && (
                  <>
                    {/* User message */}
                    <div className="flex flex-col items-end pl-6 animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                      <div className="bg-secondary rounded-[16px] px-4 py-[10px]">
                        <Typography variant="body-md" color="primary">
                          {initialMessage}
                        </Typography>
                      </div>
                    </div>

                    {/* Thinking */}
                    {freshPhase === 'thinking' && (
                      <div className="animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                        <ThinkingIndicator />
                      </div>
                    )}

                    {/* AI reply */}
                    {freshPhase === 'reply' && (
                      <div className="flex flex-col items-start gap-4 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                        <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                        <div className="flex flex-col gap-3 w-full">
                          <Typography variant="body-md" color="primary" className="px-1">
                            {freshReply}
                          </Typography>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div ref={freshChatEndRef} />
              </div>
            </div>

            {/* Reply input — appears once AI has responded */}
            {freshPhase === 'reply' && (
              <div className="shrink-0 px-4 pt-4 pb-2 transition-opacity duration-200 ease-out">
                <div className="w-full max-w-[678px] mx-auto">
                  <AgentMessageBox
                    placeholder="Reply to Clara..."
                    onSubmit={() => {}}
                  />
                </div>
              </div>
            )}
          </div>

        ) : (() => {
          const savedChat = RECENT_CHATS.find(c => c.id === activeChatId && c.id !== '1');
          if (savedChat) {
            return (
              <div className={`w-full flex-1 flex flex-col min-h-0 transition-opacity duration-300 delay-200 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
                <div className="flex-1 overflow-y-auto px-6 py-9">
                  <div className="w-full max-w-[678px] mx-auto flex flex-col gap-10">
                    {savedChat.messages.map((msg, i) => (
                      msg.role === 'user' ? (
                        <div key={i} className="flex flex-col items-end pl-6">
                          <div className="bg-secondary rounded-[16px] px-4 py-[10px]">
                            <Typography variant="body-md" color="primary">{msg.content}</Typography>
                          </div>
                        </div>
                      ) : (
                        <div key={i} className="flex flex-col gap-4">
                          <div className="flex flex-col items-start gap-4">
                            <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                            <div className="flex flex-col gap-2 w-full">
                              {msg.content.split('\n\n').map((para, j) => (
                                <Typography key={j} variant="body-md" color="primary" className="px-1 whitespace-pre-line">{para}</Typography>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-[5px]">
                            <IconButton type="button" variant="ghost" size="sm" icon="thumbup" aria-label="Like" />
                            <div className="-scale-y-100">
                              <IconButton type="button" variant="ghost" size="sm" icon="thumbup" aria-label="Dislike" />
                            </div>
                            <IconButton type="button" variant="ghost" size="sm" icon="copy" aria-label="Copy" />
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
                <div className="shrink-0 px-4 pt-4 pb-2">
                  <div className="w-full max-w-[678px] mx-auto">
                    <AgentMessageBox placeholder="Message Circle AI..." onSubmit={() => {}} />
                  </div>
                </div>
              </div>
            );
          }
          const claraChatPane = (
              <div className={`w-full flex-1 flex flex-col min-h-0 transition-opacity duration-300 delay-200 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
                {/* Chat with Circle AI */}
                <div className="flex-1 overflow-y-auto px-6 py-9">
                  <div className={mergeClasses('w-full mx-auto flex flex-col gap-10', planBuildMode ? 'max-w-none' : 'max-w-[678px]')}>
                {/* Clara intro */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col items-start gap-4">
                    <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                    <Typography variant="body-md" color="primary">
                      Hey! I&apos;m Circle AI. I have full visibility into your community — member activity, onboarding, content, and revenue. What would you like to work on?
                    </Typography>
                  </div>
                  <div className="flex items-center gap-[5px]">
                    <IconButton type="button" variant="ghost" size="sm" icon="thumbup" aria-label="Like" />
                    <div className="-scale-y-100">
                      <IconButton type="button" variant="ghost" size="sm" icon="thumbup" aria-label="Dislike" />
                    </div>
                    <IconButton type="button" variant="ghost" size="sm" icon="copy" aria-label="Copy" />
                  </div>
                </div>

                {/* User message */}
                <div className="flex flex-col items-end pl-6">
                  <div className="bg-secondary rounded-[16px] px-4 py-[10px]">
                    <Typography variant="body-md" color="primary">
                      How are this week&apos;s new members doing?
                    </Typography>
                  </div>
                </div>

                {/* Clara response with artifact card */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col items-start gap-4">
                    <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                    <div className="flex flex-col gap-3 w-full">
                      <Typography variant="body-md" color="primary">
                        This week we had <strong>12 new signups</strong>.{' '}
                        <strong>8 have completed onboarding</strong> (67% completion
                        rate), and{' '}
                        <strong>3 have already posted introductions</strong>. The
                        biggest drop-off is still at the goals survey step —
                        I&apos;ve been testing a shorter version that&apos;s showing
                        15% better completion in the last batch.
                      </Typography>
                      {/* Artifact card — vertical layout per Figma */}
                      <button
                        type="button"
                        onClick={() => artifactOpen ? onArtifactOpen?.(null) : onArtifactOpen?.(ONBOARDING_ASSET)}
                        className={`w-full flex flex-col gap-2 rounded-md p-4 bg-primary border text-left transition-[border-color,box-shadow] duration-200 ${
                          artifactOpen
                            ? 'border-[#717680] shadow-[0px_0px_0px_3px_rgba(113,118,128,0.3)]'
                            : 'border-secondary shadow-2xs hover:bg-hover'
                        }`}
                      >
                        <Icon name="chart-square" size="md" aria-hidden />
                        <Typography variant="label-sm" color="primary">
                          {ONBOARDING_ASSET.title}
                        </Typography>
                        <Typography variant="body-sm" color="secondary">
                          {ONBOARDING_ASSET.subtitle}
                        </Typography>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-[5px]">
                    <IconButton type="button" variant="ghost" size="sm" icon="thumbup" aria-label="Like" />
                    <div className="-scale-y-100">
                      <IconButton type="button" variant="ghost" size="sm" icon="thumbup" aria-label="Dislike" />
                    </div>
                    <IconButton type="button" variant="ghost" size="sm" icon="copy" aria-label="Copy" />
                  </div>
                </div>

                {/* Planning flow — appears after existing conversation */}
                {planPhase !== 'idle' && (
                  <>
                    {/* User's plan request */}
                    <div className="flex flex-col items-end gap-1 animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                      <div className="bg-secondary rounded-[16px] px-4 py-[10px]">
                        <Typography variant="body-md" color="primary">
                          {planPrompt}
                        </Typography>
                      </div>
                    </div>

                    {/* Thinking indicator */}
                    {planPhase === 'thinking' && (
                      <div className="animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                        <ThinkingIndicator />
                      </div>
                    )}

                    {/* Plan result */}
                    {planPhase === 'done' && planResult && (
                      <div className="flex flex-col items-start gap-3 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                      <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                        <div className="flex-1 min-w-0 w-full flex flex-col gap-3">
                          <Typography variant="body-md" color="primary" className="px-1">
                            I&apos;ve created a plan for your creative request management library! Based on your needs, here&apos;s how we&apos;ll build a system to streamline intake forms, review processes, and request tracking. Does this look right, or would you like to make any changes?
                          </Typography>
                          <PlanCard plan={planResult} onBuild={() => { setPlanBuildMode(true); onBuildMode?.(true); }} />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* === Inbox Copilot Session === */}
                {inboxPhase >= 0 && (
                  <InboxSession
                    currentStep={inboxPhase}
                    pillChoices={inboxPillChoices}
                    onPillClick={handleInboxPillClick}
                    onBatchSent={handleBatchSent}
                    onNeedsComplete={handleNeedsComplete}
                    deferredInfo={deferredInfo}
                  />
                )}

                {/* === Moderation Copilot Session === */}
                {moderationPhase >= 0 && (
                  <ModerationSession
                    currentStep={moderationPhase}
                    pillChoices={moderationPillChoices}
                    onPillClick={handleModerationPillClick}
                    onConfirmComplete={handleConfirmComplete}
                    onDecideComplete={handleDecideComplete}
                  />
                )}

                <div ref={chatEndRef} />
              </div>
            </div>

                {/* Clarifying questions — float above input */}
                <div className="shrink-0 px-4">
                  <div className={mergeClasses('w-full mx-auto', planBuildMode ? 'max-w-none' : 'max-w-[678px]')}>
                    {planPhase === 'questions' && (
                      <div className="mb-3">
                        <ClarifyingQuestions
                          questions={PLAN_QUESTIONS}
                          onComplete={handleQuestionsComplete}
                          onDismiss={handleQuestionsDismiss}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Session entry pills — above input */}
                {(inboxPhase === -1 || moderationPhase === -1) && (
                  <div className="shrink-0 px-4">
                    <div className={mergeClasses('w-full mx-auto', planBuildMode ? 'max-w-none' : 'max-w-[678px]')}>
                      <InboxPills
                        pills={[
                          ...(inboxPhase === -1 ? [{ label: 'Catch me up', variant: 'recommended' as const, targetStep: 0 }] : []),
                          ...(moderationPhase === -1 ? [{ label: 'Review moderation queue', variant: 'default' as const, targetStep: 100 }] : []),
                        ]}
                        onPillClick={(pill) => {
                          if (pill.targetStep === 100) {
                            // Moderation entry
                            setModerationPillChoices(prev => ({ ...prev, [0]: 'Review moderation queue' }));
                            setModerationPhase(0);
                            const sync = moderationScenario[0]?.inboxSync;
                            if (sync) window.dispatchEvent(new CustomEvent('inbox-sync', { detail: sync }));
                          } else {
                            // DM entry
                            setInboxPillChoices(prev => ({ ...prev, [0]: pill.label }));
                            setInboxPhase(0);
                            const sync = inboxScenario[0]?.inboxSync;
                            if (sync) window.dispatchEvent(new CustomEvent('inbox-sync', { detail: sync }));
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
                {inboxPhase >= 0 && inboxScenario[inboxPhase]?.pills.length > 0 && (
                  <div className="shrink-0 px-4">
                    <div className={mergeClasses('w-full mx-auto', planBuildMode ? 'max-w-none' : 'max-w-[678px]')}>
                      <InboxPills
                        pills={inboxScenario[inboxPhase].pills}
                        onPillClick={handleInboxPillClick}
                      />
                    </div>
                  </div>
                )}
                {moderationPhase >= 0 && moderationScenario[moderationPhase]?.pills.length > 0 && (
                  <div className="shrink-0 px-4">
                    <div className={mergeClasses('w-full mx-auto', planBuildMode ? 'max-w-none' : 'max-w-[678px]')}>
                      <InboxPills
                        pills={moderationScenario[moderationPhase].pills}
                        onPillClick={handleModerationPillClick}
                      />
                    </div>
                  </div>
                )}

                {/* Reply input — ~130px, no border above */}
                <div className={`shrink-0 px-4 pt-4 pb-2 ${hideInput ? 'opacity-0' : 'transition-opacity duration-200 ease-out'}`}>
                  <div className={mergeClasses('w-full mx-auto', planBuildMode ? 'max-w-none' : 'max-w-[678px]')}>
                    <AgentMessageBox
                      placeholder="Message Circle AI..."
                      initialValue={initialMessage}
                      onSubmit={handleChatSubmit}
                    />
                  </div>
                </div>
              </div>
            );

          return claraChatPane;
        })()}

        </div>
      </main>
    </div>
  );
};

export default CopilotView;
