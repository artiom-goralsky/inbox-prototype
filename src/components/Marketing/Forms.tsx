import React, { useState } from 'react';
import ContentContainer from '../ContentContainer/ContentContainer';
import TableEnhanced, { TableColumn } from '../ui/table-enhanced';
import Actions from '../ui/actions';
import Pagination from '../ui/pagination';
import { exportToCSV } from '../../utils/csvExport';
import { FilterCondition } from '../ui/filter-modal';
import { Badge } from '@circleco/compass/components/Badge';

interface Form {
  id: string;
  name: string;
  status: 'Published' | 'Draft';
  edited: string;
  submissions: number;
}

interface FormsProps {
  onToggleSidebar: () => void;
}

const Forms: React.FC<FormsProps> = ({ onToggleSidebar }) => {
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [showAllFilters, setShowAllFilters] = useState(false);

  const [forms, setForms] = useState<Form[]>([
    {
      id: '1',
      name: "Ridhwana K's form",
      status: 'Published',
      edited: 'Aug 15, 2025',
      submissions: 1,
    },
    {
      id: '2',
      name: 'Unique Name form',
      status: 'Published',
      edited: 'Aug 14, 2025',
      submissions: 5,
    },
    {
      id: '3',
      name: 'Chintan - Waitlist',
      status: 'Published',
      edited: 'Aug 13, 2025',
      submissions: 3,
    },
    {
      id: '4',
      name: 'Test',
      status: 'Published',
      edited: 'Aug 14, 2025',
      submissions: 4,
    },
    {
      id: '5',
      name: 'TTTesting',
      status: 'Published',
      edited: 'Aug 11, 2025',
      submissions: 0,
    },
    {
      id: '6',
      name: 'Test form',
      status: 'Draft',
      edited: 'Aug 05, 2025',
      submissions: 0,
    },
  ]);

  // Filter configuration
  const filters = [
    {
      id: 'status',
      label: 'Status',
      type: 'select' as const,
      options: ['Published', 'Draft'],
    },
    {
      id: 'name',
      label: 'Name',
      type: 'text' as const,
    },
  ];

  // Apply filters
  const filteredForms = forms.filter(form => {
    return activeFilters.every(filter => {
      switch (filter.field) {
        case 'status': {
          return filter.operator === 'is'
            ? form.status === filter.value
            : form.status !== filter.value;
        }
        case 'name': {
          const name = form.name.toLowerCase();
          const searchValue = filter.value.toLowerCase();
          return filter.operator === 'contains'
            ? name.includes(searchValue)
            : !name.includes(searchValue);
        }
        default:
          return true;
      }
    });
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedForms = filteredForms.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    if (selectedForms.length === paginatedForms.length) {
      setSelectedForms([]);
    } else {
      setSelectedForms(paginatedForms.map(f => f.id));
    }
  };

  const handleSelectForm = (formId: string) => {
    setSelectedForms(prev =>
      prev.includes(formId)
        ? prev.filter(id => id !== formId)
        : [...prev, formId]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedForms.length === 0) return;
    setForms(prev => prev.filter(form => !selectedForms.includes(form.id)));
    setSelectedForms([]);
  };

  const handlePublishSelected = () => {
    if (selectedForms.length === 0) return;
    setForms(prev =>
      prev.map(form =>
        selectedForms.includes(form.id)
          ? { ...form, status: 'Published' as const }
          : form
      )
    );
    setSelectedForms([]);
  };

  const handleDraftSelected = () => {
    if (selectedForms.length === 0) return;
    setForms(prev =>
      prev.map(form =>
        selectedForms.includes(form.id)
          ? { ...form, status: 'Draft' as const }
          : form
      )
    );
    setSelectedForms([]);
  };

  const tableColumns: TableColumn<Form>[] = [
    {
      key: 'name',
      label: 'FORM NAME',
      render: form => (
        <div className="font-medium text-primary">{form.name}</div>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      render: form => (
        <Badge
          label={form.status}
          variant={form.status === 'Published' ? 'success' : 'secondary'}
        />
      ),
    },
    {
      key: 'edited',
      label: 'EDITED',
      render: form => <span className="text-primary">{form.edited}</span>,
    },
    {
      key: 'submissions',
      label: 'SUBMISSIONS',
      render: form => (
        <span className="text-primary text-right">{form.submissions}</span>
      ),
      className: 'text-right',
    },
  ];

  return (
    <ContentContainer
      title="Forms"
      onToggleSidebar={onToggleSidebar}
      actions={
        <button type="button" className="flex items-center gap-2 bg-[var(--comp-button-primary-enabled-bg)] text-[var(--comp-button-primary-enabled-text)] hover:bg-[var(--comp-button-primary-hover-bg)] rounded-lg px-3 py-1.5 text-sm font-medium">
          New form
        </button>
      }
      filters={filters}
      activeFilters={activeFilters}
      onFilterChange={setActiveFilters}
      showAllFilters={showAllFilters}
      onShowAllFiltersChange={setShowAllFilters}
    >
      {/* Actions */}
      <Actions
        selectedCount={selectedForms.length}
        totalCount={filteredForms.length}
        onDeleteSelected={handleDeleteSelected}
        selectedData={paginatedForms.filter(form =>
          selectedForms.includes(form.id)
        )}
        exportFilename="forms.csv"
        onShowAllFilters={() => setShowAllFilters(!showAllFilters)}
        bulkActions={[
          {
            id: 'export',
            label: 'Export selected',
            onClick: () => {
              const selectedData = paginatedForms.filter(form =>
                selectedForms.includes(form.id)
              );
              exportToCSV(selectedData, 'forms.csv');
            },
            disabled: selectedForms.length === 0,
          },
          {
            id: 'publish',
            label: 'Publish selected',
            onClick: handlePublishSelected,
            disabled: selectedForms.length === 0,
          },
          {
            id: 'draft',
            label: 'Move to draft',
            onClick: handleDraftSelected,
            disabled: selectedForms.length === 0,
          },
          {
            id: 'delete',
            label: 'Delete selected',
            onClick: handleDeleteSelected,
            disabled: selectedForms.length === 0,
          },
        ]}
      />

      {/* Table */}
      <TableEnhanced
        columns={tableColumns}
        data={paginatedForms}
        selectedItems={selectedForms}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectForm}
        containerClassName="bg-primary"
      />

      {/* Pagination */}
      <Pagination
        count={forms.length}
        page={currentPage}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </ContentContainer>
  );
};

export default Forms;
