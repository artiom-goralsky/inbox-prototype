import React from 'react';
import { Button } from '@circleco/compass/components/Button';

export type EntityV3Variant = 'List' | 'Insight' | 'Table' | 'Stat';

interface EntityV3Props {
  variant?: EntityV3Variant;
  onPreview?: () => void;
  onViewDetails?: () => void;
  onViewAnalytics?: () => void;
  onSeeMore?: () => void;
}

const imgChart = 'https://www.figma.com/api/mcp/asset/c2c90f3a-1b43-48ca-b3f8-561cda2d7a0c';

const IconPeople = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
    <path d="M13.5 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="#191b1f" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconGrowth = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
    <path d="M3 14l4-4 3 3 4-5 3 2" stroke="#191b1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 17h14" stroke="#191b1f" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconServer = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
    <rect x="3" y="3" width="14" height="5" rx="1.5" stroke="#191b1f" strokeWidth="1.5"/>
    <rect x="3" y="12" width="14" height="5" rx="1.5" stroke="#191b1f" strokeWidth="1.5"/>
    <circle cx="15.5" cy="5.5" r="0.75" fill="#191b1f"/>
    <circle cx="15.5" cy="14.5" r="0.75" fill="#191b1f"/>
  </svg>
);

const TrendDown = () => (
  <div className="flex items-center gap-[3px] bg-[rgba(245,158,11,0.1)] px-1 py-0.5 rounded-md shrink-0">
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2.5 3.5l5 5M7.5 3.5h4v4" stroke="#b45309" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span className="text-xs font-medium text-[#b45309]">-0.3%</span>
  </div>
);

