import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { IconButton } from '@circleco/compass/components/IconButton';

export interface CollapsibleNavItem {
  id: string;
  label: string;
  icon: string;
  count?: number;
  emoji?: string;
}

export interface CollapsibleNavSection {
  id: string;
  label?: string;
  items: CollapsibleNavItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
  onAdd?: () => void;
  /** If false, shows a right-chevron instead of down-chevron (non-expandable sections) */
  expandable?: boolean;
}

export interface CollapsibleNavProps {
  title: string;
  sections: CollapsibleNavSection[];
  activeItem: string;
  onItemClick: (id: string) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  /** Extra button(s) rendered at the right of the header when expanded */
  headerAction?: React.ReactNode;
}

const ChevronDown: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    className={`shrink-0 transition-transform text-tertiary ${open ? '' : '-rotate-90'}`}
  >
    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-tertiary">
    <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CollapsibleNav: React.FC<CollapsibleNavProps> = ({
  title,
  sections,
  activeItem,
  onItemClick,
  collapsed,
  onToggleCollapsed,
  headerAction,
}) => {
  // Track open/closed state per section
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      sections
        .filter(s => s.collapsible)
        .map(s => [s.id, s.defaultOpen ?? true])
    )
  );

  const toggleSection = (id: string) =>
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));

  // Flatten all items for the collapsed icon view
  const allItems = sections.flatMap(s => s.items);

  // ── Collapsed (icon rail) ──────────────────────────────────────────────────
  if (collapsed) {
    return (
      <div className="w-[52px] shrink-0 bg-primary border-r border-secondary flex flex-col h-full overflow-y-auto">
        <div className="flex items-center justify-center py-3 border-b border-secondary">
          <IconButton
            variant="ghost"
            size="sm"
            icon="layout-left"
            aria-label="Expand sidebar"
            onClick={onToggleCollapsed}
          />
        </div>
        <div className="flex flex-col items-center gap-0.5 py-2 px-1.5">
          {allItems.map(item => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              title={item.label}
              onClick={() => onItemClick(item.id)}
              onKeyDown={e => e.key === 'Enter' && onItemClick(item.id)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors ${
                activeItem === item.id ? 'bg-active' : 'hover:bg-hover'
              }`}
            >
              {item.emoji ? (
                <span className="text-sm leading-none">{item.emoji}</span>
              ) : (
                <IconButton
                  variant="ghost"
                  size="sm"
                  icon={item.icon as any}
                  aria-label={item.label}
                  onClick={e => { e.stopPropagation(); onItemClick(item.id); }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Expanded (full sidebar) ────────────────────────────────────────────────
  return (
    <div className="w-[220px] shrink-0 bg-primary border-r border-secondary flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-secondary">
        <div className="flex items-center gap-2">
          <IconButton
            variant="ghost"
            size="sm"
            icon="layout-left"
            aria-label="Collapse sidebar"
            onClick={onToggleCollapsed}
          />
          <Typography variant="heading-sm" color="primary">
            <span className="font-semibold">{title}</span>
          </Typography>
        </div>
        {headerAction}
      </div>

      {/* Sections */}
      {sections.map(section => {
        const isOpen = section.collapsible ? (openSections[section.id] ?? true) : true;

        return (
          <div key={section.id} className="px-2">
            {/* Section header (only shown when label is provided) */}
            {section.label && (
              <div className="flex items-center justify-between px-3 py-1 mt-2">
                <div
                  role="button"
                  tabIndex={0}
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => section.collapsible && toggleSection(section.id)}
                  onKeyDown={e => e.key === 'Enter' && section.collapsible && toggleSection(section.id)}
                >
                  <Typography variant="label-xs" color="tertiary">
                    <span className="uppercase tracking-wide text-[10px]">{section.label}</span>
                  </Typography>
                  {section.collapsible
                    ? <ChevronDown open={isOpen} />
                    : (section.expandable !== false && <ChevronRight />)
                  }
                </div>
                {section.onAdd && (
                  <IconButton variant="ghost" size="sm" icon="plus" aria-label={`Add ${section.label}`} onClick={section.onAdd} />
                )}
              </div>
            )}

            {/* Items */}
            {isOpen && (
              <div className={`flex flex-col gap-0.5 ${section.label ? 'mt-0.5' : 'py-2'}`}>
                {section.items.map(item => (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onItemClick(item.id)}
                    onKeyDown={e => e.key === 'Enter' && onItemClick(item.id)}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                      activeItem === item.id ? 'bg-active' : 'hover:bg-hover'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {item.emoji && <span className="text-sm leading-none">{item.emoji}</span>}
                      <Typography variant="body-sm" color="primary">
                        <span className="truncate">{item.label}</span>
                      </Typography>
                    </div>
                    {item.count !== undefined && (
                      <Typography variant="body-sm" color="tertiary">
                        {item.count}
                      </Typography>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CollapsibleNav;
