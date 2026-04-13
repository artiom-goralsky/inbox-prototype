import React from 'react';
import { mergeClasses } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Spinner per animation guidelines:
 * - 16-24px max, uses currentColor
 * - 0.7s rotation, linear (continuous animation)
 * - Last resort — prefer skeletons or content transitions
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
}) => (
  <div className={mergeClasses('flex items-center justify-center', className)}>
    <div
      className={mergeClasses('spinner', `spinner-${size}`)}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

export default LoadingSpinner;
