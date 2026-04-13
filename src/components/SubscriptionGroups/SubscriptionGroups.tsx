import React, { useState } from 'react';
import { TableEnhanced as Table, TableColumn } from '../ui';
import ContentContainer from '../ContentContainer';
import Actions from '../ui/actions';
import Pagination from '../ui/pagination';
import { Button } from '@circleco/compass/components/Button';
import { Link } from '@circleco/compass/components/Link';

interface SubscriptionGroup {
  id: string;
  name: string;
  includedPlans: string[];
}

interface SubscriptionGroupsProps {
  onToggleSidebar: () => void;
}

const SubscriptionGroups: React.FC<SubscriptionGroupsProps> = ({
  onToggleSidebar,
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const subscriptionGroupsData: SubscriptionGroup[] = [
    {
      id: '1',
      name: 'Plan Gold',
      includedPlans: [
        'New Paywall Creation',
        'Access To Space Set 1',
        'Access To Space Set 2',
        'Testing Currencies Usd',
        'Test',
        'Test 1',
        'Test With Courses',
        'Pedro Test',
        "Sushant's Trial Paywall",
        'Testing Access Badges Bug',
        'New Paywall Karthik',
        'Paywall Variations Free Trial + Upfront Payment',
        'Mariana Trial 2024',
        'Jan 1 (Recurring)',
        'All Prices',
        'Onetime With Trial',
        'Flow Founders Pricing Membership T',
        'Courtney Lazar',
        'New Template',
      ],
    },
    {
      id: '2',
      name: 'Plan Silver',
      includedPlans: ['Alexis Legacy Access 2'],
    },
    {
      id: '3',
      name: 'Basic',
      includedPlans: ['Test', 'Paywall With Free Trial', 'Small'],
    },
    {
      id: '4',
      name: 'Regular Membership Tiers',
      includedPlans: ['Basic Plan'],
    },
    {
      id: '5',
      name: 'Test1',
      includedPlans: ['Q Aing Currencies'],
    },
    {
      id: '6',
      name: 'Test2',
      includedPlans: [],
    },
    {
      id: '7',
      name: 'USD Members',
      includedPlans: ['Access Groups Team', 'Epic Mountain Getaway'],
    },
    {
      id: '8',
      name: 'SG 04',
      includedPlans: [],
    },
    {
      id: '9',
      name: 'Premium Plan',
      includedPlans: [
        'Premium Access',
        'Advanced Features',
        'Priority Support',
      ],
    },
    {
      id: '10',
      name: 'Enterprise',
      includedPlans: [
        'Enterprise Features',
        'Custom Integration',
        'Dedicated Support',
      ],
    },
    {
      id: '11',
      name: 'Starter',
      includedPlans: ['Basic Features', 'Email Support'],
    },
    {
      id: '12',
      name: 'Professional',
      includedPlans: ['Advanced Features', 'Phone Support', 'Custom Reports'],
    },
    {
      id: '13',
      name: 'Team Plan',
      includedPlans: [
        'Team Collaboration',
        'Shared Workspace',
        'Team Analytics',
      ],
    },
    {
      id: '14',
      name: 'Individual',
      includedPlans: ['Personal Features', 'Basic Support'],
    },
    {
      id: '15',
      name: 'Business',
      includedPlans: [
        'Business Features',
        'Priority Support',
        'Custom Integration',
      ],
    },
    {
      id: '16',
      name: 'Enterprise Plus',
      includedPlans: [
        'All Enterprise Features',
        'White Label',
        'Custom Development',
      ],
    },
    {
      id: '17',
      name: 'Freelancer',
      includedPlans: ['Freelancer Tools', 'Portfolio Features'],
    },
    {
      id: '18',
      name: 'Agency',
      includedPlans: [
        'Agency Tools',
        'Client Management',
        'Team Collaboration',
      ],
    },
    {
      id: '19',
      name: 'Non-Profit',
      includedPlans: ['Non-Profit Features', 'Discounted Pricing'],
    },
    {
      id: '20',
      name: 'Student',
      includedPlans: ['Student Features', 'Educational Resources'],
    },
    {
      id: '21',
      name: 'Trial',
      includedPlans: ['Limited Features', 'Trial Period'],
    },
    {
      id: '22',
      name: 'Beta',
      includedPlans: ['Beta Features', 'Early Access'],
    },
    {
      id: '23',
      name: 'Legacy',
      includedPlans: ['Legacy Features', 'Grandfathered Pricing'],
    },
    {
      id: '24',
      name: 'VIP',
      includedPlans: ['VIP Features', 'Concierge Support', 'Exclusive Access'],
    },
    {
      id: '25',
      name: 'Standard',
      includedPlans: ['Standard Features', 'Standard Support'],
    },
    {
      id: '26',
      name: 'Advanced',
      includedPlans: ['Advanced Features', 'Advanced Analytics', 'API Access'],
    },
    {
      id: '27',
      name: 'Ultimate',
      includedPlans: ['All Features', 'Unlimited Usage', 'Premium Support'],
    },
    {
      id: '28',
      name: 'Starter Plus',
      includedPlans: ['Starter Features', 'Email Support', 'Basic Analytics'],
    },
    {
      id: '29',
      name: 'Growth',
      includedPlans: ['Growth Features', 'Growth Analytics', 'Marketing Tools'],
    },
    {
      id: '30',
      name: 'Scale',
      includedPlans: [
        'Scale Features',
        'Advanced Analytics',
        'Custom Workflows',
      ],
    },
    {
      id: '31',
      name: 'Foundation',
      includedPlans: ['Foundation Features', 'Basic Support'],
    },
    {
      id: '32',
      name: 'Development',
      includedPlans: ['Development Features', 'API Access', 'Webhooks'],
    },
    {
      id: '33',
      name: 'Production',
      includedPlans: [
        'Production Features',
        'High Availability',
        'SLA Support',
      ],
    },
    {
      id: '34',
      name: 'Testing',
      includedPlans: ['Testing Features', 'Sandbox Environment'],
    },
    {
      id: '35',
      name: 'Demo',
      includedPlans: ['Demo Features', 'Limited Time Access'],
    },
    {
      id: '36',
      name: 'Evaluation',
      includedPlans: ['Evaluation Features', 'Trial Period'],
    },
    {
      id: '37',
      name: 'Pilot',
      includedPlans: ['Pilot Features', 'Beta Access'],
    },
    {
      id: '38',
      name: 'Launch',
      includedPlans: ['Launch Features', 'Early Access', 'Special Pricing'],
    },
  ];

  const columns: TableColumn<SubscriptionGroup>[] = [
    {
      key: 'name',
      label: 'NAME',
      render: (item: SubscriptionGroup) => (
        <span className="font-medium text-primary">{item.name}</span>
      ),
    },
    {
      key: 'includedPlans',
      label: 'INCLUDED PLANS',
      render: (item: SubscriptionGroup) => (
        <div className="text-primary">
          {item.includedPlans.length > 0 ? (
            <span>{item.includedPlans.join(', ')}</span>
          ) : (
            <span className="text-disabled italic">No plans included</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (_item: SubscriptionGroup) => (
        <div className="flex justify-end">
          <button className="text-link hover:text-link-hover text-sm font-medium">
            Edit
          </button>
        </div>
      ),
    },
  ];

  const totalItems = subscriptionGroupsData.length;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = subscriptionGroupsData.slice(startIndex, endIndex);

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
      title="Subscription groups"
      onToggleSidebar={onToggleSidebar}
      actions={
        <div className="flex items-center space-x-3">
          <Button variant="primary">Create group</Button>
        </div>
      }
    >
      {/* Information Box */}
      <div className="px-6 py-4">
        <div className="bg-secondary rounded-lg p-4 border border-primary">
          <div className="flex items-start space-x-3">
            <div className="shrink-0">
              <div className="w-6 h-6 bg-disabled rounded-full flex items-center justify-center">
                <span className="text-secondary text-sm font-bold">?</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-primary mb-2">
                What are subscription groups?
              </h3>
              <p className="text-sm text-secondary leading-relaxed">
                Subscription groups allow you to group a set of subscription
                paywalls to allow your members to upgrade or downgrade between
                them. For example, you could group your &ldquo;Lite&rdquo;
                paywall with your &ldquo;Pro&rdquo; paywall to allow members to
                switch between the two subscriptions. Grouping subscription
                paywalls will also prevent members from being able to subscribe
                to both of them at once. <Link href="#">Learn more</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

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

export default SubscriptionGroups;
