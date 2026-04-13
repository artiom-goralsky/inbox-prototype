import React, { useState, useRef, useEffect } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Icon, type IconName } from '@circleco/compass/components/Icon';
import { Badge } from '@circleco/compass/components/Badge';
import { Button } from '@circleco/compass/components/Button';
import { TextInput } from '@circleco/compass/components/TextInput';
import type { AssetItem } from '../shared/AssetDetailSidebar';

interface AgentSkill {
  name: string;
  mode: 'Operator' | 'Strategist';
  phase: 1 | 2 | 3;
  description: string;
}

interface AgentGroup {
  title: string;
  icon: IconName;
  skills: AgentSkill[];
}

const AGENT_GROUPS: AgentGroup[] = [
  {
    title: 'Community Setup',
    icon: 'layout-grid',
    skills: [
      { name: 'Space Scaffolder', mode: 'Operator', phase: 1, description: 'Creates your initial community structure based on your type and audience' },
      { name: 'Access Group Builder', mode: 'Operator', phase: 1, description: 'Controls which members see which spaces with access groups' },
      { name: 'Community Restructurer', mode: 'Operator', phase: 1, description: 'Audits and reorganizes your existing space structure' },
      { name: 'Landing Page Configurator', mode: 'Operator', phase: 1, description: 'Configures default landing pages and navigation order' },
      { name: 'Architecture Advisor', mode: 'Strategist', phase: 1, description: 'Recommends community architecture based on successful patterns' },
      { name: 'Multi-Community Manager', mode: 'Strategist', phase: 2, description: 'Advises on chapter-based and multi-community models' },
      { name: 'Template Applier', mode: 'Operator', phase: 2, description: 'Scaffolds entire community from pre-built templates' },
      { name: 'Domain Configurator', mode: 'Operator', phase: 2, description: 'Sets up custom domains and diagnoses DNS issues' },
      { name: 'Community Auditor', mode: 'Strategist', phase: 3, description: 'Runs comprehensive health audits with actionable recommendations' },
    ],
  },
  {
    title: 'Member Management',
    icon: 'group',
    skills: [
      { name: 'Member Inviter', mode: 'Operator', phase: 1, description: 'Creates invite links, bulk invites, and configures welcome messages' },
      { name: 'Member Tagger', mode: 'Operator', phase: 1, description: 'Creates tags and segments members for targeting' },
      { name: 'Role Manager', mode: 'Operator', phase: 1, description: 'Grants or revokes admin, moderator, and custom roles' },
      { name: 'Bulk Member Operator', mode: 'Operator', phase: 1, description: 'Handles CSV imports, bulk moves, and data exports' },
      { name: 'Onboarding Designer', mode: 'Strategist', phase: 2, description: 'Designs the complete new member experience journey' },
      { name: 'Migration Helper', mode: 'Operator', phase: 2, description: 'Guides member migration from other platforms' },
      { name: 'Member Health Monitor', mode: 'Strategist', phase: 2, description: 'Identifies at-risk members and suggests re-engagement' },
      { name: 'Account Support', mode: 'Operator', phase: 2, description: 'Handles password resets, email updates, and account issues' },
      { name: 'Member Router', mode: 'Operator', phase: 3, description: 'Auto-assigns new members to spaces and groups based on profile' },
    ],
  },
  {
    title: 'Content & Courses',
    icon: 'file',
    skills: [
      { name: 'Post Creator', mode: 'Operator', phase: 1, description: 'Creates, schedules, and manages posts with rich content' },
      { name: 'Course Builder', mode: 'Operator', phase: 1, description: 'Structures courses with lessons, drip schedules, and tracking' },
      { name: 'Content Scheduler', mode: 'Operator', phase: 1, description: 'Plans and batch-schedules content across spaces' },
      { name: 'Content Strategist', mode: 'Strategist', phase: 2, description: 'Recommends content types and topics based on engagement data' },
      { name: 'Form Builder', mode: 'Operator', phase: 2, description: 'Creates forms with custom fields and post-submit actions' },
      { name: 'Media Manager', mode: 'Operator', phase: 2, description: 'Helps with video uploads, image specs, and media management' },
      { name: 'Event Manager', mode: 'Operator', phase: 2, description: 'Creates events, configures live rooms, and manages recordings' },
      { name: 'Content Generator', mode: 'Operator', phase: 2, description: 'Generates discussion prompts, welcome messages, and email copy' },
      { name: 'Course Analytics', mode: 'Strategist', phase: 3, description: 'Tracks completion rates and identifies lesson drop-off points' },
    ],
  },
  {
    title: 'Monetization',
    icon: 'money-hand',
    skills: [
      { name: 'Paywall Configurator', mode: 'Operator', phase: 1, description: 'Connects Stripe, creates pricing tiers, and configures paywalls' },
      { name: 'Promotion Manager', mode: 'Operator', phase: 1, description: 'Creates coupon codes and manages promotional offers' },
      { name: 'Subscription Manager', mode: 'Operator', phase: 1, description: 'Handles cancellations, refunds, and failed payments' },
      { name: 'Pricing Strategist', mode: 'Strategist', phase: 2, description: 'Guides pricing decisions with benchmarks from similar communities' },
      { name: 'Revenue Analyst', mode: 'Strategist', phase: 2, description: 'Shows MRR, churn rate, LTV, and forecasts growth' },
      { name: 'Affiliate Manager', mode: 'Operator', phase: 2, description: 'Configures referral programs and tracks affiliate performance' },
      { name: 'Plan Advisor', mode: 'Operator', phase: 2, description: 'Explains plan limits and recommends plan changes' },
      { name: 'Pricing Optimizer', mode: 'Strategist', phase: 3, description: 'Analyzes performance data to recommend pricing changes' },
    ],
  },
  {
    title: 'Engagement & Retention',
    icon: 'heart',
    skills: [
      { name: 'Gamification Builder', mode: 'Operator', phase: 1, description: 'Configures points, badges, leaderboards, and reward tiers' },
      { name: 'Notification Manager', mode: 'Operator', phase: 1, description: 'Configures email notifications, digests, and automated sequences' },
      { name: 'Chat Manager', mode: 'Operator', phase: 2, description: 'Manages DM permissions, chat spaces, and bulk messaging' },
      { name: 'Engagement Strategist', mode: 'Strategist', phase: 2, description: 'Analyzes patterns and recommends tactics to reduce lurking' },
      { name: 'Re-engagement Builder', mode: 'Operator', phase: 2, description: 'Creates personalized win-back campaigns for inactive members' },
      { name: 'Event Engagement Advisor', mode: 'Strategist', phase: 2, description: 'Optimizes live event attendance and engagement' },
      { name: 'Churn Predictor', mode: 'Strategist', phase: 3, description: 'Predicts churn risk with suggested interventions' },
      { name: 'Milestone Celebrator', mode: 'Operator', phase: 3, description: 'Auto-celebrates member achievements to boost belonging' },
    ],
  },
  {
    title: 'Automation',
    icon: 'zap',
    skills: [
      { name: 'Workflow Builder', mode: 'Operator', phase: 1, description: 'Creates automated workflows from natural language descriptions' },
      { name: 'Integration Connector', mode: 'Operator', phase: 1, description: 'Guides Zapier, webhook, and SSO setup and troubleshooting' },
      { name: 'Workflow Templates', mode: 'Operator', phase: 2, description: 'Deploys pre-built automation templates for common scenarios' },
      { name: 'Bulk Operator', mode: 'Operator', phase: 2, description: 'Executes one-time bulk operations like mass tagging' },
      { name: 'Automation Strategist', mode: 'Strategist', phase: 2, description: 'Audits manual processes and recommends what to automate' },
      { name: 'Workflow Debugger', mode: 'Operator', phase: 3, description: 'Analyzes workflow logs and diagnoses why automations fail' },
      { name: 'Data Sync Manager', mode: 'Operator', phase: 3, description: 'Configures bi-directional data sync with external platforms' },
    ],
  },
  {
    title: 'Analytics',
    icon: 'chart-square',
    skills: [
      { name: 'Dashboard Briefer', mode: 'Strategist', phase: 1, description: 'Generates natural-language summaries of key community metrics' },
      { name: 'Data Q&A', mode: 'Strategist', phase: 1, description: 'Answers natural language questions about your community data' },
      { name: 'Engagement Analyst', mode: 'Strategist', phase: 2, description: 'Provides deep engagement analysis with DAU/MAU and heatmaps' },
      { name: 'Growth Analyst', mode: 'Strategist', phase: 2, description: 'Tracks growth rate, signup sources, and forecasts members' },
      { name: 'Content Analyst', mode: 'Strategist', phase: 2, description: 'Ranks content by performance and identifies winning patterns' },
      { name: 'Report Generator', mode: 'Strategist', phase: 3, description: 'Creates formatted reports exportable for stakeholders' },
      { name: 'Benchmark Advisor', mode: 'Strategist', phase: 3, description: 'Compares your metrics against anonymized community benchmarks' },
    ],
  },
  {
    title: 'Branding',
    icon: 'pencil',
    skills: [
      { name: 'Brand Configurator', mode: 'Operator', phase: 1, description: 'Configures logo, colors, header image, and email templates' },
      { name: 'Email Customizer', mode: 'Operator', phase: 1, description: 'Customizes automated email templates to match brand voice' },
      { name: 'App Launch Advisor', mode: 'Strategist', phase: 2, description: 'Guides the branded mobile app submission process' },
      { name: 'Profile Customizer', mode: 'Operator', phase: 2, description: 'Creates and manages custom member profile fields' },
      { name: 'SEO Configurator', mode: 'Operator', phase: 3, description: 'Optimizes community for search engines and social sharing' },
    ],
  },
  {
    title: 'Growth',
    icon: 'target',
    skills: [
      { name: 'Launch Strategist', mode: 'Strategist', phase: 1, description: 'Creates a personalized launch plan with timeline and milestones' },
      { name: 'Growth Advisor', mode: 'Strategist', phase: 2, description: 'Recommends growth channels based on your existing audience' },
      { name: 'Referral Designer', mode: 'Strategist', phase: 2, description: 'Designs referral incentive programs tailored to your community' },
      { name: 'Audience Advisor', mode: 'Strategist', phase: 2, description: 'Helps develop audience strategy from scratch' },
      { name: 'Partnership Strategist', mode: 'Strategist', phase: 3, description: 'Advises on partnership models for cross-community growth' },
      { name: 'Funnel Optimizer', mode: 'Strategist', phase: 3, description: 'Analyzes and optimizes the free-to-paid conversion funnel' },
    ],
  },
  {
    title: 'Business Strategy',
    icon: 'compass',
    skills: [
      { name: 'Business Model Advisor', mode: 'Strategist', phase: 1, description: 'Guides fundamental business model and monetization decisions' },
      { name: 'Operations Advisor', mode: 'Strategist', phase: 2, description: 'Helps solo founders scale operations without burning out' },
      { name: 'Value Designer', mode: 'Strategist', phase: 2, description: 'Defines your community value proposition and member journey' },
      { name: 'Industry Advisor', mode: 'Strategist', phase: 2, description: 'Provides anonymized benchmarks and industry insights' },
      { name: 'Revenue Strategist', mode: 'Strategist', phase: 3, description: 'Analyzes revenue opportunities and designs the revenue ladder' },
      { name: 'Agent Strategy Advisor', mode: 'Strategist', phase: 3, description: 'Advises on setting up member-facing AI agents' },
    ],
  },
  {
    title: 'Support',
    icon: 'circle-info',
    skills: [
      { name: 'Help Answerer', mode: 'Operator', phase: 1, description: 'Answers product questions with step-by-step instructions' },
      { name: 'Login Troubleshooter', mode: 'Operator', phase: 1, description: 'Diagnoses login issues and resolves account access problems' },
      { name: 'Billing Troubleshooter', mode: 'Operator', phase: 1, description: 'Resolves failed payments, generates invoices, and processes refunds' },
      { name: 'Feature Router', mode: 'Operator', phase: 2, description: 'Suggests workarounds and routes feature requests' },
      { name: 'Support Router', mode: 'Operator', phase: 2, description: 'Escalates to Circle support with full context when needed' },
      { name: 'Diagnostics Runner', mode: 'Operator', phase: 3, description: 'Checks system health and diagnoses common issues' },
    ],
  },
  {
    title: 'Moderation',
    icon: 'lock',
    skills: [
      { name: 'Moderation Configurator', mode: 'Operator', phase: 1, description: 'Configures approval queues, auto-moderation, and banned words' },
      { name: 'Member Action Manager', mode: 'Operator', phase: 2, description: 'Handles warnings, mutes, bans, and content removal' },
      { name: 'Guidelines Generator', mode: 'Strategist', phase: 2, description: 'Generates community guidelines customized to your type' },
      { name: 'Auto-Moderator', mode: 'Operator', phase: 3, description: 'Automatically detects and flags spam and violations' },
      { name: 'Safety Monitor', mode: 'Strategist', phase: 3, description: 'Tracks moderation trends and community sentiment' },
    ],
  },
];

