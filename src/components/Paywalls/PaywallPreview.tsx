import React from 'react';

const PaywallPreview: React.FC = () => {
  return (
    <div className="bg-primary rounded-lg max-h-screen shadow-lg border border-primary overflow-hidden m-4">
      {/* Top Visual Elements */}
      <div className="relative h-48 bg-linear-to-br from-purple-400 via-purple-500 to-purple-600 overflow-hidden">
        {/* Scattered oval elements */}
        <div className="absolute top-4 left-4 w-32 h-16 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-white font-medium">On</span>
          </div>
        </div>

        <div className="absolute top-8 right-8 w-28 h-14 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-xs text-white font-medium">Off</span>
          </div>
        </div>

        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-36 h-18 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-white font-medium">On</span>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 w-32 h-16 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-xs text-white font-medium">Off</span>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 w-28 h-14 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-white font-medium">On</span>
          </div>
        </div>

        {/* Central prominent element */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-20 bg-primary bg-opacity-30 rounded-full flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4 text-purple-200"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-sm text-white font-semibold">
              Priority messaging access
            </span>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Paywall Content */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-primary mb-6">
          Priority messaging access
        </h2>

        {/* Subscription Options */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3 p-3 bg-secondary rounded-lg">
            <input
              type="radio"
              name="subscription"
              defaultChecked
              className="w-4 h-4 text-link"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-primary">$100 /year</div>
              <div className="text-xs text-tertiary">Annual subscription</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 border border-primary rounded-lg">
            <input
              type="radio"
              name="subscription"
              className="w-4 h-4 text-link"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-primary">$10 /month</div>
              <div className="text-xs text-tertiary">Monthly subscription</div>
            </div>
          </div>
        </div>

        {/* Coupon Code */}
        <div className="mb-6">
          <button className="text-sm text-link hover:text-link-hover transition-colors">
            + Coupon code
          </button>
        </div>

        {/* Order Summary */}
        <div className="border-t border-primary pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary">
              Total due today
            </span>
            <span className="text-lg font-bold text-primary">$100 USD</span>
          </div>
          <button className="text-xs text-link hover:text-link-hover transition-colors mb-2">
            View order details
          </button>
          <p className="text-xs text-tertiary">
            Tax is included. Next annual payment: 13 Mar, 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaywallPreview;
