import React from 'react';
import { Checkbox } from '@circleco/compass/components/Checkbox';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  selectedItems?: string[];
  onSelectAll?: () => void;
  onSelectItem?: (id: string) => void;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  className?: string;
}

const Table = <T extends { id: string }>({
  columns,
  data,
  selectedItems = [],
  onSelectAll,
  onSelectItem,
  onRowClick,
  isLoading = false,
  className = '',
}: TableProps<T>) => {
  if (isLoading) {
    return (
      <div className={`overflow-y-auto scrollbar-hide-x px-5 ${className}`}>
        <div className="animate-pulse h-full">
          <div className="overflow-y-auto h-full">
            <table className="w-full">
              <thead className="sticky top-0 bg-primary z-10">
                <tr>
                  <th className="w-12 bg-primary">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  </th>
                  {columns.map((column, index) => (
                    <th key={index} className="bg-primary">
                      <div className="h-4 bg-gray-300 rounded w-16"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index}>
                    <td className="w-12">
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    </td>
                    {columns.map((column, colIndex) => (
                      <td key={colIndex}>
                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-y-auto scrollbar-hide-x px-5 ${className}`}>
      <div className="overflow-y-auto h-full">
        <table className="w-full">
          <thead className="sticky top-0 bg-primary z-10">
            <tr>
              <th className="w-12 bg-primary">
                <Checkbox
                  checked={
                    selectedItems.length === data.length && data.length > 0
                  }
                  onCheckedChange={() => onSelectAll?.()}
                  label=""
                />
              </th>
              {columns.map((column, index) => (
                <th key={index} className="bg-primary">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.id || index}
                className="hover:bg-secondary transition-colors cursor-pointer"
                onClick={() => onRowClick?.(item)}
              >
                <td className="w-12">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => onSelectItem?.(item.id)}
                    label=""
                  />
                </td>
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>
                    {column.render
                      ? column.render(item)
                      : (item as any)[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
