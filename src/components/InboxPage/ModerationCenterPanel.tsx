import React, { useState, useEffect, useRef } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Button } from '@circleco/compass/components/Button';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Checkbox } from '@circleco/compass/components/Checkbox';
import { Badge } from '@circleco/compass/components/Badge';
import { Accordion } from '@circleco/compass/components/Accordion';
import { Popover } from '@circleco/compass/components/Popover';
import { IconButton } from '@circleco/compass/components/IconButton';
import { SplitButton } from '@circleco/compass/components/SplitButton';
import { HISTORY_ITEMS, HISTORY_SUMMARIES, type ModerationHistoryItem } from './mockModerationHistory';
import { ModerationSummaryBar, ModerationHistoryToggle, ModerationHistoryTimeline } from './ModerationHistory';

type ContentType = 'Post' | 'Comment' | 'Message' | 'Connection' | 'DM';

interface Reporter {
  name: string;
  reason: string;
  date: string;
  comment: string;
  status?: 'removed' | 'approved' | 'pending';
}

interface PostAuthor {
  name: string;
  bio: string;
  time: string;
}

interface FlaggedCard {
  id: string;
  type: ContentType;
  context: string;
  postTitle: string;
  postAuthor: PostAuthor;
  content: string;
  reports: Reporter[];
}

interface AuthorData {
  name: string;
  cards: FlaggedCard[];
}

