import React, { useState, useRef, useEffect } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Button } from '@circleco/compass/components/Button';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Icon } from '@circleco/compass/components/Icon';
import type { IconName } from '@circleco/compass/components/Icon';
import { TextArea } from '@circleco/compass/components/TextArea';
import { Switch } from '@circleco/compass/components/Switch';
import { Select } from '@circleco/compass/components/Select';
import { Badge } from '@circleco/compass/components/Badge';
import { Checkbox } from '@circleco/compass/components/Checkbox';
import { Table } from '@circleco/compass/components/Table';
import { Tabs } from '@circleco/compass/components/Tabs';
import { BreadCrumbs } from '@circleco/compass/components/BreadCrumbs';

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

interface Message {
  id: string;
  role: 'user' | 'agent';
  parts: MessagePart[];
}

type MessagePart =
  | { type: 'text'; content: string }
  | { type: 'card'; title: string };

/* ─── Knowledge data ─────────────────────────────────────────────── */

const COMMUNITY_RESOURCES = [
  { title: 'Introduction to intervals & ear training', type: 'Course' },
  { title: 'How to analyze a lead sheet', type: 'Post' },
  { title: 'Songwriting with borrowed chords', type: 'Post' },
  { title: 'Reharmonization techniques', type: 'Post' },
  { title: 'Tritone substitutions demystified', type: 'Post' },
  { title: 'Counterpoint fundamentals', type: 'Course' },
  { title: 'Understanding the circle of fifths', type: 'Course' },
  { title: 'Modes of the major scale explained', type: 'Post' },
  { title: 'Intro to Schenkerian analysis', type: 'Post' },
  { title: 'Building tension with secondary dominants', type: 'Post' },
  { title: 'Rhythm and meter workshop', type: 'Course' },
  { title: 'Jazz harmony for classical musicians', type: 'Post' },
  { title: 'Voice leading principles', type: 'Post' },
  { title: 'Functional harmony deep dive', type: 'Course' },
  { title: 'Ear training exercises for beginners', type: 'Post' },
  { title: 'Advanced sight-reading techniques', type: 'Course' },
  { title: 'Modal improvisation guide', type: 'Post' },
  { title: 'Chord substitutions in pop music', type: 'Post' },
  { title: 'Understanding polytonality', type: 'Post' },
  { title: 'Orchestration basics', type: 'Course' },
  { title: 'Harmonic rhythm and voice leading', type: 'Post' },
  { title: 'The Neapolitan chord explained', type: 'Post' },
  { title: 'Augmented sixth chords', type: 'Post' },
  { title: 'Modulation techniques', type: 'Course' },
  { title: 'Secondary dominants deep dive', type: 'Post' },
  { title: 'Borrowed chords and modal mixture', type: 'Post' },
  { title: 'Chromatic mediant relationships', type: 'Post' },
  { title: 'Pedal points and ostinato', type: 'Post' },
  { title: 'Canon and fugue writing', type: 'Course' },
  { title: 'Figured bass for keyboard players', type: 'Post' },
  { title: 'Jazz chord voicings', type: 'Post' },
  { title: 'Negative harmony explained', type: 'Post' },
  { title: 'Species counterpoint Part I', type: 'Course' },
  { title: 'Species counterpoint Part II', type: 'Course' },
  { title: "Music analysis: Beethoven's 5th", type: 'Post' },
  { title: 'Solfège and sight-singing basics', type: 'Post' },
  { title: 'Advanced ear training', type: 'Course' },
  { title: 'Polyrhythm and polymetry', type: 'Post' },
  { title: 'Microtonal scales and tuning systems', type: 'Post' },
  { title: 'Neo-Riemannian theory introduction', type: 'Post' },
  { title: 'Spectral music and acoustic phenomena', type: 'Post' },
  { title: 'Set theory and pitch-class sets', type: 'Course' },
  { title: 'Post-tonal analysis techniques', type: 'Post' },
];

const CUSTOM_RESOURCES = [
  { title: 'Welcome message for new members', type: 'Snippet' },
  { title: "Beginner's guide to reading sheet music", type: 'PDF' },
  { title: 'Circle of fifths reference chart', type: 'PDF' },
];

const PAGE_SIZE = 20;

/* ─── Helpers ────────────────────────────────────────────────────── */

function parseBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

/* ─── Sidebar tab config ──────────────────────────────────────────── */

const SIDEBAR_TABS = [
  { value: 'guidance', label: 'Guidance' },
  { value: 'knowledge', label: 'Knowledge' },
  { value: 'distribution', label: 'Distribution' },
];

const SUB_PANEL_TITLE: Record<string, string> = {
  escalation: 'Escalation',
  'knowledge-resources': 'Knowledge and resources',
  workflows: 'Automations',
};

/* ─── Chat flows ─────────────────────────────────────────────────── */

