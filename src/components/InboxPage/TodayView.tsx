import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Button } from '@circleco/compass/components/Button';
import { Icon } from '@circleco/compass/components/Icon';
import { needsYouCards, readyCards, type NeedsYouCard, type ReadyCard } from '../CopilotView/InboxSession/inboxScenarioData';
import { decideCards, confirmCards, type ModerationDecideCard, type ModerationConfirmCard } from '../CopilotView/InboxSession/moderationScenarioData';
import DMCenterPanel from './DMCenterPanel';
import CourseCommentsCenterPanel from './CourseCommentsCenterPanel';

// ── Animation state machine ──
type CardAnim = 'active' | 'dismissing' | 'collapsing' | 'removed';
const DISMISS_MS = 300;
const COLLAPSE_MS = 250;
const STAGGER_MS = 60;

interface ContextPanel {
  type: 'dm' | 'course-comments';
  threadId: string;
  draft?: string;
  recipientName?: string;
}

// ── Stats tracking ──
interface Stats {
  total: number;
  sent: number;
  moderated: number;
  decideCount: number;
  routineCount: number;
}

function timeSaved(stats: Stats): string | null {
  if (stats.total < 5) return null;
  const seconds = stats.routineCount * 20 + stats.decideCount * 120;
  const mins = Math.round(seconds / 60);
  return mins < 1 ? null : `~${mins} min saved`;
}

