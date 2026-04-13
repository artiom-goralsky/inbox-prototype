import React, { useState } from 'react';
import { TableEnhanced as Table, TableColumn } from '../ui';
import ContentContainer from '../ContentContainer';
import Actions from '../ui/actions';
import Pagination from '../ui/pagination';
import { exportToCSV } from '../../utils/csvExport';
import { FilterCondition } from '../ui/filter-modal';
import { Badge } from '@circleco/compass/components/Badge';
import { Button } from '@circleco/compass/components/Button';
import { IconButton } from '@circleco/compass/components/IconButton';

interface InviteLink {
  id: string;
  url: string;
  status: 'Active' | 'Expired' | 'Paused';
  createdBy: {
    name: string;
    initials: string;
    color: string;
  };
  clicks: number;
  signups: number;
  expiresAt: string;
}

interface InviteLinksProps {
  onToggleSidebar: () => void;
}

const InviteLinks: React.FC<InviteLinksProps> = ({ onToggleSidebar }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [showAllFilters, setShowAllFilters] = useState(false);

  // Mock data for invite links
  const [rows, setRows] = useState<InviteLink[]>([
    {
      id: '1',
      url: 'https://circle.com/invite/abc123',
      status: 'Active',
      createdBy: {
        name: 'John Doe',
        initials: 'JD',
        color: 'bg-blue-500',
      },
      clicks: 45,
      signups: 12,
      expiresAt: 'Never',
    },
    {
      id: '2',
      url: 'https://circle.com/invite/def456',
      status: 'Active',
      createdBy: {
        name: 'Jane Smith',
        initials: 'JS',
        color: 'bg-green-500',
      },
      clicks: 23,
      signups: 8,
      expiresAt: '2024-12-31',
    },
    {
      id: '3',
      url: 'https://circle.com/invite/ghi789',
      status: 'Expired',
      createdBy: {
        name: 'Mike Johnson',
        initials: 'MJ',
        color: 'bg-purple-500',
      },
      clicks: 67,
      signups: 15,
      expiresAt: '2024-01-15',
    },
    {
      id: '4',
      url: 'https://circle.com/invite/jkl012',
      status: 'Paused',
      createdBy: {
        name: 'Sarah Wilson',
        initials: 'SW',
        color: 'bg-orange-500',
      },
      clicks: 12,
      signups: 3,
      expiresAt: '2024-06-30',
    },
  ]);

  // Apply filters
  const filteredLinks = rows.filter(link => {
    return activeFilters.every(filter => {
      switch (filter.field) {
        case 'status': {
          return filter.operator === 'is'
            ? link.status === filter.value
            : link.status !== filter.value;
        }
        case 'url': {
          const url = link.url.toLowerCase();
          const searchValue = filter.value.toLowerCase();
          return filter.operator === 'contains'
            ? url.includes(searchValue)
            : !url.includes(searchValue);
        }
        case 'createdBy': {
          const createdBy = link.createdBy.name.toLowerCase();
          const createdBySearchValue = filter.value.toLowerCase();
          return filter.operator === 'contains'
            ? createdBy.includes(createdBySearchValue)
            : !createdBy.includes(createdBySearchValue);
        }
        default:
          return true;
      }
    });
  });

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredLinks.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    if (selectedLinks.length === paginatedData.length) {
      setSelectedLinks([]);
    } else {
      setSelectedLinks(paginatedData.map(link => link.id));
    }
  };

  const handleSelectItem = (linkId: string) => {
    setSelectedLinks(prev =>
      prev.includes(linkId)
        ? prev.filter(id => id !== linkId)
        : [...prev, linkId]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedLinks.length === 0) return;
    setRows(prev => prev.filter(link => !selectedLinks.includes(link.id)));
    setSelectedLinks([]);
  };

  // Filter configuration
  const filters = [
    {
      id: 'status',
      label: 'Status',
      type: 'select' as const,
      options: ['Active', 'Expired', 'Paused'],
    },
    {
      id: 'url',
      label: 'URL',
      type: 'text' as const,
    },
    {
      id: 'createdBy',
      label: 'Created By',
      type: 'text' as const,
    },
  ];

  const handleCopySelected = () => {
    if (selectedLinks.length === 0) return;
    const selectedData = rows.filter(link => selectedLinks.includes(link.id));
    const urls = selectedData.map(link => link.url).join('\n');
    navigator.clipboard.writeText(urls);
  };

  const handleArchiveSelected = () => {
    if (selectedLinks.length === 0) return;
    setRows(prev =>
      prev.map(link =>
        selectedLinks.includes(link.id)
          ? { ...link, status: 'Expired' as const }
          : link
      )
    );
    setSelectedLinks([]);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const tableColumns: TableColumn<InviteLink>[] = [
    {
      key: 'url',
      label: 'URL',
      render: (link: InviteLink) => (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-primary font-medium">{link.url}</span>
          <IconButton
            variant="ghost"
            size="sm"
            icon="copy"
            aria-label="Copy invite link URL"
            onClick={() => handleCopyUrl(link.url)}
          />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (link: InviteLink) => {
        let variant: 'success' | 'destructive' | 'warning' = 'warning';
        if (link.status === 'Active') variant = 'success';
        else if (link.status === 'Expired') variant = 'destructive';
        return <Badge label={link.status} variant={variant} />;
      },
    },
    {
      key: 'createdBy',
      label: 'CREATED BY',
      render: (link: InviteLink) => (
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 rounded-full ${link.createdBy.color} flex items-center justify-center`}
          >
            <span className="text-xs text-white font-medium">
              {link.createdBy.initials}
            </span>
          </div>
          <span className="text-sm text-primary">{link.createdBy.name}</span>
        </div>
      ),
    },
    {
      key: 'clicks',
      label: 'CLICKS',
      render: (link: InviteLink) => (
        <span className="text-sm text-secondary">{link.clicks}</span>
      ),
    },
    {
      key: 'signups',
      label: 'SIGNUPS',
      render: (link: InviteLink) => (
        <span className="text-sm text-secondary">{link.signups}</span>
      ),
    },
    {
      key: 'expiresAt',
      label: 'EXPIRES AT',
      render: (link: InviteLink) => (
        <span className="text-sm text-secondary">{link.expiresAt}</span>
      ),
    },
  ];

  return (
    <ContentContainer
      onToggleSidebar={onToggleSidebar}
      title="Invite links"
      actions={<Button variant="primary">New invite link</Button>}
      filters={filters}
      activeFilters={activeFilters}
      onFilterChange={setActiveFilters}
      showAllFilters={showAllFilters}
      onShowAllFiltersChange={setShowAllFilters}
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Actions */}
        <div className="shrink-0">
          <Actions
            selectedCount={selectedLinks.length}
            totalCount={paginatedData.length}
            onDeleteSelected={handleDeleteSelected}
            selectedData={paginatedData.filter(link =>
              selectedLinks.includes(link.id)
            )}
            exportFilename="invite-links.csv"
            onShowAllFilters={() => setShowAllFilters(!showAllFilters)}
            bulkActions={[
              {
                id: 'export',
                label: 'Export selected',
                onClick: () => {
                  const selectedData = paginatedData.filter(link =>
                    selectedLinks.includes(link.id)
                  );
                  exportToCSV(selectedData, 'invite-links.csv');
                },
                disabled: selectedLinks.length === 0,
              },
              {
                id: 'copy',
                label: 'Copy URLs',
                onClick: handleCopySelected,
                disabled: selectedLinks.length === 0,
              },
              {
                id: 'archive',
                label: 'Archive selected',
                onClick: handleArchiveSelected,
                disabled: selectedLinks.length === 0,
              },
              {
                id: 'delete',
                label: 'Delete selected',
                onClick: handleDeleteSelected,
                disabled: selectedLinks.length === 0,
              },
            ]}
          />
        </div>

        {/* Table */}
        <Table
          columns={tableColumns}
          data={paginatedData}
          selectedItems={selectedLinks}
          onSelectAll={handleSelectAll}
          onSelectItem={handleSelectItem}
        />

        {/* Pagination – fixed at bottom */}
        <Pagination
          count={rows.length}
          page={currentPage}
          pageSize={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </ContentContainer>
  );
};

export default InviteLinks;
