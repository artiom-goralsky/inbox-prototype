import React from 'react';
import { Select } from '@circleco/compass/components/Select';
import { MultiSelect } from '@circleco/compass/components/MultiSelect';
import { TextInput } from '@circleco/compass/components/TextInput';
import { NumberInput } from '@circleco/compass/components/NumberInput';
import { DateInput } from '@circleco/compass/components/DateInput';
import type { FilterFieldDef } from './viewFiltersConfig';
import type { FilterOperator } from './viewTypes';

interface FilterValueInputProps {
  fieldDef: FilterFieldDef;
  operator: FilterOperator;
  value: string;
  onChange: (value: string) => void;
  onConfirm: (finalValue: string, finalLabel?: string) => void;
}

const FilterValueInput: React.FC<FilterValueInputProps> = ({
  fieldDef,
  value,
  onChange,
  onConfirm,
}) => {
  const options = fieldDef.options?.map(o => ({ value: o.value, label: o.label })) ?? [];

  switch (fieldDef.valueType) {
    case 'select':
      return (
        <Select
          options={options}
          value={options.find(o => o.value === value) ?? null}
          onValueChange={opt => {
            if (opt) {
              onChange(opt.value);
              onConfirm(opt.value, opt.label);
            }
          }}
          placeholder="Select value..."
          aria-label="Filter value"
        />
      );

    case 'multiSelect': {
      const selected = value
        ? value.split(',').map(v => options.find(o => o.value === v)!).filter(Boolean)
        : [];
      return (
        <MultiSelect
          options={options}
          value={selected}
          onValueChange={opts => onChange(opts.map(o => o.value).join(','))}
          placeholder="Select values..."
          aria-label="Filter values"
        />
      );
    }

    case 'text':
      return (
        <TextInput
          value={value}
          onChange={e => onChange((e.target as HTMLInputElement).value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && value.trim()) {
              e.preventDefault();
              onConfirm(value.trim());
            }
          }}
          placeholder="Enter value..."
          aria-label="Filter value"
        />
      );

    case 'number':
      return (
        <NumberInput
          value={value ? Number(value) : null}
          onValueChange={num => onChange(num != null ? String(num) : '')}
          onValueCommitted={num => { if (num != null) onConfirm(String(num)); }}
          placeholder="0"
          aria-label="Filter value"
        />
      );

    case 'date':
      return (
        <DateInput
          selected={value ? new Date(value) : undefined}
          onSelect={date => {
            if (date) {
              const iso = date.toISOString().split('T')[0];
              onChange(iso);
              onConfirm(iso);
            }
          }}
          placeholder="Select date..."
          aria-label="Filter date"
        />
      );

    case 'boolean':
      // Value is determined by the operator — no input needed
      return null;

    default:
      return null;
  }
};

export default FilterValueInput;
