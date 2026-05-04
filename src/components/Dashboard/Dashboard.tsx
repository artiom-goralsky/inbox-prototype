import React, { useState, useRef, useEffect } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Button } from '@circleco/compass/components/Button';
import { Link } from '@circleco/compass/components/Link';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Badge } from '@circleco/compass/components/Badge';
import { Icon, type IconName } from '@circleco/compass/components/Icon';
import { IconButton } from '@circleco/compass/components/IconButton';
import type { AssetItem } from '../shared/AssetDetailSidebar';
import SkillPicker, { SkillTag } from '../shared/SkillPicker';
import type { Skill } from '../shared/skillData';
import NewCommunityFlow from './NewCommunityFlow';

interface DashboardProps {
  onToggleSidebar: () => void;
  onOpenCopilot?: (chatId?: string, message?: string, sourceRect?: DOMRect) => void;
  onItemClick?: (item: AssetItem) => void;
  onShortcutClick?: (label: string) => void;
  /** Increment to trigger a glow animation on the message box */
  pulseInput?: number;
  onCreateProject?: (typeId: string, answers: string[]) => void;
}



const MAX_CATEGORY_ITEMS = 7; // longest category — keeps panel height stable when switching
const ITEM_HEIGHT_PX = 44;   // py-3 (24px) + text-sm line-height (20px)

const SHORTCUT_CATEGORIES = [
  {
    label: 'Set up',
    icon: 'sparkle' as IconName,
    items: [
      'Create my spaces and community structure',
      'Configure access groups and permissions',
      'Set up my custom domain and branding',
      'Apply a community template for my business type',
      'Restructure and reorganize my existing community',
      'Set up navigation and landing pages',
      'Customize colors, logos, and email templates',
    ],
  },
  {
    label: 'Members',
    icon: 'group' as IconName,
    items: [
      'Invite and onboard my first members',
      'Tag and segment members for targeting',
      'Manage roles, moderators, and permissions',
      'Bulk import or migrate members from another platform',
      'Design my new member onboarding journey',
      'Identify members at risk of churning',
    ],
  },
  {
    label: 'Content',
    icon: 'file' as IconName,
    items: [
      'Create and publish posts to my community',
      'Build a course with lessons and modules',
      'Set up drip content and course scheduling',
      'Plan a content calendar for engagement',
      'Schedule events and livestreams',
      'Get help with rich media, embeds, and formatting',
    ],
  },
  {
    label: 'Monetize',
    icon: 'money-hand' as IconName,
    items: [
      'Set up my paywall and pricing tiers',
      'Help me figure out the right pricing strategy',
      'Connect Stripe and configure payments',
      'Set up an affiliate or referral program',
      'Understand my revenue and subscription metrics',
      'Recover failed payments automatically',
    ],
  },
  {
    label: 'Grow',
    icon: 'target' as IconName,
    items: [
      'Review my engagement metrics and what\'s working',
      'Set up gamification to boost participation',
      'Build a growth strategy for my community',
      'Automate re-engagement for inactive members',
      'Identify and nurture my top community champions',
      'Run a cohort or funnel analysis',
      'Plan my community launch sequence',
    ],
  },
  {
    label: 'Strategize',
    icon: 'compass' as IconName,
    items: [
      'Help me build the right business model',
      'Set up automated workflows and emails',
      'Configure moderation rules and content safety',
      'Run a community health audit',
      'Troubleshoot setup issues and integrations',
      'Create community guidelines',
      'Plan for scaling — what do I need next?',
    ],
  },
];


const getTimeGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const getDisplayName = () => {
  const param = new URLSearchParams(window.location.search).get('name');
  if (param) { localStorage.setItem('protoUserName', param); return param; }
  return localStorage.getItem('protoUserName') || 'Rudy';
};

