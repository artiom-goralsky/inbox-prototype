import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { getFieldsForCategory, type FilterFieldDef } from './viewFiltersConfig';
import type { InboxCategory } from './viewTypes';

const CATEGORY_LABELS: Record<string, string> = {
  dms: 'My DMs',
  moderation: 'Moderation',
  comments: 'Course comments',
  ai: 'AI Inbox',
};

interface FilterFieldPickerProps {
  category: InboxCategory | 'all';
  existingFields: string[];
  onSelect: (fieldDef: FilterFieldDef) => void;
  onCancel: () => void;
}

const FilterFieldPicker: React.FC<FilterFieldPickerProps> = ({
  category,
  existingFields,
  onSelect,
}) => {
  const allFields = getFieldsForCategory(category);
  const universalFields = allFields.filter(f => f.categories.includes('all'));
  const categoryFields = allFields.filter(f => !f.categories.includes('all'));

  const renderField = (field: FilterFieldDef) => {
    const isUsed = existingFields.includes(field.field);
    return (
      <div
        key={field.field}
        className={`px-2 py-1.5 rounded-md cursor-pointer hover:bg-hover ${isUsed ? 'opacity-40 pointer-events-none' : ''}`}
        role="button"
        tabIndex={0}
        onClick={() => !isUsed && onSelect(field)}
        onKeyDown={e => e.key === 'Enter' && !isUsed && onSelect(field)}
      >
        <Typography variant="body-sm" color="primary">{field.label}</Typography>
      </div>
    );
  };

  return (
    <div className="border border-secondary rounded-lg bg-primary p-1 min-w-[240px] max-h-[280px] overflow-y-auto shadow-sm">
      <div className="px-2 pt-2 pb-1">
        <Typography variant="label-xs" color="tertiary" className="uppercase tracking-wider">
          Universal
        </Typography>
      </div>
      {universalFields.map(renderField)}

      {categoryFields.length > 0 && (
        <>
          <div className="border-t border-secondary my-1" />
          <div className="px-2 pt-2 pb-1">
            <Typography variant="label-xs" color="tertiary" className="uppercase tracking-wider">
              {CATEGORY_LABELS[category] ?? category}
            </Typography>
          </div>
          {categoryFields.map(renderField)}
        </>
      )}
    </div>
  );
};

export default FilterFieldPicker;
