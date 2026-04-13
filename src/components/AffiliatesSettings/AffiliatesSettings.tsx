import React, { useState } from 'react';
import ContentContainer from '../ContentContainer/ContentContainer';
import Collapse from '../ui/collapse';
import Button from '../Button/Button';
import { TextArea } from '@circleco/compass/components/TextArea';
import { TextInput } from '@circleco/compass/components/TextInput';
import { Select } from '@circleco/compass/components/Select';

interface AffiliatesSettingsProps {
  onToggleSidebar: () => void;
}

const AffiliatesSettings: React.FC<AffiliatesSettingsProps> = ({
  onToggleSidebar,
}) => {
  const rewardTypeOptions = [
    { label: 'Percentage amount', value: 'percentage' },
    { label: 'Fixed amount', value: 'fixed' },
  ];

  const payoutMethodOptions = [
    { label: 'PayPal', value: 'paypal' },
    { label: 'Stripe', value: 'stripe' },
    { label: 'Bank Transfer', value: 'bank' },
  ];

  const [commissionRate, setCommissionRate] = useState({
    rewardType: 'percentage',
    commissionPercent: '30.0',
    limitRecurring: true,
    limitNumber: '3',
    pendingLength: '30',
    payoutMethod: 'paypal',
  });

  const [promotionalLink, setPromotionalLink] = useState({
    enabled: false,
    pageUrl:
      'https://circle.upfront.so/join?invitation_token=eb12c59c787d9e49b5c3610e808ae',
    description: '',
  });

  const [paywalls, setPaywalls] = useState({
    enableAll: false,
    searchTerm: '',
    selectedPaywalls: ['pay-505-inr', 'daily', 'one-time'],
  });

  const trackingScript = `<script>
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const affiliateCode = urlParams.get('affiliate_code');
const circleUrls = 'demo.circle.so,circle.upfront.so'.split(',');
if (affiliateCode) {
  let currentUrl = window.location.hostname;
  if (circleUrls.includes(currentUrl)) {
    localStorage.setItem('affiliate_code', affiliateCode);
  }
}
</script>`;

  const paywallData = [
    {
      id: 'pay-505-inr',
      name: 'PAY-505-INR',
      pricing: '2 prices',
      commission: '30%',
    },
    {
      id: 'daily',
      name: 'Daily',
      pricing: '₹42.50 INR daily',
      commission: '30%',
    },
    {
      id: 'one-time',
      name: 'One-Time',
      pricing: '₹100 INR',
      commission: '30%',
    },
  ];

  const handleSave = () => {
    // Handle save logic here
  };

  const copyTrackingScript = () => {
    navigator.clipboard.writeText(trackingScript);
  };

  return (
    <ContentContainer title="Settings" onToggleSidebar={onToggleSidebar}>
      <div className="overflow-y-auto">
        <div className="max-w-4xl mx-auto py-6 px-6">
          <div className="bg-primary rounded-lg space-y-8">
            <Collapse title="Settings" defaultOpen={true}>
              <div className="space-y-8">
                {/* Commission rate section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      Commission rate
                    </h3>
                    <p className="text-sm text-secondary mt-1">
                      Set your default commission for each sale referred to a
                      paywall checkout page by an affiliate.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reward type
                      </label>
                      <Select
                        aria-label="Reward type"
                        value={
                          rewardTypeOptions.find(
                            o => o.value === commissionRate.rewardType
                          ) ?? null
                        }
                        onValueChange={option =>
                          setCommissionRate(prev => ({
                            ...prev,
                            rewardType: option?.value ?? 'percentage',
                          }))
                        }
                        options={rewardTypeOptions}
                        placeholder="Select reward type"
                      />
                    </div>

                    <div>
                      <div className="relative">
                        <TextInput
                          label="Commission percent"
                          value={commissionRate.commissionPercent}
                          onChange={e =>
                            setCommissionRate(prev => ({
                              ...prev,
                              commissionPercent: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 pr-8 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          step="0.1"
                        />
                        <span className="absolute right-3 top-2 text-tertiary">
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        setCommissionRate(prev => ({
                          ...prev,
                          limitRecurring: !prev.limitRecurring,
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        commissionRate.limitRecurring
                          ? 'bg-gray-800'
                          : 'bg-disabled'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-primary transition-transform ${
                          commissionRate.limitRecurring
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <label className="text-sm font-medium text-gray-700">
                      Limit number of recurring commissions
                    </label>
                  </div>

                  {commissionRate.limitRecurring && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of commissions
                        </label>
                        <input
                          type="number"
                          value={commissionRate.limitNumber}
                          onChange={e =>
                            setCommissionRate(prev => ({
                              ...prev,
                              limitNumber: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <div className="relative">
                          <TextInput
                            label="Pending commission length"
                            value={commissionRate.pendingLength}
                            onChange={e =>
                              setCommissionRate(prev => ({
                                ...prev,
                                pendingLength: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 pr-16 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <span className="absolute right-3 top-2 text-tertiary">
                            Days
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payout method
                    </label>
                    <Select
                      aria-label="Payout method"
                      value={
                        payoutMethodOptions.find(
                          o => o.value === commissionRate.payoutMethod
                        ) ?? null
                      }
                      onValueChange={option =>
                        setCommissionRate(prev => ({
                          ...prev,
                          payoutMethod: option?.value ?? 'paypal',
                        }))
                      }
                      options={payoutMethodOptions}
                      placeholder="Select payout method"
                    />
                  </div>
                </div>

                {/* Promotional link section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      Promotional link
                    </h3>
                    <p className="text-sm text-secondary mt-1">
                      In addition to the direct purchase links available, you
                      can also include a link to a page where you would like
                      your affiliates to direct traffic.
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        setPromotionalLink(prev => ({
                          ...prev,
                          enabled: !prev.enabled,
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        promotionalLink.enabled ? 'bg-gray-800' : 'bg-disabled'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-primary transition-transform ${
                          promotionalLink.enabled
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <label className="text-sm font-medium text-gray-700">
                      Enable promotional link
                    </label>
                  </div>

                  {promotionalLink.enabled && (
                    <div className="space-y-4">
                      <div>
                        <TextInput
                          label="Page URL"
                          value={promotionalLink.pageUrl}
                          onChange={e =>
                            setPromotionalLink(prev => ({
                              ...prev,
                              pageUrl: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description (Optional)
                        </label>
                        <TextArea
                          onChange={e =>
                            setPromotionalLink(prev => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Enter description..."
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Tracking script section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      Tracking script
                    </h3>
                    <p className="text-sm text-secondary mt-1">
                      In order to properly track referrals from a promotional
                      link, copy and paste the tracking code into the{' '}
                      <code className="bg-active px-1 py-[2px] rounded text-xs">
                        &lt;head&gt;
                      </code>{' '}
                      of your website or landing page.
                    </p>
                  </div>

                  <div className="relative">
                    <div className="bg-secondary border border-hover rounded-md p-4 font-mono text-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-tertiary text-xs">
                          Tracking Code
                        </span>
                        <button
                          onClick={copyTrackingScript}
                          className="text-link hover:text-link-hover text-xs underline"
                        >
                          Copy
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap text-gray-800">
                        {trackingScript}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Paywalls section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      Paywalls
                    </h3>
                    <p className="text-sm text-secondary mt-1">
                      Choose which paywalls that are eligible for commissions.
                      Affiliates will see a unique referral URL for every
                      paywall you select.
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        setPaywalls(prev => ({
                          ...prev,
                          enableAll: !prev.enableAll,
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        paywalls.enableAll ? 'bg-gray-800' : 'bg-disabled'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-primary transition-transform ${
                          paywalls.enableAll ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <label className="text-sm font-medium text-gray-700">
                      Enable for all paywalls
                    </label>
                  </div>

                  {!paywalls.enableAll && (
                    <div className="space-y-4">
                      <div>
                        <div className="relative">
                          <TextInput
                            label="Search for paywalls"
                            value={paywalls.searchTerm}
                            onChange={e =>
                              setPaywalls(prev => ({
                                ...prev,
                                searchTerm: e.target.value,
                              }))
                            }
                            placeholder="Search paywalls..."
                            className="w-full pl-10 pr-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <svg
                            className="absolute left-3 top-[10px] w-4 h-4 text-disabled"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="border border-primary rounded-md overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-secondary">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">
                                PAYWALLS
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">
                                PRICING
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">
                                COMMISSION
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-primary divide-y divide-gray-200">
                            {paywallData.map(paywall => (
                              <tr key={paywall.id}>
                                <td className="px-4 py-3 text-sm font-medium text-primary">
                                  {paywall.name}
                                </td>
                                <td className="px-4 py-3 text-sm text-tertiary">
                                  {paywall.pricing}
                                </td>
                                <td className="px-4 py-3 text-sm text-tertiary">
                                  {paywall.commission}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Save button */}
                <div className="flex justify-end pt-6 border-t border-primary">
                  <Button variant="primary" onClick={handleSave}>
                    Save changes
                  </Button>
                </div>
              </div>
            </Collapse>
          </div>
        </div>
      </div>
    </ContentContainer>
  );
};

export default AffiliatesSettings;
