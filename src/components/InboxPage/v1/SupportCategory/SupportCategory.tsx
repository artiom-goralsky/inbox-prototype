import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import SupportThreadList from './SupportThreadList';
import SupportCenterPanel from './SupportCenterPanel';
import SupportNewConversation from './SupportNewConversation';
import SupportEmptyState from './SupportEmptyState';
import {
  getThreadStatus,
  mockSupportThreads,
  type SupportNewVariant,
  type SupportPrefill,
  type SupportThread,
} from './data/supportThreads';

interface SupportCategoryProps {
  /** Optional prefill (e.g. from Copilot email bridge). When set, opens email new-conversation mode pre-filled. */
  prefill?: SupportPrefill | null;
  /** Variant of new-conversation flow to open. Currently only 'email' opens a composer. */
  newVariant?: SupportNewVariant | null;
  /** When set, selects this specific thread (e.g. a ticket just created from Copilot). */
  selectedThreadIdOverride?: string | null;
  /** Called after consuming a prefill so the parent can clear it. */
  onPrefillConsumed?: () => void;
}

function pickDefaultThreadId(threads: SupportThread[]): string | null {
  if (threads.length === 0) return null;
  const newReply = threads.find(t => t.state === 'new_reply');
  if (newReply) return newReply.id;
  return threads[0].id;
}

