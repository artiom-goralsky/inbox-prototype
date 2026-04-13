import React from 'react';

const ThankYouTab: React.FC = () => {
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-primary mb-2">
          Thank you page
        </h3>
        <p className="text-tertiary">Customize the post-purchase experience</p>
      </div>
    </div>
  );
};

export default ThankYouTab;
