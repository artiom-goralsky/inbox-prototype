import React from 'react';

const BumpsTab: React.FC = () => {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-active rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-disabled"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-primary mb-2">Bumps</h3>
        <p className="text-tertiary">Configure upsell and downsell offers</p>
      </div>
    </div>
  );
};

export default BumpsTab;
