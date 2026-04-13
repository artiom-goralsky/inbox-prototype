import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Button } from '@circleco/compass/components/Button';
import { Select } from '@circleco/compass/components/Select';
import FilterPill from './FilterPill';
import FilterFieldPicker from './FilterFieldPicker';
import FilterValueInput from './FilterValueInput';
import type { FilterFieldDef } from './viewFiltersConfig';
import type { ViewFilter, ViewFilter as VF, InboxCategory, FilterOperator } from './viewTypes';

type AddStep = 'idle' | 'pickField' | 'pickOperator' | 'pickValue';

interface OperatorOption {
  value: FilterOperator;
  label: string;
}

interface FilterBuilderProps {
  filters: ViewFilter[];
  category: InboxCategory | 'all';
  onFiltersChange: (filters: ViewFilter[]) => void;
}

const FilterBuilder: React.FC<FilterBuilderProps> = ({ filters, category, onFiltersChange }) => {
  const [addStep, setAddStep] = useState<AddStep>('idle');
  const [selectedField, setSelectedField] = useState<FilterFieldDef | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<OperatorOption | null>(null);
  const [pendingValue, setPendingValue] = useState('');

  const resetAddFlow = () => {
    setAddStep('idle');
    setSelectedField(null);
    setSelectedOperator(null);
    setPendingValue('');
  };

  const confirmFilter = (value: string, valueLabel?: string) => {
    if (!selectedField || !selectedOperator) return;
    // If no valueLabel provided, try to look up from options
    const resolvedLabel =
      valueLabel ?? selectedField.options?.find(o => o.value === value)?.label;

    const filter: VF = {
      id: `filter-${Date.now()}`,
      field: selectedField.field,
      fieldLabel: selectedField.label,
      operator: selectedOperator.value,
      operatorLabel: selectedOperator.label,
      value,
      valueLabel: resolvedLabel,
    };
    onFiltersChange([...filters, filter]);
    resetAddFlow();
  };

  const handleFieldSelect = (fieldDef: FilterFieldDef) => {
    setSelectedField(fieldDef);
    if (fieldDef.operators.length === 1) {
      const op = fieldDef.operators[0];
      setSelectedOperator(op);
      if (fieldDef.valueType === 'boolean') {
        // Auto-confirm: value is derived from operator
        const boolValue = op.value === 'isTrue' ? 'yes' : 'no';
        const filter: VF = {
          id: `filter-${Date.now()}`,
          field: fieldDef.field,
          fieldLabel: fieldDef.label,
          operator: op.value,
          operatorLabel: op.label,
          value: boolValue,
        };
        onFiltersChange([...filters, filter]);
        resetAddFlow();
      } else {
        setAddStep('pickValue');
      }
    } else {
      setAddStep('pickOperator');
    }
  };

  const handleOperatorSelect = (op: OperatorOption) => {
    setSelectedOperator(op);
    if (selectedField?.valueType === 'boolean') {
      const boolValue = op.value === 'isTrue' ? 'yes' : 'no';
      const filter: VF = {
        id: `filter-${Date.now()}`,
        field: selectedField.field,
        fieldLabel: selectedField.label,
        operator: op.value,
        operatorLabel: op.label,
        value: boolValue,
      };
      onFiltersChange([...filters, filter]);
      resetAddFlow();
    } else {
      setAddStep('pickValue');
    }
  };

  const operatorOptions: OperatorOption[] =
    selectedField?.operators.map(o => ({ value: o.value, label: o.label })) ?? [];

  return (
    <div className="flex flex-col gap-3">
      {/* Active filter pills */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          {filters.map((f, i) => (
            <React.Fragment key={f.id}>
              {i > 0 && (
                <Typography variant="caption" color="tertiary">and</Typography>
              )}
              <FilterPill
                filter={f}
                onRemove={() => onFiltersChange(filters.filter(x => x.id !== f.id))}
              />
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Add filter flow */}
      {addStep === 'idle' && (
        <Button
          variant="ghost"
          size="sm"
          startIcon="plus"
          onClick={() => setAddStep('pickField')}
        >
          Add filter
        </Button>
      )}

      {addStep === 'pickField' && (
        <div className="flex flex-col gap-2">
          <FilterFieldPicker
            category={category}
            existingFields={filters.map(f => f.field)}
            onSelect={handleFieldSelect}
            onCancel={resetAddFlow}
          />
          <Button variant="ghost" size="sm" onClick={resetAddFlow} className="self-start">
            Cancel
          </Button>
        </div>
      )}

      {addStep === 'pickOperator' && selectedField && (
        <div className="flex items-center gap-2 flex-wrap">
          <Typography variant="label-sm" color="primary">{selectedField.label}</Typography>
          <Select
            options={operatorOptions}
            value={operatorOptions.find(o => o.value === selectedOperator?.value) ?? null}
            onValueChange={opt => {
              if (opt) {
                const found = selectedField.operators.find(o => o.value === opt.value);
                if (found) handleOperatorSelect(found);
              }
            }}
            placeholder="Select operator..."
            aria-label="Operator"
          />
          <Button variant="ghost" size="sm" onClick={resetAddFlow}>Cancel</Button>
        </div>
      )}

      {addStep === 'pickValue' && selectedField && selectedOperator && (
        <div className="flex items-center gap-2 flex-wrap">
          <Typography variant="label-sm" color="primary">{selectedField.label}</Typography>
          <Typography variant="body-sm" color="secondary">{selectedOperator.label}</Typography>
          <FilterValueInput
            fieldDef={selectedField}
            operator={selectedOperator.value}
            value={pendingValue}
            onChange={setPendingValue}
            onConfirm={confirmFilter}
          />
          <Button variant="ghost" size="sm" onClick={resetAddFlow}>Cancel</Button>
        </div>
      )}
    </div>
  );
};

export default FilterBuilder;