const AUTHOR_DATA: Record<string, AuthorData> = {
  cp: {
    name: 'Kenji Tanaka',
    cards: [],
  },
  km: {
    name: 'Tom Brown',
    cards: [],
  },
  'derek-hoffman': {
    name: 'Derek Hoffman',
    cards: [
      {
        id: 'dh-1',
        type: 'Post',
        context: 'Gear Talk',
        postTitle: 'Urban Grit preset pack — 40% off for Circle members',
        postAuthor: { name: 'Derek Hoffman', bio: 'Meetup host · 8 months', time: 'Today, 9:14 AM' },
        content: 'Hey photographers — my local meetup group just launched a new Lightroom preset pack called \'Urban Grit.\' $29 normally, but Circle members get 40% off with code CIRCLE40. DM me if you want a sample before buying. Always happy to support this community.',
        reports: [
          { name: 'Kenji Tanaka', reason: 'Self-promotion', date: 'Today, 9:14 AM', comment: 'Self-promotion with external payment link.', status: 'pending' as const },
          { name: 'Amy Torres',   reason: 'Self-promotion', date: 'Today, 8:52 AM', comment: 'This is the third promo post from Derek this week.', status: 'pending' as const },
        ],
      },
      {
        id: 'dh-2',
        type: 'Comment',
        context: 'Questions',
        postTitle: 'Reply to beginner question',
        postAuthor: { name: 'Derek Hoffman', bio: 'Meetup host · 8 months', time: 'Today, 9:45 AM' },
        content: 'That\'s a really ignorant take. Maybe try actually learning the fundamentals before giving advice that could mess up someone\'s settings.',
        reports: [
          { name: 'Emily Park', reason: 'Harassment', date: 'Today, 9:45 AM', comment: 'Hostile and dismissive response to a beginner question.', status: 'pending' as const },
        ],
      },
      {
        id: 'dh-3',
        type: 'Post',
        context: 'Announcements',
        postTitle: 'Quick tip from meetup',
        postAuthor: { name: 'Derek Hoffman', bio: 'Meetup host · 8 months', time: 'Yesterday' },
        content: 'Quick tip from last night\'s meetup — always carry a gray card for mixed lighting. Saved me three times at indoor events this month alone.',
        reports: [
          { name: 'Priya Sharma', reason: 'Off-topic', date: 'Yesterday', comment: 'Meetup self-promotion disguised as a tip.', status: 'approved' as const },
        ],
      },
      {
        id: 'dh-4',
        type: 'Post',
        context: 'Gear Marketplace',
        postTitle: 'Urban Grit preset launch',
        postAuthor: { name: 'Derek Hoffman', bio: 'Meetup host · 8 months', time: 'Today, 9:45 AM' },
        content: 'New Lightroom preset pack — \'Urban Grit\' $29. Made specifically for street photography. Circle members get 40% off with code CIRCLE40.',
        reports: [
          { name: 'Amy Torres', reason: 'Self-promotion', date: 'Today, 9:45 AM', comment: 'Another paid product promotion from the same member.', status: 'pending' as const },
        ],
      },
    ],
  },
  'maria-santos': {
    name: 'Maria Santos',
    cards: [
      {
        id: 'ms-1', type: 'Post', context: 'Photography Basics',
        postTitle: 'Amazing deals on camera gear',
        postAuthor: { name: 'Maria Santos', bio: 'Joined 2 weeks ago', time: 'Sat, 10:14 AM' },
        content: 'Check out these amazing deals on camera gear at photogeardeals.store! Professional DSLRs starting at $299. Use code CIRCLE20 for 20% off. Limited time offer!',
        reports: [{ name: 'Spam Filter', reason: 'Spam', date: 'Sat, 11:02 AM', comment: 'Auto-flagged: external link matching known spam patterns.' }],
      },
      {
        id: 'ms-2', type: 'Post', context: 'Announcements',
        postTitle: 'Best deals on tripods',
        postAuthor: { name: 'Maria Santos', bio: 'Joined 2 weeks ago', time: 'Sat, 11:30 AM' },
        content: 'Best deals on tripods and stabilizers at photogeardeals.store! Flash sale this weekend only. Professional grade at hobbyist prices.',
        reports: [{ name: 'Kenji Tanaka', reason: 'Spam', date: 'Sat, 12:05 PM', comment: 'Second post linking to same external domain.' }],
      },
      {
        id: 'ms-3', type: 'Post', context: 'Gear Talk',
        postTitle: 'Flash sale on editing software',
        postAuthor: { name: 'Maria Santos', bio: 'Joined 2 weeks ago', time: 'Sat, 2:45 PM' },
        content: 'Flash sale on editing software — use code CIRCLE20 at photogeardeals.store for 50% off! Professional tools at amateur prices.',
        reports: [{ name: 'David Kim', reason: 'Spam', date: 'Sat, 3:10 PM', comment: 'Same store link again. Clearly a spam account.' }],
      },
      {
        id: 'ms-4', type: 'Post', context: 'Landscape Tips',
        postTitle: 'Upgrade your kit',
        postAuthor: { name: 'Maria Santos', bio: 'Joined 2 weeks ago', time: 'Sun, 9:00 AM' },
        content: 'Upgrade your street photography kit — exclusive discounts at photogeardeals.store. These are exact items used by pros. Reply for my referral link!',
        reports: [{ name: 'James Liu', reason: 'Spam', date: 'Sun, 10:15 AM', comment: 'Fourth post from same domain in 48 hours.' }],
      },
    ],
  },
  'jake-miller': {
    name: 'Jake Miller',
    cards: [
      {
        id: 'jm-1', type: 'Comment', context: 'Golden Hour Collection',
        postTitle: 'Rim light portrait comment',
        postAuthor: { name: 'Jake Miller', bio: 'Member · 14 months · 23 posts', time: 'Yesterday, 4:12 PM' },
        content: 'holy shit this is perfect. How did you get that rim light on the edge of the face? The separation from the background is insane.',
        reports: [{ name: 'Profanity Filter', reason: 'Profanity', date: 'Yesterday, 4:12 PM', comment: 'Auto-flagged: contains profanity.' }],
      },
      {
        id: 'jm-2', type: 'Comment', context: 'Studio Setup Tutorial',
        postTitle: 'Studio tones comment',
        postAuthor: { name: 'Jake Miller', bio: 'Member · 14 months · 23 posts', time: 'Yesterday, 5:40 PM' },
        content: 'damn these tones are insane. Absolutely gorgeous work. What LUT are you using? The skin rendering is chef\'s kiss.',
        reports: [{ name: 'Profanity Filter', reason: 'Profanity', date: 'Yesterday, 5:40 PM', comment: 'Auto-flagged: contains word "damn".' }],
      },
    ],
  },
};

const FALLBACK_AUTHOR: AuthorData = { name: 'Unknown', cards: [] };