const SKILL_CAPABILITIES: Record<string, string[]> = {
  'Space Scaffolder': ['Create spaces from templates', 'Organize by topic, cohort, or access level', 'Set default permissions and visibility', 'Bulk-create nested space hierarchies'],
  'Access Group Builder': ['Create and manage access groups', 'Assign members to spaces based on rules', 'Configure tiered access levels', 'Audit current access configurations'],
  'Community Restructurer': ['Analyze current space usage and engagement', 'Recommend consolidation or expansion', 'Safely merge or archive underused spaces', 'Preserve content during reorganization'],
  'Landing Page Configurator': ['Set community and space landing pages', 'Configure navigation order and visibility', 'Customize the member-facing homepage', 'A/B test different landing configurations'],
  'Architecture Advisor': ['Analyze successful community structures', 'Recommend space organization patterns', 'Advise on scaling architecture', 'Review and critique current setup'],
  'Member Inviter': ['Generate shareable invite links', 'Send bulk email invitations', 'Configure welcome messages', 'Track invitation acceptance rates'],
  'Post Creator': ['Draft and publish rich-text posts', 'Schedule posts across multiple spaces', 'Add polls, embeds, and media', 'Manage post visibility and pinning'],
  'Course Builder': ['Structure multi-module courses', 'Set up drip schedules and prerequisites', 'Configure completion tracking', 'Create quizzes and assignments'],
  'Paywall Configurator': ['Connect and configure Stripe', 'Create pricing tiers and plans', 'Set up free trials and grace periods', 'Configure paywall placement on spaces'],
  'Workflow Builder': ['Create automations from natural language', 'Set up triggers and conditional logic', 'Connect multiple actions in sequence', 'Test and debug workflow execution'],
  'Dashboard Briefer': ['Summarize key metrics in plain language', 'Highlight trends and anomalies', 'Compare performance across time periods', 'Generate executive-ready summaries'],
  'Brand Configurator': ['Upload and configure logos and favicons', 'Set brand colors and typography', 'Customize header images and banners', 'Configure email template branding'],
  'Help Answerer': ['Answer product questions instantly', 'Provide step-by-step instructions', 'Link to relevant help articles', 'Escalate complex issues to support'],
  'Moderation Configurator': ['Set up content approval queues', 'Configure auto-moderation rules', 'Manage banned words and filters', 'Define moderation team permissions'],
};

