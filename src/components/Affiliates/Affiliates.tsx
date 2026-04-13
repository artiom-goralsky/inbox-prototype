import React, { useState } from 'react';
import { TableEnhanced as Table, TableColumn } from '../ui';
import ContentContainer from '../ContentContainer';
import Pagination from '../ui/pagination';
import { exportToCSV } from '../../utils/csvExport';
import { Button } from '@circleco/compass/components/Button';
import Actions from '../ui/actions';
import { FilterCondition } from '../ui/filter-modal';

interface Affiliate {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  visitors: number | null;
  leads: number | null;
  conversions: number | null;
  paid: number | null;
  pending: number | null;
  dueNow: number | null;
  processing: number | null;
}

interface AffiliatesProps {
  onToggleSidebar: () => void;
}

const Affiliates: React.FC<AffiliatesProps> = ({ onToggleSidebar }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState('all');
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [showAllFilters, setShowAllFilters] = useState(false);

  const affiliatesData: Affiliate[] = [
    {
      id: '1',
      name: 'Roberto Miguel Vargas',
      email: 'roberto+robpaywall001@circle.so',
      initials: 'RV',
      visitors: null,
      leads: null,
      conversions: null,
      paid: null,
      pending: null,
      dueNow: null,
      processing: null,
    },
    {
      id: '2',
      name: 'Android Test Account',
      email: 'android@test.com',
      initials: 'AA',
      visitors: 1,
      leads: null,
      conversions: null,
      paid: null,
      pending: null,
      dueNow: null,
      processing: null,
    },
    {
      id: '3',
      name: 'Sushant Mittal 5',
      email: 'sushant5@example.com',
      initials: 'S5',
      visitors: null,
      leads: null,
      conversions: null,
      paid: null,
      pending: null,
      dueNow: null,
      processing: null,
    },
    {
      id: '4',
      name: 'Henrique Teruo',
      email: 'henrique@circle.co',
      initials: 'HT',
      visitors: 13,
      leads: 3,
      conversions: 3,
      paid: null,
      pending: null,
      dueNow: null,
      processing: null,
    },
    {
      id: '5',
      name: 'Hector Vasquez',
      email: 'hector@example.com',
      initials: 'HV',
      visitors: 1,
      leads: null,
      conversions: null,
      paid: null,
      pending: null,
      dueNow: null,
      processing: null,
    },
    {
      id: '6',
      name: 'Chintan+2',
      email: 'chintan+2@example.com',
      initials: 'C2',
      visitors: 5,
      leads: null,
      conversions: 1,
      paid: null,
      pending: null,
      dueNow: null,
      processing: null,
    },
    {
      id: '7',
      name: 'Pedro Hernandes',
      email: 'pc.hernandes@gmail.com',
      initials: 'PH',
      visitors: 2,
      leads: null,
      conversions: null,
      paid: null,
      pending: null,
      dueNow: null,
      processing: null,
    },
    {
      id: '8',
      name: 'Sushant Mittal',
      email: 'sushant@example.com',
      initials: 'SM',
      visitors: null,
      leads: null,
      conversions: null,
      paid: null,
      pending: null,
      dueNow: null,
      processing: null,
    },
    {
      id: '9',
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      initials: 'MG',
      visitors: 8,
      leads: 2,
      conversions: 1,
      paid: 50,
      pending: 25,
      dueNow: 10,
      processing: 5,
    },
    {
      id: '10',
      name: 'David Wilson',
      email: 'david.wilson@example.com',
      initials: 'DW',
      visitors: 15,
      leads: 5,
      conversions: 2,
      paid: 100,
      pending: 50,
      dueNow: 20,
      processing: 10,
    },
    {
      id: '11',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      initials: 'SJ',
      visitors: 3,
      leads: 1,
      conversions: 1,
      paid: 25,
      pending: 15,
      dueNow: 5,
      processing: 2,
    },
    {
      id: '12',
      name: 'Alex Brown',
      email: 'alex.brown@example.com',
      initials: 'AB',
      visitors: 7,
      leads: 2,
      conversions: 1,
      paid: 75,
      pending: 30,
      dueNow: 15,
      processing: 8,
    },
    {
      id: '13',
      name: 'Lisa Chen',
      email: 'lisa.chen@example.com',
      initials: 'LC',
      visitors: 12,
      leads: 4,
      conversions: 2,
      paid: 150,
      pending: 60,
      dueNow: 25,
      processing: 12,
    },
    {
      id: '14',
      name: 'John Smith',
      email: 'john.smith@example.com',
      initials: 'JS',
      visitors: 6,
      leads: 2,
      conversions: 1,
      paid: 40,
      pending: 20,
      dueNow: 8,
      processing: 4,
    },
    {
      id: '15',
      name: 'Emma Davis',
      email: 'emma.davis@example.com',
      initials: 'ED',
      visitors: 9,
      leads: 3,
      conversions: 1,
      paid: 60,
      pending: 35,
      dueNow: 12,
      processing: 6,
    },
    {
      id: '16',
      name: 'Michael Rodriguez',
      email: 'michael.rodriguez@example.com',
      initials: 'MR',
      visitors: 4,
      leads: 1,
      conversions: 1,
      paid: 30,
      pending: 15,
      dueNow: 6,
      processing: 3,
    },
    {
      id: '17',
      name: 'Jennifer Lee',
      email: 'jennifer.lee@example.com',
      initials: 'JL',
      visitors: 11,
      leads: 3,
      conversions: 2,
      paid: 80,
      pending: 40,
      dueNow: 18,
      processing: 9,
    },
    {
      id: '18',
      name: 'Robert Taylor',
      email: 'robert.taylor@example.com',
      initials: 'RT',
      visitors: 2,
      leads: null,
      conversions: null,
      paid: null,
      pending: null,
      dueNow: null,
      processing: null,
    },
  ];

  // Filter configuration
  const filters = [
    {
      id: 'status',
      label: 'Status',
      type: 'select' as const,
      options: ['Active', 'Inactive'],
    },
    {
      id: 'name',
      label: 'Name',
      type: 'text' as const,
    },
    {
      id: 'email',
      label: 'Email',
      type: 'text' as const,
    },
  ];

  const tabs = [
    { label: 'All', value: 'all', badge: affiliatesData.length.toString() },
    {
      label: 'Active',
      value: 'active',
      badge: affiliatesData
        .filter(
          affiliate =>
            affiliate.visitors !== null ||
            affiliate.leads !== null ||
            affiliate.conversions !== null
        )
        .length.toString(),
    },
    {
      label: 'Inactive',
      value: 'inactive',
      badge: affiliatesData
        .filter(
          affiliate =>
            affiliate.visitors === null &&
            affiliate.leads === null &&
            affiliate.conversions === null
        )
        .length.toString(),
    },
  ];

  const columns: TableColumn<Affiliate>[] = [
    {
      key: 'affiliate',
      label: 'AFFILIATE',
      render: (item: Affiliate) => (
        <div className="flex items-center space-x-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
            style={{ backgroundColor: getAvatarColor(item.initials) }}
          >
            {item.initials}
          </div>
          <div>
            <div className="font-medium text-primary">{item.name}</div>
            <div className="text-sm text-tertiary">{item.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'visitors',
      label: 'VISITORS',
      render: (item: Affiliate) => (
        <span className="text-primary">
          {item.visitors !== null ? item.visitors : '-'}
        </span>
      ),
    },
    {
      key: 'leads',
      label: 'LEADS',
      render: (item: Affiliate) => (
        <span className="text-primary">
          {item.leads !== null ? item.leads : '-'}
        </span>
      ),
    },
    {
      key: 'conversions',
      label: 'CONV.',
      render: (item: Affiliate) => (
        <span className="text-primary">
          {item.conversions !== null ? item.conversions : '-'}
        </span>
      ),
    },
    {
      key: 'paid',
      label: 'PAID',
      render: (item: Affiliate) => (
        <span className="text-primary">
          {item.paid !== null ? item.paid : '-'}
        </span>
      ),
    },
    {
      key: 'pending',
      label: 'PENDING',
      render: (item: Affiliate) => (
        <span className="text-primary">
          {item.pending !== null ? item.pending : '-'}
        </span>
      ),
    },
    {
      key: 'dueNow',
      label: 'DUE NOW',
      render: (item: Affiliate) => (
        <span className="text-primary">
          {item.dueNow !== null ? item.dueNow : '-'}
        </span>
      ),
    },
    {
      key: 'processing',
      label: 'PROCESSING',
      render: (item: Affiliate) => (
        <span className="text-primary">
          {item.processing !== null ? item.processing : '-'}
        </span>
      ),
    },
  ];

  // Removed legacy getFilteredData in favor of rows-based filtering below

  // Keep rows in state so bulk actions can mutate the dataset
  const [rows, setRows] = useState<Affiliate[]>(affiliatesData);

  const filteredData = (() => {
    const applyTab = (data: Affiliate[]) => {
      switch (activeTab) {
        case 'active':
          return data.filter(
            affiliate =>
              affiliate.visitors !== null ||
              affiliate.leads !== null ||
              affiliate.conversions !== null
          );
        case 'inactive':
          return data.filter(
            affiliate =>
              affiliate.visitors === null &&
              affiliate.leads === null &&
              affiliate.conversions === null
          );
        case 'all':
        default:
          return data;
      }
    };

    const filtered = applyTab(rows);

    // Apply custom filters
    return filtered.filter(affiliate => {
      return activeFilters.every(filter => {
        switch (filter.field) {
          case 'status': {
            const isActive =
              affiliate.visitors !== null ||
              affiliate.leads !== null ||
              affiliate.conversions !== null;
            const status = isActive ? 'Active' : 'Inactive';
            return filter.operator === 'is'
              ? status === filter.value
              : status !== filter.value;
          }
          case 'name': {
            const name = affiliate.name.toLowerCase();
            const searchValue = filter.value.toLowerCase();
            return filter.operator === 'contains'
              ? name.includes(searchValue)
              : !name.includes(searchValue);
          }
          case 'email': {
            const email = affiliate.email.toLowerCase();
            const emailSearchValue = filter.value.toLowerCase();
            return filter.operator === 'contains'
              ? email.includes(emailSearchValue)
              : !email.includes(emailSearchValue);
          }
          default:
            return true;
        }
      });
    });
  })();
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

  // Bulk actions
  const handleExportPayoutCsv = () => {
    if (selectedItems.length === 0) return;
    // Example: create simple CSV string and trigger download
    const selectedRows = rows.filter(r => selectedItems.includes(r.id));
    const header = ['Name', 'Email', 'Due Now'].join(',');
    const lines = selectedRows.map(r =>
      [r.name, r.email, r.dueNow ?? 0].join(',')
    );
    const csv = [header, ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'payouts.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    setRows(prev => prev.filter(row => !selectedItems.includes(row.id)));
    setSelectedItems([]);
  };

  const handleMarkPaid = () => {
    if (selectedItems.length === 0) return;
    setRows(prev =>
      prev.map(row => {
        if (!selectedItems.includes(row.id)) return row;
        const due = row.dueNow ?? 0;
        const newPaid = (row.paid ?? 0) + due;
        return { ...row, paid: newPaid, dueNow: 0, pending: 0, processing: 0 };
      })
    );
    setSelectedItems([]);
  };

  return (
    <ContentContainer
      title="Affiliates"
      onToggleSidebar={onToggleSidebar}
      actions={
        <div className="flex items-center space-x-3">
          <Button variant="primary">Start payout</Button>
          <Button variant="primary">Invite affiliate</Button>
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
      {/* Count */}
      <div className="px-6 py-2">
        <p className="text-sm text-secondary">{totalItems} affiliates</p>
      </div>

      {/* Bulk Actions */}
      <Actions
        selectedCount={selectedItems.length}
        totalCount={currentData.length}
        onDeleteSelected={handleDeleteSelected}
        selectedData={currentData.filter((affiliate: any) =>
          selectedItems.includes(affiliate.id)
        )}
        exportFilename="affiliates.csv"
        onShowAllFilters={() => setShowAllFilters(!showAllFilters)}
        bulkActions={[
          {
            id: 'export',
            label: 'Export selected',
            onClick: () => {
              const selectedData = currentData.filter((affiliate: any) =>
                selectedItems.includes(affiliate.id)
              );
              exportToCSV(selectedData, 'affiliates.csv');
            },
            disabled: selectedItems.length === 0,
          },
          {
            id: 'export-payout',
            label: 'Export payout CSV',
            onClick: handleExportPayoutCsv,
            disabled: selectedItems.length === 0,
          },
          {
            id: 'mark-paid',
            label: 'Mark paid',
            onClick: handleMarkPaid,
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

// Helper function
const getAvatarColor = (initials: string): string => {
  const colors = [
    '#1E40AF', // Dark Blue
    '#7C3AED', // Purple
    '#1E40AF', // Blue
    '#059669', // Green
    '#92400E', // Brown
    '#DC2626', // Red
    '#0891B2', // Teal
    '#8B5CF6', // Violet
  ];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
};

export default Affiliates;
