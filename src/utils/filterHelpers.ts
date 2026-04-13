import { FilterCondition } from '../components/ui/filter-modal';

export const applyFilters = <T>(
  data: T[],
  activeFilters: FilterCondition[]
): T[] => {
  if (activeFilters.length === 0) {
    return data;
  }

  return data.filter(item => {
    return activeFilters.every(filter => {
      const fieldValue =
        (item as any)[filter.field]?.toString().toLowerCase() || '';
      const filterValue = filter.value.toLowerCase();

      switch (filter.operator) {
        case 'contains':
          return fieldValue.includes(filterValue);
        case 'does not contain':
          return !fieldValue.includes(filterValue);
        case 'is':
          return fieldValue === filterValue;
        case 'is not':
          return fieldValue !== filterValue;
        default:
          return true;
      }
    });
  });
};
