// Re-export Tabs from @circleco/compass
export { Tabs } from '@circleco/compass/components/Tabs';

// Keep the Tab interface for backward compatibility during migration
export interface Tab {
  id: string;
  label: string;
  count?: number | string;
}
