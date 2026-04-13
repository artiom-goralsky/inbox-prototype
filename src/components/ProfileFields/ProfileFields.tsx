import React, { useState } from 'react';
import { mockProfileFields, ProfileField } from '../../data/mockData';
import { TableEnhanced as Table, TableColumn } from '../ui';
import ContentContainer from '../ContentContainer';
import Actions from '../ui/actions';
import Pagination from '../ui/pagination';
import { Button } from '@circleco/compass/components/Button';
import { Badge } from '@circleco/compass/components/Badge';

interface ProfileFieldsProps {
  onToggleSidebar: () => void;
  onBack?: () => void;
}

type TabType = 'Active' | 'Archived';

const ProfileFields: React.FC<ProfileFieldsProps> = ({ onToggleSidebar, onBack }) => {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>('Active');
  const itemsPerPage = 20;

  const currentFields = mockProfileFields.filter(
    (field: ProfileField) => field.status === activeTab
  );
  const totalPages = Math.ceil(currentFields.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFields = currentFields.slice(startIndex, endIndex);

  const activeCount = mockProfileFields.filter(
    (field: ProfileField) => field.status === 'Active'
  ).length;
  const archivedCount = mockProfileFields.filter(
    (field: ProfileField) => field.status === 'Archived'
  ).length;

  const handleSelectAll = () => {
    if (selectedFields.length === paginatedFields.length) {
      setSelectedFields([]);
    } else {
      setSelectedFields(paginatedFields.map((field: ProfileField) => field.id));
    }
  };

  const handleSelectItem = (fieldId: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabType);
    setCurrentPage(1);
    setSelectedFields([]);
  };

  const handleDeleteSelected = () => {
    setSelectedFields([]);
  };

  // Define table columns
  const tableColumns: TableColumn<ProfileField>[] = [
    {
      key: 'fieldLabel',
      label: 'FIELD LABEL',
      render: (field: ProfileField) => (
        <div className="text-sm font-medium text-primary">
          {field.fieldLabel}
        </div>
      ),
    },
    {
      key: 'fieldType',
      label: 'FIELD TYPE',
      render: (field: ProfileField) => (
        <span className="text-sm text-primary">{field.fieldType}</span>
      ),
    },
    {
      key: 'displaysOn',
      label: 'DISPLAYS ON',
      render: (field: ProfileField) => (
        <span className="text-sm text-secondary">
          {field.displaysOn.join(', ')}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (field: ProfileField) => (
        <Badge
          label={field.status}
          variant={field.status === 'Active' ? 'success' : 'secondary'}
        />
      ),
    },
  ];

  const tabs = [
    { label: 'Active', value: 'Active', badge: activeCount.toString() },
    { label: 'Archived', value: 'Archived', badge: archivedCount.toString() },
  ];

  return (
    <ContentContainer
      onToggleSidebar={onToggleSidebar}
      title="Profile fields"
      breadcrumb="Configure"
      onBreadcrumbClick={onBack}
      actions={<Button variant="primary">New field</Button>}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      {/* Actions */}
      <Actions
        selectedCount={selectedFields.length}
        totalCount={paginatedFields.length}
        onDeleteSelected={handleDeleteSelected}
      />

      {/* Table */}
      <Table
        columns={tableColumns}
        data={paginatedFields}
        selectedItems={selectedFields}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
      />

      {/* Pagination */}
      <Pagination
        count={currentFields.length}
        page={currentPage}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </ContentContainer>
  );
};

export default ProfileFields;
