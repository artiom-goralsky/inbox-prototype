import React, { useState } from 'react';
import { Button } from '@circleco/compass/components/Button';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Tabs } from '@circleco/compass/components/Tabs';
import { Icon } from '@circleco/compass/components/Icon';
import { Menu } from '@circleco/compass/components/Menu';
import type { AssetItem } from '../shared/AssetDetailSidebar';
import ProjectDetailView from './ProjectDetailView';
import LaunchProjectView from './LaunchProjectView';
import { type LaunchProjectData, type LaunchPlanStep, buildLaunchProject } from './launchProjectData';

const AVATAR_1 = '/images/avatars/1.png';
const AVATAR_2 = '/images/avatars/4.png';
const AVATAR_3 = '/images/avatars/6.png';
const AVATAR_CLARA = '/images/avatars/3.png';
const AVATAR_MAYA = '/images/avatars/5.png';
const AI_AVATAR = '/ai-avatar.png';

type ProjectStatus = 'active' | 'completed';

export interface Project {
  id: string;
  emoji: string;
  title: string;
  description: string;
  status: ProjectStatus;
  agents: { name: string; avatar: string }[];
  chats: number;
  artifacts: number;
  lastActive: string;
}

const PROJECTS: Project[] = [
  {
    id: 'launch-community',
    emoji: '🚀',
    title: 'Launch your community',
    description: 'Coordinate the launch and initial setup for your community.',
    status: 'active',
    agents: [{ name: 'Agent 1', avatar: AVATAR_1 }, { name: 'Agent 2', avatar: AVATAR_3 }],
    chats: 6,
    artifacts: 1,
    lastActive: 'Yesterday',
  },
  {
    id: '2',
    emoji: '📊',
    title: 'Churn Reduction Initiative',
    description: 'Analyze churn patterns and implement retention strategies.',
    status: 'active',
    agents: [{ name: 'Agent 1', avatar: '/images/avatars/3.png' }, { name: 'Agent 2', avatar: '/images/avatars/5.png' }, { name: 'Agent 3', avatar: '/images/avatars/7.png' }],
    chats: 9,
    artifacts: 5,
    lastActive: '2d ago',
  },
  {
    id: '3',
    emoji: '✉️',
    title: 'Welcome Email Redesign',
    description: 'Redesign the welcome email sequence to improve open rates.',
    status: 'completed',
    agents: [{ name: 'Agent 1', avatar: '/images/avatars/2.png' }, { name: 'Agent 2', avatar: '/images/avatars/4.png' }],
    chats: 0,
    artifacts: 0,
    lastActive: '5d ago',
  },
];

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

