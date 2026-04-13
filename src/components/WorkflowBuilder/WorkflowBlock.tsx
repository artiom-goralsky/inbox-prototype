import React from 'react';
import { mergeClasses } from '../../lib/utils';

interface WorkflowBlockProps {
  type: 'trigger' | 'action' | 'end';
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  status?: 'success' | 'error' | 'loading';
  className?: string;
}

const WorkflowBlock: React.FC<WorkflowBlockProps> = ({
  type,
  title,
  subtitle,
  icon,
  status = 'success',
  className,
}) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'trigger':
        return {
          label: 'Trigger',
          labelColor: 'bg-[#edf0fe] border-[#cdd4f6] text-[#4262f0]',
          icon: (
            <div className="w-3 h-3 bg-[#4262f0] rounded-full flex items-center justify-center">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path
                  d="M4 0L4.5 3.5L8 4L4.5 4.5L4 8L3.5 4.5L0 4L3.5 3.5L4 0Z"
                  fill="white"
                />
              </svg>
            </div>
          ),
        };
      case 'action':
        return {
          label: 'Action',
          labelColor: 'bg-secondary border-tertiary text-secondary',
          icon: (
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"
                  fill="currentColor"
                />
                <path
                  d="M8 2C4.69 2 2 4.69 2 8s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
                  fill="currentColor"
                />
              </svg>
            </div>
          ),
        };
      case 'end':
        return {
          label: 'End',
          labelColor: 'bg-secondary border-tertiary text-secondary',
          icon: (
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect
                  x="2"
                  y="2"
                  width="12"
                  height="12"
                  rx="2"
                  fill="currentColor"
                />
              </svg>
            </div>
          ),
        };
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return (
          <div className="w-5 h-5 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M13.5 4.5L6 12L2.5 8.5"
                stroke="#008A2F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-5 h-5 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1L15 8L8 15L1 8L8 1Z"
                stroke="#FF4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );
      case 'loading':
        return (
          <div className="w-5 h-5 flex items-center justify-center">
            <div className="spinner spinner-sm text-secondary"></div>
          </div>
        );
    }
  };

  const config = getTypeConfig();

  return (
    <div className={mergeClasses('relative', className)}>
      {/* Type Label */}
      <div
        className={mergeClasses(
          'absolute -top-2 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-full border text-xs font-medium flex items-center gap-1',
          config.labelColor
        )}
      >
        {config.icon}
        <span>{config.label}</span>
      </div>

      {/* Main Block */}
      <div className="bg-primary border border-primary rounded-2xl p-4 w-80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            {icon || config.icon}
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary">{title}</p>
              {subtitle && <p className="text-xs text-tertiary">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center">{getStatusIcon()}</div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBlock;
