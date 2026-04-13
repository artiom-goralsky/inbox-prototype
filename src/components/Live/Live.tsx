import React, { useState } from 'react';
import { TableEnhanced as Table, TableColumn } from '../ui';
import ContentContainer from '../ContentContainer';
import { FilterCondition } from '../ui/filter-modal';
import Actions from '../ui/actions';
import Pagination from '../ui/pagination';
import { Button } from '@circleco/compass/components/Button';
import { applyFilters } from '../../utils/filterHelpers';
import { exportToCSV } from '../../utils/csvExport';
import { Badge } from '@circleco/compass/components/Badge';

interface LiveStream {
  id: string;
  title: string;
  host: {
    name: string;
    initials: string;
    color: string;
  };
  status: 'Live' | 'Ended' | 'Scheduled';
  duration: string;
  viewers: number;
  startedAt: string;
}

interface LiveProps {
  onToggleSidebar: () => void;
}

const Live: React.FC<LiveProps> = ({ onToggleSidebar }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);

  // Mock data for live streams
  const [streams, setStreams] = useState<LiveStream[]>([
    {
      id: '1',
      title: 'Community Q&A Session',
      host: {
        name: 'John Doe',
        initials: 'JD',
        color: 'bg-blue-500',
      },
      status: 'Live',
      duration: '1h 23m',
      viewers: 156,
      startedAt: '2 hours ago',
    },
    {
      id: '2',
      title: 'Product Demo Live',
      host: {
        name: 'Jane Smith',
        initials: 'JS',
        color: 'bg-green-500',
      },
      status: 'Ended',
      duration: '45m',
      viewers: 89,
      startedAt: '1 day ago',
    },
    {
      id: '3',
      title: 'Weekly Community Update',
      host: {
        name: 'Mike Johnson',
        initials: 'MJ',
        color: 'bg-purple-500',
      },
      status: 'Scheduled',
      duration: '0m',
      viewers: 0,
      startedAt: 'Tomorrow 2:00 PM',
    },
    {
      id: '4',
      title: 'Expert Interview Series',
      host: {
        name: 'Sarah Wilson',
        initials: 'SW',
        color: 'bg-orange-500',
      },
      status: 'Ended',
      duration: '1h 15m',
      viewers: 234,
      startedAt: '3 days ago',
    },
  ]);

  // Filter and pagination logic
  const getFilteredData = () => {
    return applyFilters(streams, activeFilters);
  };

  const filteredData = getFilteredData();
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    if (selectedStreams.length === paginatedData.length) {
      setSelectedStreams([]);
    } else {
      setSelectedStreams(paginatedData.map(stream => stream.id));
    }
  };

  const handleSelectItem = (streamId: string) => {
    setSelectedStreams(prev =>
      prev.includes(streamId)
        ? prev.filter(id => id !== streamId)
        : [...prev, streamId]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedStreams.length === 0) return;
    setStreams(prev =>
      prev.filter(stream => !selectedStreams.includes(stream.id))
    );
    setSelectedStreams([]);
  };

  const handleEndSelected = () => {
    if (selectedStreams.length === 0) return;
    setStreams(prev =>
      prev.map(stream =>
        selectedStreams.includes(stream.id)
          ? { ...stream, status: 'Ended' as const }
          : stream
      )
    );
    setSelectedStreams([]);
  };

  const handleScheduleSelected = () => {
    if (selectedStreams.length === 0) return;
    setStreams(prev =>
      prev.map(stream =>
        selectedStreams.includes(stream.id)
          ? { ...stream, status: 'Scheduled' as const }
          : stream
      )
    );
    setSelectedStreams([]);
  };

  const filters = [
    {
      id: 'status',
      label: 'Status',
      type: 'select' as const,
      options: ['Live', 'Ended', 'Scheduled'],
    },
    {
      id: 'title',
      label: 'Title',
      type: 'text' as const,
    },
    {
      id: 'host',
      label: 'Host',
      type: 'text' as const,
    },
  ];

  const tableColumns: TableColumn<LiveStream>[] = [
    {
      key: 'title',
      label: 'TITLE',
      render: (stream: LiveStream) => (
        <span className="text-sm text-primary font-medium">{stream.title}</span>
      ),
    },
    {
      key: 'host',
      label: 'HOST',
      render: (stream: LiveStream) => (
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 rounded-full ${stream.host.color} flex items-center justify-center`}
          >
            <span className="text-xs text-white font-medium">
              {stream.host.initials}
            </span>
          </div>
          <span className="text-sm text-primary">{stream.host.name}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (stream: LiveStream) => {
        let variant: 'destructive' | 'secondary' | 'info' = 'secondary';
        if (stream.status === 'Live') variant = 'destructive';
        else if (stream.status === 'Scheduled') variant = 'info';
        return <Badge label={stream.status} variant={variant} />;
      },
    },
    {
      key: 'duration',
      label: 'DURATION',
      render: (stream: LiveStream) => (
        <span className="text-sm text-secondary">{stream.duration}</span>
      ),
    },
    {
      key: 'viewers',
      label: 'VIEWERS',
      render: (stream: LiveStream) => (
        <span className="text-sm text-secondary">{stream.viewers}</span>
      ),
    },
    {
      key: 'startedAt',
      label: 'STARTED AT',
      render: (stream: LiveStream) => (
        <span className="text-sm text-secondary">{stream.startedAt}</span>
      ),
    },
  ];

  // Statistics cards
  const stats = [
    {
      label: 'Total Streams',
      value: streams.length,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      label: 'Active Viewers',
      value: streams
        .filter(s => s.status === 'Live')
        .reduce((sum, s) => sum + s.viewers, 0),
      change: '+5%',
      changeType: 'positive' as const,
    },
    {
      label: 'Avg. Duration',
      value: '45m',
      change: '-2%',
      changeType: 'negative' as const,
    },
    {
      label: 'Engagement Rate',
      value: '78%',
      change: '+8%',
      changeType: 'positive' as const,
    },
  ];

  return (
    <ContentContainer
      onToggleSidebar={onToggleSidebar}
      title="Live"
      actions={<Button variant="primary">Start live stream</Button>}
      filters={filters}
      activeFilters={activeFilters}
      onFilterChange={setActiveFilters}
    >
      {/* Statistics Cards */}
      <div className="shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-primary p-6 rounded-lg border border-primary shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`text-sm font-medium ${
                    stat.changeType === 'positive'
                      ? 'text-green-600'
                      : 'text-danger'
                  }`}
                >
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <Actions
        selectedCount={selectedStreams.length}
        totalCount={filteredData.length}
        onDeleteSelected={handleDeleteSelected}
        selectedData={paginatedData.filter(stream =>
          selectedStreams.includes(stream.id)
        )}
        exportFilename="live-streams.csv"
        bulkActions={[
          {
            id: 'export',
            label: 'Export selected',
            onClick: () => {
              const selectedData = paginatedData.filter(stream =>
                selectedStreams.includes(stream.id)
              );
              exportToCSV(selectedData, 'live-streams.csv');
            },
            disabled: selectedStreams.length === 0,
          },
          {
            id: 'end',
            label: 'End selected',
            onClick: handleEndSelected,
            disabled: selectedStreams.length === 0,
          },
          {
            id: 'schedule',
            label: 'Schedule selected',
            onClick: handleScheduleSelected,
            disabled: selectedStreams.length === 0,
          },
          {
            id: 'delete',
            label: 'Delete selected',
            onClick: handleDeleteSelected,
            disabled: selectedStreams.length === 0,
          },
        ]}
      />

      {/* Table */}
      <Table
        columns={tableColumns}
        data={paginatedData}
        selectedItems={selectedStreams}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
      />

      {/* Pagination */}
      <Pagination
        count={filteredData.length}
        page={currentPage}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </ContentContainer>
  );
};

export default Live;
