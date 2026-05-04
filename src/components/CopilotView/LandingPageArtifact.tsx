import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Icon, type IconName } from '@circleco/compass/components/Icon';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Button } from '@circleco/compass/components/Button';
import { Panel, useViewport, type NodeProps } from '@xyflow/react';
import { ArtifactCanvas, useCanvasZoom } from '../shared/ArtifactCanvas';

/* ── Section data ──────────────────────────────────────────────────── */
interface LandingSection {
  id: string;
  type: 'hero' | 'features' | 'testimonial' | 'cta' | 'faq';
  label: string;
}

const LANDING_SECTIONS: LandingSection[] = [
  { id: 'hero', type: 'hero', label: 'Hero' },
  { id: 'features', type: 'features', label: 'Features' },
  { id: 'testimonial', type: 'testimonial', label: 'Testimonials' },
  { id: 'cta', type: 'cta', label: 'Call to Action' },
  { id: 'faq', type: 'faq', label: 'FAQ' },
];

/* ── Builder left rail ─────────────────────────────────────────────── */
const LEFT_NAV: { icon: IconName; label: string }[] = [
  { icon: 'section', label: 'Sections' },
  { icon: 'circle-plus', label: 'Add' },
  { icon: 'layers', label: 'Layers' },
  { icon: 'color-swatch', label: 'Styles' },
  { icon: 'page', label: 'Pages' },
  { icon: 'settings-gear', label: 'Settings' },
];

const BuilderLeftRail: React.FC<{ activeNav: number; onNavChange: (i: number) => void }> = ({
  activeNav,
  onNavChange,
}) => (
  <div className="shrink-0 w-12 bg-primary border-r border-secondary flex flex-col items-center py-3 gap-1">
    {LEFT_NAV.map((item, i) => (
      <button
        key={item.label}
        type="button"
        title={item.label}
        className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-[50ms] ${
          activeNav === i ? 'bg-secondary' : 'hover:bg-hover'
        }`}
        onClick={() => onNavChange(i)}
        aria-label={item.label}
      >
        <Icon
          name={item.icon}
          size="md"
          className={activeNav === i ? 'text-primary' : 'text-secondary'}
        />
      </button>
    ))}
  </div>
);

/* ── Builder right panel (layers) ──────────────────────────────────── */
const BuilderRightPanel: React.FC<{
  selectedSection: string | null;
  onSelectSection: (id: string) => void;
}> = ({ selectedSection, onSelectSection }) => (
  <div className="shrink-0 w-[220px] bg-primary border-l border-secondary flex flex-col overflow-hidden">
    {/* Panel header */}
    <div className="shrink-0 flex items-center justify-between h-10 px-3 border-b border-secondary">
      <Typography variant="label-sm" color="primary">
        Layers
      </Typography>
    </div>

    {/* Section list */}
    <div className="flex-1 overflow-y-auto py-1">
      {LANDING_SECTIONS.map(section => (
        <button
          key={section.id}
          type="button"
          className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors duration-[50ms] ${
            selectedSection === section.id
              ? 'bg-accent-primary/8 text-accent-primary'
              : 'hover:bg-hover text-secondary'
          }`}
          onClick={() => onSelectSection(section.id)}
        >
          <Icon name="section" size="sm" className="shrink-0" />
          <Typography variant="label-sm" color="current" className="truncate">
            {section.label}
          </Typography>
        </button>
      ))}
    </div>
  </div>
);

