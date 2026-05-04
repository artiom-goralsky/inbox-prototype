import React, { useState, useMemo, useEffect, useRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Icon, type IconName } from '@circleco/compass/components/Icon';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Badge } from '@circleco/compass/components/Badge';
import { Typography } from '@circleco/compass/components/Typography';
import { Button } from '@circleco/compass/components/Button';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Modal } from '@circleco/compass/components/Modal';
import { Popover } from '@circleco/compass/components/Popover';
import { Menu, type MenuOptions } from '@circleco/compass/components/Menu';
import { Tooltip } from '@circleco/compass/components/Tooltip';
import {
  adminNavDataV5,
  adminNavDataV4,
  flatNavDataV5,
  findParentL1,
  resolveTitle,
  resolveShortcutItem,
  activeIdToAppRoute,
  appRouteToActiveId,
  V3_DAILY_DRIVER_IDS,
  V3_ADDITIONAL_IDS,
  V3_DEFAULT_SHORTCUT_IDS,
  V4_DAILY_DRIVER_IDS,
  V4_MANAGE_VISIBLE_IDS,
  V4_MANAGE_MORE_IDS,
  ACCORDION_TOP_IDS,
  ACCORDION_MANAGE_IDS,
  ACCORDION_SHOW_MORE_IDS,
  RECENT_CHATS,
  type AdminNavItemV5,
  type AdminNavChildV5,
  type FlatNavSectionV5,
  type ShortcutItemData,
} from './navDataV2';

function mergeClasses(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function CollapsedManageItem({
  item,
  iName,
  showBg,
  onChildSelect,
}: {
  item: AdminNavItemV5;
  iName: string;
  showBg: boolean;
  onChildSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const options: MenuOptions = [
    {
      label: item.label,
      items: (item.children ?? []).map((child: AdminNavChildV5) => ({
        label: child.label,
        closeOnClick: true,
        onClick: () => onChildSelect(child.id),
      })),
    },
  ];
  return (
    <div
      onMouseEnter={() => {
        if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
        setOpen(true);
      }}
      onMouseLeave={() => {
        leaveTimer.current = setTimeout(() => setOpen(false), 150);
      }}
    >
      <Menu
        options={options}
        open={open}
        onOpenChange={open => { if (!open) setOpen(false); }}
        side="right"
        sideOffset={8}
        align="start"
        trigger={
          <div className="flex">
            <IconButton
              type="button"
              variant="ghost"
              icon={iName as IconName}
              aria-label={item.label}
              className={mergeClasses(
                'w-9 h-9 rounded-[12px] transition-colors',
                showBg || open ? 'bg-secondary' : 'hover:bg-secondary'
              )}
            />
          </div>
        }
      />
    </div>
  );
}

function CollapsedMoreMenu({
  moreGroupItems,
  onChildSelect,
}: {
  moreGroupItems: AdminNavItemV5[];
  onChildSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const options: MenuOptions = moreGroupItems.flatMap((l1, i) => [
    ...(i > 0 ? ['divider' as const] : []),
    {
      label: l1.label,
      items: (l1.children ?? []).map((child: AdminNavChildV5) => ({
        label: child.label,
        closeOnClick: true,
        onClick: () => onChildSelect(child.id),
      })),
    },
  ]);
  return (
    <div
      onMouseEnter={() => {
        if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
        setOpen(true);
      }}
      onMouseLeave={() => {
        leaveTimer.current = setTimeout(() => setOpen(false), 150);
      }}
    >
      <Menu
        options={options}
        open={open}
        onOpenChange={open => { if (!open) setOpen(false); }}
        side="right"
        sideOffset={8}
        align="start"
        trigger={
          <div className="flex">
            <IconButton
              type="button"
              variant="ghost"
              icon="dot-menu"
              aria-label="More"
              className={mergeClasses(
                'w-9 h-9 rounded-[12px] transition-colors',
                open ? 'bg-secondary' : 'hover:bg-secondary'
              )}
            />
          </div>
        }
      />
    </div>
  );
}

export type BuilderState = {
  isBuilder: boolean;
  parentTitle: string;
  objectTitle: string;
  onBack: () => void;
  isContentPage?: boolean;
  isSettingsSection?: boolean;
  onCreateNew?: () => void;
};

/* ── Types ──────────────────────────────────────────────────────────── */

interface SidebarV5Props {
  /** Called when user selects a nav item; maps to app (sectionId, subItemId) for admin routing */
  onItemClick?: (sectionId: string, subItemId?: string) => void;
  /** Current admin section (e.g. audience, content) for highlighting */
  currentSection?: string;
  /** Current admin sub-item (e.g. manage-audience, segments) for highlighting */
  activeSubItem?: string;
  onBuilderStateChange?: (state: BuilderState | null) => void;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onLogoClick?: () => void;
  navVersion?: number;
  onNavVersionChange?: (version: number) => void;
  navigateTo?: string | null;
  navigateToCreate?: boolean;
  onNavigateConsumed?: () => void;
  navStyle?: 'accordion' | 'flat' | 'v3' | 'v4';
  /** If true, only the sidebar panel is rendered (no TopBar, no content column). Use inside AdminSection. */
  sidebarOnly?: boolean;
  /** When provided, shows Recent Chats entry and calls this when selected (opens Copilot + collapse). */
  onOpenCopilot?: (chatId?: string) => void;
  /** When true and sidebarOnly, sidebar shows collapsed (icon-only) rail. */
  isCopilotActive?: boolean;
  /** Called when an agent row in the Agents section is clicked. */
  onAgentClick?: (agentId: string) => void;
  /** When Copilot is active, controls whether the sidebar collapse affordance is shown. */
  showCollapseAffordance?: boolean;
}

/* ── Content section IDs — only these show the table/skeleton content ── */
const CONTENT_SECTION_IDS = new Set([
  'spaces',
  'posts',
  'events',
  'topics',
  'courses-list',
  'lessons',
  'manage-audience',
  'access-groups',
  'segments',
  'invite-links',
  'tags',
  'profile-fields',
  'broadcasts',
  'forms',
  'paywalls-list',
  'coupons',
  'subscription-groups',
  'affiliates-list',
  'commissions',
  'media-manager',
  'all-workflows',
  'v5-website-overview',
  'all-agents',
  'knowledge',
  'v5-developers',
  'v5-plans',
  'push-notifications',
]);

/* ── Sub-components ─────────────────────────────────────────────────── */

/** L1 nav item — clickable row with icon, label, optional badge, expand chevron */
const AdminL1Item: React.FC<{
  item: AdminNavItemV5;
  isExpanded: boolean;
  isActive: boolean;
  hasActiveChild: boolean;
  showChevron?: boolean;
  onSelect: (id: string) => void;
  onPin?: (id: string) => void;
  onUnpin?: () => void;
}> = ({
  item,
  isExpanded,
  isActive,
  hasActiveChild,
  showChevron = true,
  onSelect,
  onPin,
  onUnpin,
}) => {
  const highlighted = isActive || hasActiveChild;
  const iconName = highlighted ? item.activeIconName : item.iconName;
  // Grey bg only when L1 itself is active (landing page), not when a child is selected
  const showBg = isActive && !hasActiveChild;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item.id)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(item.id);
        }
      }}
      className={mergeClasses(
        'group/l1 flex w-full items-center gap-3 h-9 px-3 py-1 rounded-[12px] transition-colors text-[14px] leading-5 justify-start cursor-pointer',
        showBg
          ? 'bg-secondary font-semibold text-primary'
          : highlighted
            ? 'font-semibold text-primary hover:bg-secondary'
            : 'text-primary font-normal hover:bg-secondary'
      )}
    >
      <Icon
        name={iconName as IconName}
        size="md"
        className="w-5 h-5 shrink-0"
      />
      <span className="flex-1 text-left truncate">{item.label}</span>
      {item.badge != null && item.badge > 0 && (
        <Badge label={String(item.badge)} variant="secondary" />
      )}
      {showChevron && item.children && item.children.length > 0 && (
        <Icon
          name="chevron-down"
          size="sm"
          className={mergeClasses(
            'w-4 h-4 shrink-0 text-tertiary transition-transform duration-200',
            isExpanded ? 'rotate-0' : '-rotate-90',
            (onPin || onUnpin) && 'group-hover/l1:hidden'
          )}
          aria-hidden
        />
      )}
      {onPin && (
        <IconButton
          type="button"
          variant="ghost"
          size="sm"
          icon="pin"
          aria-label="Pin"
          className="shrink-0 hidden group-hover/l1:!flex w-5 h-5 rounded hover:bg-secondary"
          onClick={e => {
            e.stopPropagation();
            onPin(item.landingId || item.children?.[0]?.id || item.id);
          }}
        />
      )}
      {onUnpin && (
        <IconButton
          type="button"
          variant="ghost"
          size="sm"
          icon="cross"
          aria-label="Unpin"
          className="shrink-0 hidden group-hover/l1:!flex w-5 h-5 rounded hover:bg-secondary"
          onClick={e => {
            e.stopPropagation();
            onUnpin();
          }}
        />
      )}
    </div>
  );
};

/** L2 child item — label only (no dot indicator) */
const AdminChildItem: React.FC<{
  child: AdminNavChildV5;
  isActive: boolean;
  onSelect: (id: string) => void;
  onPin?: (id: string) => void;
  onUnpin?: () => void;
}> = ({ child, isActive, onSelect, onPin, onUnpin }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={() => onSelect(child.id)}
    onKeyDown={e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(child.id);
      }
    }}
    className={mergeClasses(
      'group/l2 flex w-full items-center gap-3 h-9 px-3 py-1 rounded-[12px] transition-colors text-[14px] leading-5 justify-start cursor-pointer',
      isActive
        ? 'bg-secondary font-medium text-primary'
        : 'text-secondary font-normal hover:bg-secondary'
    )}
  >
    <div className="w-5 shrink-0" aria-hidden />
    <span className="flex-1 text-left truncate">{child.label}</span>
    {onPin && (
      <IconButton
        type="button"
        variant="ghost"
        size="sm"
        icon="pin"
        aria-label="Pin"
        className="shrink-0 hidden group-hover/l2:!flex w-5 h-5 rounded hover:bg-secondary"
        onClick={e => {
          e.stopPropagation();
          onPin(child.id);
        }}
      />
    )}
    {onUnpin && (
      <IconButton
        type="button"
        variant="ghost"
        size="sm"
        icon="cross"
        aria-label="Unpin"
        className="shrink-0 hidden group-hover/l2:!flex w-5 h-5 rounded hover:bg-secondary"
        onClick={e => {
          e.stopPropagation();
          onUnpin();
        }}
      />
    )}
  </div>
);

