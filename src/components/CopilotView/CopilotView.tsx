import React, { useState, useEffect, useRef } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Icon } from '@circleco/compass/components/Icon';
import { Button } from '@circleco/compass/components/Button';
import { TextInput } from '@circleco/compass/components/TextInput';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Menu } from '@circleco/compass/components/Menu';
import { BreadCrumbs } from '@circleco/compass/components/BreadCrumbs';
import { mergeClasses } from '../../lib/utils';
import AgentMessageBox from '../shared/AgentMessageBox';
import AiAssistArtifactCard from './InboxSession/AiAssistArtifactCard';
import { getInteractionByMessageId } from '../InboxPage/aiAssistMockData';
import ClarifyingQuestions, { type ClarifyingQuestion } from '../shared/ClarifyingQuestions';
import ClarificationAnswersBubble from '../shared/ClarificationAnswersBubble';
import PlanCard, { type PlanData } from '../shared/PlanCard';
import PlanOverlay from '../shared/PlanOverlay';
import PlanConfirmationCard from '../shared/PlanConfirmationCard';
import PlanRecoveryCard from '../shared/PlanRecoveryCard';
import PlanResultCard, { type PlanResultEntity } from '../shared/PlanResultCard';
import ThinkingIndicator from '../shared/ThinkingIndicator';
import { clarificationWidgetCopy } from '../InboxPage/v1/SupportCategory/data/clarificationWidgetData';
import { addSupportThread, type SupportThread } from '../InboxPage/v1/SupportCategory/data/supportThreads';
import SupportTicketForm, { type SupportTicketFormData } from './SupportTicketForm';
import TicketLinkCard from './TicketLinkCard';
import QueueCard from '../InboxPage/v1/SupportCategory/QueueCard';
import SpaceSetupFlow from './SpaceSetupFlow';
import PageBuilderMode from './PageBuilderMode';
import EntityV, { type EntityVariant } from '../shared/EntityV';
import { MarkdownContent } from '../shared/MarkdownContent';
import type { LaunchPlanStep } from '../ProjectsPage/launchProjectData';

import { type AssetItem } from '../shared/AssetDetailSidebar';
export type { AssetItem as CopilotAsset } from '../shared/AssetDetailSidebar';
type CopilotAsset = AssetItem;

import { CHAT_DATA } from '../../data/chatData';
const RECENT_CHATS = CHAT_DATA;

/* ── Plan-with-confirmation execution steps ────────────────────────── */
const PLAN_CONF_STEPS = [
  { title: 'Define access tiers', sensitive: false, detail: 'Create three membership tiers — Free, Pro, and Admin — each with distinct access boundaries and permission scopes across all spaces.' },
  { title: 'Configure space permissions', sensitive: false, detail: 'Map each of the 12 active spaces to the appropriate access tier, controlling visibility and posting rights per member group.' },
  { title: 'Overwrite existing member assignments', sensitive: true, detail: 'Replace current access rules for all 47 members. This cannot be undone — existing manual permission overrides will be permanently removed.' },
  { title: 'Notify members of access changes', sensitive: false, detail: 'Send automated in-app and email notifications to all 47 affected members with a summary of their updated access level.' },
] as const;
const PLAN_CONF_SENSITIVE_IDX = PLAN_CONF_STEPS.findIndex(s => s.sensitive); // 2

const REDESIGNED_STEPS: LaunchPlanStep[] = [
  { id: 'rs-1', number: 1, title: 'Design space structure', skill: 'Space scaffolder', timeEstimate: '~2 min', status: 'pending', messageCount: 0 },
  { id: 'rs-2', number: 2, title: 'Create main spaces', skill: 'Space scaffolder', timeEstimate: '~3 min', status: 'pending', messageCount: 0 },
  { id: 'rs-3', number: 3, title: 'Configure space permissions', skill: 'Workflow builder', timeEstimate: '~2 min', status: 'pending', messageCount: 0 },
  { id: 'rs-4', number: 4, title: 'Set up space navigation', skill: 'Content creator', timeEstimate: '~1 min', status: 'pending', messageCount: 0 },
  { id: 'rs-5', number: 5, title: 'Write welcome posts for each space', skill: 'Content creator', timeEstimate: '~3 min', status: 'pending', messageCount: 0 },
  { id: 'rs-6', number: 6, title: 'Invite members to spaces', skill: 'Member inviter', timeEstimate: '~2 min', status: 'pending', messageCount: 0 },
];

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

const COURSE_ASSET: CopilotAsset = {
  id: 'course',
  title: 'Finding calm: a journey to inner peace',
  type: 'course',
};

const SHORTCUT_BUILD_ASSET: CopilotAsset = {
  id: 'shortcut-build',
  title: 'Build result',
  type: 'build-frame',
};

const SUPPORT_CLARIFICATION_QUESTIONS: ClarifyingQuestion[] = [
  {
    question: "I'll connect you with our team — which works best?",
    options: [
      { label: 'Live Chat', badge: 'Wait ~15 min' },
      { label: 'Email', badge: 'Reply within 1 business day' },
    ],
  },
];

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

function isEventMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes('event') && (lower.includes('create') || lower.includes('make') || lower.includes('help') || lower.includes('new'));
}

function isCourseMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return (lower.includes('course') || lower.includes('lesson')) && (lower.includes('create') || lower.includes('make') || lower.includes('build') || lower.includes('new'));
}

