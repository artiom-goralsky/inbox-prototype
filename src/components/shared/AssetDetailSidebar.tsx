import React, { useState, useEffect, useRef } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Button } from '@circleco/compass/components/Button';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Icon, type IconName } from '@circleco/compass/components/Icon';
import { Badge } from '@circleco/compass/components/Badge';
import { mergeClasses } from '../../lib/utils';

export type AssetItem = {
  id: string;
  title: string;
  description?: string;
  subtitle?: string;
  type?: 'chat' | 'asset' | 'agent' | 'page' | 'build-frame' | 'event' | 'course';
  agentData?: {
    mode: 'Operator' | 'Strategist';
    phase: number;
    group: string;
    groupIcon: string;
    capabilities: string[];
    useCases: string[];
    relatedSkills: string[];
  };
};

const CHART_BARS = [
  { h: 0.78, opacity: 1 },
  { h: 0.48, opacity: 0.9 },
  { h: 0.38, opacity: 0.85 },
];

const MIN_WIDTH = 320;
const MAX_WIDTH = 960;
const DEFAULT_WIDTH = 550;

interface AssetDetailSidebarProps {
  asset: AssetItem;
  onClose: () => void;
  onWidthChange?: (width: number) => void;
  onStartConversation?: (skillName: string) => void;
  onViewInAnalytics?: () => void;
  /** When rendered inside the artifact panel, hide the internal header */
  hideHeader?: boolean;
}

