export type InboxCategory = 'dms' | 'moderation' | 'comments' | 'connections' | 'ai';

export type FilterOperator =
  | 'is'
  | 'isNot'
  | 'contains'
  | 'doesNotContain'
  | 'greaterThan'
  | 'lessThan'
  | 'before'
  | 'after'
  | 'between'
  | 'isTrue'
  | 'isFalse';

export interface ViewFilter {
  id: string;
  field: string;
  fieldLabel: string;
  operator: FilterOperator;
  operatorLabel: string;
  value: string;
  valueLabel?: string;
}

export interface InboxView {
  id: string;
  name: string;
  icon: string;
  category: InboxCategory | 'all';
  filters: ViewFilter[];
  count: number;
}
