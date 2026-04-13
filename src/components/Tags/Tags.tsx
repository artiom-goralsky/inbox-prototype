import React, { useState } from 'react';
import { mockTags, Tag } from '../../data/mockData';
import { TableEnhanced as Table, TableColumn } from '../ui';
import ContentContainer from '../ContentContainer';
import Actions from '../ui/actions';
import Pagination from '../ui/pagination';
import { Button } from '@circleco/compass/components/Button';
import { exportToCSV } from '../../utils/csvExport';
import { FilterCondition } from '../ui/filter-modal';

interface TagsProps {
  onToggleSidebar: () => void;
  onBack?: () => void;
}

const Tags: React.FC<TagsProps> = ({ onToggleSidebar, onBack }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [showAllFilters, setShowAllFilters] = useState(false);

  // Filter configuration
  const filters = [
    {
      id: 'name',
      label: 'Name',
      type: 'text' as const,
    },
    {
      id: 'icon',
      label: 'Icon',
      type: 'text' as const,
    },
  ];

  // Apply filters
  const filteredTags = tags.filter(tag => {
    return activeFilters.every(filter => {
      switch (filter.field) {
        case 'name': {
          const name = tag.name.toLowerCase();
          const searchValue = filter.value.toLowerCase();
          return filter.operator === 'contains'
            ? name.includes(searchValue)
            : !name.includes(searchValue);
        }
        case 'icon': {
          const icon = (tag.icon || '').toLowerCase();
          const iconSearchValue = filter.value.toLowerCase();
          return filter.operator === 'contains'
            ? icon.includes(iconSearchValue)
            : !icon.includes(iconSearchValue);
        }
        default:
          return true;
      }
    });
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTags = filteredTags.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    if (selectedTags.length === paginatedTags.length) {
      setSelectedTags([]);
    } else {
      setSelectedTags(paginatedTags.map((tag: Tag) => tag.id));
    }
  };

  const handleSelectItem = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedTags.length === 0) return;
    setTags(prev => prev.filter(tag => !selectedTags.includes(tag.id)));
    setSelectedTags([]);
  };

  const handleArchiveSelected = () => {
    if (selectedTags.length === 0) return;
    setTags(prev =>
      prev.map(tag =>
        selectedTags.includes(tag.id)
          ? { ...tag, status: 'Archived' as const }
          : tag
      )
    );
    setSelectedTags([]);
  };

  const handleActivateSelected = () => {
    if (selectedTags.length === 0) return;
    setTags(prev =>
      prev.map(tag =>
        selectedTags.includes(tag.id)
          ? { ...tag, status: 'Active' as const }
          : tag
      )
    );
    setSelectedTags([]);
  };

  // Define table columns
  const tableColumns: TableColumn<Tag>[] = [
    {
      key: 'name',
      label: 'NAME',
      render: (tag: Tag) => (
        <div className="text-sm font-medium text-primary">{tag.name}</div>
      ),
    },
    {
      key: 'icon',
      label: 'ICON',
      render: (tag: Tag) => (
        <div className="text-sm text-primary">{tag.icon ? tag.icon : '—'}</div>
      ),
    },
    {
      key: 'backgroundEnabled',
      label: 'BACKGROUND ENABLED',
      render: (tag: Tag) => (
        <span className="text-sm text-primary">
          {tag.backgroundEnabled ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'color',
      label: 'COLOR',
      render: (tag: Tag) => (
        <div className="flex items-center space-x-2">
          {tag.color ? (
            <div
              className="w-4 h-4 rounded-full border border-hover"
              style={{ backgroundColor: tag.color }}
            />
          ) : (
            <span className="text-sm text-primary">—</span>
          )}
        </div>
      ),
    },
    {
      key: 'isPublic',
      label: 'PUBLIC',
      render: (tag: Tag) => (
        <span className="text-sm text-primary">
          {tag.isPublic ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'displayFormat',
      label: 'DISPLAY FORMAT',
      render: (tag: Tag) => (
        <span className="text-sm text-primary">{tag.displayFormat}</span>
      ),
    },
    {
      key: 'peopleCount',
      label: 'PEOPLE COUNT',
      render: (tag: Tag) => (
        <span className="text-sm text-primary">{tag.peopleCount}</span>
      ),
    },
  ];

  return (
    <ContentContainer
      onToggleSidebar={onToggleSidebar}
      title="Tags"
      breadcrumb="Configure"
      onBreadcrumbClick={onBack}
      actions={<Button variant="primary">New tag</Button>}
      filters={filters}
      activeFilters={activeFilters}
      onFilterChange={setActiveFilters}
      showAllFilters={showAllFilters}
      onShowAllFiltersChange={setShowAllFilters}
    >
      {/* Actions */}
      <Actions
        selectedCount={selectedTags.length}
        totalCount={paginatedTags.length}
        onDeleteSelected={handleDeleteSelected}
        selectedData={paginatedTags.filter(tag =>
          selectedTags.includes(tag.id)
        )}
        exportFilename="tags.csv"
        onShowAllFilters={() => setShowAllFilters(!showAllFilters)}
        bulkActions={[
          {
            id: 'export',
            label: 'Export selected',
            onClick: () => {
              const selectedData = paginatedTags.filter(tag =>
                selectedTags.includes(tag.id)
              );
              exportToCSV(selectedData, 'tags.csv');
            },
            disabled: selectedTags.length === 0,
          },
          {
            id: 'activate',
            label: 'Activate selected',
            onClick: handleActivateSelected,
            disabled: selectedTags.length === 0,
          },
          {
            id: 'archive',
            label: 'Archive selected',
            onClick: handleArchiveSelected,
            disabled: selectedTags.length === 0,
          },
          {
            id: 'delete',
            label: 'Delete selected',
            onClick: handleDeleteSelected,
            disabled: selectedTags.length === 0,
          },
        ]}
      />

      {/* Table */}
      <Table
        columns={tableColumns}
        data={paginatedTags}
        selectedItems={selectedTags}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
      />

      {/* Pagination */}
      <Pagination
        count={mockTags.length}
        page={currentPage}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </ContentContainer>
  );
};

export default Tags;
