import React, { useState } from 'react';
import { TableEnhanced as Table, TableColumn } from '../ui';
import ContentContainer from '../ContentContainer';
import { FilterOption, FilterCondition } from '../ui/filter-modal';
import Actions from '../ui/actions';
import Pagination from '../ui/pagination';
import { Button } from '@circleco/compass/components/Button';
import { applyFilters } from '../../utils/filterHelpers';
import { Badge } from '@circleco/compass/components/Badge';

interface Content {
  id: string;
  postTitle: string;
  type: 'Post' | 'Comment' | 'Message';
  author: {
    name: string;
    initials: string;
    color: string;
  };
  reportedBy: {
    name: string;
    isAutomatic: boolean;
  };
  published: string;
  reports: number;
}

interface ModerationProps {
  onToggleSidebar: () => void;
}

const Moderation: React.FC<ModerationProps> = ({ onToggleSidebar }) => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContents, setSelectedContents] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [showAllFilters, setShowAllFilters] = useState(false);

  // Mock data for different tabs
  const inboxContents: Content[] = [
    {
      id: '1',
      postTitle: 'Inappropriate content post',
      type: 'Post',
      author: {
        name: 'John Doe',
        initials: 'JD',
        color: 'bg-blue-500',
      },
      reportedBy: {
        name: 'Community',
        isAutomatic: true,
      },
      published: '2 hours ago',
      reports: 3,
    },
    {
      id: '2',
      postTitle: 'Spam comment on discussion',
      type: 'Comment',
      author: {
        name: 'Jane Smith',
        initials: 'JS',
        color: 'bg-green-500',
      },
      reportedBy: {
        name: 'Mike Johnson',
        isAutomatic: false,
      },
      published: '1 day ago',
      reports: 1,
    },
  ];

  const approvedContents: Content[] = [
    {
      id: '3',
      postTitle: 'Helpful community post',
      type: 'Post',
      author: {
        name: 'Sarah Wilson',
        initials: 'SW',
        color: 'bg-purple-500',
      },
      reportedBy: {
        name: 'Community',
        isAutomatic: true,
      },
      published: '3 days ago',
      reports: 1,
    },
  ];

  const rejectedContents: Content[] = [
    {
      id: '4',
      postTitle: 'Violation of community guidelines',
      type: 'Post',
      author: {
        name: 'Alex Brown',
        initials: 'AB',
        color: 'bg-red-500',
      },
      reportedBy: {
        name: 'Community',
        isAutomatic: true,
      },
      published: '1 week ago',
      reports: 5,
    },
  ];

  const getCurrentData = () => {
    let filtered: any[] = [];

    // First filter by tab
    switch (activeTab) {
      case 'inbox':
        filtered = inboxContents;
        break;
      case 'approved':
        filtered = approvedContents;
        break;
      case 'rejected':
        filtered = rejectedContents;
        break;
      default:
        filtered = inboxContents;
    }

    // Then apply additional filters
    return applyFilters(filtered, activeFilters);
  };

  const currentData = getCurrentData();
  const itemsPerPage = 10;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = currentData.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    if (selectedContents.length === paginatedData.length) {
      setSelectedContents([]);
    } else {
      setSelectedContents(paginatedData.map(content => content.id));
    }
  };

  const handleSelectItem = (contentId: string) => {
    setSelectedContents(prev =>
      prev.includes(contentId)
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedContents([]);
  };

  const handleDeleteSelected = () => {
    setSelectedContents([]);
  };

  const filterOptions: FilterOption[] = [
    { id: 'title', label: 'Title', type: 'text' },
    { id: 'author', label: 'Author', type: 'text' },
    { id: 'type', label: 'Type', type: 'text' },
    { id: 'status', label: 'Status', type: 'text' },
  ];

  const tableColumns: TableColumn<Content>[] = [
    {
      key: 'postTitle',
      label: 'POST TITLE',
      render: (content: Content) => (
        <span className="text-sm text-primary font-medium">
          {content.postTitle}
        </span>
      ),
    },
    {
      key: 'type',
      label: 'TYPE',
      render: (content: Content) => {
        let variant: 'info' | 'success' | 'indigo' = 'info';
        if (content.type === 'Comment') variant = 'success';
        else if (content.type === 'Message') variant = 'indigo';
        return <Badge label={content.type} variant={variant} />;
      },
    },
    {
      key: 'author',
      label: 'AUTHOR',
      render: (content: Content) => (
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 rounded-full ${content.author.color} flex items-center justify-center`}
          >
            <span className="text-xs text-white font-medium">
              {content.author.initials}
            </span>
          </div>
          <span className="text-sm text-primary">{content.author.name}</span>
        </div>
      ),
    },
    {
      key: 'reportedBy',
      label: 'REPORTED BY',
      render: (content: Content) => (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-secondary">
            {content.reportedBy.name}
          </span>
          {content.reportedBy.isAutomatic && (
            <span className="text-xs text-disabled">(Auto)</span>
          )}
        </div>
      ),
    },
    {
      key: 'published',
      label: 'PUBLISHED',
      render: (content: Content) => (
        <span className="text-sm text-secondary">{content.published}</span>
      ),
    },
    {
      key: 'reports',
      label: 'REPORTS',
      render: (content: Content) => (
        <span className="text-sm text-secondary">{content.reports}</span>
      ),
    },
  ];

  const tabs = [
    { label: 'Inbox', value: 'inbox', badge: inboxContents.length.toString() },
    {
      label: 'Approved',
      value: 'approved',
      badge: approvedContents.length.toString(),
    },
    {
      label: 'Rejected',
      value: 'rejected',
      badge: rejectedContents.length.toString(),
    },
  ];

  return (
    <ContentContainer
      onToggleSidebar={onToggleSidebar}
      title="Moderation"
      actions={
        activeTab === 'rejected' && (
          <Button variant="secondary">Export CSV</Button>
        )
      }
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      filters={filterOptions}
      activeFilters={activeFilters}
      onFilterChange={setActiveFilters}
      showAllFilters={showAllFilters}
      onShowAllFiltersChange={setShowAllFilters}
    >
      {/* Actions */}
      <Actions
        selectedCount={selectedContents.length}
        onShowAllFilters={() => setShowAllFilters(!showAllFilters)}
        totalCount={currentData.length}
        onDeleteSelected={handleDeleteSelected}
      />

      {/* Table */}
      <Table
        columns={tableColumns}
        data={paginatedData}
        selectedItems={selectedContents}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
      />

      {/* Pagination */}
      <Pagination
        count={currentData.length}
        page={currentPage}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </ContentContainer>
  );
};

export default Moderation;
