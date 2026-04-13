import React, { useState, useEffect } from 'react';
import { User, AudienceData } from '../types';
import { saveAudienceData, loadAudienceData } from '../data/mockData';
import { applyFilters } from '../utils/filterHelpers';
import { TableEnhanced as Table, TableColumn } from './ui';
import ContentContainer from './ContentContainer';
import { FilterOption, FilterCondition } from './ui/filter-modal';
import Actions from './ui/actions';
import Pagination from './ui/pagination';
import { Button } from '@circleco/compass/components/Button';
import EditModal from './ManageAudience/EditModal';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Badge } from '@circleco/compass/components/Badge';

interface ManageAudienceProps {
  audienceData: AudienceData;
  onToggleSidebar: () => void;
  onDataChange?: (data: AudienceData) => void;
}

type TabType = 'all' | 'contacts' | 'members' | 'invited' | 'moderators';

const ManageAudience: React.FC<ManageAudienceProps> = ({
  audienceData,
  onToggleSidebar,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode] = useState<'add' | 'edit'>('add');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [showAllFilters, setShowAllFilters] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = loadAudienceData();
    // Properly update the audienceData object
    audienceData.all = [...savedData.all];
    audienceData.contacts = [...savedData.contacts];
    audienceData.members = [...savedData.members];
    audienceData.invited = [...savedData.invited];
    audienceData.moderators = [...savedData.moderators];
    setDataVersion(prev => prev + 1);
  }, [audienceData]);

  // Effect to handle data updates and refresh current tab
  useEffect(() => {
    // This will trigger when audienceData changes
    // Force re-render of current tab
  }, [
    audienceData.all,
    audienceData.contacts,
    audienceData.members,
    audienceData.invited,
    audienceData.moderators,
    dataVersion,
  ]);

  const getCurrentUsers = (): User[] => {
    let users: User[] = [];
    switch (activeTab) {
      case 'all':
        users = audienceData.all;
        break;
      case 'contacts':
        users = audienceData.contacts;
        break;
      case 'members':
        users = audienceData.members;
        break;
      case 'invited':
        users = audienceData.invited;
        break;
      case 'moderators':
        users = audienceData.moderators;
        break;
      default:
        users = audienceData.all;
    }

    // Apply filters
    return applyFilters(users, activeFilters);
  };

  const currentUsers = getCurrentUsers();

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = currentUsers.slice(startIndex, endIndex);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabType);
    setCurrentPage(1);
    setSelectedUsers([]);
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(user => user.id));
    }
  };

  const handleSelectItem = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleDeleteSelected = () => {
    setSelectedUsers([]);
  };

  const handleSaveSegment = async () => {
    setIsLoading(true);
    try {
      await saveAudienceData(audienceData);
      setHasUnsavedChanges(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch {
      // Save failed – optionally report to error service
    } finally {
      setIsLoading(false);
    }
  };

  const tableColumns: TableColumn<User>[] = [
    {
      key: 'name',
      label: 'NAME',
      render: (user: User) => (
        <div className="flex items-center space-x-3">
          <Avatar src={user.profileImage} name={user.name} size="sm" />
          <div>
            <div className="text-sm font-medium text-primary">{user.name}</div>
            <div className="text-sm text-tertiary">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'ROLE',
      render: (user: User) => {
        let variant: 'destructive' | 'info' | 'success' | 'secondary' =
          'secondary';
        if (user.role === 'Admin') variant = 'destructive';
        else if (user.role === 'Moderator') variant = 'info';
        else if (user.role === 'Member') variant = 'success';
        return <Badge label={user.role} variant={variant} />;
      },
    },
    {
      key: 'emailMarketing',
      label: 'EMAIL MARKETING',
      render: (user: User) => (
        <Badge
          label={user.emailMarketing ? 'Subscribed' : 'Unsubscribed'}
          variant={user.emailMarketing ? 'success' : 'secondary'}
        />
      ),
    },
    {
      key: 'dateAdded',
      label: 'DATE ADDED',
      render: (user: User) => (
        <span className="text-sm text-secondary">{user.dateAdded}</span>
      ),
    },
  ];

  const tabs = [
    { label: 'All', value: 'all', badge: audienceData.all.length.toString() },
    {
      label: 'Contacts',
      value: 'contacts',
      badge: audienceData.contacts.length.toString(),
    },
    {
      label: 'Members',
      value: 'members',
      badge: audienceData.members.length.toString(),
    },
    {
      label: 'Invited',
      value: 'invited',
      badge: audienceData.invited.length.toString(),
    },
    {
      label: 'Moderators',
      value: 'moderators',
      badge: audienceData.moderators.length.toString(),
    },
  ];

  const filterOptions: FilterOption[] = [
    { id: 'name', label: 'Name', type: 'text' },
    { id: 'email', label: 'Email', type: 'text' },
    { id: 'role', label: 'Role', type: 'text' },
    { id: 'emailMarketing', label: 'Email Marketing', type: 'boolean' },
    { id: 'member', label: 'Member', type: 'boolean' },
    { id: 'location', label: 'Location', type: 'text' },
  ];

  return (
    <>
      <ContentContainer
        onToggleSidebar={onToggleSidebar}
        title="Manage audience"
        actions={
          <div className="flex items-center space-x-3">
            {hasUnsavedChanges && (
              <Button
                variant="outline"
                onClick={handleSaveSegment}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save segment'}
              </Button>
            )}
            {showSaveSuccess && (
              <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm">
                ✓ Saved successfully!
              </div>
            )}
            <Button variant="primary">Add people</Button>
          </div>
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
        <div className="flex flex-col flex-1 min-h-0">
          {/* Actions */}
          <div className="shrink-0">
            <Actions
              selectedCount={selectedUsers.length}
              totalCount={paginatedUsers.length}
              onDeleteSelected={handleDeleteSelected}
              onShowAllFilters={() => setShowAllFilters(!showAllFilters)}
            />
          </div>

          {/* Table */}
          <Table
            columns={tableColumns}
            data={paginatedUsers}
            selectedItems={selectedUsers}
            onSelectAll={handleSelectAll}
            onSelectItem={handleSelectItem}
          />

          {/* Pagination – fixed at bottom */}
          <Pagination
            count={currentUsers.length}
            page={currentPage}
            pageSize={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </ContentContainer>

      {/* Edit Modal */}
      <EditModal
        user={editingUser}
        isOpen={isModalOpen}
        mode={modalMode}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onSave={_userData => {
          // Handle save logic
          setIsModalOpen(false);
          setEditingUser(null);
        }}
      />
    </>
  );
};

export default ManageAudience;
