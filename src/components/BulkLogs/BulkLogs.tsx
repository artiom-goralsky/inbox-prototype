import React, { useState } from 'react';
import { TableEnhanced as Table, TableColumn } from '../ui';
import ContentContainer from '../ContentContainer';
import { FilterCondition } from '../ui/filter-modal';
import Actions from '../ui/actions';
import Pagination from '../ui/pagination';
import { exportToCSV } from '../../utils/csvExport';
import { applyFilters } from '../../utils/filterHelpers';
import { Badge } from '@circleco/compass/components/Badge';

interface BulkLog {
  id: string;
  action: string;
  resource: string;
  createdBy: {
    name: string;
    initials: string;
    color: string;
  };
  status: 'Completed' | 'In Progress' | 'Failed';
  progress: number;
  outputCsv: string;
  createdAt: string;
}

interface BulkLogsProps {
  onToggleSidebar: () => void;
  onBack?: () => void;
}

const BulkLogs: React.FC<BulkLogsProps> = ({ onToggleSidebar, onBack }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [showAllFilters, setShowAllFilters] = useState(false);

  // Mock data for bulk logs
  const mockBulkLogs: BulkLog[] = [
    {
      id: '1',
      action: 'Bulk Import',
      resource: 'Members',
      createdBy: {
        name: 'John Doe',
        initials: 'JD',
        color: 'bg-blue-500',
      },
      status: 'Completed',
      progress: 100,
      outputCsv: 'import_results.csv',
      createdAt: '2 hours ago',
    },
    {
      id: '2',
      action: 'Bulk Export',
      resource: 'Posts',
      createdBy: {
        name: 'Jane Smith',
        initials: 'JS',
        color: 'bg-green-500',
      },
      status: 'In Progress',
      progress: 65,
      outputCsv: 'posts_export.csv',
      createdAt: '1 hour ago',
    },
    {
      id: '3',
      action: 'Bulk Delete',
      resource: 'Comments',
      createdBy: {
        name: 'Mike Johnson',
        initials: 'MJ',
        color: 'bg-purple-500',
      },
      status: 'Failed',
      progress: 0,
      outputCsv: 'error_log.csv',
      createdAt: '3 hours ago',
    },
    {
      id: '4',
      action: 'Bulk Update',
      resource: 'User Roles',
      createdBy: {
        name: 'Sarah Wilson',
        initials: 'SW',
        color: 'bg-orange-500',
      },
      status: 'Completed',
      progress: 100,
      outputCsv: 'role_updates.csv',
      createdAt: '1 day ago',
    },
  ];

  // Keep rows in state so bulk actions (e.g., delete) can mutate the dataset
  const [rows, setRows] = useState<BulkLog[]>(mockBulkLogs);

  // Filter and pagination logic
  const getFilteredData = () => {
    return applyFilters(rows, activeFilters);
  };

  const filteredData = getFilteredData();
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    if (selectedLogs.length === paginatedData.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(paginatedData.map(log => log.id));
    }
  };

  const handleSelectItem = (logId: string) => {
    setSelectedLogs(prev =>
      prev.includes(logId) ? prev.filter(id => id !== logId) : [...prev, logId]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedLogs.length === 0) return;
    setRows(prev => prev.filter(row => !selectedLogs.includes(row.id)));
    setSelectedLogs([]);
  };

  const handleArchiveSelected = () => {
    if (selectedLogs.length === 0) return;
    // Mark archived items as completed with full progress
    setRows(prev =>
      prev.map(row =>
        selectedLogs.includes(row.id)
          ? { ...row, status: 'Completed', progress: 100 }
          : row
      )
    );
  };

  const handleMoveToSpace = () => {
    if (selectedLogs.length === 0) return;
    // Simulate moving to a space by updating the resource field
    setRows(prev =>
      prev.map(row =>
        selectedLogs.includes(row.id) ? { ...row, resource: 'Space A' } : row
      )
    );
  };

  const filters = [
    {
      id: 'status',
      label: 'Status',
      type: 'select' as const,
      options: ['Completed', 'Failed', 'Processing'],
    },
    {
      id: 'action',
      label: 'Action',
      type: 'text' as const,
    },
    {
      id: 'resource',
      label: 'Resource',
      type: 'text' as const,
    },
    {
      id: 'createdBy',
      label: 'Created By',
      type: 'text' as const,
    },
  ];

  const handleDownloadCsv = (_filename: string) => {
    // Add download logic here
  };

  const tableColumns: TableColumn<BulkLog>[] = [
    {
      key: 'action',
      label: 'ACTION',
      render: (log: BulkLog) => (
        <span className="text-sm text-primary font-medium">{log.action}</span>
      ),
    },
    {
      key: 'resource',
      label: 'RESOURCE',
      render: (log: BulkLog) => (
        <span className="text-sm text-secondary">{log.resource}</span>
      ),
    },
    {
      key: 'createdBy',
      label: 'CREATED BY',
      render: (log: BulkLog) => (
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 rounded-full ${log.createdBy.color} flex items-center justify-center`}
          >
            <span className="text-xs text-white font-medium">
              {log.createdBy.initials}
            </span>
          </div>
          <span className="text-sm text-primary">{log.createdBy.name}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (log: BulkLog) => {
        let variant: 'success' | 'info' | 'destructive' = 'info';
        if (log.status === 'Completed') variant = 'success';
        else if (log.status === 'Failed') variant = 'destructive';
        return (
          <div className="flex items-center space-x-2">
            <Badge label={log.status} variant={variant} />
            {log.status === 'In Progress' && (
              <div className="w-16 bg-disabled rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${log.progress}%` }}
                />
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'progress',
      label: 'PROGRESS',
      render: (log: BulkLog) => (
        <span className="text-sm text-secondary">{log.progress}%</span>
      ),
    },
    {
      key: 'outputCsv',
      label: 'OUTPUT CSV',
      render: (log: BulkLog) => (
        <button
          onClick={() => handleDownloadCsv(log.outputCsv)}
          className="text-sm text-link hover:text-blue-700 underline"
        >
          {log.outputCsv}
        </button>
      ),
    },
    {
      key: 'createdAt',
      label: 'CREATED AT',
      render: (log: BulkLog) => (
        <span className="text-sm text-secondary">{log.createdAt}</span>
      ),
    },
  ];

  return (
    <ContentContainer
      onToggleSidebar={onToggleSidebar}
      title="Bulk logs"
      breadcrumb="Configure"
      onBreadcrumbClick={onBack}
      filters={filters}
      activeFilters={activeFilters}
      onFilterChange={setActiveFilters}
      showAllFilters={showAllFilters}
      onShowAllFiltersChange={setShowAllFilters}
    >
      {/* Actions */}
      <Actions
        selectedCount={selectedLogs.length}
        totalCount={filteredData.length}
        onDeleteSelected={handleDeleteSelected}
        selectedData={paginatedData.filter(log =>
          selectedLogs.includes(log.id)
        )}
        exportFilename="bulk-logs.csv"
        onShowAllFilters={() => setShowAllFilters(!showAllFilters)}
        bulkActions={[
          {
            id: 'export',
            label: 'Export selected',
            onClick: () => {
              const selectedData = paginatedData.filter(log =>
                selectedLogs.includes(log.id)
              );
              exportToCSV(selectedData, 'bulk-logs.csv');
            },
            disabled: selectedLogs.length === 0,
          },
          {
            id: 'move',
            label: 'Move to space',
            onClick: handleMoveToSpace,
            disabled: selectedLogs.length === 0,
          },
          {
            id: 'archive',
            label: 'Archive selected',
            onClick: handleArchiveSelected,
            disabled: selectedLogs.length === 0,
          },
          {
            id: 'delete',
            label: 'Delete selected',
            onClick: handleDeleteSelected,
            disabled: selectedLogs.length === 0,
          },
        ]}
      />

      {/* Table */}
      <Table
        columns={tableColumns}
        data={paginatedData}
        selectedItems={selectedLogs}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
      />

      {/* Pagination */}
      <Pagination
        count={filteredData.length}
        page={currentPage}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </ContentContainer>
  );
};

export default BulkLogs;
