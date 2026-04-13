import React, { useState } from 'react';
import { TableEnhanced as Table, TableColumn } from '../ui';
import ContentContainer from '../ContentContainer';
import { FilterOption, FilterCondition } from '../ui/filter-modal';
import Actions from '../ui/actions';
import Pagination from '../ui/pagination';
import { Button } from '@circleco/compass/components/Button';
import { applyFilters } from '../../utils/filterHelpers';
import { Badge } from '@circleco/compass/components/Badge';

interface MediaFile {
  id: string;
  name: string;
  type: 'Image' | 'Video' | 'Document' | 'Audio';
  owner: {
    name: string;
    initials: string;
    color: string;
  };
  dateAdded: string;
  fileSize: string;
}

interface MediaManagerProps {
  onToggleSidebar: () => void;
}

const MediaManager: React.FC<MediaManagerProps> = ({ onToggleSidebar }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [showAllFilters, setShowAllFilters] = useState(false);

  // Mock data for media files
  const mockMediaFiles: MediaFile[] = [
    {
      id: '1',
      name: 'community-logo.png',
      type: 'Image',
      owner: {
        name: 'John Doe',
        initials: 'JD',
        color: 'bg-blue-500',
      },
      dateAdded: '2 hours ago',
      fileSize: '2.4 MB',
    },
    {
      id: '2',
      name: 'product-demo.mp4',
      type: 'Video',
      owner: {
        name: 'Jane Smith',
        initials: 'JS',
        color: 'bg-green-500',
      },
      dateAdded: '1 day ago',
      fileSize: '45.2 MB',
    },
    {
      id: '3',
      name: 'guidelines.pdf',
      type: 'Document',
      owner: {
        name: 'Mike Johnson',
        initials: 'MJ',
        color: 'bg-purple-500',
      },
      dateAdded: '3 days ago',
      fileSize: '1.8 MB',
    },
    {
      id: '4',
      name: 'podcast-episode.mp3',
      type: 'Audio',
      owner: {
        name: 'Sarah Wilson',
        initials: 'SW',
        color: 'bg-orange-500',
      },
      dateAdded: '1 week ago',
      fileSize: '28.7 MB',
    },
  ];

  // Filter and pagination logic
  const getFilteredData = () => {
    return applyFilters(mockMediaFiles, activeFilters);
  };

  const filteredData = getFilteredData();
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    if (selectedFiles.length === paginatedData.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(paginatedData.map(file => file.id));
    }
  };

  const handleSelectItem = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleDeleteSelected = () => {
    setSelectedFiles([]);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'Image':
        return '🖼️';
      case 'Video':
        return '🎥';
      case 'Document':
        return '📄';
      case 'Audio':
        return '🎵';
      default:
        return '📁';
    }
  };

  const tableColumns: TableColumn<MediaFile>[] = [
    {
      key: 'name',
      label: 'NAME',
      render: (file: MediaFile) => (
        <div className="flex items-center space-x-3">
          <span className="text-lg">{getFileIcon(file.type)}</span>
          <span className="text-sm text-primary font-medium">{file.name}</span>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'TYPE',
      render: (file: MediaFile) => {
        let variant: 'info' | 'indigo' | 'success' | 'warning' = 'info';
        if (file.type === 'Image') variant = 'info';
        else if (file.type === 'Video') variant = 'indigo';
        else if (file.type === 'Document') variant = 'success';
        else if (file.type === 'Audio') variant = 'warning';
        return <Badge label={file.type} variant={variant} />;
      },
    },
    {
      key: 'owner',
      label: 'OWNER',
      render: (file: MediaFile) => (
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 rounded-full ${file.owner.color} flex items-center justify-center`}
          >
            <span className="text-xs text-white font-medium">
              {file.owner.initials}
            </span>
          </div>
          <span className="text-sm text-primary">{file.owner.name}</span>
        </div>
      ),
    },
    {
      key: 'dateAdded',
      label: 'DATE ADDED',
      render: (file: MediaFile) => (
        <span className="text-sm text-secondary">{file.dateAdded}</span>
      ),
    },
    {
      key: 'fileSize',
      label: 'FILE SIZE',
      render: (file: MediaFile) => (
        <span className="text-sm text-secondary">{file.fileSize}</span>
      ),
    },
  ];

  const filterOptions: FilterOption[] = [
    { id: 'name', label: 'Name', type: 'text' },
    { id: 'type', label: 'Type', type: 'text' },
    { id: 'owner', label: 'Owner', type: 'text' },
  ];

  // Storage usage data
  const storageUsage = {
    used: 78.1,
    total: 100,
    unit: 'GB',
  };

  const storagePercentage = (storageUsage.used / storageUsage.total) * 100;

  return (
    <ContentContainer
      onToggleSidebar={onToggleSidebar}
      title="Media Manager"
      actions={<Button variant="primary">Upload files</Button>}
      filters={filterOptions}
      activeFilters={activeFilters}
      onFilterChange={setActiveFilters}
      showAllFilters={showAllFilters}
      onShowAllFiltersChange={setShowAllFilters}
    >
      {/* Storage Usage */}
      <div className="shrink-0">
        <div className="bg-primary p-6 rounded-lg border border-primary shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-primary">Storage Usage</h3>
            <span className="text-sm text-secondary">
              {storageUsage.used} / {storageUsage.total} {storageUsage.unit}
            </span>
          </div>
          <div className="mb-2">
            <div className="w-full bg-disabled rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  storagePercentage > 80
                    ? 'bg-red-500'
                    : storagePercentage > 60
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${storagePercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-secondary">
            <span>Used</span>
            <span>{storagePercentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <Actions
        selectedCount={selectedFiles.length}
        onShowAllFilters={() => setShowAllFilters(!showAllFilters)}
        totalCount={filteredData.length}
        onDeleteSelected={handleDeleteSelected}
      />

      {/* Table */}
      <Table
        columns={tableColumns}
        data={paginatedData}
        selectedItems={selectedFiles}
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

export default MediaManager;
