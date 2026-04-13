import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Button } from '@circleco/compass/components/Button';
import { Badge } from '@circleco/compass/components/Badge';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Accordion } from '@circleco/compass/components/Accordion';
import { Tooltip } from '@circleco/compass/components/Tooltip';
import { Popover } from '@circleco/compass/components/Popover';
import { IconButton } from '@circleco/compass/components/IconButton';
import type { ModerationSummary, ModerationHistoryItem } from './mockModerationHistory';

/* ─── Date helpers ───────────────────────────────────────────── */
const formatMonthYear = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

/* ─── ModerationHistoryToggle ────────────────────────────────── */
interface ModerationHistoryToggleProps {
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export const ModerationHistoryToggle: React.FC<ModerationHistoryToggleProps> = ({ count, isExpanded, onToggle }) => (
  <Button
    variant="outline"
    size="md"
    onClick={onToggle}
    endIcon={isExpanded ? 'chevron-top' : 'chevron-down'}
    className="self-center"
  >
    {isExpanded ? `Hide moderation history (${count})` : `Show moderation history (${count})`}
  </Button>
);

/* ─── ModerationHistoryCard ──────────────────────────────────── */
interface ModerationHistoryCardProps {
  item: ModerationHistoryItem;
  effectiveOutcome: 'removed' | 'allowed';
  onOutcomeChange: (id: string, outcome: 'removed' | 'allowed') => void;
  onOpenProfile?: (name: string) => void;
}

const ModerationHistoryCard: React.FC<ModerationHistoryCardProps> = ({ item, effectiveOutcome, onOutcomeChange, onOpenProfile }) => (
  <div className="border border-secondary rounded-2xl overflow-hidden shadow-2xs w-full">
    {/* Card header — no checkbox, just badge + context + outcome */}
    <div className="flex items-center gap-2 px-4 py-2 border-b border-secondary">
      <Badge variant="secondary" label={item.type} />
      {item.context && (
        <>
          <Typography variant="body-sm" color="secondary" className="shrink-0">in</Typography>
          <Typography variant="body-sm" color="primary" className="truncate flex-1 font-semibold">
            {item.context}
          </Typography>
        </>
      )}
      <div className="flex items-center gap-1 shrink-0 ml-auto">
        <Tooltip
          side="top"
          content={
            <div className="flex items-center gap-2 py-0.5">
              <Avatar name={item.decidedBy === 'workflow' ? 'W' : item.decidedBy} size="sm" />
              <div className="flex flex-col gap-0.5">
                <Typography variant="label-xs" color="primary" className="!text-white">
                  {item.decidedBy === 'workflow' ? 'Workflow' : item.decidedBy}
                </Typography>
                <Typography variant="caption" color="tertiary" className="!text-white/60">
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </Typography>
              </div>
            </div>
          }
        >
          <span>
            <Badge
              variant={effectiveOutcome === 'removed' ? 'destructive' : 'success'}
              label={effectiveOutcome === 'removed' ? 'Removed' : 'Approved'}
            />
          </span>
        </Tooltip>
        <Popover
          trigger={<IconButton icon="dot-menu" variant="ghost" size="sm" aria-label="More options" />}
          side="bottom"
          align="end"
          closeOnContentClick
        >
          <div className="py-1 min-w-[120px]">
            {effectiveOutcome === 'removed' ? (
              <button className="w-full px-3 py-2 text-left hover:bg-hover" onClick={() => onOutcomeChange(item.id, 'allowed')}>
                <Typography variant="body-sm" color="primary">Allow</Typography>
              </button>
            ) : (
              <button className="w-full px-3 py-2 text-left hover:bg-hover" onClick={() => onOutcomeChange(item.id, 'removed')}>
                <Typography variant="body-sm" color="danger">Remove</Typography>
              </button>
            )}
          </div>
        </Popover>
      </div>
    </div>

    {/* Card content */}
    <div className="p-5 border-b border-secondary flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <button
          className="focus:outline-none shrink-0"
          onClick={() => onOpenProfile?.(item.decidedBy)}
        >
          <Avatar name={item.decidedBy === 'workflow' ? 'W' : item.decidedBy} size="lg" />
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Typography variant="label-sm" color="primary">{item.decidedBy === 'workflow' ? 'Workflow' : item.decidedBy}</Typography>
            <Typography variant="body-sm" color="tertiary">
              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Typography>
          </div>
          <Typography variant="caption" color="tertiary">Community member</Typography>
        </div>
      </div>
      <Typography variant="body-sm" color="secondary">{item.contentSnippet}</Typography>
    </div>

    {/* Reports accordion */}
    <div className="px-4">
      <Accordion.Root multiple>
        <Accordion.Item value={item.id}>
          <Accordion.Trigger className="py-3 w-full text-left">
            <Typography variant="label-sm" color="primary">5 reports</Typography>
          </Accordion.Trigger>
          <Accordion.Content>
            <div className="pb-4">
              <Typography variant="body-sm" color="tertiary">Report details would appear here.</Typography>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  </div>
);

/* ─── ModerationHistoryTimeline ──────────────────────────────── */
interface ModerationHistoryTimelineProps {
  items: ModerationHistoryItem[];
  outcomesOverride: Record<string, 'removed' | 'allowed'>;
  onOutcomeChange: (id: string, outcome: 'removed' | 'allowed') => void;
  onOpenProfile?: (name: string) => void;
}

export const ModerationHistoryTimeline: React.FC<ModerationHistoryTimelineProps> = ({ items, outcomesOverride, onOutcomeChange, onOpenProfile }) => {
  const grouped = items.reduce<Record<string, ModerationHistoryItem[]>>((acc, item) => {
    const key = formatMonthYear(item.date);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const sortedMonths = Object.keys(grouped).sort(
    (a, b) => new Date(grouped[b][0].date).getTime() - new Date(grouped[a][0].date).getTime()
  );

  return (
    <div className="flex flex-col items-start w-full">
      {sortedMonths.map((month, monthIdx) => (
        <div key={month} className="flex gap-2 items-stretch w-full">
          {/* Timeline line + dot */}
          <div className="flex flex-col items-center shrink-0 w-7">
            {/* Dot */}
            <div className="flex items-center justify-center shrink-0 h-7">
              <div className="w-3 h-3 rounded-full border-2 border-secondary bg-primary" />
            </div>
            {/* Vertical line — extends full height of the month group */}
            <div className="flex-1 w-[1.5px] bg-secondary" />
          </div>

          {/* Month group */}
          <div className={`flex-1 flex flex-col gap-4 min-w-0 ${monthIdx < sortedMonths.length - 1 ? 'pb-10' : 'pb-4'}`}>
            <Typography variant="heading-md" color="primary" className="pt-0.5">
              {month}
            </Typography>
            {grouped[month].map(item => (
              <ModerationHistoryCard key={item.id} item={item} effectiveOutcome={outcomesOverride[item.id] ?? item.outcome} onOutcomeChange={onOutcomeChange} onOpenProfile={onOpenProfile} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ─── Re-export unused but referenced ────────────────────────── */
export const ModerationSummaryBar: React.FC<{ summary: ModerationSummary | null }> = () => null;
