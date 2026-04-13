import React, { useState } from 'react';
import { Button } from '@circleco/compass/components/Button';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Tabs } from '@circleco/compass/components/Tabs';
import { Icon } from '@circleco/compass/components/Icon';
import type { AssetItem } from '../shared/AssetDetailSidebar';
import ProjectDetailView from './ProjectDetailView';

const AI_AVATAR = '/ai-avatar.png';
const AVATAR_CLARA = AI_AVATAR;
const AVATAR_DAN = AI_AVATAR;
const AVATAR_MAYA = AI_AVATAR;

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
}

const PROJECTS: Project[] = [
  {
    id: '1',
    emoji: '🚀',
    title: 'Q2 Growth Campaign',
    description:
      'Drive member acquisition and activation through targeted onboarding improvements and outreach campaigns.',
    status: 'active',
    agents: [
      { name: 'Clara', avatar: AVATAR_CLARA },
      { name: 'Dan', avatar: AVATAR_DAN },
      { name: 'Maya', avatar: AVATAR_MAYA },
    ],
    chats: 14,
    artifacts: 8,
  },
  {
    id: '2',
    emoji: '📊',
    title: 'Churn Reduction Initiative',
    description:
      'Analyze churn patterns and implement retention strategies to reduce monthly churn below 5%.',
    status: 'active',
    agents: [
      { name: 'Dan', avatar: AVATAR_DAN },
      { name: 'Clara', avatar: AVATAR_CLARA },
    ],
    chats: 9,
    artifacts: 5,
  },
  {
    id: '3',
    emoji: '✉️',
    title: 'Welcome Email Redesign',
    description:
      'Redesign the welcome email sequence to improve open rates and first-week engagement.',
    status: 'completed',
    agents: [
      { name: 'Clara', avatar: AVATAR_CLARA },
      { name: 'Maya', avatar: AVATAR_MAYA },
    ],
    chats: 6,
    artifacts: 3,
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
    className="bg-primary border border-secondary rounded-xl p-5 flex flex-col gap-4 cursor-pointer hover:shadow-[0px_2px_8px_-2px_rgba(0,0,0,0.08)] transition-shadow"
  >
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center">
        {project.agents.map((agent, i) => (
          <div key={agent.name} className={`rounded-full${i > 0 ? ' -ml-2' : ''}`}>
            <img src={agent.avatar} alt={agent.name} className="w-[22px] h-[22px] rounded-full" />
          </div>
        ))}
      </div>
      <IconButton
        variant="ghost"
        size="sm"
        icon="dot-menu"
        aria-label="More options"
        onClick={e => e.stopPropagation()}
      />
    </div>
    <div className="flex flex-col gap-1 flex-1">
      <Typography variant="label-md" color="primary">
        <span className="font-semibold line-clamp-1">{project.title}</span>
      </Typography>
      <Typography variant="body-sm" color="tertiary">
        <span className="line-clamp-2">{project.description}</span>
      </Typography>
    </div>
  </div>
);

interface ProjectsPageProps {
  onItemClick?: (item: AssetItem) => void;
  pendingProjectTitle?: string | null;
  onClearPendingProject?: () => void;
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
      <div
        className="bg-primary rounded-2xl shadow-2xl w-full max-w-[720px] max-h-[85vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0 shrink-0">
          <div />
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors text-tertiary"
            aria-label="Close"
          >
            <Icon name="x" size="sm" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Avatars */}
          <div className="flex justify-center mt-2 mb-4">
            <div className="flex items-center">
              <div className="rounded-full"><img src={AI_AVATAR} alt="Clara" className="w-[22px] h-[22px] rounded-full" /></div>
              <div className="rounded-full -ml-3"><img src={AI_AVATAR} alt="Dan" className="w-[22px] h-[22px] rounded-full" /></div>
              <div className="rounded-full -ml-3"><img src={AI_AVATAR} alt="Maya" className="w-[22px] h-[22px] rounded-full" /></div>
            </div>
          </div>

          {/* Prompt */}
          <Typography variant="heading-md" color="primary" className="mb-5">
            <span className="text-center font-semibold block">{`What should your project accomplish?`}</span>
          </Typography>

          {/* Text area */}
          <div className="relative mb-8">
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe your project goal..."
              rows={3}
              className="w-full rounded-xl border border-tertiary px-4 py-3 text-[15px] text-primary placeholder:text-disabled resize-none focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
            />
            <div className="absolute bottom-3 right-3">
              <IconButton
                variant="primary"
                size="md"
                icon="arrow-up"
                aria-label="Create project"
                onClick={() => {
                  if (prompt.trim()) onCreateBlank(prompt.trim());
                }}
              />
            </div>
          </div>

          {/* Templates header */}
          <div className="flex items-center gap-2 mb-4">
            <Icon name="sparkle" size="sm" className="text-tertiary" />
            <Typography variant="label-sm" color="secondary">
              <span className="font-medium">Or start from a template</span>
            </Typography>
          </div>

          {/* Template categories */}
          <div className="flex flex-col gap-6">
            {PROJECT_TEMPLATES.map(category => (
              <div key={category.label} className="flex flex-col gap-2">
                <Typography variant="label-sm" color="tertiary">
                  <span className="font-semibold flex items-center gap-1.5"><span>{category.emoji}</span> {category.label}
                  <span className="text-disabled font-normal ml-1">({category.items.length})</span></span>
                </Typography>
                <div className="grid grid-cols-2 gap-2">
                  {category.items.map(item => (
                    <button
                      key={item.title}
                      onClick={() => onSelectTemplate(item.title)}
                      className="text-left rounded-xl border border-secondary p-4 hover:shadow-[0px_2px_8px_-2px_rgba(0,0,0,0.08)] hover:border-[#c4c9cf] transition-[shadow,border-color] cursor-pointer bg-primary"
                    >
                      <Typography variant="label-sm" color="primary" className="mb-1">
                        <span className="font-semibold">{item.title}</span>
                      </Typography>
                      <Typography variant="body-sm" color="tertiary">
                        <span className="line-clamp-2 text-[12px]">{item.description}</span>
                      </Typography>
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
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(() => {
    if (pendingProjectTitle) {
      return {
        id: 'pending',
        emoji: '✨',
        title: pendingProjectTitle,
        description: `A new project created from your dashboard shortcut.`,
        status: 'active' as ProjectStatus,
        agents: [
          { name: 'Clara', avatar: AVATAR_CLARA },
          { name: 'Maya', avatar: AVATAR_MAYA },
        ],
        chats: 0,
        artifacts: 0,
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
    });
  };

  if (selectedProject) {
    const customTasks = selectedProject.id === 'pending'
      ? getTasksForTitle(selectedProject.title).map(label => ({ label, done: false }))
      : undefined;
    return (
      <ProjectDetailView
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
        onItemClick={onItemClick}
        customTasks={customTasks}
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
          <Button variant="primary" size="md" startIcon="plus" onClick={() => setShowNewProjectModal(true)} className="[&_svg]:!text-icon-inverse">
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
          <div className="grid grid-cols-3 gap-4">
            {filtered.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
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
