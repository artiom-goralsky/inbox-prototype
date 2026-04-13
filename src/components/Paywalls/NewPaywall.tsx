import React, { useState, useEffect, useRef } from 'react';
import { Divider } from '@circleco/compass/components/Divider';
import PaywallPreview from './PaywallPreview';
import DetailsTab from './tabs/DetailsTab';
import CheckoutTab from './tabs/CheckoutTab';
import BumpsTab from './tabs/BumpsTab';
import UpsellTab from './tabs/UpsellTab';
import ThankYouTab from './tabs/ThankYouTab';
import EmailTab from './tabs/EmailTab';
import NewSectionHeader from '../ui/new-section-header';

interface NewPaywallProps {
  onBack: () => void;
  isAIHelperOpen?: boolean;
  onCloseAIHelper?: () => void;
  onPreviewToggle?: (isOpen: boolean) => void;
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

const SkeletonBlock: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = '',
  style,
}) => (
  <div
    className={`bg-secondary rounded animate-pulse ${className}`}
    style={style}
  />
);

const PaywallSkeleton: React.FC = () => (
  <div className="h-full bg-primary flex flex-col overflow-hidden border-l border-secondary">
    {/* Header skeleton */}
    <div className="shrink-0 px-16">
      <div className="max-w-[1280px] mx-auto">
        {/* Breadcrumb row */}
        <div className="pt-10 pb-1">
          <SkeletonBlock className="h-3 w-16" />
        </div>
        {/* Title + actions row */}
        <div className="pb-5 pt-2 flex justify-between items-center">
          <SkeletonBlock className="h-9 w-52" />
          <div className="flex gap-2">
            <SkeletonBlock className="h-8 w-20" />
            <SkeletonBlock className="h-8 w-8" />
          </div>
        </div>
        {/* Tabs row */}
        <div className="pb-4 flex gap-4">
          {[56, 64, 48, 52, 96, 48].map((w, i) => (
            <SkeletonBlock key={i} className="h-5" style={{ width: w }} />
          ))}
        </div>
        <Divider orientation="horizontal" />
      </div>
    </div>

    {/* Content skeleton */}
    <div className="flex-1 overflow-hidden">
      <div className="mx-auto py-6 w-full max-w-[688px] px-6 space-y-4">
        {/* Basics card */}
        <div className="rounded-xl border border-primary p-6 space-y-4">
          <SkeletonBlock className="h-5 w-16" />
          <div className="grid grid-cols-2 gap-4">
            <SkeletonBlock className="h-10" />
            <SkeletonBlock className="h-10" />
          </div>
          <SkeletonBlock className="h-20" />
          <SkeletonBlock className="h-28" />
        </div>
        {/* Pricing card */}
        <div className="rounded-xl border border-primary p-6 space-y-3">
          <SkeletonBlock className="h-5 w-16" />
          <SkeletonBlock className="h-12" />
          <SkeletonBlock className="h-12" />
          <SkeletonBlock className="h-8 w-24" />
        </div>
        {/* Settings card */}
        <div className="rounded-xl border border-primary p-6 space-y-4">
          <SkeletonBlock className="h-5 w-20" />
          {[32, 48, 28].map((w, i) => (
            <div key={i} className="flex justify-between items-center">
              <SkeletonBlock className="h-4" style={{ width: w * 4 }} />
              <SkeletonBlock className="h-6 w-10 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

type LoadPhase = 'preload' | 'ready' | 'preunload';

const NewPaywall: React.FC<NewPaywallProps> = ({
  onBack,
  isAIHelperOpen,
  onCloseAIHelper,
  onPreviewToggle,
}) => {
  const [activeTab, setActiveTab] = useState<
    'details' | 'checkout' | 'bumps' | 'upsell' | 'thankyou' | 'email'
  >('details');
  const [showPreview, setShowPreview] = useState(false);
  const [loadPhase, setLoadPhase] = useState<LoadPhase>('preload');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Open: show skeleton for 1s then reveal content
  useEffect(() => {
    const t = setTimeout(() => setLoadPhase('ready'), 1000);
    return () => clearTimeout(t);
  }, []);

  // Back: show skeleton for 1s then unmount
  useEffect(() => {
    if (loadPhase !== 'preunload') return;
    const t = setTimeout(onBack, 1000);
    return () => clearTimeout(t);
  }, [loadPhase]);

  // Notify parent when preview state changes
  useEffect(() => {
    if (onPreviewToggle) {
      onPreviewToggle(showPreview);
    }
  }, [showPreview, onPreviewToggle]);

  // Handle mutual exclusion between AI helper and preview sidebar
  useEffect(() => {
    if (isAIHelperOpen && showPreview) {
      setShowPreview(false);
    }
  }, [isAIHelperOpen]);

  useEffect(() => {
    if (showPreview && isAIHelperOpen && onCloseAIHelper) {
      onCloseAIHelper();
    }
  }, [showPreview]);

  const handleBack = () => setLoadPhase('preunload');

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'checkout', label: 'Checkout' },
    { id: 'bumps', label: 'Bumps' },
    { id: 'upsell', label: 'Upsell' },
    { id: 'thankyou', label: 'Thank you page' },
    { id: 'email', label: 'Email' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return <DetailsTab />;
      case 'checkout':
        return <CheckoutTab />;
      case 'bumps':
        return <BumpsTab />;
      case 'upsell':
        return <UpsellTab />;
      case 'thankyou':
        return <ThankYouTab />;
      case 'email':
        return <EmailTab />;
      default:
        return <DetailsTab />;
    }
  };

  if (loadPhase !== 'ready') {
    return <PaywallSkeleton />;
  }

  return (
    <div className="h-full bg-primary flex flex-col overflow-hidden border-l border-secondary animate-fadeIn">
      {/* Header with Tabs */}
      <div className="shrink-0">
        <NewSectionHeader
          title="New paywall"
          breadcrumb="Paywalls"
          onBack={handleBack}
          primaryAction={{
            label: 'Publish',
            onClick: () => {
              // Handle publish
            },
          }}
          secondaryAction={{
            icon: 'eye-open',
            onClick: () => setShowPreview(!showPreview),
            ariaLabel: 'Toggle preview',
          }}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={tabId => {
            if (
              tabId === 'details' ||
              tabId === 'checkout' ||
              tabId === 'bumps' ||
              tabId === 'upsell' ||
              tabId === 'thankyou' ||
              tabId === 'email'
            ) {
              setActiveTab(tabId);
            }
          }}
          scrollContainerRef={scrollContainerRef}
        />
      </div>

      {/* Content Area - Flex container for content and preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div
          ref={scrollContainerRef}
          className="flex-1 flex flex-col overflow-auto scrollbar-hide"
        >
          <div className="mx-auto py-6 w-full max-w-[688px] px-6">
            {renderTabContent()}
          </div>
        </div>

        {/* Preview Sidebar */}
        <div
          className={`shrink-0 bg-secondary overflow-hidden transition-[max-width,width] rounded-lg duration-200 m-6 ${
            showPreview ? 'max-w-[600px] w-[600px] ' : 'max-w-0 w-0'
          }`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          {showPreview && (
            <div className="p-4 overflow-auto h-full">
              <PaywallPreview />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewPaywall;
