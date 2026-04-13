import React, { useState, useMemo } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { IconButton } from '@circleco/compass/components/IconButton';
import { TextInput } from '@circleco/compass/components/TextInput';
import DrawerOverlay from './DrawerOverlay';

export interface SearchableMessage {
  id: string;
  senderName: string;
  text: string;
  time: string;
}

interface SearchPanelV1Props {
  onClose: () => void;
  messages: SearchableMessage[];
}

const CONTEXT_CHARS = 40;

function getSnippet(text: string, query: string): { before: string; match: string; after: string } | null {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return null;
  const start = Math.max(0, idx - CONTEXT_CHARS);
  const end = Math.min(text.length, idx + query.length + CONTEXT_CHARS);
  const before = (start > 0 ? '...' : '') + text.slice(start, idx);
  const match = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length, end) + (end < text.length ? '...' : '');
  return { before, match, after };
}

const SearchPanelV1: React.FC<SearchPanelV1Props> = ({ onClose, messages }) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return messages
      .map((msg) => ({ msg, snippet: getSnippet(msg.text, query.trim()) }))
      .filter((r) => r.snippet !== null) as { msg: SearchableMessage; snippet: NonNullable<ReturnType<typeof getSnippet>> }[];
  }, [query, messages]);

  return (
    <DrawerOverlay onClose={onClose}>
    <div className="flex-1 flex flex-col bg-primary overflow-hidden">
      {/* Header */}
      <div className="h-14 flex items-center gap-2 px-3 border-b border-primary shrink-0">
        <div className="flex-1 min-w-0">
          <TextInput
            icon="magnifying-glass"
            placeholder="Search in conversation"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <IconButton icon="cross" size="md" variant="ghost" aria-label="Close search" onClick={onClose} />
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {query.trim() && (
          <Typography variant="label-xs" color="tertiary">
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </Typography>
        )}
        {results.map(({ msg, snippet }) => (
          <div
            key={msg.id}
            role="button"
            tabIndex={0}
            onClick={() => window.dispatchEvent(new CustomEvent('search-highlight', { detail: { messageId: msg.id } }))}
            onKeyDown={(e) => e.key === 'Enter' && window.dispatchEvent(new CustomEvent('search-highlight', { detail: { messageId: msg.id } }))}
            className="border border-secondary rounded-xl px-4 py-3 flex flex-col gap-1 cursor-pointer hover:bg-hover transition-colors"
          >
            <div className="flex items-center gap-2">
              <Avatar name={msg.senderName} size="xs" />
              <Typography variant="heading-sm" color="primary">{msg.senderName}</Typography>
              <Typography variant="caption" color="tertiary">{msg.time}</Typography>
            </div>
            <p className="text-sm text-primary leading-5">
              {snippet.before}
              <mark className="bg-[rgba(199,177,65,0.28)] text-primary rounded-[3px] px-0.5 not-italic">
                {snippet.match}
              </mark>
              {snippet.after}
            </p>
          </div>
        ))}
        {query.trim() && results.length === 0 && (
          <Typography variant="body-sm" color="tertiary">No messages found</Typography>
        )}
      </div>
    </div>
    </DrawerOverlay>
  );
};

export default SearchPanelV1;