/* ─── Member actions popover ─────────────────────────────────── */
const MemberActionsMenu: React.FC = () => {
  const [moderatePosts, setModeratePosts] = useState(false);
  const [disableConnections, setDisableConnections] = useState(false);
  const [disableDMs, setDisableDMs] = useState(false);

  const ToggleRow: React.FC<{ label: string; value: boolean; onChange: () => void }> = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between px-3 py-2">
      <Typography variant="body-sm" color="primary">{label}</Typography>
      <button
        onClick={onChange}
        className={`w-7 h-4 rounded-full transition-all duration-200 relative shrink-0 ${value ? 'bg-info' : 'bg-secondary'}`}
        aria-checked={value}
        role="switch"
      >
        <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-200 ${value ? 'left-3.5' : 'left-0.5'}`} />
      </button>
    </div>
  );

  return (
    <div className="w-56 py-1 bg-primary">
      <ToggleRow label="Moderate future posts"   value={moderatePosts}      onChange={() => setModeratePosts(v => !v)} />
      <ToggleRow label="Disable connections"      value={disableConnections} onChange={() => setDisableConnections(v => !v)} />
      <ToggleRow label="Disable direct messaging" value={disableDMs}         onChange={() => setDisableDMs(v => !v)} />
      <div className="border-t border-secondary my-1" />
      <div className="px-3 py-2 cursor-pointer hover:bg-hover">
        <Typography variant="body-sm" color="danger">Ban member</Typography>
      </div>
    </div>
  );
};

/* ─── Report row with status badge ────────────────────────────── */
function V2ReportRow({ report, onOpenProfile }: { report: Reporter; onOpenProfile?: (name: string) => void }) {
  const status = report.status ?? 'pending';
  const badgeVariant = status === 'removed' ? 'destructive' : status === 'approved' ? 'success' : 'secondary';
  const badgeLabel = status === 'removed' ? 'Removed' : status === 'approved' ? 'Approved' : 'Pending';

  return (
    <div className="flex gap-3 items-center">
      <button
        className="shrink-0 focus:outline-none"
        onClick={() => onOpenProfile?.(report.name)}
        aria-label={`View ${report.name}'s profile`}
      >
        <Avatar name={report.name} size="sm" />
      </button>
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <div className="flex items-center gap-1 text-sm">
          <button className="focus:outline-none" onClick={() => onOpenProfile?.(report.name)}>
            <Typography variant="label-sm" color="primary">{report.name}</Typography>
          </button>
          <Typography variant="body-sm" color="secondary">reported for</Typography>
          <Typography variant="label-sm" color="primary">{report.reason}</Typography>
        </div>
        <Typography variant="caption" color="tertiary">{report.date}</Typography>
      </div>
      <Badge variant={badgeVariant} label={badgeLabel} />
    </div>
  );
}

/* ─── Split button option helpers ─────────────────────────────── */
function getRemoveSplitOption(type: ContentType): string {
  switch (type) {
    case 'Connection': return 'Remove and disable connections';
    case 'Comment': return 'Remove and flag member';
    case 'DM': return 'Remove and disable direct messages';
    default: return 'Remove and moderate future posts';
  }
}

/* ─── Main component ─────────────────────────────────────────── */
interface ModerationCenterPanelProps {
  selectedId: string;
  onOpenProfile?: (name: string) => void;
}

const fireReview = (id: string) => window.dispatchEvent(new CustomEvent('moderation-reviewed', { detail: { id } }));

