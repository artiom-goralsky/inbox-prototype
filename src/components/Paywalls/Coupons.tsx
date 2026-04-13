import React, { useState } from 'react';
import {
  mockCoupons,
  getCouponCounts,
  Coupon,
} from '../../data/Paywalls/mockData';
import { TableEnhanced, TableColumn } from '../ui';
import { Actions } from '../ui';
import { Pagination } from '../ui';
import ContentContainer from '../ContentContainer';
import { Badge } from '@circleco/compass/components/Badge';

interface CouponsProps {
  onToggleSidebar: () => void;
}

const Coupons: React.FC<CouponsProps> = ({ onToggleSidebar }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const couponCounts = getCouponCounts();

  const getCurrentCoupons = (): Coupon[] => {
    if (activeTab === 'all') {
      return mockCoupons;
    } else if (activeTab === 'active') {
      return mockCoupons.filter(coupon => coupon.status === 'Active');
    } else if (activeTab === 'archived') {
      return mockCoupons.filter(coupon => coupon.status === 'Inactive');
    }
    return mockCoupons;
  };

  const currentCoupons = getCurrentCoupons();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCoupons = currentCoupons.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    if (selectedCoupons.length === paginatedCoupons.length) {
      setSelectedCoupons([]);
    } else {
      setSelectedCoupons(paginatedCoupons.map(coupon => coupon.id));
    }
  };

  const handleSelectCoupon = (couponId: string) => {
    setSelectedCoupons(prev =>
      prev.includes(couponId)
        ? prev.filter(id => id !== couponId)
        : [...prev, couponId]
    );
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setSelectedCoupons([]);
  };

  const handleDeleteSelected = () => {
    // Handle bulk delete
    setSelectedCoupons([]);
  };

  const tabs = [
    { label: 'All', value: 'all', badge: couponCounts.all.toString() },
    { label: 'Active', value: 'active', badge: couponCounts.active.toString() },
    {
      label: 'Archived',
      value: 'archived',
      badge: couponCounts.archived.toString(),
    },
  ];

  // Define table columns
  const columns: TableColumn<Coupon>[] = [
    {
      key: 'code',
      label: 'Code',
      render: (coupon: Coupon) => (
        <div className="text-sm font-medium text-primary">{coupon.code}</div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (coupon: Coupon) => (
        <Badge
          label={coupon.status}
          variant={coupon.status === 'Active' ? 'success' : 'secondary'}
        />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (coupon: Coupon) => (
        <div className="text-sm text-primary">{coupon.name}</div>
      ),
    },
    {
      key: 'terms',
      label: 'Terms',
      render: (coupon: Coupon) => (
        <div className="text-sm text-primary">{coupon.terms}</div>
      ),
    },
    {
      key: 'redemptions',
      label: 'Redemptions',
      render: (coupon: Coupon) => (
        <div className="text-sm text-primary">
          {coupon.redemptions.toLocaleString()}
        </div>
      ),
    },
  ];

  return (
    <ContentContainer
      onToggleSidebar={onToggleSidebar}
      title="Coupons"
      actions={
        <button className="px-4 py-2 bg-inverse text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
          Create coupon
        </button>
      }
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      {/* Actions */}
      <Actions
        selectedCount={selectedCoupons.length}
        totalCount={paginatedCoupons.length}
        onDeleteSelected={handleDeleteSelected}
      />

      {/* Table */}
      <TableEnhanced
        columns={columns}
        data={paginatedCoupons}
        selectedItems={selectedCoupons}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectCoupon}
      />

      {/* Pagination */}
      <Pagination
        count={currentCoupons.length}
        page={currentPage}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </ContentContainer>
  );
};

export default Coupons;
