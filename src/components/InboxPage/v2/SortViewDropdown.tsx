import React from 'react';
import { Menu } from '@circleco/compass/components/Menu';
import { IconButton } from '@circleco/compass/components/IconButton';

export type ViewMode = 'flat' | 'grouped';

interface SortViewDropdownProps {
  sortOptions: { label: string; value: string }[];
  sortValue: string;
  onSortChange: (value: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showViewSection: boolean;
}

const SortViewDropdown: React.FC<SortViewDropdownProps> = ({
  sortOptions,
  sortValue,
  onSortChange,
  viewMode,
  onViewModeChange,
  showViewSection,
}) => {
  const options = [
    {
      type: 'radio-group' as const,
      label: 'Sort by',
      value: sortValue,
      onValueChange: (v: string) => onSortChange(v),
      items: sortOptions.map(o => ({
        type: 'radio' as const,
        value: o.value,
        label: o.label,
      })),
    },
    ...(showViewSection
      ? [
          'divider' as const,
          {
            type: 'radio-group' as const,
            label: 'View',
            value: viewMode,
            onValueChange: (v: string) => onViewModeChange(v as ViewMode),
            items: [
              { type: 'radio' as const, value: 'flat', label: 'Flat' },
              { type: 'radio' as const, value: 'grouped', label: 'Grouped' },
            ],
          },
        ]
      : []),
  ];

  return (
    <Menu
      options={options}
      trigger={<IconButton icon="arrow-bottom-top" size="md" variant="outline" aria-label="Sort" />}
    />
  );
};

export default SortViewDropdown;
