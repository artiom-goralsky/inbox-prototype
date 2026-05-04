import React from 'react';
import { Button } from '@circleco/compass/components/Button';
import { Typography } from '@circleco/compass/components/Typography';

/* ── Entity types ──────────────────────────────────────────────────── */

export interface SpaceResult {
  type: 'space';
  name: string;
  spacesCreated: number;
  membersNotified: number;
}

export interface AccessGroupResult {
  type: 'access-group';
  name: string;
  groupsCreated: number;
  rulesApplied: number;
}

export interface MemberMigrationResult {
  type: 'member-migration';
  totalMigrated: number;
  failed: number;
  newAccessGroup: string;
}

export interface PaywallResult {
  type: 'paywall';
  planName: string;
  price: string;
  billingCycle: string;
}

export interface CourseResult {
  type: 'course';
  title: string;
  modules: number;
  lessons: number;
}

export type PlanResultEntity =
  | SpaceResult
  | AccessGroupResult
  | MemberMigrationResult
  | PaywallResult
  | CourseResult;

export type PlanResultEntityType = PlanResultEntity['type'];

/* ── Component ─────────────────────────────────────────────────────── */

export interface PlanResultCardProps {
  entity: PlanResultEntity;
  completedAt?: string;
  onPrimaryAction?: () => void;
  primaryActionLabel?: string;
}

const IconCheckCircle = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
    <circle cx="8" cy="8" r="6.5" fill="#16a34a" fillOpacity="0.1" stroke="#16a34a" strokeWidth="1.3" />
    <path d="M5 8l2.2 2.2L11 6" stroke="#16a34a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconDownload = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0">
    <path d="M6.5 2v6M4 6l2.5 2.5L9 6M2.5 10.5h8" stroke="#545861" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HEADER_LABELS: Record<PlanResultEntityType, string> = {
  'space': 'Spaces created',
  'access-group': 'Access groups configured',
  'member-migration': 'Migration complete',
  'paywall': 'Paywall configured',
  'course': 'Course created',
};

const DEFAULT_ACTION_LABELS: Record<PlanResultEntityType, string> = {
  'space': 'Open space',
  'access-group': 'Manage access',
  'member-migration': 'View members',
  'paywall': 'View paywall',
  'course': 'Open course',
};

function renderFields(entity: PlanResultEntity) {
  switch (entity.type) {
    case 'space':
      return (
        <>
          <FieldRow label="Name" value={entity.name} />
          <FieldRow label="Spaces created" value={String(entity.spacesCreated)} />
          <FieldRow label="Members notified" value={String(entity.membersNotified)} />
        </>
      );
    case 'access-group':
      return (
        <>
          <FieldRow label="Group" value={entity.name} />
          <FieldRow label="Groups created" value={String(entity.groupsCreated)} />
          <FieldRow label="Rules applied" value={String(entity.rulesApplied)} />
        </>
      );
    case 'member-migration':
      return (
        <>
          <FieldRow label="Migrated" value={`${entity.totalMigrated} members`} />
          {entity.failed > 0 && (
            <FieldRow label="Failed" value={String(entity.failed)} danger />
          )}
          <FieldRow label="New access" value={entity.newAccessGroup} />
        </>
      );
    case 'paywall':
      return (
        <>
          <FieldRow label="Plan" value={entity.planName} />
          <FieldRow label="Price" value={`${entity.price} / ${entity.billingCycle}`} />
        </>
      );
    case 'course':
      return (
        <>
          <FieldRow label="Course" value={entity.title} />
          <FieldRow label="Structure" value={`${entity.modules} modules · ${entity.lessons} lessons`} />
        </>
      );
  }
}

function FieldRow({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="flex gap-1 items-center text-sm">
      <span className="font-semibold text-[#191b1f] shrink-0">{label}:</span>
      <span className={danger ? 'text-[#dc2626]' : 'text-[#191b1f]'}>{value}</span>
    </div>
  );
}

const PlanResultCard: React.FC<PlanResultCardProps> = ({
  entity,
  completedAt,
  onPrimaryAction,
  primaryActionLabel,
}) => {
  const actionLabel = primaryActionLabel ?? DEFAULT_ACTION_LABELS[entity.type];
  const dateLabel = completedAt ?? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-[#f7f9fa] rounded-[12px] p-[2px] overflow-hidden w-full border border-[#e4e7eb] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div className="bg-white rounded-[11px] overflow-hidden w-full">

        {/* Header */}
        <div className="flex h-14 items-center justify-between px-4 py-3 border-b border-[#f0f3f5]">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <IconCheckCircle />
            <span className="text-sm font-semibold text-[#191b1f]">{HEADER_LABELS[entity.type]}</span>
          </div>
          {onPrimaryAction && (
            <Button variant="outline" size="sm" onClick={onPrimaryAction}>
              {actionLabel}
            </Button>
          )}
        </div>

        {/* Fields */}
        <div className="px-4 py-3 flex flex-col gap-1">
          {renderFields(entity)}
        </div>

      </div>

      {/* Footer */}
      <div className="bg-[#f7f9fa] px-3 py-3 flex items-center justify-between">
        <span className="text-xs text-[#545861]">{dateLabel}</span>
        <button
          type="button"
          className="flex items-center gap-1 text-xs text-[#545861] hover:text-[#191b1f] transition-colors"
        >
          <IconDownload />
          Export
        </button>
      </div>
    </div>
  );
};

export default PlanResultCard;
