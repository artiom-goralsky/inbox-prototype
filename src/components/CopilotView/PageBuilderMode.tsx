import React, { useState } from 'react';
import { Icon, type IconName } from '@circleco/compass/components/Icon';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Button } from '@circleco/compass/components/Button';
import { Typography } from '@circleco/compass/components/Typography';
import { Tabs } from '@circleco/compass/components/Tabs';
import { TextInput } from '@circleco/compass/components/TextInput';
import { LandingPagePreview } from './LandingPageArtifact';

/* ── Left nav items ─────────────────────────────────────────────────── */
const LEFT_NAV: { icon: IconName; label: string }[] = [
  { icon: 'section', label: 'Sections' },
  { icon: 'circle-plus', label: 'Add' },
  { icon: 'layers', label: 'Layers' },
  { icon: 'color-swatch', label: 'Styles' },
  { icon: 'page', label: 'Pages' },
  { icon: 'settings-gear', label: 'Settings' },
];

/* ── Segmented control ──────────────────────────────────────────────── */
const SegControl = ({ items, active = 0 }: { items: { icon: IconName }[]; active?: number }) => (
  <div className="flex items-center gap-1 p-1 rounded-2xl bg-secondary">
    {items.map((item, i) => (
      <div
        key={i}
        className={`flex items-center justify-center w-7 h-7 rounded-xl transition-colors duration-[50ms] ${
          i === active
            ? 'bg-primary shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-secondary'
            : ''
        }`}
      >
        <Icon name={item.icon} size="sm" className={i === active ? 'text-primary' : 'text-tertiary'} />
      </div>
    ))}
  </div>
);

/* ── Main builder component ─────────────────────────────────────────── */
interface PageBuilderModeProps {
  onClose: () => void;
}

