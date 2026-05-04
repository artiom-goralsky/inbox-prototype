import React, { useState } from 'react';
import { TableEnhanced as Table, TableColumn } from '../ui';
import ContentContainer from '../ContentContainer';
import { FilterCondition } from '../ui/filter-modal';
import Actions from '../ui/actions';
import Pagination from '../ui/pagination';
import { Button } from '@circleco/compass/components/Button';
import { Badge } from '@circleco/compass/components/Badge';

interface Event {
  id: string;
  name: string;
  status: 'published' | 'draft';
  when: string;
  rsvps: number;
  space: string;
  host: string;
}

interface EventsAdminPageProps {
  onToggleSidebar: () => void;
}

const EventsAdminPage: React.FC<EventsAdminPageProps> = ({ onToggleSidebar }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showAllFilters, setShowAllFilters] = useState(false);

  const [events] = useState<Event[]>([
    { id: '1', name: 'Monetizing your Circle 101', status: 'published', when: '2 weeks ago', rsvps: 43, space: 'General', host: 'Mathilde Leo' },
    { id: '2', name: 'Engagement Resource Roundup', status: 'published', when: '1 month ago', rsvps: 87, space: 'Community Hub', host: 'Sarah Smith' },
    { id: '3', name: 'Community Building Workshop', status: 'draft', when: 'Scheduled in 3 days', rsvps: 0, space: 'Workshops', host: 'John Carter' },
    { id: '4', name: 'Content Strategy Masterclass', status: 'published', when: '3 months ago', rsvps: 124, space: 'Masterclasses', host: 'Helen Varga' },
    { id: '5', name: 'Advanced Monetization Techniques', status: 'published', when: '2 months ago', rsvps: 56, space: 'Masterclasses', host: 'Alex Johnson' },
    { id: '6', name: 'Premium Community Management', status: 'published', when: '4 months ago', rsvps: 31, space: 'General', host: 'Lisa Chen' },
    { id: '7', name: 'Member Retention Strategies', status: 'draft', when: 'Scheduled in 1 week', rsvps: 0, space: 'Workshops', host: 'David Wilson' },
    { id: '8', name: 'Getting Started with Circles', status: 'published', when: '5 months ago', rsvps: 198, space: 'General', host: 'Emma Brown' },
    { id: '9', name: 'Growth Hacking for Communities', status: 'published', when: '6 months ago', rsvps: 75, space: 'Community Hub', host: 'Mathilde Leo' },
    { id: '10', name: 'Live Event Hosting Best Practices', status: 'published', when: '7 months ago', rsvps: 62, space: 'General', host: 'Sarah Smith' },
    { id: '11', name: 'Revenue Streams for Creators', status: 'draft', when: 'Scheduled in 2 weeks', rsvps: 0, space: 'Masterclasses', host: 'John Carter' },
    { id: '12', name: 'Building Your First Paywall', status: 'published', when: '8 months ago', rsvps: 45, space: 'Workshops', host: 'Helen Varga' },
    { id: '13', name: 'Analytics & Insights Deep Dive', status: 'published', when: '9 months ago', rsvps: 89, space: 'Community Hub', host: 'Alex Johnson' },
    { id: '14', name: 'AI Tools for Community Managers', status: 'draft', when: 'Scheduled in 5 days', rsvps: 0, space: 'General', host: 'Lisa Chen' },
    { id: '15', name: 'Circle Platform Q&A Session', status: 'published', when: '10 months ago', rsvps: 143, space: 'General', host: 'David Wilson' },
    { id: '16', name: 'Scaling Your Community to 10k', status: 'published', when: '11 months ago', rsvps: 211, space: 'Masterclasses', host: 'Emma Brown' },
    { id: '17', name: 'Email Marketing for Communities', status: 'draft', when: 'Scheduled in 3 weeks', rsvps: 0, space: 'Workshops', host: 'Mathilde Leo' },
    { id: '18', name: 'UGC and Member Spotlights', status: 'published', when: '1 year ago', rsvps: 37, space: 'Community Hub', host: 'Sarah Smith' },
    { id: '19', name: 'Automations & Workflows Workshop', status: 'published', when: '1 year ago', rsvps: 58, space: 'Workshops', host: 'John Carter' },
    { id: '20', name: 'Year in Review Community Meetup', status: 'draft', when: 'Scheduled in 1 month', rsvps: 0, space: 'General', host: 'Helen Varga' },
  ]);

  const tabs = [
    { label: 'All', value: 'all', badge: events.length.toString() },
    {
      label: 'Published',
      value: 'published',
      badge: events.filter(e => e.status === 'published').length.toString(),
    },
    {
      label: 'Draft',
      value: 'draft',
      badge: events.filter(e => e.status === 'draft').length.toString(),
    },
  ];

  const columns: TableColumn<Event>[] = [
    {
      key: 'name',
      label: 'EVENT NAME',
      render: (item: Event) => (
        <span className="font-medium text-primary">{item.name}</span>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (item: Event) => (
        <Badge
          label={item.status === 'published' ? 'Published' : 'Draft'}
          variant={item.status === 'published' ? 'success' : 'secondary'}
        />
      ),
    },
    {
      key: 'when',
      label: 'WHEN',
      render: (item: Event) => (
        <span className="text-primary">{item.when}</span>
      ),
    },
    {
      key: 'rsvps',
      label: 'RSVPs',
      render: (item: Event) => (
        <span className="text-primary">{item.rsvps}</span>
      ),
    },
  ];

  const filters = [
    {
      id: 'name',
      label: 'Event Name',
      type: 'text' as const,
    },
    {
      id: 'space',
      label: 'Space',
      type: 'select' as const,
      options: ['General', 'Community Hub', 'Workshops', 'Masterclasses'],
    },
    {
      id: 'host',
      label: 'Host',
      type: 'text' as const,
    },
  ];

  const getFilteredData = () => {
    let filtered = events;

    switch (activeTab) {
      case 'published':
        filtered = filtered.filter(e => e.status === 'published');
        break;
      case 'draft':
        filtered = filtered.filter(e => e.status === 'draft');
        break;
      case 'all':
      default:
        break;
    }

    return filtered.filter(event => {
      return activeFilters.every(filter => {
        switch (filter.field) {
          case 'name': {
            const name = event.name.toLowerCase();
            const val = filter.value.toLowerCase();
            return filter.operator === 'contains'
              ? name.includes(val)
              : !name.includes(val);
          }
          case 'space': {
            return filter.operator === 'is'
              ? event.space === filter.value
              : event.space !== filter.value;
          }
          case 'host': {
            const host = event.host.toLowerCase();
            const val = filter.value.toLowerCase();
            return filter.operator === 'contains'
              ? host.includes(val)
              : !host.includes(val);
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

  return (
    <ContentContainer
      title="Events"
      onToggleSidebar={onToggleSidebar}
      actions={
        <div className="flex items-center space-x-3">
          <Button variant="primary">Create event</Button>
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
        onDeleteSelected={() => {}}
        selectedData={currentData.filter((event: any) =>
          selectedItems.includes(event.id)
        )}
        exportFilename="events.csv"
        onShowAllFilters={() => setShowAllFilters(!showAllFilters)}
        bulkActions={[
          {
            id: 'publish',
            label: 'Publish selected',
            onClick: () => {},
            disabled: selectedItems.length === 0,
          },
          {
            id: 'delete',
            label: 'Delete selected',
            onClick: () => {},
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

export default EventsAdminPage;
