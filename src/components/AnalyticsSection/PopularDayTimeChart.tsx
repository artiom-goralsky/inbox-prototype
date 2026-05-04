import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';

/* ── Types ─────────────────────────────────────────────────────────────── */
export interface PopularDayTimeChartProps {
  title?: string;
  period?: string;
  /** 12 rows × 7 cols — [timeSlot][day] */
  data?: number[][];
}

/* ── Constants ─────────────────────────────────────────────────────────── */
const TIME_LABELS = [
  '12-01 AM', '02-03 AM', '04-05 AM', '06-07 AM',
  '08-09 AM', '10-11 AM', '12-01 PM', '02-03 PM',
  '04-05 PM', '06-07 PM', '08-09 PM', '10-11 PM',
];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Blue intensity scale — index 0 = lowest, 7 = highest
const INTENSITY_COLORS = [
  '#eff6ff', // blue/50
  '#dbeafe', // blue/100
  '#bfdbfe', // blue/200
  '#93c5fd', // blue/300
  '#60a5fa', // blue/400
  '#3b82f6', // blue/500
  '#2563eb', // blue/600
  '#1d4ed8', // blue/700
];

// Text is white/inverse on dark cells (intensity index >= 5)
const DARK_THRESHOLD = 5;

/* ── Default mock data (12 rows × 7 cols) ──────────────────────────────── */
const DEFAULT_DATA: number[][] = [
  [  42,  38,  51,  44,  39,  61,  55 ], // 12-01 AM
  [  18,  12,  22,  15,  11,  28,  24 ], // 02-03 AM
  [   8,   6,   9,   7,   5,  14,  11 ], // 04-05 AM
  [  31,  27,  35,  29,  24,  19,  16 ], // 06-07 AM
  [ 186, 214, 198, 231, 209, 112,  84 ], // 08-09 AM
  [ 312, 387, 341, 402, 368, 187, 143 ], // 10-11 AM
  [ 267, 334, 298, 356, 316, 247, 221 ], // 12-01 PM
  [ 298, 371, 327, 389, 348, 273, 248 ], // 02-03 PM
  [ 516, 489, 543, 512, 497, 384, 361 ], // 04-05 PM
  [ 423, 401, 456, 438, 419, 398, 372 ], // 06-07 PM
  [ 287, 264, 312, 295, 278, 341, 318 ], // 08-09 PM
  [ 142, 118, 159, 137, 124, 218, 197 ], // 10-11 PM
];

/* ── Helpers ───────────────────────────────────────────────────────────── */
function getIntensityIndex(value: number, min: number, max: number): number {
  if (max === min) return 0;
  const ratio = (value - min) / (max - min);
  return Math.min(7, Math.floor(ratio * 8));
}

/* ── Component ─────────────────────────────────────────────────────────── */
const PopularDayTimeChart: React.FC<PopularDayTimeChartProps> = ({
  title = 'Popular day & time',
  period = '90d',
  data = DEFAULT_DATA,
}) => {
  const allValues = data.flat();
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);

  return (
    <div className="bg-primary border border-primary rounded-xl p-6 flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center gap-2 shrink-0">
        <Typography variant="label-md" color="primary">
          {title}
        </Typography>
        <span className="text-caption text-secondary pt-0.5">{period}</span>
      </div>

      {/* Grid */}
      <div className="flex flex-col w-full overflow-x-auto">
        {/* Data rows */}
        {data.map((row, rowIdx) => (
          <div key={rowIdx} className="flex items-stretch">
            {/* Time label */}
            <div
              className="flex items-center justify-start shrink-0 pr-3 text-caption text-tertiary tabular-nums"
              style={{ width: 120, minHeight: 40 }}
            >
              {TIME_LABELS[rowIdx]}
            </div>

            {/* Day cells */}
            {row.map((value, colIdx) => {
              const intensityIdx = getIntensityIndex(value, min, max);
              const bg = INTENSITY_COLORS[intensityIdx];
              const isDark = intensityIdx >= DARK_THRESHOLD;
              const textColor = isDark ? '#f7f9fa' : '#1a1f2e';

              return (
                <div
                  key={colIdx}
                  className="flex-1 flex items-center justify-center border border-white"
                  style={{
                    background: bg,
                    minHeight: 40,
                    minWidth: 48,
                  }}
                >
                  <span
                    className="text-label-xs font-medium tabular-nums"
                    style={{ fontSize: 11, color: textColor }}
                  >
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        ))}

        {/* Footer row — day labels */}
        <div className="flex items-stretch mt-1">
          <div
            className="shrink-0 flex items-start justify-start pr-3 text-label-xs text-tertiary font-medium"
            style={{ width: 72 }}
          >
            TIME
          </div>
          {DAY_LABELS.map(day => (
            <div
              key={day}
              className="flex-1 flex items-center justify-center"
              style={{ minWidth: 48 }}
            >
              <span className="text-label-xs text-secondary font-medium">{day}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default PopularDayTimeChart;
