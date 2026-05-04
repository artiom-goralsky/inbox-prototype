import React, { useState, useEffect, useRef } from 'react';
import { Icon, type IconName } from '@circleco/compass/components/Icon';
import { type Skill, filterSkills, SKILLS } from './skillData';

/* ── Skill Tag (inline in input) ───────────────────────────────────── */

interface SkillTagProps {
  skill: Skill;
  onRemove: () => void;
}

export const SkillTag: React.FC<SkillTagProps> = ({ skill, onRemove }) => (
  <div className="group/pill inline-flex items-center gap-2 bg-[#f7f9fa] border border-[#e4e7eb] rounded-[12px] px-[10px] py-[4px]">
    {/* Icon box */}
    <div className="w-5 h-5 rounded-[4px] bg-[#e4e7eb] flex items-center justify-center shrink-0">
      <Icon name="book-filled" size="sm" className="text-[#717680]" />
    </div>

    {/* Skill name in mono */}
    <span
      className="text-sm text-[#717680] whitespace-nowrap leading-6"
      style={{ fontFamily: "'Geist Mono', 'Fira Mono', 'Courier New', monospace", fontWeight: 500 }}
    >
      &ldquo;{skill.id}&rdquo;
    </span>

    {/* Remove */}
    <button
      type="button"
      onClick={e => { e.preventDefault(); onRemove(); }}
      className="text-[#a5a9ad] hover:text-[#717680] transition-colors ml-1 opacity-0 group-hover/pill:opacity-100"
      aria-label="Remove skill"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </button>
  </div>
);

/* ── Skill Picker Dropdown ─────────────────────────────────────────── */

interface SkillPickerProps {
  query: string;
  onSelect: (skill: Skill) => void;
  onClose: () => void;
  className?: string;
}

const SkillPicker: React.FC<SkillPickerProps> = ({ query, onSelect, onClose, className }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const filtered = query ? filterSkills(query) : SKILLS;

  useEffect(() => { setActiveIndex(0); }, [query]);

  useEffect(() => {
    const el = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && filtered.length > 0) {
        e.preventDefault();
        onSelect(filtered[activeIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [filtered, activeIndex, onSelect, onClose]);

  return (
    <div
      className={`absolute bottom-full left-0 mb-2 w-[200px] bg-primary border border-[#e4e7eb] rounded-lg overflow-hidden z-50
        shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_3px_12px_-4px_rgba(0,0,0,0.1),0px_4px_16px_-8px_rgba(0,0,0,0.1)]
        ${className ?? ''}`}
    >
      <div className="p-1 flex flex-col gap-2">
        {/* Header */}
        <div className="px-2 py-1">
          <span className="text-xs font-medium text-[#717680]">Skills</span>
        </div>

        {/* Items */}
        <div ref={listRef} className="flex flex-col max-h-[220px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-2 py-2 text-sm text-[#717680]">No results</div>
          ) : (
            filtered.map((skill, idx) => (
              <button
                key={skill.id}
                type="button"
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => onSelect(skill)}
                className={`w-full text-left px-2 py-2 rounded-md text-sm text-[#191b1f] transition-colors ${
                  idx === activeIndex ? 'bg-[#f7f9fa]' : 'hover:bg-[#f7f9fa]'
                }`}
              >
                {skill.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillPicker;