const SKILL_USE_CASES: Record<string, string[]> = {
  'Space Scaffolder': ['"Create a course community with 3 cohorts and a shared lounge"', '"Set up a mastermind group with private and public spaces"', '"Build a SaaS community with feature request and support areas"'],
  'Access Group Builder': ['"Only premium members should see the VIP lounge"', '"Give course students access to their cohort space only"', '"Create a trial group that expires after 14 days"'],
  'Community Restructurer': ['"Which of my spaces have low engagement?"', '"Merge my three overlapping discussion spaces"', '"Archive everything from last year\'s cohort"'],
  'Member Inviter': ['"Send invites to everyone on this CSV list"', '"Create a special invite link for my podcast listeners"', '"Set up a welcome message for new members"'],
  'Post Creator': ['"Draft a welcome post for new members joining this week"', '"Schedule a discussion prompt for every Monday"', '"Create a pinned FAQ post in the support space"'],
  'Course Builder': ['"Create a 6-week course with weekly module unlocks"', '"Add a quiz at the end of each lesson"', '"Set up a certificate for course completers"'],
  'Paywall Configurator': ['"Set up a $29/month membership with a 7-day trial"', '"Create annual pricing with a 20% discount"', '"Add a free tier with limited space access"'],
  'Workflow Builder': ['"When someone joins, send a welcome DM after 24 hours"', '"Auto-tag members based on their signup source"', '"Notify me when a post gets more than 10 comments"'],
  'Dashboard Briefer': ['"How did my community do this week?"', '"What are my top-performing posts this month?"', '"Show me member growth trends for Q1"'],
  'Help Answerer': ['"How do I set up a custom domain?"', '"Why can\'t my members see the new space?"', '"How do I export my member list?"'],
};