const CANNED_FLOWS: Record<string, MessagePart[][]> = {
  'Where can I find the courses?': [
    [
      { type: 'text', content: 'All our courses are in the Courses section in the left sidebar (on mobile, tap ≡ to find it).' },
    ],
    [
      { type: 'text', content: 'The best place to start is **Music Theory Foundations**, it\'s where most new members begin. Want to know more about it?' },
      { type: 'card', title: 'Music Theory Foundations' },
    ],
  ],
  'How do I get started as a new member?': [
    [
      { type: 'text', content: 'Welcome! The best place to start is our **Getting Started** guide. It walks you through setting up your profile, finding spaces to join, and connecting with other members.' },
    ],
    [
      { type: 'text', content: 'You can also check out our **New Member Orientation** event — we run one every other week and it\'s a great way to meet the community.' },
    ],
  ],
  'How do I connect with other members?': [
    [
      { type: 'text', content: 'There are a few great ways to connect! You can send **direct messages** to any member, or join **live events** to meet people in real-time.' },
    ],
    [
      { type: 'text', content: 'The **Introductions** space is also a fantastic starting point — post a little about yourself and others will reach out. Most new members find their first connections there.' },
    ],
  ],
  "What's included in my membership?": [
    [
      { type: 'text', content: 'Your membership includes access to **all courses**, the community forum, live events, and direct messaging with other members.' },
    ],
    [
      { type: 'text', content: 'You also get access to our **resource library** with guides, templates, and reference materials. Is there a specific area you\'d like to explore?' },
    ],
  ],
};

const FOLLOW_UP_PARTS: MessagePart[][] = [
  [
    { type: 'text', content: '**Music Theory Foundations** takes you from reading notes on the staff through building major and minor scales, intervals, triads, and seventh chords. By the end you\'ll be able to analyze a simple lead sheet and understand what you\'re hearing. It\'s 6 modules, most members finish in about 2–3 weeks.' },
  ],
  [
    { type: 'text', content: 'No instrument requirement, works whether you play piano, guitar, or nothing yet.' },
  ],
  [
    { type: 'text', content: 'Want me to enroll you?' },
  ],
];

/* ─── Main component ─────────────────────────────────────────────── */

interface AgentDetailPageProps {
  agent: AgentRow;
  onBack: () => void;
}

