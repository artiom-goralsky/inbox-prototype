import React, { useState } from 'react';
import { mockPages, Page } from '../../data/Content/mockData';
import { TableEnhanced as Table, TableColumn } from '../ui';
import ContentContainer from '../ContentContainer';
import Actions from '../ui/actions';
import Pagination from '../ui/pagination';
import { Button } from '@circleco/compass/components/Button';
import TemplateLibrary from '../PageEditor/TemplateLibrary';
import { Badge } from '@circleco/compass/components/Badge';

interface ContentProps {
  onToggleSidebar: () => void;
  title?: string;
  createButtonText?: string;
  filters?: string[];
  columns?: string[];
  icon?: React.ReactNode;
  onPageClick?: (pageId: string) => void;
  onCreatePage?: (templateId?: string) => void;
}

const Content: React.FC<ContentProps> = ({
  onToggleSidebar,
  title = 'Pages',
  createButtonText = 'Create page',
  onPageClick,
  onCreatePage,
}) => {
  const [pages] = useState(mockPages);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const itemsPerPage = 20;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = pages.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    if (selectedPages.length === paginatedData.length) {
      setSelectedPages([]);
    } else {
      setSelectedPages(paginatedData.map(page => page.id));
    }
  };

  const handleSelectItem = (pageId: string) => {
    setSelectedPages(prev =>
      prev.includes(pageId)
        ? prev.filter(id => id !== pageId)
        : [...prev, pageId]
    );
  };

  const handleDeleteSelected = () => {
    setSelectedPages([]);
  };

  const handleCreatePageClick = () => {
    setShowTemplateModal(true);
  };

  const handleTemplateSelect = (templateId: string) => {
    setShowTemplateModal(false);
    onCreatePage?.(templateId); // Pass the templateId to open editor with selected template
  };

  // Define table columns
  const tableColumns: TableColumn<Page>[] = [
    {
      key: 'title',
      label: 'Name',
      render: (page: Page) => (
        <div className="text-sm font-medium text-primary">{page.title}</div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (page: Page) => (
        <Badge
          label={page.status === 'Published' ? 'Published' : 'Not published'}
          variant={page.status === 'Published' ? 'success' : 'secondary'}
        />
      ),
    },
    {
      key: 'author',
      label: 'Author',
      render: (page: Page) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs text-secondary">
              {page.author.name
                .split(' ')
                .map(n => n[0])
                .join('')}
            </span>
          </div>
          <span className="text-sm text-primary">{page.author.name}</span>
        </div>
      ),
    },
    {
      key: 'updated',
      label: 'Updated',
      render: (page: Page) => (
        <div className="text-sm text-secondary">{page.updated}</div>
      ),
    },
  ];

  return (
    <ContentContainer
      onToggleSidebar={onToggleSidebar}
      title={title}
      actions={
        <Button variant="primary" onClick={handleCreatePageClick}>
          {createButtonText}
        </Button>
      }
    >
      {/* Actions */}
      <Actions
        selectedCount={selectedPages.length}
        totalCount={paginatedData.length}
        onDeleteSelected={handleDeleteSelected}
      />

      {/* Table */}
      <Table
        columns={tableColumns}
        data={paginatedData}
        selectedItems={selectedPages}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        onRowClick={item => onPageClick?.(item.id)}
      />

      {/* Pagination */}
      <Pagination
        count={pages.length}
        page={currentPage}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* Template Library Modal */}
      {showTemplateModal && (
        <TemplateLibrary
          onClose={() => setShowTemplateModal(false)}
          onSelectTemplate={handleTemplateSelect}
        />
      )}
    </ContentContainer>
  );
};

export default Content;