const Dashboard: React.FC<DashboardProps> = ({ onOpenCopilot, onItemClick: _onItemClick, onShortcutClick, pulseInput = 0, onCreateProject }) => {
  const [message, setMessage] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [headingPhase, setHeadingPhase] = useState<'greeting' | 'fading' | 'today'>('greeting');
  const displayName = getDisplayName();
  const [slashQuery, setSlashQuery] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [isItemsClosing, setIsItemsClosing] = useState(false);
  const [recentChatsEntering, setRecentChatsEntering] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  type CommunityType = 'existing' | 'new-community';
  const [communityType, setCommunityType] = useState<CommunityType>('existing');
  const [showOnboardingCard, setShowOnboardingCard] = useState(false);
  const skillSectionRef = useRef<HTMLDivElement>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputFormRef = useRef<HTMLFormElement>(null);

  // Heading: greeting → "What do you want to do today?" after 10s
  useEffect(() => {
    const fade = setTimeout(() => setHeadingPhase('fading'), 6000);
    const swap = setTimeout(() => setHeadingPhase('today'), 6400);
    return () => { clearTimeout(fade); clearTimeout(swap); };
  }, []);

  // Trigger glow animation only when pulseInput actually increments (not on mount)
  const prevPulseRef = useRef(pulseInput);
  useEffect(() => {
    if (pulseInput === prevPulseRef.current) return;
    prevPulseRef.current = pulseInput;
    setIsGlowing(true);
    textareaRef.current?.focus();
    const t = setTimeout(() => setIsGlowing(false), 1900);
    return () => clearTimeout(t);
  }, [pulseInput]);

  const closeItems = () => {
    if (!openCategory || isItemsClosing) return;
    setIsItemsClosing(true);
  };

  const handleCategoryClick = (label: string) => {
    if (openCategory === label) {
      closeItems();
    } else {
      setIsItemsClosing(false);
      setOpenCategory(label);
    }
  };

  const closeItemsRef = useRef(closeItems);
  closeItemsRef.current = closeItems;

  useEffect(() => {
    if (!openCategory) return;
    const handleClick = (e: MouseEvent) => {
      if (skillSectionRef.current && !skillSectionRef.current.contains(e.target as Node)) {
        closeItemsRef.current();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openCategory]);

  useEffect(() => () => { if (fadeTimer.current) clearTimeout(fadeTimer.current); }, []);

  type OverviewTab =
    | 'audience'
    | 'engagement'
    | 'broadcast'
    | 'website'
    | 'payments'
    | 'discover';
  const [overviewTab, setOverviewTab] = useState<OverviewTab>('audience');

  const todayFocusTasks = [
    {
      text: 'Your event "UX Mastery Bootcamp" is in 3 days. I\'ve prepared a run-of-show and follow-up sequence.',
      from: 'circle-ai',
      avatar: '/ai-avatar.png',
    },
    {
      text: '6 new members joined this week but haven\'t posted yet. Want me to send them a nudge?',
      from: 'circle-ai',
      avatar: '/ai-avatar.png',
    },
    {
      text: '2 trials expire today. I\'ve drafted a personalized upgrade message for each — ready to send.',
      from: 'circle-ai',
      avatar: '/ai-avatar.png',
    },
  ];

  const handleOverviewTabChange = (value: string) => {
    setOverviewTab(value as OverviewTab);
  };

  const overviewTabs = [
    { label: 'Audience', value: 'audience' },
    { label: 'Engagement', value: 'engagement' },
    { label: 'Broadcast', value: 'broadcast' },
    { label: 'Website', value: 'website' },
    { label: 'Payments', value: 'payments' },
    { label: 'Discover', value: 'discover' },
  ] as const;

  const overviewMetricsByTab: Record<
    OverviewTab,
    {
      label: string;
      value: string;
      delta: string;
      trend: 'up' | 'down';
      emphasized?: boolean;
    }[]
  > = {
    audience: [
      {
        label: 'Total members',
        value: '1,035',
        delta: '0.3%',
        trend: 'up',
        emphasized: true,
      },
      { label: 'Active members', value: '845', delta: '0.3%', trend: 'up' },
      {
        label: 'Inactive members',
        value: '15.2',
        delta: '-.3%',
        trend: 'down',
      },
      { label: 'New members', value: '6', delta: '0.3%', trend: 'up' },
    ],
    engagement: [
      {
        label: 'Total posts',
        value: '248',
        delta: '1.2%',
        trend: 'up',
        emphasized: true,
      },
      { label: 'Comments', value: '1.8k', delta: '0.9%', trend: 'up' },
      { label: 'Reactions', value: '3.4k', delta: '-0.2%', trend: 'down' },
      { label: 'New posts', value: '12', delta: '0.6%', trend: 'up' },
    ],
    broadcast: [
      {
        label: 'Broadcasts sent',
        value: '12',
        delta: '0.8%',
        trend: 'up',
        emphasized: true,
      },
      { label: 'Open rate', value: '41%', delta: '0.4%', trend: 'up' },
      { label: 'Click rate', value: '3.2%', delta: '-0.1%', trend: 'down' },
      { label: 'Unsubscribes', value: '0.2%', delta: '0.0%', trend: 'up' },
    ],
    website: [
      {
        label: 'Total members',
        value: '1,035',
        delta: '0.3%',
        trend: 'up',
        emphasized: true,
      },
      { label: 'Active members', value: '845', delta: '0.3%', trend: 'up' },
      {
        label: 'Inactive members',
        value: '15.2',
        delta: '-.3%',
        trend: 'down',
      },
      { label: 'New members', value: '6', delta: '0.3%', trend: 'up' },
    ],
    payments: [
      {
        label: 'Total members',
        value: '1,035',
        delta: '0.3%',
        trend: 'up',
        emphasized: true,
      },
      { label: 'Active members', value: '845', delta: '0.3%', trend: 'up' },
      {
        label: 'Inactive members',
        value: '15.2',
        delta: '-.3%',
        trend: 'down',
      },
      { label: 'New members', value: '6', delta: '0.3%', trend: 'up' },
    ],
    discover: [
      {
        label: 'Total members',
        value: '1,035',
        delta: '0.3%',
        trend: 'up',
        emphasized: true,
      },
      { label: 'Active members', value: '845', delta: '0.3%', trend: 'up' },
      {
        label: 'Inactive members',
        value: '15.2',
        delta: '-.3%',
        trend: 'down',
      },
      { label: 'New members', value: '6', delta: '0.3%', trend: 'up' },
    ],
  };

  const chartByTab: Record<
    OverviewTab,
    {
      dashed: string;
      solid: string;
      area: string;
    }
  > = {
    audience: {
      dashed:
        '10,100 30,92 50,88 70,84 90,86 110,78 130,82 150,74 170,80 190,72',
      solid: '10,76 30,72 50,64 70,70 90,52 110,90 130,58 150,66 170,42 190,70',
      area: '10,120 10,76 30,72 50,64 70,70 90,52 110,90 130,58 150,66 170,42 190,70 190,120',
    },
    engagement: {
      dashed:
        '10,96 30,90 50,94 70,88 90,92 110,84 130,86 150,80 170,82 190,78',
      solid: '10,78 30,70 50,74 70,60 90,72 110,54 130,66 150,58 170,62 190,50',
      area: '10,120 10,78 30,70 50,74 70,60 90,72 110,54 130,66 150,58 170,62 190,50 190,120',
    },
    broadcast: {
      dashed:
        '10,98 30,94 50,90 70,92 90,88 110,86 130,90 150,84 170,86 190,82',
      solid: '10,80 30,74 50,66 70,70 90,60 110,64 130,56 150,60 170,52 190,58',
      area: '10,120 10,80 30,74 50,66 70,70 90,60 110,64 130,56 150,60 170,52 190,58 190,120',
    },
    website: {
      dashed:
        '10,100 30,92 50,88 70,84 90,86 110,78 130,82 150,74 170,80 190,72',
      solid: '10,76 30,72 50,64 70,70 90,52 110,90 130,58 150,66 170,42 190,70',
      area: '10,120 10,76 30,72 50,64 70,70 90,52 110,90 130,58 150,66 170,42 190,70 190,120',
    },
    payments: {
      dashed:
        '10,100 30,92 50,88 70,84 90,86 110,78 130,82 150,74 170,80 190,72',
      solid: '10,76 30,72 50,64 70,70 90,52 110,90 130,58 150,66 170,42 190,70',
      area: '10,120 10,76 30,72 50,64 70,70 90,52 110,90 130,58 150,66 170,42 190,70 190,120',
    },
    discover: {
      dashed:
        '10,100 30,92 50,88 70,84 90,86 110,78 130,82 150,74 170,80 190,72',
      solid: '10,76 30,72 50,64 70,70 90,52 110,90 130,58 150,66 170,42 190,70',
      area: '10,120 10,76 30,72 50,64 70,70 90,52 110,90 130,58 150,66 170,42 190,70 190,120',
    },
  };

  const overviewMetrics = overviewMetricsByTab[overviewTab];
  const chart = chartByTab[overviewTab];

  return (
    <div className="relative bg-primary h-full flex flex-col overflow-hidden">
      {/* Atmospheric focus gradient */}
      <div className={`input-focus-gradient${isGlowing ? ' active' : ''}`} />
      {/* Top bar */}
      <div className="shrink-0 flex items-center justify-between h-16 px-4">
        <Typography variant="label-sm" color="primary">
          New chat
        </Typography>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setCommunityType('new-community')}
            className={`text-sm transition-colors ${communityType === 'new-community' ? 'text-[color:var(--color-text-primary)] font-medium' : 'text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-secondary)]'}`}
          >
            New community
          </button>
          <button
            type="button"
            onClick={() => setCommunityType('existing')}
            className={`text-sm transition-colors ${communityType === 'existing' ? 'text-[color:var(--color-text-primary)] font-medium' : 'text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-secondary)]'}`}
          >
            Existing
          </button>
        </div>
      </div>

      {/* New community flow — replaces dashboard content */}
      {communityType === 'new-community' ? (
        <NewCommunityFlow
          onSkipToChat={(msg) => {
            setCommunityType('existing');
            setShowOnboardingCard(true);
            onOpenCopilot?.(undefined, msg);
          }}
          onCreateProject={(typeId, _steps, answers) => {
            onCreateProject?.(typeId, answers);
          }}
        />
      ) : (
      /* Scrollable content — vertically centered */
      <div className="flex-1 min-h-0 overflow-auto flex flex-col">
        <div className="w-full max-w-[670px] mx-auto flex flex-col gap-10 items-center py-16 my-auto min-h-[840px]">

          {/* Heading */}
          <h1
            className="text-[32px] font-semibold leading-[48px] tracking-[-1px] text-center w-full text-primary transition-opacity duration-400 ease-out"
            style={{ fontFamily: "'Inter Variable', Inter, sans-serif", opacity: headingPhase === 'fading' ? 0 : 1 }}
          >
            {headingPhase === 'today'
              ? 'What do you want to do today?'
              : `${getTimeGreeting()}${displayName ? `, ${displayName}` : ''}.`}
          </h1>

          {/* Message box */}
          <form
            ref={inputFormRef}
            className={`relative w-full bg-primary rounded-2xl flex flex-col gap-4 px-4 py-3 min-h-[131px] input-shimmer ${isGlowing ? 'shimmer-active' : 'shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_3px_12px_-4px_rgba(0,0,0,0.1),0px_4px_16px_-8px_rgba(0,0,0,0.1)]'}`}
            onSubmit={e => {
              e.preventDefault();
              const rect = inputFormRef.current?.getBoundingClientRect();
              if (selectedSkill) {
                onShortcutClick?.(selectedSkill.name);
              } else {
                onOpenCopilot?.(undefined, message || undefined, rect);
              }
              setMessage('');
              setSelectedSkill(null);
            }}
          >
            {/* Skill picker dropdown */}
            {slashQuery !== null && (
              <SkillPicker
                query={slashQuery}
                onSelect={skill => {
                  setSelectedSkill(skill);
                  setSlashQuery(null);
                  setMessage('');
                  textareaRef.current?.focus();
                }}
                onClose={() => { setSlashQuery(null); setMessage(''); }}
              />
            )}

            <div className="flex-1 flex flex-col gap-2">
              {selectedSkill && (
                <div className="flex items-center">
                  <SkillTag skill={selectedSkill} onRemove={() => { setSelectedSkill(null); textareaRef.current?.focus(); }} />
                </div>
              )}
              <textarea
                ref={textareaRef}
                value={message}
                onChange={e => {
                  const val = e.target.value;
                  setMessage(val);
                  if (val.startsWith('/') && !selectedSkill) {
                    setSlashQuery(val.slice(1));
                  } else if (slashQuery !== null && !val.startsWith('/')) {
                    setSlashQuery(null);
                  }
                  const el = e.target;
                  el.style.height = 'auto';
                  el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (message.trim() || selectedSkill) {
                      e.currentTarget.form?.requestSubmit();
                    }
                  }
                }}
                placeholder={selectedSkill ? `Describe what you need for ${selectedSkill.name}...` : 'Ask anything...'}
                rows={1}
                className="bg-transparent border-0 text-base text-primary placeholder:text-tertiary focus:outline-none p-0 w-full resize-none overflow-y-auto"
                style={{ maxHeight: 120 }}
              />
            </div>
            <div className="flex gap-1 items-end justify-between w-full">
              <div className="flex gap-1 items-center">
                <IconButton
                  type="button"
                  variant="outline"
                  size="sm"
                  icon="hashtag"
                  aria-label="Add topic"
                />
                <IconButton
                  type="button"
                  variant="outline"
                  size="sm"
                  icon="paperclip"
                  aria-label="Attach"
                />
              </div>
              <div className="flex gap-1 items-center">
                <IconButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon="microphone"
                  aria-label="Voice input"
                />
                <IconButton
                  type="submit"
                  variant={(selectedSkill || message.trim()) ? 'primary' : 'secondary'}
                  size="sm"
                  icon="arrow-up"
                  aria-label="Send"
                  disabled={!selectedSkill && !message.trim()}
                />
              </div>
            </div>
          </form>

          {/* Skill buttons + items */}
          <div ref={skillSectionRef} className="w-full flex flex-col gap-3">
            {/* Category buttons row — always visible */}
            <div className="flex items-center flex-wrap gap-[8px] w-full">
              {SHORTCUT_CATEGORIES.map(cat => (
                <Button
                  key={cat.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  startIcon={cat.icon}
                  onClick={() => handleCategoryClick(cat.label)}
                  style={openCategory === cat.label ? {
                    borderColor: '#717680',
                    boxShadow: '0px 0px 0px 3px rgba(113, 118, 128, 0.30)',
                  } : undefined}
                >
                  {cat.label}
                </Button>
              ))}
            </div>

            {/* Inline items list */}
            {openCategory && (() => {
              const cat = SHORTCUT_CATEGORIES.find(c => c.label === openCategory);
              if (!cat) return null;
              return (
                <div
                  key={openCategory}
                  className={`w-full flex flex-col ${isItemsClosing ? 'items-panel-exit' : 'items-panel-enter'}`}
                  style={{ minHeight: MAX_CATEGORY_ITEMS * ITEM_HEIGHT_PX }}
                  onAnimationEnd={(e) => {
                    if (e.animationName === 'items-panel-exit' && isItemsClosing) {
                      setOpenCategory(null);
                      setIsItemsClosing(false);
                      setRecentChatsEntering(true);
                    }
                  }}
                >
                  {cat.items.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      className="skill-shortcut-item group flex items-center gap-3 w-full px-3 py-3 rounded-2xl cursor-pointer hover:bg-[#F7F9FA] transition-colors duration-75 text-left"
                      onClick={() => {
                        closeItems();
                        onShortcutClick?.(item);
                      }}
                    >
                      <span className="text-sm font-medium text-[#717680] group-hover:text-[#191B1F] transition-colors duration-75">{item}</span>
                      <span className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-75 text-[#191B1F]">
                        <Icon name={'arrow-up-right' as IconName} size="sm" />
                      </span>
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Onboarding card — shown when user skipped onboarding via "Or..." */}
          {!openCategory && showOnboardingCard && (
            <button
              type="button"
              onClick={() => {
                setShowOnboardingCard(false);
                setCommunityType('new-community');
              }}
              className="relative w-full text-left bg-primary border border-[#E4E7EB] rounded-lg pl-[132px] pr-5 py-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:bg-hover transition-colors cursor-pointer flex items-center gap-0.5 overflow-visible"
            >
              {/* Mini checklist illustration — absolutely positioned */}
              <svg
                width="87" height="70" viewBox="0 0 87 70" fill="none"
                className="absolute left-[21.5px] -top-[11.5px] pointer-events-none"
                style={{ filter: 'drop-shadow(0px 3px 12px rgba(0,0,0,0.1)) drop-shadow(0px 0px 0px rgba(0,0,0,0.04))' }}
              >
                <rect width="87" height="70" rx="4" fill="white" />
                <circle cx="14" cy="14" r="4" fill="#86EFAC" />
                <circle cx="14" cy="34" r="4" fill="#E4E7EB" />
                <circle cx="14" cy="54" r="4" fill="#E4E7EB" />
                <rect x="24" y="13" width="52" height="2" rx="1" fill="#E4E7EB" />
                <rect x="24" y="33" width="52" height="2" rx="1" fill="#E4E7EB" />
                <rect x="24" y="53" width="52" height="2" rx="1" fill="#E4E7EB" />
              </svg>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <Typography variant="label-sm" color="primary">
                  Let&apos;s build your community together
                </Typography>
                <Typography variant="body-sm" color="secondary">
                  Pick a community type and get a personalized launch plan
                </Typography>
              </div>
              <IconButton
                type="button"
                variant="ghost"
                size="sm"
                icon="arrow-right"
                aria-label="Start onboarding"
                className="shrink-0"
                tabIndex={-1}
              />
            </button>
          )}

          {/* Recent chats */}
          {!openCategory && <div className={`flex flex-col gap-2 w-full ${recentChatsEntering ? 'recent-chats-visible' : ''}`} onAnimationEnd={() => setRecentChatsEntering(false)}>
            <Typography variant="label-sm" color="tertiary">
              Recent chats
            </Typography>
            <div className="flex flex-col gap-2">
              {[
                { id: '0', title: 'Copilot conversation improvements', subtitle: 'Explored ways to improve Copilot response quality, conversation flow, and context retention across multi-turn interactions...' },
                { id: '1', title: 'Weekly new member onboarding report', subtitle: '8 of 12 completed onboarding this week. Drop-off is still at the goals survey step...' },
                { id: '2', title: 'Members at risk of churning this month', subtitle: 'I flagged 14 members inactive for 21+ days. Here\'s the re-engagement plan I drafted...' },
                { id: '3', title: 'Re-engagement campaign for January dropoffs', subtitle: 'The 5-email welcome series is ready. Open rate on the first send was 47%...' },
              ].map(chat => (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => onOpenCopilot?.(chat.id)}
                  className="w-full text-left bg-primary border border-[#f0f3f5] rounded-lg px-5 py-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:bg-hover transition-colors cursor-pointer"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-primary">{chat.title}</span>
                    <span className="text-sm text-tertiary truncate">{chat.subtitle}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>}
        {/* Today's focus, Overview */}
        {true && <>

        {/* Today's focus – Figma */}
        <section className="space-y-4 hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Typography
                variant="heading-lg"
                color="primary"
                className="text-[20px] font-semibold leading-[28px]"
              >
                Today&apos;s focus
              </Typography>
              <div className="flex items-center gap-1.5">
                <Badge
                  label="3 tasks"
                  variant="secondary"
                  icon="checkmark-small"
                />
                <Badge label="4 mins" variant="secondary" icon="clock" />
              </div>
            </div>
          </div>
          <div className="bg-primary rounded-2xl border border-primary overflow-hidden shadow-2xs">
            <ul className="divide-y divide-primary">
              {todayFocusTasks.map((task, i) => (
                <li key={i} className="flex items-center gap-3 px-4 py-3">
                  <span
                    className="mt-0.5 shrink-0 w-5 h-5 rounded-full border border-primary bg-primary flex items-center justify-center"
                    aria-hidden
                  />
                  <Typography
                    component="p"
                    variant="body-sm"
                    color="primary"
                    className="flex-1 text-[14px] leading-[20px]"
                  >
                    {task.text}
                  </Typography>
                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    <Avatar
                      src={task.avatar}
                      name={task.from}
                      size="sm"
                      className="w-6 h-6"
                    />
                    <Typography variant="caption" color="secondary">
                      {task.from}
                    </Typography>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Your overview */}
        <section className="space-y-4 hidden">
          <div className="flex items-center justify-between">
            <Typography
              variant="heading-lg"
              color="primary"
              className="text-[20px] font-semibold leading-[28px] text-primary"
            >
              Your overview
            </Typography>
            <Button
              type="button"
              variant="outline"
              size="sm"
              endIcon="chevron-down"
            >
              Last 7 days
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {overviewTabs.map(tab => {
              const isActive = overviewTab === tab.value;
              return (
                <Button
                  key={tab.value}
                  type="button"
                  onClick={() => handleOverviewTabChange(tab.value)}
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="md"
                  startIcon={tab.value === 'discover' ? 'sparkle' : undefined}
                  className="rounded-[12px] px-4 py-2 text-[14px] leading-[20px]"
                >
                  {tab.label}
                </Button>
              );
            })}
          </div>

          <div className="bg-primary rounded-[16px] border border-primary overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4">
              {overviewMetrics.map(m => {
                const isUp = m.trend === 'up';
                return (
                  <div
                    key={`${overviewTab}-${m.label}`}
                    className={[
                      'flex flex-col gap-1 rounded-[12px] px-3 py-2',
                      m.emphasized ? 'bg-secondary' : 'bg-primary',
                    ].join(' ')}
                  >
                    <Typography
                      component="p"
                      variant="label-sm"
                      color="primary"
                    >
                      {m.label}
                    </Typography>
                    <Typography
                      component="p"
                      variant="heading-sm"
                      color="primary"
                    >
                      {m.value}
                    </Typography>
                    <Badge
                      label={m.delta}
                      variant={isUp ? 'success' : 'warning'}
                      className="rounded-[6px]"
                    />
                  </div>
                );
              })}
            </div>

            <div className="px-4 pb-4">
              <div className="rounded-[12px] border border-secondary bg-primary p-5">
                <div className="flex gap-0 h-[212px] pr-3">
                  <div className="flex flex-col justify-between shrink-0 w-[42px] text-[12px] leading-[18px] tracking-[0.2px] text-tertiary">
                    <Typography
                      component="span"
                      variant="label-sm"
                      color="tertiary"
                    >
                      2k
                    </Typography>
                    <Typography
                      component="span"
                      variant="label-sm"
                      color="tertiary"
                    >
                      1.5k
                    </Typography>
                    <Typography
                      component="span"
                      variant="label-sm"
                      color="tertiary"
                    >
                      1k
                    </Typography>
                    <Typography
                      component="span"
                      variant="label-sm"
                      color="tertiary"
                    >
                      500
                    </Typography>
                  </div>
                  <div className="relative flex-1 min-w-0 h-[176px] mt-[10px]">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      {[0, 1, 2, 3].map(i => (
                        <div key={i} className="h-px bg-secondary w-full" />
                      ))}
                    </div>
                    <svg
                      className="absolute inset-0 w-full h-full text-tertiary"
                      viewBox="0 0 200 120"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient
                          id="overviewAreaGradient"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#1d4ed8"
                            stopOpacity="0.12"
                          />
                          <stop
                            offset="100%"
                            stopColor="#1d4ed8"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                      <polygon
                        points={chart.area}
                        fill="url(#overviewAreaGradient)"
                      />
                      <polyline
                        points={chart.dashed}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="1.5"
                        strokeDasharray="4 6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <polyline
                        points={chart.solid}
                        fill="none"
                        stroke="#1d4ed8"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <text
                        x="20"
                        y="116"
                        fontSize="12"
                        fill="currentColor"
                        textAnchor="start"
                        fontFamily="Inter, sans-serif"
                      >
                        Jan
                      </text>
                      <text
                        x="70"
                        y="116"
                        fontSize="12"
                        fill="currentColor"
                        textAnchor="middle"
                        fontFamily="Inter, sans-serif"
                      >
                        Apr
                      </text>
                      <text
                        x="120"
                        y="116"
                        fontSize="12"
                        fill="currentColor"
                        textAnchor="middle"
                        fontFamily="Inter, sans-serif"
                      >
                        Jul
                      </text>
                      <text
                        x="170"
                        y="116"
                        fontSize="12"
                        fill="currentColor"
                        textAnchor="end"
                        fontFamily="Inter, sans-serif"
                      >
                        Oct
                      </text>
                    </svg>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-[12px]">
                    <div className="flex items-center gap-2">
                      <span
                        className="shrink-0 w-2 h-2 rounded-full bg-[#1d4ed8]"
                        aria-hidden
                      />
                      <Typography
                        component="span"
                        variant="label-sm"
                        color="primary"
                      >
                        Nov 11–18, 2025
                      </Typography>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="shrink-0 w-2 h-2 rounded-full bg-[#3b82f6]"
                        aria-hidden
                      />
                      <Typography
                        component="span"
                        variant="label-sm"
                        color="primary"
                      >
                        Nov 3–10, 2025
                      </Typography>
                    </div>
                  </div>

                  <Link
                    href="#"
                    size="sm"
                    className="inline-flex items-center gap-1 text-[12px] font-medium text-primary"
                  >
                    Members analytics
                    <Icon
                      name="chevron-right"
                      size="sm"
                      className="w-4 h-4"
                      aria-hidden
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        </>}
        </div>
      </div>
      )}
    </div>
  );
};

export default Dashboard;
