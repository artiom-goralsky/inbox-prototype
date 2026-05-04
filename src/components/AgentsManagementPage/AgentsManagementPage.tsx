import React, { useState, useCallback } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Button } from '@circleco/compass/components/Button';
import { Tabs } from '@circleco/compass/components/Tabs';
import { Table } from '@circleco/compass/components/Table';
import { Switch } from '@circleco/compass/components/Switch';
import { Checkbox } from '@circleco/compass/components/Checkbox';
import { Icon } from '@circleco/compass/components/Icon';
import type { IconName } from '@circleco/compass/components/Icon';
import AgentDetailPage from '../AgentDetailPage/AgentDetailPage';

/* ─── Types ──────────────────────────────────────────────────────── */

export interface AgentRow {
  id: string;
  name: string;
  avatarBg: string;
  avatarIcon: IconName;
  modifiedOn: string;
  conversations: number;
  messages: number;
  active: boolean;
}

interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  avatarBg: string;
}

/* ─── Data ───────────────────────────────────────────────────────── */

const TEMPLATES: AgentTemplate[] = [
  {
    id: 'automation',
    name: 'Internal automation',
    description: 'Admin-only workflows like daily briefings, digest summaries, and back-office tasks.',
    icon: 'zap',
    avatarBg: '#7C3AED',
  },
  {
    id: 'support',
    name: 'Community support',
    description: 'Answers member questions, handles basic support, and keeps conversations on track.',
    icon: 'message-text',
    avatarBg: '#2563EB',
  },
  {
    id: 'course',
    name: 'Course assistant',
    description: 'Lives inside a course and helps learners understand content and get unstuck.',
    icon: 'book',
    avatarBg: '#059669',
  },
  {
    id: 'clone',
    name: 'Creator clone',
    description: 'Represents you — handles pre-sales, FAQs, and can live anywhere in your community.',
    icon: 'sparkle',
    avatarBg: '#D97706',
  },
];

const INITIAL_AGENTS: AgentRow[] = [
  {
    id: '1',
    name: 'Support agent',
    avatarBg: '#2563EB',
    avatarIcon: 'sparkle',
    modifiedOn: 'December 5, 2025',
    conversations: 256,
    messages: 1590,
    active: true,
  },
  {
    id: '2',
    name: "Aleksandr's agent",
    avatarBg: '#16A34A',
    avatarIcon: 'target',
    modifiedOn: 'December 5, 2025',
    conversations: 11,
    messages: 244,
    active: false,
  },
];

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const PROMPT_EXAMPLES = [
  'Build me a moderation agent',
  'Create a course assistant',
  'Make a welcome agent for new members',
];

/* ─── Component ──────────────────────────────────────────────────── */

const AgentsManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedAgent, setSelectedAgent] = useState<AgentRow | null>(null);
  const [viewOpacity, setViewOpacity] = useState<'opacity-100' | 'opacity-0'>('opacity-100');
  const [prompt, setPrompt] = useState('');

  /* ── Agent creation ── */
  const createAgent = useCallback((name: string, avatarBg: string, avatarIcon: IconName): AgentRow => {
    const newAgent: AgentRow = {
      id: `${Date.now()}`,
      name,
      avatarBg,
      avatarIcon,
      modifiedOn: 'April 13, 2026',
      conversations: 0,
      messages: 0,
      active: false,
    };
    setAgents(prev => [newAgent, ...prev]);
    return newAgent;
  }, []);

  const navigateToAgent = useCallback((agent: AgentRow) => {
    setViewOpacity('opacity-0');
    setTimeout(() => {
      setSelectedAgent(agent);
      setViewOpacity('opacity-100');
    }, 150);
  }, []);

  const handlePromptSubmit = useCallback(() => {
    const text = prompt.trim();
    if (!text) return;
    const agent = createAgent(text, '#2563EB', 'sparkle');
    setPrompt('');
    navigateToAgent(agent);
  }, [prompt, createAgent, navigateToAgent]);

  const handleTemplateClick = useCallback((template: AgentTemplate) => {
    const agent = createAgent(template.name, template.avatarBg, template.icon);
    navigateToAgent(agent);
  }, [createAgent, navigateToAgent]);

  const handleRowClick = useCallback((agent: AgentRow) => {
    navigateToAgent(agent);
  }, [navigateToAgent]);

  const handleBack = useCallback(() => {
    setViewOpacity('opacity-0');
    setTimeout(() => {
      setSelectedAgent(null);
      setViewOpacity('opacity-100');
    }, 150);
  }, []);

  /* ── Table helpers ── */
  const filtered = agents.filter(a => {
    if (activeTab === 'active') return a.active;
    if (activeTab === 'inactive') return !a.active;
    return true;
  });

  const allSelected = filtered.length > 0 && filtered.every(a => selectedIds.has(a.id));

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(a => a.id)));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleActive = (id: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  /* ── Detail view ── */
  if (selectedAgent) {
    return (
      <div className={`h-full transition-opacity duration-150 ${viewOpacity}`}>
        <AgentDetailPage agent={selectedAgent} onBack={handleBack} />
      </div>
    );
  }

  return (
    <div className={`bg-primary h-full overflow-y-auto transition-opacity duration-150 ${viewOpacity}`}>
      <div className="w-full max-w-[960px] mx-auto px-8 pt-12 pb-16 flex flex-col gap-10">

        {/* Page title */}
        <Typography variant="heading-2xl" color="primary">Agents</Typography>

        {/* ── Zone 1: Create ── */}
        <div className="flex flex-col gap-3">
          {/* Input box */}
          <div className="border border-secondary rounded-xl px-4 py-3 bg-primary flex items-center gap-3">
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handlePromptSubmit(); }}
              placeholder="What kind of agent do you want to build?"
              className="flex-1 bg-transparent outline-none text-sm text-primary placeholder:text-tertiary"
            />
            <button
              onClick={handlePromptSubmit}
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                prompt.trim() ? 'bg-inverse text-inverse' : 'bg-secondary text-tertiary'
              }`}
            >
              <Icon name="arrow-up" size="sm" />
            </button>
          </div>

          {/* Example prompts */}
          <div className="flex items-center gap-2 flex-wrap">
            {PROMPT_EXAMPLES.map(example => (
              <button
                key={example}
                onClick={() => { setPrompt(example); }}
                className="px-3 py-1.5 rounded-full border border-secondary text-xs text-secondary hover:border-primary hover:text-primary transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* ── Zone 2: Templates ── */}
        <div className="flex flex-col gap-4">
          <Typography variant="label-sm" color="tertiary">Start from a template</Typography>
          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.map(template => (
              <button
                key={template.id}
                onClick={() => handleTemplateClick(template)}
                className="flex items-start gap-4 p-4 rounded-xl border border-secondary hover:border-primary hover:bg-secondary/40 transition-all text-left group"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: template.avatarBg }}
                >
                  <Icon name={template.icon} size="sm" className="text-white" />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <Typography variant="label-sm" color="primary">{template.name}</Typography>
                  <Typography variant="caption" color="secondary">{template.description}</Typography>
                </div>
                <span className="flex-shrink-0 text-tertiary opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
                  <Icon name="arrow-up-right" size="sm" />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Zone 3: Manage existing ── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Typography variant="label-sm" color="tertiary">Your agents</Typography>
            <Tabs.Root
              tabs={TABS}
              selectedValue={activeTab}
              onValueChange={setActiveTab}
              size="sm"
            />
          </div>

          <Table.Root columns="44px 1fr 160px 140px 140px 80px">
            <Table.Header>
              <Table.HeaderRow>
                <Table.HeaderCell isActionCell>
                  <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
                </Table.HeaderCell>
                <Table.HeaderCell text="Name" />
                <Table.HeaderCell text="Modified" />
                <Table.HeaderCell text="Conversations" />
                <Table.HeaderCell text="Messages" />
                <Table.HeaderCell text="Active" />
              </Table.HeaderRow>
            </Table.Header>
            <Table.Body>
              {filtered.map(agent => (
                <Table.Row key={agent.id} className="cursor-pointer" onClick={() => handleRowClick(agent)}>
                  <Table.BaseCell isActionCell>
                    <Checkbox
                      checked={selectedIds.has(agent.id)}
                      onCheckedChange={() => toggleSelect(agent.id)}
                    />
                  </Table.BaseCell>
                  <Table.MixedCell
                    startContent={
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                        style={{ backgroundColor: agent.avatarBg }}
                      >
                        <Icon name={agent.avatarIcon} size="sm" />
                      </div>
                    }
                    text={agent.name}
                  />
                  <Table.TextCell text={agent.modifiedOn} />
                  <Table.TextCell text={String(agent.conversations)} />
                  <Table.TextCell text={String(agent.messages)} />
                  <Table.BaseCell isActionCell>
                    <Switch
                      checked={agent.active}
                      onCheckedChange={() => toggleActive(agent.id)}
                    />
                  </Table.BaseCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>

      </div>
    </div>
  );
};

export default AgentsManagementPage;
