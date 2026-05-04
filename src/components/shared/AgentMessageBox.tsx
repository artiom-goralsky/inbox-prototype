import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Icon } from '@circleco/compass/components/Icon';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Badge } from '@circleco/compass/components/Badge';
import { Button } from '@circleco/compass/components/Button';
import SkillPicker, { SkillTag } from './SkillPicker';
import type { Skill } from './skillData';
import MentionPicker, { type MentionEntity } from './MentionPicker';

/* ── Audio spinner (same as ThinkingIndicator) ───────────────────── */
const CircleDotsSpinner = () => (
  <svg width="20" height="20" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <circle cx="32" cy="32" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="0s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
    <circle cx="32" cy="14.08" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.123s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
    <circle cx="44.67" cy="19.33" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.247s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
    <circle cx="49.92" cy="32" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.370s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
    <circle cx="44.67" cy="44.67" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.494s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
    <circle cx="32" cy="49.92" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.617s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
    <circle cx="19.33" cy="44.67" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.741s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
    <circle cx="14.08" cy="32" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.864s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
    <circle cx="19.33" cy="19.33" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.988s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
  </svg>
);

/* ── Demo attachment assets ─────────────────────────────────────── */
const DEMO_ATTACHMENTS: Attachment[] = [
  {
    id: 'att-img',
    type: 'image',
    label: undefined,
    preview: '/images/placeholders/image-1.png',
    name: 'photo.jpg',
  },
  {
    id: 'att-pdf',
    type: 'paste',
    label: 'PDF',
    preview: null,
    text: `Community Growth Report Q1 2026\n\nTotal members: 4,821\nNew this month: 312\nRetention rate: 87%\n\nTop spaces by engagement:\n1. General Discussion\n2. Announcements\n3. Tips & Tricks\n\nChurn risk: 14 members flagged for re-engagement.`,
    name: 'document.pdf',
  },
  {
    id: 'att-paste',
    type: 'paste',
    label: 'Pasted',
    preview: null,
    text: `The root cause: the useEffect depends on [projectStates], but projectStates may not change after editorRef.current is set by handleMount. Fix: convert editorRef to proper React state so the effect re-fires when editor mounts.`,
    name: 'Pasted text',
  },
];

/* ── Types ──────────────────────────────────────────────────────── */
interface Attachment {
  id: string;
  type: 'image' | 'pdf' | 'paste' | 'reference';
  label?: string;
  preview: string | null;
  text?: string;
  name: string;
  referenceData?: {
    messageId: string;
    authorName: string;
    snippet: string;
    category: 'dm' | 'chatThread' | 'courseComment' | 'aiInbox';
  };
}

interface AgentMessageBoxProps {
  placeholder?: string;
  onSubmit?: (message: string, skill?: Skill, attachments?: Attachment[]) => void;
  className?: string;
  initialValue?: string;
  onSkillSelect?: (skill: Skill) => void;
  isGenerating?: boolean;
  onStop?: () => void;
}

/* ── Attachment thumbnail ───────────────────────────────────────── */
const AttachmentThumb: React.FC<{ attachment: Attachment; onRemove: () => void }> = ({ attachment, onRemove }) => (
  <div className="relative w-[68px] h-[68px] rounded-lg overflow-hidden shrink-0 group/thumb">
    {attachment.type === 'paste' ? (
      <div className="absolute inset-0 bg-[#3a3d44] p-[6px] overflow-hidden">
        <p className="text-[2.6px] leading-[4px] text-white/70 break-words select-none">{attachment.text}</p>
      </div>
    ) : (
      <img src={attachment.preview!} alt={attachment.name} className="absolute inset-0 w-full h-full object-cover" />
    )}
    <div className="absolute inset-0 bg-[rgba(25,27,31,0.45)]" />
    {attachment.label && (
      <div className="absolute bottom-[6px] left-[6px]">
        <Badge variant="secondary" label={attachment.label} />
      </div>
    )}
    <button
      type="button"
      onClick={onRemove}
      className="absolute top-[4px] right-[4px] w-5 h-5 rounded-full bg-[rgba(25,27,31,0.7)] flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-150 hover:bg-[rgba(25,27,31,0.9)]"
      aria-label={`Remove ${attachment.name}`}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M2 2l6 6M8 2L2 8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </button>
  </div>
);