const SupportCategory: React.FC<SupportCategoryProps> = ({ prefill, newVariant, selectedThreadIdOverride, onPrefillConsumed }) => {
  const [threads, setThreads] = useState<SupportThread[]>(() => [...mockSupportThreads]);
  const [selectedId, setSelectedId] = useState<string | null>(
    () => selectedThreadIdOverride ?? pickDefaultThreadId(mockSupportThreads),
  );
  const [composerByThread, setComposerByThread] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    mockSupportThreads.forEach(t => {
      if (t.draft) init[t.id] = t.draft;
    });
    return init;
  });

  const [filter, setFilter] = useState<'open' | 'resolved'>('open');
  const [newMode, setNewMode] = useState<SupportNewVariant | null>(null);
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');

  // Consume external email-prefill / variant trigger.
  useEffect(() => {
    if (prefill || newVariant) {
      setNewMode('email');
      setSelectedId(null);
      setNewSubject(prefill?.subject ?? '');
      setNewMessage(prefill?.message ?? '');
      onPrefillConsumed?.();
    }
  }, [prefill, newVariant, onPrefillConsumed]);

  // Consume external thread-id override (e.g. ticket just created from Copilot).
  // Re-syncs threads from the mock array so a freshly-added ticket is visible.
  useEffect(() => {
    if (!selectedThreadIdOverride) return;
    setThreads(prev => {
      if (prev.some(t => t.id === selectedThreadIdOverride)) return prev;
      const fresh = mockSupportThreads.find(t => t.id === selectedThreadIdOverride);
      return fresh ? [fresh, ...prev] : prev;
    });
    setSelectedId(selectedThreadIdOverride);
    setNewMode(null);
  }, [selectedThreadIdOverride]);

  // Listen for agent-join transitions fired by QueueCard.
  useEffect(() => {
    const handler = (e: Event) => {
      const { threadId } = (e as CustomEvent).detail as { threadId: string };
      setThreads(prev => {
        const fresh = mockSupportThreads.find(t => t.id === threadId);
        if (!fresh) return prev;
        return prev.map(t => t.id === threadId ? { ...fresh } : t);
      });
    };
    window.addEventListener('support-thread-updated', handler);
    return () => window.removeEventListener('support-thread-updated', handler);
  }, []);

  const filteredThreads = useMemo(
    () => threads.filter(t => getThreadStatus(t) === filter),
    [threads, filter],
  );

  const selectedThread = useMemo(
    () => threads.find(t => t.id === selectedId) ?? null,
    [threads, selectedId],
  );

  const handleFilterChange = useCallback((newFilter: 'open' | 'resolved') => {
    setFilter(newFilter);
    setSelectedId(prev => {
      const newFiltered = threads.filter(t => getThreadStatus(t) === newFilter);
      if (prev && newFiltered.some(t => t.id === prev)) return prev;
      return newFiltered.length > 0 ? newFiltered[0].id : null;
    });
    setNewMode(null);
  }, [threads]);

  const handleSelect = useCallback((id: string) => {
    setNewMode(null);
    setSelectedId(id);
    setThreads(prev =>
      prev.map(t => (t.id === id && t.state === 'new_reply' ? { ...t, state: 'awaiting_circle' } : t)),
    );
  }, []);

  const handleNewConversation = useCallback(() => {
    setNewMode('email');
    setNewSubject('');
    setNewMessage('');
    setSelectedId(null);
  }, []);

  const handleCancelNew = useCallback(() => {
    setNewMode(null);
    setNewSubject('');
    setNewMessage('');
    setSelectedId(prev => prev ?? pickDefaultThreadId(threads));
  }, [threads]);

  const handleSendNewEmail = useCallback(() => {
    if (!newSubject.trim() || !newMessage.trim()) return;
    const id = `sup-${Date.now()}`;
    const created: SupportThread = {
      id,
      subject: newSubject.trim(),
      channel: 'email',
      state: 'awaiting_circle',
      lastActivity: 'now',
      messages: [
        {
          id: `${id}-m1`,
          sender: 'admin',
          body: newMessage.trim(),
          timestamp: 'Just now',
        },
      ],
    };
    setThreads(prev => [created, ...prev]);
    setSelectedId(id);
    setNewMode(null);
    setNewSubject('');
    setNewMessage('');
  }, [newSubject, newMessage]);

  const handleComposerChange = useCallback((threadId: string, value: string) => {
    setComposerByThread(prev => ({ ...prev, [threadId]: value }));
    setThreads(prev =>
      prev.map(t => {
        if (t.id !== threadId) return t;
        if (t.state === 'has_draft' && value.trim().length === 0) {
          return { ...t, state: 'awaiting_circle', draft: undefined };
        }
        if (t.state !== 'has_draft' && t.messages.length === 0 && value.trim().length > 0) {
          return { ...t, state: 'has_draft', draft: value };
        }
        if (t.state === 'has_draft') {
          return { ...t, draft: value };
        }
        return t;
      }),
    );
  }, []);

  const handleSendReply = useCallback((threadId: string) => {
    const text = (composerByThread[threadId] ?? '').trim();
    if (!text) return;
    setThreads(prev =>
      prev.map(t => {
        if (t.id !== threadId) return t;
        const nextState: SupportThread['state'] =
          t.channel === 'chat' ? t.state : 'awaiting_circle';
        return {
          ...t,
          state: nextState,
          draft: undefined,
          lastActivity: 'now',
          messages: [
            ...t.messages,
            {
              id: `${t.id}-m${t.messages.length + 1}`,
              sender: 'admin' as const,
              body: text,
              timestamp: 'Just now',
            },
          ],
        };
      }),
    );
    setComposerByThread(prev => ({ ...prev, [threadId]: '' }));
  }, [composerByThread]);

  const handleMarkResolved = useCallback((threadId: string) => {
    setThreads(prev => prev.map(t => (t.id === threadId ? { ...t, state: 'resolved' as const } : t)));
    if (filter === 'open') {
      setSelectedId(prev => {
        if (prev !== threadId) return prev;
        const remaining = threads.filter(t => t.id !== threadId && getThreadStatus(t) === 'open');
        return remaining.length > 0 ? remaining[0].id : null;
      });
    }
  }, [filter, threads]);

  const handleReopen = useCallback((threadId: string) => {
    setThreads(prev => prev.map(t => (t.id === threadId ? { ...t, state: 'awaiting_circle' as const } : t)));
  }, []);

  // No threads at all → empty state across the whole panel.
  if (threads.length === 0 && !newMode) {
    return (
      <div className="flex flex-1 min-w-0 h-full">
        <div className="w-[280px] shrink-0">
          <SupportThreadList
            threads={[]}
            selectedId={null}
            filter={filter}
            onFilterChange={handleFilterChange}
            onSelect={() => {}}
          />
        </div>
        <SupportEmptyState onStart={handleNewConversation} />
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-w-0 h-full">
      <div className="w-[280px] shrink-0">
        <SupportThreadList
          threads={filteredThreads}
          selectedId={newMode ? null : selectedId}
          filter={filter}
          onFilterChange={handleFilterChange}
          onSelect={handleSelect}
        />
      </div>

      {newMode === 'email' ? (
        <SupportNewConversation
          subject={newSubject}
          message={newMessage}
          onSubjectChange={setNewSubject}
          onMessageChange={setNewMessage}
          onSend={handleSendNewEmail}
          onCancel={handleCancelNew}
        />
      ) : selectedThread ? (
        <SupportCenterPanel
          thread={selectedThread}
          composerValue={composerByThread[selectedThread.id] ?? ''}
          onComposerChange={value => handleComposerChange(selectedThread.id, value)}
          onSend={() => handleSendReply(selectedThread.id)}
          onMarkResolved={() => handleMarkResolved(selectedThread.id)}
          onReopen={() => handleReopen(selectedThread.id)}
        />
      ) : filter === 'resolved' ? (
        <div className="flex-1 flex items-center justify-center bg-primary">
          <Typography variant="body-sm" color="secondary">No resolved conversations yet</Typography>
        </div>
      ) : (
        <SupportEmptyState onStart={handleNewConversation} />
      )}
    </div>
  );
};

export default SupportCategory;
