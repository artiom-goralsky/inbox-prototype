import React from 'react';
import Sidebar from '../ui/sidebar';

interface PaywallsSidebarProps {
  onToggleSidebar: () => void;
  onItemClick: (itemId: string, subItemId?: string) => void;
  activeSubItem: string;
}

const PaywallsSidebar: React.FC<PaywallsSidebarProps> = ({
  onToggleSidebar,
  onItemClick,
  activeSubItem,
}) => {
  const paywallsItems = [
    { id: 'paywalls', title: 'Paywalls' },
    { id: 'subscription-groups', title: 'Subscription groups' },
    { id: 'transactions', title: 'Transactions' },
    { id: 'subscriptions', title: 'Subscriptions' },
    { id: 'coupons', title: 'Coupons' },
    { id: 'taxes', title: 'Taxes' },
    { id: 'export-logs', title: 'Export logs' },
    { id: 'settings', title: 'Settings' },
  ];

  return (
    <Sidebar
      title="Paywalls"
      items={paywallsItems}
      activeItem={activeSubItem}
      onToggleSidebar={onToggleSidebar}
      onItemClick={onItemClick}
    />
  );
};

export default PaywallsSidebar;
