import React, { useState } from 'react';
import { mergeClasses } from '../../lib/utils';
import FilterModal, { FilterOption, FilterCondition } from './filter-modal';
import FilterChip from './filter-chip';
import FilterPickerModal from './filter-picker-modal';
import { Divider } from '@circleco/compass/components/Divider';

interface EnhancedFiltersProps {
  filters: FilterOption[];
  activeFilters: FilterCondition[];
  onFilterChange: (filters: FilterCondition[]) => void;
  className?: string;
  showAllFilters?: boolean;
  onShowAllFiltersChange?: (show: boolean) => void;
}

const EnhancedFilters: React.FC<EnhancedFiltersProps> = ({
  filters,
  activeFilters,
  onFilterChange,
  className,
  showAllFilters = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption | null>(
    null
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [clickedButtonRef, setClickedButtonRef] =
    useState<HTMLButtonElement | null>(null);
  const [pickerButtonRef, setPickerButtonRef] =
    useState<HTMLButtonElement | null>(null);

  // Use external state if provided, otherwise use internal state
  const showFilters = showAllFilters || false;

  const handleFilterClick = (
    filter: FilterOption,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setSelectedFilter(filter);
    setClickedButtonRef(event.currentTarget);
    // Add small delay to prevent blink effect
    setTimeout(() => {
      setIsModalOpen(true);
    }, 50);
  };
  const handleApplyFilter = (condition: FilterCondition) => {
    // Remove existing filter for the same field
    const filtered = activeFilters.filter(f => f.field !== condition.field);
    // Add new filter
    onFilterChange([...filtered, condition]);
  };

  const handleRemoveFilter = (field: string) => {
    onFilterChange(activeFilters.filter(f => f.field !== field));
  };

  const handleEditFilter = (
    condition: FilterCondition,
    event?: React.MouseEvent
  ) => {
    const filter = filters.find(f => f.id === condition.field);
    if (filter) {
      setSelectedFilter(filter);
      if (event?.currentTarget) {
        // Use the clicked element (chip or button) for positioning
        setClickedButtonRef(
          event.currentTarget as HTMLElement as HTMLButtonElement
        );
      }
      // Add small delay to prevent blink effect
      setTimeout(() => {
        setIsModalOpen(true);
      }, 50);
    }
  };

  return (
    <>
      <div
        className={mergeClasses(
          'overflow-hidden transition-[max-height,opacity] duration-200',
          showFilters || activeFilters.length > 0
            ? 'max-h-[500px] opacity-100'
            : 'max-h-0 opacity-0'
        )}
      >
        <Divider orientation="horizontal" />
        <div className={mergeClasses('py-3', className)}>
          {/* Inline filter buttons that become chips when active */}
          <div className="flex flex-wrap justify-between items-center gap-2">
            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {filters.map(filter => {
                const active = activeFilters.find(f => f.field === filter.id);
                if (active) {
                  return (
                    <div key={filter.id} className="relative">
                      <FilterChip
                        condition={active}
                        onRemove={() => handleRemoveFilter(filter.id)}
                        onEdit={e => handleEditFilter(active, e)}
                      />
                    </div>
                  );
                }
                return (
                  <div key={filter.id} className="relative">
                    <button
                      data-filter-id={filter.id}
                      onClick={e => handleFilterClick(filter, e)}
                      className="inline-flex items-center justify-center gap-1 px-2 py-1 text-xs text-primary border border-primary hover:bg-active hover:border-hover rounded-md transition-colors shadow-2xs"
                    >
                      <span>{filter.label}</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.53413 6.83325C5.83243 6.83325 5.44488 7.64745 5.88737 8.19205L7.35373 9.99679C7.68719 10.4073 8.31373 10.4073 8.64726 9.99679L10.1136 8.19205C10.5561 7.64745 10.1685 6.83325 9.46679 6.83325H6.53413Z"
                          fill="#191B1F"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}

              {/* Add filter button (opens simple picker modal only) */}
              <div className="relative">
                <button
                  onClick={e => {
                    setPickerButtonRef(e.currentTarget);
                    setTimeout(() => {
                      setIsPickerOpen(true);
                    }, 50);
                  }}
                  className="inline-flex items-center justify-center gap-1 px-2 py-1 text-xs text-primary border border-primary hover:bg-active rounded-md transition-colors shadow-2xs"
                >
                  {/* Custom icon */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-tertiary"
                  >
                    <path
                      d="M1.83398 3.16602H14.1673M5.83398 12.8327H10.1673M3.83398 7.99935H12.1673"
                      stroke="#717680"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex h-[28px] items-center justify-center">
                  <Divider orientation="vertical" />
                </div>
                <button
                  onClick={() => onFilterChange([])}
                  className="text-xs text-gray-700 hover:text-primary px-2 py-1"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Modal - rendered outside relative containers */}
      {selectedFilter && (
        <FilterModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedFilter(null);
            setClickedButtonRef(null);
          }}
          filter={selectedFilter as FilterOption}
          onApply={handleApplyFilter}
          buttonRef={clickedButtonRef}
        />
      )}

      {/* Picker Modal - rendered outside relative containers */}
      {isPickerOpen && (
        <FilterPickerModal
          isOpen={isPickerOpen}
          onClose={() => {
            setIsPickerOpen(false);
            setPickerButtonRef(null);
          }}
          filters={filters}
          onFilterSelect={filter => {
            setIsPickerOpen(false);
            setPickerButtonRef(null);
            // Find the filter button to get its ref
            const filterButton = document.querySelector(
              `[data-filter-id="${filter.id}"]`
            ) as HTMLButtonElement;
            if (filterButton) {
              handleFilterClick(filter, {
                currentTarget: filterButton,
              } as React.MouseEvent<HTMLButtonElement>);
            } else {
              // Fallback if button not found
              setSelectedFilter(filter);
              setClickedButtonRef(null);
              setTimeout(() => {
                setIsModalOpen(true);
              }, 50);
            }
          }}
          buttonRef={pickerButtonRef}
        />
      )}
    </>
  );
};

export default EnhancedFilters;