/** Settings section heading — non-clickable (used in flat nav) */
const SettingsHeading: React.FC<{ title: string; first?: boolean }> = ({
  title,
  first,
}) => (
  <div className={mergeClasses('px-3 pb-1', first ? 'pt-2' : 'pt-3')}>
    <span className="text-[12px] font-semibold text-tertiary">{title}</span>
  </div>
);

/** More section row — label only, no icon (flat list under More), indented right, pinnable to shortcuts */
const MoreFlatRow: React.FC<{
  id: string;
  label: string;
  isActive: boolean;
  onSelect: (id: string) => void;
  onPin?: (id: string) => void;
  onUnpin?: (id: string) => void;
  isPinned?: boolean;
}> = ({ id, label, isActive, onSelect, onPin, onUnpin, isPinned }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={() => onSelect(id)}
    onKeyDown={e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(id);
      }
    }}
    className={mergeClasses(
      'group/more-row flex w-full items-center gap-3 h-9 pl-11 pr-3 py-1 rounded-[12px] transition-colors text-[14px] leading-5 justify-start cursor-pointer',
      isActive
        ? 'bg-secondary font-medium text-primary'
        : 'text-secondary font-normal hover:bg-secondary'
    )}
  >
    <span className="flex-1 text-left truncate">{label}</span>
    {isPinned && onUnpin ? (
      <IconButton
        type="button"
        variant="ghost"
        size="sm"
        icon="unpin"
        aria-label="Unpin"
        className="shrink-0 hidden group-hover/more-row:!flex w-5 h-5 rounded hover:bg-secondary"
        onClick={e => {
          e.stopPropagation();
          onUnpin(id);
        }}
      />
    ) : onPin ? (
      <IconButton
        type="button"
        variant="ghost"
        size="sm"
        icon="pin"
        aria-label="Pin"
        className="shrink-0 hidden group-hover/more-row:!flex w-5 h-5 rounded hover:bg-secondary"
        onClick={e => {
          e.stopPropagation();
          onPin(id);
        }}
      />
    ) : null}
  </div>
);

/** Flat nav item — L1-level item with icon + label + pin-on-hover */
const FlatNavItem: React.FC<{
  id: string;
  label: string;
  iconName: string;
  activeIconName: string;
  isActive: boolean;
  badge?: number;
  onSelect: (id: string) => void;
  isPinnable?: boolean;
  isPinned?: boolean;
  onPin?: (id: string) => void;
  onUnpin?: (id: string) => void;
  isPinnedInstance?: boolean;
}> = ({
  id,
  label,
  iconName,
  activeIconName,
  isActive,
  badge,
  onSelect,
  isPinnable,
  isPinned,
  onPin,
  onUnpin,
  isPinnedInstance,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(id)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(id);
          }
        }}
        className={mergeClasses(
          'flex w-full items-center gap-3 h-9 px-3 py-1 rounded-[12px] transition-colors text-[14px] leading-5 justify-start cursor-pointer',
          isActive
            ? 'bg-secondary font-medium text-primary'
            : 'text-primary font-normal hover:bg-secondary'
        )}
      >
        <Icon
          name={(isActive ? activeIconName : iconName) as IconName}
          size="md"
          className="w-5 h-5 shrink-0"
        />
        <span className="flex-1 text-left truncate">{label}</span>
        {/* Right side: badge or pin actions */}
        {isPinnedInstance ? (
          <IconButton
            type="button"
            variant="ghost"
            size="sm"
            icon={isHovered ? 'unpin' : 'pin'}
            aria-label={isHovered ? 'Unpin' : 'Pinned'}
            className="shrink-0 p-0.5 rounded hover:bg-secondary"
            onClick={e => {
              e.stopPropagation();
              onUnpin?.(id);
            }}
          />
        ) : isPinnable && isHovered && !badge ? (
          <IconButton
            type="button"
            variant="ghost"
            size="sm"
            icon={isPinned ? 'unpin' : 'pin'}
            aria-label={isPinned ? 'Unpin' : 'Pin'}
            className="shrink-0 p-0.5 rounded hover:bg-secondary"
            onClick={e => {
              e.stopPropagation();
              isPinned ? onUnpin?.(id) : onPin?.(id);
            }}
          />
        ) : badge != null && badge > 0 ? (
          <Badge label={String(badge)} variant="secondary" />
        ) : null}
      </div>
    </div>
  );
};

/** Pinned section — shows pinned items (no drag reorder) */
const PinnedFlatSection: React.FC<{
  pinnedItems: FlatNavSectionV5['items'];
  pinnedIds: string[];
  activeId: string;
  onSelect: (id: string) => void;
  onUnpin: (id: string) => void;
}> = ({ pinnedItems, activeId, onSelect, onUnpin }) => {
  if (pinnedItems.length === 0) return null;

  return (
    <div className="flex flex-col gap-0.5 pb-1">
      {pinnedItems.map(item => (
        <FlatNavItem
          key={item.id}
          id={item.id}
          label={item.label}
          iconName={item.iconName}
          activeIconName={item.activeIconName}
          isActive={activeId === item.id}
          badge={item.badge}
          onSelect={onSelect}
          isPinnable={false}
          isPinned
          onUnpin={onUnpin}
          isPinnedInstance
        />
      ))}
      <div className="flex flex-col h-2 items-center justify-center px-3 py-0.5">
        <div className="w-full h-px bg-secondary" />
      </div>
    </div>
  );
};

/* ── V3 Shortcut components ──────────────────────────────────────────── */

const ShortcutItem: React.FC<{
  item: ShortcutItemData;
  isActive: boolean;
  isPinned: boolean;
  onSelect: (id: string) => void;
  onPin?: (id: string) => void;
  onUnpin?: (id: string) => void;
}> = ({ item, isActive, isPinned, onSelect, onPin, onUnpin }) => (
  <div
    role="button"
    tabIndex={0}
    className={mergeClasses(
      'group/shortcut flex items-center gap-3 h-9 px-3 py-1 rounded-[12px] transition-colors cursor-pointer',
      isActive
        ? 'bg-secondary text-primary font-medium'
        : 'text-primary hover:bg-secondary'
    )}
    onClick={() => onSelect(item.id)}
    onKeyDown={e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(item.id);
      }
    }}
  >
    <div className="w-5 h-5 shrink-0 flex items-center justify-center">
      <Icon
        name={isPinned ? 'pin' : 'clock'}
        size="sm"
        className="w-5 h-5 shrink-0 text-tertiary"
        aria-hidden
      />
    </div>
    <span className="flex-1 text-[14px] leading-5 truncate">{item.label}</span>
    {isPinned
      ? onUnpin && (
          <IconButton
            type="button"
            variant="ghost"
            size="sm"
            icon="unpin"
            aria-label="Unpin"
            className="hidden group-hover/shortcut:!flex shrink-0 w-5 h-5 rounded hover:bg-secondary"
            onClick={e => {
              e.stopPropagation();
              onUnpin(item.id);
            }}
          />
        )
      : onPin && (
          <IconButton
            type="button"
            variant="ghost"
            size="sm"
            icon="pin"
            aria-label="Pin"
            className="hidden group-hover/shortcut:!flex shrink-0 w-5 h-5 rounded hover:bg-secondary"
            onClick={e => {
              e.stopPropagation();
              onPin(item.id);
            }}
          />
        )}
  </div>
);

/* ── Agents section ─────────────────────────────────────────────────── */

const SIDEBAR_AGENTS = [
  {
    id: 'clara',
    name: 'Clara',
    avatar: '/ai-avatar.png',
  },
  {
    id: 'dan',
    name: 'Dan',
    avatar: '/ai-avatar.png',
  },
  {
    id: 'maya',
    name: 'Maya',
    avatar: '/ai-avatar.png',
  },
];

const AgentsSection: React.FC<{
  onAgentClick?: (agentId: string) => void;
  onAddAgent?: () => void;
}> = ({ onAgentClick, onAddAgent }) => (
  <div className="flex flex-col mt-5 pt-2 hidden">
    <div className="px-3 pt-3 pb-1">
      <span className="text-[12px] font-semibold text-tertiary leading-[18px]">
        Agents
      </span>
    </div>
    <div className="flex flex-col gap-0.5">
      {SIDEBAR_AGENTS.map(agent => (
        <div
          key={agent.id}
          role="button"
          tabIndex={0}
          onClick={() => onAgentClick?.(agent.id)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onAgentClick?.(agent.id);
            }
          }}
          className="flex items-center gap-3 h-9 px-3 py-1 rounded-[12px] cursor-pointer hover:bg-secondary transition-colors"
        >
          <Avatar
            src={agent.avatar}
            name={agent.name}
            size="sm"
            className="shrink-0"
          />
          <span className="flex-1 text-[14px] leading-5 text-primary truncate">
            {agent.name}
          </span>
        </div>
      ))}
      <button
        type="button"
        onClick={onAddAgent}
        className="flex items-center gap-3 h-9 px-3 py-1 rounded-[12px] cursor-pointer hover:bg-secondary transition-colors text-left w-full"
      >
        <div className="w-[18px] h-[18px] shrink-0 flex items-center justify-center">
          <Icon name="plus" size="sm" aria-hidden />
        </div>
        <span className="text-[14px] leading-5 text-tertiary">Add agent</span>
      </button>
    </div>
  </div>
);