const getCapabilities = (skillName: string, description: string): string[] =>
  SKILL_CAPABILITIES[skillName] || [description, 'Automate repetitive tasks in this domain', 'Provide data-driven recommendations', 'Execute actions with your approval'];

const getUseCases = (skillName: string): string[] =>
  SKILL_USE_CASES[skillName] || ['"Help me get started with this"', '"What should I focus on first?"', '"Show me best practices"'];

const getRelatedSkills = (skill: AgentSkill, group: AgentGroup, allGroups: AgentGroup[]): string[] => {
  const sameGroup = group.skills.filter(s => s.name !== skill.name).slice(0, 2).map(s => s.name);
  const otherGroup = allGroups.filter(g => g.title !== group.title).flatMap(g => g.skills).filter(s => s.mode === skill.mode).slice(0, 2).map(s => s.name);
  return [...sameGroup, ...otherGroup].slice(0, 4);
};

interface FlatSkill { skill: AgentSkill; group: AgentGroup; skillId: string }

interface AgentsPageProps {
  onToggleSidebar: () => void;
  onItemClick?: (item: AssetItem) => void;
  onItemClose?: () => void;
  selectedSkillId?: string;
}

const AgentsPage: React.FC<AgentsPageProps> = ({ onItemClick, onItemClose, selectedSkillId }) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  const [enterKey, setEnterKey] = useState(0);
  const pendingFilter = useRef<string>('All');

  const handleFilterChange = (filter: string) => {
    if (filter === activeFilter) return;
    pendingFilter.current = filter;
    setIsExiting(true);
  };

  useEffect(() => {
    if (!isExiting) return;
    const timer = setTimeout(() => {
      setActiveFilter(pendingFilter.current);
      setEnterKey(k => k + 1);
      setIsExiting(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [isExiting]);

  const allSkills: FlatSkill[] = AGENT_GROUPS.flatMap(group =>
    group.skills.map(skill => ({
      skill,
      group,
      skillId: `agent-${skill.name.toLowerCase().replace(/\s+/g, '-')}`,
    }))
  );

  const query = searchQuery.toLowerCase().trim();
  const filtered = allSkills.filter(s => {
    if (activeFilter !== 'All' && s.group.title !== activeFilter) return false;
    if (query && !s.skill.name.toLowerCase().includes(query) && !s.skill.description.toLowerCase().includes(query)) return false;
    return true;
  });

  return (
    <div className="bg-primary h-full overflow-y-auto px-16">
      <div className="w-full max-w-[1280px] mx-auto pt-16 pb-10 flex flex-col gap-8">

        {/* Page header */}
        <div className="flex flex-col gap-5">
          <Typography variant="heading-2xl" color="primary">
            Skills
          </Typography>
          <Typography variant="body-md" color="secondary">
            85 specialized skills across 12 domains to help you build, grow, and manage your community.
          </Typography>
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-1">
            <Button
              variant={activeFilter === 'All' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('All')}
            >
              All skills
            </Button>
            {AGENT_GROUPS.map(group => (
              <Button
                key={group.title}
                variant={activeFilter === group.title ? 'secondary' : 'outline'}
                size="sm"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                startIcon={group.icon as any}
                onClick={() => handleFilterChange(group.title)}
              >
                {group.title}
              </Button>
            ))}
          </div>
        </div>

        {/* Search input */}
        <TextInput
          placeholder="Search for skills..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        {/* Groups with headers */}
        <div
          className={`flex flex-col gap-8 transition-[opacity,transform] ${
            isExiting
              ? 'opacity-0 translate-y-1 duration-100'
              : 'opacity-100 translate-y-0 duration-200'
          }`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
        >
          {(activeFilter === 'All' ? AGENT_GROUPS : AGENT_GROUPS.filter(g => g.title === activeFilter))
            .filter(group => filtered.some(s => s.group.title === group.title))
            .map((group, groupIndex, visibleGroups) => {
            const groupSkills = filtered.filter(s => s.group.title === group.title);
            const groupOffset = visibleGroups.slice(0, groupIndex).reduce(
              (sum, g) => sum + filtered.filter(s => s.group.title === g.title).length, 0
            );
            return (
              <div key={group.title} className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <Icon name={group.icon} size="lg" className="text-primary" />
                  <Typography variant="label-md" color="primary">
                    <span className="font-semibold">{group.title}</span>
                  </Typography>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {groupSkills.map(({ skill, skillId }, cardIndex) => {
                    const isSelected = selectedSkillId === skillId;
                    const staggerIndex = groupOffset + cardIndex;
                    return (
                      <div
                        key={`${enterKey}-${skillId}`}
                        className={`rounded-lg p-5 flex flex-col gap-2 shadow-2xs transition-[border-color,box-shadow,background-color] duration-200 cursor-pointer ${
                          isSelected
                            ? 'border border-[#717680] shadow-[0px_0px_0px_3px_rgba(113,118,128,0.3)] bg-primary'
                            : 'border border-secondary bg-primary hover:shadow-md'
                        }`}
                        style={{
                          opacity: 0,
                          animation: !isExiting
                            ? `skillCardIn 200ms cubic-bezier(0.23, 1, 0.32, 1) ${Math.min(staggerIndex * 30, 360)}ms forwards`
                            : undefined,
                        }}
                        onClick={() => isSelected ? onItemClose?.() : onItemClick?.({
                          id: skillId,
                          title: skill.name,
                          description: skill.description,
                          type: 'agent',
                          agentData: {
                            mode: skill.mode,
                            phase: skill.phase,
                            group: group.title,
                            groupIcon: group.icon,
                            capabilities: getCapabilities(skill.name, skill.description),
                            useCases: getUseCases(skill.name),
                            relatedSkills: getRelatedSkills(skill, group, AGENT_GROUPS),
                          },
                        })}
                      >
                        <div className="flex items-center justify-between">
                          <Icon name={group.icon} size="lg" className="text-primary" />
                          <Badge
                            variant="secondary"
                            label={skill.mode}
                          />
                        </div>
                        <Typography variant="heading-sm" color="primary">
                          {skill.name}
                        </Typography>
                        <Typography variant="body-sm" color="tertiary">
                          {skill.description}
                        </Typography>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AgentsPage;
