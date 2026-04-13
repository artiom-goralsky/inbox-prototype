import React, { useState, useEffect, useRef } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Button } from '@circleco/compass/components/Button';
import { TextInput } from '@circleco/compass/components/TextInput';
import { TextArea } from '@circleco/compass/components/TextArea';
import { Switch } from '@circleco/compass/components/Switch';
import { Icon, type IconName } from '@circleco/compass/components/Icon';
import { Badge } from '@circleco/compass/components/Badge';
import type { Agent } from './AgentDetailView';

const MIN_WIDTH = 380;
const MAX_WIDTH = 720;
const DEFAULT_WIDTH = 480;

/* ── Collapsible section ── */
const Section: React.FC<{
  title: string;
  icon: IconName;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, icon, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-secondary last:border-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-hover transition-colors"
      >
        <Icon name={icon} size="sm" className="text-tertiary shrink-0" />
        <Typography variant="label-sm" color="primary">
          <span className="flex-1 text-left">{title}</span>
        </Typography>
        <Icon
          name="chevron-down"
          size="sm"
          className={`text-tertiary transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="px-4 pb-4 flex flex-col gap-4">{children}</div>}
    </div>
  );
};

/* ── Toggle row ── */
const ToggleRow: React.FC<{ label: string; defaultChecked?: boolean; indent?: boolean; description?: string }> = ({
  label,
  defaultChecked = false,
  indent = false,
  description,
}) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div
      className={`flex items-start justify-between gap-3 py-2 ${indent ? 'pl-5 border-l-2 border-secondary ml-2' : ''}`}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <Typography variant="body-sm" color="primary">{label}</Typography>
        {description && (
          <Typography variant="caption" color="tertiary">{description}</Typography>
        )}
      </div>
      <div className="shrink-0 pt-0.5">
        <Switch checked={checked} onCheckedChange={() => setChecked(c => !c)} />
      </div>
    </div>
  );
};

/* ── Knowledge row ── */
const KnowledgeRow: React.FC<{ title: string; group: string; type: string; items: number }> = ({
  title, group, type, items,
}) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-secondary last:border-0">
    <Typography variant="body-sm" color="primary"><span className="flex-1 min-w-0 truncate">{title}</span></Typography>
    <Typography variant="caption" color="tertiary"><span className="shrink-0 truncate max-w-[80px]">{group}</span></Typography>
    <Badge variant="secondary" label={type} />
    <Typography variant="caption" color="tertiary"><span className="shrink-0 w-5 text-right">{items}</span></Typography>
  </div>
);

/* ── Workflow row ── */
const WorkflowRow: React.FC<{ name: string; active: boolean }> = ({ name, active }) => (
  <div className="flex items-center justify-between gap-3 py-2.5 border-b border-secondary last:border-0">
    <div className="flex items-center gap-2 min-w-0">
      <Icon name="sparkle" size="sm" className="text-accent-primary shrink-0" />
      <Typography variant="body-sm" color="primary"><span className="truncate">{name}</span></Typography>
    </div>
    <Badge variant={active ? 'success' : 'secondary'} label={active ? 'On' : 'Off'} />
  </div>
);

/* ── Main sidebar ── */
interface AgentSettingsSidebarProps {
  agent: Agent;
  onClose: () => void;
  onWidthChange?: (w: number) => void;
}

const AgentSettingsSidebar: React.FC<AgentSettingsSidebarProps> = ({ agent, onClose, onWidthChange }) => {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);
  const [agentName, setAgentName] = useState(agent.name);
  const [bio, setBio] = useState(agent.description);
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Hi there! I'm here to help you find the answers and resources you need. How can I help?"
  );
  const [aiPrompt, setAiPrompt] = useState(
    'Give people useful information based off the type of action you are responding to.\n\nALWAYS use a friendly, encouraging tone.\n\nNEVER share private member data with other members.'
  );
  const [suggestedPrompts, setSuggestedPrompts] = useState(['Getting started', 'Community resources']);
  const [newPrompt, setNewPrompt] = useState('');
  const [tone, setTone] = useState<'normal' | 'friendly'>('friendly');

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const delta = dragRef.current.startX - e.clientX;
      const w = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, dragRef.current.startWidth + delta));
      setWidth(w);
      onWidthChange?.(w);
    };
    const onUp = () => { dragRef.current = null; };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [onWidthChange]);

  const addPrompt = () => {
    const v = newPrompt.trim();
    if (v && !suggestedPrompts.includes(v)) {
      setSuggestedPrompts(p => [...p, v]);
      setNewPrompt('');
    }
  };

  return (
    <div
      className="border-l border-secondary h-full flex flex-col bg-primary relative"
      style={{ width }}
    >
      {/* Resize handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-accent-primary/30 transition-colors z-10"
        onMouseDown={e => {
          dragRef.current = { startX: e.clientX, startWidth: width };
          e.preventDefault();
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 shrink-0 border-b border-secondary">
        <div className="flex items-center gap-2.5 min-w-0">
          <img src={agent.avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
          <Typography variant="label-md" color="primary">
            <span className="truncate">{agent.name} Settings</span>
          </Typography>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button variant="primary" size="sm">Save</Button>
          <IconButton variant="ghost" size="sm" icon="cross" aria-label="Close" onClick={onClose} />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto min-h-0">

        {/* ─── TOUCHPOINTS & AUDIENCE ─── */}
        <Section title="Touchpoints & Audience" icon="people" defaultOpen>
          <div className="flex flex-col">
            <ToggleRow label="Talk to agents in direct messages" defaultChecked />
            <ToggleRow label="Start new conversations from search" defaultChecked indent />
            <ToggleRow label="Send a welcome message" defaultChecked indent />
          </div>
          <div className="rounded-lg border border-secondary px-3.5 py-3 flex flex-col gap-2">
            <Typography variant="label-sm" color="tertiary">Targeting</Typography>
            <div className="flex items-center gap-2">
              <Icon name="people" size="sm" className="text-tertiary" />
              <Typography variant="body-sm" color="primary">People: <strong>462</strong></Typography>
            </div>
            <Button variant="outline" size="sm" startIcon="plus" className="self-start">
              Add filter
            </Button>
          </div>
        </Section>

        {/* ─── CUSTOMIZE ─── */}
        <Section title="Customize" icon="edit-ai" defaultOpen>
          <div className="flex items-center gap-3">
            <img src={agent.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-secondary" />
            <Button variant="outline" size="sm">Change avatar</Button>
          </div>
          <div className="flex flex-col gap-1">
            <Typography variant="label-sm" color="tertiary">Name</Typography>
            <TextInput value={agentName} onChange={e => setAgentName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Typography variant="label-sm" color="tertiary">Welcome message</Typography>
            <TextArea value={welcomeMessage} onChange={e => setWelcomeMessage(e.target.value)} rows={3} />
          </div>
          <div className="flex flex-col gap-1">
            <Typography variant="label-sm" color="tertiary">Bio</Typography>
            <TextArea value={bio} onChange={e => setBio(e.target.value)} rows={2} />
          </div>
          <div className="flex flex-col gap-1">
            <Typography variant="label-sm" color="tertiary">Suggested prompts</Typography>
            <div className="flex flex-wrap gap-1.5">
              {suggestedPrompts.map(p => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full border border-secondary text-sm text-primary"
                >
                  {p}
                  <button
                    type="button"
                    onClick={() => setSuggestedPrompts(ps => ps.filter(x => x !== p))}
                    className="text-tertiary hover:text-primary rounded-full p-0.5"
                  >
                    <Icon name="cross" size="sm" />
                  </button>
                </span>
              ))}
            </div>
            <form
              className="mt-1"
              onSubmit={e => { e.preventDefault(); addPrompt(); }}
            >
              <TextInput
                value={newPrompt}
                onChange={e => setNewPrompt(e.target.value)}
                placeholder="Type and press Enter"
              />
            </form>
          </div>
        </Section>

        {/* ─── INSTRUCTIONS ─── */}
        <Section title="Instructions" icon="sparkle">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <Icon name="sparkle" size="sm" className="text-accent-primary" />
              <Typography variant="label-sm" color="tertiary">AI prompt</Typography>
            </div>
            <TextArea
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              rows={5}
            />
            <Typography variant="caption" color="tertiary">
              <span className="text-right">{1500 - aiPrompt.length} / 1,500</span>
            </Typography>
          </div>
          <ToggleRow label="Pause AI responses" />

          <div className="flex flex-col gap-2">
            <Typography variant="label-sm" color="tertiary">Style</Typography>
            <div className="border border-accent-primary rounded-lg px-3.5 py-3 flex items-center justify-between gap-2">
              <Typography variant="body-sm" color="primary">Use AI generated answers</Typography>
              <Icon name="sparkle" size="sm" className="text-accent-primary" />
            </div>
            <div className="border border-secondary rounded-lg px-3.5 py-3 flex items-center justify-between gap-2 opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-2">
                <Typography variant="body-sm" color="tertiary">Use custom answers</Typography>
                <Badge variant="secondary" label="SOON" />
              </div>
              <Icon name="copy" size="sm" className="text-tertiary" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Typography variant="label-sm" color="tertiary">Tone</Typography>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: 'normal' as const, label: 'Normal', desc: 'Casual and objective' },
                { value: 'friendly' as const, label: 'Friendly', desc: 'Enthusiastic, upbeat' },
              ]).map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTone(opt.value)}
                  className={`border rounded-lg px-3.5 py-3 text-left transition-colors ${
                    tone === opt.value
                      ? 'border-accent-primary bg-accent-primary/5'
                      : 'border-secondary hover:border-primary'
                  }`}
                >
                  <Typography variant="label-sm" color="primary">{opt.label}</Typography>
                  <Typography variant="caption" color="tertiary">{opt.desc}</Typography>
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* ─── KNOWLEDGE ─── */}
        <Section title="Knowledge" icon="file">
          <div className="flex items-center justify-between">
            <Typography variant="body-sm" color="tertiary">42 spaces connected</Typography>
            <Button variant="outline" size="sm">Import</Button>
          </div>
          <div className="flex flex-col">
            <KnowledgeRow title="Welcome to Circle…" group="Artiom Test" type="Post" items={7} />
            <KnowledgeRow title="testing zone" group="Scheben's…" type="Post" items={2} />
            <KnowledgeRow title="Karthik's AI Copilo…" group="Stefano's Te…" type="Post" items={1} />
            <KnowledgeRow title="Start Here" group="Assesment…" type="Post" items={6} />
            <KnowledgeRow title="National Trips" group="In-app…" type="Post" items={21} />
          </div>
        </Section>

        {/* ─── WORKFLOWS ─── */}
        <Section title="Workflows" icon="sparkle">
          <div className="flex items-center justify-between">
            <Typography variant="body-sm" color="tertiary">1 workflow</Typography>
            <Button variant="outline" size="sm" startIcon="plus">New workflow</Button>
          </div>
          <div className="flex flex-col">
            <WorkflowRow name="Agent answers unanswered posts" active={false} />
          </div>
        </Section>

      </div>
    </div>
  );
};

export default AgentSettingsSidebar;
