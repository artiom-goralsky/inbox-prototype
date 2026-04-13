import React from 'react';
import { IconButton } from '@circleco/compass/components/IconButton';
import BulkActionsDropdown from './bulk-actions-dropdown';
import { mergeClasses } from '../../lib/utils';
import { exportToCSV } from '../../utils/csvExport';
import { Button } from '@circleco/compass/components/Button';

interface BulkAction {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface ActionsProps {
  selectedCount: number;
  totalCount: number;
  onDeleteSelected?: () => void;
  bulkActions?: BulkAction[];
  className?: string;
  selectedData?: any[];
  exportFilename?: string;
  onShowAllFilters?: () => void;
}

const Actions: React.FC<ActionsProps> = ({
  selectedCount,
  totalCount,
  onDeleteSelected,
  bulkActions = [],
  className = '',
  selectedData = [],
  exportFilename = 'export.csv',
  onShowAllFilters,
}) => {
  const handleExportSelected = () => {
    if (selectedData.length > 0) {
      exportToCSV(selectedData, exportFilename);
    }
  };

  const defaultBulkActions: BulkAction[] = [
    {
      id: 'export',
      label: 'Export selected',
      onClick: handleExportSelected,
      disabled: selectedCount === 0,
    },
    {
      id: 'move',
      label: 'Move to space',
      onClick: () => {},
    },
    {
      id: 'archive',
      label: 'Archive selected',
      onClick: () => {},
    },
    {
      id: 'delete',
      label: 'Delete selected',
      onClick: onDeleteSelected || (() => {}),
      disabled: selectedCount === 0,
    },
  ];

  // Always include delete action if onDeleteSelected is provided
  const actions =
    bulkActions.length > 0
      ? bulkActions.concat(
          onDeleteSelected
            ? [
                {
                  id: 'delete',
                  label: 'Delete selected',
                  onClick: onDeleteSelected,
                  disabled: selectedCount === 0,
                },
              ]
            : []
        )
      : defaultBulkActions;

  return (
    <div
      className={mergeClasses(
        'shrink-0 flex justify-between items-center py-4',
        className
      )}
    >
      <div className="flex items-center space-x-4 ">
        {selectedCount > 0 ? (
          <>
            <span className="text-sm font-semibold text-primary">
              {selectedCount} of {totalCount} selected
            </span>
            {onDeleteSelected && (
              <Button
                onClick={onDeleteSelected}
                variant="destructive"
                size="md"
              >
                Delete selected
              </Button>
            )}
          </>
        ) : (
          <span className="text-sm font-semibold text-primary">
            {totalCount} total
          </span>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <IconButton
          variant="outline"
          aria-label="Scroll right"
          icon="magnifying-glass"
        />
        {onShowAllFilters ? (
          <BulkActionsDropdown onShowAllFilters={onShowAllFilters} />
        ) : (
          <BulkActionsDropdown actions={actions} />
        )}
      </div>
    </div>
  );
};

export default Actions;