function generateFreshReply(message: string): string {
  const lower = message.toLowerCase();
  if (isEventMessage(message)) {
    return "Ok, here is an event for you. Take a look:";
  }
  if (isCourseMessage(message)) {
    return "Here is a course I put together for you. Take a look:";
  }
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
      greeting: `I'd love to help you build a course. Tell me — what's the subject, and who is it for?`,
      questions: [
        { question: 'What type of course?', options: ['Self-paced video course', 'Cohort-based live course', 'Drip content over time', 'Mixed (videos + live sessions)'] },
        { question: 'How should members stay on track?', options: ['Daily check-ins with a partner', 'Community accountability threads', '1:1 coaching sessions', 'Self-guided with reminders'] },
      ],
      planIntro: ``,
      generatePlan: () => ({
        title: 'Course Structure Plan',
        iconColor: '#fef3c7',
        sections: [
          { title: 'Week 1: Arriving', description: '5-minute daily sits, breath awareness, journaling prompts.', details: ['Ease them in. No pressure to be good at it.'] },
          { title: 'Week 2: Noticing', description: 'Body scans, walking meditation, partner reflections.', details: ['The practice starts to feel like theirs.'] },
          { title: 'Week 3: Staying', description: 'Longer sits, working with resistance, closing ceremony.', details: ['They leave knowing this is something they can keep.'] },
          { title: 'Daily partner check-ins', description: 'Matched pairs share one sentence each morning: what they noticed.', details: [] },
          { title: 'Private reflection space', description: 'A quiet room for journaling.', details: ['No likes, no performance. Just presence.'] },
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
  /** Fires true when AI is generating a response, false when done */
  onGenerating?: (generating: boolean) => void;
  /** Increment to imperatively scroll to the bottom of the conversation */
  scrollToBottom?: number;
  /** First breadcrumb level — the entry point used to reach this thread (e.g. "Chats", project title) */
  entryPointLabel?: string;
  /** Called when user clicks the first breadcrumb to navigate back to the entry point */
  onEntryPointClick?: () => void;
  /** Callback to update project steps in the content card */
  onUpdateProjectSteps?: (steps: LaunchPlanStep[]) => void;
}

/* ── Artifact panel content components ─────────────────────────────── */

const MemberPreviewPanel: React.FC = () => (
  <div className="flex flex-col">
    {/* Profile card */}
    <div className="px-5 py-5 flex flex-col items-center gap-3 border-b border-secondary">
      <div className="w-16 h-16 rounded-full bg-[#e8eaf6] flex items-center justify-center">
        <span className="text-xl font-semibold text-[#3C53E7]">KG</span>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-base font-semibold text-primary">Karthik G</span>
        <a href="#" className="text-sm text-[#2563eb] underline">karthik@circle.so</a>
      </div>
      <div className="flex items-center gap-1.5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-full px-3 py-1">
        <span className="text-xs font-medium text-[#15803d]">Pro member</span>
      </div>
    </div>
    {/* Details */}
    <div className="flex flex-col divide-y divide-secondary">
      <div className="flex items-start justify-between px-5 py-3 gap-3">
        <span className="text-xs text-tertiary shrink-0">Access</span>
        <span className="text-sm text-primary text-right">Cohort 1, Cohort 2, and Cohort 3</span>
      </div>
      <div className="flex items-center justify-between px-5 py-3">
        <span className="text-xs text-tertiary">Member since</span>
        <span className="text-sm text-primary">Mar 15, 2019</span>
      </div>
      <div className="flex items-center justify-between px-5 py-3">
        <span className="text-xs text-tertiary">Last active</span>
        <span className="text-sm text-primary">2 days ago</span>
      </div>
      <div className="flex items-center justify-between px-5 py-3">
        <span className="text-xs text-tertiary">Total posts</span>
        <span className="text-sm text-primary">148</span>
      </div>
      <div className="flex items-center justify-between px-5 py-3">
        <span className="text-xs text-tertiary">Courses completed</span>
        <span className="text-sm text-primary">3 of 5</span>
      </div>
    </div>
    {/* Activity feed header */}
    <div className="px-5 py-3 border-t border-secondary">
      <span className="text-xs font-medium text-tertiary uppercase tracking-wide">Recent activity</span>
    </div>
    {[
      { label: 'Completed "Module 4: Advanced Topics"', time: '2 days ago' },
      { label: 'Posted in General Discussion', time: '4 days ago' },
      { label: 'Joined Cohort 3', time: 'Jan 10, 2026' },
      { label: 'Upgraded to Pro', time: 'Dec 1, 2025' },
    ].map((a, i) => (
      <div key={i} className="flex items-start gap-2 px-5 py-2.5 border-b border-secondary last:border-0">
        <div className="w-1.5 h-1.5 rounded-full bg-[#d1d5db] mt-1.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-sm text-primary">{a.label}</span>
          <span className="text-xs text-tertiary block">{a.time}</span>
        </div>
      </div>
    ))}
  </div>
);

const AnalyticsPanel: React.FC = () => {
  const funnel = [
    { label: 'Sessions', pct: '100%', count: 12, barH: 100 },
    { label: 'Onboarding', pct: '24%', count: 10, barH: 55 },
    { label: 'Completed onboarding', pct: '7.82%', count: 8, barH: 42 },
  ];
  return (
    <div className="px-5 py-6 flex flex-col gap-12">
      {/* Insight text */}
      <p className="text-base text-primary leading-6">
        30-day churn dropped from 12.4% to 8.2% after we shipped the new onboarding flow in February.
      </p>

      {/* Hero metric + funnel */}
      <div className="flex flex-col">
        <div className="flex flex-col gap-1 mb-6">
          <span className="text-[32px] font-bold text-primary tracking-[-0.8px] leading-10">7.82%</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 bg-[rgba(34,197,94,0.1)] px-1.5 py-0.5 rounded-md">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M9.5 8.5l-5-5M4.5 8.5v-5h5" stroke="#15803d" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="text-xs font-medium text-[#15803d]">+4.3%</span>
            </div>
            <span className="text-xs text-tertiary">3% last period</span>
          </div>
        </div>
        {/* Funnel columns */}
        <div className="flex gap-3 border-t border-secondary pt-6">
          {funnel.map((col, i) => (
            <div key={i} className="flex flex-col gap-3 flex-1 min-w-0">
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-tertiary truncate">{col.label}</span>
                <span className="text-xs font-medium text-primary">{col.pct}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-primary">{col.count}</span>
                  <div className="flex items-center gap-0.5 bg-[rgba(34,197,94,0.1)] px-1 rounded">
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M9.5 8.5l-5-5M4.5 8.5v-5h5" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="text-[10px] font-medium text-[#15803d]">+4.3%</span>
                  </div>
                </div>
              </div>
              {/* Proportional bar */}
              <div className="flex items-end h-[80px]">
                <div
                  className="w-4 rounded-sm"
                  style={{
                    height: `${col.barH}%`,
                    background: i === 0
                      ? 'linear-gradient(180deg, #93C5FD 0%, #BFDBFE 100%)'
                      : i === 1
                        ? '#BFDBFE'
                        : '#DBEAFE',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Findings + Recommendations */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-primary">Key Findings</span>
          {[
            'Welcome DM sequence has 73% open rate',
            'Members who complete onboarding are 4.2× more likely to stay past 30 days',
            'The "introduce yourself" prompt drives 2.1× more first-week posts',
          ].map((item, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-tertiary shrink-0 mt-0.5">•</span>
              <span className="text-sm text-primary">{item}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-primary">Recommendations</span>
          {[
            'Make the DM sequence mandatory for all tiers',
            'Add a day-7 check-in from the assigned agent',
            'Create a "week 2" engagement nudge sequence',
          ].map((item, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-tertiary shrink-0 mt-0.5">•</span>
              <span className="text-sm text-primary">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AnalyticsDashboard: React.FC = () => {
  const metrics = [
    { label: 'Active members', value: '2,817', badge: '+2.8%', positive: true, period: '30d' },
    { label: 'New members', value: '1,126', badge: '+2.8%', positive: true, period: '30d' },
    { label: 'Retention rate', value: '94%', badge: '-2.8%', positive: false, amber: true, period: '30d' },
    { label: 'Churned', value: '817', badge: '-92.8%', positive: false, period: '30d' },
    { label: 'Avg engagement', value: '362', badge: '+2.8%', positive: true, period: '30d' },
    { label: 'Posts', value: '918', badge: '-2.8%', positive: false, amber: true, period: '30d' },
  ];
  const topMembers = [
    { name: 'Lieve Carter', email: 'lieve@example.com', score: 98 },
    { name: 'Roger Culhane', email: 'roger@example.com', score: 91 },
    { name: 'Alena George', email: 'alena@example.com', score: 87 },
    { name: 'Zaire Stanton', email: 'zaire@example.com', score: 84 },
    { name: 'Alfredo Stanton', email: 'alfredo@example.com', score: 79 },
    { name: 'Omar Herwitz', email: 'omar@example.com', score: 74 },
    { name: 'Phillip Rosser', email: 'phillip@example.com', score: 68 },
  ];
  const barData = [
    { label: 'Jan 1', vals: [6, 4, 8, 5] },
    { label: 'Jan 29', vals: [4, 7, 3, 9] },
    { label: 'Feb 13', vals: [8, 5, 6, 4] },
    { label: 'Feb 28', vals: [3, 9, 7, 5] },
    { label: 'Mar 11', vals: [7, 4, 5, 8] },
  ];
  const barColors = ['#93C5FD', '#DBEAFE', '#2563EB', '#1E3A8A'];
  const barLegend = ['Presence', 'Participation', 'Contribution', 'Connection'];

  return (
    <div className="flex flex-col">
      {/* Page header */}
      <div className="flex items-center justify-between px-16 py-5">
        <span className="text-[28px] font-bold text-primary tracking-[-0.5px]">Analytics</span>
        <Button type="button" variant="outline" size="sm">Export CSV</Button>
      </div>

      {/* Filters */}
      <div className="px-16 py-3 flex items-center gap-2">
        <div className="flex items-center gap-1.5 border border-secondary rounded-lg px-2.5 py-1.5 bg-primary shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <span className="text-xs font-medium text-primary">Member type</span>
          <span className="text-xs text-tertiary">is</span>
          <span className="text-xs font-medium text-primary">Member</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-tertiary ml-0.5"><path d="M3 3l6 6M9 3L3 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
        </div>
        <button type="button" className="flex items-center gap-1 border border-dashed border-secondary rounded-lg px-2.5 py-1.5 text-xs text-tertiary hover:bg-hover transition-colors">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
          Add filter
        </button>
      </div>

      <div className="px-16 py-6 flex flex-col gap-6">
        {/* 6 metric cards */}
        <div className="grid grid-cols-3 gap-3">
          {metrics.map((m, i) => (
            <div key={i} className="bg-primary border border-secondary rounded-xl p-4 flex flex-col gap-3 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
              <div className="flex items-start justify-between">
                <span className="text-xs text-tertiary leading-4">{m.label}</span>
                <span className="text-[10px] text-tertiary bg-secondary rounded px-1.5 py-0.5">{m.period}</span>
              </div>
              <span className="text-2xl font-bold text-primary tracking-[-0.5px]">{m.value}</span>
              <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md w-fit text-xs font-medium ${
                m.positive
                  ? 'bg-[rgba(34,197,94,0.1)] text-[#065F46]'
                  : m.amber
                    ? 'bg-[rgba(245,158,11,0.1)] text-[#92400E]'
                    : 'bg-[rgba(239,68,68,0.1)] text-[#991B1B]'
              }`}>
                {m.badge}
              </div>
            </div>
          ))}
        </div>

        {/* Bar chart card */}
        <div className="bg-primary border border-secondary rounded-xl p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary">Monthly activity</span>
              <span className="text-xs text-tertiary bg-secondary rounded px-1.5 py-0.5">30d</span>
            </div>
            <div className="flex items-center gap-3">
              {barLegend.map((l, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: barColors[i] }} />
                  <span className="text-[10px] text-tertiary">{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-4 h-[120px]">
            {barData.map((group, gi) => (
              <div key={gi} className="flex-1 flex flex-col gap-1">
                <div className="flex items-end gap-0.5 flex-1">
                  {group.vals.map((v, vi) => (
                    <div
                      key={vi}
                      className="flex-1 rounded-sm"
                      style={{ height: `${v * 10}%`, background: barColors[vi] }}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-tertiary text-center">{group.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top members table */}
        <div className="bg-primary border border-secondary rounded-xl overflow-hidden shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between px-5 py-3 border-b border-secondary">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary">Top members</span>
              <span className="text-xs text-tertiary bg-secondary rounded px-1.5 py-0.5">30d</span>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_80px] px-5 py-2 border-b border-secondary">
            <span className="text-xs font-medium text-tertiary">Name</span>
            <span className="text-xs font-medium text-tertiary">Score</span>
          </div>
          {topMembers.map((m, i) => (
            <div key={i} className="grid grid-cols-[1fr_80px] items-center px-5 py-3 border-b border-secondary last:border-0 hover:bg-hover transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-semibold text-tertiary">{m.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm text-primary truncate">{m.name}</span>
                  <span className="text-xs text-tertiary truncate">{m.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-[#506CF0]" style={{ width: `${m.score}%` }} />
                </div>
                <span className="text-xs font-medium text-primary w-6 text-right">{m.score}</span>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between px-5 py-3 border-t border-secondary">
            <span className="text-xs text-tertiary">Showing 1–7 of 21</span>
            <div className="flex items-center gap-1">
              <button type="button" className="text-xs text-tertiary border border-secondary rounded-lg px-2.5 py-1.5 hover:bg-hover transition-colors">Previous</button>
              <button type="button" className="text-xs text-primary border border-secondary rounded-lg px-2.5 py-1.5 hover:bg-hover transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AudiencePanel: React.FC = () => (
  <div className="flex flex-col">
    {/* Stats bar */}
    <div className="flex items-center gap-4 px-5 py-3 border-b border-secondary">
      <div className="flex flex-col">
        <span className="text-base font-semibold text-primary">3,284</span>
        <span className="text-xs text-tertiary">Total members</span>
      </div>
      <div className="w-px h-8 bg-secondary" />
      <div className="flex flex-col">
        <span className="text-base font-semibold text-primary">47</span>
        <span className="text-xs text-tertiary">Active segments</span>
      </div>
    </div>
    {/* Search */}
    <div className="px-5 py-3 border-b border-secondary">
      <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-tertiary shrink-0"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3"/><path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
        <span className="text-sm text-tertiary">Search segments…</span>
      </div>
    </div>
    {/* Segments header */}
    <div className="px-5 py-2 border-b border-secondary">
      <span className="text-[11px] font-medium text-tertiary uppercase tracking-wide">Segments</span>
    </div>
    {[
      { name: 'Cohort 1', count: 421, color: '#e8eaf6' },
      { name: 'Cohort 2', count: 388, color: '#fce7f3' },
      { name: 'Cohort 3', count: 512, color: '#dcfce7' },
      { name: 'Pro members', count: 1042, color: '#fef9c3' },
      { name: 'Free members', count: 2242, color: '#f0f3f5' },
      { name: 'Inactive (90+ days)', count: 287, color: '#fee2e2' },
    ].map((seg, i) => (
      <div key={i} className="flex items-center gap-3 px-5 py-3 border-b border-secondary last:border-0 hover:bg-hover transition-colors cursor-pointer">
        <div className="w-7 h-7 rounded-lg shrink-0" style={{ background: seg.color }} />
        <span className="text-sm text-primary flex-1">{seg.name}</span>
        <span className="text-xs text-tertiary">{seg.count.toLocaleString()}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-tertiary"><path d="M4 3l3.5 3L4 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    ))}
  </div>
);

const DataTablePanel: React.FC = () => {
  const rows = [
    { name: 'Zinnia Humphry', date: '2019-03-15' },
    { name: 'Cyril Mortlock', date: '2021-01-09' },
    { name: 'Drake Fythe', date: '2020-06-22' },
    { name: 'Poppy Farquhar', date: '2018-11-02' },
    { name: 'Peregrine Hayselden', date: '2022-04-28' },
    { name: 'Isolde Renwick', date: '2020-09-14' },
    { name: 'Barnabas Quill', date: '2017-12-30' },
    { name: 'Elowen Carne', date: '2023-02-18' },
    { name: 'Lysander Vane', date: '2019-07-05' },
    { name: 'Thessaly Wren', date: '2021-11-23' },
    { name: 'Cassius Ford', date: '2018-04-11' },
    { name: 'Rowena Teal', date: '2022-08-09' },
  ];
  return (
    <div className="flex flex-col">
      {/* Subheader */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-secondary">
        <span className="text-xs text-tertiary">Showing 12 of 11 158 members</span>
        <button type="button" className="flex items-center gap-1 text-xs text-tertiary hover:text-primary transition-colors">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v6M4 6l2 2 2-2M2 10h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Export CSV
        </button>
      </div>
      {/* Table head */}
      <div className="grid grid-cols-2 px-5 py-2 border-b border-secondary sticky top-0 bg-primary z-10">
        <span className="text-[11px] font-medium text-tertiary uppercase tracking-wide">Member Name</span>
        <span className="text-[11px] font-medium text-tertiary uppercase tracking-wide">Member Since</span>
      </div>
      {/* Rows */}
      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-2 px-5 border-b border-secondary hover:bg-hover transition-colors">
          <div className="h-[52px] flex items-center text-sm text-primary truncate">{row.name}</div>
          <div className="h-[52px] flex items-center text-sm text-secondary">{row.date}</div>
        </div>
      ))}
    </div>
  );
};

/* ── Member table panel content ────────────────────────────────────── */
const ALL_MEMBERS = [
  { name: 'Sarah Chen', avatar: 'SC', from: 'Free', to: 'Pro', email: 'sarah@example.com' },
  { name: 'Marcus Rivera', avatar: 'MR', from: 'Free', to: 'Admin', email: 'marcus@example.com' },
  { name: 'Priya Nair', avatar: 'PN', from: 'Pro', to: 'Admin', email: 'priya@example.com' },
  { name: 'Tom Kowalski', avatar: 'TK', from: 'Free', to: 'Pro', email: 'tom@example.com' },
  { name: 'Ava Liu', avatar: 'AL', from: 'Pro', to: 'Free', email: 'ava@example.com' },
  { name: 'James Park', avatar: 'JP', from: 'Free', to: 'Pro', email: 'james@example.com' },
  { name: 'Nina Patel', avatar: 'NP', from: 'Free', to: 'Pro', email: 'nina@example.com' },
  { name: 'Leo Santos', avatar: 'LS', from: 'Admin', to: 'Pro', email: 'leo@example.com' },
  { name: 'Chloe Kim', avatar: 'CK', from: 'Free', to: 'Pro', email: 'chloe@example.com' },
  { name: 'Ryan Miller', avatar: 'RM', from: 'Pro', to: 'Free', email: 'ryan@example.com' },
];
const MemberTablePanel: React.FC = () => (
  <div className="flex flex-col">
    {/* Subheader */}
    <div className="flex items-center justify-between px-5 py-3 border-b border-secondary">
      <span className="text-xs text-tertiary">47 members total · 45 updated successfully</span>
      <button type="button" className="flex items-center gap-1 text-xs text-tertiary hover:text-primary transition-colors">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v6M4 6l2 2 2-2M2 10h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Export CSV
      </button>
    </div>
    {/* Table head */}
    <div className="grid grid-cols-[28px_1fr_72px_72px] gap-3 items-center px-5 py-2 border-b border-secondary sticky top-0 bg-primary z-10">
      <span />
      <span className="text-[11px] font-medium text-tertiary uppercase tracking-wide">Member</span>
      <span className="text-[11px] font-medium text-tertiary uppercase tracking-wide">Before</span>
      <span className="text-[11px] font-medium text-tertiary uppercase tracking-wide">After</span>
    </div>
    {/* Rows */}
    {ALL_MEMBERS.map((m, i) => (
      <div key={i} className="grid grid-cols-[28px_1fr_72px_72px] gap-3 items-center px-5 py-3 border-b border-secondary hover:bg-hover transition-colors">
        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0">
          <span className="text-[10px] font-semibold text-tertiary">{m.avatar}</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm text-primary truncate">{m.name}</span>
          <span className="text-xs text-tertiary truncate">{m.email}</span>
        </div>
        <span className="text-xs text-tertiary bg-secondary rounded-full px-2 py-0.5 w-fit">{m.from}</span>
        <span className="text-xs text-primary bg-[#f0fdf4] border border-[#bbf7d0] rounded-full px-2 py-0.5 w-fit">{m.to}</span>
      </div>
    ))}
    <div className="px-5 py-3">
      <span className="text-xs text-tertiary">Showing 10 of 47 members</span>
    </div>
  </div>
);

const PagePreviewPanel: React.FC<{ onOpenBuilder: () => void }> = ({ onOpenBuilder: _onOpenBuilder }) => (
  <div className="flex flex-col h-full overflow-y-auto bg-[#f7f9fa]">
    {/* Scaled page render — origin top-left, scaled to fit panel width */}
    <div className="relative overflow-hidden" style={{ height: '900px' }}>
      <div
        className="absolute top-0 left-0 origin-top-left bg-white pointer-events-none"
        style={{ transform: 'scale(0.48)', width: 'calc(100% / 0.48)' }}
      >
        {/* ── Navbar ── */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-[#f0f3f5] bg-white">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#191b1f] flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1c-.4 1.1-.7 2.2-1.8 2.6C3.1 4 2 4.5 1.5 6c.5 1.5 1.6 2 2.7 2.4C5.3 8.8 5.6 9.9 6 11c.4-1.1.7-2.2 1.8-2.6C8.9 8 10 7.5 10.5 6 10 4.5 8.9 4 7.8 3.6 6.7 3.2 6.4 2.1 6 1z" fill="white"/></svg>
            </div>
            <span className="text-sm font-semibold text-[#191b1f]">Circle Community</span>
          </div>
          <div className="flex items-center gap-6">
            {['Spaces', 'Events', 'Members', 'Courses'].map(l => (
              <span key={l} className="text-sm text-[#545861]">{l}</span>
            ))}
          </div>
          <button type="button" className="h-8 px-4 text-xs font-medium text-white bg-[#191b1f] rounded-lg">Join community</button>
        </div>

        {/* ── Hero ── */}
        <div className="px-12 py-16 text-center" style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f0f9ff 100%)' }}>
          <span className="inline-block text-xs font-medium text-[#3c53e7] bg-[rgba(60,83,231,0.08)] px-3 py-1 rounded-full mb-4">Welcome to our community</span>
          <h1 className="text-[36px] font-bold text-[#191b1f] leading-tight tracking-[-0.5px] mb-4">
            The community for growth-minded<br/>professionals
          </h1>
          <p className="text-base text-[#545861] mb-8 max-w-xl mx-auto">
            Join 3,200+ members learning, sharing, and growing together. Get access to exclusive resources, live events, and expert mentorship.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button type="button" className="h-11 px-6 text-sm font-medium text-white bg-[#191b1f] rounded-xl">Join for free</button>
            <button type="button" className="h-11 px-6 text-sm font-medium text-[#191b1f] border border-[#e4e7eb] rounded-xl bg-white">Learn more</button>
          </div>
        </div>

        {/* ── Popular spaces ── */}
        <div className="px-8 py-12 bg-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#191b1f]">Popular spaces</h2>
            <p className="text-sm text-[#717680] mt-1">Explore the most active discussions</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'General Discussion', count: '1.2k', color: '#e8f4ff', icon: '💬' },
              { name: 'Introductions', count: '847', color: '#f0fdf4', icon: '👋' },
              { name: 'Resources & Guides', count: '612', color: '#fef3c7', icon: '📚' },
            ].map(s => (
              <div key={s.name} className="rounded-xl p-5 border border-[#f0f3f5]" style={{ background: s.color }}>
                <span className="text-2xl mb-3 block">{s.icon}</span>
                <div className="text-sm font-semibold text-[#191b1f]">{s.name}</div>
                <div className="text-xs text-[#717680] mt-1">{s.count} members</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Upcoming events ── */}
        <div className="px-8 py-12 bg-[#f7f9fa]">
          <h2 className="text-2xl font-bold text-[#191b1f] mb-6">Upcoming events</h2>
          <div className="flex flex-col gap-3">
            {[
              { title: 'Community kickoff call', date: 'Jan 20, 2026 · 3:00 PM', badge: 'Live' },
              { title: 'Growth masterclass with Sarah Chen', date: 'Jan 24, 2026 · 5:00 PM', badge: 'Online' },
              { title: 'Q&A: Advanced community strategies', date: 'Feb 1, 2026 · 4:00 PM', badge: 'Online' },
            ].map(ev => (
              <div key={ev.title} className="flex items-center gap-4 bg-white rounded-xl px-5 py-4 border border-[#f0f3f5]">
                <div className="w-10 h-10 rounded-xl bg-[#e8eaf6] flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1.5" stroke="#3c53e7" strokeWidth="1.3"/><path d="M5 2v2M11 2v2M2 7h12" stroke="#3c53e7" strokeWidth="1.3" strokeLinecap="round"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#191b1f] truncate">{ev.title}</div>
                  <div className="text-xs text-[#717680]">{ev.date}</div>
                </div>
                <span className="text-[10px] font-medium text-[#3c53e7] bg-[rgba(60,83,231,0.08)] px-2 py-0.5 rounded-full shrink-0">{ev.badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-8 py-8 bg-[#191b1f]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[rgba(255,255,255,0.5)]">© 2026 Circle Community. All rights reserved.</span>
            <div className="flex items-center gap-4">
              {['Privacy', 'Terms', 'Contact'].map(l => (
                <span key={l} className="text-sm text-[rgba(255,255,255,0.5)]">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ── Builder mode components ────────────────────────────────────────── */

const BuilderNavIcon: React.FC<{ active?: boolean; title: string; children: React.ReactNode; onClick?: () => void }> = ({ active, title, children, onClick }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${
      active ? 'bg-[#F0F3F5] text-[#191b1f]' : 'text-[#717680] hover:bg-[#e8eaed] hover:text-[#191b1f]'
    }`}
  >
    {children}
  </button>
);

const BUILDER_COMPONENTS = [
  { id: 'text',        label: 'Text',        icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 7.5h8M2 11h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { id: 'heading',     label: 'Heading',     icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4v8M7 4v8M2 8h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M10 5.5h4M10 8h3M10 10.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { id: 'button',      label: 'Button',      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.75" y="4.75" width="12.5" height="6.5" rx="1.75" stroke="currentColor" strokeWidth="1.3"/><path d="M5.5 8h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { id: 'image',       label: 'Image',       icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.75" y="2.75" width="12.5" height="10.5" rx="1.75" stroke="currentColor" strokeWidth="1.3"/><path d="M1.75 10.5l3-3 2.5 2.5 2-2 3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><circle cx="5.5" cy="6" r="1" fill="currentColor"/></svg> },
  { id: 'video',       label: 'Video',       icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.75" y="3.25" width="8.5" height="9.5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M10.25 6.5l4-2v7l-4-2V6.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
  { id: 'card',        label: 'Card',        icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.75" y="2.75" width="12.5" height="10.5" rx="1.75" stroke="currentColor" strokeWidth="1.3"/><path d="M1.75 6.25h12.5" stroke="currentColor" strokeWidth="1.3"/><path d="M4.5 9h3M4.5 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { id: 'columns',     label: 'Columns',     icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.75" y="2.75" width="5" height="10.5" rx="1.25" stroke="currentColor" strokeWidth="1.3"/><rect x="9.25" y="2.75" width="5" height="10.5" rx="1.25" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { id: 'section',     label: 'Section',     icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.75" y="2.75" width="12.5" height="10.5" rx="1.75" stroke="currentColor" strokeWidth="1.3"/><path d="M4.5 6h7M4.5 8.5h5M4.5 11h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { id: 'divider',     label: 'Divider',     icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M2 4.5h12M2 11.5h12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".3"/></svg> },
  { id: 'form',        label: 'Form',        icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.75" y="3.25" width="12.5" height="3.5" rx="1.25" stroke="currentColor" strokeWidth="1.3"/><rect x="1.75" y="9.25" width="12.5" height="3.5" rx="1.25" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { id: 'list',        label: 'List',        icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="3" cy="5" r="1" fill="currentColor"/><circle cx="3" cy="8" r="1" fill="currentColor"/><circle cx="3" cy="11" r="1" fill="currentColor"/><path d="M6 5h8M6 8h6M6 11h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { id: 'testimonial', label: 'Testimonial', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 5c0-.83.67-1.5 1.5-1.5H7c.83 0 1.5.67 1.5 1.5v2.5C8.5 8.33 7.83 9 7 9H5.5L4 11V9H3.5C2.67 9 2 8.33 2 7.5V5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M9.5 7c0-.83.67-1.5 1.5-1.5h2c.83 0 1.5.67 1.5 1.5V9c0 .83-.67 1.5-1.5 1.5H11.5L10 12V10.5h-.5C8.67 10.5 8 9.83 8 9" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
];

const BuilderComponentPicker: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [search, setSearch] = React.useState('');
  const filtered = BUILDER_COMPONENTS.filter(c => c.label.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 h-[52px] flex items-center gap-2 px-4 border-b border-[#f0f3f5]">
        <span className="text-sm font-semibold text-[#191b1f] flex-1">Add component</span>
        <button type="button" onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#717680] hover:bg-[#f0f3f5] transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </div>
      <div className="shrink-0 px-4 py-3 border-b border-[#f0f3f5]">
        <div className="flex items-center gap-2 bg-[#f7f9fa] border border-[#e4e7eb] rounded-lg px-3 h-8">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0 text-[#9ca3af]"><circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.3"/><path d="M10 10l-1.5-1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
          <input type="text" placeholder="Search components…" value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-xs text-[#191b1f] placeholder:text-[#9ca3af] outline-none" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-2">
          {filtered.map(comp => (
            <button key={comp.id} type="button" className="flex flex-col items-start gap-2 bg-white border border-[#e4e7eb] rounded-xl p-3 text-left hover:border-[#3c53e7] hover:bg-[#f7f8ff] transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-[#f7f9fa] group-hover:bg-[rgba(60,83,231,0.06)] flex items-center justify-center text-[#545861] group-hover:text-[#3c53e7] transition-colors">
                {comp.icon}
              </div>
              <span className="text-xs font-medium text-[#191b1f]">{comp.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const BuilderSideNav: React.FC<{ onExit: () => void; activePanel: string; onPanelChange: (panel: string) => void }> = ({ onExit, activePanel, onPanelChange }) => (
  <div className="h-full w-[68px] shrink-0 bg-[#f7f9fa] border-r border-[#e4e7eb] flex flex-col py-4 px-[16px]">

    {/* ── Top section ── */}
    <div className="flex flex-col gap-6 flex-1 min-h-0">

      {/* Back button */}
      <button
        type="button"
        title="Back to Copilot"
        onClick={onExit}
        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-[#e4e7eb] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:bg-[#f7f9fa] transition-colors shrink-0"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12.5 5.5L7.5 10l5 4.5" stroke="#191b1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7.5 10h9" stroke="#191b1f" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Main nav items */}
      <div className="flex flex-col gap-2">

        {/* Circle AI — active */}
        <BuilderNavIcon active={activePanel === 'chat'} title="Circle AI" onClick={() => onPanelChange('chat')}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M8 2C8 6.2 6.2 8 2 8C6.2 8 8 9.8 8 14C8 9.8 9.8 8 14 8C9.8 8 8 6.2 8 2Z" fill="currentColor"/>
            <path d="M15 2C15 4.2 14.2 5 12.5 5C14.2 5 15 5.8 15 7.5C15 5.8 15.8 5 17.5 5C15.8 5 15 4.2 15 2Z" fill="currentColor"/>
          </svg>
        </BuilderNavIcon>

        {/* New chat — section-md */}
        <BuilderNavIcon title="New chat">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1.75" y="4.75" width="16.5" height="11.5" rx="1.75" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M1.75 8.25h16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M5 11.5h4.5M5 13.75h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </BuilderNavIcon>

        {/* Add component — circle-plus-md */}
        <BuilderNavIcon active={activePanel === 'components'} title="Add component" onClick={() => onPanelChange(activePanel === 'components' ? 'chat' : 'components')}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 7v6M7 10h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </BuilderNavIcon>

        {/* Skills — layers-md */}
        <BuilderNavIcon title="Skills">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4L3.5 8.5 10 13l6.5-4.5L10 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.5 12L10 16.5l6.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </BuilderNavIcon>

        {/* Projects — color-swatch-md */}
        <BuilderNavIcon title="Projects">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 14.5L4 7a1.5 1.5 0 012.1-1.4l7 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="8" y="8.5" width="8.5" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="10" cy="13" r="1.25" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
        </BuilderNavIcon>

        {/* Library — page-md */}
        <BuilderNavIcon title="Library">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="3.75" y="2.25" width="12.5" height="15.5" rx="1.75" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 7.5h6M7 10.5h6M7 13.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </BuilderNavIcon>

        {/* Settings — settings-gear-md */}
        <BuilderNavIcon title="Settings">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="2.75" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 2.5V4M10 16v1.5M2.5 10H4M16 10h1.5M4.7 4.7l1.05 1.05M14.25 14.25l1.05 1.05M15.3 4.7l-1.05 1.05M5.75 14.25L4.7 15.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </BuilderNavIcon>
      </div>
    </div>

    {/* ── Bottom: expand + avatar ── */}
    <div className="flex flex-col items-center gap-4 pb-1">
      {/* layout-left-md */}
      <button type="button" title="Expand sidebar" className="w-9 h-9 flex items-center justify-center rounded-xl text-[#717680] hover:bg-[#e8eaed] hover:text-[#191b1f] transition-colors">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M7.5 3v14" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </button>
      <div className="w-5 h-5 rounded-full overflow-hidden shrink-0">
        <img src="/ai-avatar.png" alt="User" className="w-full h-full object-cover" />
      </div>
    </div>
  </div>
);

const BuilderCanvas: React.FC = () => {
  const [viewport, setViewport] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedSection, setSelectedSection] = React.useState<string | null>('hero');
  const [zoom, setZoom] = React.useState(100);

  const bgColors: Record<string, string> = {
    hero: '#f0f4ff',
    spaces: '#ffffff',
    events: '#f7f9fa',
    footer: '#191b1f',
  };
  const selectedBg = selectedSection ? bgColors[selectedSection] ?? '#ffffff' : '#ffffff';

  return (
    <div className="flex-1 min-w-0 flex flex-col min-h-0 p-4 pl-0 bg-primary gap-2">
      <div className="flex-1 rounded-2xl border border-[#e4e7eb] bg-white overflow-hidden flex flex-col shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        {/* Canvas header */}
        <div className="shrink-0 h-[52px] flex items-center px-4 border-b border-[#f0f3f5] gap-2 bg-white">
          <div className="flex items-center gap-1.5 flex-1 min-w-0 text-sm">
            <span className="text-[#717680] cursor-pointer hover:text-[#191b1f] transition-colors">Pages</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#c0c4cc] shrink-0"><path d="M4 3l3.5 3L4 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="font-semibold text-[#191b1f]">Home page</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button type="button" className="h-8 px-3 text-xs font-medium text-[#545861] border border-[#e4e7eb] rounded-lg hover:bg-[#f7f9fa] transition-colors">Save</button>
            <button type="button" className="h-8 px-3 text-xs font-medium text-white bg-[#191b1f] rounded-lg hover:bg-[#2d3139] transition-colors">Publish</button>
          </div>
        </div>

        {/* Canvas body */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Page preview */}
          <div className="flex-1 min-w-0 relative overflow-y-auto bg-[#f7f9fa] flex flex-col items-center px-6">
            <div
              className="my-6 bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] overflow-hidden transition-[width] duration-300"
              style={{ width: viewport === 'desktop' ? '100%' : viewport === 'tablet' ? '768px' : '375px', maxWidth: '100%' }}
            >
              {/* ── Mock page: Navbar ── */}
              <div className="flex items-center justify-between px-8 py-4 border-b border-[#f0f3f5]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#191b1f] flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1c-.4 1.1-.7 2.2-1.8 2.6C3.1 4 2 4.5 1.5 6c.5 1.5 1.6 2 2.7 2.4C5.3 8.8 5.6 9.9 6 11c.4-1.1.7-2.2 1.8-2.6C8.9 8 10 7.5 10.5 6 10 4.5 8.9 4 7.8 3.6 6.7 3.2 6.4 2.1 6 1z" fill="white"/></svg>
                  </div>
                  <span className="text-sm font-semibold text-[#191b1f]">Circle Community</span>
                </div>
                <div className="flex items-center gap-6">
                  {['Spaces', 'Events', 'Members', 'Courses'].map(l => (
                    <span key={l} className="text-sm text-[#545861] hover:text-[#191b1f] cursor-pointer transition-colors">{l}</span>
                  ))}
                </div>
                <button type="button" className="h-8 px-4 text-xs font-medium text-white bg-[#191b1f] rounded-lg">Join community</button>
              </div>

              {/* ── Hero ── */}
              <div
                className={`px-12 py-16 text-center cursor-pointer transition-all ${selectedSection === 'hero' ? 'ring-2 ring-[#3c53e7] ring-offset-2' : 'hover:ring-1 hover:ring-[#c0c4cc] hover:ring-offset-1'}`}
                style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f0f9ff 100%)' }}
                onClick={() => setSelectedSection('hero')}
              >
                <span className="inline-block text-xs font-medium text-[#3c53e7] bg-[rgba(60,83,231,0.08)] px-3 py-1 rounded-full mb-4">Welcome to our community</span>
                <h1 className="text-[36px] font-bold text-[#191b1f] leading-tight tracking-[-0.5px] mb-4">The community for growth-minded<br/>professionals</h1>
                <p className="text-base text-[#545861] mb-8 max-w-xl mx-auto">Join 3,200+ members learning, sharing, and growing together. Get access to exclusive resources, live events, and expert mentorship.</p>
                <div className="flex items-center justify-center gap-3">
                  <button type="button" className="h-11 px-6 text-sm font-medium text-white bg-[#191b1f] rounded-xl">Join for free</button>
                  <button type="button" className="h-11 px-6 text-sm font-medium text-[#191b1f] border border-[#e4e7eb] rounded-xl bg-white">Learn more</button>
                </div>
              </div>

              {/* ── Spaces ── */}
              <div
                className={`px-8 py-12 cursor-pointer transition-all ${selectedSection === 'spaces' ? 'ring-2 ring-[#3c53e7] ring-offset-2' : 'hover:ring-1 hover:ring-[#c0c4cc] hover:ring-offset-1'}`}
                onClick={() => setSelectedSection('spaces')}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-[#191b1f]">Popular spaces</h2>
                  <p className="text-sm text-[#717680] mt-1">Explore the most active discussions</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: 'General Discussion', count: '1.2k', color: '#e8f4ff', icon: '💬' },
                    { name: 'Introductions', count: '847', color: '#f0fdf4', icon: '👋' },
                    { name: 'Resources & Guides', count: '612', color: '#fef3c7', icon: '📚' },
                  ].map(s => (
                    <div key={s.name} className="rounded-xl p-5 border border-[#f0f3f5]" style={{ background: s.color }}>
                      <span className="text-2xl mb-3 block">{s.icon}</span>
                      <div className="text-sm font-semibold text-[#191b1f]">{s.name}</div>
                      <div className="text-xs text-[#717680] mt-1">{s.count} members</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Events ── */}
              <div
                className={`px-8 py-12 bg-[#f7f9fa] cursor-pointer transition-all ${selectedSection === 'events' ? 'ring-2 ring-[#3c53e7] ring-offset-2' : 'hover:ring-1 hover:ring-[#c0c4cc] hover:ring-offset-1'}`}
                onClick={() => setSelectedSection('events')}
              >
                <h2 className="text-2xl font-bold text-[#191b1f] mb-6">Upcoming events</h2>
                <div className="flex flex-col gap-3">
                  {[
                    { title: 'Community kickoff call', date: 'Jan 20, 2026 · 3:00 PM', badge: 'Live' },
                    { title: 'Growth masterclass with Sarah Chen', date: 'Jan 24, 2026 · 5:00 PM', badge: 'Online' },
                    { title: 'Q&A: Advanced community strategies', date: 'Feb 1, 2026 · 4:00 PM', badge: 'Online' },
                  ].map(ev => (
                    <div key={ev.title} className="flex items-center gap-4 bg-white rounded-xl px-5 py-4 border border-[#f0f3f5]">
                      <div className="w-10 h-10 rounded-xl bg-[#e8eaf6] flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1.5" stroke="#3c53e7" strokeWidth="1.3"/><path d="M5 2v2M11 2v2M2 7h12" stroke="#3c53e7" strokeWidth="1.3" strokeLinecap="round"/></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[#191b1f] truncate">{ev.title}</div>
                        <div className="text-xs text-[#717680]">{ev.date}</div>
                      </div>
                      <span className="text-[10px] font-medium text-[#3c53e7] bg-[rgba(60,83,231,0.08)] px-2 py-0.5 rounded-full shrink-0">{ev.badge}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Footer ── */}
              <div
                className={`px-8 py-8 bg-[#191b1f] cursor-pointer transition-all ${selectedSection === 'footer' ? 'ring-2 ring-[#3c53e7] ring-offset-2' : 'hover:ring-1 hover:ring-[rgba(255,255,255,0.2)] hover:ring-offset-1'}`}
                onClick={() => setSelectedSection('footer')}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[rgba(255,255,255,0.5)]">© 2026 Circle Community. All rights reserved.</span>
                  <div className="flex items-center gap-4">
                    {['Privacy', 'Terms', 'Contact'].map(l => (
                      <span key={l} className="text-sm text-[rgba(255,255,255,0.5)] hover:text-white cursor-pointer transition-colors">{l}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating toolbar */}
            <div className="sticky bottom-5 flex justify-center pb-2 pointer-events-none">
              <div className="pointer-events-auto inline-flex items-center gap-1 bg-white border border-[#e4e7eb] rounded-2xl px-2 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                {/* Viewport */}
                <div className="flex items-center bg-[#f7f9fa] rounded-xl p-0.5">
                  {[
                    { key: 'desktop', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M5 12h4M7 10v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
                    { key: 'tablet', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2.5" y="1" width="9" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="11" r="0.75" fill="currentColor"/></svg> },
                    { key: 'mobile', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="4" y="1" width="6" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="11" r="0.75" fill="currentColor"/></svg> },
                  ].map(v => (
                    <button
                      key={v.key}
                      type="button"
                      onClick={() => setViewport(v.key as typeof viewport)}
                      className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${viewport === v.key ? 'bg-white text-[#191b1f] shadow-[0_1px_3px_rgba(0,0,0,0.08)]' : 'text-[#717680] hover:text-[#191b1f]'}`}
                    >{v.icon}</button>
                  ))}
                </div>
                <div className="w-px h-4 bg-[#e4e7eb] mx-1" />
                {/* Zoom */}
                <div className="flex items-center gap-0.5">
                  <button type="button" onClick={() => setZoom(z => Math.max(25, z - 25))} className="w-6 h-6 flex items-center justify-center rounded text-[#717680] hover:text-[#191b1f] hover:bg-[#f0f3f5] transition-colors text-lg leading-none">−</button>
                  <span className="text-xs font-medium text-[#191b1f] w-8 text-center">{zoom}%</span>
                  <button type="button" onClick={() => setZoom(z => Math.min(200, z + 25))} className="w-6 h-6 flex items-center justify-center rounded text-[#717680] hover:text-[#191b1f] hover:bg-[#f0f3f5] transition-colors text-lg leading-none">+</button>
                </div>
                <div className="w-px h-4 bg-[#e4e7eb] mx-1" />
                {/* Light/dark */}
                <button type="button" className="w-7 h-7 flex items-center justify-center rounded-lg text-[#717680] hover:text-[#191b1f] hover:bg-[#f0f3f5] transition-colors">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M3.05 3.05l1.06 1.06M9.89 9.89l1.06 1.06M3.05 10.95l1.06-1.06M9.89 4.11l1.06-1.06" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.2"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Properties panel */}
          <div className="w-[260px] shrink-0 border-l border-[#f0f3f5] flex flex-col bg-white overflow-y-auto">
            {/* Panel tab header */}
            <div className="shrink-0 flex items-center px-4 h-10 border-b border-[#f0f3f5]">
              <span className="text-xs font-semibold text-[#191b1f]">Page</span>
            </div>

            {/* Layout section */}
            <div className="px-4 py-3 border-b border-[#f0f3f5]">
              <div className="text-[11px] font-medium text-[#717680] uppercase tracking-wide mb-3">Layout</div>
              <div className="flex flex-col gap-2">
                <div>
                  <div className="text-[11px] text-[#717680] mb-1.5">Padding</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[['T', '48'], ['R', '32'], ['B', '48'], ['L', '32']].map(([label, val]) => (
                      <div key={label} className="flex items-center gap-1.5 bg-[#f7f9fa] border border-[#e4e7eb] rounded-lg px-2 py-1.5">
                        <span className="text-[10px] text-[#717680] shrink-0">{label}</span>
                        <span className="text-xs font-medium text-[#191b1f]">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#717680] mb-1.5">Margin</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[['T', 'auto'], ['R', 'auto'], ['B', 'auto'], ['L', 'auto']].map(([label, val]) => (
                      <div key={label} className="flex items-center gap-1.5 bg-[#f7f9fa] border border-[#e4e7eb] rounded-lg px-2 py-1.5">
                        <span className="text-[10px] text-[#717680] shrink-0">{label}</span>
                        <span className="text-xs font-medium text-[#191b1f]">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Style section */}
            <div className="px-4 py-3 border-b border-[#f0f3f5]">
              <div className="text-[11px] font-medium text-[#717680] uppercase tracking-wide mb-3">Style</div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#717680]">Background</span>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded border border-[#e4e7eb] shrink-0" style={{ background: selectedBg }} />
                  <span className="text-xs font-mono text-[#191b1f]">{selectedBg}</span>
                </div>
              </div>
            </div>

            {/* Typography section */}
            <div className="px-4 py-3">
              <div className="text-[11px] font-medium text-[#717680] uppercase tracking-wide mb-3">Typography</div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#717680]">Font</span>
                  <span className="text-xs font-medium text-[#191b1f]">Inter Variable</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#717680]">Size</span>
                  <div className="flex items-center gap-1.5 bg-[#f7f9fa] border border-[#e4e7eb] rounded-lg px-2 py-1">
                    <span className="text-xs font-medium text-[#191b1f]">16</span>
                    <span className="text-[10px] text-[#717680]">px</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#717680]">Weight</span>
                  <div className="flex items-center gap-1 bg-[#f7f9fa] border border-[#e4e7eb] rounded-lg px-2 py-1">
                    <span className="text-xs font-medium text-[#191b1f]">Regular</span>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 4l3 3 3-3" stroke="#717680" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  onGenerating,
  scrollToBottom = 0,
  entryPointLabel,
  onEntryPointClick,
  onUpdateProjectSteps,
}) => {
  const isNewChat = activeChatId === 'new';
  const isShortcutChat = activeChatId === 'shortcut';
  const [showGreeting, setShowGreeting] = useState(false);

  // Two-phase crossfade: content fades OUT first, then new content fades IN for any view change
  const prevChatIdRef = useRef(activeChatId);
  const prevShortcutTaskRef = useRef(shortcutTask);
  const [displayChatId, setDisplayChatId] = useState(activeChatId);
  const [displayShortcutTask, setDisplayShortcutTask] = useState(shortcutTask);
  const [contentVisible, setContentVisible] = useState(true);
  useEffect(() => {
    const prevId = prevChatIdRef.current;
    const prevTask = prevShortcutTaskRef.current;
    prevChatIdRef.current = activeChatId;
    prevShortcutTaskRef.current = shortcutTask;

    if (prevId === activeChatId && prevTask === shortcutTask) return;

    // Phase 1: fade out over 70ms — content visibly disappears
    setContentVisible(false);
    // Phase 2: at 120ms content is fully invisible — swap displayed content in blank state
    const t1 = setTimeout(() => {
      setDisplayChatId(activeChatId);
      setDisplayShortcutTask(shortcutTask);
    }, 120);
    // Phase 3: at 160ms — fade in new content smoothly
    const t2 = setTimeout(() => {
      requestAnimationFrame(() => setContentVisible(true));
    }, 160);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [activeChatId, shortcutTask]);

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
  const [planAnswers, setPlanAnswers] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  // Chip conversation queue — Artefacts inline; Plan/Clarification/Order results after accept
  type ChipStatus = 'loading' | 'ready';
  interface ChipQueueItem { id: string; label: string; status: ChipStatus; phase?: 'running' | 'done'; }
  const [chipQueue, setChipQueue] = useState<ChipQueueItem[]>([]);
  // Active overlay — shown above message box for Plan/Clarification/Order Clarification
  interface OverlayItem { id: string; label: string; status: ChipStatus; }
  const [activeOverlay, setActiveOverlay] = useState<OverlayItem | null>(null);
  const [, setPlanViewMode] = useState<'numbered' | 'checkbox'>('numbered');
  const [planAccepted, setPlanAccepted] = useState(false);
  const [planOverlayExpanded, setPlanOverlayExpanded] = useState(false);
  const [planStep, setPlanStep] = useState(0); // 0=idle, 1-3=working, 4=done
  const [clarificationQ, setClarificationQ] = useState(1);
  const [clarificationA1, setClarificationA1] = useState<string | null>(null);
  const [clarificationA2, setClarificationA2] = useState<string | null>(null);
  const [clarificationSavedAnswers, setClarificationSavedAnswers] = useState<string[]>([]);
  const [clarificationCustomText, setClarificationCustomText] = useState('');
  const [orderItems, setOrderItems] = useState<string[]>(['Professional/networking', 'Course/education', 'Membership/subscription']);
  const [orderDraggingIdx, setOrderDraggingIdx] = useState<number | null>(null);
  const [orderDragOverIdx, setOrderDragOverIdx] = useState<number | null>(null);
  const [orderSavedItems, setOrderSavedItems] = useState<string[]>([]);
  const [orderCustomText, setOrderCustomText] = useState('');

  // Shortcut task flow state
  type ShortcutPhase = 'greeting' | 'thinking' | 'questions' | 'plan-thinking' | 'done' | 'building' | 'awaiting-confirmation' | 'failed' | 'built';
  const [shortcutPhase, setShortcutPhase] = useState<ShortcutPhase | null>(null);
  const [shortcutFlow, setShortcutFlow] = useState<ShortcutFlowData | null>(null);
  const [shortcutPlanResult, setShortcutPlanResult] = useState<PlanData | null>(null);
  const shortcutBuildMode = false;
  const [builderOpen, setBuilderOpen] = useState(false);
  const shortcutEndRef = useRef<HTMLDivElement>(null);
  // Course-specific interactive first exchange
  const [shortcutUserMessage, setShortcutUserMessage] = useState<string | null>(null);
  const [shortcutFirstAIResponse, setShortcutFirstAIResponse] = useState<string | null>(null);

  // Sensitive step confirmation data
  interface SensitiveStepData { stepTitle: string; message: string; consequence: string; }
  const [shortcutSensitiveStep, setShortcutSensitiveStep] = useState<SensitiveStepData | null>(null);

  // Plan recovery data
  interface RecoveryData { completedSteps: number; totalSteps: number; failedStep: string; errorMessage: string; }
  const [shortcutRecovery, setShortcutRecovery] = useState<RecoveryData | null>(null);

  // Plan-with-confirmation execution state machine
  type PlanConfPhase = 'idle' | 'working' | 'awaiting-confirmation' | 'working-post-confirm' | 'complete' | 'error';
  const [planConfPhase, setPlanConfPhase] = useState<PlanConfPhase>('idle');
  // 1-based index of the currently active step (0 = not started)
  const [planConfStep, setPlanConfStep] = useState(0);
  // When true, skip confirmation at sensitive step (auto-execute variant)
  const [planConfNoConfirm, setPlanConfNoConfirm] = useState(false);
  // Expand/collapse step details in execution card and modals
  const [planConfDetailsExpanded, setPlanConfDetailsExpanded] = useState(false);

  // Right-side artifact panel
  type ArtifactPanelMode = 'half' | 'full';
  interface ArtifactPanel { title: string; subtitle?: string; type: string; }
  const [builderMode, setBuilderMode] = useState(false);
  const [builderVisible, setBuilderVisible] = useState(false);
  const [builderPanel, setBuilderPanel] = useState<'chat' | 'components'>('chat');
  const [artifactPanel, setArtifactPanel] = useState<ArtifactPanel | null>(null);
  const [artifactPanelMode, setArtifactPanelMode] = useState<ArtifactPanelMode>('half');
  const [artifactLoading, setArtifactLoading] = useState(false);
  const openArtifactPanel = (panel: ArtifactPanel) => { setArtifactPanel(panel); setArtifactPanelMode('half'); };
  const closeArtifactPanel = () => { setArtifactPanel(null); setArtifactPanelMode('half'); };
  const expandArtifactPanel = () => {
    setArtifactPanelMode('full');
    setArtifactLoading(true);
    setTimeout(() => setArtifactLoading(false), 800);
  };
  const acceptPlanChip = (label: string) => {
    setActiveOverlay(null);
    const chipId = `${label}-${Date.now()}`;
    setChipQueue(prev => [...prev, { id: chipId, label, status: 'ready', phase: 'running' }]);
    setTimeout(() => {
      setChipQueue(prev => prev.map(c => c.id === chipId ? { ...c, phase: 'done' } : c));
      setTimeout(() => savedChatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
    }, 2800);
  };
  const enterBuilder = () => {
    closeArtifactPanel();
    setBuilderMode(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setBuilderVisible(true)));
  };
  const exitBuilder = () => {
    setBuilderVisible(false);
    setTimeout(() => setBuilderMode(false), 460);
  };

  // Redesign project progress scenario
  type RedesignPhase = 'idle' | 'thinking' | 'reply' | 'done';
  const [redesignPhase, setRedesignPhase] = useState<RedesignPhase>('idle');
  const [redesignPrompt, setRedesignPrompt] = useState('');

  // Fresh conversation state — triggered when isNewChat + initialMessage
  type FreshPhase = 'user-message' | 'thinking' | 'reply';
  const [freshPhase, setFreshPhase] = useState<FreshPhase | null>(null);
  const [freshReply, setFreshReply] = useState('');
  const [freshSkill, setFreshSkill] = useState<{ id: string; icon: string } | null>(null);

  // Render text with #mention chips styled inline
  const renderWithMentions = (text: string) => {
    const parts = text.split(/(#\S+)/g);
    return parts.map((part, i) =>
      /^#\S+$/.test(part)
        ? (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              background: '#eef0fd',
              border: '1px solid #c7cdf7',
              borderRadius: 6,
              padding: '1px 7px',
              color: '#3c53e7',
              fontWeight: 500,
              fontSize: 'inherit',
              whiteSpace: 'nowrap',
              verticalAlign: 'middle',
              lineHeight: 1.5,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="5" cy="5" r="4" fill="#3c53e7" opacity="0.2"/>
              <circle cx="5" cy="3.5" r="1.5" fill="#3c53e7"/>
              <path d="M2 8.5c0-1.657 1.343-3 3-3s3 1.343 3 3" stroke="#3c53e7" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            {part}
          </span>
        )
        : part
    );
  };

  // Submitted messages from the chat box (skill-triggered or generic)
  type ClarificationChoice = 'live_chat' | 'email';
  type SubmittedMessage = { id: string; text: string; skill?: { id: string; icon: string }; phase: 'thinking' | 'reply'; reply: string; stopped?: boolean; referenceAttachments?: Array<{ authorName: string; snippet: string; messageId: string; category: string }>; artifact?: import('../InboxPage/aiAssistMockData').AiAssistArtifact; targetCategory?: string; recipientName?: string; clarification?: { selected?: ClarificationChoice }; assistantOnly?: boolean; ticketForm?: { open: boolean; initialDescription: string }; ticketSubmitted?: { threadId: string; subject: string }; queueCard?: { threadId: string } };
  const [submittedMessages, setSubmittedMessages] = useState<SubmittedMessage[]>([]);
  const [awaitingLiveChatClarification, setAwaitingLiveChatClarification] = useState(false);
  // Dedupe the fresh-chat support fork against React.StrictMode's effect double-invoke.
  const consumedFreshSupportRef = useRef<string | null>(null);
  const isGenerating = submittedMessages.some(m => m.phase === 'thinking');
  const isPlanRunning = planAccepted && planStep > 0 && planStep < 4;
  // True while a Clarification-result widget is awaiting a choice — the composer
  // is hidden so the user must answer (or Skip) the widget before continuing.
  const hasPendingClarification = submittedMessages.some(
    m => m.clarification && !m.clarification.selected,
  );
  const handleStop = () => {
    setSubmittedMessages(prev => prev.map(m =>
      m.phase === 'thinking' ? { ...m, phase: 'reply', reply: '', stopped: true } : m
    ));
    if (isPlanRunning) {
      setPlanStep(0);
      setPlanAccepted(false);
    }
  };
  const freshChatEndRef = useRef<HTMLDivElement>(null);
  const savedChatEndRef = useRef<HTMLDivElement>(null);
  const savedChatScrollRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Notify parent when AI is actively generating
  useEffect(() => {
    const generating =
      freshPhase === 'thinking' ||
      planPhase === 'thinking' ||
      shortcutPhase === 'thinking' ||
      shortcutPhase === 'plan-thinking' ||
      chipQueue.some(c => c.status === 'loading');
    onGenerating?.(generating);
  }, [freshPhase, planPhase, shortcutPhase, chipQueue, onGenerating]);

  // Open builder when parent increments the openBuilder counter
  useEffect(() => {
    if (openBuilder > 0) setBuilderOpen(true);
  }, [openBuilder]);

  // Scroll to bottom when parent requests it (e.g. user opens chat with unread message)
  useEffect(() => {
    if (scrollToBottom > 0) {
      setTimeout(() => savedChatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [scrollToBottom]);

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
    setShortcutUserMessage(null);
    setShortcutFirstAIResponse(null);

    // Course tasks wait for user input — don't auto-advance
    if (/course|lesson/i.test(shortcutTask)) return;

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
    // Support keyword fork — render the clarification widget instead of a fresh
    // AI reply. Routes the dashboard "ask anything" surface into the same flow
    // as the in-Copilot keyword path so support tickets can be triggered from
    // the dashboard composer.
    if (initialMessage.toLowerCase().includes('support')) {
      if (consumedFreshSupportRef.current === initialMessage) return;
      consumedFreshSupportRef.current = initialMessage;
      const msgId = `msg-${Date.now()}`;
      setSubmittedMessages(prev => [
        ...prev,
        { id: msgId, text: initialMessage, phase: 'reply', reply: 'Clarify some information:', clarification: {} },
      ]);
      return;
    }
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


  const [shortcutAnswers, setShortcutAnswers] = useState<string[]>([]);

  const handleShortcutQuestionsComplete = (answers: string[]) => {
    setShortcutAnswers(answers);
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

  // Scroll to bottom when new submitted messages arrive or update
  useEffect(() => {
    if (submittedMessages.length > 0) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        savedChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [submittedMessages]);
  // Scroll to bottom whenever conversation is extended
  useEffect(() => {
    if (chipQueue.length > 0) {
      const last = chipQueue[chipQueue.length - 1];
      const delay = last.status === 'ready' ? 100 : 50;
      setTimeout(() => savedChatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), delay);
    }
  }, [chipQueue]);

  // Show scroll-to-bottom button only when user has scrolled up with content hidden below
  useEffect(() => {
    const el = savedChatScrollRef.current;
    if (!el) return;
    const check = () => {
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollBtn(distFromBottom > 100);
    };
    el.addEventListener('scroll', check, { passive: true });
    // Re-check when content height changes (new messages rendered below fold)
    const ro = new ResizeObserver(() => requestAnimationFrame(check));
    ro.observe(el);
    // Initial check after layout
    requestAnimationFrame(check);
    return () => {
      el.removeEventListener('scroll', check);
      ro.disconnect();
    };
  }, [displayChatId]);

  // Auto-advance planStep 1→2→3→4 when accepted
  useEffect(() => {
    if (!planAccepted || planStep === 0 || planStep >= 4) return;
    const t = setTimeout(() => setPlanStep(s => s + 1), 1500);
    return () => clearTimeout(t);
  }, [planAccepted, planStep]);

  // Scroll to bottom when plan execution advances
  useEffect(() => {
    if (planStep > 0) {
      setTimeout(() => savedChatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [planStep]);

  // Auto-advance planConf execution steps
  useEffect(() => {
    if (planConfPhase === 'working') {
      if (planConfStep < PLAN_CONF_SENSITIVE_IDX + 1) {
        // Normal steps before sensitive — advance after delay
        const t = setTimeout(() => setPlanConfStep(s => s + 1), 1200);
        return () => clearTimeout(t);
      } else if (planConfStep === PLAN_CONF_SENSITIVE_IDX + 1) {
        if (planConfNoConfirm) {
          // Auto variant — skip confirmation, continue executing
          const t = setTimeout(() => setPlanConfPhase('working-post-confirm'), 1200);
          return () => clearTimeout(t);
        } else {
          // Standard variant — show confirmation modal
          const t = setTimeout(() => setPlanConfPhase('awaiting-confirmation'), 1200);
          return () => clearTimeout(t);
        }
      }
    } else if (planConfPhase === 'working-post-confirm') {
      const t = setTimeout(() => {
        if (planConfStep >= PLAN_CONF_STEPS.length) {
          setPlanConfPhase('complete');
        } else {
          setPlanConfStep(s => s + 1);
        }
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [planConfPhase, planConfStep, planConfNoConfirm]);

  // Scroll to bottom when planConf state changes
  useEffect(() => {
    if (planConfPhase !== 'idle') {
      setTimeout(() => savedChatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [planConfPhase, planConfStep]);
  // Scroll to bottom when redesign phases change
  useEffect(() => {
    if (redesignPhase !== 'idle') {
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [redesignPhase]);

  const handleClarificationChoice = (msgId: string, triggerText: string, choice: ClarificationChoice, customText?: string) => {
    // Mark the widget instance as answered. For live chat this is a *soft* lock
    // (only the live-chat row goes inactive — email row stays clickable).
    setSubmittedMessages(prev => prev.map(m =>
      m.id === msgId && m.clarification ? { ...m, clarification: { selected: choice } } : m,
    ));

    if (choice === 'email') {
      // If the user had already started a live-chat clarification and is now
      // switching to email, drop the awaiting state.
      setAwaitingLiveChatClarification(false);
      const sourceText = (customText ?? triggerText).trim();
      const initialDescription = sourceText
        ? sourceText
        : 'Admin Artiom Goralsky wants to talk to a support agent.';
      const thinkingId = `msg-${Date.now()}`;
      setSubmittedMessages(prev => [...prev, {
        id: thinkingId,
        text: '',
        phase: 'thinking',
        reply: '',
        assistantOnly: true,
      }]);
      window.setTimeout(() => {
        setSubmittedMessages(prev => prev.map(m => m.id === thinkingId
          ? { ...m, phase: 'reply', reply: 'Add details', ticketForm: { open: true, initialDescription } }
          : m,
        ));
      }, 1500);
      return;
    }

    // Live chat path — stay in Copilot, briefly "think", then prompt for the
    // first message that will be handed off to an agent.
    const promptId = `msg-${Date.now()}`;
    setSubmittedMessages(prev => [...prev, {
      id: promptId,
      text: '',
      phase: 'thinking',
      reply: '',
      assistantOnly: true,
    }]);
    window.setTimeout(() => {
      setSubmittedMessages(prev => prev.map(m => m.id === promptId
        ? { ...m, phase: 'reply', reply: "Got it. Send a quick description for the agent — they'll see this when they join." }
        : m,
      ));
    }, 1500);
    setAwaitingLiveChatClarification(true);
  };

  const handleTicketFormSubmit = (formMsgId: string, data: SupportTicketFormData) => {
    const id = `sup-${Date.now()}`;
    const subject = data.helpTypeLabel || 'Support request';
    const thread: SupportThread = {
      id,
      subject,
      channel: 'email',
      state: 'awaiting_circle',
      lastActivity: 'now',
      messages: [
        {
          id: `${id}-m1`,
          sender: 'admin',
          body: data.description,
          timestamp: 'Just now',
        },
      ],
    };
    addSupportThread(thread);
    const thinkingId = `msg-${Date.now()}`;
    setSubmittedMessages(prev => {
      const cleared = prev.map(m =>
        m.id === formMsgId ? { ...m, ticketForm: undefined } : m,
      );
      return [...cleared, {
        id: thinkingId,
        text: '',
        phase: 'thinking',
        reply: '',
        assistantOnly: true,
      }];
    });
    window.setTimeout(() => {
      setSubmittedMessages(prev => prev.map(m => m.id === thinkingId
        ? {
            ...m,
            phase: 'reply',
            reply: "Thanks — your ticket is in. You'll get replies via email, or you can follow it in your inbox.",
            ticketSubmitted: { threadId: id, subject },
          }
        : m,
      ));
    }, 2000);
  };

  const openTicketInInbox = (threadId: string) => {
    window.dispatchEvent(new CustomEvent('open-support', { detail: { threadId } }));
  };

  const handleChatSubmit = (message: string, skill?: import('../shared/skillData').Skill, msgAttachments?: any[]) => {
    if (skill) {
      setFreshSkill({ id: skill.id, icon: skill.icon });
    } else {
      setFreshSkill(null);
    }
    // Live-chat clarification handoff — when the user is in awaiting state,
    // the next message is treated as the live-chat description for the agent.
    if (awaitingLiveChatClarification) {
      const trimmed = message.trim();
      if (!trimmed) return;

      const threadId = `sup-${Date.now()}`;
      const subject = trimmed.length > 40 ? `${trimmed.slice(0, 40).trimEnd()}…` : trimmed;
      addSupportThread({
        id: threadId,
        subject,
        channel: 'chat',
        state: 'in_queue',
        lastActivity: 'now',
        queueState: { startedAt: Date.now() + 1500 },
        messages: [{ id: `${threadId}-m1`, sender: 'admin', body: trimmed, timestamp: 'Just now' }],
      });

      const turnId = `msg-${Date.now()}`;
      setSubmittedMessages(prev => [...prev, {
        id: turnId, text: trimmed, phase: 'thinking', reply: '',
      }]);

      window.setTimeout(() => {
        setSubmittedMessages(prev => prev.map(m => m.id === turnId ? {
          ...m,
          phase: 'reply',
          reply: "You're in the queue. I'll let you know when an agent joins.",
          queueCard: { threadId },
        } : m));
      }, 1500);

      setAwaitingLiveChatClarification(false);
      return;
    }
    // Support keyword fork — short-circuit normal AI reply, run a brief
    // "thinking" phase, then surface the clarification widget. Mirrors the
    // shortcut-flow pacing (greeting → thinking → questions).
    if (message.toLowerCase().includes('support')) {
      // A fresh "support" message resets any stale awaiting-clarification state.
      setAwaitingLiveChatClarification(false);
      const msgId = `msg-${Date.now()}`;
      setSubmittedMessages(prev => [
        ...prev,
        { id: msgId, text: message, phase: 'thinking', reply: '' },
      ]);
      window.setTimeout(() => {
        setSubmittedMessages(prev => prev.map(m => m.id === msgId
          ? { ...m, phase: 'reply', reply: 'Clarify some information:' }
          : m,
        ));
      }, 1500);
      window.setTimeout(() => {
        setSubmittedMessages(prev => prev.map(m => m.id === msgId
          ? { ...m, clarification: {} }
          : m,
        ));
      }, 2500);
      return;
    }
    if (message.toLowerCase().includes('create a plan') || message.toLowerCase().includes('make a plan') || message.toLowerCase().includes('build a plan')) {
      setPlanPrompt(message);
      setPlanPhase('questions');
    } else if (message.toLowerCase().includes('redesign') && message.toLowerCase().includes('spaces')) {
      setRedesignPrompt(message);
      setRedesignPhase('thinking');
      setTimeout(() => {
        setRedesignPhase('reply');
        setTimeout(() => {
          onUpdateProjectSteps?.(REDESIGNED_STEPS);
          setTimeout(() => setRedesignPhase('done'), 3000);
        }, 800);
      }, 3500);
    } else {
      // Check for reference attachments → look up artifact
      const refAttachments = (msgAttachments ?? []).filter((a: any) => a.type === 'reference');
      const latestRef = refAttachments[refAttachments.length - 1];
      const refData = latestRef?.referenceData;

      if (refData) {
        const interaction = getInteractionByMessageId(refData.messageId, refData.category);

        const msgId = `msg-${Date.now()}`;
        const references = refAttachments.map((a: any) => a.referenceData);
        setSubmittedMessages(prev => [...prev, { id: msgId, text: message, phase: 'thinking', reply: '', referenceAttachments: references }]);

        setTimeout(() => {
          // Use the single artifact from the interaction, or try follow-up
          let artifact = interaction?.artifact ?? null;
          const followUpMatch = interaction?.followUp?.prompt?.toLowerCase() === message.toLowerCase();
          if (followUpMatch && interaction?.followUp) {
            artifact = interaction.followUp.artifact;
          }

          if (artifact) {
            setSubmittedMessages(prev => prev.map(m => m.id === msgId ? { ...m, phase: 'reply', reply: '', artifact, targetCategory: refData.category, recipientName: refData.authorName } : m));
          } else {
            setSubmittedMessages(prev => prev.map(m => m.id === msgId ? { ...m, phase: 'reply', reply: generateFreshReply(message) } : m));
          }
        }, 600);
      } else {
        // Generic message — no references
        const msgId = `msg-${Date.now()}`;
        const skillData = skill ? { id: skill.id, icon: skill.icon } : undefined;
        setSubmittedMessages(prev => [...prev, { id: msgId, text: message, skill: skillData, phase: 'thinking', reply: '' }]);
        setTimeout(() => {
          // Check if last AI message had an artifact — try follow-up
          const lastArtifactMsg = [...submittedMessages].reverse().find(m => m.artifact);
          if (lastArtifactMsg?.targetCategory) {
            const lastRef = lastArtifactMsg.referenceAttachments?.[0];
            const interaction = lastRef ? getInteractionByMessageId(lastRef.messageId) : null;
            if (interaction?.followUp?.prompt?.toLowerCase() === message.toLowerCase()) {
              setSubmittedMessages(prev => prev.map(m => m.id === msgId ? { ...m, phase: 'reply', reply: '', artifact: interaction.followUp!.artifact, targetCategory: lastArtifactMsg.targetCategory, recipientName: lastArtifactMsg.recipientName } : m));
              return;
            }
          }
          const reply = skill
            ? `I've applied the **${skill.name}** skill to your request. ${generateFreshReply(message)}`
            : generateFreshReply(message);
          setSubmittedMessages(prev => prev.map(m => m.id === msgId ? { ...m, phase: 'reply', reply } : m));
        }, 3500);
      }
    }
  };

  const handleQuestionsComplete = (answers: string[]) => {
    setPlanAnswers(answers);
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

  const isLandingPageTask = displayShortcutTask
    ? /landing|navigation|page/i.test(displayShortcutTask)
    : false;

  const isAccessTask = displayShortcutTask
    ? /access.?group|permission/i.test(displayShortcutTask)
    : false;

  const isPaywallTask = displayShortcutTask
    ? /paywall|pricing/i.test(displayShortcutTask)
    : false;

  const isCourseTask = displayShortcutTask
    ? /course|lesson/i.test(displayShortcutTask)
    : false;

  // Returns the result entity matching the current task type
  const getShortcutResultEntity = (): PlanResultEntity => {
    const task = displayShortcutTask?.toLowerCase() ?? '';
    if (/space|community.?struct/i.test(task))
      return { type: 'space', name: 'Community Spaces', spacesCreated: 5, membersNotified: 127 };
    if (/access.?group|permission/i.test(task))
      return { type: 'access-group', name: 'Premium Members', groupsCreated: 3, rulesApplied: 12 };
    if (/invite|onboard|first.?member/i.test(task))
      return { type: 'member-migration', totalMigrated: 89, failed: 0, newAccessGroup: 'General Members' };
    if (/paywall|pricing/i.test(task))
      return { type: 'paywall', planName: 'Monthly Membership', price: '$29', billingCycle: 'month' };
    if (/course|lesson/i.test(task))
      return { type: 'course', title: displayShortcutTask ?? 'My Course', modules: 3, lessons: 14 };
    return { type: 'space', name: displayShortcutTask ?? 'Community', spacesCreated: 3, membersNotified: 0 };
  };

  const handleShortcutBuild = () => {
    if (isLandingPageTask) {
      setShortcutPhase('building');
      onArtifactOpen?.(LANDING_PAGE_ASSET);
      setTimeout(() => setShortcutPhase('built'), 3500);
    } else if (isAccessTask) {
      // Access group tasks hit a sensitive confirmation mid-build
      setShortcutPhase('building');
      setTimeout(() => {
        setShortcutSensitiveStep({
          stepTitle: 'Overwrite existing access rules',
          message: 'This will replace your current access group configuration. Members may temporarily lose access to certain spaces while the new rules propagate.',
          consequence: 'This action cannot be undone. 47 members are currently assigned to existing access rules.',
        });
        setShortcutPhase('awaiting-confirmation');
      }, 1800);
    } else if (isPaywallTask) {
      // Paywall tasks simulate a payment gateway connection error
      setShortcutPhase('building');
      setTimeout(() => {
        setShortcutRecovery({
          completedSteps: 2,
          totalSteps: 3,
          failedStep: 'Connect payment processing',
          errorMessage: 'Stripe integration timed out. Verify your API keys in Settings and try again.',
        });
        setShortcutPhase('failed');
      }, 1800);
    } else {
      setShortcutPhase('building');
      setTimeout(() => setShortcutPhase('built'), 3500);
    }
  };

  const handleShortcutConfirm = () => {
    setShortcutSensitiveStep(null);
    setShortcutPhase('building');
    setTimeout(() => setShortcutPhase('built'), 2000);
  };

  const handleShortcutCancelConfirm = () => {
    setShortcutSensitiveStep(null);
    setShortcutRecovery({
      completedSteps: 1,
      totalSteps: 3,
      failedStep: 'Overwrite existing access rules',
      errorMessage: 'Step cancelled by user. You can resume from here or skip to the next step.',
    });
    setShortcutPhase('failed');
  };

  const handleShortcutResume = () => {
    setShortcutRecovery(null);
    setShortcutPhase('building');
    setTimeout(() => setShortcutPhase('built'), 2000);
  };

  const handleShortcutSkipStep = () => {
    setShortcutRecovery(null);
    setShortcutPhase('building');
    setTimeout(() => setShortcutPhase('built'), 1000);
  };

  const handleShortcutDiscard = () => {
    setShortcutRecovery(null);
    setShortcutPhase('done');
  };

  const [builderClosing, setBuilderClosing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState('');
  const drawerRef = useRef<HTMLDivElement>(null);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  // Close Quick Actions on outside click
  useEffect(() => {
    if (!quickActionsOpen) return;
    const handler = (e: MouseEvent) => {
      if (quickActionsRef.current && !quickActionsRef.current.contains(e.target as Node)) {
        setQuickActionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [quickActionsOpen]);

  const handleQuickAction = (label: string) => {
    setQuickActionsOpen(false);
    if (label === 'Builder page') {
      const chipId = `Builder-${Date.now()}`;
      setChipQueue(prev => [...prev, { id: chipId, label: 'Builder', status: 'loading' }]);
      setTimeout(() => setChipQueue(prev => prev.map(c => c.id === chipId ? { ...c, status: 'ready' } : c)), 2000);
    } else if (label === 'Entity') {
      const chipId = `Entity-${Date.now()}`;
      setChipQueue(prev => [...prev, { id: chipId, label: 'Entity', status: 'loading' }]);
      setTimeout(() => setChipQueue(prev => prev.map(c => c.id === chipId ? { ...c, status: 'ready' } : c)), 6000);
    } else if (label === 'Plan failure' || label === 'Plan with feedback') {
      const overlayId = `${label}-${Date.now()}`;
      setActiveOverlay({ id: overlayId, label, status: 'loading' });
      setTimeout(() => setActiveOverlay(prev => prev?.id === overlayId ? { ...prev, status: 'ready' } : prev), 1000);
    } else if (label === 'Plan with confirmation') {
      // Show plan overlay first (with sensitive step marked), then execute on Accept
      const overlayId = `Plan with confirmation-${Date.now()}`;
      setPlanConfDetailsExpanded(false);
      setActiveOverlay({ id: overlayId, label: 'Plan with confirmation', status: 'ready' });
    } else if (label === 'Plan sensitive (no confirm)') {
      // Show plan overlay with sensitive info badge but auto-execute without pausing
      const overlayId = `Plan sensitive (no confirm)-${Date.now()}`;
      setPlanConfDetailsExpanded(false);
      setActiveOverlay({ id: overlayId, label: 'Plan sensitive (no confirm)', status: 'ready' });
    } else {
      if (label === 'Plan') {
        setPlanAccepted(false);
        setPlanStep(0);
        setPlanViewMode('numbered');
        setPlanOverlayExpanded(false);
      } else if (label === 'Clarification') {
        setClarificationQ(1);
        setClarificationA1(null);
        setClarificationA2(null);
      }
      const overlayId = `${label}-${Date.now()}`;
      setActiveOverlay({ id: overlayId, label, status: 'loading' });
      setTimeout(() => setActiveOverlay(prev => prev?.id === overlayId ? { ...prev, status: 'ready' } : prev), 1000);
    }
  };

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
    <>
    <div className="h-full relative overflow-hidden bg-primary flex">
      {/* Recent chats drawer — slides in from left */}
      <div
        ref={drawerRef}
        className={`absolute left-0 top-0 bottom-0 w-[420px] border-r border-secondary z-40 bg-primary flex flex-col transition-[transform,box-shadow] duration-300 ${
          drawerOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full shadow-none'
        }`}
        style={{ transitionTimingFunction: 'var(--ease-spring)' }}
      >
        {/* Header — 12px 16px 12px 24px */}
        <div className="flex items-center justify-between pl-6 pr-4 py-3 shrink-0">
          <Typography variant="heading-sm" color="primary">Recent chats</Typography>
          <IconButton variant="ghost" size="sm" icon="cross" aria-label="Close" onClick={() => { setDrawerOpen(false); setDrawerSearch(''); }} />
        </div>

        {/* Content — 16px padding, 8px gap */}
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto p-4 gap-2">
          {/* Search */}
          <TextInput
            placeholder="Search in chats..."
            value={drawerSearch}
            onChange={e => setDrawerSearch(e.target.value)}
          />

          {/* List */}
          {(() => {
            const q = drawerSearch.toLowerCase().trim();
            const filtered = q
              ? RECENT_CHATS.filter(c =>
                  c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
                )
              : RECENT_CHATS;

            if (filtered.length === 0) {
              return (
                <div className="flex items-center justify-center py-12">
                  <Typography variant="body-sm" color="tertiary">No chats found</Typography>
                </div>
              );
            }

            return filtered.map(chat => (
              <button
                key={chat.id}
                type="button"
                onClick={() => {
                  if (isNewChat) {
                    // Trigger content fade-out immediately (via activeChatId change in useEffect),
                    // then slide drawer closed AFTER the content is fully gone.
                    onChatSelect(chat.id);
                    // Start drawer slide only after content has faded out (80ms)
                    setTimeout(() => {
                      setDrawerOpen(false);
                      setDrawerSearch('');
                    }, 80);
                  } else {
                    onChatSelect(chat.id);
                    setDrawerOpen(false);
                    setDrawerSearch('');
                  }
                }}
                className={mergeClasses(
                  'w-full text-left px-5 py-4 rounded-lg border flex flex-col gap-1 transition-colors duration-[50ms] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]',
                  activeChatId === chat.id
                    ? 'bg-secondary border-secondary'
                    : 'bg-primary border-[#F0F3F5] hover:bg-hover'
                )}
              >
                <span className="text-xs leading-[18px] text-[color:var(--color-text-tertiary)]">{chat.date}</span>
                <span className="text-sm leading-5 font-medium text-[color:var(--color-text-primary)] truncate block">{chat.title}</span>
                <span className="text-sm leading-5 text-[color:var(--color-text-secondary)] line-clamp-2">{chat.description}</span>
              </button>
            ));
          })()}
        </div>
      </div>

      {/* Main — shrinks when artifact panel is open */}
      <main
        className="flex flex-col min-h-0 overflow-hidden shrink-0"
        style={{
          width: artifactPanel ? (artifactPanelMode === 'full' ? '35%' : '65%') : '100%',
          transition: 'width 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header — full width */}
        <div className={`shrink-0 px-4 py-3 flex items-center gap-2 transition-opacity duration-200 ease-out delay-75 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
          {/* Back to conversations list */}
          <IconButton
            type="button"
            variant="outline"
            size="sm"
            icon="chevron-left"
            aria-label="Back to conversations"
            onClick={() => setDrawerOpen(o => !o)}
            className="shrink-0"
          />
          {/* Conversation title */}
          <div className="flex-1 min-w-0 overflow-hidden" onClick={(e) => {
            const anchor = (e.target as HTMLElement).closest('a');
            if (anchor && onEntryPointClick) { e.preventDefault(); onEntryPointClick(); }
          }}>
            <BreadCrumbs
              size="sm"
              items={[
                ...(entryPointLabel ? [{ label: entryPointLabel, href: '#' }] : []),
                {
                  label: setupFlowActive
                    ? 'Set up your spaces'
                    : isShortcutChat
                    ? (displayShortcutTask ?? 'New task')
                    : isNewChat
                    ? 'New conversation'
                    : (RECENT_CHATS.find(c => c.id === activeChatId)?.title ??
                    'Recent chats'),
                },
              ]}
              className="flex-1"
            />
          </div>
          <Menu
            options={[
              { label: 'Add project', icon: 'folder', onClick: () => { /* noop */ } },
              { label: 'Delete conversation', icon: 'trash-can', onClick: () => { /* noop */ }, danger: true },
            ]}
            trigger={
              <IconButton
                type="button"
                variant="ghost"
                size="sm"
                icon="dot-menu"
                aria-label="More options"
                className="shrink-0"
              />
            }
            side="bottom"
            align="end"
            sideOffset={4}
          />
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
          className={`w-full px-8 flex flex-col flex-1 min-h-0 overflow-hidden transition-opacity ease-in-out ${contentVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDuration: contentVisible ? '350ms' : '70ms' }}
        >
        {setupFlowActive ? (
          <SpaceSetupFlow onBuildModeChange={(active) => { setSetupBuildMode(active); onBuildMode?.(active); }} />
        ) : isShortcutChatDisplay && displayShortcutTask ? (
          (() => {
            const chatPane = (
              <div className={`w-full flex-1 flex flex-col min-h-0 transition-opacity duration-250 delay-100 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
                {/* Shortcut task flow — auto-started from dashboard dropdown */}
                <div className="flex-1 overflow-y-auto px-6 py-9">
                  <div className={mergeClasses('w-full mx-auto flex flex-col gap-10', shortcutBuildMode ? 'max-w-none' : 'max-w-[678px]')}>
                    {/* User's request bubble */}
                    <div className="flex flex-col items-end gap-1 animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                      <div className="bg-secondary rounded-[16px] px-4 py-[10px]">
                        <Typography variant="body-md" color="primary">
                          {displayShortcutTask}
                        </Typography>
                      </div>
                    </div>

                    {/* Clara's greeting */}
                    {shortcutPhase && shortcutFlow && (isCourseTask || shortcutPhase !== 'greeting') && (
                      <div className="flex flex-col items-start gap-3 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                        <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                        <div className="flex-1 min-w-0 w-full">
                          <Typography variant="body-md" color="primary" className="px-1">
                            {shortcutFlow.greeting}
                          </Typography>
                        </div>
                      </div>
                    )}

                    {/* Thinking — initial greeting (non-course tasks only) */}
                    {shortcutPhase === 'greeting' && !isCourseTask && (
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

                    {/* Course: user's typed response to greeting */}
                    {isCourseTask && shortcutUserMessage && (
                      <div className="flex flex-col items-end gap-1 animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                        <div className="bg-secondary rounded-[16px] px-4 py-[10px]">
                          <Typography variant="body-md" color="primary">
                            {shortcutUserMessage}
                          </Typography>
                        </div>
                      </div>
                    )}

                    {/* Course: thinking after user responds */}
                    {isCourseTask && shortcutPhase === 'thinking' && shortcutUserMessage && !shortcutFirstAIResponse && (
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

                    {/* Course: AI's first real response */}
                    {isCourseTask && shortcutFirstAIResponse && (
                      <div className="flex flex-col items-start gap-3 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                        <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                        <div className="flex-1 min-w-0 w-full">
                          <Typography variant="body-md" color="primary" className="px-1">
                            {shortcutFirstAIResponse}
                          </Typography>
                        </div>
                      </div>
                    )}

                    {/* Submitted clarification answers — Q/A bubble */}
                    {shortcutAnswers.length > 0 && shortcutFlow && (
                      <ClarificationAnswersBubble
                        pairs={shortcutFlow.questions.map((q, i) => ({
                          question: q.question,
                          answer: shortcutAnswers[i] ?? '',
                        }))}
                      />
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

                    {/* Sensitive step — awaiting confirmation */}
                    {shortcutPhase === 'awaiting-confirmation' && shortcutSensitiveStep && (
                      <div className="flex flex-col items-start gap-3 animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                        <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                        <div className="flex-1 min-w-0 w-full flex flex-col gap-3">
                          <Typography variant="body-md" color="primary" className="px-1">
                            Before I continue, I need your confirmation on a sensitive step.
                          </Typography>
                          <PlanConfirmationCard
                            stepTitle={shortcutSensitiveStep.stepTitle}
                            message={shortcutSensitiveStep.message}
                            consequence={shortcutSensitiveStep.consequence}
                            onConfirm={handleShortcutConfirm}
                            onCancel={handleShortcutCancelConfirm}
                          />
                        </div>
                      </div>
                    )}

                    {/* Plan failed / paused — recovery card */}
                    {shortcutPhase === 'failed' && shortcutRecovery && (
                      <div className="flex flex-col items-start gap-3 animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                        <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                        <div className="flex-1 min-w-0 w-full flex flex-col gap-3">
                          <Typography variant="body-md" color="primary" className="px-1">
                            The plan ran into an issue. Here&apos;s where things stopped:
                          </Typography>
                          <PlanRecoveryCard
                            planTitle={shortcutPlanResult?.title ?? 'Plan'}
                            completedSteps={shortcutRecovery.completedSteps}
                            totalSteps={shortcutRecovery.totalSteps}
                            failedStep={shortcutRecovery.failedStep}
                            errorMessage={shortcutRecovery.errorMessage}
                            onResume={handleShortcutResume}
                            onSkip={handleShortcutSkipStep}
                            onDiscard={handleShortcutDiscard}
                          />
                        </div>
                      </div>
                    )}

                    {/* Built — completion message + entity result card (or landing page artifact) */}
                    {shortcutPhase === 'built' && (
                      <div className="flex flex-col items-start gap-3 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                        <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                        <div className="flex-1 min-w-0 w-full flex flex-col gap-3">
                          <Typography variant="body-md" color="primary" className="px-1">
                            {isLandingPageTask
                              ? 'Your landing page is ready. Click any section to edit it directly, or open the full builder.'
                              : isCourseTask
                              ? 'Your course is ready. 21 days of guided content, partner matching active, reflection spaces built. Take a look — this is what your members will see on day one.'
                              : 'Done! Here\'s what was set up:'}
                          </Typography>
                          {isLandingPageTask ? (
                            <button
                              type="button"
                              onClick={() => artifactOpen ? onArtifactOpen?.(null) : onArtifactOpen?.(LANDING_PAGE_ASSET)}
                              className={`w-full flex flex-col gap-2 rounded-md p-4 bg-primary border text-left transition-[border-color,box-shadow] duration-200 ${
                                artifactOpen
                                  ? 'border-[#717680] shadow-[0px_0px_0px_3px_rgba(113,118,128,0.3)]'
                                  : 'border-secondary shadow-2xs hover:bg-hover'
                              }`}
                            >
                              <Icon name="file" size="md" className="text-primary" aria-hidden />
                              <Typography variant="label-sm" color="primary" className="font-medium">Landing page</Typography>
                              <Typography variant="body-sm" color="secondary">clarity.community/welcome · Draft</Typography>
                            </button>
                          ) : (
                            <PlanResultCard
                              entity={getShortcutResultEntity()}
                              onPrimaryAction={() => {
                                if (isCourseTask) {
                                  onArtifactOpen?.({ ...COURSE_ASSET, title: displayShortcutTask || 'My Course' });
                                } else {
                                  onArtifactOpen?.({ ...SHORTCUT_BUILD_ASSET, title: displayShortcutTask || 'Build result' });
                                }
                              }}
                            />
                          )}
                        </div>
                      </div>
                    )}

                    <div ref={shortcutEndRef} />
                  </div>
                </div>

                {/* Bottom slot — questions replace input when active, both fade smoothly */}
                <div className={`shrink-0 px-4 pt-2 pb-4 transition-opacity duration-300 ease-out ${hideInput ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                  <div className={mergeClasses('w-full mx-auto', shortcutBuildMode ? 'max-w-none' : 'max-w-[678px]')}>
                    {shortcutPhase === 'questions' && shortcutFlow ? (
                      <div className="animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                        <ClarifyingQuestions
                          questions={shortcutFlow.questions}
                          onComplete={handleShortcutQuestionsComplete}
                          onDismiss={handleShortcutQuestionsDismiss}
                        />
                      </div>
                    ) : (
                      <div key={shortcutPhase ?? 'input'} className="animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                        <AgentMessageBox
                          placeholder="Message Circle AI..."
                          onSubmit={(msg) => {
                            if (isCourseTask && shortcutPhase === 'greeting' && msg.trim()) {
                              setShortcutUserMessage(msg);
                              setShortcutPhase('thinking');
                              setTimeout(() => {
                                setShortcutFirstAIResponse(
                                  "A mindfulness course. That's a gift to the people who need it most — the ones who know they should slow down but don't know how to start. And the fact that your audience has tried before and bounced? That's your superpower, not your obstacle. They already believe it works. They just haven't found the version that fits their life yet. That's what you're building for them. Let me ask a couple of things so I can get the structure right."
                                );
                                setShortcutPhase('questions');
                              }, 2500);
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );

            return chatPane;
          })()
        ) : isNewChatDisplay ? (
          <div className={`w-full flex-1 flex flex-col min-h-0 transition-opacity duration-250 delay-100 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
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
                    <div className="group flex flex-col items-end pl-6 gap-1 animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                      <div className="bg-secondary rounded-[16px] px-4 py-[10px]">
                        <Typography variant="body-md" color="primary">
                          {initialMessage}
                        </Typography>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <span className="text-xs text-[#717680] px-1">3:41 PM</span>
                        <IconButton type="button" variant="ghost" size="sm" icon="copy" aria-label="Copy" />
                        <IconButton type="button" variant="ghost" size="sm" icon="refresh" aria-label="Retry" />
                      </div>
                    </div>

                    {/* Thinking */}
                    {freshPhase === 'thinking' && (
                      <div className="animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                        <ThinkingIndicator
                          done={false}
                          skill={freshSkill?.id}
                          skillIcon={freshSkill?.icon}
                        />
                      </div>
                    )}

                    {/* AI reply */}
                    {freshPhase === 'reply' && (
                      <div className="group flex flex-col gap-2 min-w-0 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                        <div className="flex flex-col gap-2 w-full min-w-0">
                          <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                          <MarkdownContent content={freshReply} />
                          {/* Event card — shown when the reply is about creating an event */}
                          {initialMessage && isEventMessage(initialMessage) && (
                            <button
                              type="button"
                              onClick={() => onArtifactOpen?.({ id: 'event', title: 'UX Mastery Bootcamp: Crafting Seamless Digital Experiences', type: 'event' })}
                              className="mt-1 w-full flex items-center justify-between gap-3 bg-secondary border border-primary rounded-xl px-4 py-3 text-left hover:bg-hover transition-colors duration-150"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <Icon name="chain-link" size="sm" className="text-tertiary shrink-0" />
                                <Typography variant="body-sm" color="primary" className="truncate font-medium">
                                  UX Mastery Bootcamp: Crafting Seamless Digital Experiences
                                </Typography>
                              </div>
                              <Typography variant="label-sm" color="link" className="shrink-0 font-medium">
                                Open
                              </Typography>
                            </button>
                          )}
                          {/* Course card — shown when the reply is about creating a course */}
                          {initialMessage && isCourseMessage(initialMessage) && (
                            <button
                              type="button"
                              onClick={() => onArtifactOpen?.({ ...COURSE_ASSET })}
                              className="mt-1 w-full flex items-center justify-between gap-3 bg-secondary border border-primary rounded-xl px-4 py-3 text-left hover:bg-hover transition-colors duration-150"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <Icon name="chain-link" size="sm" className="text-tertiary shrink-0" />
                                <Typography variant="body-sm" color="primary" className="truncate font-medium">
                                  Finding calm: a journey to inner peace
                                </Typography>
                              </div>
                              <Typography variant="label-sm" color="link" className="shrink-0 font-medium">
                                Open
                              </Typography>
                            </button>
                          )}
                        </div>
                        <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <div className="flex items-center gap-[5px]">
                            <IconButton type="button" variant="ghost" size="sm" icon="thumbup" aria-label="Like" />
                            <div className="-scale-y-100">
                              <IconButton type="button" variant="ghost" size="sm" icon="thumbup" aria-label="Dislike" />
                            </div>
                            <IconButton type="button" variant="ghost" size="sm" icon="copy" aria-label="Copy" />
                          </div>
                          <span className="text-xs text-[#717680]">3:41 PM</span>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Submitted messages — used for support keyword fork (and any later
                    follow-up turns) on the fresh-chat surface. */}
                {submittedMessages.map((msg) => (
                  <div key={msg.id} className="flex flex-col gap-6">
                    {!msg.assistantOnly && (
                      <div className="flex justify-end pl-6">
                        <div className="bg-secondary rounded-[16px] px-4 py-[10px] max-w-[75%]">
                          <Typography variant="body-md" color="primary">{msg.text}</Typography>
                        </div>
                      </div>
                    )}
                    {msg.stopped ? (
                      <div className="flex items-center gap-1.5 animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0 text-[#9ca3af]"><rect x="2" y="2" width="9" height="9" rx="1.5" fill="currentColor"/></svg>
                        <span className="text-xs text-[#9ca3af]">Generation stopped</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                        <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                        {(msg.phase === 'thinking' || (!msg.clarification && !msg.assistantOnly)) && (
                          <ThinkingIndicator
                            done={msg.phase === 'reply'}
                            skill={msg.skill?.id}
                            skillIcon={msg.skill?.icon}
                          />
                        )}
                        {msg.phase === 'reply' && msg.reply && (
                          <div className="animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                            <MarkdownContent content={msg.reply} />
                          </div>
                        )}
                        {msg.ticketSubmitted && (
                          <div className="animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                            <TicketLinkCard
                              subject={msg.ticketSubmitted.subject}
                              onView={() => openTicketInInbox(msg.ticketSubmitted!.threadId)}
                            />
                          </div>
                        )}
                        {msg.queueCard && msg.phase === 'reply' && (
                          <div className="animate-[fadeInSlide_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
                            <QueueCard
                              threadId={msg.queueCard.threadId}
                              onOpenConversation={() =>
                                window.dispatchEvent(new CustomEvent('open-support', { detail: { threadId: msg.queueCard!.threadId } }))
                              }
                            />
                          </div>
                        )}
                      </div>
                    )}
                    {msg.ticketForm?.open && (
                      <SupportTicketForm
                        initialDescription={msg.ticketForm.initialDescription}
                        onSubmit={data => handleTicketFormSubmit(msg.id, data)}
                      />
                    )}
                    {msg.clarification?.selected && (
                      <ClarificationAnswersBubble
                        pairs={[{
                          question: clarificationWidgetCopy.question,
                          answer: msg.clarification.selected === 'live_chat'
                            ? clarificationWidgetCopy.options.liveChat.label
                            : clarificationWidgetCopy.options.email.label,
                        }]}
                      />
                    )}
                  </div>
                ))}

                <div ref={freshChatEndRef} />
              </div>
            </div>

            {/* Clarification widget — float above input, matches ClarifyingQuestions pattern */}
            {(() => {
              const activeClarification = [...submittedMessages]
                .reverse()
                .find(m => m.clarification && !m.clarification.selected);
              if (!activeClarification?.clarification) return null;
              return (
                <div className="shrink-0 px-4 pb-4">
                  <div className="w-full max-w-[678px] mx-auto">
                    <ClarifyingQuestions
                      questions={SUPPORT_CLARIFICATION_QUESTIONS}
                      onComplete={answers => {
                        const a = (answers[0] ?? '').trim();
                        const liveChatLabel = clarificationWidgetCopy.options.liveChat.label;
                        const emailLabel = clarificationWidgetCopy.options.email.label;
                        let choice: ClarificationChoice = 'email';
                        let customText: string | undefined;
                        if (a === liveChatLabel) choice = 'live_chat';
                        else if (a === emailLabel) choice = 'email';
                        else { choice = 'email'; customText = a; }
                        handleClarificationChoice(activeClarification.id, activeClarification.text, choice, customText);
                      }}
                      onDismiss={() => {
                        setSubmittedMessages(prev => prev.filter(m => m.id !== activeClarification.id));
                        setAwaitingLiveChatClarification(false);
                      }}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Reply input — appears once AI has responded OR a submitted message exists. */}
            {(freshPhase === 'reply' || submittedMessages.length > 0) && !hasPendingClarification && (
              <div className="shrink-0 px-4 pt-4 pb-4 transition-opacity duration-200 ease-out">
                <div className="w-full max-w-[678px] mx-auto">
                  <AgentMessageBox
                    placeholder={awaitingLiveChatClarification ? 'Describe your issue...' : 'Message Circle AI...'}
                    onSubmit={submittedMessages.length > 0 ? handleChatSubmit : () => { /* noop for plain fresh chat */ }}
                    isGenerating={isGenerating}
                    onStop={handleStop}
                  />
                </div>
              </div>
            )}
          </div>

        ) : (() => {
          const savedChat = RECENT_CHATS.find(c => c.id === activeChatId && c.id !== '1');
          if (savedChat) {
            return (
              <div className={`w-full flex-1 flex flex-col min-h-0 relative transition-opacity duration-250 delay-100 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
                <div ref={savedChatScrollRef} className="flex-1 overflow-y-auto px-6 py-9 relative">
                  <div className="w-full max-w-[678px] mx-auto flex flex-col gap-10">
                    {savedChat.messages.map((msg, i) => (
                      msg.role === 'user' ? (
                        <div key={i} className="group flex flex-col items-end pl-6 gap-1">
                          <div className="bg-secondary rounded-[16px] px-4 py-[10px]">
                            <Typography variant="body-md" color="primary">{msg.content}</Typography>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                            <span className="text-xs text-[#717680] px-1">3:41 PM</span>
                            <IconButton type="button" variant="ghost" size="sm" icon="copy" aria-label="Copy" />
                            <IconButton type="button" variant="ghost" size="sm" icon="refresh" aria-label="Retry" />
                          </div>
                        </div>
                      ) : (
                        <div key={i} className="group flex flex-col gap-2 min-w-0">
                          <div className="flex flex-col gap-2 w-full min-w-0">
                            <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                            <MarkdownContent content={msg.content} />
                          </div>
                          <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                            <div className="flex items-center gap-[5px]">
                              <IconButton type="button" variant="ghost" size="sm" icon="thumbup" aria-label="Like" />
                              <div className="-scale-y-100">
                                <IconButton type="button" variant="ghost" size="sm" icon="thumbup" aria-label="Dislike" />
                              </div>
                              <IconButton type="button" variant="ghost" size="sm" icon="copy" aria-label="Copy" />
                            </div>
                            <span className="text-xs text-[#717680]">3:41 PM</span>
                          </div>
                        </div>
                      )
                    ))}

                    {/* Chip conversation items — loading skeleton → interactive card → submitted */}
                    {savedChat.id === '0' && chipQueue.map((chip) => {
                      const isLoading = chip.status === 'loading';

                      // ── Skeleton ──────────────────────────────────────────
                      if (isLoading) {
                        return (
                          <div key={chip.id} className="flex flex-col items-start gap-3 animate-[fadeInSlide_0.3s_cubic-bezier(0.16,1,0.3,1)_both]">
                            <div className="w-[22px] h-[22px] rounded-full bg-[#e4e7eb] animate-pulse shrink-0" />
                            <div className="w-full bg-[#f7f9fa] border border-[#e4e7eb] rounded-[12px] overflow-hidden">
                              <div className="h-12 bg-[#eef0f2] animate-pulse" />
                              <div className="bg-white px-4 py-4 flex flex-col gap-3">
                                <div className="h-3.5 bg-[#f0f3f5] rounded-full animate-pulse w-3/4" />
                                <div className="h-3.5 bg-[#f0f3f5] rounded-full animate-pulse w-1/2" />
                                <div className="h-3.5 bg-[#f0f3f5] rounded-full animate-pulse w-2/3" />
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // ── Entity ────────────────────────────────────────────
                      if (chip.label === 'Entity') {
                        const entityVariants = [
                          { variant: 'List' as EntityVariant, label: 'List', description: 'Member profile with key details and a quick-action footer.' },
                          { variant: 'Stat' as EntityVariant, label: 'Stat', description: 'Single metric with trend indicator and comparison period.' },
                          { variant: 'Insight' as EntityVariant, label: 'Insight', description: 'Metric with a chart and period-over-period comparison.' },
                          { variant: 'Data' as EntityVariant, label: 'Data', description: 'Tabular data with multiple rows and expandable view.' },
                          { variant: 'Link' as EntityVariant, label: 'Link', description: 'Direct action link to a section or resource.' },
                          { variant: 'Image' as EntityVariant, label: 'Image', description: 'Generated image with download and regenerate options.' },
                        ];
                        const isLoading = chip.status === 'loading';
                        return (
                          <div key={chip.id} className="group flex flex-col gap-2 min-w-0 animate-[fadeInSlide_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
                            <div className="flex flex-col gap-2 w-full min-w-0">
                              <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                            </div>

                            <ThinkingIndicator
                              done={!isLoading}
                              steps={[
                                { label: 'Identifying the entity types relevant to your community context.' },
                                { label: 'Mapping member data fields to List, Stat, Insight, Data, Link, and Image variants.' },
                                { label: 'Generating entity cards with live community data and formatting for conversation.' },
                              ]}
                            />

                            {!isLoading && (
                              <>
                                <p className="text-[16px] font-normal leading-[24px] text-[#191b1f] mt-1 animate-[fadeInSlide_0.3s_cubic-bezier(0.16,1,0.3,1)_both]">
                                  Here&apos;s how <strong className="font-semibold">Entity</strong> types look in conversation:
                                </p>
                                <div className="flex flex-col gap-10 w-full">
                                  {entityVariants.map(({ variant, label: vLabel, description }, i) => (
                                    <div
                                      key={variant}
                                      className="flex flex-col gap-2 animate-[fadeInSlide_0.4s_cubic-bezier(0.16,1,0.3,1)_both]"
                                      style={{ animationDelay: `${i * 120}ms` }}
                                    >
                                      <div className="flex items-center gap-2 px-1">
                                        <Typography variant="label-sm" color="tertiary">{vLabel}</Typography>
                                        <Typography variant="body-sm" color="secondary">— {description}</Typography>
                                      </div>
                                      <EntityV
                                        variant={variant}
                                        onPreview={() => openArtifactPanel({ title: 'Karthik G', subtitle: 'Member profile', type: 'member-preview' })}
                                        onViewAnalytics={() => openArtifactPanel({ title: 'New members', type: 'analytics' })}
                                        onOpen={() => openArtifactPanel({ title: 'Manage audience', subtitle: '3 284 members · 47 segments', type: 'audience' })}
                                        onSeeMore={() => openArtifactPanel({ title: 'Members', subtitle: 'Showing 12 of 11 158', type: 'data-table' })}
                                      />
                                    </div>
                                  ))}
                                </div>
                                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                  <div className="flex items-center gap-[5px]">
                                    <IconButton type="button" variant="ghost" size="sm" icon="thumbup" aria-label="Like" className="text-tertiary" />
                                    <div className="-scale-y-100">
                                      <IconButton type="button" variant="ghost" size="sm" icon="thumbup" aria-label="Dislike" className="text-tertiary" />
                                    </div>
                                    <IconButton type="button" variant="ghost" size="sm" icon="copy" aria-label="Copy" className="text-tertiary" />
                                  </div>
                                  <span className="text-xs text-[#717680]">3:41 PM</span>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      }

                      // ── Plan result (after Accept from overlay) ───────────
                      if (chip.label === 'Plan-result') {
                        const execSteps = [
                          "Create the 'Welcome Zone' space group",
                          "Create the 'Game Talk' space group",
                          "Create the 'Resources & Guides' space group",
                          "Create the 'Community Hub' space group",
                          "Create 'Community Rules' space in Welcome Zone",
                          "Create 'Introductions' space in Welcome Zone",
                          "Create 'Announcements' space in Welcome Zone",
                          "Create 'General Discussion' space in Game Talk",
                          "Create 'Game Reviews' space in Game Talk",
                          "Create 'Tips & Tricks' space in Resources & Guides",
                          "Create 'Guides & Tutorials' space in Resources & Guides",
                          "Create 'Events' space in Community Hub",
                          "Create 'Feedback' space in Community Hub",
                        ];
                        const isDone = planStep >= 4;
                        const MAX_EXEC_VISIBLE = 5;
                        const visibleExec = execSteps.slice(0, MAX_EXEC_VISIBLE);
                        const hiddenExecCount = execSteps.length - MAX_EXEC_VISIBLE;
                        return (
                          <div key={chip.id} className="flex flex-col items-start gap-4 animate-[fadeInSlide_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
                            <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                            <div className="w-full bg-[#f7f9fa] border border-[#e4e7eb] rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
                              {/* Header */}
                              <div className="bg-[#f7f9fa] flex h-14 items-center justify-between px-[18px]">
                                <span className={`text-sm font-semibold ${isDone ? 'text-[#191b1f]' : 'shimmer-sweep-text'}`}>
                                  {isDone ? 'Set up a well-organized community structure with space groups and spaces' : 'Working...'}
                                </span>
                              </div>
                              {/* Steps body */}
                              <div className="bg-white border border-[#f0f3f5] rounded-[12px] px-5 py-4 flex flex-col gap-3">
                                <div className="flex flex-col">
                                  {visibleExec.map((stepText, i) => {
                                    const stepNum = i + 1;
                                    const isStepDone = planStep > stepNum || isDone;
                                    const isStepActive = planStep === stepNum && !isDone;
                                    const isLast = i === visibleExec.length - 1 && hiddenExecCount <= 0;
                                    return (
                                      <div key={i} className="flex gap-2 items-start">
                                        <div className="flex flex-col items-center shrink-0 self-stretch">
                                          <div className="pt-[2px]">
                                            {isStepDone ? (
                                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1"/><path d="M4.5 8l2.5 2.5 4-4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                            ) : (
                                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke={isStepActive ? '#545861' : '#d1d5db'} strokeWidth="1"/></svg>
                                            )}
                                          </div>
                                          {!isLast && <div className="flex-1 w-px mt-1" style={{ borderLeft: '1px dashed #e4e7eb' }} />}
                                        </div>
                                        <div className={`flex flex-col ${isLast ? '' : 'pb-3'}`}>
                                          {isStepActive ? (
                                            <span className="text-sm shimmer-sweep-text leading-5">{stepText}</span>
                                          ) : (
                                            <span className={`text-sm leading-5 ${isStepDone ? 'line-through text-[#717680]' : 'text-[#545861]'}`}>{stepText}</span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                  {hiddenExecCount > 0 && (
                                    <span className="text-sm text-[#717680] mt-1">+{hiddenExecCount} more steps</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // ── Clarification result (after Approve from overlay) ──
                      if (chip.label === 'Clarification-result') {
                        const overlayQuestions = [
                          'What type of community are you building?',
                          'How many spaces do you need to start?',
                        ];
                        return (
                          <ClarificationAnswersBubble
                            key={chip.id}
                            pairs={overlayQuestions.map((q, i) => ({
                              question: q,
                              answer: clarificationSavedAnswers[i] ?? '',
                            }))}
                          />
                        );
                      }

                      // ── Order result (after Approve from overlay) ─────────
                      if (chip.label === 'Order-result') {
                        return (
                          <div key={chip.id} className="flex flex-col items-start gap-4 animate-[fadeInSlide_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
                            <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                            <div className="w-full bg-secondary border border-[#e4e7eb] rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
                              <div className="bg-white border-b border-[#f0f3f5] flex h-14 items-center px-[18px] py-3 rounded-t-[14px]">
                                <span className="text-sm font-semibold text-[#191b1f]">What type of community are you building?</span>
                              </div>
                              <div className="bg-white flex flex-col rounded-b-[12px] border-b border-secondary">
                                {orderSavedItems.map((item, i) => (
                                  <div key={item} className={`flex gap-3 items-start px-3 py-3 ${i < orderSavedItems.length - 1 ? 'border-b border-[#f0f3f5]' : ''}`}>
                                    <div className="shrink-0 w-4 h-[18px] flex items-center justify-center"><span className="text-xs text-[#191b1f] leading-[18px]">{i + 1}.</span></div>
                                    <span className="text-sm text-[#191b1f]">{item}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="bg-[#f7f9fa] px-3 py-3 rounded-b-[14px]">
                                <span className="text-xs text-[#545861]">Submited on Nov 15, 2023</span>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // ── Plan-conf-executing: animated working → confirmation → result/error ─
                      if (chip.label === 'Plan-conf-executing') {
                        const phase = planConfPhase;
                        const currentStep = planConfStep; // 1-based

                        const getStepState = (idx: number): 'complete' | 'active' | 'waiting' | 'error' | 'pending' => {
                          const num = idx + 1;
                          if (phase === 'complete') return 'complete';
                          if (phase === 'error') {
                            if (num < currentStep) return 'complete';
                            if (num === currentStep) return 'error';
                            return 'pending';
                          }
                          if (num < currentStep) return 'complete';
                          if (num === currentStep) return phase === 'awaiting-confirmation' ? 'waiting' : 'active';
                          return 'pending';
                        };

                        return (
                          <div key={chip.id} className="flex flex-col items-start gap-3 animate-[fadeInSlide_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
                            <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                            <div className="flex-1 min-w-0 w-full flex flex-col gap-3">

                              {/* Working card */}
                              <div className="bg-[#f7f9fa] border border-[#e4e7eb] rounded-[12px] overflow-hidden">
                                {/* Header — always shows plan title */}
                                <div className="flex h-14 items-center px-4 border-b border-[#f0f3f5] gap-3">
                                  {phase === 'complete' && (
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0"><circle cx="8" cy="8" r="6.5" fill="#16a34a" fillOpacity="0.12" stroke="#16a34a" strokeWidth="1.3"/><path d="M5 8l2.2 2.2L11 6" stroke="#16a34a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                  )}
                                  {phase === 'error' && (
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0"><circle cx="8" cy="8" r="6.5" stroke="#dc2626" strokeWidth="1.3"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#dc2626" strokeWidth="1.3" strokeLinecap="round"/></svg>
                                  )}
                                  {(phase === 'working' || phase === 'working-post-confirm') && (
                                    <svg className="shrink-0 animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#e4e7eb" strokeWidth="2"/><path d="M8 2a6 6 0 0 1 6 6" stroke="#3C53E7" strokeWidth="2" strokeLinecap="round"/></svg>
                                  )}
                                  {phase === 'awaiting-confirmation' && (
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0"><circle cx="8" cy="8" r="6.5" stroke="#d97706" strokeWidth="1.3" strokeDasharray="3 2"/><path d="M8 5.5v3" stroke="#d97706" strokeWidth="1.3" strokeLinecap="round"/><circle cx="8" cy="10.5" r="0.65" fill="#d97706"/></svg>
                                  )}
                                  <span className="text-sm font-semibold text-[#191b1f] flex-1">Access Groups &amp; Permissions</span>
                                  <button
                                    type="button"
                                    onClick={() => setPlanConfDetailsExpanded(v => !v)}
                                    className="text-xs text-[#717680] hover:text-[#191b1f] transition-colors flex items-center gap-1 shrink-0"
                                  >
                                    {planConfDetailsExpanded ? (
                                      <><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>Hide details</>
                                    ) : (
                                      <><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>Show details</>
                                    )}
                                  </button>
                                </div>

                                {/* Steps list */}
                                <div className="bg-white px-4 py-3 flex flex-col gap-2.5">
                                  {PLAN_CONF_STEPS.map((step, idx) => {
                                    const s = getStepState(idx);
                                    return (
                                      <div key={idx} className="flex items-start gap-2.5">
                                        <div className="shrink-0 mt-[2px]">
                                          {s === 'complete' && (
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" fill="#16a34a" fillOpacity="0.1" stroke="#16a34a" strokeWidth="1.3"/><path d="M5 8l2.2 2.2L11 6" stroke="#16a34a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                          )}
                                          {s === 'active' && (
                                            <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#e4e7eb" strokeWidth="2"/><path d="M8 2a6 6 0 0 1 6 6" stroke="#3C53E7" strokeWidth="2" strokeLinecap="round"/></svg>
                                          )}
                                          {s === 'waiting' && (
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#d97706" strokeWidth="1.3" strokeDasharray="3 2"/><path d="M8 5.5v3" stroke="#d97706" strokeWidth="1.3" strokeLinecap="round"/><circle cx="8" cy="10.5" r="0.65" fill="#d97706"/></svg>
                                          )}
                                          {s === 'error' && (
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#dc2626" strokeWidth="1.3"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#dc2626" strokeWidth="1.3" strokeLinecap="round"/></svg>
                                          )}
                                          {s === 'pending' && (
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#d1d5db" strokeWidth="1"/></svg>
                                          )}
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0">
                                          <div className="flex items-center gap-2">
                                            <span className={`text-sm leading-5 ${
                                              s === 'complete' ? 'text-[#191b1f]' :
                                              s === 'active' ? 'text-[#191b1f] font-medium' :
                                              s === 'waiting' ? 'text-amber-700' :
                                              s === 'error' ? 'text-[#dc2626]' :
                                              'text-[#9ca3af]'
                                            }`}>
                                              {step.title}
                                            </span>
                                            {step.sensitive && (
                                              <span className="inline-flex items-center gap-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-medium px-1.5 py-0 rounded-full leading-[18px] shrink-0">
                                                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="shrink-0"><path d="M4 1L7 7H1L4 1Z" stroke="#b45309" strokeWidth="0.8" strokeLinejoin="round"/></svg>
                                                {s === 'waiting' ? 'paused' : 'sensitive'}
                                              </span>
                                            )}
                                          </div>
                                          {planConfDetailsExpanded && (
                                            <span className="text-xs text-[#717680] leading-[18px] mt-0.5">{step.detail}</span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Footer — error state with retry */}
                                {phase === 'error' && (
                                  <div className="bg-[#fff8f8] border-t border-red-100 px-4 py-3 flex items-center justify-between gap-3">
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                      <span className="text-xs font-medium text-[#dc2626]">Rejected at: {PLAN_CONF_STEPS[currentStep - 1]?.title}</span>
                                      <span className="text-xs text-[#717680]">Steps 1–{currentStep - 1} completed. Member assignments were not changed.</span>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setPlanConfPhase('awaiting-confirmation');
                                      }}
                                    >
                                      Retry
                                    </Button>
                                  </div>
                                )}
                              </div>

                              {/* Completion message + member table */}
                              {phase === 'complete' && (() => {
                                const CHANGED_MEMBERS = [
                                  { name: 'Sarah Chen', avatar: 'SC', from: 'Free', to: 'Pro' },
                                  { name: 'Marcus Rivera', avatar: 'MR', from: 'Free', to: 'Admin' },
                                  { name: 'Priya Nair', avatar: 'PN', from: 'Pro', to: 'Admin' },
                                  { name: 'Tom Kowalski', avatar: 'TK', from: 'Free', to: 'Pro' },
                                  { name: 'Ava Liu', avatar: 'AL', from: 'Pro', to: 'Free' },
                                ];
                                return (
                                  <>
                                    <Typography variant="body-md" color="primary" className="animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                                      Done! Access groups have been reconfigured and 47 members notified of their new permissions.
                                    </Typography>
                                    <div className="animate-[fadeInSlide_0.4s_0.15s_cubic-bezier(0.16,1,0.3,1)_both] bg-[#f7f9fa] border border-[#e4e7eb] rounded-[12px] overflow-hidden shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                                      {/* Card header */}
                                      <div className="flex h-12 items-center justify-between px-4 border-b border-[#f0f3f5] bg-white">
                                        <div className="flex items-center gap-2">
                                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0"><circle cx="7" cy="7" r="5.5" fill="#16a34a" fillOpacity="0.1" stroke="#16a34a" strokeWidth="1.2"/><path d="M4.5 7l1.8 1.8L9.5 5.5" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                          <span className="text-sm font-semibold text-[#191b1f]">47 members reassigned</span>
                                        </div>
                                        <button type="button" className="text-xs text-[#3C53E7] hover:underline" onClick={() => openArtifactPanel({ title: '47 members reassigned', subtitle: 'Access Groups & Permissions', type: 'member-table' })}>View all</button>
                                      </div>
                                      {/* Table */}
                                      <div className="bg-white">
                                        {/* Table head */}
                                        <div className="grid grid-cols-[1fr_80px_80px] gap-2 px-4 py-2 border-b border-[#f0f3f5]">
                                          <span className="text-[11px] font-medium text-[#717680] uppercase tracking-wide">Member</span>
                                          <span className="text-[11px] font-medium text-[#717680] uppercase tracking-wide">Previous</span>
                                          <span className="text-[11px] font-medium text-[#717680] uppercase tracking-wide">New</span>
                                        </div>
                                        {CHANGED_MEMBERS.map((m, i) => (
                                          <div key={i} className={`grid grid-cols-[1fr_80px_80px] gap-2 items-center px-4 py-2.5 ${i < CHANGED_MEMBERS.length - 1 ? 'border-b border-[#f7f9fa]' : ''}`}>
                                            <div className="flex items-center gap-2 min-w-0">
                                              <div className="w-6 h-6 rounded-full bg-[#e4e7eb] flex items-center justify-center shrink-0">
                                                <span className="text-[9px] font-semibold text-[#545861]">{m.avatar}</span>
                                              </div>
                                              <span className="text-sm text-[#191b1f] truncate">{m.name}</span>
                                            </div>
                                            <span className="text-xs text-[#717680] bg-[#f7f9fa] rounded-full px-2 py-0.5 w-fit">{m.from}</span>
                                            <span className="text-xs text-[#191b1f] bg-[#f0fdf4] border border-[#bbf7d0] rounded-full px-2 py-0.5 w-fit">{m.to}</span>
                                          </div>
                                        ))}
                                      </div>
                                      {/* Footer */}
                                      <div className="px-4 py-2.5 flex items-center justify-between border-t border-[#f0f3f5]">
                                        <span className="text-xs text-[#717680]">42 more members updated</span>
                                        <button type="button" className="flex items-center gap-1 text-xs text-[#545861] hover:text-[#191b1f] transition-colors">
                                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v6M4 6l2 2 2-2M2 10h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                          Export CSV
                                        </button>
                                      </div>
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        );
                      }

                      // ── Builder page ─────────────────────────────────────
                      if (chip.label === 'Builder') {
                        const isLoading = chip.status === 'loading';
                        return (
                          <div key={chip.id} className="group flex flex-col gap-3 min-w-0 animate-[fadeInSlide_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
                            <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                            <ThinkingIndicator
                              done={!isLoading}
                              steps={[
                                { label: 'Loading page structure and components from your site.' },
                                { label: 'Preparing Home page preview in the visual editor.' },
                              ]}
                            />
                            {!isLoading && (
                              <div className="flex flex-col gap-3 animate-[fadeInSlide_0.3s_cubic-bezier(0.16,1,0.3,1)_both]">
                                <p className="text-base text-primary leading-6">
                                  Here&apos;s your <strong className="font-semibold">Home page</strong>. Open it to preview or edit sections.
                                </p>
                                {/* Page card — minimal, no thumbnail */}
                                <div className="bg-[#f7f9fa] rounded-[12px] p-[2px] border border-[#e4e7eb] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden w-full">
                                  <div className="bg-white rounded-[11px]">
                                    <div className="flex h-14 items-center justify-between px-4">
                                      <div className="flex items-center gap-3">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 text-[#191b1f]"><rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M6.5 7h7M6.5 10h7M6.5 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                        <div className="flex flex-col">
                                          <span className="text-sm font-semibold text-[#191b1f]">Home page</span>
                                          <span className="text-xs text-[#545861]">Pages / Home page</span>
                                        </div>
                                      </div>
                                      <Button variant="outline" size="sm" onClick={() => openArtifactPanel({ title: 'Home page', type: 'page-preview' })}>Open</Button>
                                    </div>
                                  </div>
                                  <div className="bg-[#f7f9fa] px-4 py-2 flex items-center justify-between">
                                    <span className="text-xs text-[#545861]">Last edited Jan 14, 2026</span>
                                    <span className="text-xs text-[#545861]">Published</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }

                      // ── Plan failure ──────────────────────────────────────
                      if (chip.label === 'Plan failure') {
                        const failureSteps = [
                          'Set up pricing tiers',
                          'Configure paywall rules',
                          'Connect payment processing',
                        ];
                        return (
                          <div key={chip.id} className="flex flex-col items-start gap-3 animate-[fadeInSlide_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
                            <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                            <div className="flex-1 min-w-0 w-full flex flex-col gap-3">
                              {/* Execution card — visible in both running and done */}
                              <div className="w-full bg-[#f7f9fa] border border-[#e4e7eb] rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
                                <div className="bg-[#f7f9fa] flex h-14 items-center justify-between px-[18px]">
                                  <span className={`text-sm font-semibold ${chip.phase === 'done' ? 'text-[#191b1f]' : 'shimmer-sweep-text'}`}>
                                    {chip.phase === 'done' ? 'Paywall & Pricing Setup' : 'Working...'}
                                  </span>
                                </div>
                                <div className="bg-white border border-[#f0f3f5] rounded-[12px] px-5 py-4 flex flex-col gap-3">
                                  <div className="flex flex-col">
                                    {failureSteps.map((stepText, i) => {
                                      const isDone = chip.phase === 'done';
                                      const isStepDone = isDone ? i < 2 : false;
                                      const isStepActive = !isDone && i === 0;
                                      const isStepError = isDone && i === 2;
                                      const isLast = i === failureSteps.length - 1;
                                      return (
                                        <div key={i} className="flex gap-2 items-start">
                                          <div className="flex flex-col items-center shrink-0 self-stretch">
                                            <div className="pt-[2px]">
                                              {isStepError ? (
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#dc2626" strokeWidth="1.3"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#dc2626" strokeWidth="1.3" strokeLinecap="round"/></svg>
                                              ) : isStepDone ? (
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1"/><path d="M4.5 8l2.5 2.5 4-4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                              ) : (
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke={isStepActive ? '#545861' : '#d1d5db'} strokeWidth="1"/></svg>
                                              )}
                                            </div>
                                            {!isLast && <div className="flex-1 w-px mt-1" style={{ borderLeft: '1px dashed #e4e7eb' }} />}
                                          </div>
                                          <div className={`flex flex-col ${isLast ? '' : 'pb-3'}`}>
                                            {isStepActive ? (
                                              <span className="text-sm shimmer-sweep-text leading-5">{stepText}</span>
                                            ) : (
                                              <span className={`text-sm leading-5 ${isStepError ? 'text-[#dc2626]' : isStepDone ? 'line-through text-[#717680]' : 'text-[#545861]'}`}>{stepText}</span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                              {chip.phase === 'done' && (
                                <div className="flex flex-col gap-3 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                                  <Typography variant="body-md" color="primary">
                                    The plan ran into an issue. Here&apos;s where things stopped:
                                  </Typography>
                                  <PlanRecoveryCard
                                    planTitle="Paywall &amp; Pricing Setup"
                                    completedSteps={2}
                                    totalSteps={3}
                                    failedStep="Connect payment processing"
                                    errorMessage="Stripe integration timed out. Verify your API keys in Settings and try again."
                                    onResume={() => {
                                      setChipQueue(prev => prev.map(c =>
                                        c.id === chip.id ? { ...c, label: 'Plan with feedback' } : c
                                      ));
                                    }}
                                    onSkip={() => {
                                      setChipQueue(prev => prev.map(c =>
                                        c.id === chip.id ? { ...c, label: 'Plan with feedback' } : c
                                      ));
                                    }}
                                    onDiscard={() => setChipQueue(prev => prev.filter(c => c.id !== chip.id))}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }

                      // ── Plan with feedback (result entity card) ───────────
                      if (chip.label === 'Plan with feedback') {
                        const feedbackSteps = [
                          "Create the 'Welcome Zone' space group",
                          "Create the 'Game Talk' space group",
                          "Configure space permissions",
                          "Set up member notifications",
                          "Publish welcome content",
                        ];
                        return (
                          <div key={chip.id} className="flex flex-col items-start gap-3 animate-[fadeInSlide_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
                            <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                            <div className="flex-1 min-w-0 w-full flex flex-col gap-3">
                              {/* Execution card — visible in both running and done */}
                              <div className="w-full bg-[#f7f9fa] border border-[#e4e7eb] rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
                                <div className="bg-[#f7f9fa] flex h-14 items-center justify-between px-[18px]">
                                  <span className={`text-sm font-semibold ${chip.phase === 'done' ? 'text-[#191b1f]' : 'shimmer-sweep-text'}`}>
                                    {chip.phase === 'done' ? 'Community Spaces Setup' : 'Working...'}
                                  </span>
                                </div>
                                <div className="bg-white border border-[#f0f3f5] rounded-[12px] px-5 py-4 flex flex-col gap-3">
                                  <div className="flex flex-col">
                                    {feedbackSteps.map((stepText, i) => {
                                      const isDone = chip.phase === 'done';
                                      const isStepDone = isDone || i < 1;
                                      const isStepActive = !isDone && i === 1;
                                      const isLast = i === feedbackSteps.length - 1;
                                      return (
                                        <div key={i} className="flex gap-2 items-start">
                                          <div className="flex flex-col items-center shrink-0 self-stretch">
                                            <div className="pt-[2px]">
                                              {isStepDone ? (
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1"/><path d="M4.5 8l2.5 2.5 4-4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                              ) : (
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke={isStepActive ? '#545861' : '#d1d5db'} strokeWidth="1"/></svg>
                                              )}
                                            </div>
                                            {!isLast && <div className="flex-1 w-px mt-1" style={{ borderLeft: '1px dashed #e4e7eb' }} />}
                                          </div>
                                          <div className={`flex flex-col ${isLast ? '' : 'pb-3'}`}>
                                            {isStepActive ? (
                                              <span className="text-sm shimmer-sweep-text leading-5">{stepText}</span>
                                            ) : (
                                              <span className={`text-sm leading-5 ${isStepDone ? 'line-through text-[#717680]' : 'text-[#545861]'}`}>{stepText}</span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                              {chip.phase === 'done' && (
                                <div className="flex flex-col gap-3 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                                  <Typography variant="body-md" color="primary">
                                    Done! Here&apos;s what was set up:
                                  </Typography>
                                  <EntityV variant="List" />
                                  <EntityV variant="Stat" />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })}

                    {/* Submitted messages from message box */}
                    {savedChat.id === '0' && submittedMessages.map((msg) => (
                      <div key={msg.id} className="flex flex-col gap-6">
                        <div className="flex justify-end pl-6">
                          <div className="bg-secondary rounded-[16px] px-4 py-[10px] max-w-[75%]">
                            <Typography variant="body-md" color="primary">{renderWithMentions(msg.text)}</Typography>
                          </div>
                        </div>
                        {msg.stopped ? (
                          <div className="flex items-center gap-1.5 animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0 text-[#9ca3af]"><rect x="2" y="2" width="9" height="9" rx="1.5" fill="currentColor"/></svg>
                            <span className="text-xs text-[#9ca3af]">Generation stopped</span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3 animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                            <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                            <ThinkingIndicator
                              done={msg.phase === 'reply'}
                              skill={msg.skill?.id}
                              skillIcon={msg.skill?.icon}
                            />
                            {msg.phase === 'reply' && (
                              <div className="animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                                <MarkdownContent content={msg.reply} />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    <div ref={savedChatEndRef} />
                  </div>
                </div>
                {savedChat.id === '0' && (
                  <div className="shrink-0 px-4 pb-0 relative">
                    <div className="absolute bottom-full left-0 right-0 h-[60px] pointer-events-none z-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_91%)] backdrop-blur-[1px]" />
                    {/* Scroll-to-bottom button — floats just above chips row */}
                    {showScrollBtn && (
                      <div className="absolute bottom-full left-0 right-0 pb-2 flex justify-center z-10 pointer-events-none">
                        <button
                          type="button"
                          onClick={() => { savedChatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                          className="pointer-events-auto w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-[#e4e7eb] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:bg-[#f7f9fa] transition-colors animate-[fadeIn_0.15s_cubic-bezier(0.16,1,0.3,1)_both]"
                          aria-label="Scroll to bottom"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 3v9M4 9l4 4 4-4" stroke="#191b1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    )}

                  </div>
                )}
                <div className="shrink-0 relative">
                  {activeOverlay && (() => {
                    const isLoading = activeOverlay.status === 'loading';
                    let content: React.ReactNode = null;

                    if (isLoading) {
                      content = (
                        <div className="w-full max-w-[678px] mx-auto animate-[fadeInSlide_0.3s_cubic-bezier(0.16,1,0.3,1)_both]">
                          <div className="w-full bg-[#f7f9fa] border border-[#e4e7eb] rounded-[12px] overflow-hidden">
                            <div className="h-14 bg-[#eef0f2] animate-pulse" />
                            <div className="bg-white px-4 py-4 flex flex-col gap-3">
                              <div className="h-3.5 bg-[#f0f3f5] rounded-full animate-pulse w-3/4" />
                              <div className="h-3.5 bg-[#f0f3f5] rounded-full animate-pulse w-1/2" />
                              <div className="h-3.5 bg-[#f0f3f5] rounded-full animate-pulse w-2/3" />
                            </div>
                            <div className="h-12 bg-[#eef0f2] animate-pulse border-t border-[#e4e7eb]" />
                          </div>
                        </div>
                      );
                    } else if (activeOverlay.label === 'Plan') {
                      const planSteps = [
                        "Create the 'Welcome Zone' space group",
                        "Create the 'Game Talk' space group",
                        "Create the 'Resources & Guides' space group",
                        "Create the 'Community Hub' space group",
                        "Create 'Community Rules' space in Welcome Zone",
                        "Create 'Introductions' space in Welcome Zone",
                        "Create 'Announcements' space in Welcome Zone",
                        "Create 'General Discussion' space in Game Talk",
                        "Create 'Game Reviews' space in Game Talk",
                        "Create 'Tips & Tricks' space in Resources & Guides",
                        "Create 'Guides & Tutorials' space in Resources & Guides",
                        "Create 'Events' space in Community Hub",
                        "Create 'Feedback' space in Community Hub",
                      ];
                      const MAX_PLAN_VISIBLE = 5;
                      const visiblePlanSteps = planSteps.slice(0, MAX_PLAN_VISIBLE);
                      const hiddenPlanSteps = planSteps.slice(MAX_PLAN_VISIBLE);
                      const hiddenPlanCount = hiddenPlanSteps.length;
                      const PlanStepRow = ({ step, isLast }: { step: string; isLast: boolean }) => (
                        <div className="flex gap-2 items-start">
                          <div className="flex flex-col items-center shrink-0 self-stretch">
                            <div className="pt-[2px]">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#d1d5db" strokeWidth="1"/></svg>
                            </div>
                            {!isLast && <div className="flex-1 w-px mt-1" style={{ borderLeft: '1px dashed #e4e7eb' }} />}
                          </div>
                          <div className={`flex flex-col ${isLast ? '' : 'pb-3'}`}>
                            <span className="text-sm text-[#545861] leading-5">{step}</span>
                          </div>
                        </div>
                      );
                      content = (
                        <div className="w-full max-w-[678px] mx-auto animate-[fadeInSlide_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
                          <div className="w-full bg-[#f7f9fa] border border-[#e4e7eb] rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
                            <div className="bg-white border-b border-[#f0f3f5] flex h-14 items-center px-[18px] py-3 rounded-t-[12px]">
                              <span className="text-sm font-semibold text-[#191b1f]">Set up a well-organized community structure with space groups and spaces</span>
                            </div>
                            <div className="bg-white px-5 py-4 flex flex-col gap-3 rounded-b-[12px] border-b border-[#e4e7eb]">
                              <div className="flex flex-col">
                                {visiblePlanSteps.map((step, i) => (
                                  <PlanStepRow key={i} step={step} isLast={i === visiblePlanSteps.length - 1 && hiddenPlanCount === 0} />
                                ))}
                                {hiddenPlanCount > 0 && (
                                  <div
                                    style={{
                                      display: 'grid',
                                      gridTemplateRows: planOverlayExpanded ? '1fr' : '0fr',
                                      transition: 'grid-template-rows 350ms cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                  >
                                    <div style={{ overflow: 'hidden' }}>
                                      {hiddenPlanSteps.map((step, i) => (
                                        <PlanStepRow key={i} step={step} isLast={i === hiddenPlanSteps.length - 1} />
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {hiddenPlanCount > 0 && (
                                  <div
                                    style={{
                                      display: 'grid',
                                      gridTemplateRows: planOverlayExpanded ? '0fr' : '1fr',
                                      transition: 'grid-template-rows 350ms cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                  >
                                    <div style={{ overflow: 'hidden' }}>
                                      <button
                                        type="button"
                                        onClick={() => setPlanOverlayExpanded(true)}
                                        className="text-sm text-[#3C53E7] hover:underline mt-1 text-left cursor-pointer"
                                      >
                                        +{hiddenPlanCount} more steps
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="bg-[#f7f9fa] flex items-center justify-end gap-2 px-3 py-3 rounded-b-[12px]">
                              <Button type="button" variant="ghost" size="sm" onClick={() => setActiveOverlay(null)}>Cancel</Button>
                              <Button type="button" variant="primary" size="sm" onClick={() => {
                                const resultId = `Plan-result-${Date.now()}`;
                                setActiveOverlay(null);
                                setPlanAccepted(true);
                                setPlanStep(1);
                                setChipQueue(prev => [...prev, { id: resultId, label: 'Plan-result', status: 'ready' }]);
                              }}>Accept</Button>
                            </div>
                          </div>
                        </div>
                      );
                    } else if (activeOverlay.label === 'Clarification') {
                      const clarQuestions = [
                        { text: 'What type of community are you building?', options: ['Professional/networking', 'Course/education', 'Membership/subscription'] },
                        { text: 'How many spaces do you need to start?', options: ['1-3 focused spaces', '4-6 spaces', '7+ spaces with categories'] },
                      ];
                      const q = clarQuestions[clarificationQ - 1];
                      const currentAnswer = clarificationQ === 1 ? clarificationA1 : clarificationA2;
                      const setCurrentAnswer = clarificationQ === 1 ? setClarificationA1 : setClarificationA2;
                      const isLastQ = clarificationQ === 2;
                      const handleClarApprove = () => {
                        const a1 = clarificationA1 || (clarificationQ === 1 ? clarificationCustomText.trim() : '');
                        const a2 = clarificationA2 || (clarificationQ === 2 ? clarificationCustomText.trim() : '');
                        const answers = [a1, a2].filter(Boolean) as string[];
                        setClarificationSavedAnswers(answers);
                        setClarificationCustomText('');
                        const resultId = `Clarification-result-${Date.now()}`;
                        setActiveOverlay(null);
                        setChipQueue(prev => [...prev, { id: resultId, label: 'Clarification-result', status: 'ready' }]);
                      };
                      content = (
                        <div className="w-full max-w-[678px] mx-auto animate-[fadeInSlide_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
                          <div className="w-full bg-secondary border border-[#e4e7eb] rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
                            <div className="bg-white border-b border-[#f0f3f5] flex h-14 items-center px-[18px] py-3 rounded-t-[14px]">
                              <span className="text-sm font-semibold text-[#191b1f]">{q.text}</span>
                            </div>
                            <div className="bg-white flex flex-col rounded-b-[12px] border-b border-secondary">
                              {q.options.map((opt) => {
                                const isSel = currentAnswer === opt;
                                return (
                                  <button key={opt} type="button" onClick={() => setCurrentAnswer(opt)} className={`flex gap-3 items-center px-3 py-3 w-full text-left border-b border-secondary transition-colors ${isSel ? 'bg-secondary' : 'bg-white hover:bg-secondary'}`}>
                                    <div className="shrink-0 w-4 h-4 flex items-center justify-center">
                                      {isSel ? (
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="white" stroke="#191b1f" strokeWidth="1.5"/><circle cx="8" cy="8" r="3.5" fill="#191b1f"/></svg>
                                      ) : (
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="white" stroke="#d1d5db" strokeWidth="1.5"/></svg>
                                      )}
                                    </div>
                                    <span className="text-sm text-[#191b1f]">{opt}</span>
                                  </button>
                                );
                              })}
                              <div className="flex items-center pl-3 pr-3 py-3 bg-white border-b border-secondary rounded-b-[12px]">
                                <input type="text" value={clarificationCustomText} onChange={e => { setClarificationCustomText(e.target.value); setCurrentAnswer(null); }} onKeyDown={e => { if (e.key === 'Enter' && (clarificationCustomText.trim() || currentAnswer)) { if (isLastQ) { handleClarApprove(); } else { setClarificationQ(2); } } }} placeholder="Type your reply..." className="w-full text-sm text-[#191b1f] placeholder-[#717680] bg-transparent outline-none" />
                              </div>
                            </div>
                            <div className="bg-[#f7f9fa] flex items-center justify-between px-3 py-3 rounded-b-[14px]">
                              <span className="text-xs text-[#545861]">Question {clarificationQ} of 2</span>
                              <div className="flex items-center gap-2">
                                <Button type="button" variant="ghost" size="sm" onClick={() => { if (isLastQ) { handleClarApprove(); } else { setClarificationQ(2); } }}>Skip</Button>
                                <Button type="button" variant="primary" size="sm" disabled={!currentAnswer && !clarificationCustomText.trim()} onClick={() => { if (isLastQ) { handleClarApprove(); } else { setClarificationQ(2); } }}>{isLastQ ? 'Approve' : 'Next'}</Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    } else if (activeOverlay.label === 'Order Clarification') {
                      const handleOrderApprove = () => {
                        const finalItems = orderCustomText.trim() ? [...orderItems, orderCustomText.trim()] : [...orderItems];
                        setOrderSavedItems(finalItems);
                        setOrderCustomText('');
                        const resultId = `Order-result-${Date.now()}`;
                        setActiveOverlay(null);
                        setChipQueue(prev => [...prev, { id: resultId, label: 'Order-result', status: 'ready' }]);
                      };
                      content = (
                        <div className="w-full max-w-[678px] mx-auto animate-[fadeInSlide_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
                          <div className="w-full bg-secondary border border-[#e4e7eb] rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
                            <div className="bg-white border-b border-[#f0f3f5] flex h-14 items-center px-[18px] py-3 rounded-t-[14px]">
                              <span className="text-sm font-semibold text-[#191b1f]">What type of community are you building?</span>
                            </div>
                            <div className="bg-white flex flex-col rounded-b-[12px] border-b border-secondary">
                              {orderItems.map((item, i) => {
                                const isDragging = orderDraggingIdx === i;
                                const isOver = orderDragOverIdx === i && orderDraggingIdx !== i;
                                return (
                                  <div key={item} draggable onDragStart={(e) => { setOrderDraggingIdx(i); e.dataTransfer.effectAllowed = 'move'; const ghost = document.createElement('div'); ghost.style.cssText = 'position:fixed;top:-999px;background:#f7f9fa;border:1px solid #e4e7eb;border-radius:8px;padding:8px 12px;font-size:14px;color:#191b1f;white-space:nowrap;transform:rotate(-1deg);box-shadow:0 4px 12px rgba(0,0,0,0.1)'; ghost.textContent = item; document.body.appendChild(ghost); e.dataTransfer.setDragImage(ghost, ghost.offsetWidth / 2, 20); setTimeout(() => document.body.removeChild(ghost), 0); }} onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (orderDraggingIdx !== null && orderDraggingIdx !== i) setOrderDragOverIdx(i); }} onDrop={(e) => { e.preventDefault(); if (orderDraggingIdx === null || orderDraggingIdx === i) return; const next = [...orderItems]; const [moved] = next.splice(orderDraggingIdx, 1); next.splice(i, 0, moved); setOrderItems(next); setOrderDraggingIdx(null); setOrderDragOverIdx(null); }} onDragEnd={() => { setOrderDraggingIdx(null); setOrderDragOverIdx(null); }} className={`flex gap-3 items-center px-3 py-3 border-b border-[#f0f3f5] cursor-grab active:cursor-grabbing select-none transition-all ${isDragging ? 'opacity-5' : isOver ? 'bg-[#f0f3f5]' : 'bg-white'}`}>
                                    <div className="shrink-0 w-4 h-4 flex items-center justify-center text-[#9ca3af]">
                                      <svg width="12" height="16" viewBox="0 0 12 16" fill="none"><circle cx="3" cy="3" r="1.5" fill="currentColor"/><circle cx="9" cy="3" r="1.5" fill="currentColor"/><circle cx="3" cy="8" r="1.5" fill="currentColor"/><circle cx="9" cy="8" r="1.5" fill="currentColor"/><circle cx="3" cy="13" r="1.5" fill="currentColor"/><circle cx="9" cy="13" r="1.5" fill="currentColor"/></svg>
                                    </div>
                                    <span className="text-sm text-[#191b1f]">{item}</span>
                                  </div>
                                );
                              })}
                              <div className="flex items-center pl-3 pr-3 py-3 bg-white border-b border-secondary rounded-b-[12px]">
                                <input type="text" value={orderCustomText} onChange={e => setOrderCustomText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !orderDraggingIdx) handleOrderApprove(); }} placeholder="Type your reply..." className="w-full text-sm text-[#191b1f] placeholder-[#717680] bg-transparent outline-none" />
                              </div>
                            </div>
                            <div className="bg-[#f7f9fa] flex items-center justify-between px-3 py-3 rounded-b-[14px]">
                              <span className="text-xs text-[#545861]">Question 1 of 1</span>
                              <div className="flex items-center gap-2">
                                <Button type="button" variant="ghost" size="sm" disabled={orderDraggingIdx !== null} onClick={() => setActiveOverlay(null)}>Skip</Button>
                                <Button type="button" variant="primary" size="sm" disabled={orderDraggingIdx !== null} onClick={handleOrderApprove}>Approve</Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    } else if (activeOverlay.label === 'Plan with confirmation' || activeOverlay.label === 'Plan sensitive (no confirm)') {
                      const isNoConfirm = activeOverlay.label === 'Plan sensitive (no confirm)';
                      const confPlan = {
                        title: 'Access Groups & Permissions',
                        iconColor: '#fef3c7',
                        sections: PLAN_CONF_STEPS.map(s => ({
                          title: s.title,
                          description: s.detail,
                          sensitive: s.sensitive,
                        })),
                      };
                      content = (
                        <div className="w-full max-w-[678px] mx-auto animate-[fadeInSlide_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
                          <PlanOverlay
                            plan={confPlan}
                            sensitiveLabel={isNoConfirm ? 'sensitive' : 'confirmation required'}
                            showDetails={planConfDetailsExpanded}
                            onToggleDetails={() => setPlanConfDetailsExpanded(v => !v)}
                            onAccept={() => {
                              setActiveOverlay(null);
                              const chipId = `Plan-conf-executing-${Date.now()}`;
                              setPlanConfNoConfirm(isNoConfirm);
                              setPlanConfPhase('working');
                              setPlanConfStep(1);
                              setChipQueue(prev => [...prev, { id: chipId, label: 'Plan-conf-executing', status: 'ready' }]);
                            }}
                            onCancel={() => setActiveOverlay(null)}
                          />
                        </div>
                      );
                    } else if (activeOverlay.label === 'Plan with feedback') {
                      const plan: PlanData = {
                        title: 'Community Spaces Setup',
                        iconColor: '#dbeafe',
                        sections: [
                          { title: 'Create Welcome & Introductions space', description: 'Set up the primary onboarding space with welcome posts and member guidelines.' },
                          { title: 'Set up General Discussion and Resources spaces', description: 'Create topic-specific spaces with starter content and posting rules.' },
                          { title: 'Configure member access groups', description: 'Apply Free and Pro tier access rules across all 12 spaces.' },
                          { title: 'Add moderators and notification rules', description: 'Assign moderators to each space and enable activity digest emails.' },
                          { title: 'Publish and notify members', description: 'Make all spaces live and send welcome notifications to your 3,284 members.' },
                        ],
                      };
                      content = (
                        <div className="w-full max-w-[678px] mx-auto animate-[fadeInSlide_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
                          <PlanOverlay
                            plan={plan}
                            onAccept={() => acceptPlanChip('Plan with feedback')}
                            onCancel={() => setActiveOverlay(null)}
                          />
                        </div>
                      );
                    } else if (activeOverlay.label === 'Plan failure') {
                      const plan: PlanData = {
                        title: 'Paywall & Pricing Setup',
                        iconColor: '#fce7f3',
                        sections: [
                          { title: 'Define Free and Pro membership tiers', description: 'Create two access tiers with clear feature boundaries and pricing.' },
                          { title: 'Apply paywall rules to premium spaces', description: 'Gate 8 premium content spaces behind the Pro tier using access groups.' },
                          { title: 'Connect Stripe payment processing', description: 'Integrate Stripe to handle subscription billing, renewals, and failed payment retries.', sensitive: true },
                        ],
                      };
                      content = (
                        <div className="w-full max-w-[678px] mx-auto animate-[fadeInSlide_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
                          <PlanOverlay
                            plan={plan}
                            sensitiveLabel="confirmation required"
                            onAccept={() => acceptPlanChip('Plan failure')}
                            onCancel={() => setActiveOverlay(null)}
                          />
                        </div>
                      );
                    }

                    if (!content) return null;
                    return (
                      <div className="absolute inset-x-0 bottom-0 px-4 pb-4 z-10">
                        {content}
                      </div>
                    );
                  })()}

                  {/* Sensitive step confirmation modal — overlays input when awaiting confirmation */}
                  {planConfPhase === 'awaiting-confirmation' && (
                    <div className="absolute inset-x-0 bottom-0 px-4 pb-4 z-10">
                      <div className="w-full max-w-[678px] mx-auto animate-[fadeInSlide_0.2s_cubic-bezier(0.16,1,0.3,1)_both]">
                        <div className="bg-secondary border border-secondary rounded-xl shadow-2xs">
                          <div className="bg-primary rounded-t-xl">
                            {/* Header */}
                            <div className="flex items-center gap-3 h-14 px-[18px] border-b border-secondary">
                              <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M7 1.5L12.5 11.5H1.5L7 1.5Z" stroke="#d97706" strokeWidth="1.3" strokeLinejoin="round"/>
                                  <path d="M7 5.5v3" stroke="#d97706" strokeWidth="1.3" strokeLinecap="round"/>
                                  <circle cx="7" cy="10" r="0.65" fill="#d97706"/>
                                </svg>
                              </div>
                              <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-sm font-semibold text-primary leading-5">Access Groups &amp; Permissions</span>
                                <span className="text-xs text-tertiary leading-[18px]">Sensitive action — requires your approval</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setPlanConfDetailsExpanded(v => !v)}
                                className="text-xs text-[#717680] hover:text-[#191b1f] transition-colors flex items-center gap-1 shrink-0"
                              >
                                {planConfDetailsExpanded ? (
                                  <><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>Hide details</>
                                ) : (
                                  <><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>Show details</>
                                )}
                              </button>
                            </div>
                            {/* Body */}
                            <div className="px-[18px] py-4 flex flex-col gap-3">
                              <p className="text-sm text-secondary leading-5">
                                This step will replace current access rules for all 47 members. Members will lose their existing permissions and be reassigned according to the new access group configuration.
                              </p>
                              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
                                <p className="text-sm text-amber-800 leading-5">
                                  <span className="font-semibold">This cannot be undone.</span> All existing manual permission overrides will be removed.
                                </p>
                              </div>
                              {/* Expanded step details */}
                              {planConfDetailsExpanded && (
                                <div className="flex flex-col gap-2 pt-1 border-t border-secondary animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                                  {PLAN_CONF_STEPS.map((step, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                      {step.sensitive ? (
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-[2px]"><circle cx="7" cy="7" r="5.5" stroke="#d97706" strokeWidth="1" strokeDasharray="3 2"/><path d="M7 4.5v2.5" stroke="#d97706" strokeWidth="1" strokeLinecap="round"/><circle cx="7" cy="9" r="0.5" fill="#d97706"/></svg>
                                      ) : (
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-[2px]"><circle cx="7" cy="7" r="5.5" stroke="#d1d5db" strokeWidth="1"/></svg>
                                      )}
                                      <div className="flex flex-col">
                                        <span className={`text-xs font-medium leading-[18px] ${step.sensitive ? 'text-amber-700' : 'text-[#191b1f]'}`}>{step.title}</span>
                                        <span className="text-xs text-[#717680] leading-[18px]">{step.detail}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          {/* Footer */}
                          <div className="bg-secondary flex items-center justify-end gap-2 px-3 py-3 rounded-b-xl">
                            <Button type="button" variant="ghost" size="sm" onClick={() => {
                              setPlanConfPhase('error');
                            }}>Reject</Button>
                            <Button type="button" variant="primary" size="sm" onClick={() => {
                              setPlanConfPhase('working-post-confirm');
                            }}>Approve</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {!hasPendingClarification && (
                    <div className={`px-4 pt-4 pb-4 transition-opacity duration-200 ${activeOverlay || planConfPhase === 'awaiting-confirmation' ? 'opacity-0 pointer-events-none' : ''}`}>
                      <div className="w-full max-w-[678px] mx-auto">
                        <AgentMessageBox placeholder={awaitingLiveChatClarification ? 'Describe your issue...' : 'Message Circle AI...'} onSubmit={handleChatSubmit} isGenerating={isGenerating || isPlanRunning} onStop={handleStop} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          }
          const claraChatPane = (
              <div className={`w-full flex-1 flex flex-col min-h-0 transition-opacity duration-250 delay-100 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
                {/* Chat with Circle AI */}
                <div className="flex-1 overflow-y-auto px-6 py-9">
                  <div className={mergeClasses('w-full mx-auto flex flex-col gap-10', planBuildMode ? 'max-w-none' : 'max-w-[678px]')}>
                {/* Clara intro */}
                <div className="group flex flex-col gap-2 min-w-0">
                  <div className="flex flex-col gap-2 w-full min-w-0">
                    <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                    <p className="text-[16px] font-normal leading-[24px] text-[#191b1f]">
                      Hey! I&apos;m Circle AI. I have full visibility into your community — member activity, onboarding, content, and revenue. What would you like to work on?
                    </p>
                  </div>
                  <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <div className="flex items-center gap-[5px]">
                      <IconButton type="button" variant="ghost" size="sm" icon="thumbup" aria-label="Like" />
                      <div className="-scale-y-100">
                        <IconButton type="button" variant="ghost" size="sm" icon="thumbup" aria-label="Dislike" />
                      </div>
                      <IconButton type="button" variant="ghost" size="sm" icon="copy" aria-label="Copy" />
                    </div>
                    <span className="text-xs text-[#717680]">3:41 PM</span>
                  </div>
                </div>

                {/* User message */}
                <div className="group flex flex-col items-end pl-6 gap-1">
                  <div className="bg-secondary rounded-[16px] px-4 py-[10px]">
                    <Typography variant="body-md" color="primary">
                      How are this week&apos;s new members doing?
                    </Typography>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <span className="text-xs text-[#717680] px-1">3:41 PM</span>
                    <IconButton type="button" variant="ghost" size="sm" icon="copy" aria-label="Copy" />
                    <IconButton type="button" variant="ghost" size="sm" icon="refresh" aria-label="Retry" />
                  </div>
                </div>

                {/* Clara response with artifact card */}
                <div className="group flex flex-col gap-2 min-w-0">
                  <div className="flex flex-col gap-2 w-full min-w-0">
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
                        <Icon name="chart-square" size="md" color="primary" aria-hidden />
                        <Typography variant="label-sm" color="primary" className="font-medium">
                          {ONBOARDING_ASSET.title}
                        </Typography>
                        <Typography variant="body-sm" color="secondary">
                          {ONBOARDING_ASSET.subtitle}
                        </Typography>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <div className="flex items-center gap-[5px]">
                      <IconButton type="button" variant="ghost" size="sm" icon="thumbup" aria-label="Like" />
                      <div className="-scale-y-100">
                        <IconButton type="button" variant="ghost" size="sm" icon="thumbup" aria-label="Dislike" />
                      </div>
                      <IconButton type="button" variant="ghost" size="sm" icon="copy" aria-label="Copy" />
                    </div>
                    <span className="text-xs text-[#717680]">3:41 PM</span>
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

                    {/* Clarification answers — submitted Q/A pairs */}
                    {planAnswers.length > 0 && (
                      <ClarificationAnswersBubble
                        pairs={PLAN_QUESTIONS.map((q, i) => ({
                          question: q.question,
                          answer: planAnswers[i] ?? '',
                        }))}
                      />
                    )}

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

                {/* Redesign project progress scenario */}
                {redesignPhase !== 'idle' && (
                  <>
                    {/* User's redesign request */}
                    <div className="flex flex-col items-end gap-1 animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                      <div className="bg-secondary rounded-[16px] px-4 py-[10px]">
                        <Typography variant="body-md" color="primary">
                          {redesignPrompt}
                        </Typography>
                      </div>
                    </div>

                    {/* Thinking indicator */}
                    <div className="animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                      <ThinkingIndicator
                        skill="Project planner"
                        done={redesignPhase === 'reply' || redesignPhase === 'done'}
                        steps={[
                          { label: 'Analyzing current project plan and step dependencies...' },
                          { label: 'Restructuring steps to prioritize space creation and configuration...' },
                          { label: 'Generating updated plan with spaces-first approach...' },
                        ]}
                      />
                    </div>

                    {/* AI reply — updating */}
                    {(redesignPhase === 'reply' || redesignPhase === 'done') && (
                      <div className="flex flex-col items-start gap-4 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                        <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                        <div className="flex flex-col gap-3 w-full">
                          <Typography variant="body-md" color="primary" className="px-1">
                            I&apos;ve restructured your project plan to prioritize creating spaces first. The plan now focuses on getting your space structure right before moving to content and onboarding — this way, everything you build after has a clear home.
                          </Typography>
                          <Typography variant="body-md" color="primary" className="px-1">
                            Updating your project progress now...
                          </Typography>
                        </div>
                      </div>
                    )}

                    {/* AI reply — confirmation after update */}
                    {redesignPhase === 'done' && (
                      <div className="flex flex-col items-start gap-4 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                        <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                        <div className="flex flex-col gap-3 w-full">
                          <Typography variant="body-md" color="primary" className="px-1">
                            Done — your project plan has been updated. The 6 new steps are focused on designing, creating, and configuring your spaces before moving on to content and member invitations. You can click any step to start working on it.
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
                    )}
                  </>
                )}

                {/* Submitted messages from message box */}
                {submittedMessages.map((msg) => (
                  <div key={msg.id} className="flex flex-col gap-6">
                    {/* Reference pills — above the message bubble */}
                    {msg.referenceAttachments && msg.referenceAttachments.length > 0 && (
                      <div className="flex justify-end pl-6">
                        <div className="flex flex-col gap-1.5 max-w-[75%]">
                          {msg.referenceAttachments.map((ref, i) => (
                            <div key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary border border-secondary rounded-full self-end">
                              <Icon name="message-dots" size="sm" color="tertiary" />
                              <span className="text-xs font-semibold text-primary">{ref.authorName}</span>
                              <span className="text-xs text-tertiary">:</span>
                              <span className="text-xs text-tertiary truncate max-w-[280px]">{ref.snippet}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* User message bubble — hidden for assistant-only entries */}
                    {!msg.assistantOnly && (
                      <div className="flex justify-end pl-6">
                        <div className="bg-secondary rounded-[16px] px-4 py-[10px] max-w-[75%]">
                          <Typography variant="body-md" color="primary">{msg.text}</Typography>
                        </div>
                      </div>
                    )}
                    {/* AI response */}
                    {msg.stopped ? (
                      <div className="flex items-center gap-1.5 animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0 text-[#9ca3af]"><rect x="2" y="2" width="9" height="9" rx="1.5" fill="currentColor"/></svg>
                        <span className="text-xs text-[#9ca3af]">Generation stopped</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                        <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                        {(msg.phase === 'thinking' || !msg.clarification) && (
                          <ThinkingIndicator
                            done={msg.phase === 'reply'}
                            skill={msg.skill?.id}
                            skillIcon={msg.skill?.icon}
                          />
                        )}
                        {msg.phase === 'reply' && msg.artifact ? (
                          <div className="animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                            <AiAssistArtifactCard
                              artifact={msg.artifact}
                              targetCategory={msg.targetCategory ?? 'dm'}
                              referenceMessageId={msg.referenceAttachments?.[0]?.messageId ?? ''}
                              recipientName={msg.recipientName}
                            />
                          </div>
                        ) : msg.phase === 'reply' && msg.reply && (
                          <div className="animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                            <MarkdownContent content={msg.reply} />
                          </div>
                        )}
                        {msg.ticketSubmitted && (
                          <div className="animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                            <TicketLinkCard
                              subject={msg.ticketSubmitted.subject}
                              onView={() => openTicketInInbox(msg.ticketSubmitted!.threadId)}
                            />
                          </div>
                        )}
                        {msg.queueCard && msg.phase === 'reply' && (
                          <div className="animate-[fadeInSlide_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
                            <QueueCard
                              threadId={msg.queueCard.threadId}
                              onOpenConversation={() =>
                                window.dispatchEvent(new CustomEvent('open-support', { detail: { threadId: msg.queueCard!.threadId } }))
                              }
                            />
                          </div>
                        )}
                      </div>
                    )}
                    {msg.ticketForm?.open && (
                      <SupportTicketForm
                        initialDescription={msg.ticketForm.initialDescription}
                        onSubmit={data => handleTicketFormSubmit(msg.id, data)}
                      />
                    )}
                    {msg.clarification?.selected && (
                      <ClarificationAnswersBubble
                        pairs={[{
                          question: clarificationWidgetCopy.question,
                          answer: msg.clarification.selected === 'live_chat'
                            ? clarificationWidgetCopy.options.liveChat.label
                            : clarificationWidgetCopy.options.email.label,
                        }]}
                      />
                    )}
                  </div>
                ))}

                <div ref={chatEndRef} />
              </div>
            </div>

                {/* Clarifying questions — float above input */}
                <div className="shrink-0 px-4 pb-4">
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
                    {(() => {
                      const activeClarification = [...submittedMessages]
                        .reverse()
                        .find(m => m.clarification && !m.clarification.selected);
                      if (!activeClarification?.clarification) return null;
                      return (
                        <div className="mb-3">
                          <ClarifyingQuestions
                            questions={SUPPORT_CLARIFICATION_QUESTIONS}
                            onComplete={answers => {
                              const a = (answers[0] ?? '').trim();
                              const liveChatLabel = clarificationWidgetCopy.options.liveChat.label;
                              const emailLabel = clarificationWidgetCopy.options.email.label;
                              let choice: ClarificationChoice = 'email';
                              let customText: string | undefined;
                              if (a === liveChatLabel) choice = 'live_chat';
                              else if (a === emailLabel) choice = 'email';
                              else { choice = 'email'; customText = a; }
                              handleClarificationChoice(activeClarification.id, activeClarification.text, choice, customText);
                            }}
                            onDismiss={() => {
                              setSubmittedMessages(prev => prev.filter(m => m.id !== activeClarification.id));
                              setAwaitingLiveChatClarification(false);
                            }}
                          />
                        </div>
                      );
                    })()}
                  </div>
                </div>


                {/* Reply input — plan overlay anchored to top of this container */}
                <div className={`relative shrink-0 transition-opacity duration-300 ease-out ${hideInput ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                  {planPhase === 'done' && planResult && !planAccepted && (
                    <div className="absolute bottom-full inset-x-0 z-10 px-6 pb-4">
                      <div className={mergeClasses('w-full mx-auto', planBuildMode ? 'max-w-none' : 'max-w-[678px]')}>
                        <PlanOverlay
                          plan={planResult}
                          onAccept={() => { setPlanAccepted(true); setPlanStep(1); }}
                          onCancel={() => { setPlanPhase('idle'); setPlanResult(null); }}
                        />
                      </div>
                    </div>
                  )}
                  {!hasPendingClarification && (
                    <div className="px-6 pt-4 pb-4">
                      <div className={mergeClasses('w-full mx-auto', planBuildMode ? 'max-w-none' : 'max-w-[678px]')}>
                        <AgentMessageBox
                          placeholder={awaitingLiveChatClarification ? 'Describe your issue...' : 'Message Circle AI...'}
                          initialValue={initialMessage}
                          onSubmit={handleChatSubmit}
                          isGenerating={isGenerating}
                          onStop={handleStop}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );

          return claraChatPane;
        })()}

        </div>
      </main>

      {/* Artifact panel — slides in from right */}
      <div
        className="flex flex-col shrink-0 my-4 mr-4 ml-0 rounded-2xl border border-secondary bg-primary shadow-sm overflow-hidden"
        style={{
          width: artifactPanel ? (artifactPanelMode === 'full' ? '65%' : '35%') : '0%',
          opacity: artifactPanel ? 1 : 0,
          transition: 'width 400ms cubic-bezier(0.16, 1, 0.3, 1), opacity 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {artifactPanel && (
          <>
            {/* Panel header */}
            <div className="shrink-0 flex items-center gap-2 h-14 px-5 border-b border-secondary bg-primary">
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-primary truncate block">{artifactPanel.title}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {(() => {
                  const editTypes = ['member-preview', 'audience'];
                  const moreTypes = ['member-table', 'data-table', 'analytics'];
                  if (artifactPanelMode === 'full') return null;
                  if (artifactPanel.type === 'page-preview') {
                    return <Button type="button" variant="outline" size="sm" onClick={enterBuilder}>Edit in builder</Button>;
                  }
                  if (editTypes.includes(artifactPanel.type)) {
                    return <Button type="button" variant="outline" size="sm" onClick={expandArtifactPanel}>Edit</Button>;
                  }
                  if (moreTypes.includes(artifactPanel.type)) {
                    return <Button type="button" variant="outline" size="sm" onClick={expandArtifactPanel}>More</Button>;
                  }
                  return null;
                })()}
                <IconButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon="cross"
                  aria-label="Close panel"
                  onClick={closeArtifactPanel}
                />
              </div>
            </div>
            {/* Panel content */}
            <div className={`flex-1 min-h-0 overflow-y-auto bg-primary ${artifactPanelMode === 'half' ? 'pointer-events-none select-none' : ''}`}>
              {artifactLoading ? (
                <div className="px-6 py-6 flex flex-col gap-4 animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                  <div className="h-8 w-32 rounded-lg bg-secondary shimmer-sweep" />
                  <div className="grid grid-cols-3 gap-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-[88px] rounded-xl bg-secondary shimmer-sweep" />
                    ))}
                  </div>
                  <div className="h-[160px] rounded-xl bg-secondary shimmer-sweep" />
                  <div className="h-[280px] rounded-xl bg-secondary shimmer-sweep" />
                </div>
              ) : (
                <>
                  {artifactPanel.type === 'page-preview' && <PagePreviewPanel onOpenBuilder={() => { setBuilderMode(true); closeArtifactPanel(); }} />}
              {artifactPanel.type === 'member-table' && <MemberTablePanel />}
                  {artifactPanel.type === 'member-preview' && <MemberPreviewPanel />}
                  {artifactPanel.type === 'analytics' && artifactPanelMode === 'half' && <AnalyticsPanel />}
                  {artifactPanel.type === 'analytics' && artifactPanelMode === 'full' && <AnalyticsDashboard />}
                  {artifactPanel.type === 'audience' && <AudiencePanel />}
                  {artifactPanel.type === 'data-table' && <DataTablePanel />}
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Quick Actions dropdown — fixed next to Dark toggle */}
      <div
        ref={quickActionsRef}
        className="fixed bottom-4 z-[9999]"
        style={{ right: 'calc(16px + 70px + 8px)' }}
      >
        {quickActionsOpen && (
          <div className="absolute bottom-full mb-2 right-0 bg-primary border border-secondary rounded-xl shadow-lg p-1 min-w-[200px] animate-[fadeIn_0.15s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="px-2 py-1 text-xs font-medium text-tertiary">Existing</div>
            {(['Entity', 'Clarification', 'Plan', 'Builder page'] as const).map(label => (
              <button
                key={label}
                type="button"
                onClick={() => handleQuickAction(label)}
                className="flex w-full items-center px-2 py-2 text-sm text-primary rounded-lg hover:bg-hover text-left transition-colors duration-75"
              >
                {label}
              </button>
            ))}
            <div className="border-t border-secondary my-1" />
            <div className="px-2 py-1 text-xs font-medium text-tertiary">Plan states</div>
            {(['Plan with confirmation', 'Plan sensitive (no confirm)', 'Plan failure', 'Plan with feedback'] as const).map(label => (
              <button
                key={label}
                type="button"
                onClick={() => handleQuickAction(label)}
                className="flex w-full items-center px-2 py-2 text-sm text-primary rounded-lg hover:bg-hover text-left transition-colors duration-75"
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setQuickActionsOpen(o => !o)}
        >
          Quick Actions
        </Button>
      </div>
    </div>

    {/* ── Builder mode overlay ─────────────────────────────────────────── */}
    {builderMode && (
      <div
        className="fixed inset-0 z-50 flex"
        style={{
          background: '#f7f9fa',
          clipPath: builderVisible
            ? 'inset(0px 0px 0px 0px round 0px)'
            : 'inset(14px 14px 14px 64% round 18px)',
          transition: 'clip-path 0.46s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Collapsed sidebar nav */}
        <BuilderSideNav onExit={exitBuilder} activePanel={builderPanel} onPanelChange={p => setBuilderPanel(p as 'chat' | 'components')} />

        {/* Left panel — chat or component picker */}
        <div
          className="w-[400px] shrink-0 flex flex-col min-h-0 bg-white overflow-hidden"
          style={{
            opacity: builderVisible ? 1 : 0,
            transform: builderVisible ? 'translateX(0)' : 'translateX(12px)',
            transition: 'opacity 0.3s 0.18s cubic-bezier(0.16,1,0.3,1), transform 0.4s 0.16s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {builderPanel === 'components' ? (
            <BuilderComponentPicker onClose={() => setBuilderPanel('chat')} />
          ) : (
            <>
              {/* Thread header */}
              <div className="shrink-0 h-[52px] flex items-center gap-2 px-4">
                <span className="text-sm font-semibold text-[#191b1f] flex-1 truncate">Home page</span>
              </div>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                  <p className="text-sm text-[#191b1f] leading-[22px]">
                    Here&apos;s your <strong className="font-semibold">Home page</strong> open in the visual editor. Click any section on the canvas to select and edit it. I can help you make changes — just describe what you&apos;d like.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="bg-[#f7f9fa] rounded-[14px] px-4 py-2.5 max-w-[85%]">
                    <p className="text-sm text-[#191b1f]">Can you make the hero headline shorter and more punchy?</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                  <p className="text-sm text-[#191b1f] leading-[22px]">
                    Done! I&apos;ve updated the hero to: <em>&quot;Connect. Learn. Grow.&quot;</em> — short, action-oriented, and memorable. The subtext stays as-is. Want to try a different direction?
                  </p>
                </div>
              </div>
              {/* Input */}
              <div className="shrink-0 px-4 pb-4 pt-2">
                <AgentMessageBox placeholder="Describe a change…" onSubmit={handleChatSubmit} isGenerating={isGenerating} onStop={handleStop} />
              </div>
            </>
          )}
        </div>

        {/* Builder canvas */}
        <div
          className="flex-1 min-w-0 flex flex-col min-h-0"
          style={{
            opacity: builderVisible ? 1 : 0,
            transform: builderVisible ? 'translateX(0)' : 'translateX(20px)',
            transition: 'opacity 0.35s 0.22s cubic-bezier(0.16,1,0.3,1), transform 0.45s 0.2s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <BuilderCanvas />
        </div>
      </div>
    )}
    </>
  );
};

export default CopilotView;
