import React from 'react';
import { IconButton } from '@circleco/compass/components/IconButton';

export type EntityVariant = 'List' | 'Stat' | 'Insight' | 'Data' | 'Link' | 'Image';

interface EntityVProps {
  variant?: EntityVariant;
  onPreview?: () => void;
  onViewAnalytics?: () => void;
  onOpen?: () => void;
  onSeeMore?: () => void;
}

const imgChart = 'https://www.figma.com/api/mcp/asset/89478f7d-2f2a-474d-807c-81425f8d8ae8';
const imgFlower = 'https://www.figma.com/api/mcp/asset/455df47b-075b-4efc-93ce-98f6cae874ed';

export default function EntityV({ variant = 'List', onPreview, onViewAnalytics, onOpen, onSeeMore }: EntityVProps) {
  /* ── Link: single-row, no white card, no header ── */
  if (variant === 'Link') {
    return (
      <div className="bg-[#f7f9fa] border border-[#e4e7eb] rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-[2px] w-full">
        <div className="flex items-center gap-2 px-4 py-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 text-[#545861]">
            <path d="M8.5 11.5L11.5 8.5M7 13a3.536 3.536 0 0 1 0-5l1.5-1.5a3.536 3.536 0 0 1 5 5L12 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="flex-1 text-sm font-medium text-[#191b1f]">Manage audience</span>
          <button onClick={onOpen} className="text-sm font-medium text-[#545861] hover:text-[#191b1f] transition-colors">Open</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f9fa] border border-[#e4e7eb] rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden w-full">

      {/* ── Header row ── */}
      {variant === 'List' && (
        <div className="flex h-10 items-center justify-between px-[18px]">
          <span className="text-sm font-medium text-[#191b1f]">Member</span>
          <button onClick={onPreview} className="text-sm font-medium text-[#545861] hover:text-[#191b1f] transition-colors">Preview</button>
        </div>
      )}
      {variant === 'Stat' && (
        <div className="flex h-10 items-center justify-between px-[18px]">
          <span className="text-sm font-medium text-[#191b1f]">New members</span>
          <button onClick={onViewAnalytics} className="text-sm font-medium text-[#545861] hover:text-[#191b1f] transition-colors">View in analytics</button>
        </div>
      )}
      {variant === 'Insight' && (
        <div className="flex h-10 items-center justify-between px-[18px]">
          <span className="text-sm font-medium text-[#191b1f]">New members</span>
          <button onClick={onViewAnalytics} className="text-sm font-medium text-[#545861] hover:text-[#191b1f] transition-colors">View in analytics</button>
        </div>
      )}
      {variant === 'Image' && (
        <div className="flex h-10 items-center px-[18px]">
          <span className="text-sm font-medium text-[#191b1f]">Image generated</span>
        </div>
      )}
      {variant === 'Data' && (
        <div className="flex h-10 items-center px-[18px]">
          <span className="text-sm font-medium text-[#191b1f]">Members</span>
        </div>
      )}

      {/* ── Content card (white inner) ── */}
      {variant === 'List' && (
        <div className="bg-white border border-[#f0f3f5] rounded-[12px] px-[18px] py-3 flex flex-col gap-1 text-sm">
          <div className="flex gap-1 items-center">
            <span className="font-semibold text-[#191b1f]">Name:</span>
            <span className="text-[#191b1f]">Karthik G</span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="font-semibold text-[#191b1f]">Email:</span>
            <a href="#" className="text-[#2563eb] underline">karthik@circle.so</a>
          </div>
          <div className="flex gap-1 items-start">
            <span className="font-semibold text-[#191b1f] shrink-0">Access:</span>
            <span className="text-[#191b1f]">Cohort 1, Cohort 2, and Cohort 3</span>
          </div>
        </div>
      )}

      {variant === 'Stat' && (
        <div className="bg-white border border-[#f0f3f5] rounded-[12px] px-[18px] py-3 flex flex-col gap-3">
          <p className="font-bold text-[32px] leading-10 text-[#191b1f] tracking-[-0.8px]">302</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[rgba(245,158,11,0.1)] px-1 py-0.5 rounded-md">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 3l4 4 4-4" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs font-medium text-[#b45309]">-0.3%</span>
            </div>
            <span className="text-xs text-[#545861]">From Jan 16 – 23, 2026</span>
          </div>
        </div>
      )}

      {variant === 'Insight' && (
        <div className="bg-white border border-[#f0f3f5] rounded-[12px] px-[18px] py-3 flex flex-col gap-3">
          <div className="bg-[#f7f9fa] rounded-md px-3 py-2 flex items-center gap-2">
            <span className="font-bold text-base text-[#191b1f]">391</span>
            <div className="flex items-center gap-1 bg-[rgba(245,158,11,0.1)] px-1 py-0.5 rounded-md">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 3l4 4 4-4" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs font-medium text-[#b45309]">-0.3%</span>
            </div>
            <span className="text-xs text-[#545861]">259 last period</span>
          </div>
          <div className="relative h-[131px] w-full overflow-hidden rounded-md">
            <img src={imgChart} alt="Chart" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      )}

      {variant === 'Data' && (
        <div className="bg-white border border-[#f0f3f5] rounded-[12px] overflow-hidden">
          <div className="grid grid-cols-2">
            <div className="px-4 py-2 border-b border-[#f0f3f5]">
              <span className="text-xs font-medium text-[#545861]">Member Name</span>
            </div>
            <div className="px-4 py-2 border-b border-[#f0f3f5]">
              <span className="text-xs font-medium text-[#545861]">Member Since</span>
            </div>
            {[
              ['Zinnia Humphry', '2019-03-15'],
              ['Cyril Mortlock', '2021-01-09'],
              ['Drake Fythe', '2020-06-22'],
              ['Poppy Farquhar', '2018-11-02'],
              ['Peregrine Hayselden', '2022-04-28'],
            ].map(([name, date]) => (
              <React.Fragment key={name}>
                <div className="px-4 h-[52px] flex items-center border-b border-[#f0f3f5] text-sm font-medium text-[#191b1f] truncate">{name}</div>
                <div className="px-4 h-[52px] flex items-center border-b border-[#f0f3f5] text-sm text-[#191b1f]">{date}</div>
              </React.Fragment>
            ))}
          </div>
          <div className="px-4 py-3 flex items-center gap-1 cursor-pointer" onClick={onSeeMore}>
            <span className="text-sm text-[#545861]">See more</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#545861]">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      )}

      {variant === 'Image' && (
        <div className="bg-white border border-[#f0f3f5] rounded-b-[12px] overflow-hidden">
          <div className="aspect-[300/238] relative">
            <img src={imgFlower} alt="Generated" className="w-full h-full object-cover" />
          </div>
          <div className="bg-[#f7f9fa] px-3 py-2 flex items-center justify-end gap-1 border-t border-[#f0f3f5]">
            <IconButton variant="ghost" size="sm" icon="arrow-box-down" aria-label="Download" />
            <IconButton variant="ghost" size="sm" icon="arrow-rotate" aria-label="Regenerate" />
          </div>
        </div>
      )}
    </div>
  );
}
