// Paywalls component for managing paywall data
import React, { useState, useRef, useEffect } from 'react';
import {
  mockPaywalls,
  getPaywallCounts,
  Paywall,
} from '../../data/Paywalls/mockData';
import { TableEnhanced, TableColumn } from '../ui';
import { Actions } from '../ui';
import { Button } from '@circleco/compass/components/Button';
import { Pagination } from '../ui';
import ContentContainer from '../ContentContainer';
import NewPaywall from './NewPaywall';
import { Badge } from '@circleco/compass/components/Badge';

interface PaywallsProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed?: boolean;
  isAIHelperOpen?: boolean;
  onCloseAIHelper?: () => void;
  onPreviewToggle?: (isOpen: boolean) => void;
}

const Paywalls: React.FC<PaywallsProps> = ({
  onToggleSidebar,
  isSidebarCollapsed = false,
  isAIHelperOpen,
  onCloseAIHelper,
  onPreviewToggle,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedPaywalls, setSelectedPaywalls] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewPaywall, setShowNewPaywall] = useState(false);
  const itemsPerPage = 20;

  // Store previous sidebar state before opening Create paywall
  const previousSidebarState = useRef<boolean | null>(null);
  const prevShowNewPaywall = useRef<boolean>(false);

  const paywallCounts = getPaywallCounts();

  const getCurrentPaywalls = (): Paywall[] => {
    if (activeTab === 'all') {
      return mockPaywalls;
    } else if (activeTab === 'archived') {
      return mockPaywalls.filter(paywall => paywall.status === 'Inactive');
    }
    return mockPaywalls;
  };

  const currentPaywalls = getCurrentPaywalls();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPaywalls = currentPaywalls.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    if (selectedPaywalls.length === paginatedPaywalls.length) {
      setSelectedPaywalls([]);
    } else {
      setSelectedPaywalls(paginatedPaywalls.map(paywall => paywall.id));
    }
  };

  const handleSelectPaywall = (paywallId: string) => {
    setSelectedPaywalls(prev =>
      prev.includes(paywallId)
        ? prev.filter(id => id !== paywallId)
        : [...prev, paywallId]
    );
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setSelectedPaywalls([]);
  };

  const handleDeleteSelected = () => {
    // Handle bulk delete
    setSelectedPaywalls([]);
  };

  const tabs = [
    { label: 'All', value: 'all', badge: paywallCounts.all.toString() },
    {
      label: 'Archived',
      value: 'archived',
      badge: paywallCounts.archived.toString(),
    },
  ];

  // Define table columns
  const columns: TableColumn<Paywall>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (paywall: Paywall) => (
        <div className="text-sm font-medium text-primary">{paywall.name}</div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (paywall: Paywall) => (
        <Badge
          label={paywall.status}
          variant={paywall.status === 'Active' ? 'success' : 'secondary'}
        />
      ),
    },
    {
      key: 'terms',
      label: 'Terms',
      render: (paywall: Paywall) => (
        <div className="text-sm text-primary">{paywall.terms}</div>
      ),
    },
    {
      key: 'redemptions',
      label: 'Redemptions',
      render: (paywall: Paywall) => (
        <div className="text-sm text-primary">
          {paywall.redemptions.toLocaleString()}
        </div>
      ),
    },
  ];

  // Handle opening Create paywall
  const handleOpenNewPaywall = () => {
    // Save current sidebar state
    previousSidebarState.current = !isSidebarCollapsed;

    // Close sidebar if it's open
    if (!isSidebarCollapsed) {
      onToggleSidebar();
    }

    // Open Create paywall
    setShowNewPaywall(true);
  };

  // Handle closing Create paywall
  const handleCloseNewPaywall = () => {
    setShowNewPaywall(false);
  };

  // Restore sidebar state when Create paywall is closed
  useEffect(() => {
    // Only restore when Create paywall transitions from open to closed
    if (
      prevShowNewPaywall.current &&
      !showNewPaywall &&
      previousSidebarState.current !== null
    ) {
      const wasOpen = previousSidebarState.current;
      const isCurrentlyOpen = !isSidebarCollapsed;

      // Only toggle if the state needs to change
      if (wasOpen && !isCurrentlyOpen) {
        // Sidebar was open, restore it
        onToggleSidebar();
      } else if (!wasOpen && isCurrentlyOpen) {
        // Sidebar was closed, keep it closed
        onToggleSidebar();
      }

      // Reset the stored state
      previousSidebarState.current = null;
    }

    // Update previous value
    prevShowNewPaywall.current = showNewPaywall;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNewPaywall]);

  // Show NewPaywall component if showNewPaywall is true
  if (showNewPaywall) {
    return (
      <NewPaywall
        onBack={handleCloseNewPaywall}
        isAIHelperOpen={isAIHelperOpen}
        onCloseAIHelper={onCloseAIHelper}
        onPreviewToggle={onPreviewToggle}
      />
    );
  }

  return (
    <ContentContainer
      onToggleSidebar={onToggleSidebar}
      title="Paywalls"
      actions={
        <Button onClick={handleOpenNewPaywall} variant="primary" size="sm">
          Create paywall
        </Button>
      }
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      {/* Actions */}
      <Actions
        selectedCount={selectedPaywalls.length}
        totalCount={paginatedPaywalls.length}
        onDeleteSelected={handleDeleteSelected}
      />

      {/* Table */}
      <TableEnhanced
        columns={columns}
        data={paginatedPaywalls}
        selectedItems={selectedPaywalls}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectPaywall}
      />

      {/* Pagination */}
      <Pagination
        count={currentPaywalls.length}
        page={currentPage}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </ContentContainer>
  );
};

export default Paywalls;
