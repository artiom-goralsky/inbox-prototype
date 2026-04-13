import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { IconButton } from '@circleco/compass/components/IconButton';
import type { ViewFilter } from './viewTypes';

interface FilterPillProps {
  filter: ViewFilter;
  onRemove: () => void;
}

const FilterPill: React.FC<FilterPillProps> = ({ filter, onRemove }) => (
  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-secondary rounded-md border border-secondary">
    <Typography variant="body-sm" color="primary">
      {filter.fieldLabel} {filter.operatorLabel} {filter.valueLabel ?? filter.value}
    </Typography>
    <IconButton icon="cross" size="sm" variant="ghost" aria-label="Remove filter" onClick={onRemove} />
  </div>
);

export default FilterPill;
