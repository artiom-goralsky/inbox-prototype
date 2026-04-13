import React from 'react';
import { TextArea } from '@circleco/compass/components/TextArea';
import { TextInput } from '@circleco/compass/components/TextInput';
import { Select } from '@circleco/compass/components/Select';

const DetailsTab: React.FC = () => {
  return (
    <div className="bg-primary flex flex-col gap-6 items-start overflow-clip p-6 rounded-xl shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_3px_12px_-4px_rgba(0,0,0,0.1),0px_4px_16px_-8px_rgba(0,0,0,0.1)] w-full">
      {/* Basics Section */}
      <div className="flex flex-col gap-6 items-start w-full">
        <h3 className="text-base font-semibold text-primary leading-6 tracking-[-0.3px]">
          Basics
        </h3>

        {/* Title and Currency Row */}
        <div className="flex gap-5 items-start w-full">
          {/* Title Input */}
          <div className="flex flex-col gap-2 items-start w-[373px]">
            <TextInput label="Title" placeholder="Priority messaging access" />
          </div>

          {/* Currency Select */}
          <div className="flex flex-1 flex-col gap-2 items-start min-h-0 min-w-0">
            <label className="text-sm font-medium text-primary leading-5">
              Currency
            </label>
            <Select
              aria-label="Currency"
              options={[
                { label: 'USD', value: 'USD' },
                { label: 'EUR', value: 'EUR' },
                { label: 'GBP', value: 'GBP' },
              ]}
              placeholder="Select currency"
            />
          </div>
        </div>

        {/* Description Textarea */}
        <div className="flex flex-col gap-2 items-start w-full">
          <label className="text-sm font-medium text-primary leading-5">
            Description
          </label>
          <TextArea placeholder="E.g., Become a member to access community and bonus content." />
        </div>
      </div>

      {/* Images Section */}
      <div className="flex flex-col gap-2 items-start w-full">
        <div className="flex gap-[5px] items-center">
          <label className="text-sm font-medium text-primary leading-5">
            Images
          </label>
          <button className="p-0 w-4 h-4 shrink-0">
            <svg
              className="w-4 h-4 text-tertiary"
              fill="none"
              viewBox="0 0 16 16"
            >
              <circle
                cx="8"
                cy="8"
                r="7"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M8 5.5V8M8 10.5h.01"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex gap-4 items-start w-full">
          {/* Upload Area */}
          <div className="bg-primary border border-[#d2d7db] border-dashed flex flex-1 flex-col items-center justify-center min-h-0 min-w-0 overflow-clip px-[52px] py-6 rounded-md">
            <div className="flex flex-col gap-3 items-center">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <div className="flex flex-col gap-1 items-center">
                <p className="text-sm font-medium text-primary leading-5">
                  Add up to 5 images
                </p>
                <p className="text-xs font-normal text-secondary leading-[18px] tracking-[0.2px]">
                  540 x 303 (16:9) recommended, up to 10MB each
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Image Preview */}
        <div className="flex gap-4 items-center w-full">
          <div className="h-[50px] overflow-clip relative rounded-lg shrink-0 w-[89px]">
            <div className="absolute bg-[#d9d9d9] left-0 rounded-md size-[50px] top-0" />
            <img
              src="/images/placeholders/image-1.png"
              alt="Thumbnail"
              className="absolute h-[50px] left-1/2 overflow-clip rounded-[2.358px] top-0 -translate-x-1/2 w-[88.889px] object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col gap-[2px] items-start min-h-0 min-w-0">
            <div className="flex gap-2 items-center justify-center">
              <p className="text-sm font-medium text-primary leading-5 whitespace-nowrap">
                priority-messaging.png
              </p>
              <div className="bg-secondary flex items-start px-1.5 py-0.5 rounded-md">
                <p className="text-xs font-normal text-primary leading-[18px] tracking-[0.2px] whitespace-nowrap">
                  Thumbnail
                </p>
              </div>
            </div>
            <p className="text-xs font-normal text-secondary text-right leading-[18px] tracking-[0.2px] whitespace-nowrap">
              2.54 MB
            </p>
          </div>
          <button className="relative shrink-0 size-5">
            <svg
              className="w-5 h-5 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          <button className="bg-[#2b2e33] cursor-pointer flex items-center overflow-clip p-[2.75px] relative rounded-full shrink-0">
            <div className="rounded-[10px] shrink-0 size-[14.5px] bg-primary" />
          </button>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="flex flex-col gap-6 items-start w-full">
        <h3 className="text-base font-semibold text-primary leading-6 tracking-[-0.3px]">
          Pricing
        </h3>
        <div className="flex flex-col gap-6 items-start w-full">
          <p className="text-sm text-primary leading-5">2 prices</p>

          {/* Pricing List */}
          <div className="flex flex-col gap-2 items-start w-full">
            {/* Annual Subscription */}
            <div className="flex gap-2 items-center px-2 py-3 w-full">
              <button className="p-1 w-8 h-8 shrink-0">
                <svg
                  className="w-4 h-4 text-tertiary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>
              <div className="flex flex-1 gap-2 items-center min-h-0 min-w-0">
                <div className="flex flex-1 gap-2 items-center min-h-0 min-w-0">
                  <p className="text-sm font-medium text-primary leading-5 whitespace-nowrap">
                    Annual subscription
                  </p>
                  <div className="bg-secondary flex items-start px-1.5 py-0.5 rounded-md">
                    <p className="text-xs font-normal text-primary leading-[18px] tracking-[0.2px] whitespace-nowrap">
                      Default
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium text-primary leading-5 whitespace-nowrap">
                  $100 annually
                </p>
              </div>
            </div>

            {/* Monthly Payments */}
            <div className="flex gap-2 items-center px-2 py-3 w-full">
              <button className="p-1 w-8 h-8 shrink-0">
                <svg
                  className="w-4 h-4 text-tertiary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>
              <div className="flex flex-1 gap-2 items-center min-h-0 min-w-0">
                <p className="text-sm font-medium text-primary leading-5 whitespace-nowrap">
                  Monthly payments
                </p>
                <p className="text-sm text-secondary leading-5 whitespace-nowrap ml-auto">
                  $297 USD + 90 days trial + $19 USD monthly
                </p>
              </div>
            </div>
          </div>

          <button className="flex gap-2 items-center justify-center px-4 py-2 text-sm font-medium text-primary bg-primary border border-primary rounded-md hover:bg-secondary transition-colors">
            <svg
              className="w-4 h-4"
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
            <span>Add price</span>
          </button>
        </div>
      </div>

      {/* Settings Section */}
      <div className="flex flex-col gap-6 items-start w-full">
        <h3 className="text-base font-semibold text-primary leading-6 tracking-[-0.3px]">
          Settings
        </h3>
        <div className="flex flex-col gap-5 items-start w-full">
          {/* Repurchasing paywall */}
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium text-primary leading-5">
                Repurchasing paywall
              </span>
              <button className="p-1 w-4 h-4">
                <svg
                  className="w-4 h-4 text-tertiary"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 5.5V8M8 10.5h.01"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <button className="bg-secondary cursor-pointer flex items-center overflow-clip p-[2.75px] relative rounded-full shrink-0 w-[30px] h-5">
              <div className="rounded-[10px] shrink-0 size-[14.5px] bg-primary" />
            </button>
          </div>

          {/* Upgradable subscription group */}
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium text-primary leading-5">
                Upgradable subscription group
              </span>
              <button className="p-1 w-4 h-4">
                <svg
                  className="w-4 h-4 text-tertiary"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 5.5V8M8 10.5h.01"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <button className="bg-[#2b2e33] cursor-pointer flex items-center overflow-clip p-[2.75px] relative rounded-full shrink-0 w-[30px] h-5">
              <div className="rounded-[10px] shrink-0 size-[14.5px] bg-primary" />
            </button>
          </div>

          {/* Subscription trial */}
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium text-primary leading-5">
                Subscription trial
              </span>
              <button className="p-1 w-4 h-4">
                <svg
                  className="w-4 h-4 text-tertiary"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 5.5V8M8 10.5h.01"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <button className="bg-[#2b2e33] cursor-pointer flex items-center overflow-clip p-[2.75px] relative rounded-full shrink-0 w-[30px] h-5">
              <div className="rounded-[10px] shrink-0 size-[14.5px] bg-primary" />
            </button>
          </div>

          {/* Cancel subscriptions */}
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium text-primary leading-5">
                Cancel subscriptions
              </span>
              <button className="p-1 w-4 h-4">
                <svg
                  className="w-4 h-4 text-tertiary"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 5.5V8M8 10.5h.01"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <button className="bg-[#2b2e33] cursor-pointer flex items-center overflow-clip p-[2.75px] relative rounded-full shrink-0 w-[30px] h-5">
              <div className="rounded-[10px] shrink-0 size-[14.5px] bg-primary" />
            </button>
          </div>
        </div>
      </div>

      {/* Access Section */}
      <div className="flex flex-col gap-6 items-start w-full">
        <div className="flex flex-col gap-2 items-start w-full">
          <h3 className="text-base font-semibold text-primary leading-6 tracking-[-0.3px]">
            Access
          </h3>
          <p className="text-sm text-secondary leading-5">
            Choose which access group members will join when they purchase this
            offer.
          </p>
        </div>

        <div className="relative w-full">
          <Select
            aria-label="Access group"
            options={[{ label: 'Select access group', value: '' }]}
            placeholder="Select access group"
          />
        </div>

        {/* Access Groups */}
        <div className="flex flex-col gap-2 items-start w-full">
          <div className="flex items-center justify-between p-3 border border-primary rounded-lg w-full">
            <div>
              <p className="text-sm font-medium text-primary leading-5">
                Cohort A
              </p>
              <p className="text-xs text-secondary leading-[18px] tracking-[0.2px]">
                0 paying members • 7 spaces
              </p>
            </div>
            <button className="p-1 w-5 h-5">
              <svg
                className="w-5 h-5 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-between p-3 border border-primary rounded-lg w-full">
            <div>
              <p className="text-sm font-medium text-primary leading-5">
                Onboarding
              </p>
              <p className="text-xs text-secondary leading-[18px] tracking-[0.2px]">
                639 paying members • 18 spaces
              </p>
            </div>
            <button className="p-1 w-5 h-5">
              <svg
                className="w-5 h-5 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-between p-3 border border-primary rounded-lg w-full">
            <div>
              <p className="text-sm font-medium text-primary leading-5">
                Cohort C
              </p>
              <p className="text-xs text-secondary leading-[18px] tracking-[0.2px]">
                2,817 paying members • 6 spaces
              </p>
            </div>
            <button className="p-1 w-5 h-5">
              <svg
                className="w-5 h-5 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Section */}
      <div className="flex items-center justify-between p-4 bg-secondary rounded-lg w-full">
        <h3 className="text-base font-semibold text-primary leading-6 tracking-[-0.3px]">
          Advanced
        </h3>
        <button className="p-2 text-secondary hover:bg-disabled rounded-md transition-colors">
          <svg
            className="w-5 h-5"
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
        </button>
      </div>
    </div>
  );
};

export default DetailsTab;
