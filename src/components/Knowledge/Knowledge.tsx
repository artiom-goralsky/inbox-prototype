import React, { useState } from 'react';
import { TableEnhanced as Table, TableColumn } from '../ui';
import ContentContainer from '../ContentContainer';
import { FilterOption, FilterCondition } from '../ui/filter-modal';
import Actions from '../ui/actions';
import Pagination from '../ui/pagination';
import { Button } from '@circleco/compass/components/Button';
import { Badge } from '@circleco/compass/components/Badge';

interface KnowledgeItem {
  id: string;
  name: string;
  type: string;
  spaceGroup: string;
  itemsIncluded: number;
  usedInReplies: number;
}

interface KnowledgeProps {
  onToggleSidebar: () => void;
}

const Knowledge: React.FC<KnowledgeProps> = ({ onToggleSidebar }) => {
  const [activeTab, setActiveTab] = useState('community');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);

  const knowledgeData: KnowledgeItem[] = [
    {
      id: '1',
      name: 'Post space',
      type: 'Post',
      spaceGroup: 'Karthik-Menon',
      itemsIncluded: 2,
      usedInReplies: 0,
    },
    {
      id: '2',
      name: 'new locked',
      type: 'Course',
      spaceGroup: 'Ivo test',
      itemsIncluded: 13,
      usedInReplies: 0,
    },
    {
      id: '3',
      name: "Ivo's course test",
      type: 'Course',
      spaceGroup: 'Ivo test',
      itemsIncluded: 0,
      usedInReplies: 0,
    },
    {
      id: '4',
      name: 'Marketing Strategies',
      type: 'Post',
      spaceGroup: 'Marketing Team',
      itemsIncluded: 5,
      usedInReplies: 0,
    },
    {
      id: '5',
      name: 'Product Updates',
      type: 'Post',
      spaceGroup: 'Product Team',
      itemsIncluded: 3,
      usedInReplies: 0,
    },
  ];

  const columns: TableColumn<KnowledgeItem>[] = [
    {
      key: 'name',
      label: 'NAME',
      render: (item: KnowledgeItem) => (
        <span className="font-medium text-primary">{item.name}</span>
      ),
    },
    {
      key: 'type',
      label: 'TYPE',
      render: (item: KnowledgeItem) => (
        <Badge label={item.type} variant="secondary" />
      ),
    },
    {
      key: 'spaceGroup',
      label: 'SPACE GROUP',
      render: (item: KnowledgeItem) => (
        <span className="text-primary">{item.spaceGroup}</span>
      ),
    },
    {
      key: 'itemsIncluded',
      label: 'ITEMS INCLUDED',
      render: (item: KnowledgeItem) => (
        <span className="text-primary">{item.itemsIncluded}</span>
      ),
    },
    {
      key: 'usedInReplies',
      label: 'USED IN REPLIES',
      render: (item: KnowledgeItem) => (
        <span className="text-primary">{item.usedInReplies}</span>
      ),
    },
  ];

  const tabs = [
    {
      label: 'Community',
      value: 'community',
      badge: knowledgeData
        .filter(item => item.spaceGroup !== 'Custom')
        .length.toString(),
    },
    {
      label: 'Custom',
      value: 'custom',
      badge: knowledgeData
        .filter(item => item.spaceGroup === 'Custom')
        .length.toString(),
    },
  ];

  const filterOptions: FilterOption[] = [
    { id: 'name', label: 'Name', type: 'text' },
    { id: 'type', label: 'Type', type: 'text' },
    { id: 'spaceGroup', label: 'Space Group', type: 'text' },
    { id: 'itemsIncluded', label: 'Items Included', type: 'text' },
    { id: 'usedInReplies', label: 'Used in Replies', type: 'text' },
  ];

  // Filter data based on active tab
  const getFilteredData = () => {
    switch (activeTab) {
      case 'community':
        return knowledgeData.filter(item => item.spaceGroup !== 'Custom');
      case 'custom':
        return knowledgeData.filter(item => item.spaceGroup === 'Custom');
      default:
        return knowledgeData;
    }
  };

  const filteredData = getFilteredData();
  const totalItems = filteredData.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setSelectedItems([]);
  };

  const handleSelectAll = () => {
    if (selectedItems.length === currentData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentData.map(item => item.id));
    }
  };

  const handleSelectItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  return (
    <ContentContainer
      title="Knowledge"
      onToggleSidebar={onToggleSidebar}
      actions={
        <div className="flex items-center space-x-3">
          <Button variant="primary">Add space</Button>
        </div>
      }
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      filters={filterOptions}
      activeFilters={activeFilters}
      onFilterChange={setActiveFilters}
    >
      {/* Actions */}
      <Actions
        selectedCount={selectedItems.length}
        totalCount={currentData.length}
        onDeleteSelected={() => {
          // Handle delete selected
          setSelectedItems([]);
        }}
      />

      {/* Table */}
      <Table
        columns={columns}
        data={currentData}
        selectedItems={selectedItems}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
      />

      {/* Pagination */}
      <Pagination
        count={totalItems}
        page={currentPage}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </ContentContainer>
  );
};

export default Knowledge;
