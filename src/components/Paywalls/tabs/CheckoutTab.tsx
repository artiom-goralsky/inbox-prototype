import React from 'react';

const CheckoutTab: React.FC = () => {
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
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-primary mb-2">Checkout</h3>
        <p className="text-tertiary">
          Configure checkout settings and payment options
        </p>
      </div>
    </div>
  );
};

export default CheckoutTab;