const PageBuilderMode: React.FC<PageBuilderModeProps> = ({ onClose }) => {
  const [activeNav, setActiveNav] = useState(0);
  const [selectedSection, setSelectedSection] = useState<string | null>('hero');
  const [activeRailTab, setActiveRailTab] = useState<'editor' | 'copilot'>('editor');

  return (
    <div className="h-full flex flex-col bg-primary">
      {/* ── Header ── */}
      <div className="shrink-0 h-14 flex items-center justify-between px-4 py-1 bg-primary">
        {/* Left */}
        <div className="flex items-center gap-[18px]">
          <IconButton
            variant="outline"
            size="sm"
            icon="arrow-left"
            aria-label="Back"
            onClick={onClose}
          />
          <div className="flex items-center gap-2">
            <Typography variant="label-sm" color="primary" className="font-semibold">
              Page title
            </Typography>
            <button
              type="button"
              className="flex items-center justify-center p-1 rounded-full hover:bg-hover transition-colors duration-[50ms]"
            >
              <Icon name="chevron-down" size="sm" className="text-secondary" />
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <IconButton variant="ghost" size="sm" icon="clock-dash" aria-label="History" />
            <IconButton variant="ghost" size="sm" icon="circle-check" aria-label="Status" />
            <IconButton variant="ghost" size="sm" icon="arrow-undo" aria-label="Undo" />
            <IconButton variant="ghost" size="sm" icon="arrow-redo" aria-label="Redo" />
            <IconButton variant="ghost" size="sm" icon="eye-open" aria-label="Preview" />
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm">Save</Button>
            <Button type="button" variant="primary" size="sm">Publish</Button>
          </div>
        </div>
      </div>

      {/* ── Builder body (padded container) ── */}
      <div className="flex-1 min-h-0 px-4 pb-4">
        <div className="h-full flex rounded-lg overflow-hidden bg-secondary shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_3px_12px_-4px_rgba(0,0,0,0.1),0px_4px_16px_-8px_rgba(0,0,0,0.1)]">

          {/* Left nav rail — 56px */}
          <div className="shrink-0 w-14 bg-primary border-r border-secondary flex flex-col items-center py-4 gap-4">
            {LEFT_NAV.map((item, i) => (
              <button
                key={item.label}
                type="button"
                className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-[50ms] ${
                  activeNav === i ? 'bg-secondary' : 'hover:bg-hover'
                }`}
                onClick={() => setActiveNav(i)}
                aria-label={item.label}
              >
                <Icon
                  name={item.icon}
                  size="lg"
                  className={activeNav === i ? 'text-primary' : 'text-secondary'}
                />
              </button>
            ))}
          </div>

          {/* Canvas */}
          <div className="flex-1 min-w-0 relative">
            {/* Scroll container */}
            <div
              className="absolute inset-0 overflow-auto bg-secondary p-6 pb-20"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            >
              {/* Page frame */}
              <div className="w-full border border-secondary bg-primary shadow-[0px_0px_5px_0px_rgba(0,0,0,0.07)] overflow-hidden">
                <LandingPagePreview
                  selectedSection={selectedSection}
                  onSelectSection={setSelectedSection}
                />
              </div>
            </div>

            {/* Floating toolbar */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
              <div className="pointer-events-auto inline-flex items-center gap-2 p-1 rounded-3xl bg-secondary border border-secondary shadow-sm">
                {/* Viewport */}
                <SegControl
                  items={[
                    { icon: 'studio-display' },
                    { icon: 'tablet' },
                    { icon: 'phone' },
                  ]}
                  active={0}
                />
                <div className="w-px h-8 bg-tertiary/20 shrink-0" />
                {/* Theme */}
                <SegControl
                  items={[{ icon: 'sun' }, { icon: 'moon' }]}
                  active={0}
                />
                <div className="w-px h-8 bg-tertiary/20 shrink-0" />
                {/* Lock */}
                <SegControl
                  items={[{ icon: 'lock' }, { icon: 'lock' }]}
                  active={0}
                />
                <div className="w-px h-8 bg-tertiary/20 shrink-0" />
                {/* Zoom */}
                <div className="flex items-center">
                  <IconButton variant="ghost" size="sm" icon="minus" aria-label="Zoom out" />
                  <span className="w-12 text-center text-xs font-medium text-secondary tabular-nums">
                    100%
                  </span>
                  <IconButton variant="ghost" size="sm" icon="plus" aria-label="Zoom in" />
                </div>
              </div>
            </div>
          </div>

          {/* Right panel — 308px */}
          <div className="shrink-0 w-[308px] bg-primary border-l border-secondary flex flex-col overflow-hidden">
            {/* Tab bar */}
            <div className="shrink-0 border-b border-secondary px-4 py-3">
              <Tabs.Root
                tabs={[
                  { label: 'Editor', value: 'editor' },
                  { label: 'Copilot', value: 'copilot' },
                ]}
                selectedValue={activeRailTab}
                onValueChange={(v) => setActiveRailTab(v as 'editor' | 'copilot')}
              >
                <></>
              </Tabs.Root>
            </div>

            {/* Panel content */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              {activeRailTab === 'editor' && (
                <>
                  {/* Page section header */}
                  <div className="flex items-center h-12 pl-4 pr-2 border-b border-secondary">
                    <Typography variant="label-sm" color="primary" className="font-semibold flex-1">
                      Page
                    </Typography>
                  </div>

                  {/* Spacing section */}
                  <div className="border-b border-secondary pb-3">
                    <div className="flex items-center justify-between h-12 pl-4 pr-2">
                      <Typography variant="label-sm" color="primary">Spacing</Typography>
                      <IconButton variant="ghost" size="sm" icon="chevron-top" aria-label="Collapse" />
                    </div>
                    {/* Padding row */}
                    <div className="flex items-center px-4 gap-2">
                      <span className="shrink-0 w-20 text-xs font-medium text-secondary">Padding</span>
                      <div className="flex-1 flex items-center gap-2 min-w-0">
                        <TextInput defaultValue="0" className="flex-1" />
                        <SegControl
                          items={[{ icon: 'aspect-ratio-11' }, { icon: 'edges' }]}
                          active={0}
                        />
                      </div>
                    </div>
                    {/* Margin row */}
                    <div className="flex items-center px-4 gap-2 mt-3">
                      <span className="shrink-0 w-20 text-xs font-medium text-secondary">Margin</span>
                      <div className="flex-1 flex items-center gap-2 min-w-0">
                        <TextInput defaultValue="0" className="flex-1" />
                        <SegControl
                          items={[{ icon: 'aspect-ratio-11' }, { icon: 'edges' }]}
                          active={0}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Background section */}
                  <div className="border-b border-secondary pb-3">
                    <div className="flex items-center justify-between h-12 pl-4 pr-2">
                      <Typography variant="label-sm" color="primary">Background</Typography>
                      <IconButton variant="ghost" size="sm" icon="chevron-top" aria-label="Collapse" />
                    </div>
                    <div className="flex items-center px-4">
                      <span className="shrink-0 w-20 text-xs font-medium text-secondary">Color</span>
                      <button
                        type="button"
                        className="flex-1 flex items-center gap-2 px-1 py-1 rounded-xl bg-secondary hover:bg-hover transition-colors duration-[50ms]"
                      >
                        <div
                          className="w-7 h-7 rounded-lg border border-secondary shrink-0"
                          style={{ backgroundColor: '#111111' }}
                        />
                        <span className="text-sm font-mono text-primary">#111111</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeRailTab === 'copilot' && (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Icon name="cursor-ai" size="lg" className="text-tertiary mb-3" />
                  <Typography variant="body-sm" color="tertiary">
                    Ask Copilot to help you design and edit your page.
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageBuilderMode;
