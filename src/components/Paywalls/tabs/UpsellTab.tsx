import React from 'react';

const UpsellTab: React.FC = () => {
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
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-primary mb-2">Upsell</h3>
        <p className="text-tertiary">Configure additional offers</p>
      </div>
    </div>
  );
};

export default UpsellTab;