const ShortcutsSection: React.FC<{
  shortcutsDisplay: { item: ShortcutItemData; isPinned: boolean }[];
  activeId: string;
  onSelect: (id: string) => void;
  onPin: (id: string) => void;
  onUnpin: (id: string) => void;
  onManageClick: () => void;
}> = ({
  shortcutsDisplay,
  activeId,
  onSelect,
  onPin,
  onUnpin,
  onManageClick,
}) => {
  if (shortcutsDisplay.length === 0) return null;

  return (
    <div className="flex flex-col mt-5 pt-2">
      <div className="group/shortcuts-header flex items-center justify-between gap-1 px-3 pt-3 pb-1">
        <span className="text-[12px] font-semibold text-tertiary leading-[18px]">
          Shortcuts
        </span>
        <Tooltip
          content="Manage shortcuts"
          side="top"
          sideOffset={6}
          className="!animate-none data-[state=closed]:!animate-none"
        >
          <IconButton
            type="button"
            variant="ghost"
            size="sm"
            icon="dot-menu"
            aria-label="Manage shortcuts"
            onClick={onManageClick}
            className="shrink-0 w-6 h-6 rounded hover:bg-secondary opacity-0 group-hover/shortcuts-header:opacity-100 transition-opacity"
          />
        </Tooltip>
      </div>
      <div className="flex flex-col gap-0.5">
        {shortcutsDisplay.map(({ item, isPinned }) => (
          <ShortcutItem
            key={item.id}
            item={item}
            isActive={activeId === item.id}
            isPinned={isPinned}
            onSelect={onSelect}
            onPin={isPinned ? undefined : onPin}
            onUnpin={isPinned ? onUnpin : undefined}
          />
        ))}
      </div>
    </div>
  );
};

/* ── Sidebar collapse/expand affordance — thin line + tooltip ─────── */

const SidebarAffordance: React.FC<{
  isCollapsed: boolean;
  onToggle: () => void;
}> = ({ isCollapsed, onToggle }) => (
  <div
    onClick={onToggle}
    className="group/affordance relative flex items-center justify-start cursor-pointer shrink-0 z-10"
    style={{ width: 26 }}
  >
    {/* Clickable hit area with thin line */}
    <div className="flex items-center pl-2 pr-4 py-2 h-10 absolute top-1/2 -translate-y-1/2">
      <div
        className={mergeClasses(
          'rounded-[45px] transition-[width,background-color] duration-150',
          'h-6 w-[2px] bg-tertiary',
          'group-hover/affordance:w-1 group-hover/affordance:bg-primary'
        )}
      />
    </div>
    {/* Tooltip */}
    <div className="absolute left-[28px] top-1/2 -translate-y-1/2 opacity-0 group-hover/affordance:opacity-100 transition-opacity duration-150 pointer-events-none z-20">
      <div className="relative flex items-center">
        {/* Tooltip arrow */}
        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-primary shrink-0" />
        {/* Tooltip pill */}
        <div className="bg-[#191b1f] text-[#f7f9fa] text-sm font-medium px-3 py-1.5 rounded-[12px] shadow-md whitespace-nowrap">
          {isCollapsed ? 'Expand' : 'Collapse'}
        </div>
      </div>
    </div>
  </div>
);

/* ── TopBar — full-width bar with logo, search, action icons ────────── */

const TopBar: React.FC<{
  onLogoClick?: () => void;
  isSettings?: boolean;
  onBackToCommunity?: () => void;
}> = ({
  onLogoClick,
  isSettings: _isSettings,
  onBackToCommunity: _onBackToCommunity,
}) => (
  <div className="h-[56px] shrink-0 flex items-center justify-between px-4 border-b border-secondary bg-primary relative">
    {/* Left: Logo */}
    <Button
      variant="ghost"
      onClick={onLogoClick}
      className="flex items-center gap-1.5 shrink-0 hover:opacity-80 transition-opacity p-0 min-w-0 h-auto"
    >
      <img
        src="/images/future-founders-logo.png"
        alt="Logo"
        className="w-[25px] h-[25px] rounded-[12px] shrink-0"
      />
      <span className="text-[14px] font-semibold text-primary">Clarity</span>
    </Button>

    {/* Right: Action icons */}
    <div className="flex items-center gap-2 shrink-0">
      {['bell', 'message', 'people-sparkle', 'bookmark'].map(iconName => (
        <IconButton
          key={iconName}
          type="button"
          variant="ghost"
          icon={iconName as IconName}
          aria-label={iconName}
          className="w-8 h-8 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:bg-secondary"
        />
      ))}
      <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden">
        <img
          src="/images/avatars/1.png"
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <IconButton
        type="button"
        variant="ghost"
        icon="sparkle"
        aria-label="Sparkle"
        className="w-8 h-8 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:bg-secondary"
      />
    </div>
  </div>
);


/* ── Main component ─────────────────────────────────────────────────── */

