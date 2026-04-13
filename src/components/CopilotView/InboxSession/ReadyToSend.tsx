import React, { useState, useEffect } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Button } from '@circleco/compass/components/Button';
import { Icon } from '@circleco/compass/components/Icon';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Checkbox } from '@circleco/compass/components/Checkbox';
import { Badge } from '@circleco/compass/components/Badge';
import { readyCards, type ReadyCard } from './inboxScenarioData';

interface ReadyToSendProps {
  onBatchSent: () => void;
}

const ReadyToSend: React.FC<ReadyToSendProps> = ({ onBatchSent }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const { threadId } = (e as CustomEvent).detail as { threadId: string };
      if (readyCards.some(c => c.id === threadId)) {
        setSentIds(prev => { const n = new Set(Array.from(prev)); n.add(threadId); return n; });
        if (editingId === threadId) setEditingId(null);
        if (expandedId === threadId) setExpandedId(null);
      }
    };
    window.addEventListener('inbox-reply-sent', handler);
    return () => window.removeEventListener('inbox-reply-sent', handler);
  }, [editingId, expandedId]);

  const pendingCards = readyCards.filter(c => !sentIds.has(c.id));
  const checkedCount = Array.from(checkedIds).filter(id => !sentIds.has(id)).length;
  const allSent = pendingCards.length === 0;

  const handleSendBatch = () => {
    const toSend = checkedCount > 0 ? readyCards.filter(c => checkedIds.has(c.id) && !sentIds.has(c.id)) : pendingCards;
    toSend.forEach(card => {
      window.dispatchEvent(new CustomEvent('inbox-message-sent', { detail: { threadId: card.id, replyText: card.draft } }));
    });
    setSentIds(prev => {
      const n = new Set(Array.from(prev));
      toSend.forEach(c => n.add(c.id));
      window.dispatchEvent(new CustomEvent('inbox-sync', { detail: { badgeUpdates: { dms: 12 - n.size } } }));
      if (n.size === readyCards.length) onBatchSent();
      return n;
    });
    setCheckedIds(new Set());
    setExpandedId(null);
  };

  const toggleCheck = (id: string) => {
    setCheckedIds(prev => { const n = new Set(Array.from(prev)); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const handleCardClick = (card: ReadyCard) => {
    const nextId = expandedId === card.id ? null : card.id;
    setExpandedId(nextId);
    window.dispatchEvent(new CustomEvent('inbox-sync', {
      detail: { activeTab: 'dms' as const, selectedThread: nextId, ...(nextId ? { markRead: nextId } : {}), composerDraft: null },
    }));
  };

  const handleAddToComposer = (card: ReadyCard) => {
    setEditingId(card.id);
    setExpandedId(null);
    window.dispatchEvent(new CustomEvent('inbox-sync', {
      detail: { activeTab: 'dms' as const, selectedThread: card.id, markRead: card.id, composerDraft: { text: card.draft, recipientName: card.name } },
    }));
  };

  const sendLabel = checkedCount > 0 && checkedCount < pendingCards.length
    ? `Send ${checkedCount} selected`
    : `Send all ${pendingCards.length}`;

  return (
    <div className="border border-secondary rounded-xl overflow-hidden shadow-2xs bg-primary mt-2">
      {/* Header */}
      <div className="flex gap-1 items-start py-4 px-5 border-b border-secondary">
        <div className="flex flex-col flex-1">
          <Typography variant="heading-xl" color="primary">{String(readyCards.length)}</Typography>
          <Typography variant="body-sm" color="secondary">{allSent ? 'messages sent' : 'drafts ready'}</Typography>
          {!allSent && (
            <div className="flex gap-1 items-center mt-0.5">
              <Typography variant="label-xs" color="secondary">4 thank-yous</Typography>
              <Typography variant="caption" color="secondary">/</Typography>
              <Typography variant="label-xs" color="secondary">3 FAQ</Typography>
              <Typography variant="caption" color="secondary">/</Typography>
              <Typography variant="label-xs" color="secondary">2 support</Typography>
            </div>
          )}
        </div>
        {!allSent && <Button variant="outline" size="sm" onClick={handleSendBatch}>{sendLabel}</Button>}
      </div>

      {/* Card rows */}
      <div className="flex flex-col">
        {readyCards.map((card) => {
          const isSent = sentIds.has(card.id);
          const isEditing = editingId === card.id && !isSent;
          const isExpanded = expandedId === card.id && !isSent;
          const isChecked = checkedIds.has(card.id);

          // Confirmed/sent state
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
                  <Typography variant="caption" color="secondary" className="truncate">{card.snippet}</Typography>
                </div>
              </div>
            );
          }

          return (
            <div key={card.id} className={isEditing ? 'bg-info-light' : ''}>
              {/* Row */}
              <div className="flex gap-3 h-14 items-center pl-4 pr-3 py-2 cursor-pointer transition-colors hover:bg-hover">
                <div className="shrink-0" onClick={e => e.stopPropagation()}>
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleCheck(card.id)}
                    aria-label={`Select ${card.name}`}
                  />
                </div>
                <div
                  role="button" tabIndex={0} className="flex gap-3 items-center flex-1 min-w-0"
                  onClick={() => handleCardClick(card)}
                  onKeyDown={e => e.key === 'Enter' && handleCardClick(card)}
                >
                  <Avatar name={card.name} size="sm" />
                  <div className="flex-1 flex flex-col gap-[2px] min-w-0">
                    <Typography variant="heading-sm" color="primary" className="truncate">{card.name}</Typography>
                    <Typography variant="caption" color="secondary" className="truncate">{card.snippet}</Typography>
                  </div>
                </div>
                {isEditing && <Typography variant="label-xs" color="info" className="shrink-0">Editing</Typography>}
                <Badge variant="secondary" label={card.tag} />
              </div>

              {/* Expanded panel */}
              {isExpanded && (
                <div className="pt-3 pb-4 pl-10 pr-4 flex flex-col gap-4 border-b border-[#f0f3f5]">
                  {/* Reasoning */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Icon name="imagine" size="sm" color="secondary" />
                      <Typography variant="label-xs" color="secondary">Reasoning</Typography>
                    </div>
                    <Typography variant="body-sm" color="primary">{card.summary}</Typography>
                  </div>
                  {/* Draft */}
                  <div className="border-l-2 border-[#506cf0] pl-4 flex flex-col gap-1">
                    <Typography variant="label-xs" color="secondary">Draft</Typography>
                    <Typography variant="body-sm" color="primary">{card.draft}</Typography>
                  </div>
                  <Button variant="outline" size="sm" className="self-start" onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleAddToComposer(card); }}>Add to composer</Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReadyToSend;
