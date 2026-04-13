import React from 'react';

interface ActionsProps {
  selectedCount: number;
  totalCount: number;
  onDeleteSelected?: () => void;
  onBulkActions?: () => void;
  className?: string;
}

const Actions: React.FC<ActionsProps> = ({
  selectedCount,
  totalCount,
  onDeleteSelected,
  onBulkActions,
  className = '',
}) => {
  return (
    <div
      className={`shrink-0 flex justify-between items-center py-4 ${className}`}
    >
      <div className="flex items-center space-x-4">
        {selectedCount > 0 ? (
          <>
            <span className="text-sm text-secondary">
              {selectedCount} of {totalCount} selected
            </span>
            {onDeleteSelected && (
              <button
                onClick={onDeleteSelected}
                className="text-sm text-danger hover:text-red-700"
              >
                Delete selected
              </button>
            )}
          </>
        ) : (
          <span className="text-sm text-secondary">{totalCount} total</span>
        )}
      </div>
      <button
        onClick={onBulkActions}
        className="px-4 py-2 bg-active text-gray-700 rounded-lg hover:bg-disabled transition-colors"
      >
        Bulk actions
      </button>
    </div>
  );
};

export default Actions;