/* ── Landing page preview ──────────────────────────────────────────── */
const LandingPagePreview: React.FC<{ selectedSection: string | null; onSelectSection: (id: string) => void }> = ({ selectedSection, onSelectSection }) => (
  <div className="flex flex-col gap-0 bg-primary min-h-full">
    {/* Hero */}
    <div
      className={`relative px-10 py-16 cursor-pointer transition-[box-shadow] duration-200 ${selectedSection === 'hero' ? 'ring-2 ring-accent-primary ring-inset' : 'hover:ring-1 hover:ring-accent-primary/40 hover:ring-inset'}`}
      onClick={() => onSelectSection('hero')}
      style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}
    >
      <div className="max-w-lg">
        <div className="text-white/60 text-sm font-medium tracking-wide uppercase mb-3">Welcome to</div>
        <h1 className="text-3xl font-bold text-white leading-tight mb-4">Clarity Community</h1>
        <p className="text-white/70 text-base leading-relaxed mb-6">
          Join thousands of creators, entrepreneurs, and leaders building thriving communities together.
        </p>
        <div className="flex gap-3">
          <div className="bg-white text-slate-900 px-5 py-2.5 rounded-lg text-sm font-semibold">
            Join Now
          </div>
          <div className="border border-white/30 text-white px-5 py-2.5 rounded-lg text-sm font-medium">
            Learn More
          </div>
        </div>
      </div>
    </div>

    {/* Features */}
    <div
      className={`px-10 py-12 bg-primary cursor-pointer transition-[box-shadow] duration-200 ${selectedSection === 'features' ? 'ring-2 ring-accent-primary ring-inset' : 'hover:ring-1 hover:ring-accent-primary/40 hover:ring-inset'}`}
      onClick={() => onSelectSection('features')}
    >
      <h2 className="text-xl font-semibold text-primary mb-2 text-center">Everything you need</h2>
      <p className="text-sm text-tertiary text-center mb-8">Built for modern community builders</p>
      <div className="grid grid-cols-3 gap-6">
        {[
          { title: 'Spaces', desc: 'Organize discussions by topic' },
          { title: 'Events', desc: 'Host live sessions and workshops' },
          { title: 'Courses', desc: 'Create structured learning paths' },
        ].map(f => (
          <div key={f.title} className="flex flex-col gap-2 p-4 rounded-xl border border-secondary">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <div className="w-3 h-3 rounded-sm bg-tertiary/40" />
            </div>
            <div className="text-sm font-medium text-primary">{f.title}</div>
            <div className="text-xs text-tertiary">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Testimonial */}
    <div
      className={`px-10 py-12 bg-secondary cursor-pointer transition-[box-shadow] duration-200 ${selectedSection === 'testimonial' ? 'ring-2 ring-accent-primary ring-inset' : 'hover:ring-1 hover:ring-accent-primary/40 hover:ring-inset'}`}
      onClick={() => onSelectSection('testimonial')}
    >
      <div className="max-w-md mx-auto text-center">
        <div className="text-lg text-primary italic leading-relaxed mb-4">
          &ldquo;This platform completely transformed how I engage with my audience. The tools are intuitive and the community is incredibly supportive.&rdquo;
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full bg-tertiary/20" />
          <div className="text-left">
            <div className="text-sm font-medium text-primary">Sarah Johnson</div>
            <div className="text-xs text-tertiary">Community Leader</div>
          </div>
        </div>
      </div>
    </div>

    {/* CTA */}
    <div
      className={`px-10 py-12 bg-primary cursor-pointer transition-[box-shadow] duration-200 ${selectedSection === 'cta' ? 'ring-2 ring-accent-primary ring-inset' : 'hover:ring-1 hover:ring-accent-primary/40 hover:ring-inset'}`}
      onClick={() => onSelectSection('cta')}
    >
      <div className="text-center">
        <h2 className="text-xl font-semibold text-primary mb-2">Ready to get started?</h2>
        <p className="text-sm text-tertiary mb-6">Join our community today and start building something meaningful.</p>
        <div className="inline-flex bg-inverse text-white px-6 py-2.5 rounded-lg text-sm font-semibold">
          Get Started Free
        </div>
      </div>
    </div>

    {/* FAQ */}
    <div
      className={`px-10 py-12 bg-primary border-t border-secondary cursor-pointer transition-[box-shadow] duration-200 ${selectedSection === 'faq' ? 'ring-2 ring-accent-primary ring-inset' : 'hover:ring-1 hover:ring-accent-primary/40 hover:ring-inset'}`}
      onClick={() => onSelectSection('faq')}
    >
      <h2 className="text-xl font-semibold text-primary mb-6 text-center">Frequently asked questions</h2>
      <div className="max-w-md mx-auto flex flex-col gap-3">
        {['How do I get started?', 'What does the free plan include?', 'Can I migrate from another platform?'].map(q => (
          <div key={q} className="flex items-center justify-between px-4 py-3 rounded-lg border border-secondary">
            <span className="text-sm text-primary">{q}</span>
            <Icon name="chevron-down" size="sm" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ── Generating skeleton ────────────────────────────────────────────── */
const GeneratingSkeleton: React.FC = () => (
  <div className="flex flex-col">
    {/* Hero skeleton */}
    <div className="px-10 py-16" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
      <div className="shimmer-text w-28 h-2.5 bg-white/25 rounded mb-5" />
      <div className="shimmer-text w-64 h-8 bg-white/25 rounded mb-3" style={{ animationDelay: '0.15s' }} />
      <div className="shimmer-text w-80 h-3.5 bg-white/15 rounded mb-2" style={{ animationDelay: '0.3s' }} />
      <div className="shimmer-text w-72 h-3.5 bg-white/15 rounded mb-7" style={{ animationDelay: '0.45s' }} />
      <div className="flex gap-3">
        <div className="shimmer-text w-24 h-10 bg-white/25 rounded-lg" style={{ animationDelay: '0.6s' }} />
        <div className="shimmer-text w-28 h-10 bg-white/10 rounded-lg" style={{ animationDelay: '0.75s' }} />
      </div>
    </div>
    {/* Features skeleton */}
    <div className="px-10 py-12 bg-primary">
      <div className="shimmer-text w-44 h-5 bg-secondary rounded mx-auto mb-2" />
      <div className="shimmer-text w-56 h-3 bg-secondary rounded mx-auto mb-8" style={{ animationDelay: '0.2s' }} />
      <div className="grid grid-cols-3 gap-6">
        {[0, 1, 2].map(i => (
          <div key={i} className="shimmer-text h-28 bg-secondary rounded-xl" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
    {/* Testimonial skeleton */}
    <div className="px-10 py-12 bg-secondary flex flex-col items-center gap-3">
      <div className="shimmer-text w-80 h-4 bg-primary/30 rounded" />
      <div className="shimmer-text w-72 h-4 bg-primary/30 rounded" style={{ animationDelay: '0.2s' }} />
      <div className="shimmer-text w-48 h-4 bg-primary/30 rounded" style={{ animationDelay: '0.4s' }} />
      <div className="flex items-center gap-3 mt-2">
        <div className="shimmer-text w-10 h-10 rounded-full bg-primary/20" style={{ animationDelay: '0.5s' }} />
        <div className="flex flex-col gap-1.5">
          <div className="shimmer-text w-24 h-3 bg-primary/30 rounded" style={{ animationDelay: '0.55s' }} />
          <div className="shimmer-text w-20 h-2.5 bg-primary/20 rounded" style={{ animationDelay: '0.6s' }} />
        </div>
      </div>
    </div>
    {/* CTA skeleton */}
    <div className="px-10 py-12 bg-primary flex flex-col items-center gap-3">
      <div className="shimmer-text w-52 h-5 bg-secondary rounded" />
      <div className="shimmer-text w-72 h-3 bg-secondary rounded" style={{ animationDelay: '0.2s' }} />
      <div className="shimmer-text w-36 h-10 bg-secondary rounded-lg mt-2" style={{ animationDelay: '0.35s' }} />
    </div>
  </div>
);

/* ── Browser chrome ─────────────────────────────────────────────────── */
const BrowserChrome: React.FC = () => (
  <div
    className="shrink-0 flex items-center gap-3 px-4 py-2.5"
    style={{ background: '#f2f2f4', borderBottom: '1px solid #e0e0e2' }}
  >
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
      <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
      <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
    </div>
    <div
      className="flex-1 mx-4 flex items-center px-3 py-1.5 rounded-md text-xs"
      style={{ background: 'white', border: '1px solid #e0e0e2', color: '#6b7280', justifyContent: 'center' }}
    >
      clarity.community/welcome
    </div>
  </div>
);

/* ── Section nav strip ──────────────────────────────────────────────── */
const SectionNav: React.FC<{ selectedSection: string | null; onSelect: (id: string | null) => void }> = ({ selectedSection, onSelect }) => (
  <div className="shrink-0 flex items-center gap-1 px-4 py-2 border-b border-secondary bg-primary overflow-x-auto">
    {LANDING_SECTIONS.map(section => (
      <button
        key={section.id}
        type="button"
        className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors duration-[50ms] ${
          selectedSection === section.id
            ? 'bg-accent-primary/10 text-accent-primary'
            : 'text-tertiary hover:bg-hover hover:text-secondary'
        }`}
        onClick={() => onSelect(section.id === selectedSection ? null : section.id)}
      >
        {section.label}
      </button>
    ))}
  </div>
);

/* ── Custom ReactFlow node — self-contained page frame ──────────────── */
const LandingPageNode: React.FC<NodeProps> = () => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setIsGenerating(false), 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col bg-primary"
      style={{
        width: 1024,
        boxShadow: isGenerating
          ? '0 2px 12px rgba(0,0,0,0.10)'
          : '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.12)',
      }}
    >
      {isGenerating ? (
        <div className="relative">
          {/* Magic shimmer border overlay */}
          <div className="absolute inset-0 rounded-xl pointer-events-none shimmer-frame" style={{ zIndex: 10 }} />
          <BrowserChrome />
          <SectionNav selectedSection={null} onSelect={() => {}} />
          <GeneratingSkeleton />
        </div>
      ) : (
        <div className="flex flex-col animate-[fadeIn_0.4s_cubic-bezier(0.16,1,0.3,1)]">
          <BrowserChrome />
          <SectionNav selectedSection={selectedSection} onSelect={setSelectedSection} />
          <LandingPagePreview
            selectedSection={selectedSection}
            onSelectSection={setSelectedSection}
          />
        </div>
      )}
    </div>
  );
};

const LANDING_PAGE_NODE_TYPES = { landingPage: LandingPageNode };

/* ── Floating zoom panel — rendered inside ArtifactCanvas ───────────── */
const ZoomPanel: React.FC = () => {
  const { handleZoomIn, handleZoomOut } = useCanvasZoom();
  const { zoom } = useViewport();

  return (
    <Panel position="bottom-center">
      <div className="flex items-center gap-0.5 px-2 py-1.5 rounded-xl bg-primary border border-secondary shadow-md mb-4">
        {/* Hand/grab icon */}
        <button
          type="button"
          title="Pan canvas"
          className="p-1.5 rounded-lg text-tertiary hover:bg-hover hover:text-primary transition-colors duration-[50ms] cursor-grab"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 11V8a2 2 0 0 0-4 0v3" />
            <path d="M14 10V6a2 2 0 0 0-4 0v4" />
            <path d="M10 10.5V5a2 2 0 0 0-4 0v9" />
            <path d="M6 14c0 2.5 1 4 3 5.5 1.5 1 3 1.5 5 1.5 4 0 6-2 6-6v-3a2 2 0 0 0-4 0" />
          </svg>
        </button>
        <div className="w-px h-4 bg-secondary mx-1" />
        <button
          type="button"
          className="px-2 py-1 text-sm font-medium text-tertiary hover:bg-hover hover:text-primary transition-colors duration-[50ms] rounded-lg leading-none"
          onClick={handleZoomOut}
        >
          −
        </button>
        <span className="px-1 text-xs text-secondary w-12 text-center select-none tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          className="px-2 py-1 text-sm font-medium text-tertiary hover:bg-hover hover:text-primary transition-colors duration-[50ms] rounded-lg leading-none"
          onClick={handleZoomIn}
        >
          +
        </button>
      </div>
    </Panel>
  );
};

/* ── Main artifact component ───────────────────────────────────────── */
interface LandingPageArtifactProps {
  onOpenBuilder: () => void;
  onClose: () => void;
}

const LandingPageArtifact: React.FC<LandingPageArtifactProps> = ({ onOpenBuilder, onClose }) => {
  const [isGenerated, setIsGenerated] = useState(false);
  const [activeNav, setActiveNav] = useState(0);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rfInstanceRef = useRef<any>(null);

  // Mirror the 3.5s generation timer from LandingPageNode
  useEffect(() => {
    const t = setTimeout(() => setIsGenerated(true), 3500);
    return () => clearTimeout(t);
  }, []);

  // Re-center after builder panels appear (they shrink the canvas width)
  useEffect(() => {
    if (isGenerated) {
      setTimeout(() => {
        rfInstanceRef.current?.fitView({ padding: 0.12, minZoom: 0.8, maxZoom: 0.8 });
      }, 50);
    }
  }, [isGenerated]);

  const initialNodes = useMemo(() => [
    {
      id: 'page',
      type: 'landingPage',
      position: { x: 0, y: 0 },
      data: {},
      draggable: false,
      selectable: false,
    },
  ], []);

  return (
    <div className="h-full w-full flex flex-col bg-primary">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-secondary">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 min-w-0">
          <Icon name="file" size="sm" className="shrink-0" />
          <Typography variant="label-sm" color="tertiary">clarity.community</Typography>
          <Icon name="chevron-right" size="sm" className="shrink-0" />
          <Typography variant="label-sm" color="primary" className="truncate">
            Landing Page
          </Typography>
          <div className="px-1.5 py-0.5 rounded bg-secondary ml-1">
            <Typography variant="caption" color="tertiary">Draft</Typography>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isGenerated ? (
            <>
              <div className="flex items-center gap-0.5">
                <IconButton variant="ghost" size="sm" icon="clock-dash" aria-label="History" />
                <IconButton variant="ghost" size="sm" icon="arrow-undo" aria-label="Undo" />
                <IconButton variant="ghost" size="sm" icon="arrow-redo" aria-label="Redo" />
                <IconButton variant="ghost" size="sm" icon="eye-open" aria-label="Preview" />
              </div>
              <div className="w-px h-4 bg-secondary" />
              <Button type="button" variant="outline" size="sm">Save</Button>
              <Button type="button" variant="primary" size="sm" onClick={onOpenBuilder}>Publish</Button>
            </>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="sm"
              startIcon="expand"
              onClick={onOpenBuilder}
            >
              Open in Builder
            </Button>
          )}
          <IconButton
            type="button"
            variant="ghost"
            size="sm"
            icon="cross"
            aria-label="Close preview"
            onClick={onClose}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 flex">
        {/* Left rail — shown after generation */}
        {isGenerated && (
          <BuilderLeftRail activeNav={activeNav} onNavChange={setActiveNav} />
        )}

        {/* Canvas */}
        <div className="flex-1 min-w-0 min-h-0">
          <ArtifactCanvas
            nodeTypes={LANDING_PAGE_NODE_TYPES}
            initialNodes={initialNodes}
            fitView={false}
            onInit={(instance) => {
              rfInstanceRef.current = instance;
              setTimeout(() => instance.fitView({ padding: 0.12, minZoom: 0.8, maxZoom: 0.8 }), 30);
            }}
            style={{ width: '100%', height: '100%' }}
          >
            <ZoomPanel />
          </ArtifactCanvas>
        </div>

        {/* Right layers panel — shown after generation */}
        {isGenerated && (
          <BuilderRightPanel
            selectedSection={selectedSection}
            onSelectSection={setSelectedSection}
          />
        )}
      </div>
    </div>
  );
};

export default LandingPageArtifact;
export { LandingPagePreview, LANDING_SECTIONS };
