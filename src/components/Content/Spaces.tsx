import React, { useState } from 'react';
import { TableEnhanced as Table, TableColumn } from '../ui';
import ContentContainer from '../ContentContainer';
import { FilterOption, FilterCondition } from '../ui/filter-modal';
import Actions from '../ui/actions';
import Pagination from '../ui/pagination';
import { Button } from '@circleco/compass/components/Button';
import { applyFilters } from '../../utils/filterHelpers';
import { Badge } from '@circleco/compass/components/Badge';

interface Space {
  id: string;
  name: string;
  type: 'Public' | 'Private' | 'Secret';
  members: number;
  moderators: number;
  access: 'Open' | 'Approval Required' | 'Invite Only';
  whoCanPost: 'All members' | 'Moderators only' | 'Admins only';
  membersCanInvite: boolean;
  hideMemberCount: boolean;
  createdBy: {
    name: string;
    initials: string;
    color: string;
  };
  createdAt: string;
}

interface SpacesProps {
  onToggleSidebar: () => void;
}

const Spaces: React.FC<SpacesProps> = ({ onToggleSidebar }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSpaces, setSelectedSpaces] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [showAllFilters, setShowAllFilters] = useState(false);

  // Mock data for spaces
  const mockSpaces: Space[] = [
    {
      id: '1',
      name: 'General Discussion',
      type: 'Public',
      members: 1250,
      moderators: 8,
      access: 'Open',
      whoCanPost: 'All members',
      membersCanInvite: true,
      hideMemberCount: false,
      createdBy: {
        name: 'John Doe',
        initials: 'JD',
        color: 'bg-blue-500',
      },
      createdAt: 'Jan 15, 2024',
    },
    {
      id: '2',
      name: 'Premium Content',
      type: 'Private',
      members: 450,
      moderators: 5,
      access: 'Invite Only',
      whoCanPost: 'Moderators only',
      membersCanInvite: false,
      hideMemberCount: true,
      createdBy: {
        name: 'Jane Smith',
        initials: 'JS',
        color: 'bg-green-500',
      },
      createdAt: 'Feb 3, 2024',
    },
    {
      id: '3',
      name: 'Admin Only',
      type: 'Secret',
      members: 12,
      moderators: 3,
      access: 'Invite Only',
      whoCanPost: 'Admins only',
      membersCanInvite: false,
      hideMemberCount: true,
      createdBy: {
        name: 'Mike Johnson',
        initials: 'MJ',
        color: 'bg-purple-500',
      },
      createdAt: 'Mar 10, 2024',
    },
  ];

  // Filter and pagination logic
  const getFilteredData = () => {
    return applyFilters(mockSpaces, activeFilters);
  };

  const filteredData = getFilteredData();
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    if (selectedSpaces.length === paginatedData.length) {
      setSelectedSpaces([]);
    } else {
      setSelectedSpaces(paginatedData.map(space => space.id));
    }
  };

  const handleSelectItem = (spaceId: string) => {
    setSelectedSpaces(prev =>
      prev.includes(spaceId)
        ? prev.filter(id => id !== spaceId)
        : [...prev, spaceId]
    );
  };

  const handleDeleteSelected = () => {
    setSelectedSpaces([]);
  };

  const tableColumns: TableColumn<Space>[] = [
    {
      key: 'name',
      label: 'NAME',
      render: (space: Space) => (
        <span className="text-sm text-primary font-medium">{space.name}</span>
      ),
    },
    {
      key: 'type',
      label: 'TYPE',
      render: (space: Space) => {
        let variant: 'success' | 'warning' | 'destructive' = 'success';
        if (space.type === 'Private') variant = 'warning';
        else if (space.type === 'Secret') variant = 'destructive';
        return <Badge label={space.type} variant={variant} />;
      },
    },
    {
      key: 'members',
      label: 'MEMBERS',
      render: (space: Space) => (
        <span className="text-sm text-secondary">{space.members}</span>
      ),
    },
    {
      key: 'moderators',
      label: 'MODERATORS',
      render: (space: Space) => (
        <span className="text-sm text-secondary">{space.moderators}</span>
      ),
    },
    {
      key: 'access',
      label: 'ACCESS',
      render: (space: Space) => (
        <span className="text-sm text-secondary">{space.access}</span>
      ),
    },
    {
      key: 'whoCanPost',
      label: 'WHO CAN POST',
      render: (space: Space) => (
        <span className="text-sm text-secondary">{space.whoCanPost}</span>
      ),
    },
    {
      key: 'membersCanInvite',
      label: 'MEMBERS CAN INVITE',
      render: (space: Space) => (
        <span className="text-sm text-secondary">
          {space.membersCanInvite ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'hideMemberCount',
      label: 'HIDE MEMBER COUNT',
      render: (space: Space) => (
        <span className="text-sm text-secondary">
          {space.hideMemberCount ? 'Yes' : 'No'}
        </span>
      ),
    },
  ];

  const filterOptions: FilterOption[] = [
    { id: 'name', label: 'Name', type: 'text' },
    { id: 'type', label: 'Type', type: 'text' },
    { id: 'access', label: 'Access', type: 'text' },
    { id: 'spaceGroupAccess', label: 'Space group access', type: 'text' },
  ];

  return (
    <ContentContainer
      onToggleSidebar={onToggleSidebar}
      title="Spaces"
      actions={<Button variant="primary">New space</Button>}
      filters={filterOptions}
      activeFilters={activeFilters}
      onFilterChange={setActiveFilters}
      showAllFilters={showAllFilters}
      onShowAllFiltersChange={setShowAllFilters}
    >
      {/* Actions */}
      <Actions
        selectedCount={selectedSpaces.length}
        onShowAllFilters={() => setShowAllFilters(!showAllFilters)}
        totalCount={filteredData.length}
        onDeleteSelected={handleDeleteSelected}
      />

      {/* Table */}
      <Table
        columns={tableColumns}
        data={paginatedData}
        selectedItems={selectedSpaces}
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

export default Spaces;