const AssetDetailSidebar: React.FC<AssetDetailSidebarProps> = ({
  asset,
  onClose,
  onWidthChange,
  onStartConversation,
  onViewInAnalytics,
  hideHeader = false,
}) => {
  const [barsAnimated, setBarsAnimated] = useState(false);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setBarsAnimated(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const delta = dragRef.current.startX - e.clientX;
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, dragRef.current.startWidth + delta));
      setWidth(newWidth);
      onWidthChange?.(newWidth);
    };
    const handleMouseUp = () => { dragRef.current = null; };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onWidthChange]);

  const breakdownItems = [
    { label: 'Sessions', value: '100%', count: '12', change: '+4.3%' },
    { label: 'Onboarding', value: '24%', count: '10', change: '+4.3%' },
    {
      label: 'Completed onboarding',
      value: '7,82%',
      count: '8',
      change: '+4.3%',
    },
  ];

  const isDailyBriefing = asset.id === 'daily-briefing';
  const isAgent = asset.type === 'agent' && asset.agentData;

  return (
    <div
      className="bg-primary h-full flex flex-col relative"
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
      <div className="bg-primary h-full flex flex-col overflow-hidden">
        {/* Header — hidden when embedded in artifact panel */}
        {!hideHeader && (
          <div className="flex items-center justify-between gap-2 px-4 py-4 shrink-0 border-b border-secondary">
            <div className="flex items-center gap-2 min-w-0">
              <Typography
                variant="heading-sm"
                color="primary"
              >
                <span className="font-semibold truncate">{isAgent ? 'Skill' : asset.title}</span>
              </Typography>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {!isDailyBriefing && !isAgent && (
                <Button type="button" variant="secondary" size="sm" onClick={onViewInAnalytics}>
                  View in analytics
                </Button>
              )}
              {isAgent && (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => onStartConversation?.(asset.title)}
                >
                  Start conversation
                </Button>
              )}
              <IconButton
                type="button"
                variant="ghost"
                size="sm"
                icon="cross"
                aria-label="Close"
                onClick={onClose}
              />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
          {isDailyBriefing && (
            <>
              {/* Hero image — full width, no padding */}
              <div className="w-full h-[320px] rounded-xl shrink-0 overflow-hidden">
                <img
                  src="/images/clara.png"
                  alt="Daily briefing"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="flex flex-col gap-4 px-4 pt-4 pb-4">
                {/* Meta */}
                <div className="flex items-center gap-2">
                  <img src="/ai-avatar.png" alt="Clara" className="w-[22px] h-[22px] rounded-full shrink-0" />
                  <Typography variant="body-sm" color="tertiary">
                    Generated by Clara &middot; 6:30 AM &middot; Based on
                    activity from the last 24 hours
                  </Typography>
                </div>

                {/* Greeting */}
                <div className="flex flex-col gap-1">
                  <Typography
                    variant="heading-sm"
                    color="primary"
                  >
                    <span className="font-semibold">Good morning, Sarah. Thursday, March 6</span>
                  </Typography>
                  <Typography variant="body-sm" color="secondary">
                    Your community is thriving.
                  </Typography>
                </div>

                {/* The one thing */}
                <div className="flex flex-col gap-2 bg-secondary rounded-xl p-4 border border-primary">
                  <Typography
                    variant="label-sm"
                    color="secondary"
                  >
                    <span className="uppercase tracking-wide text-[11px]">The one thing that matters today</span>
                  </Typography>
                  <Typography variant="body-md" color="primary">
                    Your March cohort has 23% lower engagement than February at
                    the same point. Three members haven&apos;t logged in since
                    signup. I&apos;ve drafted a personal re-engagement message
                    for each — want me to send them?
                  </Typography>
                  <div className="flex gap-2 flex-wrap mt-1">
                    <button
                      type="button"
                      className="rounded-lg bg-[var(--comp-button-primary-enabled-bg)] text-[var(--comp-button-primary-enabled-text)] hover:bg-[var(--comp-button-primary-hover-bg)] px-3 py-1.5 text-sm font-medium"
                    >
                      Send all 3
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-[var(--comp-button-outline-enabled-border)] text-[var(--comp-button-outline-enabled-text)] hover:bg-[var(--comp-button-outline-hover-bg)] px-3 py-1.5 text-sm font-medium"
                    >
                      Review first
                    </button>
                    <button
                      type="button"
                      className="rounded-lg text-[var(--comp-button-ghost-enabled-text)] hover:bg-[var(--comp-button-ghost-hover-bg)] px-3 py-1.5 text-sm font-medium"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>

                {/* What's working */}
                <div className="flex flex-col gap-3">
                  <Typography
                    variant="label-sm"
                    color="secondary"
                  >
                    <span className="uppercase tracking-wide text-[11px]">What&apos;s working</span>
                  </Typography>
                  <div className="flex flex-col gap-1">
                    <Typography variant="body-md" color="primary">
                      Revenue is up 18% month-over-month. Your &ldquo;Advanced
                      Branding&rdquo; course is driving it — 14 new enrollments
                      this week, mostly from the newsletter you sent Tuesday.
                      That subject line outperformed your average open rate by
                      31%.
                    </Typography>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Typography variant="body-md" color="primary">
                      Your Thursday live events consistently outperform every
                      other day. You have nothing scheduled for next Thursday.
                      Want me to create one?
                    </Typography>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-[var(--comp-button-outline-enabled-border)] text-[var(--comp-button-outline-enabled-text)] hover:bg-[var(--comp-button-outline-hover-bg)] px-3 py-1.5 text-sm font-medium"
                      >
                        Create event
                      </button>
                      <button
                        type="button"
                        className="rounded-lg text-[var(--comp-button-ghost-enabled-text)] hover:bg-[var(--comp-button-ghost-hover-bg)] px-3 py-1.5 text-sm font-medium"
                      >
                        Maybe later
                      </button>
                    </div>
                  </div>
                </div>

                {/* Community right now */}
                <div className="flex flex-col gap-2 border-t border-primary pt-4">
                  <Typography
                    variant="label-sm"
                    color="secondary"
                  >
                    <span className="uppercase tracking-wide text-[11px]">Your community right now</span>
                  </Typography>
                  <ul className="flex flex-col gap-1.5">
                    {[
                      '847 active members · 12 joined this week',
                      '3 posts getting traction — highest comment velocity',
                      '2 members hit milestone badges today — congratulation posts queued for review',
                      '1 member upgraded to annual plan unprompted',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-tertiary shrink-0" />
                        <Typography variant="body-sm" color="primary">
                          {item}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Needs attention */}
                <div className="flex flex-col gap-2 border-t border-primary pt-4">
                  <Typography
                    variant="label-sm"
                    color="secondary"
                  >
                    <span className="uppercase tracking-wide text-[11px]">Needs your attention</span>
                  </Typography>
                  <ul className="flex flex-col gap-1.5">
                    {[
                      '4 comments flagged for moderation · oldest is 6 hours old',
                      "Daniel Kim asked a question in your Branding course 3 days ago — no answer yet. He's a paying member.",
                      "Your welcome workflow hasn't been updated in 4 months. New members are getting onboarding that references your old pricing.",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#f59e0b] shrink-0" />
                        <Typography variant="body-sm" color="primary">
                          {item}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* This week at a glance */}
                <div className="flex flex-col gap-3 border-t border-primary pt-4">
                  <Typography
                    variant="label-sm"
                    color="secondary"
                  >
                    <span className="uppercase tracking-wide text-[11px]">This week at a glance</span>
                  </Typography>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr>
                          <th className="text-left pb-2 pr-4" />
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(d => (
                            <th key={d} className="text-left pb-2 pr-4">
                              <Typography variant="label-sm" color="tertiary">
                                {d}
                              </Typography>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            label: 'New members',
                            values: ['2', '4', '1', '3', '2'],
                          },
                          {
                            label: 'Revenue',
                            values: ['$340', '$890', '$210', '$640', '—'],
                          },
                          {
                            label: 'Posts',
                            values: ['8', '12', '6', '14', '—'],
                          },
                        ].map(row => (
                          <tr
                            key={row.label}
                            className="border-t border-primary"
                          >
                            <td className="py-2 pr-4 whitespace-nowrap">
                              <Typography variant="body-sm" color="secondary">
                                {row.label}
                              </Typography>
                            </td>
                            {row.values.map((v, i) => (
                              <td key={i} className="py-2 pr-4">
                                <Typography variant="body-sm" color="primary">
                                  {v}
                                </Typography>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Typography
                    variant="body-sm"
                    color="secondary"
                  >
                    <span className="italic">Thursday is your day. Lean into it.</span>
                  </Typography>
                </div>

                {/* Maya suggests */}
                <div className="flex flex-col gap-2 border-t border-primary pt-4">
                  <div className="flex items-center gap-2">
                    <img src="/ai-avatar.png" alt="Maya" className="w-[22px] h-[22px] rounded-full shrink-0" />
                    <Typography variant="label-sm" color="secondary">
                      Maya suggests · Growth
                    </Typography>
                  </div>
                  <Typography variant="body-md" color="primary">
                    Your Instagram bio still links to your old landing page.
                    You&apos;re losing signup conversions. I can update your
                    Circle landing page to match your current offer — takes 2
                    minutes.
                  </Typography>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-[var(--comp-button-outline-enabled-border)] text-[var(--comp-button-outline-enabled-text)] hover:bg-[var(--comp-button-outline-hover-bg)] px-3 py-1.5 text-sm font-medium"
                    >
                      Let&apos;s do it
                    </button>
                    <button
                      type="button"
                      className="rounded-lg text-[var(--comp-button-ghost-enabled-text)] hover:bg-[var(--comp-button-ghost-hover-bg)] px-3 py-1.5 text-sm font-medium"
                    >
                      Not now
                    </button>
                  </div>
                </div>

                {/* Coming up */}
                <div className="flex flex-col gap-2 border-t border-primary pt-4 pb-2">
                  <Typography
                    variant="label-sm"
                    color="secondary"
                  >
                    <span className="uppercase tracking-wide text-[11px]">Coming up</span>
                  </Typography>
                  <ul className="flex flex-col gap-2">
                    {[
                      'Live Q&A with your mastermind group · Today 2:00 PM · 34 registered',
                      'Newsletter · 9:00 AM · 1,240 recipients · Draft looks strong',
                      '"Photography Fundamentals" cohort ends Sunday · 8 members haven\'t completed final module',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2e6be6] shrink-0" />
                        <Typography variant="body-sm" color="primary">
                          {item}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Listen footer */}
                <div className="border-t border-primary pt-3 flex items-center justify-between gap-2">
                  <Typography variant="body-sm" color="tertiary">
                    Listening took 4:20
                  </Typography>
                  <button
                    type="button"
                    className="rounded-lg border border-[var(--comp-button-outline-enabled-border)] text-[var(--comp-button-outline-enabled-text)] hover:bg-[var(--comp-button-outline-hover-bg)] px-3 py-1.5 text-sm font-medium inline-flex items-center gap-1.5"
                  >
                    <Icon name="play-circle" size="sm" />
                    Listen instead
                  </button>
                </div>
              </div>
              {/* end px-4 pb-4 */}
            </>
          )}
          {isAgent && asset.agentData && (
            <div className="flex flex-col gap-5 px-5 pt-4 pb-5 flex-1">
              {/* Title + badge */}
              <div className="flex items-center gap-3">
                <Typography
                  variant="heading-lg"
                  color="primary"
                >
                  <span className="font-semibold text-[22px]">{asset.title}</span>
                </Typography>
                <Badge
                  label={asset.agentData.mode}
                  variant={asset.agentData.mode === 'Operator' ? 'primary' : 'secondary'}
                  className="shrink-0"
                />
              </div>

              {/* Domain badge */}
              <div className="flex items-center gap-2">
                <Icon name={asset.agentData.groupIcon as IconName} size="sm" />
                <Typography variant="label-sm" color="secondary">
                  {asset.agentData.group}
                </Typography>
                <span className="text-disabled">·</span>
                <Typography variant="label-sm" color="disabled">
                  Phase {asset.agentData.phase}
                </Typography>
              </div>

              {/* Description */}
              <Typography variant="body-md" color="primary">
                {asset.description}
              </Typography>

              {/* What this skill can do */}
              <div className="flex flex-col gap-3">
                <Typography variant="label-md" color="primary">
                  <span className="font-semibold">What this skill can do</span>
                </Typography>
                <div className="flex flex-col gap-2">
                  {asset.agentData.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Icon name="circle-check" size="sm" className="shrink-0 mt-0.5" />
                      <Typography variant="body-sm" color="primary">
                        {cap}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example use cases */}
              <div className="flex flex-col gap-3 border-t border-secondary pt-5">
                <Typography variant="label-md" color="primary">
                  <span className="font-semibold">Example use cases</span>
                </Typography>
                <div className="flex flex-col gap-2">
                  {asset.agentData.useCases.map((uc, i) => (
                    <button
                      key={i}
                      type="button"
                      className="bg-primary border border-secondary rounded-lg px-4 py-3 text-left hover:bg-hover transition-colors w-full"
                    >
                      <Typography variant="body-sm" color="primary">
                        {uc}
                      </Typography>
                    </button>
                  ))}
                </div>
              </div>

              {/* Related skills */}
              <div className="flex flex-col gap-3 border-t border-secondary pt-5">
                <Typography variant="label-md" color="primary">
                  <span className="font-semibold">Related skills</span>
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {asset.agentData.relatedSkills.map((skill, i) => (
                    <Badge key={i} label={skill} variant="secondary" />
                  ))}
                </div>
              </div>

              {/* Mode explanation */}
              <div className="flex flex-col gap-2 border-t border-secondary pt-5 mt-auto">
                <div className="flex items-center gap-2">
                  <Icon
                    name={asset.agentData.mode === 'Operator' ? 'zap' : 'compass'}
                    size="sm"
                    className="text-secondary"
                  />
                  <Typography variant="label-sm" color="secondary">
                    {asset.agentData.mode === 'Operator'
                      ? 'Operator — Takes actions and makes changes on your behalf'
                      : 'Strategist — Analyzes data and provides recommendations'}
                  </Typography>
                </div>
              </div>
            </div>
          )}
          {!isDailyBriefing && !isAgent && (
            <div className="flex flex-col gap-4 p-4">
              {/* Intro text */}
              <Typography variant="body-md" color="primary">
                30-day churn dropped from 12.4% to 8.2% after we shipped the new
                onboarding flow in February.
              </Typography>

              {/* Key metric */}
              <div className="flex flex-col gap-1 pt-2">
                <Typography
                  variant="heading-xl"
                  color="primary"
                >
                  <span className="font-semibold">7,82%</span>
                </Typography>
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[12px] leading-4 bg-[#e9f8ef] text-[#117a43] font-medium">
                    <span aria-hidden>↗</span>
                    +4.3%
                  </span>
                  <Typography variant="body-sm" color="tertiary">
                    3% last period
                  </Typography>
                </div>
              </div>

              {/* Breakdown rows — 3 columns with dividers */}
              <div className="grid grid-cols-3 gap-0">
                {breakdownItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={mergeClasses(
                      'flex flex-col gap-1 px-3',
                      idx > 0 ? 'border-l border-secondary' : ''
                    )}
                  >
                    <Typography variant="body-sm" color="secondary">
                      {item.label}
                    </Typography>
                    <Typography
                      variant="body-md"
                      color="primary"
                    >
                      <span className="font-medium">{item.value}</span>
                    </Typography>
                    <div className="flex items-center gap-2">
                      <Typography variant="body-sm" color="secondary">
                        {item.count}
                      </Typography>
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] leading-4 bg-[#e9f8ef] text-[#117a43]">
                        <span aria-hidden>↗</span>
                        {item.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bar chart */}
              <div className="pt-4">
                <div className="flex items-end justify-between gap-6 h-[180px]">
                  {CHART_BARS.map((b, i) => (
                    <div
                      key={i}
                      className="relative flex-1 h-full flex flex-col justify-end"
                    >
                      <div
                        className="absolute -right-2 bottom-0 w-full rounded-t bg-[#2e6be6] opacity-25 origin-bottom transition-transform duration-300"
                        style={{
                          height: `${b.h * 100}%`,
                          transform: barsAnimated ? 'scaleY(1)' : 'scaleY(0)',
                          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                        aria-hidden
                      />
                      <div
                        className="relative w-full rounded-t bg-[#2e6be6] origin-bottom transition-transform duration-300"
                        style={{
                          height: `${b.h * 100}%`,
                          transform: barsAnimated ? 'scaleY(1)' : 'scaleY(0)',
                          opacity: b.opacity,
                          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                        aria-hidden
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Findings */}
              <div className="flex flex-col gap-2">
                <Typography variant="label-md" color="primary">
                  Key Findings
                </Typography>
                <ul className="list-disc pl-5 flex flex-col gap-1">
                  <li>
                    <Typography variant="body-md" color="primary">
                      Welcome DM sequence has 73% open rate
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body-md" color="primary">
                      Members who complete onboarding are 4.2× more likely to
                      stay past 30 days
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body-md" color="primary">
                      The &ldquo;introduce yourself&rdquo; prompt drives 2.1×
                      more first-week posts
                    </Typography>
                  </li>
                </ul>
              </div>

              {/* Recommendations */}
              <div className="flex flex-col gap-2">
                <Typography variant="label-md" color="primary">
                  Recommendations
                </Typography>
                <ol className="list-decimal pl-5 flex flex-col gap-1">
                  <li>
                    <Typography variant="body-md" color="primary">
                      Make the DM sequence mandatory for all tiers
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body-md" color="primary">
                      Add a day-7 check-in from the assigned agent
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body-md" color="primary">
                      Create a &ldquo;week 2&rdquo; engagement nudge sequence
                    </Typography>
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetDetailSidebar;