const SidebarV5: React.FC<SidebarV5Props> = ({
  onItemClick,
  currentSection,
  activeSubItem,
  sidebarOnly = false,
  onBuilderStateChange,
  sidebarCollapsed = false,
  onToggleSidebar,
  onOpenCopilot,
  isCopilotActive = false,
  onAgentClick,
  onLogoClick,
  navVersion: _navVersion = 5,
  onNavVersionChange: _onNavVersionChange,
  navigateTo,
  navigateToCreate,
  onNavigateConsumed,
  navStyle = 'accordion',
  showCollapseAffordance,
}) => {
  /* ── State ─────────────────────────────────────────────────────────── */
  const [activeId, setActiveId] = useState<string>(() =>
    currentSection != null && activeSubItem != null
      ? appRouteToActiveId(currentSection, activeSubItem)
      : 'dashboard'
  );
  const [expandedL1, setExpandedL1] = useState<string | null>(null);
  const [isDetailPage, setIsDetailPage] = useState(false);

  /* ── Pin state (flat nav only) ──────────────────────────────────── */
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);

  /* ── V3 state ────────────────────────────────────────────────────── */
  const [showMore, setShowMore] = useState(false);
  const [v3ShortcutIds, setV3ShortcutIds] = useState<string[]>(() =>
    V3_DEFAULT_SHORTCUT_IDS.slice(0, 3)
  );
  const [shortcutHistoryIds, setShortcutHistoryIds] = useState<string[]>([]);
  const [manageShortcutsOpen, setManageShortcutsOpen] = useState(false);
  const [manageShortcutsDraggedIndex, setManageShortcutsDraggedIndex] =
    useState<number | null>(null);
  const [
    manageShortcutsPinnedDraggedIndex,
    setManageShortcutsPinnedDraggedIndex,
  ] = useState<number | null>(null);
  const manageShortcutsRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const manageShortcutsPinnedRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const SHORTCUT_HISTORY_MAX = 10;
  const [v3ShortcutContext, setV3ShortcutContext] = useState<
    Record<string, 'settings'>
  >({});
  const [v3ActiveSource, setV3ActiveSource] = useState<'nav' | 'shortcut'>(
    'nav'
  );
  const pendingRouteRef = useRef<{
    sectionId: string;
    subItemId?: string;
  } | null>(null);

  /* ── Collapsed hover menu (open on hover, close on leave) ───────────── */
  const [hoveredCollapsedId, setHoveredCollapsedId] = useState<string | null>(
    null
  );
  const collapsedMenuLeaveTimerRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);


  /* ── Derived ───────────────────────────────────────────────────────── */
  const currentTitle = useMemo(
    () =>
      resolveTitle(activeId, navStyle === 'v4' ? adminNavDataV4 : undefined),
    [activeId, navStyle]
  );

  const isContentPage = CONTENT_SECTION_IDS.has(activeId);

  /* ── V3 derived data ─────────────────────────────────────────────── */
  const allAdminItems = useMemo(() => adminNavDataV5.flatMap(z => z.items), []);
  const v3DailyDrivers = useMemo(
    () => allAdminItems.filter(i => V3_DAILY_DRIVER_IDS.includes(i.id)),
    [allAdminItems]
  );
  const v3AdditionalItems = useMemo(
    () => allAdminItems.filter(i => V3_ADDITIONAL_IDS.includes(i.id)),
    [allAdminItems]
  );
  /** Display list: pinned first (unlimited), then history up to historyMax slots. */
  const v3ShortcutsDisplay = useMemo(() => {
    const pinnedCount = v3ShortcutIds.length;
    const historyMax = pinnedCount === 0 ? 5 : pinnedCount === 1 ? 4 : 3;

    const fromPinned = v3ShortcutIds
      .map(id =>
        resolveShortcutItem(id, navStyle === 'v4' ? adminNavDataV4 : undefined)
      )
      .filter((s): s is ShortcutItemData => s !== null)
      .map(item => ({ item, isPinned: true as const }));

    const fromHistory = shortcutHistoryIds
      .filter(id => !v3ShortcutIds.includes(id))
      .slice(0, historyMax)
      .map(id =>
        resolveShortcutItem(id, navStyle === 'v4' ? adminNavDataV4 : undefined)
      )
      .filter((s): s is ShortcutItemData => s !== null)
      .map(item => ({ item, isPinned: false as const }));

    return [...fromPinned, ...fromHistory];
  }, [v3ShortcutIds, shortcutHistoryIds, navStyle]);

  // Primary top-level items that are always visible — never add to history or pin
  const PRIMARY_NAV_IDS = new Set([
    'dashboard',
    'v5-inbox',
    'v5-projects',
    'v5-library',
  ]);

  const addToShortcutHistory = (id: string) => {
    if (PRIMARY_NAV_IDS.has(id)) return; // top-level primary item — skip
    if (v3ShortcutIds.includes(id)) return; // already pinned — skip history
    setShortcutHistoryIds(prev =>
      [id, ...prev.filter(x => x !== id)].slice(0, SHORTCUT_HISTORY_MAX)
    );
  };

  const recentShortcutItems = useMemo(
    () =>
      shortcutHistoryIds
        .filter(id => !v3ShortcutIds.includes(id))
        .map(id =>
          resolveShortcutItem(
            id,
            navStyle === 'v4' ? adminNavDataV4 : undefined
          )
        )
        .filter((s): s is ShortcutItemData => s !== null),
    [shortcutHistoryIds, v3ShortcutIds, navStyle]
  );

  const pinnedShortcutItems = useMemo(
    () =>
      v3ShortcutIds
        .map(id =>
          resolveShortcutItem(
            id,
            navStyle === 'v4' ? adminNavDataV4 : undefined
          )
        )
        .filter((s): s is ShortcutItemData => s !== null),
    [v3ShortcutIds, navStyle]
  );

  const clearShortcutHistory = () => setShortcutHistoryIds([]);
  const clearPinnedShortcuts = () => setV3ShortcutIds([]);
  const removeFromShortcutHistory = (id: string) =>
    setShortcutHistoryIds(prev => prev.filter(x => x !== id));

  const accordionTopItems = useMemo(
    () =>
      ACCORDION_TOP_IDS.map(id => allAdminItems.find(i => i.id === id)).filter(
        (i): i is AdminNavItemV5 => !!i
      ),
    [allAdminItems]
  );
  const accordionManageItems = useMemo(
    () =>
      ACCORDION_MANAGE_IDS.map(id =>
        allAdminItems.find(i => i.id === id)
      ).filter((i): i is AdminNavItemV5 => !!i),
    [allAdminItems]
  );
  const accordionShowMoreItems = useMemo(
    () =>
      ACCORDION_SHOW_MORE_IDS.map(id =>
        allAdminItems.find(i => i.id === id)
      ).filter((i): i is AdminNavItemV5 => !!i),
    [allAdminItems]
  );

  /* ── V4 derived data ─────────────────────────────────────────────── */
  const allV4Items = useMemo(() => adminNavDataV4.flatMap(z => z.items), []);
  const v4DailyDrivers = useMemo(
    () =>
      V4_DAILY_DRIVER_IDS.map(id => allV4Items.find(i => i.id === id)).filter(
        (i): i is AdminNavItemV5 => !!i
      ),
    [allV4Items]
  );
  const v4ManageVisible = useMemo(
    () =>
      V4_MANAGE_VISIBLE_IDS.map(id => allV4Items.find(i => i.id === id)).filter(
        (i): i is AdminNavItemV5 => !!i
      ),
    [allV4Items]
  );
  const v4ManageMore = useMemo(
    () =>
      V4_MANAGE_MORE_IDS.map(id => allV4Items.find(i => i.id === id)).filter(
        (i): i is AdminNavItemV5 => !!i
      ),
    [allV4Items]
  );

  /** Flat list for More section: L1 + all their children as same-level rows (no icons) */
  const v3AdditionalItemsFlat = useMemo(() => {
    return v3AdditionalItems.flatMap(item => {
      const landingOrFirst =
        item.landingId || item.children?.[0]?.id || item.id;
      const rows: { id: string; label: string }[] = [
        { id: landingOrFirst, label: item.label },
      ];
      if (item.children?.length)
        item.children.forEach(c => rows.push({ id: c.id, label: c.label }));
      return rows;
    });
  }, [v3AdditionalItems]);

  const v4ManageMoreFlat = useMemo(() => {
    return v4ManageMore.flatMap(item => {
      const landingOrFirst =
        item.landingId || item.children?.[0]?.id || item.id;
      const rows: { id: string; label: string }[] = [
        { id: landingOrFirst, label: item.label },
      ];
      if (item.children?.length)
        item.children.forEach(c => rows.push({ id: c.id, label: c.label }));
      return rows;
    });
  }, [v4ManageMore]);

  const accordionShowMoreItemsFlat = useMemo(() => {
    return accordionShowMoreItems.flatMap(item => {
      const landingOrFirst =
        item.landingId || item.children?.[0]?.id || item.id;
      const rows: { id: string; label: string }[] = [
        { id: landingOrFirst, label: item.label },
      ];
      if (item.children?.length)
        item.children.forEach(c => rows.push({ id: c.id, label: c.label }));
      return rows;
    });
  }, [accordionShowMoreItems]);

  const objectName = useMemo(() => {
    const map: Record<string, string> = {
      events: 'event',
      'courses-list': 'course',
      lessons: 'lesson',
      pages: 'page',
      spaces: 'space',
      posts: 'post',
      broadcasts: 'broadcast',
      forms: 'form',
      'paywalls-list': 'paywall',
      coupons: 'coupon',
      'all-agents': 'agent',
      'all-workflows': 'workflow',
      topics: 'topic',
      moderation: 'rule',
    };
    return map[activeId] || currentTitle.replace(/s$/, '').toLowerCase();
  }, [activeId, currentTitle]);

  /* ── Handlers ──────────────────────────────────────────────────────── */

  const notifyItemClick = (id: string) => {
    const route = activeIdToAppRoute(id);
    pendingRouteRef.current = {
      sectionId: route.sectionId,
      subItemId: route.subItemId,
    };
    onItemClick?.(route.sectionId, route.subItemId);
  };

  const handleAdminL1Select = (id: string) => {
    const dataSource = navStyle === 'v4' ? adminNavDataV4 : adminNavDataV5;
    const item = dataSource.flatMap(z => z.items).find(i => i.id === id);
    if (!item) return;

    if (navStyle === 'v3' || navStyle === 'v4') setV3ActiveSource('nav');

    if (item.children && item.children.length > 0) {
      const effectiveId = item.landingId || item.children[0].id;
      setShowMore(false);
      setExpandedL1(id);
      setActiveId(effectiveId);
      setIsDetailPage(false);
      addToShortcutHistory(effectiveId);
      notifyItemClick(effectiveId);
    } else {
      const effectiveId = item.landingId || id;
      setExpandedL1(null);
      setActiveId(effectiveId);
      setIsDetailPage(false);
      addToShortcutHistory(effectiveId);
      notifyItemClick(effectiveId);
    }
  };

  const handleChildSelect = (childId: string) => {
    if (navStyle === 'v3' || navStyle === 'v4') setV3ActiveSource('nav');
    setActiveId(childId);
    setIsDetailPage(false);
    addToShortcutHistory(childId);
    notifyItemClick(childId);
  };

  const handleSwitchToSettings = () => {
    onItemClick?.('settings');
  };

  const handleCreateNew = () => {
    setIsDetailPage(true);
  };

  const handleBackToList = () => {
    setIsDetailPage(false);
  };

  const handleFlatItemSelect = (id: string) => {
    setActiveId(id);
    setIsDetailPage(false);
    addToShortcutHistory(id);
    notifyItemClick(id);
  };

  /* ── Pin handlers ─────────────────────────────────────────────────── */
  const handlePin = (id: string) => {
    setPinnedIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleUnpin = (id: string) => {
    setPinnedIds(prev => prev.filter(pid => pid !== id));
  };

  /* ── V3 shortcut handlers ────────────────────────────────────────── */
  const handleV3Pin = (id: string) => {
    if (PRIMARY_NAV_IDS.has(id)) return; // primary items can't be pinned
    setV3ShortcutIds(prev => (prev.includes(id) ? prev : [...prev, id]));
    setShortcutHistoryIds(prev => prev.filter(hid => hid !== id));
  };

  const handleV3Unpin = (id: string) => {
    setV3ShortcutIds(prev => prev.filter(sid => sid !== id));
    setV3ShortcutContext(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleV3ShortcutSelect = (id: string) => {
    setV3ActiveSource('shortcut');
    setActiveId(id);
    setIsDetailPage(false);
    if (v3ShortcutContext[id] === 'settings') {
      pendingRouteRef.current = { sectionId: 'settings', subItemId: id };
      onItemClick?.('settings', id);
    } else {
      notifyItemClick(id);
    }
  };

  /** Resolve pinned IDs to full flat nav item objects */
  const pinnedItems = useMemo(() => {
    const itemMap = new Map<string, FlatNavSectionV5['items'][0]>();
    for (const section of flatNavDataV5) {
      for (const item of section.items) {
        itemMap.set(item.id, item);
      }
    }
    return pinnedIds
      .map(id => itemMap.get(id))
      .filter((i): i is FlatNavSectionV5['items'][0] => !!i);
  }, [pinnedIds]);

  /** Collapsed sidebar: top + Manage (Spaces, Workflows, Marketing, Paywalls, Branded app) + More icon + Configure */
  const collapsedPrimaryItems = useMemo(() => {
    if (navStyle === 'flat') {
      const first = flatNavDataV5[0];
      return first?.items ?? [];
    }
    if (navStyle === 'v4') return v4DailyDrivers;
    if (navStyle === 'v3') return v3DailyDrivers;
    return [...accordionTopItems, ...accordionManageItems];
  }, [
    navStyle,
    accordionTopItems,
    accordionManageItems,
    v3DailyDrivers,
    v4DailyDrivers,
  ]);

  /* ── Auto-expand the L1 containing the active child ────────────────── */
  useEffect(() => {
    // In V3/V4, don't auto-expand when selection came from shortcuts
    if (
      (navStyle === 'v3' || navStyle === 'v4') &&
      v3ActiveSource === 'shortcut'
    )
      return;
    const parent = findParentL1(
      activeId,
      navStyle === 'v4' ? adminNavDataV4 : undefined
    );
    if (parent && parent.children) {
      setExpandedL1(parent.id);
    }
  }, [activeId, navStyle, v3ActiveSource]);

  /* ── Sync activeId from app route when sidebarOnly / controlled ─────── */
  useEffect(() => {
    if (currentSection == null && activeSubItem == null) return;
    const fromRoute = appRouteToActiveId(currentSection ?? '', activeSubItem);
    const pending = pendingRouteRef.current;
    if (pending) {
      if (
        currentSection === pending.sectionId &&
        (activeSubItem ?? undefined) === (pending.subItemId ?? undefined)
      ) {
        setActiveId(prev => (prev !== fromRoute ? fromRoute : prev));
        pendingRouteRef.current = null;
      }
    } else {
      setActiveId(prev => (prev !== fromRoute ? fromRoute : prev));
    }
  }, [currentSection, activeSubItem]);

  /* ── V3/V4: Auto-expand "Show more" when active item is in hidden section ── */
  useEffect(() => {
    if (navStyle !== 'v3' && navStyle !== 'v4') return;
    const itemsToCheck = navStyle === 'v4' ? v4ManageMore : v3AdditionalItems;
    const isInHidden = itemsToCheck.some(
      item =>
        item.id === activeId ||
        item.landingId === activeId ||
        item.children?.some(c => c.id === activeId)
    );
    if (isInHidden) setShowMore(true);
  }, [activeId, navStyle, v3AdditionalItems, v4ManageMore]);

  /* ── External navigation (from Command Center) ─────────────────────── */
  useEffect(() => {
    if (navigateTo) {
      setActiveId(navigateTo);
      if (navigateToCreate) {
        setIsDetailPage(true);
      } else {
        setIsDetailPage(false);
      }
      const parent = findParentL1(
        navigateTo,
        navStyle === 'v4' ? adminNavDataV4 : undefined
      );
      if (parent && parent.children) {
        setExpandedL1(parent.id);
      }
      onNavigateConsumed?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigateTo, navigateToCreate]);

  /* ── Notify parent about builder state ─────────────────────────────── */
  useEffect(() => {
    if (isDetailPage) {
      onBuilderStateChange?.({
        isBuilder: true,
        parentTitle: currentTitle,
        objectTitle: `New ${objectName}`,
        onBack: handleBackToList,
      });
    } else {
      onBuilderStateChange?.({
        isBuilder: false,
        parentTitle: '',
        objectTitle: currentTitle,
        onBack: () => undefined,
        isContentPage,
        onCreateNew: handleCreateNew,
        isSettingsSection: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDetailPage, currentTitle, objectName, isContentPage]);

  /* ── Render ────────────────────────────────────────────────────────── */

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {!sidebarOnly && (
        <TopBar
          onLogoClick={onLogoClick}
          isSettings={false}
          onBackToCommunity={onLogoClick}
        />
      )}

      {/* ── Sidebar + (optional) Content row ─────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar — when sidebarOnly always 262px and expanded; otherwise can collapse ── */}
        <aside
          className={mergeClasses(
            'flex flex-col h-full shrink-0 overflow-hidden',
            'transition-[width] duration-300 ease-out'
          )}
          style={{
            width: sidebarOnly
              ? isCopilotActive || sidebarCollapsed
                ? 60
                : 262
              : sidebarCollapsed
                ? 60
                : 262,
          }}
        >
          {sidebarCollapsed || (sidebarOnly && isCopilotActive) ? (
            /* ── Collapsed: Stripe-style — spaced icons with flyout menus ── */
            <>
              <nav className="flex-1 overflow-y-auto p-3">
                <div className="flex flex-col items-center">
                  {/* Top-level items (daily drivers) */}
                  {(() => {
                    const topIds =
                      navStyle === 'v4'
                        ? V4_DAILY_DRIVER_IDS
                        : navStyle === 'v3'
                          ? V3_DAILY_DRIVER_IDS
                          : ACCORDION_TOP_IDS;
                    const topItems = collapsedPrimaryItems.filter(
                      (item: AdminNavItemV5) => topIds.includes(item.id)
                    );
                    const manageItems = collapsedPrimaryItems.filter(
                      (item: AdminNavItemV5) => !topIds.includes(item.id)
                    );

                    const renderCollapsedItem = (item: AdminNavItemV5, isManageItem = false) => {
                      const isActive =
                        activeId === item.id || activeId === item.landingId;
                      const hasActiveChild =
                        item.children?.some(
                          (c: AdminNavChildV5) => c.id === activeId
                        ) ?? false;
                      const showBg = isActive || hasActiveChild;
                      const iName =
                        isActive || hasActiveChild
                          ? item.activeIconName || item.iconName
                          : item.iconName;
                      const hasDropdown =
                        item.children && item.children.length > 0;

                      // Hover-based menu for manage section items
                      if (hasDropdown && navStyle !== 'flat' && isManageItem) {
                        return (
                          <div key={item.id}>
                            <CollapsedManageItem
                              item={item}
                              iName={iName}
                              showBg={showBg}
                              onChildSelect={handleChildSelect}
                            />
                          </div>
                        );
                      }

                      // Hover-based flyout for top-section items
                      if (hasDropdown && navStyle !== 'flat') {
                        return (
                          <div
                            key={item.id}
                            className="relative"
                            onMouseEnter={() => {
                              if (collapsedMenuLeaveTimerRef.current) {
                                clearTimeout(
                                  collapsedMenuLeaveTimerRef.current
                                );
                                collapsedMenuLeaveTimerRef.current = null;
                              }
                              setHoveredCollapsedId(item.id);
                            }}
                            onMouseLeave={() => {
                              collapsedMenuLeaveTimerRef.current = setTimeout(
                                () => setHoveredCollapsedId(null),
                                150
                              );
                            }}
                          >
                            <Popover
                              open={hoveredCollapsedId === item.id}
                              onOpenChange={open => {
                                if (!open) setHoveredCollapsedId(null);
                              }}
                              side="right"
                              sideOffset={8}
                              align="start"
                              trigger={
                                <div className="flex">
                                  <IconButton
                                    type="button"
                                    variant="ghost"
                                    icon={iName as IconName}
                                    aria-label={item.label}
                                    aria-haspopup="menu"
                                    className={mergeClasses(
                                      'w-9 h-9 rounded-[12px] transition-colors',
                                      showBg
                                        ? 'bg-secondary'
                                        : 'hover:bg-secondary'
                                    )}
                                  />
                                </div>
                              }
                              className="transition-opacity duration-150 ease-out data-[closed]:opacity-0 data-[enter]:opacity-100"
                            >
                              <div
                                className="-mx-4 -my-4 w-max py-1"
                                onMouseEnter={() => {
                                  if (collapsedMenuLeaveTimerRef.current) {
                                    clearTimeout(
                                      collapsedMenuLeaveTimerRef.current
                                    );
                                    collapsedMenuLeaveTimerRef.current = null;
                                  }
                                }}
                                onMouseLeave={() => {
                                  collapsedMenuLeaveTimerRef.current =
                                    setTimeout(
                                      () => setHoveredCollapsedId(null),
                                      150
                                    );
                                }}
                              >
                                <div className="px-3 pt-1.5 pb-1">
                                  <Typography
                                    variant="label-xs"
                                    color="tertiary"
                                    className="text-[11px]"
                                  >
                                    {item.label}
                                  </Typography>
                                </div>
                                {(item.children ?? []).map(
                                  (child: AdminNavChildV5) => (
                                    <Button
                                      key={child.id}
                                      type="button"
                                      variant="ghost"
                                      className={mergeClasses(
                                        'w-full justify-start rounded-lg px-3 py-2 text-[14px]',
                                        activeId === child.id
                                          ? 'bg-secondary font-medium'
                                          : ''
                                      )}
                                      onClick={() => {
                                        handleChildSelect(child.id);
                                        setHoveredCollapsedId(null);
                                      }}
                                    >
                                      {child.label}
                                    </Button>
                                  )
                                )}
                              </div>
                            </Popover>
                          </div>
                        );
                      }

                      // Simple item with tooltip on hover
                      return (
                        <Tooltip
                          key={item.id}
                          content={item.label}
                          side="right"
                          sideOffset={8}
                        >
                          <IconButton
                            type="button"
                            variant="ghost"
                            icon={iName as IconName}
                            aria-label={item.label}
                            onClick={() =>
                              navStyle === 'flat'
                                ? handleFlatItemSelect(item.id)
                                : handleAdminL1Select(item.id)
                            }
                            className={mergeClasses(
                              'w-9 h-9 rounded-[12px] transition-colors',
                              showBg ? 'bg-secondary' : 'hover:bg-secondary'
                            )}
                          />
                        </Tooltip>
                      );
                    };

                    return (
                      <>
                        {/* Top group */}
                        <div className="flex flex-col gap-2 items-center w-full">
                          {topItems.map(item => renderCollapsedItem(item))}
                        </div>

                        {/* Separator + Recent chats icon */}
                        {!isCopilotActive && (
                          <>
                            <div className="flex items-center justify-center w-full my-2">
                              <div className="w-9 h-px bg-secondary" />
                            </div>
                            <Tooltip content="Recent chats" side="right" sideOffset={8}>
                              <IconButton
                                type="button"
                                variant="ghost"
                                icon={'clock-dash' as IconName}
                                aria-label="Recent chats"
                                onClick={() => onOpenCopilot?.()}
                                className="w-9 h-9 rounded-[12px] hover:bg-secondary"
                              />
                            </Tooltip>
                          </>
                        )}

                        {/* Separator + Build group */}
                        {!isCopilotActive && manageItems.length > 0 && (
                          <>
                            <div className="flex items-center justify-center w-full my-2">
                              <div className="w-9 h-px bg-secondary" />
                            </div>
                            <div className="flex flex-col gap-2 items-center w-full">
                              {manageItems.map(item => renderCollapsedItem(item, true))}
                            </div>
                            {/* More — mega menu */}
                            {(() => {
                              const moreGroupItems =
                                navStyle === 'v4'
                                  ? v4ManageMore
                                  : navStyle === 'v3'
                                    ? v3AdditionalItems
                                    : accordionShowMoreItems;
                              return (
                                <CollapsedMoreMenu
                                  moreGroupItems={moreGroupItems}
                                  onChildSelect={handleChildSelect}
                                />
                              );
                            })()}
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>
              </nav>
              {/* Bottom: Avatar + Collapse */}
              <div className="shrink-0 px-3 pb-3 pt-2 flex flex-col gap-2 items-center">
                <Tooltip content="Rudy" side="right" sideOffset={8}>
                  <div className="w-9 h-9 flex items-center justify-center cursor-pointer">
                    <Avatar size="xs" />
                  </div>
                </Tooltip>
                <Tooltip content="Collapse sidebar" side="right" sideOffset={8}>
                  <IconButton
                    type="button"
                    variant="ghost"
                    icon={'layout-left' as IconName}
                    aria-label="Expand sidebar"
                    onClick={onToggleSidebar}
                    className="w-9 h-9 rounded-[12px] hover:bg-secondary"
                  />
                </Tooltip>
              </div>
            </>
          ) : navStyle === 'flat' ? (
            /* ── Expanded flat: settings-style headings + items + pin ──── */
            <>
              <nav className="flex-1 overflow-y-auto px-3 pt-3">
                <div className="flex flex-col gap-0.5">
                  {flatNavDataV5.map((section, sIdx) => {
                    const prevZone =
                      sIdx > 0 ? flatNavDataV5[sIdx - 1].zone : section.zone;
                    const showSeparator = sIdx > 0 && section.zone !== prevZone;

                    return (
                      <React.Fragment
                        key={section.heading || `standalone-${sIdx}`}
                      >
                        {showSeparator && (
                          <div className="flex flex-col h-2 items-center justify-center px-3 py-0.5">
                            <div className="w-full h-px bg-secondary" />
                          </div>
                        )}
                        {section.heading && (
                          <SettingsHeading
                            title={section.heading}
                            first={sIdx === 0}
                          />
                        )}
                        {section.items.map(item => (
                          <FlatNavItem
                            key={item.id}
                            id={item.id}
                            label={item.label}
                            iconName={item.iconName}
                            activeIconName={item.activeIconName}
                            isActive={activeId === item.id}
                            badge={item.badge}
                            onSelect={handleFlatItemSelect}
                            isPinnable
                            isPinned={pinnedIds.includes(item.id)}
                            onPin={handlePin}
                            onUnpin={handleUnpin}
                          />
                        ))}
                        {/* Pinned section — appears right after first section (Dashboard + Inbox) */}
                        {sIdx === 0 && pinnedItems.length > 0 && (
                          <PinnedFlatSection
                            pinnedItems={pinnedItems}
                            pinnedIds={pinnedIds}
                            activeId={activeId}
                            onSelect={handleFlatItemSelect}
                            onUnpin={handleUnpin}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </nav>

              {/* Bottom: Divider + Settings trigger */}
              <div className="shrink-0 px-3 pb-3">
                <div className="flex items-center justify-center py-2">
                  <div className="w-full h-px bg-secondary" />
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleSwitchToSettings}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSwitchToSettings();
                    }
                  }}
                  className="flex w-full items-center gap-3 h-9 px-3 py-1 rounded-[12px] transition-colors text-[14px] leading-5 text-primary font-normal hover:bg-secondary justify-start cursor-pointer"
                >
                  <Icon
                    name={'settings-gear' as IconName}
                    size="md"
                    className="w-5 h-5 shrink-0"
                  />
                  <span className="flex-1 text-left truncate whitespace-nowrap">
                    Configure
                  </span>
                </div>
              </div>
            </>
          ) : navStyle === 'v3' ? (
            /* ── Expanded V3: daily drivers + show more/less + shortcuts ── */
            <>
              <nav className="flex-1 overflow-y-auto p-3">
                <div className="flex flex-col gap-0.5">
                  {sidebarOnly && onOpenCopilot && (
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => onOpenCopilot?.()}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onOpenCopilot();
                        }
                      }}
                      className={mergeClasses(
                        'flex items-center gap-3 h-9 px-3 py-1 rounded-[12px] transition-colors cursor-pointer',
                        isCopilotActive
                          ? 'bg-secondary text-primary font-medium'
                          : 'text-primary hover:bg-secondary'
                      )}
                    >
                      <Icon
                        name="message"
                        size="sm"
                        className="w-5 h-5 shrink-0 text-tertiary"
                        aria-hidden
                      />
                      <span className="text-[14px] leading-5 truncate">
                        Recent chats
                      </span>
                    </div>
                  )}
                  {/* Daily Drivers — always visible */}
                  {v3DailyDrivers.map(item => {
                    const isExpanded = expandedL1 === item.id;
                    const isActive =
                      v3ActiveSource === 'nav' &&
                      (activeId === item.id || activeId === item.landingId);
                    const hasActiveChild =
                      v3ActiveSource === 'nav' &&
                      (item.children?.some(c => c.id === activeId) ?? false);

                    return (
                      <React.Fragment key={item.id}>
                        <AdminL1Item
                          item={item}
                          isExpanded={isExpanded}
                          isActive={isActive}
                          hasActiveChild={hasActiveChild}
                          showChevron={
                            !!(item.children && item.children.length > 0)
                          }
                          onSelect={handleAdminL1Select}
                        />
                        {item.children && item.children.length > 0 && (
                          <div
                            className={mergeClasses(
                              'grid transition-[grid-template-rows] duration-[100ms] ease-out',
                              isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                            )}
                          >
                            <div className="overflow-hidden">
                              <div className="flex flex-col gap-0.5 pb-1">
                                {item.children.map((child, idx) => (
                                  <div
                                    key={child.id}
                                    className={mergeClasses(
                                      'transition-opacity duration-[100ms] ease-out',
                                      isExpanded ? 'opacity-100' : 'opacity-0'
                                    )}
                                    style={
                                      isExpanded
                                        ? { transitionDelay: `${idx * 50}ms` }
                                        : undefined
                                    }
                                  >
                                    <AdminChildItem
                                      child={child}
                                      isActive={
                                        v3ActiveSource === 'nav' &&
                                        activeId === child.id
                                      }
                                      onSelect={handleChildSelect}
                                      onPin={
                                        v3ShortcutIds.includes(child.id)
                                          ? undefined
                                          : handleV3Pin
                                      }
                                      onUnpin={
                                        v3ShortcutIds.includes(child.id)
                                          ? () => handleV3Unpin(child.id)
                                          : undefined
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}

                  {/* More — stays at top, content expands below (flat, no icons); only one accordion open at a time */}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setExpandedL1(null);
                      setShowMore(!showMore);
                    }}
                    className="flex w-full items-center gap-3 h-9 px-3 py-1 text-[14px] text-primary hover:text-primary hover:bg-secondary transition-colors justify-start"
                  >
                    <Icon
                      name="dot-menu"
                      size="sm"
                      className="w-4 h-4 shrink-0"
                      aria-hidden
                    />
                    <span className="flex-1 text-left">More</span>
                    <Icon
                      name="chevron-down"
                      size="sm"
                      className={mergeClasses(
                        'w-4 h-4 shrink-0 text-tertiary transition-transform duration-200',
                        showMore ? 'rotate-0' : '-rotate-90'
                      )}
                      aria-hidden
                    />
                  </Button>
                  <div
                    className={mergeClasses(
                      'grid transition-[grid-template-rows] duration-200 ease-out',
                      showMore ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="flex flex-col gap-0.5">
                        {v3AdditionalItemsFlat.map(({ id, label }) => (
                          <MoreFlatRow
                            key={id}
                            id={id}
                            label={label}
                            isActive={
                              v3ActiveSource === 'nav' && activeId === id
                            }
                            onSelect={handleChildSelect}
                            onPin={
                              v3ShortcutIds.includes(id)
                                ? undefined
                                : handleV3Pin
                            }
                            onUnpin={
                              v3ShortcutIds.includes(id)
                                ? () => handleV3Unpin(id)
                                : undefined
                            }
                            isPinned={v3ShortcutIds.includes(id)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Agents section */}
                  <AgentsSection onAgentClick={onAgentClick} />

                  {/* Shortcuts section */}
                  <ShortcutsSection
                    shortcutsDisplay={v3ShortcutsDisplay}
                    activeId={v3ActiveSource === 'shortcut' ? activeId : ''}
                    onSelect={handleV3ShortcutSelect}
                    onPin={handleV3Pin}
                    onUnpin={handleV3Unpin}
                    onManageClick={() => setManageShortcutsOpen(true)}
                  />
                </div>
              </nav>

              {/* Bottom: Settings trigger */}
              <div className="shrink-0 px-3 pb-3">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleSwitchToSettings}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSwitchToSettings();
                    }
                  }}
                  className="flex w-full items-center gap-3 h-9 px-3 py-1 rounded-[12px] transition-colors text-[14px] leading-5 text-primary font-normal hover:bg-secondary justify-start cursor-pointer"
                >
                  <Icon
                    name={'settings-gear' as IconName}
                    size="md"
                    className="w-5 h-5 shrink-0"
                  />
                  <span className="flex-1 text-left truncate whitespace-nowrap">
                    Configure
                  </span>
                </div>
              </div>
            </>
          ) : navStyle === 'v4' ? (
            /* ── Expanded V4: daily drivers + shortcuts + manage section ── */
            <>
              <nav className="flex-1 overflow-y-auto p-3">
                <div className="flex flex-col gap-0.5">
                  {sidebarOnly && onOpenCopilot && (
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => onOpenCopilot?.()}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onOpenCopilot();
                        }
                      }}
                      className={mergeClasses(
                        'flex items-center gap-3 h-9 px-3 py-1 rounded-[12px] transition-colors cursor-pointer',
                        isCopilotActive
                          ? 'bg-secondary text-primary font-medium'
                          : 'text-primary hover:bg-secondary'
                      )}
                    >
                      <Icon
                        name="message"
                        size="sm"
                        className="w-5 h-5 shrink-0 text-tertiary"
                        aria-hidden
                      />
                      <span className="text-[14px] leading-5 truncate">
                        Recent chats
                      </span>
                    </div>
                  )}
                  {/* ── Daily Drivers — always visible ── */}
                  {v4DailyDrivers.map(item => {
                    const isExpanded = expandedL1 === item.id;
                    const isActive =
                      v3ActiveSource === 'nav' &&
                      (activeId === item.id || activeId === item.landingId);
                    const hasActiveChild =
                      v3ActiveSource === 'nav' &&
                      (item.children?.some(c => c.id === activeId) ?? false);

                    return (
                      <React.Fragment key={item.id}>
                        <AdminL1Item
                          item={item}
                          isExpanded={isExpanded}
                          isActive={isActive}
                          hasActiveChild={hasActiveChild}
                          showChevron={
                            !!(item.children && item.children.length > 0)
                          }
                          onSelect={handleAdminL1Select}
                        />
                        {item.children && item.children.length > 0 && (
                          <div
                            className={mergeClasses(
                              'grid transition-[grid-template-rows] duration-[100ms] ease-out',
                              isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                            )}
                          >
                            <div className="overflow-hidden">
                              <div className="flex flex-col gap-0.5 pb-1">
                                {item.children.map((child, idx) => (
                                  <div
                                    key={child.id}
                                    className={mergeClasses(
                                      'transition-opacity duration-[100ms] ease-out',
                                      isExpanded ? 'opacity-100' : 'opacity-0'
                                    )}
                                    style={
                                      isExpanded
                                        ? { transitionDelay: `${idx * 50}ms` }
                                        : undefined
                                    }
                                  >
                                    <AdminChildItem
                                      child={child}
                                      isActive={
                                        v3ActiveSource === 'nav' &&
                                        activeId === child.id
                                      }
                                      onSelect={handleChildSelect}
                                      onPin={
                                        v3ShortcutIds.includes(child.id)
                                          ? undefined
                                          : handleV3Pin
                                      }
                                      onUnpin={
                                        v3ShortcutIds.includes(child.id)
                                          ? () => handleV3Unpin(child.id)
                                          : undefined
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}

                  {/* Agents section */}
                  <AgentsSection onAgentClick={onAgentClick} />

                  {/* ── Shortcuts section — BEFORE Products in V4 ── */}
                  <ShortcutsSection
                    shortcutsDisplay={v3ShortcutsDisplay}
                    activeId={v3ActiveSource === 'shortcut' ? activeId : ''}
                    onSelect={handleV3ShortcutSelect}
                    onPin={handleV3Pin}
                    onUnpin={handleV3Unpin}
                    onManageClick={() => setManageShortcutsOpen(true)}
                  />

                  {/* ── Manage section label ── */}
                  <div className="px-3 pt-5 mt-3 pb-1">
                    <span className="text-[12px] font-semibold text-tertiary leading-[18px]">
                      Manage
                    </span>
                  </div>

                  {/* ── Visible Manage items — Community, AI & Workflows, Marketing, Payments, Branded apps ── */}
                  {v4ManageVisible.map(item => {
                    const isExpanded = expandedL1 === item.id;
                    const isActive =
                      v3ActiveSource === 'nav' &&
                      (activeId === item.id || activeId === item.landingId);
                    const hasActiveChild =
                      v3ActiveSource === 'nav' &&
                      (item.children?.some(c => c.id === activeId) ?? false);

                    return (
                      <React.Fragment key={item.id}>
                        <AdminL1Item
                          item={item}
                          isExpanded={isExpanded}
                          isActive={isActive}
                          hasActiveChild={hasActiveChild}
                          showChevron={
                            !!(item.children && item.children.length > 0)
                          }
                          onSelect={handleAdminL1Select}
                        />
                        {item.children && item.children.length > 0 && (
                          <div
                            className={mergeClasses(
                              'grid transition-[grid-template-rows] duration-[100ms] ease-out',
                              isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                            )}
                          >
                            <div className="overflow-hidden">
                              <div className="flex flex-col gap-0.5 pb-1">
                                {item.children.map((child, idx) => (
                                  <div
                                    key={child.id}
                                    className={mergeClasses(
                                      'transition-opacity duration-[100ms] ease-out',
                                      isExpanded ? 'opacity-100' : 'opacity-0'
                                    )}
                                    style={
                                      isExpanded
                                        ? { transitionDelay: `${idx * 50}ms` }
                                        : undefined
                                    }
                                  >
                                    <AdminChildItem
                                      child={child}
                                      isActive={
                                        v3ActiveSource === 'nav' &&
                                        activeId === child.id
                                      }
                                      onSelect={handleChildSelect}
                                      onPin={
                                        v3ShortcutIds.includes(child.id)
                                          ? undefined
                                          : handleV3Pin
                                      }
                                      onUnpin={
                                        v3ShortcutIds.includes(child.id)
                                          ? () => handleV3Unpin(child.id)
                                          : undefined
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}

                  {/* ── More — stays at top, content expands below (flat, no icons); only one accordion open at a time ── */}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setExpandedL1(null);
                      setShowMore(!showMore);
                    }}
                    className="flex w-full items-center gap-3 h-9 px-3 py-1 text-[14px] text-primary hover:text-primary hover:bg-secondary transition-colors justify-start"
                  >
                    <Icon
                      name="dot-menu"
                      size="sm"
                      className="w-4 h-4 shrink-0"
                      aria-hidden
                    />
                    <span className="flex-1 text-left">More</span>
                    <Icon
                      name="chevron-down"
                      size="sm"
                      className={mergeClasses(
                        'w-4 h-4 shrink-0 text-tertiary transition-transform duration-200',
                        showMore ? 'rotate-0' : '-rotate-90'
                      )}
                      aria-hidden
                    />
                  </Button>
                  <div
                    className={mergeClasses(
                      'grid transition-[grid-template-rows] duration-200 ease-out',
                      showMore ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="flex flex-col gap-0.5">
                        {v4ManageMoreFlat.map(({ id, label }) => (
                          <MoreFlatRow
                            key={id}
                            id={id}
                            label={label}
                            isActive={
                              v3ActiveSource === 'nav' && activeId === id
                            }
                            onSelect={handleChildSelect}
                            onPin={
                              v3ShortcutIds.includes(id)
                                ? undefined
                                : handleV3Pin
                            }
                            onUnpin={
                              v3ShortcutIds.includes(id)
                                ? () => handleV3Unpin(id)
                                : undefined
                            }
                            isPinned={v3ShortcutIds.includes(id)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </nav>

              {/* Bottom: Settings trigger */}
              <div className="shrink-0 px-3 pb-3">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleSwitchToSettings}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSwitchToSettings();
                    }
                  }}
                  className="flex w-full items-center gap-3 h-9 px-3 py-1 rounded-[12px] transition-colors text-[14px] leading-5 text-primary font-normal hover:bg-secondary justify-start cursor-pointer"
                >
                  <Icon
                    name={'settings-gear' as IconName}
                    size="md"
                    className="w-5 h-5 shrink-0"
                  />
                  <span className="flex-1 text-left truncate whitespace-nowrap">
                    Configure
                  </span>
                </div>
              </div>
            </>
          ) : (
            /* ── Expanded accordion: Top → Recent Chats → Build → More → Bottom ── */
            <>
              <nav className="flex-1 overflow-y-auto p-3">
                <div className="flex flex-col gap-0.5">
                  {/* Top section: no pin/unpin */}
                  {accordionTopItems.map(item => {
                    const isExpanded = expandedL1 === item.id;
                    const isActive =
                      activeId === item.id || activeId === item.landingId;
                    const hasActiveChild =
                      item.children?.some(c => c.id === activeId) ?? false;
                    return (
                      <React.Fragment key={item.id}>
                        <AdminL1Item
                          item={item}
                          isExpanded={isExpanded}
                          isActive={isActive}
                          hasActiveChild={hasActiveChild}
                          showChevron={!!item.children?.length}
                          onSelect={handleAdminL1Select}
                        />
                        {item.children && item.children.length > 0 && (
                          <div
                            className={mergeClasses(
                              'grid transition-[grid-template-rows] duration-[100ms] ease-out',
                              isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                            )}
                          >
                            <div className="overflow-hidden">
                              <div className="flex flex-col gap-0.5 pb-1">
                                {item.children.map((child, idx) => (
                                  <div
                                    key={child.id}
                                    className={mergeClasses(
                                      'transition-opacity duration-[100ms] ease-out',
                                      isExpanded ? 'opacity-100' : 'opacity-0'
                                    )}
                                    style={
                                      isExpanded
                                        ? {
                                            transitionDelay: `${idx * 50}ms`,
                                          }
                                        : undefined
                                    }
                                  >
                                    <AdminChildItem
                                      child={child}
                                      isActive={activeId === child.id}
                                      onSelect={handleChildSelect}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}

                  {/* Agents section */}
                  <AgentsSection onAgentClick={onAgentClick} />

                  {/* ── Recent chats section ── */}
                  <div className="px-3 pt-3 pb-1">
                    <span className="text-[12px] font-semibold text-tertiary leading-[18px]">
                      Recent chats
                    </span>
                  </div>
                  {RECENT_CHATS.slice(0, 2).map(chat => (
                    <div
                      key={chat.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => onOpenCopilot?.(chat.id)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onOpenCopilot?.(chat.id);
                        }
                      }}
                      className="flex items-center gap-3 h-9 px-3 py-1 rounded-[12px] transition-colors cursor-pointer text-primary hover:bg-secondary"
                    >
                      <Icon
                        name="clock"
                        size="sm"
                        className="w-5 h-5 shrink-0"
                        aria-hidden
                      />
                      <span className="flex-1 text-[14px] leading-5 truncate">
                        {chat.title}
                      </span>
                    </div>
                  ))}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => onOpenCopilot?.()}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onOpenCopilot?.();
                      }
                    }}
                    className="flex items-center gap-3 h-9 px-3 py-1 rounded-[12px] transition-colors cursor-pointer text-primary hover:bg-secondary"
                  >
                    <Icon
                      name="dot-menu"
                      size="sm"
                      className="w-5 h-5 shrink-0"
                      aria-hidden
                    />
                    <span className="flex-1 text-[14px] leading-5 truncate">
                      More
                    </span>
                  </div>

                  {/* ── Build section ── */}
                  <div className="px-3 pt-3 pb-1">
                    <span className="text-[12px] font-semibold text-tertiary leading-[18px]">
                      Build
                    </span>
                  </div>
                  {accordionManageItems.map(item => {
                    const isActive =
                      activeId === item.id || activeId === item.landingId;
                    const hasActiveChild =
                      item.children?.some(c => c.id === activeId) ?? false;
                    const highlighted = isActive || hasActiveChild;
                    const iconName = highlighted ? item.activeIconName : item.iconName;
                    return (
                      <div
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleAdminL1Select(item.id)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleAdminL1Select(item.id);
                          }
                        }}
                        className={mergeClasses(
                          'flex w-full items-center gap-3 h-9 px-3 py-1 rounded-[12px] transition-colors text-[14px] leading-5 cursor-pointer',
                          isActive && !hasActiveChild
                            ? 'bg-secondary font-semibold text-primary'
                            : highlighted
                              ? 'font-semibold text-primary hover:bg-secondary'
                              : 'text-primary font-normal hover:bg-secondary'
                        )}
                      >
                        <Icon
                          name={iconName as IconName}
                          size="md"
                          className="w-5 h-5 shrink-0"
                        />
                        <span className="flex-1 text-left truncate">{item.label}</span>
                        <Icon
                          name="chevron-right"
                          size="sm"
                          className="w-4 h-4 shrink-0 text-tertiary"
                          aria-hidden
                        />
                      </div>
                    );
                  })}

                  {/* More — stays at top, content expands below (flat, no icons); only one accordion open at a time */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setExpandedL1(null);
                      setShowMore(prev => !prev);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setExpandedL1(null);
                        setShowMore(prev => !prev);
                      }
                    }}
                    className="flex w-full items-center gap-3 h-9 px-3 py-1 text-[14px] text-primary hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <Icon
                      name="dot-menu"
                      size="sm"
                      className="w-4 h-4 shrink-0"
                      aria-hidden
                    />
                    <span className="flex-1 text-left">More</span>
                    <Icon
                      name="chevron-down"
                      size="sm"
                      className={mergeClasses(
                        'w-4 h-4 shrink-0 text-tertiary transition-transform duration-200',
                        showMore ? 'rotate-0' : '-rotate-90'
                      )}
                      aria-hidden
                    />
                  </div>
                  <div
                    className={mergeClasses(
                      'grid transition-[grid-template-rows] duration-200 ease-out',
                      showMore ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="flex flex-col gap-0.5 pb-1">
                        {accordionShowMoreItemsFlat.map(({ id, label }) => (
                          <MoreFlatRow
                            key={id}
                            id={id}
                            label={label}
                            isActive={activeId === id}
                            onSelect={handleChildSelect}
                            onPin={
                              v3ShortcutIds.includes(id)
                                ? undefined
                                : handleV3Pin
                            }
                            onUnpin={
                              v3ShortcutIds.includes(id)
                                ? () => handleV3Unpin(id)
                                : undefined
                            }
                            isPinned={v3ShortcutIds.includes(id)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </nav>

              {/* Bottom: Avatar + Collapse sidebar */}
              {sidebarCollapsed ? (
                <div className="shrink-0 px-3 pb-3 flex flex-col items-center gap-0">
                  <Tooltip content="Expand sidebar" side="right" sideOffset={8}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={onToggleSidebar}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onToggleSidebar?.();
                        }
                      }}
                      className="flex items-center justify-center h-9 w-9 rounded-[12px] transition-colors hover:bg-secondary cursor-pointer"
                    >
                      <Icon
                        name={'layout-left' as IconName}
                        size="md"
                        className="w-5 h-5 shrink-0"
                        style={{ color: 'var(--color-icon-disabled)' }}
                      />
                    </div>
                  </Tooltip>
                  <div
                    role="button"
                    tabIndex={0}
                    className="flex items-center justify-center h-9 w-9 rounded-[12px] transition-colors hover:bg-secondary cursor-pointer"
                  >
                    <Avatar size="xs" />
                  </div>
                </div>
              ) : (
                <div className="shrink-0 px-3 pb-3 flex items-center gap-0">
                  <div
                    role="button"
                    tabIndex={0}
                    className="flex flex-1 items-center gap-3 h-9 px-3 py-1 rounded-[12px] transition-colors text-[14px] leading-5 text-primary font-normal hover:bg-secondary justify-start cursor-pointer min-w-0"
                  >
                    <Avatar size="xs" />
                    <span className="flex-1 text-left truncate whitespace-nowrap">
                      Rudy
                    </span>
                  </div>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={onToggleSidebar}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onToggleSidebar?.();
                      }
                    }}
                    className="flex items-center justify-center h-9 w-9 rounded-[12px] transition-colors hover:bg-secondary shrink-0 cursor-pointer"
                  >
                    <Icon
                      name={'layout-left' as IconName}
                      size="md"
                      className="w-5 h-5 shrink-0"
                      style={{ color: 'var(--color-icon-disabled)' }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </aside>

        {/* Collapse affordance: hidden while Copilot is active unless explicitly enabled */}
        {(!sidebarOnly || onToggleSidebar) &&
          (!isCopilotActive || showCollapseAffordance) && (
          <SidebarAffordance
            isCollapsed={sidebarCollapsed}
            onToggle={onToggleSidebar ?? (() => undefined)}
          />
        )}

        {/* ── Content column (only when not sidebarOnly; no ContentArea/DetailPage) ── */}
        {!sidebarOnly && (
          <div className="flex-1 flex flex-col overflow-hidden bg-primary" />
        )}
      </div>

      {/* Manage shortcuts modal — Compass Modal */}
      <Modal.Root
        open={manageShortcutsOpen}
        onOpenChange={setManageShortcutsOpen}
        size="md"
      >
        <Modal.Content>
          <Modal.Header title="Manage shortcuts" />
          <Modal.Body>
          <div className="flex flex-col gap-6">
            {/* ── Pinned ── */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-primary">
                  Pinned
                </span>
                {pinnedShortcutItems.length > 0 && (
                  <button
                    type="button"
                    onClick={clearPinnedShortcuts}
                    className="text-[14px] text-[#5b5fc7] hover:text-[#4a4eb5] hover:bg-secondary px-0 font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div
                className="flex flex-col gap-0.5"
                onDragOver={e => e.preventDefault()}
                onDrop={() => setManageShortcutsPinnedDraggedIndex(null)}
              >
                {pinnedShortcutItems.length === 0 ? (
                  <span className="text-[13px] text-tertiary py-1">
                    No pinned shortcuts
                  </span>
                ) : (
                  pinnedShortcutItems.map((item, index) => (
                    <div
                      key={item.id}
                      ref={el => {
                        manageShortcutsPinnedRowRefs.current[index] = el;
                      }}
                      draggable
                      onDragStart={e => {
                        setManageShortcutsPinnedDraggedIndex(index);
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('text/plain', String(index));
                        const row = manageShortcutsPinnedRowRefs.current[index];
                        if (row) {
                          const rect = row.getBoundingClientRect();
                          e.dataTransfer.setDragImage(
                            row,
                            e.clientX - rect.left,
                            e.clientY - rect.top
                          );
                        }
                      }}
                      onDragOver={e => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                        if (
                          manageShortcutsPinnedDraggedIndex === null ||
                          index === manageShortcutsPinnedDraggedIndex
                        )
                          return;
                        setV3ShortcutIds(prev => {
                          const next = [...prev];
                          const [removed] = next.splice(
                            manageShortcutsPinnedDraggedIndex,
                            1
                          );
                          next.splice(index, 0, removed);
                          return next;
                        });
                        setManageShortcutsPinnedDraggedIndex(index);
                      }}
                      onDragEnd={() =>
                        setManageShortcutsPinnedDraggedIndex(null)
                      }
                      className={mergeClasses(
                        'flex items-center gap-3 h-10 px-3 rounded-[12px] group/pinned touch-none select-none cursor-grab active:cursor-grabbing',
                        manageShortcutsPinnedDraggedIndex === index
                          ? 'bg-secondary'
                          : 'hover:bg-secondary'
                      )}
                      role="button"
                      tabIndex={0}
                      aria-label={`${item.label}, drag to reorder`}
                    >
                      <div
                        className="flex shrink-0 touch-none rounded p-1 -m-1 text-secondary"
                        aria-hidden
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="shrink-0 text-secondary"
                          aria-hidden
                        >
                          <circle cx="5" cy="4" r="1.25" fill="currentColor" />
                          <circle cx="11" cy="4" r="1.25" fill="currentColor" />
                          <circle cx="5" cy="8" r="1.25" fill="currentColor" />
                          <circle cx="11" cy="8" r="1.25" fill="currentColor" />
                          <circle cx="5" cy="12" r="1.25" fill="currentColor" />
                          <circle
                            cx="11"
                            cy="12"
                            r="1.25"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                      <Icon
                        name="pin"
                        size="sm"
                        className="w-5 h-5 shrink-0 text-tertiary"
                        aria-hidden
                      />
                      <span className="flex-1 text-[14px] text-primary truncate">
                        {item.label}
                      </span>
                      <IconButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon="unpin"
                        aria-label="Unpin"
                        className="w-6 h-6 rounded opacity-0 group-hover/pinned:opacity-100 hover:bg-secondary shrink-0"
                        onClick={e => {
                          e.stopPropagation();
                          handleV3Unpin(item.id);
                        }}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="h-px bg-secondary" />

            {/* ── History ── */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-primary">
                  History
                </span>
                {recentShortcutItems.length > 0 && (
                  <button
                    type="button"
                    onClick={clearShortcutHistory}
                    className="text-[14px] text-[#5b5fc7] hover:text-[#4a4eb5] hover:bg-secondary px-0 font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div
                className="flex flex-col gap-0.5"
                onDragOver={e => e.preventDefault()}
                onDrop={() => setManageShortcutsDraggedIndex(null)}
              >
                {recentShortcutItems.length === 0 ? (
                  <span className="text-[13px] text-tertiary py-1">
                    No recent history
                  </span>
                ) : (
                  recentShortcutItems.map((item, index) => (
                    <div
                      key={item.id}
                      ref={el => {
                        manageShortcutsRowRefs.current[index] = el;
                      }}
                      draggable
                      onDragStart={e => {
                        setManageShortcutsDraggedIndex(index);
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('text/plain', String(index));
                        const row = manageShortcutsRowRefs.current[index];
                        if (row) {
                          const rect = row.getBoundingClientRect();
                          e.dataTransfer.setDragImage(
                            row,
                            e.clientX - rect.left,
                            e.clientY - rect.top
                          );
                        }
                      }}
                      onDragOver={e => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                        if (
                          manageShortcutsDraggedIndex === null ||
                          index === manageShortcutsDraggedIndex
                        )
                          return;
                        setShortcutHistoryIds(prev => {
                          const next = [...prev];
                          const [removed] = next.splice(
                            manageShortcutsDraggedIndex,
                            1
                          );
                          next.splice(index, 0, removed);
                          return next;
                        });
                        setManageShortcutsDraggedIndex(index);
                      }}
                      onDragEnd={() => setManageShortcutsDraggedIndex(null)}
                      className={mergeClasses(
                        'flex items-center gap-3 h-10 px-3 rounded-[12px] group/recent touch-none select-none cursor-grab active:cursor-grabbing',
                        manageShortcutsDraggedIndex === index
                          ? 'bg-secondary'
                          : 'hover:bg-secondary'
                      )}
                      role="button"
                      tabIndex={0}
                      aria-label={`${item.label}, drag to reorder`}
                    >
                      <div
                        className="flex shrink-0 touch-none rounded p-1 -m-1 text-secondary"
                        aria-hidden
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="shrink-0 text-secondary"
                          aria-hidden
                        >
                          <circle cx="5" cy="4" r="1.25" fill="currentColor" />
                          <circle cx="11" cy="4" r="1.25" fill="currentColor" />
                          <circle cx="5" cy="8" r="1.25" fill="currentColor" />
                          <circle cx="11" cy="8" r="1.25" fill="currentColor" />
                          <circle cx="5" cy="12" r="1.25" fill="currentColor" />
                          <circle
                            cx="11"
                            cy="12"
                            r="1.25"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                      <Icon
                        name="clock"
                        size="sm"
                        className="w-5 h-5 shrink-0 text-tertiary"
                        aria-hidden
                      />
                      <span className="flex-1 text-[14px] text-primary truncate">
                        {item.label}
                      </span>
                      <IconButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon="pin"
                        aria-label="Pin"
                        className="w-6 h-6 rounded opacity-0 group-hover/recent:opacity-100 hover:bg-secondary shrink-0"
                        onClick={e => {
                          e.stopPropagation();
                          handleV3Pin(item.id);
                        }}
                      />
                      <IconButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon="cross"
                        aria-label="Remove from history"
                        className="w-6 h-6 rounded opacity-0 group-hover/recent:opacity-100 hover:bg-secondary shrink-0"
                        onClick={e => {
                          e.stopPropagation();
                          removeFromShortcutHistory(item.id);
                        }}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          </Modal.Body>
          <Modal.Footer
            primaryAction={{
              label: 'Done',
              onClick: () => setManageShortcutsOpen(false),
            }}
          />
        </Modal.Content>
      </Modal.Root>
    </div>
  );
};

export default SidebarV5;
