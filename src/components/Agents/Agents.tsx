import React, { useState } from 'react';
import { TableEnhanced as Table, TableColumn } from '../ui';
import ContentContainer from '../ContentContainer';
import { FilterOption, FilterCondition } from '../ui/filter-modal';
import Actions from '../ui/actions';
import Pagination from '../ui/pagination';
import { Button } from '@circleco/compass/components/Button';

interface Agent {
  id: string;
  name: string;
  conversations: number;
  messages: number;
  modifiedOn: string;
  isActive: boolean;
  avatar?: string;
  icons?: string[];
}

interface AgentsProps {
  onToggleSidebar: () => void;
}

const Agents: React.FC<AgentsProps> = ({ onToggleSidebar }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [showAllFilters, setShowAllFilters] = useState(false);

  const agentsData: Agent[] = [
    {
      id: '1',
      name: "David's mobile testing agent",
      conversations: 13,
      messages: 165,
      modifiedOn: 'May 12, 2025',
      isActive: true,
      icons: ['spark', 'group', 'expand'],
    },
    {
      id: '2',
      name: "Damir's Agent",
      conversations: 8,
      messages: 45,
      modifiedOn: 'May 10, 2025',
      isActive: true,
      icons: ['spark', 'group', 'smile'],
    },
    {
      id: '3',
      name: "Rohit's bot",
      conversations: 5,
      messages: 23,
      modifiedOn: 'May 8, 2025',
      isActive: true,
      icons: ['spark', 'group', 'expand'],
    },
    {
      id: '4',
      name: 'New feature monster',
      conversations: 12,
      messages: 89,
      modifiedOn: 'May 7, 2025',
      isActive: true,
      icons: ['spark', 'group', 'document'],
    },
    {
      id: '5',
      name: 'HappyTravels agent',
      conversations: 0,
      messages: 0,
      modifiedOn: 'May 5, 2025',
      isActive: false,
      icons: ['spark', 'group', 'expand'],
    },
    {
      id: '6',
      name: 'Support agent',
      conversations: 0,
      messages: 0,
      modifiedOn: 'May 3, 2025',
      isActive: true,
      icons: ['spark', 'group', 'expand'],
    },
  ];

  const columns: TableColumn<Agent>[] = [
    {
      key: 'name',
      label: 'NAME',
      render: (item: Agent) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-purple-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-medium text-primary">{item.name}</div>
          </div>
          <div className="flex items-center space-x-2">
            {item.icons?.map((icon, index) => (
              <div key={index} className="w-4 h-4 text-disabled">
                {icon === 'spark' && (
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                )}
                {icon === 'group' && (
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                )}
                {icon === 'expand' && (
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13H14a1 1 0 010-2h4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {icon === 'smile' && (
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {icon === 'document' && (
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: 'conversations',
      label: 'CONVERSATIONS',
      render: (item: Agent) => (
        <span className="text-primary">{item.conversations}</span>
      ),
    },
    {
      key: 'messages',
      label: 'MESSAGES',
      render: (item: Agent) => (
        <span className="text-primary">{item.messages}</span>
      ),
    },
    {
      key: 'modifiedOn',
      label: 'MODIFIED ON',
      render: (item: Agent) => (
        <span className="text-primary">{item.modifiedOn}</span>
      ),
    },
    {
      key: 'isActive',
      label: 'ACTIVE',
      render: (item: Agent) => (
        <div className="flex items-center">
          <button
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              item.isActive ? 'bg-green-600' : 'bg-disabled'
            }`}
            onClick={() => {
              // Handle toggle
            }}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-primary transition-transform ${
                item.isActive ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span
            className={`ml-2 text-sm ${
              item.isActive ? 'text-green-600' : 'text-tertiary'
            }`}
          >
            {item.isActive ? 'On' : 'Off'}
          </span>
        </div>
      ),
    },
  ];

  const tabs = [
    { label: 'All', value: 'all', badge: agentsData.length.toString() },
    {
      label: 'Active',
      value: 'active',
      badge: agentsData.filter(agent => agent.isActive).length.toString(),
    },
    {
      label: 'Inactive',
      value: 'inactive',
      badge: agentsData.filter(agent => !agent.isActive).length.toString(),
    },
  ];

  const filterOptions: FilterOption[] = [
    { id: 'name', label: 'Name', type: 'text' },
    { id: 'conversations', label: 'Conversations', type: 'text' },
    { id: 'messages', label: 'Messages', type: 'text' },
    { id: 'isActive', label: 'Active Status', type: 'boolean' },
  ];

  // Filter data based on active tab
  const getFilteredData = () => {
    switch (activeTab) {
      case 'active':
        return agentsData.filter(agent => agent.isActive);
      case 'inactive':
        return agentsData.filter(agent => !agent.isActive);
      case 'all':
      default:
        return agentsData;
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
      title="Agents"
      onToggleSidebar={onToggleSidebar}
      actions={
        <div className="flex items-center space-x-3">
          <Button variant="primary">New agent</Button>
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
      {/* Actions */}
      <Actions
        selectedCount={selectedItems.length}
        onShowAllFilters={() => setShowAllFilters(!showAllFilters)}
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

export default Agents;
