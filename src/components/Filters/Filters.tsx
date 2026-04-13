import React from 'react';

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
    <div className={`shrink-0 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter, index) => (
          <button
            key={index}
            onClick={filter.onClick}
            className="flex items-center gap-2 px-3 py-2 bg-active rounded-lg text-sm text-gray-700 hover:bg-disabled transition-colors"
          >
            <span>+</span>
            <span>{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filters;