const TodayView: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(needsYouCards[0]?.id ?? null);
  const [cardStates, setCardStates] = useState<Record<string, CardAnim>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [showAllRoutineDm, setShowAllRoutineDm] = useState(false);
  const [showAllRoutineMod, setShowAllRoutineMod] = useState(false);
  const [contextPanel, setContextPanel] = useState<ContextPanel | null>(null);
  const composerDraftForPanel = useMemo(
    () => contextPanel?.draft ? { text: contextPanel.draft, recipientName: contextPanel.recipientName ?? '' } : null,
    [contextPanel]
  );
  const [batchSending, setBatchSending] = useState<Record<string, boolean>>({});
  const [stats, setStats] = useState<Stats>({ total: 0, sent: 0, moderated: 0, decideCount: 0, routineCount: 0 });
  const [sectionAnims, setSectionAnims] = useState<Record<string, CardAnim>>({});

  const getState = (id: string): CardAnim => cardStates[id] ?? 'active';

  const dismissCard = useCallback((id: string, type: 'sent' | 'moderated' | 'decide' | 'routine') => {
    setCardStates((prev) => ({ ...prev, [id]: 'dismissing' }));
    setExpandedId(null);
    setTimeout(() => setCardStates((prev) => ({ ...prev, [id]: 'collapsing' })), DISMISS_MS);
    setTimeout(() => {
      setCardStates((prev) => ({ ...prev, [id]: 'removed' }));
      setStats((s) => ({
        total: s.total + 1,
        sent: s.sent + (type === 'sent' ? 1 : 0),
        moderated: s.moderated + (type === 'moderated' ? 1 : 0),
        decideCount: s.decideCount + (type === 'decide' ? 1 : 0),
        routineCount: s.routineCount + (type === 'routine' ? 1 : 0),
      }));
    }, DISMISS_MS + COLLAPSE_MS);
  }, []);

  const dismissBatch = useCallback((ids: string[], bundleKey: string, type: 'sent' | 'moderated') => {
    setBatchSending((prev) => ({ ...prev, [bundleKey]: true }));
    ids.forEach((id, i) => {
      setTimeout(() => dismissCard(id, type === 'sent' ? 'routine' : 'routine'), i * STAGGER_MS);
    });
    const totalTime = (ids.length - 1) * STAGGER_MS + DISMISS_MS + COLLAPSE_MS + 200;
    setTimeout(() => setBatchSending((prev) => ({ ...prev, [bundleKey]: false })), totalTime);
  }, [dismissCard]);

  const toggleExpand = (id: string) => setExpandedId(expandedId === id ? null : id);

  const openContext = (type: 'dm' | 'course-comments', threadId: string, draft?: string, recipientName?: string) => {
    setContextPanel({ type, threadId, draft, recipientName });
  };

  const isRemoved = (id: string) => getState(id) === 'removed';
  const isLive = (id: string) => getState(id) === 'active';

  const liveNeedsYou = needsYouCards.filter((c) => !isRemoved(c.id));
  const liveDecide = decideCards.filter((c) => !isRemoved(c.id));
  const liveRoutineDm = readyCards.filter((c) => !isRemoved(c.id));
  const liveRoutineMod = confirmCards.filter((c) => !isRemoved(c.id));

  const activeNeedsYou = needsYouCards.filter((c) => isLive(c.id));
  const activeDecide = decideCards.filter((c) => isLive(c.id));
  const activeRoutineDm = readyCards.filter((c) => isLive(c.id));
  const activeRoutineMod = confirmCards.filter((c) => isLive(c.id));

  const hasNeedsYou = liveNeedsYou.length > 0 || liveDecide.length > 0;
  const hasRoutine = liveRoutineDm.length > 0 || liveRoutineMod.length > 0;
  const allDone = !hasNeedsYou && !hasRoutine && stats.total > 0;

  // Section collapse after all items removed
  useEffect(() => {
    if (activeNeedsYou.length === 0 && activeDecide.length === 0 && liveNeedsYou.length === 0 && liveDecide.length === 0 && stats.total > 0 && sectionAnims['needs-you'] !== 'removed') {
      const t1 = setTimeout(() => setSectionAnims((p) => ({ ...p, 'needs-you': 'dismissing' })), 200);
      const t2 = setTimeout(() => setSectionAnims((p) => ({ ...p, 'needs-you': 'collapsing' })), 200 + DISMISS_MS);
      const t3 = setTimeout(() => setSectionAnims((p) => ({ ...p, 'needs-you': 'removed' })), 200 + DISMISS_MS + COLLAPSE_MS);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [activeNeedsYou.length, activeDecide.length, liveNeedsYou.length, liveDecide.length, stats.total, sectionAnims]);

  const animClass = (state: CardAnim) => {
    if (state === 'dismissing') return 'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] scale-95 opacity-0 pointer-events-none';
    if (state === 'collapsing') return 'transition-all duration-250 ease-out h-0 !mb-0 !py-0 !border-0 overflow-hidden opacity-0 pointer-events-none';
    if (state === 'removed') return 'hidden';
    return '';
  };

  const ts = timeSaved(stats);

  return (
    <div className="flex-1 flex min-h-0">
      {/* Today View column */}
      <div
        className="overflow-y-auto bg-primary shrink-0 transition-[width] duration-300 ease-in-out"
        style={{ width: contextPanel ? '40%' : '100%' }}
      >
        <div className="max-w-[640px] mx-auto px-6 py-8">

          {/* ── Needs you ── */}
          {sectionAnims['needs-you'] !== 'removed' && hasNeedsYou && (
            <div className={`mb-10 ${animClass(sectionAnims['needs-you'] ?? 'active')}`}>
              <Typography variant="heading-xl" color="primary" className="mb-4">Needs you</Typography>

              {liveNeedsYou.length > 0 && <SubGroupLabel label="DMs" />}
              {liveNeedsYou.map((card) => (
                <div key={card.id} className={`mb-1 ${animClass(getState(card.id))}`}>
                  <DmDecideCard
                    card={card}
                    isExpanded={expandedId === card.id}
                    onToggle={() => toggleExpand(card.id)}
                    onAction={() => dismissCard(card.id, 'decide')}
                    selectedOption={selectedOptions[card.id]}
                    onSelectOption={(idx) => setSelectedOptions((p) => ({ ...p, [card.id]: idx }))}
                    onAddToComposer={(draft) => openContext('dm', card.id, draft, card.name)}
                  />
                </div>
              ))}

              {liveDecide.length > 0 && <SubGroupLabel label="Moderation" />}
              {liveDecide.map((card) => (
                <div key={card.id} className={`mb-1 ${animClass(getState(card.id))}`}>
                  <ModDecideCard
                    card={card}
                    isExpanded={expandedId === card.id}
                    onToggle={() => toggleExpand(card.id)}
                    onAction={() => dismissCard(card.id, 'moderated')}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ── Routine ── */}
          {hasRoutine && (
            <div>
              <Typography variant="heading-xl" color="primary" className="mb-4">Routine</Typography>

              {/* DM bundle */}
              {liveRoutineDm.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <Typography variant="body-sm" color="secondary">
                      DMs &middot; {activeRoutineDm.length} {batchSending['dm'] ? 'remaining' : 'drafts ready'}
                    </Typography>
                    <button
                      className="text-sm font-medium text-primary cursor-pointer hover:underline disabled:opacity-50 disabled:cursor-default"
                      disabled={!!batchSending['dm']}
                      onClick={() => dismissBatch(activeRoutineDm.map((c) => c.id), 'dm', 'sent')}
                    >
                      {batchSending['dm'] ? 'Sending...' : `Send all ${activeRoutineDm.length}`}
                    </button>
                  </div>
                  <div className="flex flex-col gap-1">
                    {(showAllRoutineDm ? liveRoutineDm : liveRoutineDm.slice(0, 4)).map((card) => (
                      <div key={card.id} className={animClass(getState(card.id))}>
                        <DmRoutineCard
                          card={card}
                          isExpanded={expandedId === card.id}
                          onToggle={() => toggleExpand(card.id)}
                          onAddToComposer={(draft) => openContext('dm', card.id, draft, card.name)}
                        />
                      </div>
                    ))}
                  </div>
                  {!showAllRoutineDm && readyCards.filter((c) => !isRemoved(c.id)).length > 4 && (
                    <button className="mt-2 text-sm font-medium text-secondary hover:underline cursor-pointer" onClick={() => setShowAllRoutineDm(true)}>
                      Show {readyCards.filter((c) => !isRemoved(c.id)).length - 4} more
                    </button>
                  )}
                </div>
              )}

              {/* Moderation bundle */}
              {liveRoutineMod.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <Typography variant="body-sm" color="secondary">
                      Moderation &middot; {activeRoutineMod.length} {batchSending['mod'] ? 'remaining' : 'flagged items'}
                    </Typography>
                    <button
                      className="text-sm font-medium text-primary cursor-pointer hover:underline disabled:opacity-50 disabled:cursor-default"
                      disabled={!!batchSending['mod']}
                      onClick={() => dismissBatch(activeRoutineMod.map((c) => c.id), 'mod', 'moderated')}
                    >
                      {batchSending['mod'] ? 'Confirming...' : 'Confirm all'}
                    </button>
                  </div>
                  <div className="flex flex-col gap-1">
                    {(showAllRoutineMod ? liveRoutineMod : liveRoutineMod.slice(0, 4)).map((card) => (
                      <div key={card.id} className={animClass(getState(card.id))}>
                        <ModRoutineCard
                          card={card}
                          isExpanded={expandedId === card.id}
                          onToggle={() => toggleExpand(card.id)}
                          onAction={() => dismissCard(card.id, 'moderated')}
                        />
                      </div>
                    ))}
                  </div>
                  {!showAllRoutineMod && confirmCards.filter((c) => !isRemoved(c.id)).length > 4 && (
                    <button className="mt-2 text-sm font-medium text-secondary hover:underline cursor-pointer" onClick={() => setShowAllRoutineMod(true)}>
                      Show {confirmCards.filter((c) => !isRemoved(c.id)).length - 4} more
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Progress counter ── */}
          {stats.total > 0 && !allDone && (
            <div className="mt-8 text-right animate-[fadeSlideUp_0.3s_ease_forwards]">
              <Typography variant="body-sm" color="secondary">
                {stats.total} handled{ts ? ` \u00b7 ${ts}` : ''}
              </Typography>
            </div>
          )}

          {/* ── Empty state ── */}
          {allDone && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 animate-[fadeIn_0.4s_ease_forwards]">
              <Typography variant="heading-md" color="primary">All clear</Typography>
              <Typography variant="body-sm" color="secondary">
                {stats.total} items handled{stats.sent > 0 ? ` \u00b7 ${stats.sent} sent` : ''}{stats.moderated > 0 ? ` \u00b7 ${stats.moderated} moderated` : ''}
              </Typography>
              <Typography variant="body-sm" color="tertiary">AI continues monitoring.</Typography>
            </div>
          )}
        </div>
      </div>

      {/* ── Context Panel ── */}
      {contextPanel && (
        <div className="flex-1 h-full border-l border-secondary flex flex-col transition-all duration-300 ease-in-out">
          <div className="flex-1 min-h-0 flex flex-col">
            {contextPanel.type === 'dm' && (
              <DMCenterPanel
                selectedId={contextPanel.threadId}
                onOpenProfile={() => {}}
                composerDraft={composerDraftForPanel}
                onSendReply={(threadId, text) => {
                  dismissCard(contextPanel.threadId, 'sent');
                }}
                onClose={() => setContextPanel(null)}
              />
            )}
            {contextPanel.type === 'course-comments' && (
              <CourseCommentsCenterPanel
                selectedId={contextPanel.threadId}
                onOpenProfile={() => {}}
              />
            )}
          </div>
        </div>
      )}

      {/* Keyframe styles */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// ── Sub-components ──

function SubGroupLabel({ label }: { label: string }) {
  return (
    <Typography variant="label-xs" color="tertiary" className="uppercase tracking-wider mb-1.5 mt-3">
      {label}
    </Typography>
  );
}

function AddToComposerButton({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  return (
    <Button variant="outline" size="sm" className="self-start" onClick={onClick}>
      <span className="flex items-center gap-1.5">
        <Icon name="edit" size="sm" />
        <span>Add to composer</span>
      </span>
    </Button>
  );
}

// ── DM Decide Card ──

function DmDecideCard({
  card, isExpanded, onToggle, onAction, selectedOption, onSelectOption, onAddToComposer,
}: {
  card: NeedsYouCard; isExpanded: boolean; onToggle: () => void; onAction: () => void;
  selectedOption?: number; onSelectOption: (idx: number) => void; onAddToComposer: (draft: string) => void;
}) {
  const activeDraft = card.draftOptions
    ? (selectedOption !== undefined ? card.draftOptions[selectedOption]?.draft : undefined)
    : card.draft;

  return (
    <div className="border border-[#f0f3f5] rounded-xl overflow-hidden">
      <div role="button" tabIndex={0} onClick={onToggle} onKeyDown={(e) => e.key === 'Enter' && onToggle()}
        className="flex gap-3 items-start px-3.5 py-2.5 cursor-pointer hover:bg-hover transition-colors">
        <Avatar name={card.name} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Typography variant="label-sm" color="primary">{card.name}</Typography>
            <Typography variant="caption" color="tertiary" className="ml-auto shrink-0">4h</Typography>
          </div>
          <Typography variant="body-sm" color="secondary" className="truncate">{card.questionSnippet}</Typography>
        </div>
      </div>
      {isExpanded && (
        <div className="px-3.5 pb-3.5 flex flex-col gap-3 pl-12">
          <ReasoningBlock text={`${card.summary} ${card.tradeoff}`} source={card.tradeoffSource} />
          {card.draftOptions && (
            <div className="flex gap-2">
              {card.draftOptions.map((opt, idx) => (
                <Button key={opt.label} variant="outline" size="sm"
                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); onSelectOption(idx); }}>
                  {opt.label}
                </Button>
              ))}
            </div>
          )}
          {activeDraft && <DraftBlock text={activeDraft} />}
          {activeDraft && (
            <AddToComposerButton onClick={(e) => { e.stopPropagation(); onAddToComposer(activeDraft); }} />
          )}
        </div>
      )}
    </div>
  );
}

// ── Moderation Decide Card ──

function ModDecideCard({
  card, isExpanded, onToggle, onAction,
}: {
  card: ModerationDecideCard; isExpanded: boolean; onToggle: () => void; onAction: () => void;
}) {
  return (
    <div className="border border-[#f0f3f5] rounded-xl overflow-hidden">
      <div role="button" tabIndex={0} onClick={onToggle} onKeyDown={(e) => e.key === 'Enter' && onToggle()}
        className="flex gap-3 items-start px-3.5 py-2.5 cursor-pointer hover:bg-hover transition-colors">
        <Avatar name={card.author} size="sm" />
        <div className="flex-1 min-w-0">
          <Typography variant="label-sm" color="primary">{card.author}</Typography>
          <Typography variant="body-sm" color="secondary" className="truncate">{card.fullContent}</Typography>
        </div>
      </div>
      {isExpanded && (
        <div className="px-3.5 pb-3.5 flex flex-col gap-3 pl-12">
          <FlaggedByBlock text={card.flaggedBy} />
          <ReasoningBlock text={card.tradeoff} />
          <TradeOffBlock text={card.tradeoff} source={card.tradeoffSource} />
          <div className="flex gap-2">
            {card.actions.map((a) => (
              <Button key={a.label} variant="outline" size="sm"
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); onAction(); }}>
                {a.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── DM Routine Card ──

function DmRoutineCard({
  card, isExpanded, onToggle, onAddToComposer,
}: {
  card: ReadyCard; isExpanded: boolean; onToggle: () => void; onAddToComposer: (draft: string) => void;
}) {
  return (
    <div className="border border-[#f0f3f5] rounded-xl overflow-hidden">
      <div role="button" tabIndex={0} onClick={onToggle} onKeyDown={(e) => e.key === 'Enter' && onToggle()}
        className="flex gap-3 items-start px-3.5 py-2.5 cursor-pointer hover:bg-hover transition-colors">
        <Avatar name={card.name} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Typography variant="label-sm" color="primary">{card.name}</Typography>
            <Typography variant="caption" color="tertiary">4h</Typography>
          </div>
          <Typography variant="body-sm" color="secondary" className="truncate">{card.snippet}</Typography>
        </div>
      </div>
      {isExpanded && (
        <div className="px-3.5 pb-3.5 flex flex-col gap-3 pl-12">
          <ReasoningBlock text={card.summary} source={card.source} />
          <DraftBlock text={card.draft} />
          <AddToComposerButton onClick={(e) => { e.stopPropagation(); onAddToComposer(card.draft); }} />
        </div>
      )}
    </div>
  );
}

// ── Moderation Routine Card ──

function ModRoutineCard({
  card, isExpanded, onToggle, onAction,
}: {
  card: ModerationConfirmCard; isExpanded: boolean; onToggle: () => void; onAction: () => void;
}) {
  const action = card.preAssignedAction;
  return (
    <div className="border border-[#f0f3f5] rounded-xl overflow-hidden">
      <div role="button" tabIndex={0} onClick={onToggle} onKeyDown={(e) => e.key === 'Enter' && onToggle()}
        className="flex gap-3 items-center px-3.5 py-2.5 cursor-pointer hover:bg-hover transition-colors">
        <Avatar name={card.author} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Typography variant="label-sm" color="primary">{card.author}</Typography>
            <Typography variant="label-xs" color={action === 'Allow' ? 'success' : 'danger'} className="ml-auto shrink-0">
              {action}
            </Typography>
          </div>
          <Typography variant="body-sm" color="secondary" className="truncate">{card.contentPreview}</Typography>
        </div>
      </div>
      {isExpanded && (
        <div className="px-3.5 pb-3.5 flex flex-col gap-3 pl-12">
          <FlaggedByBlock text={card.flaggedBy} />
          <ReasoningBlock text={card.copilotReasoning} />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onAction(); }}>
              {action === 'Remove' ? 'Allow instead' : 'Allow instead'}
            </Button>
            <Button variant="outline" size="sm" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onAction(); }}>
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Shared blocks ──

function ReasoningBlock({ text, source }: { text: string; source?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <Icon name="imagine" size="sm" color="secondary" />
        <Typography variant="label-xs" color="secondary">Reasoning</Typography>
      </div>
      <Typography variant="body-sm" color="secondary">
        {text}
        {source && <>{' '}<span className="underline">{source}</span></>}
      </Typography>
    </div>
  );
}

function FlaggedByBlock({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <Icon name="triangle-exclamation" size="sm" color="secondary" />
        <Typography variant="label-xs" color="secondary">Flagged by</Typography>
      </div>
      <Typography variant="body-sm" color="secondary">{text}</Typography>
    </div>
  );
}

function TradeOffBlock({ text, source }: { text: string; source?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <Icon name="sparkle" size="sm" color="secondary" />
        <Typography variant="label-xs" color="secondary">Trade-off</Typography>
      </div>
      <Typography variant="body-sm" color="secondary">
        {text}
        {source && <>{' '}<span className="underline">{source}</span></>}
      </Typography>
    </div>
  );
}

function DraftBlock({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-1">
      <Typography variant="label-xs" color="secondary">Draft</Typography>
      <div className="border-l-2 border-[#506cf0] pl-3">
        <Typography variant="body-sm" color="primary">{text}</Typography>
      </div>
    </div>
  );
}

export default TodayView;
