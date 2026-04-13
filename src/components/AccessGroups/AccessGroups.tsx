import React, { useState, useEffect } from 'react';
import { TableEnhanced as Table, TableColumn } from '../ui';
import ContentContainer from '../ContentContainer';
import Actions from '../ui/actions';
import Pagination from '../ui/pagination';
import { exportToCSV } from '../../utils/csvExport';
import { Button } from '@circleco/compass/components/Button';
import { FilterCondition } from '../ui/filter-modal';
import { Badge } from '@circleco/compass/components/Badge';

interface AccessGroup {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Archived';
  members: number;
  createdBy: {
    name: string;
    initials: string;
    color: string;
  };
  createdAt: string;
}

interface AccessGroupsProps {
  onToggleSidebar: () => void;
  onBack?: () => void;
}

const AccessGroups: React.FC<AccessGroupsProps> = ({ onToggleSidebar, onBack }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [showAllFilters, setShowAllFilters] = useState(false);

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedGroups([]);
  }, [activeTab]);

  // Mock data for access groups
  const [rows, setRows] = useState<AccessGroup[]>([
    {
      id: '1',
      name: 'Administrators',
      description: 'Full access to all features and settings',
      status: 'Active',
      members: 5,
      createdBy: {
        name: 'John Doe',
        initials: 'JD',
        color: 'bg-blue-500',
      },
      createdAt: 'Jan 15, 2024',
    },
    {
      id: '2',
      name: 'Moderators',
      description: 'Can moderate content and manage users',
      status: 'Active',
      members: 12,
      createdBy: {
        name: 'Jane Smith',
        initials: 'JS',
        color: 'bg-green-500',
      },
      createdAt: 'Feb 3, 2024',
    },
    {
      id: '3',
      name: 'Premium Members',
      description: 'Access to premium features and content',
      status: 'Active',
      members: 45,
      createdBy: {
        name: 'Mike Johnson',
        initials: 'MJ',
        color: 'bg-purple-500',
      },
      createdAt: 'Mar 10, 2024',
    },
    {
      id: '4',
      name: 'Beta Testers',
      description: 'Early access to new features',
      status: 'Archived',
      members: 8,
      createdBy: {
        name: 'Sarah Wilson',
        initials: 'SW',
        color: 'bg-orange-500',
      },
      createdAt: 'Apr 5, 2024',
    },
  ]);

  // Filter data based on active tab
  // Filter configuration
  const filters = [
    {
      id: 'status',
      label: 'Status',
      type: 'select' as const,
      options: ['Active', 'Archived'],
    },
    {
      id: 'name',
      label: 'Name',
      type: 'text' as const,
    },
    {
      id: 'description',
      label: 'Description',
      type: 'text' as const,
    },
  ];

  const getFilteredData = () => {
    let filtered = rows;

    // Apply tab filter
    switch (activeTab) {
      case 'active':
        filtered = filtered.filter(group => group.status === 'Active');
        break;
      case 'archived':
        filtered = filtered.filter(group => group.status === 'Archived');
        break;
      default:
        // No tab filter
        break;
    }

    // Apply custom filters
    return filtered.filter(group => {
      return activeFilters.every(filter => {
        switch (filter.field) {
          case 'status': {
            return filter.operator === 'is'
              ? group.status === filter.value
              : group.status !== filter.value;
          }
          case 'name': {
            const name = group.name.toLowerCase();
            const searchValue = filter.value.toLowerCase();
            return filter.operator === 'contains'
              ? name.includes(searchValue)
              : !name.includes(searchValue);
          }
          case 'description': {
            const description = group.description.toLowerCase();
            const descriptionSearchValue = filter.value.toLowerCase();
            return filter.operator === 'contains'
              ? description.includes(descriptionSearchValue)
              : !description.includes(descriptionSearchValue);
          }
          default:
            return true;
        }
      });
    });
  };

  const filteredData = getFilteredData();
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    if (selectedGroups.length === paginatedData.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(paginatedData.map(group => group.id));
    }
  };

  const handleSelectItem = (groupId: string) => {
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedGroups([]);
  };

  const handleDeleteSelected = () => {
    if (selectedGroups.length === 0) return;
    setRows(prev => prev.filter(group => !selectedGroups.includes(group.id)));
    setSelectedGroups([]);
  };

  const handleArchiveSelected = () => {
    if (selectedGroups.length === 0) return;
    setRows(prev =>
      prev.map(group =>
        selectedGroups.includes(group.id)
          ? { ...group, status: 'Archived' as const }
          : group
      )
    );
    setSelectedGroups([]);
  };

  const tableColumns: TableColumn<AccessGroup>[] = [
    {
      key: 'name',
      label: 'NAME',
      render: (group: AccessGroup) => (
        <span className="text-sm text-primary font-medium">{group.name}</span>
      ),
    },
    {
      key: 'description',
      label: 'DESCRIPTION',
      render: (group: AccessGroup) => (
        <span className="text-sm text-secondary">{group.description}</span>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (group: AccessGroup) => (
        <Badge
          label={group.status}
          variant={group.status === 'Active' ? 'success' : 'secondary'}
        />
      ),
    },
    {
      key: 'members',
      label: 'MEMBERS',
      render: (group: AccessGroup) => (
        <span className="text-sm text-secondary">{group.members}</span>
      ),
    },
    {
      key: 'createdBy',
      label: 'CREATED BY',
      render: (group: AccessGroup) => (
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 rounded-full ${group.createdBy.color} flex items-center justify-center`}
          >
            <span className="text-xs text-white font-medium">
              {group.createdBy.initials}
            </span>
          </div>
          <span className="text-sm text-primary">{group.createdBy.name}</span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'CREATED AT',
      render: (group: AccessGroup) => (
        <span className="text-sm text-secondary">{group.createdAt}</span>
      ),
    },
  ];

  const tabs = [
    { label: 'All', value: 'all', badge: rows.length.toString() },
    {
      label: 'Active',
      value: 'active',
      badge: rows.filter(g => g.status === 'Active').length.toString(),
    },
    {
      label: 'Archived',
      value: 'archived',
      badge: rows.filter(g => g.status === 'Archived').length.toString(),
    },
  ];

  return (
    <ContentContainer
      onToggleSidebar={onToggleSidebar}
      title="Access groups"
      breadcrumb="Configure"
      onBreadcrumbClick={onBack}
      actions={<Button variant="primary">New access group</Button>}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      filters={filters}
      activeFilters={activeFilters}
      onFilterChange={setActiveFilters}
      showAllFilters={showAllFilters}
      onShowAllFiltersChange={setShowAllFilters}
    >
      {/* Actions */}
      <Actions
        selectedCount={selectedGroups.length}
        totalCount={paginatedData.length}
        onDeleteSelected={handleDeleteSelected}
        selectedData={paginatedData.filter(group =>
          selectedGroups.includes(group.id)
        )}
        exportFilename="access-groups.csv"
        onShowAllFilters={() => setShowAllFilters(!showAllFilters)}
        bulkActions={[
          {
            id: 'export',
            label: 'Export selected',
            onClick: () => {
              const selectedData = paginatedData.filter(group =>
                selectedGroups.includes(group.id)
              );
              exportToCSV(selectedData, 'access-groups.csv');
            },
            disabled: selectedGroups.length === 0,
          },
          {
            id: 'archive',
            label: 'Archive selected',
            onClick: handleArchiveSelected,
            disabled: selectedGroups.length === 0,
          },
          {
            id: 'delete',
            label: 'Delete selected',
            onClick: handleDeleteSelected,
            disabled: selectedGroups.length === 0,
          },
        ]}
      />

      {/* Table */}
      <Table
        columns={tableColumns}
        data={paginatedData}
        selectedItems={selectedGroups}
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

export default AccessGroups;