const IconDownload = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
    <path d="M7 2v7M4 7l3 3 3-3M2.5 11h9" stroke="#545861" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function EntityV3({ variant = 'List', onPreview, onViewDetails, onViewAnalytics, onSeeMore }: EntityV3Props) {
  return (
    <div className="bg-[#f7f9fa] rounded-[12px] p-[2px] overflow-hidden w-full border border-[#e4e7eb] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div className="bg-white rounded-[11px] overflow-hidden w-full">

        {/* ── List ── */}
        {variant === 'List' && (
          <>
            <div className="flex h-14 items-center justify-between px-4 py-3 border-b border-[#f0f3f5]">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <IconPeople />
                <span className="text-sm font-semibold text-[#191b1f]">Member</span>
              </div>
              <Button variant="outline" size="sm" onClick={onPreview}>Preview</Button>
            </div>
            <div className="px-4 py-3 flex flex-col gap-1 text-sm">
              <div className="flex gap-1 items-center">
                <span className="text-[#191b1f]">•</span>
                <span className="font-semibold text-[#191b1f]">Name:</span>
                <span className="text-[#191b1f]">Karthik G</span>
              </div>
              <div className="flex gap-1 items-center">
                <span className="text-[#191b1f]">•</span>
                <span className="font-semibold text-[#191b1f]">Email:</span>
                <a href="#" className="text-[#2563eb] underline">karthik@circle.so</a>
              </div>
              <div className="flex gap-1 items-start">
                <span className="text-[#191b1f] shrink-0">•</span>
                <span className="font-semibold text-[#191b1f] shrink-0">Access:</span>
                <span className="text-[#191b1f]">Cohort 1, Cohort 2, and Cohort 3</span>
              </div>
            </div>
          </>
        )}

        {/* ── Insight ── */}
        {variant === 'Insight' && (
          <>
            <div className="flex h-14 items-center justify-between px-4 py-3 border-b border-[#f0f3f5]">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <IconGrowth />
                <span className="text-sm font-semibold text-[#191b1f]">Insight generated</span>
              </div>
              <Button variant="outline" size="sm" onClick={onViewDetails ?? onViewAnalytics}>View details</Button>
            </div>
            <div className="px-4 py-3 flex flex-col gap-3">
              <span className="text-sm font-semibold text-[#191b1f]">New members</span>
              <div className="bg-[#f7f9fa] rounded-md px-3 py-2 flex items-center gap-2">
                <span className="font-bold text-base text-[#191b1f]">391</span>
                <TrendDown />
                <span className="text-xs text-[#545861]">259 last period</span>
              </div>
              <div className="relative w-full" style={{ height: 173 }}>
                <div className="absolute left-0 top-0 flex flex-col justify-between h-[150px] items-end w-[23px]">
                  {['400','300','200','100','0'].map(v => (
                    <span key={v} className="text-[10px] text-[#717680] leading-none">{v}</span>
                  ))}
                </div>
                <div className="absolute left-[30px] top-[5px] right-0 flex flex-col justify-between h-[139px]">
                  {[0,1,2,3].map(i => <div key={i} className="bg-[#f0f3f5] h-px w-full" />)}
                  <div className="bg-[#e4e7eb] h-px w-full" />
                </div>
                <div className="absolute left-[30px] top-[6px] right-0 h-[131px]">
                  <img src={imgChart} alt="Chart" className="w-full h-full object-cover" />
                </div>
                <div className="absolute left-[30px] bottom-0 right-0 flex justify-between">
                  {['Oct 5','Oct 6','Oct 7','Oct 8'].map(d => (
                    <span key={d} className="text-[10px] text-[#717680]">{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Table ── */}
        {variant === 'Table' && (
          <>
            <div className="flex h-14 items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <IconServer />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#191b1f]">New members</span>
                  <span className="text-xs text-[#545861]">Nov 15, 2023</span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onViewDetails}>View details</Button>
            </div>
            <div className="border-t border-[#f0f3f5]">
              <div className="grid grid-cols-2">
                <div className="px-4 py-2 bg-[#f7f9fa]"><span className="text-xs font-medium text-[#545861]">Member Name</span></div>
                <div className="px-4 py-2 bg-[#f7f9fa]"><span className="text-xs font-medium text-[#545861]">Member Since</span></div>
                {[
                  ['Zinnia Humphry','2019-03-15'],
                  ['Cyril Mortlock','2021-01-09'],
                  ['Drake Fythe','2020-06-22'],
                  ['Poppy Farquhar','2018-11-02'],
                  ['Peregrine Hayselden','2022-04-28'],
                ].map(([name, date]) => (
                  <React.Fragment key={name}>
                    <div className="px-4 h-[52px] flex items-center border-t border-[#f0f3f5] text-sm text-[#191b1f] truncate">{name}</div>
                    <div className="px-4 h-[52px] flex items-center border-t border-[#f0f3f5] text-sm text-[#191b1f]">{date}</div>
                  </React.Fragment>
                ))}
              </div>
              <div className="px-4 h-[52px] flex items-center">
                <Button variant="secondary" size="sm" onClick={onSeeMore}>See more</Button>
              </div>
            </div>
          </>
        )}

        {/* ── Stat ── */}
        {variant === 'Stat' && (
          <>
            <div className="flex h-14 items-center justify-between px-4 py-3 border-b border-[#f0f3f5]">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <IconGrowth />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#191b1f]">New members</span>
                  <span className="text-xs text-[#545861]">Nov 15, 2023</span>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 flex flex-col gap-3">
              <p className="font-bold text-[32px] leading-10 text-[#191b1f] tracking-[-0.8px]">302</p>
              <div className="bg-[#f7f9fa] rounded-md px-3 py-2 flex items-center gap-2">
                <TrendDown />
                <span className="text-xs text-[#545861]">From Jan 16 – 23, 2026</span>
              </div>
            </div>
          </>
        )}

      </div>

      {/* Footer */}
      <div className="bg-[#f7f9fa] px-3 py-3 flex items-center justify-between">
        {variant === 'List' && (
          <span className="text-xs text-[#545861]">Generated on Nov 15, 2023</span>
        )}
        {variant === 'Insight' && (
          <>
            <span className="text-xs text-[#545861]">Generated on Nov 15, 2023</span>
            <button className="flex items-center gap-1 text-xs text-[#545861] hover:text-[#191b1f] transition-colors">
              <IconDownload />
              CSV Export
            </button>
          </>
        )}
        {variant === 'Table' && (
          <>
            <span className="text-xs text-[#545861]">Showing 1–20 of 11 158</span>
            <button className="flex items-center gap-1 text-xs text-[#545861] hover:text-[#191b1f] transition-colors">
              <IconDownload />
              CSV Export
            </button>
          </>
        )}
        {variant === 'Stat' && (
          <div className="ml-auto">
            <button
              onClick={onViewAnalytics}
              className="flex items-center gap-1 text-xs text-[#545861] hover:text-[#191b1f] transition-colors"
            >
              <IconDownload />
              CSV Export
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
