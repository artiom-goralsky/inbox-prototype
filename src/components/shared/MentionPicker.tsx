import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Icon } from '@circleco/compass/components/Icon';

/* ── Types ──────────────────────────────────────────────────────── */
export type MentionEntityType = 'member' | 'space' | 'group';

export interface MentionEntity {
  id: string | number;
  type: MentionEntityType;
  name: string;
  avatar?: string;
  subtitle?: string;
}

/* ── Circle API ─────────────────────────────────────────────────── */
// Routed through Vite dev proxy to avoid CORS — /circle-api → https://circle.upfront.so
const API_BASE = '/circle-api/api/admin/v2';
const API_TOKEN = 'mqKVqanURH7q2neK8kogdWJ6kvuhTCzM';

const circleHeaders = {
  Authorization: `Token ${API_TOKEN}`,
  'Content-Type': 'application/json',
};

async function fetchMembers(): Promise<MentionEntity[]> {
  try {
    const res = await fetch(`${API_BASE}/community_members?per_page=100&page=1`, { headers: circleHeaders });
    if (!res.ok) { console.warn('Circle members fetch failed', res.status); return []; }
    const data = await res.json();
    const records: any[] = data.records ?? (Array.isArray(data) ? data : []);
    return records.map((m: any) => ({
      id: m.id,
      type: 'member' as const,
      name: m.name ?? m.display_name ?? m.email ?? String(m.id),
      avatar: m.avatar_url ?? m.avatar ?? undefined,
      subtitle: 'Member',
    }));
  } catch (e) {
    console.warn('Circle members error', e);
    return [];
  }
}

async function fetchSpaces(): Promise<MentionEntity[]> {
  try {
    const res = await fetch(`${API_BASE}/spaces?per_page=100&page=1`, { headers: circleHeaders });
    if (!res.ok) { console.warn('Circle spaces fetch failed', res.status); return []; }
    const data = await res.json();
    const records: any[] = data.records ?? (Array.isArray(data) ? data : []);
    return records.map((s: any) => ({
      id: s.id,
      type: 'space' as const,
      name: s.name ?? String(s.id),
      subtitle: 'Space',
    }));
  } catch (e) {
    console.warn('Circle spaces error', e);
    return [];
  }
}

async function fetchGroups(): Promise<MentionEntity[]> {
  try {
    const res = await fetch(`${API_BASE}/space_groups?per_page=100&page=1`, { headers: circleHeaders });
    if (!res.ok) { console.warn('Circle groups fetch failed', res.status); return []; }
    const data = await res.json();
    const records: any[] = data.records ?? (Array.isArray(data) ? data : []);
    return records.map((g: any) => ({
      id: g.id,
      type: 'group' as const,
      name: g.name ?? String(g.id),
      subtitle: 'Group',
    }));
  } catch (e) {
    console.warn('Circle groups error', e);
    return [];
  }
}

/* ── Entity icon ─────────────────────────────────────────────────── */
const EntityIcon: React.FC<{ entity: MentionEntity }> = ({ entity }) => {
  if (entity.type === 'member') {
    return <Avatar size="xs" name={entity.name} src={entity.avatar} />;
  }
  if (entity.type === 'space') {
    return (
      <div className="w-5 h-5 rounded-md bg-[#e4e7eb] flex items-center justify-center shrink-0">
        <Icon name="layout-grid" size="sm" className="text-[#717680]" />
      </div>
    );
  }
  return (
    <div className="w-5 h-5 rounded-md bg-[#e4e7eb] flex items-center justify-center shrink-0">
      <Icon name="people" size="sm" className="text-[#717680]" />
    </div>
  );
};

/* ── Main component ─────────────────────────────────────────────── */
interface MentionPickerProps {
  query: string;
  onSelect: (entity: MentionEntity) => void;
  onClose: () => void;
  className?: string;
}

const SECTION_ORDER: MentionEntityType[] = ['member', 'space', 'group'];
const SECTION_LABELS: Record<MentionEntityType, string> = {
  member: 'Members',
  space: 'Spaces',
  group: 'Groups',
};

// Module-level cache so we don't re-fetch on every keystroke
let cachedEntities: MentionEntity[] | null = null;

const MentionPicker: React.FC<MentionPickerProps> = ({ query, onSelect, onClose, className }) => {
  const [allEntities, setAllEntities] = useState<MentionEntity[]>(cachedEntities ?? []);
  const [loading, setLoading] = useState(!cachedEntities);
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  // Fetch once per session
  useEffect(() => {
    if (cachedEntities) return;
    setLoading(true);
    Promise.all([fetchMembers(), fetchSpaces(), fetchGroups()])
      .then(([members, spaces, groups]) => {
        const all = [...members, ...spaces, ...groups];
        cachedEntities = all;
        setAllEntities(all);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = query
    ? allEntities.filter(e => e.name.toLowerCase().includes(query.toLowerCase()))
    : allEntities;

  useEffect(() => { setActiveIndex(0); }, [query]);

  useEffect(() => {
    const items = listRef.current?.querySelectorAll('[data-item]');
    const el = items?.[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, filtered.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
      else if (e.key === 'Enter' && filtered.length > 0) { e.preventDefault(); onSelect(filtered[activeIndex]); }
      else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [filtered, activeIndex, onSelect, onClose]);

  // Group by type
  const groups: Partial<Record<MentionEntityType, MentionEntity[]>> = {};
  for (const entity of filtered) {
    (groups[entity.type] ??= []).push(entity);
  }

  let flatIndex = 0;

  return (
    <div
      className={`absolute bottom-full left-0 mb-2 w-[240px] bg-white border border-[#e4e7eb] rounded-lg overflow-hidden z-50
        shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_3px_12px_-4px_rgba(0,0,0,0.1),0px_4px_16px_-8px_rgba(0,0,0,0.1)]
        ${className ?? ''}`}
    >
      <div className="p-1 flex flex-col gap-2">
        <div ref={listRef} className="flex flex-col max-h-[280px] overflow-y-auto">
          {loading ? (
            <div className="px-2 py-3 text-sm text-[#717680]">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="px-2 py-2 text-sm text-[#717680]">No results</div>
          ) : (
            SECTION_ORDER.map(type => {
              const items = groups[type];
              if (!items?.length) return null;
              return (
                <div key={type}>
                  <div className="px-2 py-1">
                    <span className="text-xs font-medium text-[#717680]">{SECTION_LABELS[type]}</span>
                  </div>
                  {items.map(entity => {
                    const idx = flatIndex++;
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={`${entity.type}-${entity.id}`}
                        data-item
                        type="button"
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => onSelect(entity)}
                        className={`w-full flex items-center gap-2 px-2 py-2 rounded-md text-left transition-colors ${
                          isActive ? 'bg-[#f7f9fa]' : 'hover:bg-[#f7f9fa]'
                        }`}
                      >
                        <EntityIcon entity={entity} />
                        <span className="text-sm text-[#191b1f] truncate">{entity.name}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MentionPicker;
