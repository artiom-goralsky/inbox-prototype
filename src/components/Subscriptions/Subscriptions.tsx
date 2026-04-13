import React, { useState } from 'react';
import { TableEnhanced as Table, TableColumn } from '../ui';
import ContentContainer from '../ContentContainer';
import { FilterOption, FilterCondition } from '../ui/filter-modal';
import Actions from '../ui/actions';
import Pagination from '../ui/pagination';
import { Button } from '@circleco/compass/components/Button';
import { Badge } from '@circleco/compass/components/Badge';

interface Subscription {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
    initials: string;
  };
  status: 'active' | 'canceled';
  paywall: string;
  transactions: number;
  term: string;
  startDate: string;
  nextRenewalDate: string;
}

interface SubscriptionsProps {
  onToggleSidebar: () => void;
}

const Subscriptions: React.FC<SubscriptionsProps> = ({ onToggleSidebar }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  const subscriptionsData: Subscription[] = [
    {
      id: '1',
      customer: {
        name: 'Idris Dicaprio',
        email: 'joshua+44@circle.co',
        avatar: 'ID',
        initials: 'ID',
      },
      status: 'active',
      paywall: 'Test',
      transactions: 1,
      term: '$1 USD monthly',
      startDate: 'September 25, 2025',
      nextRenewalDate: 'October 25, 2025',
    },
    {
      id: '2',
      customer: {
        name: 'Joshua Chouke',
        email: 'joshua@circle.co',
        avatar: 'JC',
        initials: 'JC',
      },
      status: 'active',
      paywall: 'Balance Premium Members...',
      transactions: 2,
      term: '$10 USD + $30 USD monthly',
      startDate: 'September 24, 2025',
      nextRenewalDate: 'October 24, 2025',
    },
    {
      id: '3',
      customer: {
        name: 'Sushant Mittal',
        email: 'sushant@circle.co',
        avatar: 'SM',
        initials: 'SM',
      },
      status: 'canceled',
      paywall: 'More testing',
      transactions: 1,
      term: '2x $1 USD monthly',
      startDate: 'September 15, 2025',
      nextRenewalDate: 'Canceled on September 15, 2025',
    },
    {
      id: '4',
      customer: {
        name: 'Hector Card115',
        email: 'hector+dev-000000115@circle.co',
        avatar: 'HC',
        initials: 'HC',
      },
      status: 'canceled',
      paywall: 'A TWD paywall',
      transactions: 1,
      term: '3 days trial + $20 TWD monthly',
      startDate: 'August 27, 2025',
      nextRenewalDate: 'Canceled on August 27, 2025',
    },
    {
      id: '5',
      customer: {
        name: 'Test User',
        email: 'test@example.com',
        avatar: 'TU',
        initials: 'TU',
      },
      status: 'canceled',
      paywall: 'Price change testing',
      transactions: 1,
      term: '10 days trial + $90 USD yearly',
      startDate: 'August 26, 2025',
      nextRenewalDate: 'Canceled on August 28, 2025',
    },
    {
      id: '6',
      customer: {
        name: 'John Smith',
        email: 'john.smith@example.com',
        avatar: 'JS',
        initials: 'JS',
      },
      status: 'active',
      paywall: 'Premium Plan',
      transactions: 3,
      term: '$15 USD monthly',
      startDate: 'September 20, 2025',
      nextRenewalDate: 'October 20, 2025',
    },
    {
      id: '7',
      customer: {
        name: 'Maria Garcia',
        email: 'maria.garcia@example.com',
        avatar: 'MG',
        initials: 'MG',
      },
      status: 'active',
      paywall: 'Enterprise Plan',
      transactions: 1,
      term: '$50 USD yearly',
      startDate: 'September 18, 2025',
      nextRenewalDate: 'September 18, 2026',
    },
    {
      id: '8',
      customer: {
        name: 'David Wilson',
        email: 'david.wilson@example.com',
        avatar: 'DW',
        initials: 'DW',
      },
      status: 'canceled',
      paywall: 'Basic Plan',
      transactions: 2,
      term: '$5 USD monthly',
      startDate: 'August 15, 2025',
      nextRenewalDate: 'Canceled on September 10, 2025',
    },
    {
      id: '9',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        avatar: 'SJ',
        initials: 'SJ',
      },
      status: 'active',
      paywall: 'VIP Membership',
      transactions: 1,
      term: '$25 USD monthly',
      startDate: 'September 10, 2025',
      nextRenewalDate: 'October 10, 2025',
    },
    {
      id: '10',
      customer: {
        name: 'Alex Brown',
        email: 'alex.brown@example.com',
        avatar: 'AB',
        initials: 'AB',
      },
      status: 'canceled',
      paywall: 'Starter Plan',
      transactions: 1,
      term: '$2 USD monthly',
      startDate: 'August 1, 2025',
      nextRenewalDate: 'Canceled on August 15, 2025',
    },
  ];

  const tabs = [
    { label: 'All', value: 'all', badge: subscriptionsData.length.toString() },
    {
      label: 'Active',
      value: 'active',
      badge: subscriptionsData
        .filter(subscription => subscription.status === 'active')
        .length.toString(),
    },
    {
      label: 'Canceled',
      value: 'canceled',
      badge: subscriptionsData
        .filter(subscription => subscription.status === 'canceled')
        .length.toString(),
    },
  ];

  const columns: TableColumn<Subscription>[] = [
    {
      key: 'customer',
      label: 'CUSTOMER',
      render: (item: Subscription) => (
        <div className="flex items-center space-x-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
            style={{ backgroundColor: getAvatarColor(item.customer.initials) }}
          >
            {item.customer.initials}
          </div>
          <div>
            <div className="font-medium text-primary">{item.customer.name}</div>
            <div className="text-sm text-tertiary">{item.customer.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (item: Subscription) => {
        const statusLabel =
          item.status.charAt(0).toUpperCase() + item.status.slice(1);
        return (
          <Badge
            label={statusLabel}
            variant={item.status === 'active' ? 'success' : 'secondary'}
          />
        );
      },
    },
    {
      key: 'paywall',
      label: 'PAYWALL',
      render: (item: Subscription) => (
        <span className="text-primary">{item.paywall}</span>
      ),
    },
    {
      key: 'transactions',
      label: 'TXNS',
      render: (item: Subscription) => (
        <span className="text-primary">{item.transactions}</span>
      ),
    },
    {
      key: 'term',
      label: 'TERM',
      render: (item: Subscription) => (
        <span className="text-primary">{item.term}</span>
      ),
    },
    {
      key: 'startDate',
      label: 'START DATE',
      render: (item: Subscription) => (
        <span className="text-primary">{item.startDate}</span>
      ),
    },
    {
      key: 'nextRenewalDate',
      label: 'NEXT RENEWAL DATE',
      render: (item: Subscription) => (
        <span className="text-primary">{item.nextRenewalDate}</span>
      ),
    },
  ];

  const filterOptions: FilterOption[] = [
    { id: 'name', label: 'Name', type: 'text' },
    { id: 'email', label: 'E-mail', type: 'text' },
    { id: 'member', label: 'Member', type: 'text' },
    { id: 'status', label: 'Status', type: 'select' },
    { id: 'paywall', label: 'Paywall', type: 'text' },
    { id: 'startDate', label: 'Start date', type: 'text' },
  ];

  // Filter data based on active tab
  const getFilteredData = () => {
    switch (activeTab) {
      case 'active':
        return subscriptionsData.filter(
          subscription => subscription.status === 'active'
        );
      case 'canceled':
        return subscriptionsData.filter(
          subscription => subscription.status === 'canceled'
        );
      case 'all':
      default:
        return subscriptionsData;
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
      title="Subscriptions"
      onToggleSidebar={onToggleSidebar}
      actions={
        <div className="flex items-center space-x-3">
          <Button variant="primary">Export CSV</Button>
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

// Helper function
const getAvatarColor = (initials: string): string => {
  const colors = [
    '#8B5CF6', // Purple
    '#F59E0B', // Orange
    '#1E40AF', // Dark Blue
    '#059669', // Dark Green
    '#92400E', // Brown
    '#0891B2', // Teal
    '#DC2626', // Red
    '#7C3AED', // Violet
  ];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
};

export default Subscriptions;
