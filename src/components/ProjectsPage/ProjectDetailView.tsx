import React from 'react';
import { Icon } from '@circleco/compass/components/Icon';
import { Typography } from '@circleco/compass/components/Typography';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Button } from '@circleco/compass/components/Button';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Badge } from '@circleco/compass/components/Badge';
import { BreadCrumbs } from '@circleco/compass/components/BreadCrumbs';
import AgentMessageBox from '../shared/AgentMessageBox';
import type { AssetItem } from '../shared/AssetDetailSidebar';
import type { Project } from './ProjectsPage';

const RECENT_CHATS = [
  {
    id: '1',
    title: 'Weekly new member onboarding report',
    preview: 'I recommend a 3-tier model based on competitor analysis...',
  },
  {
    id: '2',
    title: 'Members at risk of churning this month',
    preview: 'The webhook endpoints are configured and tested...',
  },
  {
    id: '3',
    title: 'Re-engagement campaign for January dropoffs',
    preview: "Here's the 5-email welcome series draft...",
  },
];

const ARTIFACTS: { id: string; title: string; badge: string }[] = [
  { id: '1', title: 'Weekly community health report', badge: 'Insight' },
  { id: '2', title: 'Churn analysis - february exits', badge: 'PDF' },
];

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
  onItemClick?: (item: AssetItem) => void;
  customTasks?: { label: string; done: boolean }[];
}

const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  onBack,
  onItemClick,
  customTasks,
}) => {
  return (
    <div className="bg-primary h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-4 py-3 flex items-center justify-between gap-4 border-b border-secondary">
        <div
          className="flex items-center gap-2 min-w-0"
          onClick={e => {
            const anchor = (e.target as HTMLElement).closest('a');
            if (anchor) {
              e.preventDefault();
              onBack();
            }
          }}
        >
          <BreadCrumbs
            size="sm"
            items={[{ label: 'Projects', href: '#' }, { label: project.title }]}
            className="flex-1 min-w-0"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm">
            Settings
          </Button>
        </div>
      </div>

      {/* Body: main content + right panel */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-16 py-9">
            <div className="w-full max-w-[1280px] mx-auto flex flex-col gap-6">
              {/* Project header row: title left, agents right */}
              <div className="flex items-start justify-between gap-4">
                <Typography
                  variant="heading-2xl"
                  color="primary"
                >
                  <span className="font-bold">{project.title}</span>
                </Typography>
                <div className="flex items-center shrink-0">
                  {project.agents.map((agent, i) => (
                    <div key={agent.name} className={`ring-2 ring-white rounded-full${i > 0 ? ' -ml-2' : ''}`}>
                      <img src={agent.avatar} alt={agent.name} className="w-[22px] h-[22px] rounded-full" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <Typography variant="body-md" color="secondary">
                {project.description}
              </Typography>

              {/* Message box — inline, near the top */}
              <AgentMessageBox
                placeholder="Type to start a thread..."
                onSubmit={() => {}}
              />

              {/* Recent chats */}
              <div className="flex flex-col gap-2">
                <Typography variant="label-sm" color="secondary">
                  Recent chats
                </Typography>
                <div className="flex flex-col gap-2">
                  {RECENT_CHATS.map(chat => (
                    <button
                      key={chat.id}
                      type="button"
                      className="bg-primary border border-secondary rounded-lg px-5 py-4 flex flex-col gap-1 text-left hover:bg-hover transition-colors w-full shadow-2xs"
                    >
                      <Typography variant="label-sm" color="primary">
                        {chat.title}
                      </Typography>
                      <Typography
                        variant="body-sm"
                        color="tertiary"
                      >
                        <span className="truncate block">{chat.preview}</span>
                      </Typography>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <aside className="w-[470px] shrink-0 border-l border-secondary flex flex-col gap-4 p-4 overflow-y-auto">
          {/* Progress card */}
          <div className="rounded-2xl border border-secondary bg-primary p-5 flex flex-col gap-3">
            <Typography variant="label-md" color="primary">
              <span className="font-semibold">Progress</span>
            </Typography>
            <div className="flex flex-col gap-2">
              {(customTasks ?? [
                { label: 'Define your community purpose and niche',       done: true  },
                { label: 'Set up your Circle space and branding',          done: true  },
                { label: 'Create your onboarding welcome post',            done: true  },
                { label: 'Invite your first 10 founding members',          done: false },
                { label: 'Launch your first live event or weekly post',    done: false },
                { label: 'Set up a membership plan and paywall',           done: false },
                { label: 'Activate your AI agent for member support',      done: false },
              ]).map((task, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Icon
                    name={task.done ? 'circle-check' : 'circle'}
                    size="sm"
                    className={task.done ? 'text-success shrink-0' : 'text-disabled shrink-0'}
                  />
                  <Typography
                    variant="body-sm"
                    color={task.done ? 'tertiary' : 'primary'}
                  >
                    <span className={task.done ? 'line-through' : ''}>{task.label}</span>
                  </Typography>
                </div>
              ))}
            </div>
          </div>

          {/* Artifacts card */}
          <div className="rounded-2xl border border-secondary bg-primary p-5 flex flex-col gap-3">
            <Typography
              variant="label-md"
              color="primary"
            >
              <span className="font-semibold">Artifacts</span>
            </Typography>
            <div className="flex flex-col gap-1">
              {ARTIFACTS.map(artifact => (
                <button
                  key={artifact.id}
                  type="button"
                  onClick={() =>
                    onItemClick?.({
                      id: artifact.id,
                      title: artifact.title,
                      type: 'asset',
                    })
                  }
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-hover transition-colors w-full text-left"
                >
                  <Typography
                    variant="body-sm"
                    color="primary"
                  >
                    <span className="flex-1 min-w-0 truncate">{artifact.title}</span>
                  </Typography>
                  <Badge
                    variant="secondary"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    label={artifact.badge}
                    className="shrink-0"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Skills card */}
          <div className="rounded-2xl border border-secondary bg-primary p-5 flex flex-col gap-3">
            <Typography
              variant="label-md"
              color="primary"
            >
              <span className="font-semibold">Skills</span>
            </Typography>
            <div className="flex flex-col gap-1">
              {[
                { name: 'Member Inviter', mode: 'Operator' as const, description: 'Creates invite links, bulk invites, and configures welcome messages' },
                { name: 'Engagement Strategist', mode: 'Strategist' as const, description: 'Analyzes patterns and recommends tactics to reduce lurking' },
                { name: 'Growth Advisor', mode: 'Strategist' as const, description: 'Recommends growth channels based on your existing audience' },
              ].map(skill => (
                <div
                  key={skill.name}
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-hover transition-colors w-full cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <Typography
                      variant="body-sm"
                      color="primary"
                    >
                      <span className="truncate block">{skill.name}</span>
                    </Typography>
                  </div>
                  <Badge
                    variant={skill.mode === 'Operator' ? 'primary' : 'secondary'}
                    label={skill.mode}
                    className="shrink-0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Instructions card */}
          <div className="rounded-2xl border border-secondary bg-primary p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <Typography
                variant="label-md"
                color="primary"
              >
                <span className="font-semibold">Instructions</span>
              </Typography>
              <IconButton
                variant="ghost"
                size="sm"
                icon="pencil"
                aria-label="Edit instructions"
              />
            </div>
            <Typography variant="body-sm" color="tertiary">
              You are a community growth specialist. Focus on member activation,
              retention, and engagement. Always ground recommendations in data
              and propose measurable outcomes.
            </Typography>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProjectDetailView;
