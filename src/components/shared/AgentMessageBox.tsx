import React, { useState, useRef } from 'react';
import { IconButton } from '@circleco/compass/components/IconButton';
import SkillPicker, { SkillTag } from './SkillPicker';
import type { Skill } from './skillData';

interface AgentMessageBoxProps {
  placeholder?: string;
  onSubmit?: (message: string, skill?: Skill) => void;
  className?: string;
  initialValue?: string;
  /** Called when a skill is selected via slash command */
  onSkillSelect?: (skill: Skill) => void;
}

const AgentMessageBox: React.FC<AgentMessageBoxProps> = ({
  placeholder = 'Reply to Clara...',
  onSubmit,
  className,
  initialValue = '',
  onSkillSelect,
}) => {
  const [reply, setReply] = useState(initialValue);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [slashQuery, setSlashQuery] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setReply(val);

    // Detect slash command
    if (val.startsWith('/') && !selectedSkill) {
      setSlashQuery(val.slice(1));
    } else if (slashQuery !== null && !val.startsWith('/')) {
      setSlashQuery(null);
    }

    // Auto-resize
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const handleSkillSelect = (skill: Skill) => {
    setSelectedSkill(skill);
    setSlashQuery(null);
    setReply('');
    onSkillSelect?.(skill);
    textareaRef.current?.focus();
  };

  const handleSkillRemove = () => {
    setSelectedSkill(null);
    textareaRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSkill || reply.trim()) {
      onSubmit?.(reply, selectedSkill ?? undefined);
      setReply('');
      setSelectedSkill(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex flex-col gap-4 min-h-[131px] rounded-2xl bg-primary shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_3px_12px_-4px_rgba(0,0,0,0.1),0px_4px_16px_-8px_rgba(0,0,0,0.1)] px-4 py-3 ${className ?? ''}`}
    >
      {/* Skill picker dropdown */}
      {slashQuery !== null && (
        <SkillPicker
          query={slashQuery}
          onSelect={handleSkillSelect}
          onClose={() => { setSlashQuery(null); setReply(''); }}
        />
      )}

      <div className="flex-1 flex flex-col gap-2">
        {/* Selected skill tag */}
        {selectedSkill && (
          <div className="flex items-center">
            <SkillTag skill={selectedSkill} onRemove={handleSkillRemove} />
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={reply}
          onChange={handleChange}
          placeholder={selectedSkill ? `Describe what you need for ${selectedSkill.name}...` : placeholder}
          rows={1}
          className="bg-transparent border-0 text-base text-primary placeholder:text-tertiary focus:outline-none p-0 w-full resize-none overflow-y-auto"
          style={{ maxHeight: 120 }}
        />
      </div>
      <div className="flex gap-1 items-end justify-between w-full">
        <div className="flex gap-1 items-center">
          <IconButton
            type="button"
            variant="outline"
            size="sm"
            icon="hashtag"
            aria-label="Tag"
          />
          <IconButton
            type="button"
            variant="outline"
            size="sm"
            icon="paperclip"
            aria-label="Attach"
          />
        </div>
        <div className="flex gap-1 items-center">
          <IconButton
            type="button"
            variant="ghost"
            size="sm"
            icon="microphone"
            aria-label="Voice"
          />
          <IconButton
            type="submit"
            variant={selectedSkill ? 'primary' : 'secondary'}
            size="sm"
            icon="arrow-up"
            aria-label="Send"
          />
        </div>
      </div>
    </form>
  );
};

export default AgentMessageBox;
