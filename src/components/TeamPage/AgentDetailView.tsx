import React from 'react';
import { BreadCrumbs } from '@circleco/compass/components/BreadCrumbs';
import { Button } from '@circleco/compass/components/Button';
import { Icon } from '@circleco/compass/components/Icon';
import { Typography } from '@circleco/compass/components/Typography';
import AgentMessageBox from '../shared/AgentMessageBox';

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  description: string;
  lastActive: string;
  quickActions: string[];
}

const RECENT_CHATS = [
  { id: '1', title: 'Weekly new member onboarding report', meta: 'Last active 2h ago · 8 messages' },
  { id: '2', title: 'Members at risk of churning this month', meta: 'Last active 2h ago · 8 messages' },
  { id: '3', title: 'Re-engagement campaign for January dropoffs', meta: 'Last active 2h ago · 8 messages' },
  { id: '4', title: 'Top 10 unanswered member questions', meta: 'Last active 2h ago · 8 messages' },
];

interface AgentDetailViewProps {
  agent: Agent;
  onBack: () => void;
}

const AgentDetailView: React.FC<AgentDetailViewProps> = ({ agent, onBack }) => {
  return (
    <div className="h-full flex flex-col bg-primary overflow-hidden">
      {/* Breadcrumbs */}
      <div
        className="shrink-0 px-6 py-4"
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
          items={[{ label: 'Agents', href: '#' }, { label: agent.name }]}
        />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
        <div className="max-w-[661px] mx-auto flex flex-col gap-6 relative">
          {/* Settings + New project — top right of content */}
          <div className="absolute top-0 right-0 flex items-center gap-2">
            <Button variant="outline" size="sm" startIcon="edit-ai">
              Settings
            </Button>
            <Button variant="outline" size="sm" startIcon="plus">
              New project
            </Button>
          </div>

          {/* Agent avatar */}
          <img
            src={agent.avatar}
            alt={agent.name}
            className="w-[87px] h-[87px] rounded-full object-cover shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_12px_-4px_rgba(0,0,0,0.1)]"
          />

          {/* Agent info */}
          <div className="flex flex-col gap-4">
            <Typography variant="heading-2xl" color="primary">
              {agent.name.toLowerCase()}
            </Typography>
            <Typography variant="body-md" color="secondary">
              {agent.description}
            </Typography>
            <div className="flex items-center gap-2.5">
              <Icon name="clock-dash" size="sm" className="shrink-0" />
              <Typography variant="body-sm" color="disabled">
                {agent.lastActive}
              </Typography>
            </div>
          </div>

          {/* Message box — inline, near the top */}
          <AgentMessageBox placeholder={`Reply to ${agent.name}...`} />

          {/* Quick action buttons */}
          <div className="flex flex-wrap gap-2">
            {agent.quickActions.map((action, i) => (
              <Button key={i} variant="outline" size="sm">
                {action}
              </Button>
            ))}
          </div>

          {/* Recent chats */}
          <div className="flex flex-col gap-2">
            <Typography variant="label-sm" color="secondary">
              Recent chats
            </Typography>
            {RECENT_CHATS.map(chat => (
              <div
                key={chat.id}
                className="bg-primary border border-secondary rounded-lg px-5 py-4 shadow-2xs cursor-pointer hover:bg-hover transition-colors"
              >
                <Typography variant="label-sm" color="primary">
                  {chat.title}
                </Typography>
                <Typography variant="body-sm" color="tertiary">
                  {chat.meta}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailView;