const ModerationCenterPanel: React.FC<ModerationCenterPanelProps> = ({ selectedId, onOpenProfile }) => {
  const [checkedCards, setCheckedCards] = useState<Set<string>>(new Set());
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [outcomesOverride, setOutcomesOverride] = useState<Record<string, 'removed' | 'allowed'>>({});
  const [resolvedCards, setResolvedCards] = useState<Record<string, 'allowed' | 'removed'>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const authorData = AUTHOR_DATA[selectedId] ?? FALLBACK_AUTHOR;
  const { name, cards } = authorData;
  const historyItems = HISTORY_ITEMS[selectedId] ?? [];
  const historySummary = HISTORY_SUMMARIES[selectedId] ?? null;

  // Pending cards = cards not yet resolved
  const pendingCards = cards.filter(card => !resolvedCards[card.id]);

  // Build history items from resolved pending cards
  const newHistoryItems: ModerationHistoryItem[] = cards
    .filter(card => resolvedCards[card.id])
    .map(card => ({
      id: `resolved-${card.id}`,
      type: card.type as ModerationHistoryItem['type'],
      outcome: resolvedCards[card.id],
      date: new Date().toISOString().split('T')[0],
      contentSnippet: card.content.slice(0, 80) + (card.content.length > 80 ? '...' : ''),
      decidedBy: 'You',
      context: card.context,
    }));

  const allHistoryItems = [...newHistoryItems, ...historyItems];

  const resolvedAllowedCount = Object.values(resolvedCards).filter(o => o === 'allowed').length;
  const resolvedRemovedCount = Object.values(resolvedCards).filter(o => o === 'removed').length;

  const effectiveAllowedCount = (historyItems.length > 0
    ? historyItems.filter(i => (outcomesOverride[i.id] ?? i.outcome) === 'allowed').length
    : (historySummary?.allowedCount ?? 0)) + resolvedAllowedCount;
  const effectiveRemovedCount = (historyItems.length > 0
    ? historyItems.filter(i => (outcomesOverride[i.id] ?? i.outcome) === 'removed').length
    : (historySummary?.removedCount ?? 0)) + resolvedRemovedCount;

  useEffect(() => {
    setHistoryExpanded(false);
    setOutcomesOverride({});
    setResolvedCards({});
  }, [selectedId]);

  const handleOutcomeChange = (id: string, outcome: 'removed' | 'allowed') => {
    setOutcomesOverride(prev => ({ ...prev, [id]: outcome }));
  };

  const handleAllowAll = () => {
    const overrides: Record<string, 'removed' | 'allowed'> = {};
    historyItems.forEach(i => { overrides[i.id] = 'allowed'; });
    setOutcomesOverride(overrides);
  };

  const handleRemoveAll = () => {
    const overrides: Record<string, 'removed' | 'allowed'> = {};
    historyItems.forEach(i => { overrides[i.id] = 'removed'; });
    setOutcomesOverride(overrides);
  };

  const handleCardResolve = (cardId: string, outcome: 'allowed' | 'removed') => {
    const next = { ...resolvedCards, [cardId]: outcome };
    setResolvedCards(next);
    setHistoryExpanded(true);
    // If all cards are now resolved, fire review to dismiss from thread list
    if (cards.every(c => next[c.id])) {
      fireReview(selectedId);
    }
  };

  const handleAllowAllAction = () => {
    const next: Record<string, 'allowed' | 'removed'> = { ...resolvedCards };
    cards.forEach(c => { if (!next[c.id]) next[c.id] = 'allowed'; });
    setResolvedCards(next);
    setHistoryExpanded(true);
    handleAllowAll();
    fireReview(selectedId);
  };

  const handleRemoveAllAction = () => {
    const next: Record<string, 'allowed' | 'removed'> = { ...resolvedCards };
    cards.forEach(c => { if (!next[c.id]) next[c.id] = 'removed'; });
    setResolvedCards(next);
    setHistoryExpanded(true);
    handleRemoveAll();
    fireReview(selectedId);
  };

  const toggleCard = (cardId: string, checked: boolean) => {
    setCheckedCards(prev => {
      const next = new Set(prev);
      checked ? next.add(cardId) : next.delete(cardId);
      return next;
    });
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full bg-primary">
      {/* Header */}
      <div className="px-3 py-2 flex items-center gap-3 border-b border-secondary shrink-0">
        <div className="flex gap-4 items-center px-3 py-2 rounded-xl">
          <button
            className="focus:outline-none shrink-0"
            onClick={() => onOpenProfile?.(name)}
            aria-label={`View ${name}'s profile`}
          >
            <Avatar name={name} size="sm" />
          </button>
          <div className="flex flex-col">
            <button className="focus:outline-none text-left" onClick={() => onOpenProfile?.(name)}>
              <Typography variant="heading-sm" color="primary">{name}</Typography>
            </button>
            {historySummary && (
              effectiveAllowedCount === 0 && effectiveRemovedCount === 0 ? (
                <Typography variant="label-xs" color="tertiary">No prior history</Typography>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Typography variant="label-xs" color="tertiary">{effectiveAllowedCount} allowed</Typography>
                  <Typography variant="label-xs" color="tertiary">/</Typography>
                  <Typography variant="label-xs" color="tertiary">{effectiveRemovedCount} removed</Typography>
                  <Typography variant="label-xs" color="tertiary">since {new Date(historySummary.firstEventDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</Typography>
                </div>
              )
            )}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {pendingCards.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={handleAllowAllAction}>Allow all</Button>
              <Button variant="outline" size="sm" onClick={handleRemoveAllAction}>Remove all</Button>
            </>
          )}
          <Popover
            trigger={<IconButton icon="dot-menu" variant="outline" size="sm" aria-label="Member actions" />}
            side="bottom"
            align="end"
            closeOnContentClick={false}
          >
            <MemberActionsMenu />
          </Popover>
        </div>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-12 py-8">
        <div className="max-w-[800px] mx-auto flex flex-col gap-6">

        {pendingCards.map(card => {
          const isChecked = checkedCards.has(card.id);

          return (
            <div key={card.id} className="border border-secondary rounded-2xl overflow-hidden shadow-2xs">
              {/* Card header row */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-secondary">
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={checked => toggleCard(card.id, !!checked)}
                  aria-label={`Select ${card.type} for action`}
                />
                <Badge variant="secondary" label={card.type} />
                <Typography variant="body-sm" color="secondary" className="shrink-0">in</Typography>
                <Typography variant="body-sm" color="primary" className="truncate flex-1 font-semibold">
                  {card.context}
                </Typography>
                <div className="flex items-center gap-1.5 shrink-0">
                  {card.type === 'Post' ? (
                    <SplitButton
                      variant="outline"
                      size="sm"
                      onClick={() => handleCardResolve(card.id, 'allowed')}
                      menuOptions={[{ label: 'Approve and moderate future posts', onClick: () => handleCardResolve(card.id, 'allowed') }]}
                    >
                      Approve
                    </SplitButton>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleCardResolve(card.id, 'allowed')}>Approve</Button>
                  )}
                  <SplitButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleCardResolve(card.id, 'removed')}
                    menuOptions={[{ label: getRemoveSplitOption(card.type), onClick: () => handleCardResolve(card.id, 'removed') }]}
                  >
                    Remove
                  </SplitButton>
                </div>
              </div>

              {/* Card content */}
              <div className="p-5 border-b border-secondary flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <button
                    className="focus:outline-none shrink-0"
                    onClick={() => onOpenProfile?.(card.postAuthor.name)}
                    aria-label={`View ${card.postAuthor.name}'s profile`}
                  >
                    <Avatar name={card.postAuthor.name} size="md" />
                  </button>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <button className="focus:outline-none text-left" onClick={() => onOpenProfile?.(card.postAuthor.name)}>
                        <Typography variant="label-sm" color="primary">{card.postAuthor.name}</Typography>
                      </button>
                      <Typography variant="body-sm" color="tertiary">{card.postAuthor.time}</Typography>
                    </div>
                    <Typography variant="caption" color="tertiary">{card.postAuthor.bio}</Typography>
                  </div>
                </div>
                <Typography variant="body-sm" color="secondary">{card.content}</Typography>
              </div>

              {/* Reports accordion */}
              <div className="px-4">
                <Accordion.Root multiple>
                  <Accordion.Item value={card.id}>
                    <Accordion.Trigger className="py-3 w-full text-left">
                      <Typography variant="label-sm" color="primary">
                        {card.reports.length} {card.reports.length === 1 ? 'report' : 'reports'}
                      </Typography>
                    </Accordion.Trigger>
                    <Accordion.Content>
                      <div className="pb-4 flex flex-col">
                        {/* THIS REPORT */}
                        <Typography variant="label-xs-uppercase" color="tertiary" className="mb-3">This report</Typography>
                        <V2ReportRow report={card.reports[0]} onOpenProfile={onOpenProfile} />

                        {/* OTHER REPORTS */}
                        {card.reports.length > 1 && (
                          <>
                            <Typography variant="label-xs-uppercase" color="tertiary" className="mt-5 mb-3">Other reports</Typography>
                            <div className="flex flex-col gap-4">
                              {card.reports.slice(1).map((r, i) => (
                                <V2ReportRow key={i} report={r} onOpenProfile={onOpenProfile} />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion.Root>
              </div>
            </div>
          );
        })}

        {pendingCards.length === 0 && allHistoryItems.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-16">
            <Typography variant="body-md" color="tertiary">No flagged content</Typography>
          </div>
        )}

        {/* History toggle + timeline */}
        {allHistoryItems.length > 0 && (
          <>
            <div className="flex flex-col items-center">
              <ModerationHistoryToggle
                count={allHistoryItems.length}
                isExpanded={historyExpanded}
                onToggle={() => {
                  const scrollTop = scrollRef.current?.scrollTop ?? 0;
                  setHistoryExpanded(v => !v);
                  requestAnimationFrame(() => {
                    if (scrollRef.current) scrollRef.current.scrollTop = scrollTop;
                  });
                }}
              />
            </div>
            {historyExpanded && <ModerationHistoryTimeline items={allHistoryItems} outcomesOverride={outcomesOverride} onOutcomeChange={handleOutcomeChange} onOpenProfile={onOpenProfile} />}
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default ModerationCenterPanel;
