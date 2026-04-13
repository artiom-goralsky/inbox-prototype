import React from 'react';
import { Button } from '@circleco/compass/components/Button';
import { mergeClasses } from '../../lib/utils';

export interface Filter {
  label: string;
  onClick: () => void;
}

interface FiltersProps {
  filters: Filter[];
  className?: string;
}

const Filters: React.FC<FiltersProps> = ({ filters, className = '' }) => {
  return (
    <div className={mergeClasses('shrink-0', className)}>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter, index) => (
          <Button
            key={index}
            onClick={filter.onClick}
            variant="secondary"
            size="sm"
            className="flex items-center gap-2 px-3 py-2"
          >
            <span>+</span>
            <span>{filter.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Filters;
