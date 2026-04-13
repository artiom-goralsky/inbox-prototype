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
import { HISTORY_ITEMS, HISTORY_SUMMARIES } from './mockModerationHistory';
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
    name: 'Calvin Parks',
    cards: [
      {
        id: 'card-1',
        type: 'Post',
        context: 'Introductions',
        postTitle: 'Welcome to the Clarity Community!',
        postAuthor: { name: 'Calvin Parks', bio: 'Photographer · Intermediate', time: 'Today, 9:14 AM' },
        content: 'Welcome to the Clarity Community! 🎉 I\'m so excited to be here. Quick note — if you\'re looking to grow your audience fast, I\'ve been using this incredible tool that got me 10k followers in a week. DM me for the link, completely free! Don\'t miss out before it expires.',
        reports: [
          { name: 'Kristin Watson', reason: 'Spam',       date: 'Today, 9:14 AM',      comment: 'This is clearly promotional spam — unsolicited advertisement.', status: 'removed' as const },
          { name: 'Ralph Edwards',  reason: 'Spam',       date: 'Today, 8:52 AM',      comment: 'Spammy link drop. Classic self-promotion scheme.', status: 'approved' as const },
          { name: 'Jane Cooper',    reason: 'Spam',       date: 'Yesterday, 4:33 PM',  comment: 'Flagging for spam. Same post appeared in 3 different spaces.', status: 'pending' as const },
          { name: 'Dianne Russell', reason: 'Misleading', date: 'Yesterday, 2:17 PM',  comment: 'The "10k followers in a week" claim is obviously false.', status: 'pending' as const },
          { name: 'Jacob Jones',    reason: 'Spam',       date: 'Yesterday, 11:05 AM', comment: 'Reported as spam — unsolicited promotion with suspicious link.', status: 'pending' as const },
        ],
      },
      {
        id: 'card-2',
        type: 'Comment',
        context: 'Welcome to clarity community',
        postTitle: 'Thanks for this!',
        postAuthor: { name: 'Calvin Parks', bio: 'Photographer · Intermediate', time: 'Today, 10:00 AM' },
        content: 'Thanks for this! By the way, I found a shortcut — check out growthboost.io, it works for any community platform. I\'ve been using it for months. Reply here or DM me if you want details.',
        reports: [
          { name: 'Wade Warren', reason: 'Spam', date: 'Today, 10:05 AM', comment: 'Another spam comment linking to an external service.', status: 'pending' as const },
          { name: 'Cody Fisher', reason: 'Spam', date: 'Today, 9:48 AM',  comment: 'Growthboost.io is a known spam referral link.', status: 'pending' as const },
        ],
      },
    ],
  },
  km: {
    name: 'Kathryn Murphy',
    cards: [
      {
        id: 'card-3',
        type: 'Post',
        context: 'General',
        postTitle: 'HUGE opportunity — limited spots available!',
        postAuthor: { name: 'Kathryn Murphy', bio: 'Designer · Advanced', time: 'Today, 11:20 AM' },
        content: 'HUGE opportunity — limited spots available! Reply NOW to claim your free trial before midnight.',
        reports: [
          { name: 'Kristin Watson', reason: 'Spam',       date: 'Today, 11:20 AM',     comment: 'Urgency tactics and all-caps shouting — clear spam pattern.' },
          { name: 'Calvin Parks',   reason: 'Spam',       date: 'Today, 10:48 AM',     comment: 'Looks like an unsolicited ad, no context provided.' },
          { name: 'Jane Cooper',    reason: 'Misleading', date: 'Today, 10:01 AM',     comment: '"Free trial" with no product details is misleading.' },
          { name: 'Ralph Edwards',  reason: 'Spam',       date: 'Yesterday, 6:15 PM',  comment: 'Flagged for aggressive promotional language.' },
          { name: 'Annette Black',  reason: 'Spam',       date: 'Yesterday, 5:40 PM',  comment: 'Same template post in multiple channels.' },
        ],
      },
    ],
  },
  'maria-santos': {
    name: 'Maria Santos',
    cards: [
      {
        id: 'ms-1', type: 'Post', context: 'Photography Basics',
        postTitle: 'Check out these amazing deals!',
        postAuthor: { name: 'Maria Santos', bio: 'Joined 2 weeks ago', time: 'Sat, 10:14 AM' },
        content: 'Check out these amazing deals on camera gear at GearShop.io — professional quality at 30% off. Use code PHOTO30 at checkout!',
        reports: [{ name: 'Calvin Parks', reason: 'Spam', date: 'Sat, 11:02 AM', comment: 'Promotional link drop.' }],
      },
      {
        id: 'ms-2', type: 'Post', context: 'Landscape Tips',
        postTitle: 'Professional photographers swear by these lenses',
        postAuthor: { name: 'Maria Santos', bio: 'Joined 2 weeks ago', time: 'Sat, 11:30 AM' },
        content: 'Professional photographers swear by these lenses — get 20% off at GearShop.io. Reply for my referral link!',
        reports: [{ name: 'Annette Black', reason: 'Spam', date: 'Sat, 12:05 PM', comment: 'Same store link as the other post.' }],
      },
      {
        id: 'ms-3', type: 'Post', context: 'Street Photography',
        postTitle: 'Upgrade your street photography kit',
        postAuthor: { name: 'Maria Santos', bio: 'Joined 2 weeks ago', time: 'Sat, 2:45 PM' },
        content: 'Upgrade your street photography kit — exclusive discounts at GearShop.io. Sale ends Sunday midnight.',
        reports: [{ name: 'Wade Warren', reason: 'Spam', date: 'Sat, 3:10 PM', comment: 'Third post linking to the same store.' }],
      },
    ],
  },
  'jake-miller': {
    name: 'Jake Miller',
    cards: [
      {
        id: 'jm-1', type: 'Comment', context: 'Street Photography',
        postTitle: 'this shot is damn beautiful',
        postAuthor: { name: 'Jake Miller', bio: 'Member · 14 months', time: 'Yesterday, 4:12 PM' },
        content: 'this shot is damn beautiful — the lighting in the background is unreal. Genuinely one of the best captures this month.',
        reports: [{ name: 'Profanity Filter', reason: 'Profanity', date: 'Yesterday, 4:12 PM', comment: 'Auto-flagged: contains word "damn".' }],
      },
      {
        id: 'jm-2', type: 'Comment', context: 'Landscape Tips',
        postTitle: 'holy damn that golden hour shot',
        postAuthor: { name: 'Jake Miller', bio: 'Member · 14 months', time: 'Yesterday, 5:40 PM' },
        content: 'holy damn that golden hour shot is everything. Reminds me of why I got into photography.',
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const authorData = AUTHOR_DATA[selectedId] ?? FALLBACK_AUTHOR;
  const { name, cards } = authorData;
  const historyItems = HISTORY_ITEMS[selectedId] ?? [];
  const historySummary = HISTORY_SUMMARIES[selectedId] ?? null;

  const effectiveAllowedCount = historyItems.length > 0
    ? historyItems.filter(i => (outcomesOverride[i.id] ?? i.outcome) === 'allowed').length
    : (historySummary?.allowedCount ?? 0);
  const effectiveRemovedCount = historyItems.length > 0
    ? historyItems.filter(i => (outcomesOverride[i.id] ?? i.outcome) === 'removed').length
    : (historySummary?.removedCount ?? 0);

  useEffect(() => {
    setHistoryExpanded(false);
    setOutcomesOverride({});
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
          {cards.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={() => { handleAllowAll(); fireReview(selectedId); }}>Allow all</Button>
              <Button variant="outline" size="sm" onClick={() => { handleRemoveAll(); fireReview(selectedId); }}>Remove all</Button>
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

        {cards.map(card => {
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
                      onClick={() => fireReview(selectedId)}
                      menuOptions={[{ label: 'Approve and moderate future posts', onClick: () => fireReview(selectedId) }]}
                    >
                      Approve
                    </SplitButton>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => fireReview(selectedId)}>Approve</Button>
                  )}
                  <SplitButton
                    variant="outline"
                    size="sm"
                    onClick={() => fireReview(selectedId)}
                    menuOptions={[{ label: getRemoveSplitOption(card.type), onClick: () => fireReview(selectedId) }]}
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

        {cards.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-16">
            <Typography variant="body-md" color="tertiary">No flagged content</Typography>
          </div>
        )}

        {/* History toggle + timeline */}
        {historyItems.length > 0 && (
          <>
            <div className="flex flex-col items-center">
              <ModerationHistoryToggle
                count={historyItems.length}
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
            {historyExpanded && <ModerationHistoryTimeline items={historyItems} outcomesOverride={outcomesOverride} onOutcomeChange={handleOutcomeChange} onOpenProfile={onOpenProfile} />}
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default ModerationCenterPanel;
