import React, { useState } from 'react';
import { Button } from '@circleco/compass/components/Button';
import { Typography } from '@circleco/compass/components/Typography';
import { IconButton } from '@circleco/compass/components/IconButton';
import AgentDetailView, { type Agent } from './AgentDetailView';

const AGENTS: Agent[] = [
  {
    id: 'clara',
    name: 'clara',
    avatar: '/ai-avatar.png',
    description:
      'Your daily support. Welcomes new members and nudges churn risks.',
    lastActive: 'Last active 3 minutes ago',
    quickActions: [
      'Show me my inactive members',
      "How are this week's new members doing?",
      'Show me the onboarding completion funnel',
    ],
  },
  {
    id: 'dan',
    name: 'dan',
    avatar: '/ai-avatar.png',
    description: 'Your money guy. Spots trends and plans your growth.',
    lastActive: 'Last active 1 hour ago',
    quickActions: [
      'Show me revenue trends',
      'Which members are likely to upgrade?',
      'Plan my Q2 growth strategy',
    ],
  },
  {
    id: 'maya',
    name: 'maya',
    avatar: '/ai-avatar.png',
    description:
      'Content magician. Drafts posts, broadcasts and recaps discussions.',
    lastActive: 'Last active 30 minutes ago',
    quickActions: [
      'Draft a weekly broadcast',
      "Recap this week's top discussions",
      'Write a welcome post for new members',
    ],
  },
];

interface TeamPageProps {
  onToggleSidebar: () => void;
}

const TeamPage: React.FC<TeamPageProps> = ({ onToggleSidebar }) => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  if (selectedAgent) {
    return (
      <AgentDetailView
        agent={selectedAgent}
        onBack={() => setSelectedAgent(null)}
      />
    );
  }

  return (
    <div className="bg-primary h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-6 pt-6 pb-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Typography color="primary" component="h1" variant="heading-2xl">
            Team
          </Typography>
        </div>
        <Button variant="primary" size="md">
          New teammate
        </Button>
      </div>

      {/* Agent cards grid */}
      <div className="flex-1 min-h-0 overflow-auto px-6 pb-6 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-3 gap-4 pt-2">
          {AGENTS.map(agent => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className="text-left bg-primary flex flex-col gap-2 p-6 rounded-2xl shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_12px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_4px_16px_-4px_rgba(0,0,0,0.14)] transition-shadow cursor-pointer"
            >
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-14 h-14 rounded-full object-cover shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_12px_-4px_rgba(0,0,0,0.1)]"
              />
              <Typography variant="label-lg" color="primary">
                {agent.name}
              </Typography>
              <Typography variant="body-sm" color="secondary">
                {agent.description}
              </Typography>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
