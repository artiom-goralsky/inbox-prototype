import React, { useState, useRef, useEffect } from 'react';
import { mergeClasses } from '../../lib/utils';
import { Button } from '@circleco/compass/components/Button';
import { Icon } from '@circleco/compass/components/Icon';

interface BulkAction {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface BulkActionsDropdownProps {
  actions?: BulkAction[];
  className?: string;
  onShowAllFilters?: () => void;
}

const BulkActionsDropdown: React.FC<BulkActionsDropdownProps> = ({
  actions = [],
  className,
  onShowAllFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!onShowAllFilters) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [onShowAllFilters]);

  // If onShowAllFilters is provided, use it instead of dropdown
  if (onShowAllFilters) {
    return (
      <div className={mergeClasses('relative', className)}>
        <Button variant="outline" size="md" onClick={onShowAllFilters}>
          <div className="flex gap-1 items-center">
            <div>Filter</div>
            <Icon name="circle" size="sm" />
          </div>
        </Button>
      </div>
    );
  }

  return (
    <div className={mergeClasses('relative', className)} ref={dropdownRef}>
      <Button variant="outline" size="md" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex gap-1 items-center">
          <div>Filter</div>
          <Icon name="circle" size="sm" />
        </div>
      </Button>

      {isOpen && actions.length > 0 && (
        <div className="absolute right-0 mt-2 w-48 bg-primary border border-primary rounded-md shadow-lg z-50">
          <div className="py-1">
            {actions.map(action => (
              <button
                key={action.id}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                disabled={action.disabled}
                className={mergeClasses(
                  'block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-active disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
                  action.disabled && 'cursor-not-allowed'
                )}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActionsDropdown;
