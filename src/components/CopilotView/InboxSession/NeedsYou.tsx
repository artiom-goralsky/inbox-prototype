import React, { useState, useEffect } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Button } from '@circleco/compass/components/Button';
import { Icon } from '@circleco/compass/components/Icon';
import { Avatar } from '@circleco/compass/components/Avatar';
import { needsYouCards, type NeedsYouCard } from './inboxScenarioData';

interface NeedsYouProps {
  onComplete: (sentCount: number, remainingNames: string[]) => void;
}

const NeedsYou: React.FC<NeedsYouProps> = ({ onComplete }) => {
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(needsYouCards[0]?.id ?? null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});

  useEffect(() => {
    const handler = (e: Event) => {
      const { threadId } = (e as CustomEvent).detail as { threadId: string };
      if (needsYouCards.some(c => c.id === threadId)) {
        setSentIds(prev => {
          const next = new Set(Array.from(prev));
          next.add(threadId);
          if (editingId === threadId) setEditingId(null);
          const remaining = needsYouCards.filter(c => !next.has(c.id));
          if (remaining.length > 0) {
            setExpandedId(remaining[0].id);
          } else {
            setExpandedId(null);
            setTimeout(() => onComplete(next.size, []), 200);
          }
          return next;
        });
      }
    };
    window.addEventListener('inbox-reply-sent', handler);
    return () => window.removeEventListener('inbox-reply-sent', handler);
  }, [editingId, onComplete]);

  const handleCardClick = (card: NeedsYouCard) => {
    const nextId = expandedId === card.id ? null : card.id;
    setExpandedId(nextId);
    window.dispatchEvent(new CustomEvent('inbox-sync', {
      detail: { activeTab: 'dms' as const, selectedThread: nextId, ...(nextId ? { markRead: nextId } : {}), composerDraft: null },
    }));
  };

  const handleAddToComposer = (card: NeedsYouCard, draftText: string) => {
    setEditingId(card.id);
    window.dispatchEvent(new CustomEvent('inbox-sync', {
      detail: { activeTab: 'dms' as const, selectedThread: card.id, markRead: card.id, composerDraft: { text: draftText, recipientName: card.name } },
    }));
  };

  return (
    <div className="border border-secondary rounded-xl overflow-hidden shadow-2xs bg-primary mt-2">
      {needsYouCards.map((card) => {
        const isSent = sentIds.has(card.id);
        const isEditing = editingId === card.id && !isSent;
        const isExpanded = expandedId === card.id && !isSent;
        const selOpt = selectedOptions[card.id];
        const isDecision = !!card.draftOptions;
        const activeDraft = isDecision && selOpt !== undefined
          ? card.draftOptions![selOpt].draft
          : card.draft;

        // Sent state
        if (isSent) {
          return (
            <div key={card.id} className="flex gap-3 h-14 items-center pl-4 pr-3 py-2">
              <Icon name="circle-check-filled" color="success" size="sm" />
              <Avatar name={card.name} size="sm" />
              <div className="flex-1 flex flex-col gap-[2px] min-w-0">
                <div className="flex gap-1.5 items-center">
                  <Typography variant="heading-sm" color="primary" className="truncate">{card.name}</Typography>
                  <Typography variant="label-xs" color="secondary" className="shrink-0">Sent</Typography>
                </div>
                <Typography variant="caption" color="secondary" className="truncate">{card.questionSnippet}</Typography>
              </div>
            </div>
          );
        }

        // Collapsed state
        if (!isExpanded) {
          return (
            <div
              key={card.id}
              role="button" tabIndex={0}
              onClick={() => handleCardClick(card)}
              onKeyDown={e => e.key === 'Enter' && handleCardClick(card)}
              className={`flex gap-3 h-14 items-center pl-4 pr-3 py-2 cursor-pointer transition-colors hover:bg-hover ${isEditing ? 'bg-info-light' : ''}`}
            >
              <Avatar name={card.name} size="sm" />
              <div className="flex-1 flex flex-col gap-[2px] min-w-0">
                <div className="flex gap-1.5 items-center">
                  <Typography variant="heading-sm" color="primary" className="truncate">{card.name}</Typography>
                  {isEditing && <Typography variant="label-xs" color="info" className="shrink-0">Editing</Typography>}
                </div>
                <Typography variant="caption" color="secondary" className="truncate">{card.questionSnippet}</Typography>
              </div>
            </div>
          );
        }

        // Expanded state
        return (
          <div key={card.id} className={isEditing ? 'bg-info-light' : ''}>
            {/* Row header — clickable to collapse */}
            <div
              role="button" tabIndex={0}
              onClick={() => handleCardClick(card)}
              onKeyDown={e => e.key === 'Enter' && handleCardClick(card)}
              className="flex gap-3 h-14 items-center pl-4 pr-3 py-2 cursor-pointer transition-colors hover:bg-hover"
            >
              <Avatar name={card.name} size="sm" />
              <div className="flex-1 flex flex-col gap-[2px] min-w-0">
                <div className="flex gap-1.5 items-center">
                  <Typography variant="heading-sm" color="primary" className="truncate">{card.name}</Typography>
                  {isEditing && <Typography variant="label-xs" color="info" className="shrink-0">Editing</Typography>}
                </div>
                <Typography variant="caption" color="secondary" className="truncate">{card.questionSnippet}</Typography>
              </div>
            </div>

            {/* Expanded panel */}
            <div className="pt-3 pb-4 pl-10 pr-4 flex flex-col gap-4 border-b border-[#f0f3f5]">
              {/* Reasoning — summary + tradeoff merged */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Icon name="imagine" size="sm" color="secondary" />
                  <Typography variant="label-xs" color="secondary">Reasoning</Typography>
                </div>
                <Typography variant="body-sm" color="primary">
                  {card.summary} {card.tradeoff}
                </Typography>
              </div>

              {/* Option buttons — equal weight outline */}
              {isDecision && (
                <div className="flex gap-2">
                  {card.draftOptions!.map((opt, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOptions(prev => ({ ...prev, [card.id]: i }))}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              )}

              {/* Draft block — shown after option selected or for non-decision cards */}
              {activeDraft && (!isDecision || selOpt !== undefined) && (
                <>
                  <div className="border-l-2 border-[#506cf0] pl-4 flex flex-col gap-1">
                    <Typography variant="label-xs" color="secondary">Draft</Typography>
                    <Typography variant="body-sm" color="primary">{activeDraft}</Typography>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="self-start"
                    onClick={() => handleAddToComposer(card, activeDraft)}
                  >
                    Add to composer
                  </Button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NeedsYou;
