import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Button } from '@circleco/compass/components/Button';
import { SplitButton } from '@circleco/compass/components/SplitButton';
import { Icon } from '@circleco/compass/components/Icon';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Checkbox } from '@circleco/compass/components/Checkbox';
import { Badge } from '@circleco/compass/components/Badge';
import { confirmCards, type ModerationConfirmCard } from './moderationScenarioData';

function getRemoveSplitOption(type: ModerationConfirmCard['type']): string {
  switch (type) {
    case 'Connection': return 'Remove and disable connections';
    case 'Comment': return 'Remove and flag member';
    case 'Message': return 'Remove and disable direct messages';
    default: return 'Remove and moderate future posts';
  }
}

interface ModerationConfirmListProps {
  onComplete: (confirmed: number, remaining: string[]) => void;
}

const groups = [
  { label: 'Maria Santos \u00b7 5 items', cards: confirmCards.filter(c => c.authorGroup === 'Maria Santos') },
  { label: 'Bot accounts \u00b7 3 items', cards: confirmCards.filter(c => c.authorGroup === 'Bot accounts') },
  { label: 'Jake Miller \u00b7 2 items', cards: confirmCards.filter(c => c.authorGroup === 'Jake Miller') },
];

const ModerationConfirmList: React.FC<ModerationConfirmListProps> = ({ onComplete }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set());
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [overrides, setOverrides] = useState<Record<string, 'Remove' | 'Allow'>>({});

  const confirmedCount = confirmedIds.size;
  const pendingCards = confirmCards.filter(c => !confirmedIds.has(c.id));
  const checkedCount = Array.from(checkedIds).filter(id => !confirmedIds.has(id)).length;
  const allConfirmed = pendingCards.length === 0;

  const getAction = (card: ModerationConfirmCard) => overrides[card.id] ?? card.preAssignedAction;

  const dispatchBadge = (next: Set<string>) => {
    const badge = confirmCards.length - next.size + 4;
    window.dispatchEvent(new CustomEvent('inbox-sync', { detail: { badgeUpdates: { moderation: badge } } }));
    if (next.size === confirmCards.length) setTimeout(() => onComplete(next.size, []), 200);
  };

  const confirmItems = (ids: string[]) => {
    const next = new Set(Array.from(confirmedIds));
    ids.forEach(id => next.add(id));
    setConfirmedIds(next);
    setCheckedIds(new Set());
    setExpandedId(null);
    dispatchBadge(next);
  };

  const confirmSingleAndAdvance = (id: string) => {
    const next = new Set(Array.from(confirmedIds));
    next.add(id);
    const remaining = confirmCards.filter(c => !next.has(c.id));
    setConfirmedIds(next);
    setCheckedIds(new Set());
    setExpandedId(remaining.length > 0 ? remaining[0].id : null);
    dispatchBadge(next);
  };

  const overrideAndConfirm = (card: ModerationConfirmCard) => {
    const current = getAction(card);
    setOverrides(prev => ({ ...prev, [card.id]: current === 'Remove' ? 'Allow' : 'Remove' }));
    confirmSingleAndAdvance(card.id);
  };

  const confirmSelected = () => confirmItems(Array.from(checkedIds).filter(id => !confirmedIds.has(id)));

  const toggleCheck = (id: string) => {
    setCheckedIds(prev => { const n = new Set(Array.from(prev)); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const handleCardClick = (card: ModerationConfirmCard) => {
    const nextId = expandedId === card.id ? null : card.id;
    setExpandedId(nextId);
    const threadId = card.authorGroup === 'Bot accounts' ? 'bot-accounts' : card.author.toLowerCase().replace(' ', '-');
    window.dispatchEvent(new CustomEvent('inbox-sync', {
      detail: { activeTab: 'moderation' as const, selectedThread: threadId, ...(nextId ? { markRead: card.id } : {}) },
    }));
  };

  return (
    <div className="border border-secondary rounded-xl overflow-hidden shadow-2xs bg-primary mt-2">
      {/* Header */}
      <div className="flex gap-1 items-start py-4 px-5 border-b border-secondary">
        <div className="flex flex-col flex-1">
          <Typography variant="heading-xl" color="primary">{String(confirmCards.length)}</Typography>
          <Typography variant="body-sm" color="secondary">{allConfirmed ? 'flagged items resolved' : 'flagged items'}</Typography>
          {!allConfirmed && (
            <div className="flex gap-1 items-center mt-0.5">
              <Typography variant="label-xs" color="secondary">5 spam</Typography>
              <Typography variant="caption" color="secondary">/</Typography>
              <Typography variant="label-xs" color="secondary">3 bot accounts</Typography>
              <Typography variant="caption" color="secondary">/</Typography>
              <Typography variant="label-xs" color="secondary">2 false positives</Typography>
            </div>
          )}
        </div>
        {!allConfirmed && (
          <Button variant="outline" size="sm" onClick={checkedCount > 0 ? confirmSelected : () => confirmItems(pendingCards.map(c => c.id))}>
            {checkedCount > 0 && checkedCount < pendingCards.length ? `Confirm ${checkedCount} selected` : `Confirm all ${pendingCards.length}`}
          </Button>
        )}
      </div>

      {/* Grouped card rows */}
      <div className="flex flex-col">
        {groups.map(group => (
          <React.Fragment key={group.label}>
            {group.cards.map((card, idx) => {
              const isConfirmed = confirmedIds.has(card.id);
              const isExpanded = expandedId === card.id && !isConfirmed;
              const isChecked = checkedIds.has(card.id);
              const action = getAction(card);

              // Confirmed state
              if (isConfirmed) {
                return (
                  <div key={card.id} className="flex gap-3 h-14 items-center pl-4 pr-3 py-2 bg-secondary">
                    <Icon name="circle-check-filled" color="success" size="sm" />
                    <Avatar name={card.author} size="sm" />
                    <div className="flex-1 flex flex-col gap-[2px] min-w-0">
                      <Typography variant="heading-sm" color="primary" className="truncate">{card.author}</Typography>
                      <Typography variant="caption" color="secondary" className="truncate">
                        {card.tag} &middot; {card.context}
                      </Typography>
                    </div>
                    <Typography variant="label-xs" color="secondary" className="shrink-0">
                      {action === 'Remove' ? 'Removed' : 'Allowed'}
                    </Typography>
                  </div>
                );
              }

              // Default state
              return (
                <div key={card.id}>
                  <div className="flex gap-3 h-14 items-center pl-4 pr-3 py-2 cursor-pointer transition-colors hover:bg-hover">
                    <div className="shrink-0" onClick={e => e.stopPropagation()}>
                      <Checkbox checked={isChecked} onCheckedChange={() => toggleCheck(card.id)} aria-label={`Select ${card.contentPreview}`} />
                    </div>
                    <div
                      role="button" tabIndex={0} className="flex gap-3 items-center flex-1 min-w-0"
                      onClick={() => handleCardClick(card)}
                      onKeyDown={e => e.key === 'Enter' && handleCardClick(card)}
                    >
                      <Avatar name={card.author} size="sm" />
                      <div className="flex-1 flex flex-col gap-[2px] min-w-0">
                        <Typography variant="heading-sm" color="primary" className="truncate">{card.author}</Typography>
                        <Typography variant="caption" color="tertiary" className="truncate">
                          {card.tag} &middot; {card.context}
                        </Typography>
                      </div>
                    </div>
                    <Badge variant={action === 'Remove' ? 'destructive' : 'success'} label={action} />
                  </div>

                  {/* Expanded panel */}
                  {isExpanded && (
                    <div className="p-4 flex flex-col gap-4 border-b border-[#f0f3f5]">
                      {/* Flagged by — first */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-secondary" aria-hidden="true">
                            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                            <line x1="4" x2="4" y1="22" y2="15" />
                          </svg>
                          <Typography variant="label-xs" color="secondary">Flagged by</Typography>
                        </div>
                        <Typography variant="body-sm" color="primary">{card.flaggedBy}</Typography>
                      </div>

                      {/* Reasoning — second */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Icon name="imagine" size="sm" color="secondary" />
                          <Typography variant="label-xs" color="secondary">Reasoning</Typography>
                        </div>
                        <Typography variant="body-sm" color="primary">{card.copilotReasoning}</Typography>
                      </div>

                      {/* Two action buttons */}
                      <div className="flex gap-2">
                        {action === 'Remove' ? (
                          <SplitButton
                            variant="primary"
                            size="sm"
                            onClick={() => confirmSingleAndAdvance(card.id)}
                            menuOptions={[{ label: getRemoveSplitOption(card.type), onClick: () => confirmSingleAndAdvance(card.id) }]}
                          >
                            Remove
                          </SplitButton>
                        ) : card.type === 'Post' ? (
                          <SplitButton
                            variant="primary"
                            size="sm"
                            onClick={() => confirmSingleAndAdvance(card.id)}
                            menuOptions={[{ label: 'Approve and moderate future posts', onClick: () => confirmSingleAndAdvance(card.id) }]}
                          >
                            Allow
                          </SplitButton>
                        ) : (
                          <Button variant="primary" size="sm" onClick={() => confirmSingleAndAdvance(card.id)}>Allow</Button>
                        )}
                        {action === 'Remove' ? (
                          card.type === 'Post' ? (
                            <SplitButton
                              variant="outline"
                              size="sm"
                              onClick={() => overrideAndConfirm(card)}
                              menuOptions={[{ label: 'Approve and moderate future posts', onClick: () => overrideAndConfirm(card) }]}
                            >
                              Allow instead
                            </SplitButton>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => overrideAndConfirm(card)}>Allow instead</Button>
                          )
                        ) : (
                          <SplitButton
                            variant="outline"
                            size="sm"
                            onClick={() => overrideAndConfirm(card)}
                            menuOptions={[{ label: getRemoveSplitOption(card.type), onClick: () => overrideAndConfirm(card) }]}
                          >
                            Remove instead
                          </SplitButton>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Bottom bar removed — actions in header button */}
    </div>
  );
};

export default ModerationConfirmList;
