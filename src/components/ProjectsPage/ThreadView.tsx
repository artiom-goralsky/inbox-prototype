import React, { useState, useRef, useEffect } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Button } from '@circleco/compass/components/Button';
import { Badge } from '@circleco/compass/components/Badge';
import { Icon } from '@circleco/compass/components/Icon';
import { BreadCrumbs } from '@circleco/compass/components/BreadCrumbs';
import { Menu } from '@circleco/compass/components/Menu';
import AgentMessageBox from '../shared/AgentMessageBox';
import ThinkingIndicator from '../shared/ThinkingIndicator';
import type { ProjectThread, LaunchPlanStep, ThreadMessage } from './launchProjectData';
import { findScenario, findStepOptions, buildInitialMessages } from './stepScenarios';

/* ── Component ───────────────────────────────────────────────────── */

interface ThreadViewProps {
  thread: ProjectThread;
  step?: LaunchPlanStep;
  onBack: () => void;
  onStepComplete?: (stepId: string) => void;
  onUpdateThread: (thread: ProjectThread) => void;
}

const ThreadView: React.FC<ThreadViewProps> = ({
  thread,
  step,
  onBack,
  onStepComplete,
  onUpdateThread,
}) => {
  const [thinking, setThinking] = useState(false);
  const [thinkingKey, setThinkingKey] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  const scenario = step ? findScenario(step.title) : undefined;
  const stepOptions = step ? findStepOptions(step.title) : undefined;

  // Auto-populate step thread with initial messages on first open
  useEffect(() => {
    if (initializedRef.current) return;
    if (!step || thread.messages.length > 0) return;
    initializedRef.current = true;

    setThinking(true); setThinkingKey(k => k + 1);
    setTimeout(() => {
      const msgs = buildInitialMessages(step.title, step.number);
      if (msgs.length > 0) {
        onUpdateThread({ ...thread, messages: msgs });
      }
      setThinking(false);
    }, 1200);
  }, [step, thread, onUpdateThread]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread.messages.length, thinking]);

  /* ── Handle option button click (for steps 4 & 6) ── */
  const handleOptionClick = (option: string) => {
    // Add user's selection as a bubble
    const userMsg: ThreadMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: option,
    };
    const updated = { ...thread, messages: [...thread.messages, userMsg] };
    onUpdateThread(updated);

    // AI responds with the artifact
    setThinking(true); setThinkingKey(k => k + 1);
    setTimeout(() => {
      if (!scenario || !step) return;
      const aiMsg: ThreadMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: step.title.startsWith('Schedule')
          ? "Perfect — Live Q&As have the lowest prep and highest engagement for new communities. Here's what I'd suggest:"
          : "Here's what I'd do for a course community that's just launching:",
        artifacts: [{
          id: `artifact-${step.number}-1`,
          title: scenario.artifact.title,
          content: scenario.artifact.rows.map(r =>
            r.label
              ? `${r.label}${r.detail ? `\n${r.detail}` : ''}`
              : r.detail
          ).join('\n\n'),
          status: scenario.artifact.status,
          sourceStepNumber: step.number,
        }],
      };
      onUpdateThread({ ...updated, messages: [...updated.messages, aiMsg] });
      setThinking(false);
    }, 1500);
  };

  /* ── Send user message ── */
  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ThreadMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text.trim(),
    };
    const updated = { ...thread, messages: [...thread.messages, userMsg] };
    onUpdateThread(updated);

    setThinking(true); setThinkingKey(k => k + 1);
    setTimeout(() => {
      const aiMsg: ThreadMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: "Updated. Take a look — let me know if you want any other changes.",
      };
      onUpdateThread({ ...updated, messages: [...updated.messages, aiMsg] });
      setThinking(false);
    }, 1800);
  };

  /* ── Check if options should be shown (step has options and no user reply yet) ── */
  const hasUserMessage = thread.messages.some(m => m.role === 'user');
  const showOptions = stepOptions && !hasUserMessage && thread.messages.length > 0 && !thinking;

  /* ── Check if artifact has been shown (to decide whether to show complete step) ── */
  const hasArtifact = thread.messages.some(m => m.artifacts && m.artifacts.length > 0);

  /* ── Header ── */
  const threadLabel = step ? step.title : thread.title;

  return (
    <div className="h-full flex flex-col">
      {/* Header — matches CopilotView */}
      <div className="shrink-0 px-4 py-3 flex items-center gap-2">
        <div
          className="flex-1 min-w-0 overflow-hidden"
          onClick={e => {
            const anchor = (e.target as HTMLElement).closest('a');
            if (anchor) { e.preventDefault(); onBack(); }
          }}
        >
          <BreadCrumbs
            size="sm"
            items={[{ label: 'Projects', href: '#' }, { label: threadLabel }]}
            className="flex-1 min-w-0 [&_span]:truncate [&_span]:block"
          />
        </div>
        <Menu
          options={[
            { label: 'Back to project', icon: 'arrow-left', onClick: onBack },
            { label: 'Delete conversation', icon: 'trash-can', onClick: () => {}, danger: true },
          ]}
          trigger={<IconButton type="button" variant="ghost" size="sm" icon="dot-menu" aria-label="More options" className="shrink-0" />}
          side="bottom" align="end" sideOffset={4}
        />
        <IconButton type="button" variant="ghost" size="sm" icon="arrow-wall-left" aria-label="Back to project" onClick={onBack} className="shrink-0" />
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-6 py-9">
        <div className="w-full max-w-[678px] mx-auto flex flex-col gap-10">
          {thread.messages.map((msg) => (
            msg.role === 'user' ? (
              <div key={msg.id} className="flex flex-col items-end pl-6">
                <div className="bg-secondary rounded-[16px] px-4 py-[10px]">
                  <Typography variant="body-md" color="primary">{msg.content}</Typography>
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex flex-col gap-4">
                <div className="flex flex-col items-start gap-4">
                  <img src="/ai-avatar.png" alt="AI" className="w-[22px] h-[22px] rounded-full shrink-0" />
                  <Typography variant="body-md" color="primary" className="whitespace-pre-line">{msg.content}</Typography>
                </div>

                {/* Artifact cards */}
                {msg.artifacts?.map(artifact => (
                  <div key={artifact.id} className="rounded-xl border border-secondary bg-primary shadow-sm overflow-hidden">
                    <div className="px-5 py-4 flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <Icon name="file" size="sm" className="text-primary" />
                        <Typography variant="label-sm" color="primary" className="flex-1 min-w-0">
                          <span className="font-semibold">{artifact.title}</span>
                        </Typography>
                        <Badge
                          label={artifact.status === 'draft' ? 'Draft' : 'Applied'}
                          variant={artifact.status === 'draft' ? 'warning' : 'success'}
                        />
                      </div>
                      <Typography variant="body-sm" color="secondary" className="whitespace-pre-line">
                        {artifact.content}
                      </Typography>
                    </div>
                    {/* Action buttons from scenario */}
                    {scenario && (
                      <div className="px-5 py-3 border-t border-secondary flex items-center gap-2 flex-wrap">
                        <Button variant="primary" size="sm">{scenario.primaryAction}</Button>
                        {scenario.secondaryActions.map(action => (
                          <Button key={action} variant="outline" size="sm">{action}</Button>
                        ))}
                        {step && step.status !== 'complete' && (
                          <Button variant="outline" size="sm" startIcon="checkmark-small"
                            onClick={(e) => { e.stopPropagation(); onStepComplete?.(step.id); }}>
                            Complete step
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Feedback row (after non-artifact AI messages) */}
                {!msg.artifacts?.length && (
                  <div className="flex items-center gap-[5px]">
                    <IconButton type="button" variant="ghost" size="sm" icon="thumbup" aria-label="Like" className="text-tertiary" />
                    <div className="-scale-y-100">
                      <IconButton type="button" variant="ghost" size="sm" icon="thumbup" aria-label="Dislike" className="text-tertiary" />
                    </div>
                    <IconButton type="button" variant="ghost" size="sm" icon="copy" aria-label="Copy" className="text-tertiary" />
                  </div>
                )}
              </div>
            )
          ))}

          {/* Tappable option buttons (for steps 4 & 6) */}
          {showOptions && (
            <div className="flex flex-col gap-2 pl-[34px] animate-[fadeIn_300ms_ease-out]">
              {stepOptions.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleOptionClick(option)}
                  className="text-left px-4 py-2.5 rounded-xl border border-primary bg-primary text-[color:var(--color-text-secondary)] text-sm hover:bg-hover hover:border-secondary cursor-pointer transition-all duration-150"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Complete step button (shown after artifact, for steps without options or after option selected) */}
          {!scenario && hasArtifact && step && step.status !== 'complete' && !thinking && (
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" startIcon="checkmark-small"
                onClick={() => onStepComplete?.(step.id)}>
                Complete step
              </Button>
            </div>
          )}

          {/* Thinking — stays mounted to show "Thought for Xs" trace */}
          {thinkingKey > 0 && (
            <div key={thinkingKey} className="animate-[fadeIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
              <ThinkingIndicator skill={step?.skill || undefined} done={!thinking} />
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Chat input */}
      <div className="shrink-0 px-4 pt-4 pb-4">
        <div className="w-full max-w-[678px] mx-auto">
          <AgentMessageBox
            placeholder={step ? `Continue working on ${step.title}...` : 'Continue this conversation...'}
            onSubmit={handleSend}
          />
        </div>
      </div>
    </div>
  );
};

export default ThreadView;
