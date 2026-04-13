import React, { useState } from 'react';
import ContentContainer from '../ContentContainer/ContentContainer';
import { Button } from '@circleco/compass/components/Button';
import TableEnhanced, { TableColumn } from '../ui/table-enhanced';
import { MoreHorizontal, CheckCircle } from 'lucide-react';
import { applyFilters } from '../../utils/filterHelpers';
import { Badge } from '@circleco/compass/components/Badge';

interface HistoryProps {
  onToggleSidebar: () => void;
}

interface WorkflowTask {
  id: string;
  name: string;
  member: {
    initials: string;
    name: string;
    color: string;
  };
  status: 'success' | 'partial-success' | 'failed' | 'pending';
  steps: number;
}

interface TransformedWorkflowTask {
  id: string;
  name: string;
  member: string; // Flattened for filtering
  status: 'success' | 'partial-success' | 'failed' | 'pending';
  steps: number;
}

const History: React.FC<HistoryProps> = ({ onToggleSidebar }) => {
  const [activeTab, setActiveTab] = useState('automations');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [filters, setFilters] = useState<any[]>([]);

  const tabs = [
    { label: 'Automations', value: 'automations', badge: '10,000+' },
    { label: 'Bulk actions', value: 'bulk-actions', badge: '10,000+' },
    { label: 'Scheduled', value: 'scheduled', badge: '10,000+' },
  ];

  const mockData: WorkflowTask[] = [
    {
      id: '1',
      name: 'Quiz completed',
      member: {
        initials: 'AS',
        name: 'Andrii Soboliev',
        color: 'bg-green-500',
      },
      status: 'partial-success',
      steps: 3,
    },
    {
      id: '2',
      name: 'new workflow before filter conditions on actions',
      member: {
        initials: 'HC',
        name: 'Hector Card115',
        color: 'bg-green-500',
      },
      status: 'success',
      steps: 1,
    },
    {
      id: '3',
      name: 'Send a welcome message to any new member that joins the community',
      member: {
        initials: 'HC',
        name: 'Hector Card115',
        color: 'bg-green-500',
      },
      status: 'success',
      steps: 1,
    },
    {
      id: '4',
      name: 'Send a welcome message to any new member that joins the community',
      member: {
        initials: 'HC',
        name: 'Hector Card115',
        color: 'bg-green-500',
      },
      status: 'success',
      steps: 1,
    },
    {
      id: '5',
      name: 'Bulk email campaign',
      member: {
        initials: 'JD',
        name: 'John Doe',
        color: 'bg-blue-500',
      },
      status: 'failed',
      steps: 2,
    },
    {
      id: '6',
      name: 'Member onboarding automation',
      member: {
        initials: 'AS',
        name: 'Andrii Soboliev',
        color: 'bg-green-500',
      },
      status: 'pending',
      steps: 4,
    },
  ];

  const getStatusBadge = (status: WorkflowTask['status']) => {
    switch (status) {
      case 'success':
        return <Badge label="Success" variant="success" />;
      case 'partial-success':
        return <Badge label="Partial Success" variant="warning" />;
      case 'failed':
        return <Badge label="Failed" variant="destructive" />;
      case 'pending':
        return <Badge label="Pending" variant="secondary" />;
      default:
        return null;
    }
  };

  const getStepsIcons = (steps: number) => {
    const icons = [];
    for (let i = 0; i < steps; i++) {
      if (i === steps - 1) {
        icons.push(
          <div
            key={i}
            className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center"
          >
            <CheckCircle className="w-3 h-3 text-link" />
          </div>
        );
      } else {
        icons.push(
          <div
            key={i}
            className="w-6 h-6 rounded-full bg-active flex items-center justify-center"
          >
            <MoreHorizontal className="w-3 h-3 text-tertiary" />
          </div>
        );
      }
    }
    return icons;
  };

  const tableColumns: TableColumn<TransformedWorkflowTask>[] = [
    {
      label: 'NAME',
      key: 'name',
      render: task => (
        <div className="font-medium text-primary">{task.name}</div>
      ),
    },
    {
      label: 'MEMBER',
      key: 'member',
      render: task => {
        // Find original task data for member details
        const originalTask = mockData.find(t => t.id === task.id);
        if (!originalTask) return null;

        return (
          <div className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 rounded-full ${originalTask.member.color} flex items-center justify-center text-white text-sm font-medium`}
            >
              {originalTask.member.initials}
            </div>
            <span className="text-primary">{originalTask.member.name}</span>
          </div>
        );
      },
    },
    {
      label: 'STATUS',
      key: 'status',
      render: task => getStatusBadge(task.status),
    },
    {
      label: 'STEPS',
      key: 'steps',
      render: task => (
        <div className="flex items-center space-x-1">
          {getStepsIcons(task.steps)}
        </div>
      ),
    },
  ];

  const handleSelectAll = () => {
    if (selectedTasks.length === mockData.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(mockData.map(task => task.id));
    }
  };

  const handleSelectTask = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const tabFilteredData = mockData.filter(task => {
    switch (activeTab) {
      case 'automations':
        return true; // Show all for now
      case 'bulk-actions':
        return task.name.includes('bulk') || task.name.includes('action');
      case 'scheduled':
        return task.status === 'pending';
      default:
        return true;
    }
  });

  // Transform data to work with applyFilters
  const transformedData: TransformedWorkflowTask[] = tabFilteredData.map(
    task => ({
      ...task,
      member: task.member.name, // Flatten member name for filtering
    })
  );

  const filteredData = applyFilters(transformedData, filters);

  const filterOptions = [
    {
      id: 'name',
      label: 'Name',
      type: 'text' as const,
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select' as const,
      options: ['success', 'partial-success', 'failed', 'pending'],
    },
    {
      id: 'member',
      label: 'Member',
      type: 'text' as const,
    },
  ];

  return (
    <ContentContainer
      title="History"
      onToggleSidebar={onToggleSidebar}
      actions={<Button>New workflow</Button>}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      filters={filterOptions}
      activeFilters={filters}
      onFilterChange={setFilters}
    >
      {/* Table */}
      <TableEnhanced
        columns={tableColumns}
        data={filteredData}
        selectedItems={selectedTasks}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectTask}
        containerClassName="bg-primary"
      />
    </ContentContainer>
  );
};

export default History;
