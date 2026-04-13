import React, { useState } from 'react';
import { mockSegments, Segment } from '../../data/mockData';
import { TableEnhanced as Table, TableColumn } from '../ui';
import ContentContainer from '../ContentContainer';
import Actions from '../ui/actions';
import Pagination from '../ui/pagination';
import { Button } from '@circleco/compass/components/Button';

interface SegmentsProps {
  onToggleSidebar: () => void;
}

const Segments: React.FC<SegmentsProps> = ({ onToggleSidebar }) => {
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const totalPages = Math.ceil(mockSegments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSegments = mockSegments.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    if (selectedSegments.length === paginatedSegments.length) {
      setSelectedSegments([]);
    } else {
      setSelectedSegments(
        paginatedSegments.map((segment: Segment) => segment.id)
      );
    }
  };

  const handleSelectItem = (segmentId: string) => {
    setSelectedSegments(prev =>
      prev.includes(segmentId)
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  const handleDeleteSelected = () => {
    setSelectedSegments([]);
  };

  // Define table columns
  const tableColumns: TableColumn<Segment>[] = [
    {
      key: 'name',
      label: 'NAME',
      render: (segment: Segment) => (
        <div className="text-sm font-medium text-primary">{segment.name}</div>
      ),
    },
    {
      key: 'people',
      label: 'PEOPLE',
      render: (segment: Segment) => (
        <div className="text-sm text-primary text-right">
          {segment.people.toLocaleString()}
        </div>
      ),
      className: 'text-right',
    },
    {
      key: 'createdBy',
      label: 'CREATED BY',
      render: (segment: Segment) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs text-secondary">
              {segment.createdBy.name
                .split(' ')
                .map((n: string) => n[0])
                .join('')}
            </span>
          </div>
          <span className="text-sm text-primary">{segment.createdBy.name}</span>
        </div>
      ),
    },
    {
      key: 'lastUpdated',
      label: 'LAST UPDATED',
      render: (segment: Segment) => (
        <span className="text-sm text-tertiary">{segment.lastUpdated}</span>
      ),
    },
  ];

  return (
    <ContentContainer
      onToggleSidebar={onToggleSidebar}
      title="Segments"
      actions={<Button variant="primary">New segment</Button>}
    >
      {/* Actions */}
      <Actions
        selectedCount={selectedSegments.length}
        totalCount={paginatedSegments.length}
        onDeleteSelected={handleDeleteSelected}
      />

      {/* Table */}
      <Table
        columns={tableColumns}
        data={paginatedSegments}
        selectedItems={selectedSegments}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
      />

      {/* Pagination */}
      <Pagination
        count={mockSegments.length}
        page={currentPage}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </ContentContainer>
  );
};

export default Segments;
