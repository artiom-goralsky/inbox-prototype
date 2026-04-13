import React from 'react';
import { Select } from '@circleco/compass/components/Select';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
  showItemsPerPage?: boolean;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  totalItems = 0,
  showItemsPerPage = false,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 25, 50, 100],
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (option: { value: string } | null) => {
    const newItemsPerPage = parseInt(option?.value ?? String(itemsPerPage));
    onItemsPerPageChange?.(newItemsPerPage);
  };

  if (totalPages <= 1 && !showItemsPerPage) {
    return null;
  }

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-primary border-t border-primary">
      <div className="flex items-center space-x-2">
        {showItemsPerPage && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <Select
              aria-label="Items per page"
              value={
                itemsPerPageOptions
                  .map(option => ({
                    label: option.toString(),
                    value: option.toString(),
                  }))
                  .find(o => o.value === itemsPerPage.toString()) ?? null
              }
              onValueChange={handleItemsPerPageChange}
              options={itemsPerPageOptions.map(option => ({
                label: option.toString(),
                value: option.toString(),
              }))}
              placeholder="Select items per page"
            />
            <span className="text-sm text-gray-700">entries</span>
          </div>
        )}
        {totalItems > 0 && (
          <span className="text-sm text-gray-700">
            Showing {startItem} to {endItem} of {totalItems} entries
          </span>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center space-x-1">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm font-medium text-tertiary bg-primary border border-hover rounded-md hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 2 && page <= currentPage + 2)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-1 text-sm font-medium border rounded-md ${
                    page === currentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'text-tertiary bg-primary border-hover hover:bg-secondary'
                  }`}
                >
                  {page}
                </button>
              );
            } else if (page === currentPage - 3 || page === currentPage + 3) {
              return (
                <span key={page} className="px-2 text-tertiary">
                  ...
                </span>
              );
            }
            return null;
          })}

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm font-medium text-tertiary bg-primary border border-hover rounded-md hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