function filterProjects(projects: Project[], tab: string): Project[] {
  if (tab === 'active') return projects.filter(p => p.status === 'active');
  if (tab === 'completed') return projects.filter(p => p.status === 'completed');
  return projects;
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => (
  <div
    onClick={onClick}
    className="flex-1 min-w-[280px] max-w-[420px] bg-primary rounded-lg p-5 flex flex-col gap-4 cursor-pointer hover:shadow-[0px_4px_20px_-8px_rgba(0,0,0,0.14),0px_3px_12px_-4px_rgba(0,0,0,0.1),0px_0px_0px_1px_rgba(0,0,0,0.04)] transition-shadow"
    style={{ boxShadow: '0px 4px 16px -8px rgba(0,0,0,0.1), 0px 3px 12px -4px rgba(0,0,0,0.1), 0px 0px 0px 1px rgba(0,0,0,0.04)' }}
  >
    {/* Title + description */}
    <div className="flex flex-col gap-2">
      <Typography variant="label-md" color="primary">
        <span className="font-semibold">{project.title}</span>
      </Typography>
      <Typography variant="body-sm" color="secondary">
        <span className="line-clamp-2">{project.description}</span>
      </Typography>
    </div>
    {/* Bottom row: chats, last active, pin */}
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Icon name="message" size="sm" className="text-tertiary" />
        <Typography variant="body-sm" color="tertiary">{project.chats} chats</Typography>
      </div>
      <div className="flex items-center gap-2 flex-1">
        <Icon name="clock-dash" size="sm" className="text-tertiary" />
        <Typography variant="body-sm" color="tertiary">{project.lastActive}</Typography>
      </div>
      <div onClick={e => e.stopPropagation()}>
        <Menu
          options={[
            { label: 'Edit project', icon: 'pencil', onClick: () => {} },
            { label: 'Delete project', icon: 'trash-can', onClick: () => {}, danger: true },
          ]}
          trigger={<IconButton variant="ghost" size="sm" icon="dot-menu" aria-label="More options" />}
          side="bottom"
          align="end"
          sideOffset={4}
        />
      </div>
    </div>
  </div>
);

interface ProjectsPageProps {
  onItemClick?: (item: AssetItem) => void;
  pendingProjectTitle?: string | null;
  onClearPendingProject?: () => void;
  launchProject?: LaunchProjectData | null;
  onClearLaunchProject?: () => void;
  onOpenCopilot?: () => void;
  onNewChat?: () => void;
  onOpenChat?: (chatId: string, title: string, messages: { role: 'user' | 'assistant'; content: string }[]) => void;
  onEntryPointChange?: (label: string) => void;
  shimmerProgress?: boolean;
  projectStepsOverride?: LaunchPlanStep[] | null;
}

const SHORTCUT_TASKS: Record<string, string[]> = {
  'Create my spaces and community structure': [
    'Decide on your top-level space categories',
    'Create your first 3–5 spaces',
    'Set visibility and permissions for each space',
    'Add descriptions and cover images',
    'Organize navigation order',
  ],
  'Configure access groups and permissions': [
    'Map out your membership tiers',
    'Create access groups for each tier',
    'Assign spaces to the right access groups',
    'Test member visibility for each group',
    'Document your access group structure',
  ],
  'Set up my custom domain and branding': [
    'Choose your custom domain name',
    'Configure DNS settings',
    'Upload your logo and favicon',
    'Set brand colors and typography',
    'Customize your email templates',
  ],
  'Invite and onboard my first members': [
    'Create your invite link',
    'Write a welcome message',
    'Invite your first 10 founding members',
    'Set up an introductions space',
    'Send a personal welcome DM to each member',
  ],
  'Set up my paywall and pricing tiers': [
    'Connect your Stripe account',
    'Define your pricing tiers',
    'Create paywall plans in Circle',
    'Assign access groups to each plan',
    'Test the checkout flow end to end',
  ],
  'Build a course with lessons and modules': [
    'Outline your course curriculum',
    'Create the course space and modules',
    'Write or record your first 3 lessons',
    'Set up drip schedule and prerequisites',
    'Add a completion certificate',
  ],
  'Build a growth strategy for my community': [
    'Audit your current growth channels',
    'Identify your ideal member profile',
    'Set growth goals for the next 90 days',
    'Plan 3 acquisition experiments',
    'Set up tracking for key growth metrics',
  ],
};

function getTasksForTitle(title: string): string[] {
  if (SHORTCUT_TASKS[title]) return SHORTCUT_TASKS[title];
  return [
    `Research best practices for: ${title}`,
    'Define goals and success metrics',
    'Create an action plan with milestones',
    'Execute the first step',
    'Review progress and iterate',
  ];
}

/* ── New Project Modal — template categories ─────────────────────── */

interface TemplateItem {
  title: string;
  description: string;
}

interface TemplateCategory {
  label: string;
  emoji: string;
  items: TemplateItem[];
}

const PROJECT_TEMPLATES: TemplateCategory[] = [
  {
    label: 'Launch & Setup',
    emoji: '🚀',
    items: [
      { title: 'Community Launch Planner', description: 'Plan and execute a successful community launch from scratch.' },
      { title: 'Course Business Setup', description: 'Set up your course infrastructure, pricing, and student experience.' },
      { title: 'Membership Community Setup', description: 'Configure membership tiers, access groups, and onboarding flows.' },
      { title: 'Platform Migration', description: 'Migrate your community from another platform with zero data loss.' },
      { title: 'Custom Domain & Branding', description: 'Set up your custom domain, logo, colors, and branded experience.' },
      { title: 'Access Groups & Permissions Architect', description: 'Design and implement your access control structure.' },
      { title: 'Community Template Kickstart', description: 'Start from a proven community template and customize it.' },
    ],
  },
  {
    label: 'Member Growth',
    emoji: '👥',
    items: [
      { title: 'Member Onboarding Optimizer', description: 'Improve activation rates with a better onboarding experience.' },
      { title: 'Growth Campaign', description: 'Plan and run acquisition campaigns to grow your member base.' },
      { title: 'Churn Reduction Initiative', description: 'Analyze churn patterns and implement retention strategies.' },
      { title: 'Engagement Boost Sprint', description: 'Run a focused sprint to increase member engagement metrics.' },
      { title: 'Referral & Affiliate Program', description: 'Set up a referral system to turn members into advocates.' },
      { title: 'Member Segmentation & Targeting', description: 'Segment your audience for personalized outreach and content.' },
    ],
  },
  {
    label: 'Monetization',
    emoji: '💰',
    items: [
      { title: 'Pricing Strategy & Setup', description: 'Define your pricing model and configure payment plans.' },
      { title: 'Revenue Growth Playbook', description: 'Identify and execute revenue growth opportunities.' },
      { title: 'Sponsorship & Partnerships', description: 'Build a sponsorship pipeline and manage partner relationships.' },
      { title: 'Subscription Billing & Invoicing', description: 'Set up recurring billing, invoices, and payment workflows.' },
    ],
  },
  {
    label: 'Content & Events',
    emoji: '📚',
    items: [
      { title: 'Content Strategy & Calendar', description: 'Build a content calendar and publishing workflow.' },
      { title: 'Course Launch', description: 'Plan, create, and launch a new course with marketing.' },
      { title: 'Event Series Setup', description: 'Set up recurring events, registrations, and reminders.' },
      { title: 'Welcome Email Redesign', description: 'Redesign your welcome email sequence for better engagement.' },
    ],
  },
  {
    label: 'Operations',
    emoji: '⚙️',
    items: [
      { title: 'Automation & Workflow Builder', description: 'Automate repetitive tasks with custom workflows.' },
      { title: 'Community Health Audit', description: 'Run a comprehensive audit of your community health metrics.' },
      { title: 'Moderation & Safety Setup', description: 'Configure moderation rules, filters, and safety policies.' },
      { title: 'Team Handoff & Admin Training', description: 'Document processes and train your team on operations.' },
    ],
  },
  {
    label: 'Strategy',
    emoji: '🧠',
    items: [
      { title: 'Business Model & Pricing Review', description: 'Review and optimize your business model and pricing.' },
      { title: 'Community Restructure', description: 'Reorganize your community architecture for scale.' },
      { title: 'Scaling Readiness Assessment', description: 'Assess whether your community is ready to scale.' },
    ],
  },
];

interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreateBlank: (prompt: string) => void;
  onSelectTemplate: (title: string) => void;
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({
  open,
  onClose,
  onCreateBlank,
  onSelectTemplate,
}) => {
  const [prompt, setPrompt] = useState('');

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      {/* Outer — bg-secondary with rounded + shadow */}
      <div
        className="bg-secondary rounded-2xl p-1 w-full max-w-[720px] max-h-[85vh] flex flex-col"
        style={{ boxShadow: '0px 8px 10px -6px rgba(0,0,0,0.1), 0px 20px 25px -5px rgba(0,0,0,0.1)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Inner card */}
        <div className="bg-primary rounded-xl flex flex-col flex-1 min-h-0 overflow-hidden" style={{ boxShadow: '0px 1px 4px 0px rgba(0,0,0,0.03)' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
            <Typography variant="heading-md" color="primary">
              <span className="font-semibold">What do you want to accomplish?</span>
            </Typography>
            <IconButton variant="ghost" size="sm" icon="cross" aria-label="Close" onClick={onClose} />
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-10">
            {/* Message box */}
            <div className="relative">
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe your project goal..."
                rows={3}
                className="w-full rounded-2xl border border-[#E4E7EB] px-4 py-3 text-base text-primary placeholder:text-[#545861] resize-none focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent shadow-2xs min-h-[131px]"
              />
              <div className="absolute bottom-3 right-3">
                <IconButton
                  variant="primary"
                  size="sm"
                  icon="arrow-up"
                  aria-label="Create project"
                  onClick={() => { if (prompt.trim()) onCreateBlank(prompt.trim()); }}
                />
              </div>
            </div>

            {/* Template sections */}
            {PROJECT_TEMPLATES.map(category => (
              <div key={category.label} className="flex flex-col gap-3">
                <Typography variant="label-sm" color="tertiary">
                  <span className="font-semibold flex items-center gap-1.5"><span>{category.emoji}</span> {category.label}</span>
                </Typography>
                <div className="flex flex-col gap-2">
                  {category.items.map(item => (
                    <button
                      key={item.title}
                      onClick={() => onSelectTemplate(item.title)}
                      className="text-left rounded-lg border border-secondary px-4 py-3 hover:bg-hover transition-colors cursor-pointer bg-primary flex items-center gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <Typography variant="label-sm" color="primary">
                          <span className="font-medium">{item.title}</span>
                        </Typography>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectsPage: React.FC<ProjectsPageProps> = ({
  onItemClick,
  pendingProjectTitle,
  onClearPendingProject,
  launchProject,
  onClearLaunchProject,
  onOpenCopilot,
  onNewChat,
  onOpenChat,
  onEntryPointChange,
  shimmerProgress,
  projectStepsOverride,
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showDemoLaunchProject, setShowDemoLaunchProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(() => {
    if (pendingProjectTitle) {
      return {
        id: 'pending',
        emoji: '✨',
        title: pendingProjectTitle,
        description: `A new project created from your dashboard shortcut.`,
        status: 'active' as ProjectStatus,
        agents: [
          { name: 'Agent 1', avatar: AVATAR_1 },
          { name: 'Agent 2', avatar: AVATAR_2 },
        ],
        chats: 0,
        artifacts: 0,
        lastActive: 'Just now',
      };
    }
    return null;
  });

  // Clear pending on mount
  React.useEffect(() => {
    if (pendingProjectTitle) {
      onClearPendingProject?.();
    }
  }, []);

  const createProjectFromTitle = (title: string) => {
    setShowNewProjectModal(false);
    setSelectedProject({
      id: 'pending',
      emoji: '✨',
      title,
      description: `A new project created from a template.`,
      status: 'active' as ProjectStatus,
      agents: [
        { name: 'Clara', avatar: AVATAR_CLARA },
        { name: 'Maya', avatar: AVATAR_MAYA },
      ],
      chats: 0,
      artifacts: 0,
      lastActive: 'Just now',
    });
  };

  // Launch project takes priority
  if (launchProject) {
    return (
      <LaunchProjectView
        project={projectStepsOverride ? { ...launchProject, steps: projectStepsOverride } : launchProject}
        shimmerProgress={shimmerProgress}
        onBack={() => onClearLaunchProject?.()}
        onNewConversation={onNewChat}
        onOpenChat={onOpenChat}
        onEntryPointChange={onEntryPointChange}
      />
    );
  }

  // Demo "Launch your community" project — uses the new layout
  if (showDemoLaunchProject) {
    const demoProject = buildLaunchProject('course', [
      'Small but growing — under 500',
      'Yes — paid from day one',
      'Set up my structure and launch',
    ]);
    const displayProject = projectStepsOverride
      ? { ...demoProject, steps: projectStepsOverride }
      : demoProject;
    return (
      <LaunchProjectView
        project={displayProject}
        shimmerProgress={shimmerProgress}
        onBack={() => setShowDemoLaunchProject(false)}
        onNewConversation={onNewChat}
        onOpenChat={onOpenChat}
        onEntryPointChange={onEntryPointChange}
      />
    );
  }

  if (selectedProject) {
    const customTasks = selectedProject.id === 'pending'
      ? getTasksForTitle(selectedProject.title).map(label => ({ label, done: false }))
      : undefined;
    return (
      <ProjectDetailView
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
        customTasks={customTasks}
        onNewChat={onNewChat}
        onOpenChat={onOpenChat}
      />
    );
  }

  const filtered = filterProjects(PROJECTS, activeTab);

  return (
    <div className="bg-primary h-full overflow-auto px-16">
      <div className="w-full max-w-[1280px] mx-auto pt-16 pb-10 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Typography color="primary" component="h1" variant="heading-2xl">
              Projects
            </Typography>
          </div>
          <Button variant="primary" size="md" startIcon="plus" onClick={() => setShowNewProjectModal(true)}>
            New project
          </Button>
        </div>

        {/* Tabs */}
        <Tabs.Root
          tabs={TABS}
          selectedValue={activeTab}
          onValueChange={setActiveTab}
        >
          <></>
        </Tabs.Root>

        {/* Content */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <Typography variant="body-md" color="tertiary">
              No projects found.
            </Typography>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {filtered.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => {
                  if (project.id === 'launch-community') {
                    setShowDemoLaunchProject(true);
                  } else {
                    setSelectedProject(project);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

      <NewProjectModal
        open={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onCreateBlank={createProjectFromTitle}
        onSelectTemplate={createProjectFromTitle}
      />
    </div>
  );
};

export default ProjectsPage;