const AgentDetailPage: React.FC<AgentDetailPageProps> = ({ agent, onBack }) => {
  /* ── Chat state ── */
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [lastSuggestionFlow, setLastSuggestionFlow] = useState<string | null>(null);
  const [followUpSent, setFollowUpSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ── Sidebar state ── */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'guidance' | 'knowledge' | 'distribution'>('guidance');
  const [subPanel, setSubPanel] = useState<string | null>(null);
  const [, setSubPanelBackTitle] = useState('');

  /* ── Guidance state ── */
  const [instructions, setInstructions] = useState('');
  const [tone, setTone] = useState<'neutral' | 'friendly' | 'concise' | 'descriptive'>('neutral');

  /* ── Escalation state ── */
  const [escalationKeywords, setEscalationKeywords] = useState(['Not working', 'Broken', 'Human', 'Error']);
  const [newKeyword, setNewKeyword] = useState('');
  const [handoverMessage, setHandoverMessage] = useState("I'm connecting you with a team member who can help. They'll be with you shortly.");
  const [alertAdmins, setAlertAdmins] = useState(false);

  /* ── Knowledge state ── */
  const [helpCenterEnabled, setHelpCenterEnabled] = useState(false);
  const [skipMemberContent, setSkipMemberContent] = useState(false);
  const [skipHiddenPosts, setSkipHiddenPosts] = useState(false);
  const [skipOldContent, setSkipOldContent] = useState(false);
  const [oldContentDate, setOldContentDate] = useState('');
  const [knowledgeTab, setKnowledgeTab] = useState<'community' | 'custom'>('community');
  const [communityPage, setCommunityPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  /* ── Distribution state ── */
  const [dmEnabled, setDmEnabled] = useState(true);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [welcomeEnabled, setWelcomeEnabled] = useState(false);
  const [welcomeText, setWelcomeText] = useState("Hi there! I'm here to help you find the answers and resources you need. How can I help?");

  /* ── Workflow state ── */
  const [workflowSwitches, setWorkflowSwitches] = useState([false, false]);

  /* ── Hints bar ── */
  const [hintsVisible, setHintsVisible] = useState(true);

  /* ── Agent identity (editable) ── */
  const [agentName, setAgentName] = useState(agent.name);
  const [agentDesc, setAgentDesc] = useState('Your personal guide to the community');
  const [editingName, setEditingName] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);

  /* ── Suggestions (draggable) ── */
  const [suggestions, setSuggestions] = useState([
    'How do I get started as a new member?',
    'Where can I find the courses?',
    'How do I connect with other members?',
    "What's included in my membership?",
  ]);
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (idx: number) => { dragIndexRef.current = idx; };
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIndex(idx);
  };
  const handleDrop = (idx: number) => {
    const from = dragIndexRef.current;
    if (from !== null && from !== idx) {
      setSuggestions(prev => {
        const next = [...prev];
        const [item] = next.splice(from, 1);
        next.splice(idx, 0, item);
        return next;
      });
    }
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };
  const handleDragEnd = () => { dragIndexRef.current = null; setDragOverIndex(null); };

  /* ── Auto-scroll ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAgentTyping]);

  /* ── Message helpers ── */
  const addMessage = (role: 'user' | 'agent', parts: MessagePart[]) => {
    setMessages(prev => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, role, parts },
    ]);
  };

  const typeAgentParts = async (partGroups: MessagePart[][], delay = 700) => {
    setIsAgentTyping(true);
    for (const parts of partGroups) {
      await new Promise(res => setTimeout(res, delay));
      setIsAgentTyping(false);
      addMessage('agent', parts);
      setIsAgentTyping(true);
      delay = 900;
    }
    setIsAgentTyping(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setChatStarted(true);
    addMessage('user', [{ type: 'text', content: suggestion }]);
    setLastSuggestionFlow(suggestion);
    const flow = CANNED_FLOWS[suggestion];
    if (flow) {
      typeAgentParts(flow);
    } else {
      typeAgentParts([[{ type: 'text', content: "I'll help you with that! Let me look that up for you." }]]);
    }
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText('');
    setChatStarted(true);
    addMessage('user', [{ type: 'text', content: text }]);

    if (lastSuggestionFlow === 'Where can I find the courses?' && !followUpSent) {
      setFollowUpSent(true);
      typeAgentParts(FOLLOW_UP_PARTS);
    } else {
      typeAgentParts([[{ type: 'text', content: "Thanks for your message! I'll look into that for you right away." }]]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openSubPanel = (panel: string, backTitle: string) => {
    setSubPanel(panel);
    setSubPanelBackTitle(backTitle);
  };

  /* ── Knowledge table data ── */
  const totalCommunity = COMMUNITY_RESOURCES.length;
  const communityTotalPages = Math.ceil(totalCommunity / PAGE_SIZE);
  const communityStart = (communityPage - 1) * PAGE_SIZE;
  const communityEnd = Math.min(communityStart + PAGE_SIZE, totalCommunity);
  const pagedCommunity = COMMUNITY_RESOURCES.slice(communityStart, communityEnd);

  const allOnPageSelected = knowledgeTab === 'community'
    ? pagedCommunity.length > 0 && pagedCommunity.every((_, i) => selectedRows.has(communityStart + i))
    : CUSTOM_RESOURCES.every((_, i) => selectedRows.has(i));

  const toggleSelectAll = () => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      const indices = knowledgeTab === 'community'
        ? pagedCommunity.map((_, i) => communityStart + i)
        : CUSTOM_RESOURCES.map((_, i) => i);
      if (allOnPageSelected) {
        indices.forEach(i => next.delete(i));
      } else {
        indices.forEach(i => next.add(i));
      }
      return next;
    });
  };

  const toggleRowSelect = (idx: number) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  /* ── Input area (shared between landing and chat) ── */
  const renderInputArea = (placeholder: string, rows = 1) => (
    <div className="border border-secondary rounded-xl p-4 bg-primary">
      <textarea
        value={inputText}
        onChange={e => setInputText(e.target.value)}
        onKeyDown={handleKeyDown as React.KeyboardEventHandler<HTMLTextAreaElement>}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-transparent resize-none outline-none text-sm text-primary placeholder:text-tertiary"
      />
      <div className="flex items-center justify-between mt-3">
        <button className="p-1 text-tertiary hover:text-primary transition-colors">
          <Icon name="paperclip" size="sm" />
        </button>
        <div className="flex items-center gap-2">
          <button className="p-1 text-tertiary hover:text-primary transition-colors">
            <Icon name="microphone" size="sm" />
          </button>
          <button
            onClick={handleSend}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              inputText.trim() ? 'bg-inverse text-inverse' : 'bg-secondary text-tertiary'
            }`}
          >
            <Icon name="send" size="sm" />
          </button>
        </div>
      </div>
    </div>
  );

  /* ── Message renderer ── */
  const renderMessagePart = (part: MessagePart, idx: number) => {
    if (part.type === 'text') {
      return (
        <Typography key={idx} variant="body-md" color="primary">
          <span>{parseBold(part.content)}</span>
        </Typography>
      );
    }
    if (part.type === 'card') {
      return (
        <div key={idx} className="border border-secondary rounded-lg p-4 flex items-center gap-3 mt-1">
          <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
            <Icon name="book" size="sm" />
          </div>
          <Typography variant="label-sm" color="primary" className="flex-1">
            <span>{part.title}</span>
          </Typography>
          <Button variant="outline" size="sm">Open</Button>
        </div>
      );
    }
    return null;
  };

  /* ── Sidebar content ── */
  const renderGuidanceContent = () => (
    <div className="flex flex-col">
      {/* Instructions */}
      <div className="px-4 py-4 flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <Typography variant="label-sm" color="primary">Instructions</Typography>
          <button className="text-tertiary hover:text-primary">
            <Icon name="circle-questionmark" size="sm" />
          </button>
        </div>
        <Typography variant="caption" color="tertiary">What should the agent do?</Typography>
        <TextArea
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
          placeholder="Describe what the agent should do and how it should respond. Be direct, specific, and easy to understand."
          resize="none"
          autoSize={{ minRows: 4 }}
        />
      </div>

      <div className="border-t border-secondary" />

      {/* Tone */}
      <div className="px-4 py-4 flex flex-col gap-3">
        <Typography variant="label-sm" color="primary">How should the agent sound?</Typography>
        <div className="flex gap-2">
          {(['neutral', 'friendly', 'concise', 'descriptive'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors capitalize ${
                tone === t
                  ? 'border-2 border-primary bg-secondary text-primary'
                  : 'border border-secondary text-secondary hover:border-primary'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-secondary" />

      {/* Escalation */}
      <div className="px-4 py-4 flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <Typography variant="label-sm" color="primary">Escalation</Typography>
          <button className="text-tertiary hover:text-primary">
            <Icon name="circle-questionmark" size="sm" />
          </button>
        </div>
        <Typography variant="caption" color="tertiary">When should the agent hand over to your team?</Typography>
        <button
          onClick={() => openSubPanel('escalation', 'Escalation')}
          className="flex items-center gap-3 py-2 hover:bg-secondary rounded-lg px-2 -mx-2 transition-colors"
        >
          <Icon name="sparkles" size="sm" className="text-tertiary" />
          <Typography variant="body-sm" color="primary" className="flex-1 text-left">Escalation rules</Typography>
          <Icon name="arrow-right" size="sm" className="text-tertiary" />
        </button>
      </div>
    </div>
  );

  const renderKnowledgeContent = () => (
    <div className="flex flex-col">
      {/* Content section */}
      <div className="px-4 py-4 flex flex-col gap-3">
        <Typography variant="label-sm" color="primary">Content</Typography>
        <div className="flex items-center gap-1.5">
          <Typography variant="caption" color="tertiary">What should the agent know?</Typography>
        </div>
        <button
          onClick={() => openSubPanel('knowledge-resources', 'Content')}
          className="flex items-center gap-3 py-2 hover:bg-secondary rounded-lg px-2 -mx-2 transition-colors"
        >
          <Icon name="book" size="sm" className="text-tertiary" />
          <Typography variant="body-sm" color="primary" className="flex-1 text-left">Knowledge and resources</Typography>
          <Icon name="arrow-right" size="sm" className="text-tertiary" />
        </button>

        {/* Circle Help Center */}
        <div className="flex items-start justify-between gap-3 py-2">
          <div className="flex flex-col gap-0.5">
            <Typography variant="body-sm" color="primary">Circle Help Center</Typography>
            <Typography variant="caption" color="tertiary">When answering platform questions, the agent will reference Help Center articles</Typography>
          </div>
          <div className="shrink-0 pt-0.5">
            <Switch checked={helpCenterEnabled} onCheckedChange={() => setHelpCenterEnabled(v => !v)} />
          </div>
        </div>
      </div>

      <div className="border-t border-secondary" />

      {/* Skip section */}
      <div className="px-4 py-4 flex flex-col gap-3">
        <Typography variant="label-sm" color="primary">What should the agent skip?</Typography>

        <div className="flex items-start justify-between gap-3 py-1">
          <div className="flex flex-col gap-0.5">
            <Typography variant="body-sm" color="primary">Member content</Typography>
            <Typography variant="caption" color="tertiary">Agent will only use posts, comments, events, and messages created by admins</Typography>
          </div>
          <div className="shrink-0 pt-0.5">
            <Switch checked={skipMemberContent} onCheckedChange={() => setSkipMemberContent(v => !v)} />
          </div>
        </div>

        <div className="flex items-start justify-between gap-3 py-1">
          <div className="flex flex-col gap-0.5">
            <Typography variant="body-sm" color="primary">Hidden posts</Typography>
            <Typography variant="caption" color="tertiary">Agent will skip posts hidden from featured areas</Typography>
          </div>
          <div className="shrink-0 pt-0.5">
            <Switch checked={skipHiddenPosts} onCheckedChange={() => setSkipHiddenPosts(v => !v)} />
          </div>
        </div>

        <div className="flex items-start justify-between gap-3 py-1">
          <div className="flex flex-col gap-0.5">
            <Typography variant="body-sm" color="primary">Old content</Typography>
            <Typography variant="caption" color="tertiary">Agent will skip content created before the selected date</Typography>
          </div>
          <div className="shrink-0 pt-0.5">
            <Switch checked={skipOldContent} onCheckedChange={() => setSkipOldContent(v => !v)} />
          </div>
        </div>
        {skipOldContent && (
          <input
            type="date"
            value={oldContentDate}
            onChange={e => setOldContentDate(e.target.value)}
            className="border border-secondary rounded-lg px-3 py-2 text-sm text-primary bg-primary w-full"
          />
        )}
      </div>
    </div>
  );

  const renderDistributionContent = () => (
    <div className="flex flex-col">
      {/* Channels */}
      <div className="px-4 py-4 flex flex-col gap-3">
        <Typography variant="label-sm" color="primary">Channels and audience</Typography>
        <Typography variant="caption" color="tertiary">How can members reach the agent?</Typography>

        <div className="flex items-start justify-between gap-3 py-1">
          <div className="flex items-center gap-1.5">
            <Typography variant="body-sm" color="primary">Direct messages</Typography>
            <button className="text-tertiary hover:text-primary">
              <Icon name="circle-questionmark" size="sm" />
            </button>
          </div>
          <Switch checked={dmEnabled} onCheckedChange={() => setDmEnabled(v => !v)} />
        </div>

        <div className="flex items-start justify-between gap-3 py-1">
          <div className="flex flex-col gap-0.5 flex-1">
            <div className="flex items-center gap-1.5">
              <Typography variant="body-sm" color="primary">Search results</Typography>
              <button className="text-tertiary hover:text-primary">
                <Icon name="circle-questionmark" size="sm" />
              </button>
            </div>
            <Typography variant="caption" color="tertiary">Members can start a conversation with the agent from search results</Typography>
          </div>
          <div className="shrink-0 pt-0.5">
            <Switch checked={searchEnabled} onCheckedChange={() => setSearchEnabled(v => !v)} />
          </div>
        </div>

        <div className="flex items-start justify-between gap-3 py-1">
          <div className="flex flex-col gap-0.5 flex-1">
            <div className="flex items-center gap-1.5">
              <Typography variant="body-sm" color="primary">Welcome message</Typography>
              <button className="text-tertiary hover:text-primary">
                <Icon name="circle-questionmark" size="sm" />
              </button>
            </div>
            <Typography variant="caption" color="tertiary">Agent will message members when they first join</Typography>
          </div>
          <div className="shrink-0 pt-0.5">
            <Switch checked={welcomeEnabled} onCheckedChange={() => setWelcomeEnabled(v => !v)} />
          </div>
        </div>
        {welcomeEnabled && (
          <TextArea
            value={welcomeText}
            onChange={e => setWelcomeText(e.target.value)}
            resize="none"
            autoSize={{ minRows: 3 }}
          />
        )}
      </div>

      <div className="border-t border-secondary" />

      {/* Audience */}
      <div className="px-4 py-4 flex flex-col gap-3">
        <Typography variant="label-sm" color="primary">Who can see the agent?</Typography>
        <Typography variant="caption" color="tertiary">Only members who match these rules will see the agent</Typography>
        <div className="border border-secondary rounded-lg p-3 flex items-center gap-3">
          <Icon name="people-circle" size="sm" className="text-tertiary" />
          <Typography variant="body-sm" color="primary" className="flex-1">14 members</Typography>
          <div className="flex items-center gap-1.5 flex-wrap">
            {['Name', 'Email', 'Joined'].map(f => (
              <button key={f} className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-secondary text-xs text-primary hover:bg-secondary transition-colors">
                {f} <Icon name="arrow-right" size="sm" className="rotate-90" />
              </button>
            ))}
            <button className="p-1 rounded-md border border-secondary hover:bg-secondary transition-colors">
              <Icon name="filter" size="sm" className="text-tertiary" />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-secondary" />

      {/* Automations */}
      <div className="px-4 py-4 flex flex-col gap-3">
        <Typography variant="label-sm" color="primary">Automations</Typography>
        <Typography variant="caption" color="tertiary">When should the agent act on its own?</Typography>
        <button
          onClick={() => openSubPanel('workflows', 'Automations')}
          className="flex items-center gap-3 py-2 hover:bg-secondary rounded-lg px-2 -mx-2 transition-colors"
        >
          <Icon name="zap" size="sm" className="text-tertiary" />
          <Typography variant="body-sm" color="primary" className="flex-1 text-left">Workflows</Typography>
          <Icon name="arrow-right" size="sm" className="text-tertiary" />
        </button>
      </div>
    </div>
  );

  const renderEscalationSubPanel = () => (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="px-4 py-4 flex flex-col gap-4">
        <Typography variant="heading-md" color="primary">Escalation rules</Typography>
        <Typography variant="body-sm" color="secondary">
          When a member uses a trigger keyword, the agent will pause and hand over to your team
        </Typography>

        {/* Keywords */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <Typography variant="label-sm" color="primary">Keywords</Typography>
            <button className="text-tertiary hover:text-primary">
              <Icon name="circle-questionmark" size="sm" />
            </button>
          </div>
          <div className="flex items-center border border-secondary rounded-lg px-3 py-2 gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={e => setNewKeyword(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && newKeyword.trim()) {
                  setEscalationKeywords(prev => [...prev, newKeyword.trim()]);
                  setNewKeyword('');
                  e.preventDefault();
                }
              }}
              placeholder="Add words or phrases"
              className="flex-1 text-sm bg-transparent outline-none text-primary placeholder-tertiary"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {escalationKeywords.map(kw => (
              <span key={kw} className="inline-flex items-center gap-1 pl-3 pr-2 py-1 rounded-full border border-secondary text-sm text-primary">
                {kw}
                <button
                  onClick={() => setEscalationKeywords(prev => prev.filter(k => k !== kw))}
                  className="text-tertiary hover:text-primary ml-0.5"
                >
                  <Icon name="cross" size="sm" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-secondary" />

        {/* Handover message */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <Typography variant="label-sm" color="primary">Handover message</Typography>
            <button className="text-tertiary hover:text-primary">
              <Icon name="circle-questionmark" size="sm" />
            </button>
          </div>
          <TextArea
            value={handoverMessage}
            onChange={e => setHandoverMessage(e.target.value)}
            resize="none"
            autoSize={{ minRows: 3 }}
          />
        </div>

        <div className="border-t border-secondary" />

        {/* Alert admins */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <Typography variant="body-sm" color="primary">Alert admins</Typography>
            <Typography variant="caption" color="tertiary">Notify specific admins when a handover happens.</Typography>
          </div>
          <Switch checked={alertAdmins} onCheckedChange={() => setAlertAdmins(v => !v)} />
        </div>
        {alertAdmins && (
          <Select
            aria-label="Select admins"
            options={[
              { label: 'Admin One', value: 'admin1' },
              { label: 'Admin Two', value: 'admin2' },
            ]}
            placeholder="Select admins"
          />
        )}
      </div>
    </div>
  );

  const renderKnowledgeResourcesSubPanel = () => {
    const tableData = knowledgeTab === 'community' ? pagedCommunity : CUSTOM_RESOURCES;
    const tableOffset = knowledgeTab === 'community' ? communityStart : 0;

    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-4 flex flex-col gap-4">
            <Typography variant="heading-md" color="primary">Knowledge and resources</Typography>

            {/* Sub-tabs */}
            <div className="flex gap-1">
              {(['community', 'custom'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => { setKnowledgeTab(t); setCommunityPage(1); setSelectedRows(new Set()); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${
                    knowledgeTab === t
                      ? 'bg-secondary border-primary text-primary'
                      : 'border-secondary text-secondary hover:border-primary'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* Count + Import */}
            <div className="flex items-center justify-between">
              <Typography variant="body-sm" color="secondary">
                {knowledgeTab === 'community' ? '43 spaces' : '3 custom resources'}
              </Typography>
              <Button variant="outline" size="sm">Import</Button>
            </div>
          </div>

          {/* Table */}
          <div className="px-4">
          <Table.Root columns="36px 1fr 80px">
            <Table.Header>
              <Table.HeaderRow>
                <Table.HeaderCell isActionCell>
                  <Checkbox checked={allOnPageSelected} onCheckedChange={toggleSelectAll} />
                </Table.HeaderCell>
                <Table.HeaderCell text="Title" />
                <Table.HeaderCell text="Type" />
              </Table.HeaderRow>
            </Table.Header>
            <Table.Body>
              {tableData.map((row, i) => {
                const absIdx = tableOffset + i;
                return (
                  <Table.Row key={absIdx}>
                    <Table.BaseCell isActionCell>
                      <Checkbox
                        checked={selectedRows.has(absIdx)}
                        onCheckedChange={() => toggleRowSelect(absIdx)}
                      />
                    </Table.BaseCell>
                    <Table.TextCell text={row.title} />
                    <Table.BaseCell>
                      <Badge variant="secondary" label={row.type} />
                    </Table.BaseCell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
          </div>

          {/* Pagination */}
          {knowledgeTab === 'community' && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-secondary">
              <Typography variant="caption" color="tertiary">
                Showing {communityStart + 1}–{communityEnd} of {totalCommunity}
              </Typography>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCommunityPage(p => Math.max(1, p - 1))}
                  disabled={communityPage === 1}
                  className="p-1.5 rounded-md border border-secondary disabled:opacity-40 hover:bg-secondary transition-colors"
                >
                  <Icon name="arrow-left" size="sm" />
                </button>
                <button
                  onClick={() => setCommunityPage(p => Math.min(communityTotalPages, p + 1))}
                  disabled={communityPage === communityTotalPages}
                  className="p-1.5 rounded-md border border-secondary disabled:opacity-40 hover:bg-secondary transition-colors"
                >
                  <Icon name="arrow-right" size="sm" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderWorkflowsSubPanel = () => (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="px-4 py-4 flex flex-col gap-4">
        <Typography variant="heading-md" color="primary">Workflows</Typography>

        <div className="flex items-center justify-between">
          <Typography variant="body-sm" color="secondary">2 workflows</Typography>
          <Button variant="outline" size="sm">New workflow</Button>
        </div>

        <Table.Root columns="1fr 80px">
          <Table.Header>
            <Table.HeaderRow>
              <Table.HeaderCell text="Name" />
              <Table.HeaderCell text="Active" />
            </Table.HeaderRow>
          </Table.Header>
          <Table.Body>
            {['Agent welcomes new members', 'Gather feedback via DM'].map((name, i) => (
              <Table.Row key={name}>
                <Table.TextCell text={name} />
                <Table.BaseCell isActionCell>
                  <Switch
                    checked={workflowSwitches[i]}
                    onCheckedChange={() => setWorkflowSwitches(prev => {
                      const next = [...prev];
                      next[i] = !next[i];
                      return next;
                    })}
                  />
                </Table.BaseCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
    </div>
  );

  const renderSubPanelContent = () => {
    if (subPanel === 'escalation') return renderEscalationSubPanel();
    if (subPanel === 'knowledge-resources') return renderKnowledgeResourcesSubPanel();
    if (subPanel === 'workflows') return renderWorkflowsSubPanel();
    return null;
  };

  const renderSidebarMainContent = () => {
    if (sidebarTab === 'guidance') return renderGuidanceContent();
    if (sidebarTab === 'knowledge') return renderKnowledgeContent();
    if (sidebarTab === 'distribution') return renderDistributionContent();
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-primary">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-secondary flex-shrink-0">
        {/* Breadcrumb */}
        <div
          onClick={e => {
            const anchor = (e.target as HTMLElement).closest('a');
            if (anchor) { e.preventDefault(); onBack(); }
          }}
        >
          <BreadCrumbs
            size="sm"
            items={[
              { label: 'Agents', href: '#' },
              { label: agentName || agent.name },
            ]}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-sm ${
              sidebarOpen
                ? 'bg-secondary text-primary'
                : 'text-secondary hover:text-primary'
            }`}
          >
            <Icon name="settings-gear" size="sm" />
            <span>Settings</span>
          </button>
          <Button variant="outline" size="sm">Save</Button>
          <Button variant="primary" size="sm">Enable</Button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Main content area ── */}
        <div className="flex-1 relative overflow-hidden">
          {/* Landing view */}
          <div
            className={`absolute inset-0 overflow-y-auto transition-opacity duration-300 ${
              chatStarted ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <div className="min-h-full flex items-center justify-center py-10">
            <div className="px-8 flex flex-col gap-6 w-full max-w-[640px]">

              {/* Agent identity */}
              <div className="flex flex-col gap-3">
                <img
                  src="/images/circle-agent.png"
                  alt="Agent"
                  className="w-16 h-16 rounded-full object-cover"
                />

                {/* Editable name */}
                {editingName ? (
                  <input
                    autoFocus
                    value={agentName}
                    
                    onChange={e => setAgentName(e.target.value)}
                    onBlur={() => setEditingName(false)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setEditingName(false); }}
                    placeholder="Name your agent"
                    className="bg-transparent outline-none w-full placeholder:text-tertiary text-primary text-2xl font-bold"
                  />
                ) : (
                  <Typography
                    variant="heading-xl"
                    color="primary"
                    onDoubleClick={() => setEditingName(true)}
                    className="cursor-text select-none"
                  >
                    {agentName || <span className="text-tertiary">Name your agent</span>}
                  </Typography>
                )}

                {/* Editable description */}
                {editingDesc ? (
                  <input
                    autoFocus
                    value={agentDesc}
                    onChange={e => setAgentDesc(e.target.value)}
                    onBlur={() => setEditingDesc(false)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setEditingDesc(false); }}
                    placeholder="Add a description..."
                    className="bg-transparent outline-none w-full text-secondary placeholder:text-tertiary text-base"
                  />
                ) : (
                  <Typography
                    variant="body-md"
                    color="secondary"
                    onDoubleClick={() => setEditingDesc(true)}
                    className="cursor-text select-none"
                  >
                    {agentDesc || <span className="text-tertiary">Add a description...</span>}
                  </Typography>
                )}
              </div>

              {/* Input + hints */}
              <div className="flex flex-col gap-1 pb-1 rounded-b-xl bg-secondary">
                {renderInputArea('Ask anything...', 2)}
                {hintsVisible && (
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-3 text-xs text-tertiary">
                      <span className="flex items-center gap-1">
                        <Icon name="hashtag" size="sm" /> for mentions
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="slash" size="sm" /> for skills
                      </span>
                    </div>
                    <button onClick={() => setHintsVisible(false)} className="text-tertiary hover:text-primary transition-colors">
                      <Icon name="cross" size="sm" />
                    </button>
                  </div>
                )}
              </div>

              {/* Draggable suggestions */}
              <div className="flex flex-col">
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={suggestion}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={e => handleDragOver(e, idx)}
                    onDrop={() => handleDrop(idx)}
                    onDragEnd={handleDragEnd}
                    className={`group flex items-center gap-2 py-2 px-1 rounded-lg transition-colors ${
                      dragOverIndex === idx ? 'bg-secondary/80' : 'hover:bg-secondary'
                    }`}
                  >
                    {/* Drag handle */}
                    <span className="flex-shrink-0 text-tertiary cursor-grab active:cursor-grabbing">
                      <Icon name="drag" size="sm" />
                    </span>

                    {/* Text + inline arrow */}
                    <button
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex items-center gap-1 text-left flex-1 min-w-0"
                    >
                      <Typography variant="body-sm" color="primary">{suggestion}</Typography>
                      <span className="flex-shrink-0 text-tertiary opacity-0 group-hover:opacity-100 transition-opacity">
                        <Icon name="arrow-up-right" size="sm" />
                      </span>
                    </button>
                  </div>
                ))}
              </div>

            </div>
            </div>
          </div>

          {/* Chat view */}
          <div
            className={`absolute inset-0 flex flex-col transition-opacity duration-300 ${
              chatStarted ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Messages — 678px centred */}
            <div className="flex-1 overflow-y-auto py-6">
              <div className="max-w-[678px] mx-auto flex flex-col gap-4 px-4">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'user' ? (
                      <div className="bg-secondary rounded-2xl px-4 py-3">
                        {msg.parts.map((part, i) =>
                          part.type === 'text' ? (
                            <Typography key={i} variant="body-md" color="primary">
                              <span>{parseBold(part.content)}</span>
                            </Typography>
                          ) : null
                        )}
                      </div>
                    ) : (
                      <div className="w-full flex flex-col gap-2">
                        {msg.parts.map((part, i) => renderMessagePart(part, i))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {isAgentTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1 px-4 py-3 bg-secondary rounded-2xl">
                      {[0, 1, 2].map(i => (
                        <span
                          key={i}
                          className="w-2 h-2 rounded-full bg-tertiary animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Sticky input — no top border, 678px centred */}
            <div className="flex-shrink-0 py-4">
              <div className="max-w-[678px] mx-auto px-4 flex flex-col">
                {renderInputArea('Type to reply...')}
                {/* Hints bar sits directly below the input */}
                {hintsVisible && (
                  <div className="flex items-center justify-between py-1 px-1 rounded-b-xl bg-secondary">
                    <div className="flex items-center gap-3 text-xs text-tertiary">
                      <span className="flex items-center gap-1.5">
                        <Icon name="hashtag" size="sm" /> for mentions
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Icon name="slash" size="sm" /> for skills
                      </span>
                    </div>
                    <button
                      onClick={() => setHintsVisible(false)}
                      className="text-tertiary hover:text-primary transition-colors"
                      aria-label="Dismiss hints"
                    >
                      <Icon name="cross" size="sm" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Settings Sidebar ── */}
        <div
          className={`flex-shrink-0 border-l border-secondary overflow-hidden transition-all duration-300 ease-out ${
            sidebarOpen ? 'w-[380px]' : 'w-0'
          }`}
        >
          <div className="w-[380px] h-full flex flex-col bg-primary">
            {/* Sidebar header */}
            <div className="flex items-center gap-2 px-4 border-b border-secondary flex-shrink-0">
              {subPanel ? (
                <div className="flex items-center gap-2 flex-1 py-3">
                  <button
                    onClick={() => setSubPanel(null)}
                    className="flex items-center gap-1.5 text-secondary hover:text-primary transition-colors"
                  >
                    <Icon name="arrow-left" size="sm" />
                  </button>
                  <Typography variant="label-md" color="primary">
                    {SUB_PANEL_TITLE[subPanel] ?? subPanel}
                  </Typography>
                </div>
              ) : (
                <div className="flex-1 py-3">
                  <Tabs.Root
                    tabs={SIDEBAR_TABS}
                    selectedValue={sidebarTab}
                    onValueChange={v => setSidebarTab(v as typeof sidebarTab)}
                    size="sm"
                  />
                </div>
              )}
              <IconButton
                variant="ghost"
                size="sm"
                icon="cross"
                aria-label="Close settings"
                onClick={() => setSidebarOpen(false)}
              />
            </div>

            {/* Sliding content area */}
            <div className="flex-1 relative overflow-hidden">
              {/* Main panel */}
              <div
                className={`absolute inset-0 overflow-y-auto transition-transform duration-300 ease-out ${
                  subPanel ? '-translate-x-full' : 'translate-x-0'
                }`}
              >
                {renderSidebarMainContent()}
              </div>

              {/* Sub-panel */}
              <div
                className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-out ${
                  subPanel ? 'translate-x-0' : 'translate-x-full'
                }`}
              >
                {renderSubPanelContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailPage;
