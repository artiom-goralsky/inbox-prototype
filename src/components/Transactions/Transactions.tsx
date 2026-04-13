import React, { useState } from 'react';
import { TableEnhanced as Table, TableColumn } from '../ui';
import ContentContainer from '../ContentContainer';
import { FilterCondition } from '../ui/filter-modal';
import Actions from '../ui/actions';
import Pagination from '../ui/pagination';
import { exportToCSV } from '../../utils/csvExport';
import { Button } from '@circleco/compass/components/Button';
import { Badge } from '@circleco/compass/components/Badge';

interface Transaction {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
    initials: string;
  };
  type: string;
  amount: string;
  currency: string;
  paymentMethod: {
    type: string;
    lastFour: string;
    icon?: string;
  } | null;
  status: 'paid' | 'refunded' | 'failed';
  paywall: string;
  date: string;
}

interface TransactionsProps {
  onToggleSidebar: () => void;
}

const Transactions: React.FC<TransactionsProps> = ({ onToggleSidebar }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showAllFilters, setShowAllFilters] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      customer: {
        name: 'Sarah Smith',
        email: 'sarah.smith@example.com',
        avatar: 'SS',
        initials: 'SS',
      },
      type: 'Monthly',
      amount: '2',
      currency: 'USD',
      paymentMethod: {
        type: 'Visa',
        lastFour: '6998',
        icon: 'visa',
      },
      status: 'paid',
      paywall: 'Test Paywall april 10',
      date: 'September 28, 2025',
    },
    {
      id: '2',
      customer: {
        name: 'Ivan Dimitrov',
        email: 'ivan.dimitrov@example.com',
        avatar: 'ID',
        initials: 'ID',
      },
      type: 'One-time',
      amount: '0',
      currency: 'USD',
      paymentMethod: {
        type: 'Google Pay',
        lastFour: '9351',
        icon: 'google',
      },
      status: 'paid',
      paywall: 'Balance Premium Membership',
      date: 'September 27, 2025',
    },
    {
      id: '3',
      customer: {
        name: 'John Carter',
        email: 'john.carter@example.com',
        avatar: 'JC',
        initials: 'JC',
      },
      type: 'Monthly',
      amount: '1',
      currency: 'EUR',
      paymentMethod: null,
      status: 'refunded',
      paywall: 'More testing',
      date: 'September 26, 2025',
    },
    {
      id: '4',
      customer: {
        name: 'Helen Varga',
        email: 'helen.varga@example.com',
        avatar: 'HV',
        initials: 'HV',
      },
      type: 'One-time',
      amount: '5',
      currency: 'USD',
      paymentMethod: {
        type: 'Mastercard',
        lastFour: '1234',
        icon: 'mastercard',
      },
      status: 'paid',
      paywall: 'Testing cross-community purchases',
      date: 'September 25, 2025',
    },
    {
      id: '5',
      customer: {
        name: 'Ben',
        email: 'ben@example.com',
        avatar: 'B',
        initials: 'B',
      },
      type: 'Monthly',
      amount: '10',
      currency: 'USD',
      paymentMethod: {
        type: 'PayPal',
        lastFour: '5678',
        icon: 'paypal',
      },
      status: 'paid',
      paywall: "Ben's 30 day trial test",
      date: 'September 24, 2025',
    },
    {
      id: '6',
      customer: {
        name: 'Maria Santos',
        email: 'maria.santos@example.com',
        avatar: 'MS',
        initials: 'MS',
      },
      type: 'One-time',
      amount: '3',
      currency: 'EUR',
      paymentMethod: {
        type: 'Visa',
        lastFour: '9876',
        icon: 'visa',
      },
      status: 'failed',
      paywall: 'EUR Paywall',
      date: 'September 23, 2025',
    },
    {
      id: '7',
      customer: {
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        avatar: 'AJ',
        initials: 'AJ',
      },
      type: 'Monthly',
      amount: '15',
      currency: 'USD',
      paymentMethod: {
        type: 'American Express',
        lastFour: '1234',
        icon: 'amex',
      },
      status: 'paid',
      paywall: 'PMCs',
      date: 'September 22, 2025',
    },
    {
      id: '8',
      customer: {
        name: 'Lisa Chen',
        email: 'lisa.chen@example.com',
        avatar: 'LC',
        initials: 'LC',
      },
      type: 'One-time',
      amount: '7',
      currency: 'USD',
      paymentMethod: {
        type: 'Visa',
        lastFour: '4567',
        icon: 'visa',
      },
      status: 'paid',
      paywall: 'Premium Access',
      date: 'September 21, 2025',
    },
    {
      id: '9',
      customer: {
        name: 'David Wilson',
        email: 'david.wilson@example.com',
        avatar: 'DW',
        initials: 'DW',
      },
      type: 'Monthly',
      amount: '12',
      currency: 'USD',
      paymentMethod: {
        type: 'Mastercard',
        lastFour: '8901',
        icon: 'mastercard',
      },
      status: 'refunded',
      paywall: 'Enterprise Plan',
      date: 'September 20, 2025',
    },
    {
      id: '10',
      customer: {
        name: 'Emma Brown',
        email: 'emma.brown@example.com',
        avatar: 'EB',
        initials: 'EB',
      },
      type: 'One-time',
      amount: '25',
      currency: 'USD',
      paymentMethod: {
        type: 'PayPal',
        lastFour: '2345',
        icon: 'paypal',
      },
      status: 'paid',
      paywall: 'VIP Membership',
      date: 'September 19, 2025',
    },
  ]);

  const tabs = [
    { label: 'All', value: 'all', badge: transactions.length.toString() },
    {
      label: 'Paid',
      value: 'paid',
      badge: transactions
        .filter(transaction => transaction.status === 'paid')
        .length.toString(),
    },
    {
      label: 'Refunded',
      value: 'refunded',
      badge: transactions
        .filter(transaction => transaction.status === 'refunded')
        .length.toString(),
    },
    {
      label: 'Failed',
      value: 'failed',
      badge: transactions
        .filter(transaction => transaction.status === 'failed')
        .length.toString(),
    },
  ];

  const columns: TableColumn<Transaction>[] = [
    {
      key: 'customer',
      label: 'CUSTOMER',
      render: (item: Transaction) => (
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
      key: 'type',
      label: 'TYPE',
      render: (item: Transaction) => (
        <span className="text-primary">{item.type}</span>
      ),
    },
    {
      key: 'amount',
      label: 'AMOUNT',
      render: (item: Transaction) => (
        <span className="text-primary">
          ${item.amount} {item.currency}
        </span>
      ),
    },
    {
      key: 'paymentMethod',
      label: 'PAYMENT METHOD',
      render: (item: Transaction) => (
        <div className="flex items-center space-x-2">
          {item.paymentMethod ? (
            <>
              <div className="w-6 h-4 bg-active rounded flex items-center justify-center">
                {getPaymentIcon(item.paymentMethod.icon)}
              </div>
              <span className="text-primary">
                {item.paymentMethod.type} ending {item.paymentMethod.lastFour}
              </span>
            </>
          ) : (
            <span className="text-disabled">-</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (item: Transaction) => {
        const statusLabel =
          item.status.charAt(0).toUpperCase() + item.status.slice(1);
        let variant: 'success' | 'secondary' | 'destructive' = 'secondary';
        if (item.status === 'paid') variant = 'success';
        else if (item.status === 'failed') variant = 'destructive';
        return <Badge label={statusLabel} variant={variant} />;
      },
    },
    {
      key: 'paywall',
      label: 'PAYWALL',
      render: (item: Transaction) => (
        <span className="text-primary">{item.paywall}</span>
      ),
    },
    {
      key: 'date',
      label: 'DATE',
      render: (item: Transaction) => (
        <span className="text-primary">{item.date}</span>
      ),
    },
  ];

  const filters = [
    {
      id: 'status',
      label: 'Status',
      type: 'select' as const,
      options: ['paid', 'refunded', 'pending', 'failed'],
    },
    {
      id: 'customerName',
      label: 'Customer Name',
      type: 'text' as const,
    },
    {
      id: 'customerEmail',
      label: 'Customer Email',
      type: 'text' as const,
    },
    {
      id: 'paywall',
      label: 'Paywall',
      type: 'text' as const,
    },
    {
      id: 'amount',
      label: 'Amount',
      type: 'text' as const,
    },
  ];

  // Filter data based on active tab and custom filters
  const getFilteredData = () => {
    let filtered = transactions;

    // Apply tab filter
    switch (activeTab) {
      case 'paid':
        filtered = filtered.filter(
          transaction => transaction.status === 'paid'
        );
        break;
      case 'refunded':
        filtered = filtered.filter(
          transaction => transaction.status === 'refunded'
        );
        break;
      case 'failed':
        filtered = filtered.filter(
          transaction => transaction.status === 'failed'
        );
        break;
      case 'all':
      default:
        // No tab filter
        break;
    }

    // Apply custom filters
    return filtered.filter(transaction => {
      return activeFilters.every(filter => {
        switch (filter.field) {
          case 'status': {
            return filter.operator === 'is'
              ? transaction.status === filter.value
              : transaction.status !== filter.value;
          }
          case 'customerName': {
            const name = transaction.customer.name.toLowerCase();
            const searchValue = filter.value.toLowerCase();
            return filter.operator === 'contains'
              ? name.includes(searchValue)
              : !name.includes(searchValue);
          }
          case 'customerEmail': {
            const email = transaction.customer.email.toLowerCase();
            const emailSearchValue = filter.value.toLowerCase();
            return filter.operator === 'contains'
              ? email.includes(emailSearchValue)
              : !email.includes(emailSearchValue);
          }
          case 'paywall': {
            const paywall = transaction.paywall.toLowerCase();
            const paywallSearchValue = filter.value.toLowerCase();
            return filter.operator === 'contains'
              ? paywall.includes(paywallSearchValue)
              : !paywall.includes(paywallSearchValue);
          }
          case 'amount': {
            const amount = transaction.amount.toLowerCase();
            const amountSearchValue = filter.value.toLowerCase();
            return filter.operator === 'contains'
              ? amount.includes(amountSearchValue)
              : !amount.includes(amountSearchValue);
          }
          default:
            return true;
        }
      });
    });
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

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    setTransactions(prev =>
      prev.filter(transaction => !selectedItems.includes(transaction.id))
    );
    setSelectedItems([]);
  };

  const handleRefundSelected = () => {
    if (selectedItems.length === 0) return;
    setTransactions(prev =>
      prev.map(transaction =>
        selectedItems.includes(transaction.id)
          ? { ...transaction, status: 'refunded' as const }
          : transaction
      )
    );
    setSelectedItems([]);
  };

  const handleMarkPaidSelected = () => {
    if (selectedItems.length === 0) return;
    setTransactions(prev =>
      prev.map(transaction =>
        selectedItems.includes(transaction.id)
          ? { ...transaction, status: 'paid' as const }
          : transaction
      )
    );
    setSelectedItems([]);
  };

  return (
    <ContentContainer
      title="Transactions"
      onToggleSidebar={onToggleSidebar}
      actions={
        <div className="flex items-center space-x-3">
          <Button variant="primary">Export CSV</Button>
        </div>
      }
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
        selectedCount={selectedItems.length}
        totalCount={currentData.length}
        onDeleteSelected={handleDeleteSelected}
        selectedData={currentData.filter((transaction: any) =>
          selectedItems.includes(transaction.id)
        )}
        exportFilename="transactions.csv"
        onShowAllFilters={() => setShowAllFilters(!showAllFilters)}
        bulkActions={[
          {
            id: 'export',
            label: 'Export selected',
            onClick: () => {
              const selectedData = currentData.filter((transaction: any) =>
                selectedItems.includes(transaction.id)
              );
              exportToCSV(selectedData, 'transactions.csv');
            },
            disabled: selectedItems.length === 0,
          },
          {
            id: 'refund',
            label: 'Refund selected',
            onClick: handleRefundSelected,
            disabled: selectedItems.length === 0,
          },
          {
            id: 'mark-paid',
            label: 'Mark as paid',
            onClick: handleMarkPaidSelected,
            disabled: selectedItems.length === 0,
          },
          {
            id: 'delete',
            label: 'Delete selected',
            onClick: handleDeleteSelected,
            disabled: selectedItems.length === 0,
          },
        ]}
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

// Helper functions
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

const getPaymentIcon = (iconType?: string) => {
  switch (iconType) {
    case 'visa':
      return (
        <div className="w-4 h-3 bg-blue-600 rounded-sm flex items-center justify-center">
          <span className="text-white text-xs font-bold">V</span>
        </div>
      );
    case 'mastercard':
      return (
        <div className="w-4 h-3 bg-red-600 rounded-sm flex items-center justify-center">
          <span className="text-white text-xs font-bold">M</span>
        </div>
      );
    case 'amex':
      return (
        <div className="w-4 h-3 bg-green-600 rounded-sm flex items-center justify-center">
          <span className="text-white text-xs font-bold">A</span>
        </div>
      );
    case 'paypal':
      return (
        <div className="w-4 h-3 bg-blue-500 rounded-sm flex items-center justify-center">
          <span className="text-white text-xs font-bold">P</span>
        </div>
      );
    case 'google':
      return (
        <div className="w-4 h-3 bg-gray-600 rounded-sm flex items-center justify-center">
          <span className="text-white text-xs font-bold">G</span>
        </div>
      );
    default:
      return null;
  }
};

export default Transactions;
