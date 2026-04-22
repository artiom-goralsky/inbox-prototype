import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Button } from '@circleco/compass/components/Button';
import { Icon } from '@circleco/compass/components/Icon';
import { IconButton } from '@circleco/compass/components/IconButton';
import { getRefinementResponse } from '../InboxPage/suggestedReplyMockData';

type DraftVersion = {
  id: string;
  text: string;
  createdFrom: 'initial' | 'refine';
  refinePrompt?: string;
};

interface SuggestedReplyWidgetProps {
  recipientName: string;
  draftText: string;
  sources: Array<{ title: string; category: string }>;
  reasoning?: string;
  conversationId: string;
  onTakeOver: (text: string) => void;
  onDiscard: () => void;
}

const SuggestedReplyWidget: React.FC<SuggestedReplyWidgetProps> = ({
  recipientName,
  draftText,
  sources,
  reasoning,
  conversationId,
  onTakeOver,
  onDiscard,
}) => {
  const [versions, setVersions] = useState<DraftVersion[]>([
    { id: 'v1', text: draftText, createdFrom: 'initial' },
  ]);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0);
  const [refineInput, setRefineInput] = useState('');
  const [sourcesOpen, setSourcesOpen] = useState(false);

  const currentVersion = versions[currentVersionIndex];
  const hasMultipleVersions = versions.length > 1;
  const canGoBack = currentVersionIndex > 0;
  const canGoForward = currentVersionIndex < versions.length - 1;

  const handleRefineSubmit = () => {
    if (!refineInput.trim()) return;
    const refinedText = getRefinementResponse(conversationId, refineInput);
    const newVersion: DraftVersion = {
      id: `v${versions.length + 1}`,
      text: refinedText,
      createdFrom: 'refine',
      refinePrompt: refineInput,
    };
    setVersions(prev => [...prev, newVersion]);
    setCurrentVersionIndex(versions.length);
    setRefineInput('');
  };

  return (
    <div className="bg-primary border border-tertiary rounded-lg w-full max-w-[768px]">
      {/* Row 1 — Header */}
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Icon name="sparkle" size="sm" color="info" />
          <Typography variant="body-sm" color="primary" className="font-semibold shrink-0">
            Suggested reply
          </Typography>
          <Typography variant="body-sm" color="tertiary" className="truncate">
            · To: {recipientName}
          </Typography>
        </div>

        {/* Version indicator — only when multiple versions */}
        {hasMultipleVersions && (
          <div className="flex items-center gap-0.5 bg-secondary rounded-md p-0.5 shrink-0">
            <button
              onClick={() => setCurrentVersionIndex(i => i - 1)}
              disabled={!canGoBack}
              className={`px-1.5 py-0.5 rounded transition-colors ${canGoBack ? 'hover:bg-hover cursor-pointer' : 'opacity-30 cursor-not-allowed'}`}
            >
              <Icon name="chevron-left" size="sm" color="secondary" />
            </button>
            <Typography variant="caption" color="secondary" className="font-semibold min-w-[26px] text-center">
              {currentVersionIndex + 1} / {versions.length}
            </Typography>
            <button
              onClick={() => setCurrentVersionIndex(i => i + 1)}
              disabled={!canGoForward}
              className={`px-1.5 py-0.5 rounded transition-colors ${canGoForward ? 'hover:bg-hover cursor-pointer' : 'opacity-30 cursor-not-allowed'}`}
            >
              <Icon name="chevron-right" size="sm" color="secondary" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-4 shrink-0">
          <Button variant="ghost" size="sm" onClick={onDiscard}>
            Discard
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onTakeOver(currentVersion.text)} className="!text-info font-medium">
            Take over
          </Button>
        </div>
      </div>

      {/* Row 2 — Draft body */}
      <div className="px-4 pb-3.5">
        <Typography variant="body-sm" color="primary" className="whitespace-pre-line leading-relaxed">
          {currentVersion.text}
        </Typography>
      </div>

      {/* Row 3 — Sources */}
      <div className="px-4 py-2.5 relative">
        <button
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary border border-tertiary rounded-full hover:bg-hover transition-colors"
          onClick={() => setSourcesOpen(p => !p)}
        >
          <Icon name="chain-link" size="sm" color="secondary" />
          <span className="text-[11px] font-semibold text-secondary">
            {sources.length} {sources.length === 1 ? 'source' : 'sources'}
          </span>
        </button>

        {/* Sources popover */}
        {sourcesOpen && (
          <div
            className="absolute bottom-full left-4 mb-2 w-[320px] bg-primary border border-tertiary rounded-xl shadow-lg p-4 z-50"
            onClick={e => e.stopPropagation()}
          >
            {reasoning && (
              <Typography variant="body-sm" color="primary" className="font-semibold mb-3">
                {reasoning}
              </Typography>
            )}
            <Typography variant="caption" color="tertiary" className="font-semibold uppercase tracking-wide mb-2 block">
              Related sources
            </Typography>
            <div className="flex flex-col gap-1.5">
              {sources.map((source, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <Icon name="chain-link" size="sm" color="tertiary" />
                  <Typography variant="body-sm" color="primary">{source.title}</Typography>
                  <Typography variant="body-sm" color="tertiary">·</Typography>
                  <Typography variant="body-sm" color="tertiary">{source.category}</Typography>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Row 4 — Refine input */}
      <div className="border-t border-tertiary px-3.5 py-2.5 flex items-center gap-2">
        <input
          type="text"
          value={refineInput}
          onChange={e => setRefineInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleRefineSubmit(); }}
          placeholder="Tune the message further…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-tertiary text-primary"
        />
        <IconButton icon="microphone" size="sm" variant="ghost" aria-label="Voice" />
        <button
          onClick={handleRefineSubmit}
          disabled={!refineInput.trim()}
          className={`flex items-center justify-center p-1 bg-secondary border border-tertiary rounded-md transition-colors ${
            refineInput.trim() ? 'hover:bg-hover' : 'opacity-50 cursor-not-allowed'
          }`}
          aria-label="Send refinement"
        >
          <Icon name="arrow-up" size="sm" color={refineInput.trim() ? 'info' : 'tertiary'} />
        </button>
      </div>

      {/* Close popover on outside click */}
      {sourcesOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setSourcesOpen(false)} />
      )}
    </div>
  );
};

export default SuggestedReplyWidget;
