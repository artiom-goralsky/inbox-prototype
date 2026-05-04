import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SupportThreadList from './SupportThreadList';
import SupportCenterPanel from './SupportCenterPanel';
import SupportNewConversation from './SupportNewConversation';
import SupportEmptyState from './SupportEmptyState';
import {
  LIVE_CHAT_AGENT,
  mockSupportThreads,
  type SupportNewVariant,
  type SupportPrefill,
  type SupportThread,
} from './data/supportThreads';

interface SupportCategoryProps {
  /** Optional prefill (e.g. from Copilot email bridge). When set, opens email new-conversation mode pre-filled. */
  prefill?: SupportPrefill | null;
  /** Variant of new-conversation flow to open. Currently only 'email' opens a composer; live chat is created directly via `liveChatFirstMessage`. */
  newVariant?: SupportNewVariant | null;
  /** When set, immediately creates a live-chat thread in `in_queue` with this body and selects it. */
  liveChatFirstMessage?: string | null;
  /** When set, selects this specific thread (e.g. a ticket just created from Copilot). */
  selectedThreadIdOverride?: string | null;
  /** Called after consuming a prefill / liveChatFirstMessage so the parent can clear it. */
  onPrefillConsumed?: () => void;
}

const AGENT_JOIN_DELAY_MS = 5000;

function pickDefaultThreadId(threads: SupportThread[]): string | null {
  if (threads.length === 0) return null;
  const newReply = threads.find(t => t.state === 'new_reply');
  if (newReply) return newReply.id;
  return threads[0].id;
}

const SupportCategory: React.FC<SupportCategoryProps> = ({ prefill, newVariant, liveChatFirstMessage, selectedThreadIdOverride, onPrefillConsumed }) => {
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

  const [newMode, setNewMode] = useState<SupportNewVariant | null>(null);
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const agentTimers = useRef<Record<string, number>>({});
  // Dedupe live-chat thread creation against React StrictMode's effect double-invoke
  // (and any future spurious effect re-runs caused by parent inline-callback churn).
  const consumedLiveChatRef = useRef<string | null>(null);

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

  // Clear pending agent-join timers on unmount.
  useEffect(() => {
    return () => {
      Object.values(agentTimers.current).forEach(id => window.clearTimeout(id));
      agentTimers.current = {};
    };
  }, []);

  const selectedThread = useMemo(
    () => threads.find(t => t.id === selectedId) ?? null,
    [threads, selectedId],
  );

  const scheduleAgentJoin = useCallback((threadId: string) => {
    if (agentTimers.current[threadId]) return;
    const timerId = window.setTimeout(() => {
      delete agentTimers.current[threadId];
      setThreads(prev =>
        prev.map(t => {
          if (t.id !== threadId) return t;
          if (t.state !== 'in_queue') return t;
          const baseId = t.messages.length;
          return {
            ...t,
            state: 'active' as const,
            lastActivity: 'now',
            messages: [
              ...t.messages,
              {
                id: `${t.id}-m${baseId + 1}`,
                sender: 'system' as const,
                body: `${LIVE_CHAT_AGENT.name} has joined the chat`,
                timestamp: 'Just now',
              },
              {
                id: `${t.id}-m${baseId + 2}`,
                sender: 'circle' as const,
                agentName: LIVE_CHAT_AGENT.name,
                agentAvatar: LIVE_CHAT_AGENT.avatar,
                body: `Hi! I'm ${LIVE_CHAT_AGENT.name.split(' ')[0]} from Circle Support. How can I help you today?`,
                timestamp: 'Just now',
              },
            ],
          };
        }),
      );
    }, AGENT_JOIN_DELAY_MS);
    agentTimers.current[threadId] = timerId;
  }, []);

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

  // Consume external live-chat first message — create a thread directly,
  // skip new-conversation mode, schedule agent join.
  useEffect(() => {
    if (!liveChatFirstMessage) return;
    if (consumedLiveChatRef.current === liveChatFirstMessage) return;
    consumedLiveChatRef.current = liveChatFirstMessage;

    const trimmed = liveChatFirstMessage.trim();
    if (!trimmed) {
      onPrefillConsumed?.();
      return;
    }
    const id = `sup-${Date.now()}`;
    const subject = trimmed.length > 40 ? `${trimmed.slice(0, 40).trimEnd()}…` : trimmed;
    const created: SupportThread = {
      id,
      subject,
      channel: 'chat',
      state: 'in_queue',
      lastActivity: 'now',
      messages: [
        {
          id: `${id}-m1`,
          sender: 'admin',
          body: trimmed,
          timestamp: 'Just now',
        },
      ],
    };
    setThreads(prev => [created, ...prev]);
    setSelectedId(id);
    setNewMode(null);
    scheduleAgentJoin(id);
    onPrefillConsumed?.();
  }, [liveChatFirstMessage, scheduleAgentJoin, onPrefillConsumed]);

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
  }, []);

  const handleReopen = useCallback((threadId: string) => {
    setThreads(prev => prev.map(t => (t.id === threadId ? { ...t, state: 'awaiting_circle' as const } : t)));
  }, []);

  // No threads at all → empty state across the whole panel.
  if (threads.length === 0 && !newMode) {
    return (
      <div className="flex flex-1 min-w-0 h-full">
        <div className="w-[280px] shrink-0">
          <SupportThreadList
            threads={threads}
            selectedId={null}
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
          threads={threads}
          selectedId={newMode ? null : selectedId}
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
      ) : (
        <SupportEmptyState onStart={handleNewConversation} />
      )}
    </div>
  );
};

export default SupportCategory;
