import React, { useState, useEffect } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Button } from '@circleco/compass/components/Button';
import { SplitButton } from '@circleco/compass/components/SplitButton';
import { Icon } from '@circleco/compass/components/Icon';
import { Avatar } from '@circleco/compass/components/Avatar';
import { decideCards, type ModerationDecideCard } from './moderationScenarioData';

function getRemoveSplitOption(type: ModerationDecideCard['type']): string {
  switch (type) {
    case 'Comment': return 'Remove and flag member';
    case 'Message': return 'Remove and disable direct messages';
    default: return 'Remove and moderate future posts';
  }
}

interface ModerationDecideListProps {
  onComplete: (actions: Record<string, string>) => void;
}

const ModerationDecideList: React.FC<ModerationDecideListProps> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [actedCards, setActedCards] = useState<Record<string, string>>({});

  const actedCount = Object.keys(actedCards).length;
  const displayPagination = Math.min(actedCount + 1, decideCards.length);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('inbox-sync', {
      detail: { activeTab: 'moderation' as const, selectedThread: 'derek-hoffman' },
    }));
  }, []);

  const handleAction = (card: ModerationDecideCard, actionType: string) => {
    const next = { ...actedCards, [card.id]: actionType };
    setActedCards(next);

    if (actionType === 'dm') {
      window.dispatchEvent(new CustomEvent('inbox-sync', {
        detail: {
          activeTab: 'dms' as const,
          composerDraft: {
            text: "Hey Derek, I wanted to reach out about your recent comment. I appreciate your passion for photography, but the tone came across as dismissive. We want to keep discussions constructive \u2014 would you mind keeping feedback encouraging? Thanks!",
            recipientName: 'Derek Hoffman',
          },
        },
      }));
      return;
    }
    if (actionType === 'reply') {
      window.dispatchEvent(new CustomEvent('inbox-sync', {
        detail: {
          activeTab: 'moderation' as const,
          selectedThread: 'derek-hoffman',
          composerDraft: {
            text: "Thanks for the feedback, Derek! We hear you on upload speeds. Could you post this in the Bug Reports space? That way our team can track and prioritize it. \u2014 Admin",
            recipientName: '',
          },
        },
      }));
      return;
    }

    // Allow or Remove — advance
    if (Object.keys(next).length === decideCards.length) {
      setTimeout(() => onComplete(next), 200);
    } else {
      setCurrentIdx(prev => prev + 1);
    }
  };

  return (
    <div className="border border-secondary rounded-xl overflow-hidden shadow-2xs bg-primary mt-2">
      {/* Header */}
      <div className="flex items-center justify-between pl-4 pr-3 py-2 bg-secondary border-b border-[#f0f3f5]">
        <Typography variant="label-sm" color="primary">{decideCards.length} items to decide on</Typography>
        <Typography variant="caption" color="tertiary">{displayPagination} of {decideCards.length}</Typography>
      </div>

      {/* Acted/collapsed cards above active */}
      {decideCards.slice(0, currentIdx).map((card) => {
        const action = actedCards[card.id];
        if (!action || action === 'dm' || action === 'reply') return null;
        return (
          <div key={card.id} className="flex gap-3 h-14 items-center pl-4 pr-3 py-2 bg-secondary">
            <Icon name="circle-check-filled" color="success" size="sm" />
            <Avatar name={card.author} size="sm" />
            <div className="flex-1 flex flex-col gap-[2px] min-w-0">
              <Typography variant="heading-sm" color="primary" className="truncate">{card.author}</Typography>
              <Typography variant="caption" color="secondary" className="truncate">{card.tag}</Typography>
            </div>
            <Typography variant="label-xs" color="secondary" className="shrink-0">
              {action === 'allow' ? 'Allowed' : 'Removed'}
            </Typography>
          </div>
        );
      })}

      {/* Active (expanded) card */}
      {currentIdx < decideCards.length && (() => {
        const card = decideCards[currentIdx];
        return (
          <div key={card.id} className={currentIdx > 0 ? 'border-t border-[#f0f3f5]' : ''}>
            {/* Card row — name + category */}
            <div className="flex gap-3 h-14 items-center pl-4 pr-3 py-2">
              <Avatar name={card.author} size="sm" />
              <div className="flex-1 flex flex-col gap-[2px] min-w-0">
                <Typography variant="heading-sm" color="primary" className="truncate">{card.author}</Typography>
                <Typography variant="caption" color="secondary" className="truncate">{card.tag}</Typography>
              </div>
            </div>

            {/* Expanded panel */}
            <div className="p-4 flex flex-col gap-4 border-b border-[#f0f3f5]">
              {/* Flagged by */}
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

              {/* Reasoning */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Icon name="imagine" size="sm" color="secondary" />
                  <Typography variant="label-xs" color="secondary">Reasoning</Typography>
                </div>
                <Typography variant="body-sm" color="primary">{card.tradeoff}</Typography>
              </div>

              {/* Trade-off */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Icon name="sparkle" size="sm" color="secondary" />
                  <Typography variant="label-xs" color="secondary">Trade-off</Typography>
                </div>
                <Typography variant="body-sm" color="primary">
                  {card.tradeoff}{' '}
                  <span className="underline">{card.tradeoffSource}</span>
                </Typography>
              </div>

              {/* Equal-weight outline action buttons */}
              <div className="flex gap-2">
                {card.actions.map(a => {
                  if (a.actionType === 'remove') {
                    return (
                      <SplitButton
                        key={a.actionType}
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction(card, a.actionType)}
                        menuOptions={[{ label: getRemoveSplitOption(card.type), onClick: () => handleAction(card, a.actionType) }]}
                      >
                        {a.label}
                      </SplitButton>
                    );
                  }
                  if (a.actionType === 'allow' && card.type === 'Post') {
                    return (
                      <SplitButton
                        key={a.actionType}
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction(card, a.actionType)}
                        menuOptions={[{ label: 'Approve and moderate future posts', onClick: () => handleAction(card, a.actionType) }]}
                      >
                        {a.label}
                      </SplitButton>
                    );
                  }
                  return (
                    <Button
                      key={a.actionType}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(card, a.actionType)}
                    >
                      {a.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Remaining collapsed items below active */}
      {decideCards.slice(currentIdx + 1).map((card, i) => (
        <div
          key={card.id}
          role="button"
          tabIndex={0}
          className="flex gap-3 h-14 items-center pl-4 pr-3 py-2 border-t border-[#f0f3f5] cursor-pointer hover:bg-hover transition-colors"
          onClick={() => setCurrentIdx(currentIdx + 1 + i)}
          onKeyDown={e => e.key === 'Enter' && setCurrentIdx(currentIdx + 1 + i)}
        >
          <Avatar name={card.author} size="sm" />
          <div className="flex-1 flex flex-col gap-[2px] min-w-0">
            <Typography variant="heading-sm" color="primary" className="truncate">{card.author}</Typography>
            <Typography variant="caption" color="secondary" className="truncate">{card.tag}</Typography>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModerationDecideList;
