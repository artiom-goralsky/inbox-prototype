import React, { useMemo } from 'react';
import { DataTable } from '@circleco/compass/components/DataTable';
import { mergeClasses } from '../../lib/utils';

export interface TableColumn<T = unknown> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  width?: string | number;
}

export interface TableProps<T = unknown> {
  columns: TableColumn<T>[];
  data: T[];
  selectedItems: string[];
  onSelectAll: () => void;
  onSelectItem: (itemId: string) => void;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  className?: string;
  containerClassName?: string;
}

// Helper function to capitalize only first letter
const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const inferAlignFromClassName = (
  className?: string
): 'left' | 'center' | 'right' | undefined => {
  if (!className) return undefined;
  if (className.includes('text-right')) return 'right';
  if (className.includes('text-center')) return 'center';
  if (className.includes('text-left')) return 'left';
  return undefined;
};

const normalizeWidth = (width?: string | number): string | undefined => {
  if (width == null) return undefined;
  if (typeof width === 'number') return `${width}px`;
  return width;
};

const TableEnhanced = <T extends { id: string }>({
  columns,
  data,
  selectedItems,
  onSelectAll,
  onSelectItem,
  onRowClick,
  isLoading = false,
  className = '',
  containerClassName = '',
}: TableProps<T>) => {
  const dataTableColumns = useMemo(
    () =>
      columns.map(col => ({
        field: col.key,
        header: capitalizeFirstLetter(col.label),
        width: normalizeWidth(col.width),
        align: inferAlignFromClassName(col.className),
        cell: col.render
          ? ({ row }: { row: { original: T } }) => col.render?.(row.original)
          : undefined,
      })),
    [columns]
  );

  const rowSelection = useMemo(() => {
    const s = new Set(selectedItems);
    const next: Record<string, boolean> = {};
    for (const row of data) {
      next[row.id] = s.has(row.id);
    }
    return next;
  }, [data, selectedItems]);

  const handleRowSelectionChange = (nextSelectedRowIds: string[]) => {
    // DataTable sends the full list of selected row IDs.
    // Our legacy API is toggle-based (onSelectItem/onSelectAll), so we diff and apply.
    const prev = new Set(selectedItems);
    const next = new Set(nextSelectedRowIds);

    // If selection becomes "all visible" or "none", route through onSelectAll (matches legacy behavior).
    const allVisibleIds = data.map(d => d.id);
    const isAllVisibleSelected =
      allVisibleIds.length > 0 && allVisibleIds.every(id => next.has(id));
    const isNoneSelected = next.size === 0;
    if (isAllVisibleSelected || isNoneSelected) {
      onSelectAll();
      return;
    }

    // Otherwise toggle individual rows that changed.
    const allIds = Array.from(
      new Set([...Array.from(prev), ...Array.from(next)])
    );
    for (const id of allIds) {
      const was = prev.has(id);
      const now = next.has(id);
      if (was !== now) onSelectItem(id);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <DataTable
        data={data}
        columns={dataTableColumns}
        loading={isLoading}
        getRowId={(row: T) => row.id}
        selectionMode="multiple"
        onRowSelectionChange={handleRowSelectionChange}
        state={{ rowSelection }}
        onRowClick={onRowClick ? row => onRowClick(row) : undefined}
        className={mergeClasses(containerClassName, className)}
      />
    </div>
  );
};

export default TableEnhanced;
