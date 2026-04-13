import type { FilterOperator, InboxCategory } from './viewTypes';

export type ValueInputType = 'select' | 'multiSelect' | 'text' | 'number' | 'date' | 'boolean';

export interface FilterFieldDef {
  field: string;
  label: string;
  operators: { value: FilterOperator; label: string }[];
  valueType: ValueInputType;
  options?: { value: string; label: string }[];
  categories: (InboxCategory | 'all')[];
}

export const FILTER_FIELDS: FilterFieldDef[] = [
  // ── Universal ──
  {
    field: 'memberTier',
    label: 'Member tier',
    operators: [
      { value: 'is', label: 'is' },
      { value: 'isNot', label: 'is not' },
    ],
    valueType: 'select',
    options: [
      { value: 'vip', label: 'VIP' },
      { value: 'pro', label: 'Pro' },
      { value: 'free', label: 'Free' },
    ],
    categories: ['all'],
  },
  {
    field: 'joinDate',
    label: 'Join date',
    operators: [
      { value: 'before', label: 'before' },
      { value: 'after', label: 'after' },
    ],
    valueType: 'date',
    categories: ['all'],
  },
  {
    field: 'memberStatus',
    label: 'Member status',
    operators: [{ value: 'is', label: 'is' }],
    valueType: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
    categories: ['all'],
  },
  {
    field: 'language',
    label: 'Language',
    operators: [
      { value: 'is', label: 'is' },
      { value: 'isNot', label: 'is not' },
    ],
    valueType: 'select',
    options: [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Spanish' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'fr', label: 'French' },
      { value: 'ar', label: 'Arabic' },
    ],
    categories: ['all'],
  },
  // ── DMs ──
  {
    field: 'hasAttachment',
    label: 'Has attachment',
    operators: [
      { value: 'isTrue', label: 'yes' },
      { value: 'isFalse', label: 'no' },
    ],
    valueType: 'boolean',
    categories: ['dms'],
  },
  {
    field: 'responseTime',
    label: 'Response time (hours)',
    operators: [
      { value: 'greaterThan', label: 'greater than' },
      { value: 'lessThan', label: 'less than' },
    ],
    valueType: 'number',
    categories: ['dms'],
  },
  // ── Moderation ──
  {
    field: 'violationType',
    label: 'Violation type',
    operators: [
      { value: 'is', label: 'is' },
      { value: 'isNot', label: 'is not' },
    ],
    valueType: 'select',
    options: [
      { value: 'harassment', label: 'Harassment' },
      { value: 'spam', label: 'Spam' },
      { value: 'selfPromotion', label: 'Self-promotion' },
      { value: 'offTopic', label: 'Off-topic' },
    ],
    categories: ['moderation'],
  },
  {
    field: 'reportCount',
    label: 'Report count',
    operators: [
      { value: 'greaterThan', label: 'more than' },
      { value: 'lessThan', label: 'fewer than' },
    ],
    valueType: 'number',
    categories: ['moderation'],
  },
  {
    field: 'reportSource',
    label: 'Source',
    operators: [{ value: 'is', label: 'is' }],
    valueType: 'select',
    options: [
      { value: 'workflow', label: 'Workflow' },
      { value: 'memberReport', label: 'Member report' },
    ],
    categories: ['moderation'],
  },
  // ── Course comments ──
  {
    field: 'course',
    label: 'Course',
    operators: [
      { value: 'is', label: 'is' },
      { value: 'isNot', label: 'is not' },
    ],
    valueType: 'select',
    options: [
      { value: 'intro-photo', label: 'Intro to Photography' },
      { value: 'advanced-editing', label: 'Advanced Editing' },
      { value: 'portrait-pro', label: 'Portrait Pro' },
      { value: 'camera-basics', label: 'Camera Basics' },
    ],
    categories: ['comments'],
  },
  {
    field: 'commentStatus',
    label: 'Status',
    operators: [{ value: 'is', label: 'is' }],
    valueType: 'select',
    options: [
      { value: 'answered', label: 'Answered' },
      { value: 'unanswered', label: 'Unanswered' },
    ],
    categories: ['comments'],
  },
  // ── AI Inbox ──
  {
    field: 'agentName',
    label: 'Agent',
    operators: [{ value: 'is', label: 'is' }],
    valueType: 'select',
    options: [
      { value: 'support-agent', label: 'Support Agent' },
      { value: 'onboarding-agent', label: 'Onboarding Agent' },
      { value: 'billing-agent', label: 'Billing Agent' },
    ],
    categories: ['ai'],
  },
  {
    field: 'aiStatus',
    label: 'Status',
    operators: [{ value: 'is', label: 'is' }],
    valueType: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'paused', label: 'Paused' },
      { value: 'resolved', label: 'Resolved' },
    ],
    categories: ['ai'],
  },
  {
    field: 'handoffReason',
    label: 'Handoff reason',
    operators: [
      { value: 'contains', label: 'contains' },
      { value: 'doesNotContain', label: 'does not contain' },
    ],
    valueType: 'text',
    categories: ['ai'],
  },
];

export function getFieldsForCategory(category: InboxCategory | 'all'): FilterFieldDef[] {
  return FILTER_FIELDS.filter(
    f => f.categories.includes('all') || f.categories.includes(category as InboxCategory),
  );
}
