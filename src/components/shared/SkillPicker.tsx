import React, { useState, useEffect, useRef } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Button } from '@circleco/compass/components/Button';
import { Icon, type IconName } from '@circleco/compass/components/Icon';
import { Tooltip } from '@circleco/compass/components/Tooltip';
import { type Skill, filterSkills, SKILLS } from './skillData';

/* ── Skill Tag (inline in input) ───────────────────────────────────── */

interface SkillTagProps {
  skill: Skill;
  onRemove: () => void;
}

export const SkillTag: React.FC<SkillTagProps> = ({ skill, onRemove }) => (
  <Tooltip
    content={skill.description}
    side="top"
    sideOffset={6}
  >
    <div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        startIcon={skill.icon as IconName}
        endIcon="cross"
        onClick={e => { e.preventDefault(); onRemove(); }}
      >
        {skill.name}
      </Button>
    </div>
  </Tooltip>
);

/* ── Skill Picker Dropdown ─────────────────────────────────────────── */

interface SkillPickerProps {
  query: string;
  onSelect: (skill: Skill) => void;
  onClose: () => void;
  /** Position relative to input — bottom-left by default */
  className?: string;
}

const SkillPicker: React.FC<SkillPickerProps> = ({ query, onSelect, onClose, className }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const filtered = query ? filterSkills(query) : SKILLS;

  // Reset active index when results change
  useEffect(() => { setActiveIndex(0); }, [query]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // Keyboard navigation
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

  if (filtered.length === 0) {
    return (
      <div className={`absolute bottom-full left-0 mb-2 w-[320px] bg-primary border border-secondary rounded-xl shadow-lg p-3 z-50 ${className ?? ''}`}>
        <Typography variant="body-sm" color="tertiary" className="text-center py-2">
          No skills match &ldquo;{query}&rdquo;
        </Typography>
      </div>
    );
  }

  // Group by category
  const groups: Record<string, Skill[]> = {};
  for (const skill of filtered) {
    (groups[skill.category] ??= []).push(skill);
  }

  let flatIndex = 0;

  return (
    <div className={`absolute bottom-full left-0 mb-2 w-[320px] bg-primary border border-secondary rounded-xl shadow-lg overflow-hidden z-50 ${className ?? ''}`}>
      <div className="px-3 pt-3 pb-1">
        <Typography variant="label-xs" color="tertiary" className="uppercase tracking-wider">
          Skills
        </Typography>
      </div>
      <div ref={listRef} className="max-h-[280px] overflow-y-auto px-1 pb-1">
        {Object.entries(groups).map(([category, skills]) => (
          <div key={category}>
            {Object.keys(groups).length > 1 && (
              <div className="px-2 pt-2 pb-1">
                <Typography variant="caption" color="tertiary">{category}</Typography>
              </div>
            )}
            {skills.map(skill => {
              const idx = flatIndex++;
              const isActive = idx === activeIndex;
              return (
                <button
                  key={skill.id}
                  type="button"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => onSelect(skill)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive ? 'bg-hover' : ''
                  }`}
                >
                  <Icon name={skill.icon as IconName} size="sm" className="shrink-0 text-secondary" />
                  <div className="flex-1 min-w-0">
                    <Typography variant="label-sm" color="primary" className="truncate">
                      {skill.name}
                    </Typography>
                    <Typography variant="caption" color="tertiary" className="truncate block">
                      {skill.description}
                    </Typography>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="px-3 py-2 border-t border-secondary flex items-center gap-3">
        <Typography variant="caption" color="tertiary">
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-secondary text-[10px] font-mono">↑↓</kbd> navigate
          </span>
        </Typography>
        <Typography variant="caption" color="tertiary">
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-secondary text-[10px] font-mono">↵</kbd> select
          </span>
        </Typography>
        <Typography variant="caption" color="tertiary">
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-secondary text-[10px] font-mono">esc</kbd> close
          </span>
        </Typography>
      </div>
    </div>
  );
};

export default SkillPicker;