/* ── Main component ─────────────────────────────────────────────── */
const AgentMessageBox: React.FC<AgentMessageBoxProps> = ({
  placeholder = 'Reply to Clara...',
  onSubmit,
  className,
  initialValue = '',
  onSkillSelect,
  isGenerating = false,
  onStop,
}) => {
  const [hasContent, setHasContent] = useState(!!initialValue);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [slashQuery, setSlashQuery] = useState<string | null>(null);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [hintBarVisible, setHintBarVisible] = useState(true);
  const [hintBarClosing, setHintBarClosing] = useState(false);

  const closeHintBar = () => {
    setHintBarClosing(true);
    setTimeout(() => {
      setHintBarVisible(false);
      setHintBarClosing(false);
    }, 320);
  };

  /* ── Audio recording ── */
  type AudioState = 'idle' | 'recording' | 'transcribing';
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [waveformBars, setWaveformBars] = useState<number[]>(() => Array(80).fill(4));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const waveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingTranscriptRef = useRef<string | null>(null);

  const genBarHeight = () => {
    const r = Math.random();
    if (r > 0.88) return 20;
    if (r > 0.72) return 14;
    if (r > 0.52) return 8;
    return 4;
  };

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const startRecording = useCallback(() => {
    setAudioState('recording');
    setRecordingTime(0);
    setWaveformBars(Array(80).fill(4));
    timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    waveRef.current = setInterval(() => setWaveformBars(prev => [...prev.slice(1), genBarHeight()]), 100);
  }, []);

  const stopRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (waveRef.current) clearInterval(waveRef.current);
    setAudioState('transcribing');
    setTimeout(() => {
      pendingTranscriptRef.current = 'Can you help me set up an onboarding space for new members? I want them to introduce themselves, see the community rules, and get a welcome message from me automatically.';
      setAudioState('idle');
    }, 2500);
  }, []);

  // Apply transcript after idle state re-mounts the contentEditable div
  useEffect(() => {
    if (audioState === 'idle' && pendingTranscriptRef.current) {
      const text = pendingTranscriptRef.current;
      pendingTranscriptRef.current = null;
      requestAnimationFrame(() => {
        if (editableRef.current) {
          editableRef.current.textContent = text;
          setHasContent(true);
          const range = document.createRange();
          range.selectNodeContents(editableRef.current);
          range.collapse(false);
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
          editableRef.current.focus();
        }
      });
    }
  }, [audioState]);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (waveRef.current) clearInterval(waveRef.current);
  }, []);
  const editableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialValue && editableRef.current) {
      editableRef.current.textContent = initialValue;
      setHasContent(true);
    }
  }, []);

  /* ── Helpers ── */
  const getTextBeforeCursor = (): string => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount || !editableRef.current) return '';
    const range = sel.getRangeAt(0);
    const pre = range.cloneRange();
    pre.selectNodeContents(editableRef.current);
    pre.setEnd(range.endContainer, range.endOffset);
    return pre.toString();
  };

  /* ── Input handler ── */
  const handleInput = () => {
    const el = editableRef.current;
    if (!el) return;
    setHasContent((el.textContent ?? '').trim().length > 0);

    const textToCursor = getTextBeforeCursor();

    const slashMatch = textToCursor.match(/\/(\w*)$/);
    if (slashMatch && !selectedSkill) {
      setSlashQuery(slashMatch[1]);
      setMentionQuery(null);
      return;
    }
    setSlashQuery(null);

    const mentionMatch = textToCursor.match(/#(\w*)$/);
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
    } else {
      setMentionQuery(null);
    }
  };

  /* ── Key handler ── */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Let pickers handle their own Enter/Esc
    if (slashQuery !== null || mentionQuery !== null) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      doSubmit();
    }
  };

  /* ── Mention select ── */
  const handleMentionSelect = (entity: MentionEntity) => {
    const el = editableRef.current;
    if (!el) return;

    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;

    const range = sel.getRangeAt(0);
    const textToCursor = getTextBeforeCursor();
    const mentionMatch = textToCursor.match(/#(\w*)$/);
    if (!mentionMatch) return;

    const triggerLen = mentionMatch[0].length;
    const endNode = range.endContainer;
    const endOffset = range.endOffset;

    if (endNode.nodeType === Node.TEXT_NODE) {
      const delRange = document.createRange();
      delRange.setStart(endNode, Math.max(0, endOffset - triggerLen));
      delRange.setEnd(endNode, endOffset);
      delRange.deleteContents();

      // Chip span
      const chip = document.createElement('span');
      chip.setAttribute('data-mention', 'true');
      chip.setAttribute('data-id', String(entity.id));
      chip.setAttribute('data-type', entity.type);
      chip.setAttribute('contenteditable', 'false');
      chip.style.cssText =
        'display:inline;background:#f7f9fa;border-radius:4px;padding:1px 4px;color:#191b1f;font-size:inherit;line-height:inherit;white-space:nowrap;cursor:default;user-select:all;';
      chip.textContent = `#${entity.name}`;

      delRange.insertNode(chip);

      // Space after chip
      const space = document.createTextNode('\u00A0');
      chip.after(space);

      const after = document.createRange();
      after.setStartAfter(space);
      after.collapse(true);
      sel.removeAllRanges();
      sel.addRange(after);
    }

    setMentionQuery(null);
    setHasContent(true);
    el.focus();
  };

  /* ── Skill select ── */
  const handleSkillSelect = (skill: Skill) => {
    setSelectedSkill(skill);
    setSlashQuery(null);

    // Remove the /query trigger
    const el = editableRef.current;
    if (el) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount) {
        const range = sel.getRangeAt(0);
        const textToCursor = getTextBeforeCursor();
        const slashMatch = textToCursor.match(/\/(\w*)$/);
        if (slashMatch && range.endContainer.nodeType === Node.TEXT_NODE) {
          const endOffset = range.endOffset;
          const triggerLen = slashMatch[0].length;
          const delRange = document.createRange();
          delRange.setStart(range.endContainer, Math.max(0, endOffset - triggerLen));
          delRange.setEnd(range.endContainer, endOffset);
          delRange.deleteContents();
        }
      }
    }
    onSkillSelect?.(skill);
    el?.focus();
  };

  const handleSkillRemove = () => {
    setSelectedSkill(null);
    editableRef.current?.focus();
  };

  /* ── Attachment ── */
  const handleAttachClick = () => {
    setAttachments(DEMO_ATTACHMENTS);
    editableRef.current?.focus();
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  /* ── Copilot reference listener ── */
  React.useEffect(() => {
    const handler = (e: Event) => {
      const { messageId, authorName, snippet, category } = (e as CustomEvent).detail;
      setAttachments(prev => {
        if (prev.some(a => a.type === 'reference' && a.referenceData?.messageId === messageId)) return prev;
        return [...prev, {
          id: `ref-${messageId}`,
          type: 'reference' as const,
          label: authorName,
          preview: null,
          text: snippet,
          name: authorName,
          referenceData: { messageId, authorName, snippet, category },
        }];
      });
      editableRef.current?.focus();
    };
    window.addEventListener('copilot-add-reference', handler);
    return () => window.removeEventListener('copilot-add-reference', handler);
  }, []);

  /* ── Submit ── */
  const doSubmit = () => {
    const el = editableRef.current;
    if (!el) return;
    const text = el.textContent?.trim() ?? '';
    if (text || attachments.length > 0) {
      onSubmit?.(text, selectedSkill ?? undefined, attachments.length > 0 ? [...attachments] : undefined);
      el.innerHTML = '';
      setHasContent(false);
      setSelectedSkill(null);
      setAttachments([]);
      setSlashQuery(null);
      setMentionQuery(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSubmit();
  };

  const canSubmit = hasContent || attachments.length > 0;

  return (
    <div className={`flex flex-col ${className ?? ''}`}>
    {/* Reply pill — above the input card when references are attached */}
    {attachments.some(a => a.type === 'reference') && (
      <div className="flex flex-wrap gap-2 px-1 pb-2">
        <Button
          variant="outline"
          size="sm"
          startIcon="message-text"
          onClick={() => {
            const el = editableRef.current;
            if (el) { el.textContent = 'Reply'; }
            setHasContent(true);
            setTimeout(() => doSubmit(), 0);
          }}
        >
          Reply
        </Button>
      </div>
    )}
    <form
      onSubmit={handleSubmit}
      className="relative border border-primary bg-primary shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] px-4"
      style={{
        borderRadius: '16px',
        minHeight: audioState !== 'idle' ? 56 : 131,
        paddingTop: audioState !== 'idle' ? 12 : 16,
        paddingBottom: audioState !== 'idle' ? 12 : 16,
        transition: 'min-height 280ms cubic-bezier(0.4,0,0.2,1), padding 280ms cubic-bezier(0.4,0,0.2,1), border-radius 320ms cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        flexDirection: audioState !== 'idle' ? 'row' : 'column',
        gap: audioState !== 'idle' ? 12 : 16,
        alignItems: audioState !== 'idle' ? 'center' : 'stretch',
      }}
    >
      {/* Skill/mention pickers (only in idle) */}
      {audioState === 'idle' && slashQuery !== null && (
        <SkillPicker query={slashQuery} onSelect={handleSkillSelect} onClose={() => setSlashQuery(null)} />
      )}
      {audioState === 'idle' && mentionQuery !== null && (
        <MentionPicker query={mentionQuery} onSelect={handleMentionSelect} onClose={() => setMentionQuery(null)} />
      )}

      {audioState === 'recording' && (
        <>
          {/* Pulsing red dot */}
          <div className="w-3 h-3 rounded-full shrink-0 animate-[pulse_1s_ease-in-out_infinite]" style={{ background: '#ea4335' }} />
          {/* Timer */}
          <span className="text-[12px] text-[#717680] whitespace-nowrap tabular-nums shrink-0">{formatTime(recordingTime)}</span>
          {/* Waveform — fills all space to the stop button */}
          <div className="flex items-center justify-center gap-[3px] flex-1 min-w-0 overflow-hidden" style={{ height: 32 }}>
            {waveformBars.map((h, i) => (
              <div key={i} className="shrink-0 rounded-sm bg-[#191b1f]" style={{ width: 2, height: h }} />
            ))}
          </div>
          {/* Stop button */}
          <IconButton type="button" variant="primary" size="sm" icon="record" aria-label="Stop recording" onClick={stopRecording} />
        </>
      )}

      {audioState === 'transcribing' && (
        <>
          <CircleDotsSpinner />
          <span
            className="text-sm font-medium flex-1 whitespace-nowrap"
            style={{
              background: 'linear-gradient(87.98deg, #3C53E7 2.15%, #8994DC 102.27%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Transcribing your voice memo...
          </span>
          <IconButton type="button" variant="primary" size="sm" icon="record" aria-label="Stop" onClick={() => setAudioState('idle')} />
        </>
      )}

      {audioState === 'idle' && (
        <>
          <div className="flex-1 flex flex-col gap-3">
            {attachments.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {attachments.filter(a => a.type !== 'reference').map(att => (
                  <AttachmentThumb key={att.id} attachment={att} onRemove={() => removeAttachment(att.id)} />
                ))}
                {attachments.filter(a => a.type === 'reference').map(att => (
                  <div key={att.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary border border-secondary rounded-full">
                    <Icon name="message-dots" size="sm" color="tertiary" />
                    <span className="text-xs font-semibold text-primary">{att.referenceData?.authorName}</span>
                    <span className="text-xs text-tertiary">:</span>
                    <span className="text-xs text-tertiary truncate max-w-[280px]">{att.referenceData?.snippet}</span>
                    <button className="shrink-0 focus:outline-none" onClick={() => removeAttachment(att.id)}>
                      <Icon name="cross" size="sm" color="tertiary" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {selectedSkill && (
              <div className="flex items-center">
                <SkillTag skill={selectedSkill} onRemove={handleSkillRemove} />
              </div>
            )}
            <div className="relative">
              <div
                ref={editableRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                className="bg-transparent text-base text-primary focus:outline-none w-full min-h-[24px] break-words"
                style={{ maxHeight: 120, overflowY: 'auto' }}
              />
              {!hasContent && (
                <span className="absolute top-0 left-0 text-base text-tertiary pointer-events-none select-none">
                  {selectedSkill ? `Describe what you need for ${selectedSkill.name}...` : placeholder}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-1 items-end justify-between w-full">
            <div className="flex gap-1 items-center">
              <IconButton type="button" variant="outline" size="sm" icon="paperclip" aria-label="Attach" onClick={handleAttachClick} />
            </div>
            <div className="flex gap-1 items-center">
              <IconButton type="button" variant="outline" size="sm" icon="microphone" aria-label="Voice" onClick={startRecording} />
              {isGenerating ? (
                <button
                  type="button"
                  onClick={onStop}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#191b1f] hover:bg-[#2d3139] text-white transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                    <rect x="2.5" y="2.5" width="9" height="9" rx="1.5" fill="currentColor"/>
                  </svg>
                </button>
              ) : (
                <IconButton type="submit" variant="primary" size="sm" icon="arrow-up" aria-label="Send" disabled={!canSubmit} />
              )}
            </div>
          </div>
        </>
      )}
    </form>

    {/* Shortcut hint bar — hidden during recording/transcribing */}
    {hintBarVisible && audioState === 'idle' && (
      <div
        className="agent-message-box-hint-shell"
        style={{
          display: 'grid',
          marginTop: -16,
          gridTemplateRows: hintBarClosing ? '0fr' : '1fr',
          transition: 'grid-template-rows 320ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={{ overflow: 'hidden', marginTop: 0 }}>
          <div className="flex items-center justify-between bg-[#f7f9fa] border border-[#e4e7eb] border-t-0 rounded-b-[12px] px-5 pt-6 pb-2 mt-0">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                <span
                  className="inline-flex items-center justify-center shrink-0"
                  style={{ width: 20, height: 20, background: '#fff', border: '1px solid #e4e7eb', borderRadius: 4, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', fontSize: 11, color: '#717680', fontWeight: 600, lineHeight: 1 }}
                >
                  #
                </span>
                <span className="text-[12px] text-[#717680]">for mentions</span>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className="inline-flex items-center justify-center shrink-0"
                  style={{ width: 20, height: 20, background: '#fff', border: '1px solid #e4e7eb', borderRadius: 4, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', fontSize: 13, color: '#717680', fontWeight: 400, lineHeight: 1 }}
                >
                  /
                </span>
                <span className="text-[12px] text-[#717680]">for skills</span>
              </div>
            </div>
            <button
              type="button"
              onClick={closeHintBar}
              className="text-[#717680] hover:text-[#191b1f] transition-colors"
              aria-label="Dismiss hints"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default AgentMessageBox;
