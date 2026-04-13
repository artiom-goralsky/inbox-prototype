import React from 'react';
import { Pagination as CompassPagination } from '@circleco/compass/components/Pagination';

/**
 * Re-export Compass Pagination.
 * Use: count (total items), page (current page 1-based), pageSize, onPageChange(page).
 */
const Pagination = React.forwardRef<
  HTMLElement,
  React.ComponentProps<typeof CompassPagination>
>((props, ref) => (
  <div className="shrink-0 pt-4 pb-2">
    <CompassPagination ref={ref} {...props} />
  </div>
));

Pagination.displayName = 'Pagination';

export default Pagination;
