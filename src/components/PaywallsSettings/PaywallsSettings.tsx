import React, { useState } from 'react';
import { Switch } from '@circleco/compass/components/Switch';
import ContentContainer from '../ContentContainer/ContentContainer';
import Collapse from '../ui/collapse';

interface PaywallsSettingsProps {
  onToggleSidebar: () => void;
}

const PaywallsSettings: React.FC<PaywallsSettingsProps> = ({
  onToggleSidebar,
}) => {
  const [paymentMethods, setPaymentMethods] = useState({
    cards: true,
    applePay: true,
    googlePay: true,
    link: false,
  });

  const [buyNowPayLater, setBuyNowPayLater] = useState({
    klarna: true,
    afterpay: true,
    affirm: true,
  });

  const togglePaymentMethod = (method: keyof typeof paymentMethods) => {
    setPaymentMethods(prev => ({
      ...prev,
      [method]: !prev[method],
    }));
  };

  const toggleBuyNowPayLater = (method: keyof typeof buyNowPayLater) => {
    setBuyNowPayLater(prev => ({
      ...prev,
      [method]: !prev[method],
    }));
  };

  return (
    <ContentContainer title="Settings" onToggleSidebar={onToggleSidebar}>
      <div className="overflow-y-auto">
        <div className="max-w-4xl mx-auto py-6 px-6">
          <div className="bg-primary rounded-lg space-y-6">
            <Collapse title="Settings" defaultOpen={true}>
              <div className="space-y-8">
                {/* Payment methods section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-primary">
                      Payment methods
                    </h3>
                    <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs text-secondary">i</span>
                    </div>
                  </div>
                  <p className="text-sm text-secondary">
                    Improve conversion by offering your members more ways to
                    pay.
                  </p>

                  <div className="space-y-0 border-t border-primary">
                    {/* Cards */}
                    <div className="flex items-center justify-between py-4 border-b border-primary">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-active rounded flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-secondary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-primary">Cards</div>
                          <div className="text-sm text-tertiary">
                            Popular globally
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-green-600 font-medium">
                          Active
                        </span>
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Apple Pay */}
                    <div className="flex items-center justify-between py-4 border-b border-primary">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-active rounded flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-secondary"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-primary">
                            Apple Pay
                          </div>
                          <div className="text-sm text-tertiary">
                            Popular globally
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={paymentMethods.applePay}
                        onCheckedChange={() => togglePaymentMethod('applePay')}
                      />
                    </div>

                    {/* Google Pay */}
                    <div className="flex items-center justify-between py-4 border-b border-primary">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-active rounded flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-secondary"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                            />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                            />
                            <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill="#EA4335"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-primary">
                            Google Pay
                          </div>
                          <div className="text-sm text-tertiary">
                            Popular globally
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={paymentMethods.googlePay}
                        onCheckedChange={() => togglePaymentMethod('googlePay')}
                      />
                    </div>

                    {/* Link */}
                    <div className="flex items-center justify-between py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-primary">Link</div>
                          <div className="text-sm text-tertiary">
                            Check out faster with stored payment methods &
                            one-click checkout
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={paymentMethods.link}
                        onCheckedChange={() => togglePaymentMethod('link')}
                      />
                    </div>
                  </div>
                </div>

                {/* Buy now, pay later section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-primary">
                      Buy now, pay later
                    </h3>
                    <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs text-secondary">i</span>
                    </div>
                  </div>

                  <div className="space-y-0 border-t border-primary">
                    {/* Klarna */}
                    <div className="flex items-center justify-between py-4 border-b border-primary">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-pink-100 rounded flex items-center justify-center">
                          <span className="text-pink-600 font-bold text-sm">
                            K
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-primary">Klarna</div>
                          <div className="text-sm text-tertiary">
                            Popular in Europe and United States.
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button className="text-sm text-link underline">
                          Details
                        </button>
                        <Switch
                          checked={buyNowPayLater.klarna}
                          onCheckedChange={() => toggleBuyNowPayLater('klarna')}
                        />
                      </div>
                    </div>

                    {/* Afterpay / Clearpay */}
                    <div className="flex items-center justify-between py-4 border-b border-primary">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                          <span className="text-green-600 font-bold text-sm">
                            A2
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-primary">
                            Afterpay / Clearpay
                          </div>
                          <div className="text-sm text-tertiary">
                            Popular in Australia, Canada, New Zealand, The
                            United Kingdom, and United States.
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button className="text-sm text-link underline">
                          Details
                        </button>
                        <Switch
                          checked={buyNowPayLater.afterpay}
                          onCheckedChange={() => toggleBuyNowPayLater('afterpay')}
                        />
                      </div>
                    </div>

                    {/* Affirm */}
                    <div className="flex items-center justify-between py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-link font-bold text-sm">a</span>
                        </div>
                        <div>
                          <div className="font-medium text-primary">Affirm</div>
                          <div className="text-sm text-tertiary">
                            Popular in United States and Canada.
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button className="text-sm text-link underline">
                          Details
                        </button>
                        <Switch
                          checked={buyNowPayLater.affirm}
                          onCheckedChange={() => toggleBuyNowPayLater('affirm')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Collapse>
          </div>
        </div>
      </div>
    </ContentContainer>
  );
};

export default PaywallsSettings;
