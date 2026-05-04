import React, { useMemo } from 'react';
import { Typography } from '@circleco/compass/components/Typography';

/* ── Types ─────────────────────────────────────────────────────────────── */
export interface LineAreaSeries {
  label: string;
  data: number[];
  color: string;
  /** Whether to render as a dashed line */
  dashed?: boolean;
  /** Whether to render an area fill under this line */
  fill?: boolean;
}

export interface LineAreaChartProps {
  title?: string;
  period?: string;
  series?: LineAreaSeries[];
  xLabels?: string[];
  yMax?: number;
  yStep?: number;
}

/* ── Default mock data ─────────────────────────────────────────────────── */
const DEFAULT_SERIES: LineAreaSeries[] = [
  {
    label: 'Oct 28 – Dec 28',
    color: '#3b82f6',
    fill: true,
    dashed: false,
    data: [6.1, 5.6, 8.9, 7.2, 9.1, 7.0, 4.8, 8.5, 8.9, 5.9, 6.1, 5.2, 10.6,
           9.0, 8.2, 8.4, 5.9, 6.1, 5.7, 6.4, 9.4, 7.8, 7.0, 6.3, 5.4, 6.5,
           8.7, 8.4, 4.9, 6.0, 9.8, 9.8, 5.7, 5.8, 10.4],
  },
  {
    label: 'Sep 28 – Oct 28',
    color: '#93c5fd',
    fill: false,
    dashed: true,
    data: [2.4, 2.1, 2.8, 3.1, 4.1, 3.4, 2.0, 3.9, 3.8, 2.2, 2.5, 1.9, 4.4,
           3.8, 3.3, 3.5, 2.3, 2.4, 2.3, 2.5, 4.5, 3.2, 2.8, 2.5, 2.0, 2.4,
           3.5, 3.3, 1.8, 2.2, 4.0, 4.1, 2.1, 2.3, 4.1],
  },
];

const DEFAULT_X_LABELS = ['Oct 5, 2025', 'Oct 19, 2025', 'Nov 2, 2025', 'Nov 16, 2025'];

/* ── SVG helpers ────────────────────────────────────────────────────────── */
/** Generate a smooth cubic bezier path through points */
function smoothPath(pts: Array<[number, number]>): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cpx = (x0 + x1) / 2;
    d += ` C ${cpx} ${y0}, ${cpx} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

/** Convert data values to SVG coordinates */
function toPoints(
  data: number[],
  width: number,
  height: number,
  yMax: number,
  padLeft: number,
): Array<[number, number]> {
  const usableW = width - padLeft;
  return data.map((v, i) => [
    padLeft + (i / (data.length - 1)) * usableW,
    height - (v / yMax) * height,
  ]);
}

/* ── Component ─────────────────────────────────────────────────────────── */
const LineAreaChart: React.FC<LineAreaChartProps> = ({
  title = 'Monthly active members',
  period = '30d',
  series = DEFAULT_SERIES,
  xLabels = DEFAULT_X_LABELS,
  yMax = 12,
  yStep = 2,
}) => {
  const PAD_LEFT = 36;
  const CHART_W = 900; // SVG viewBox width
  const CHART_H = 187; // chart drawing area height
  const X_LABEL_H = 24;
  const TOTAL_H = CHART_H + X_LABEL_H + 12;

  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let v = 0; v <= yMax; v += yStep) ticks.push(v);
    return ticks.reverse(); // top to bottom
  }, [yMax, yStep]);

  const seriesPoints = useMemo(
    () => series.map(s => toPoints(s.data, CHART_W - PAD_LEFT, CHART_H, yMax, PAD_LEFT)),
    [series, yMax],
  );

  return (
    <div className="bg-primary border border-primary rounded-xl p-6 flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center gap-2 shrink-0">
        <Typography variant="label-md" color="primary">
          {title}
        </Typography>
        <span className="text-caption text-secondary pt-0.5">{period}</span>
      </div>

      {/* Chart SVG */}
      <div className="w-full shrink-0">
        <svg
          viewBox={`0 0 ${CHART_W} ${TOTAL_H}`}
          width="100%"
          style={{ display: 'block', overflow: 'visible' }}
          preserveAspectRatio="none"
        >
          <defs>
            {series.map((s, si) =>
              s.fill ? (
                <linearGradient key={si} id={`grad-${si}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0.01} />
                </linearGradient>
              ) : null,
            )}
          </defs>

          {/* Horizontal grid lines */}
          {yTicks.map(v => {
            const y = CHART_H - (v / yMax) * CHART_H;
            return (
              <line
                key={v}
                x1={PAD_LEFT}
                y1={y}
                x2={CHART_W}
                y2={y}
                stroke="#e4e7eb"
                strokeWidth={1}
              />
            );
          })}

          {/* Y-axis labels */}
          {yTicks.map(v => {
            const y = CHART_H - (v / yMax) * CHART_H;
            return (
              <text
                key={v}
                x={PAD_LEFT - 8}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={11}
                fill="#717680"
                fontFamily="Inter, sans-serif"
              >
                {v}
              </text>
            );
          })}

          {/* Area fills */}
          {series.map((s, si) => {
            if (!s.fill) return null;
            const pts = seriesPoints[si];
            const linePath = smoothPath(pts);
            const areaPath =
              linePath +
              ` L ${pts[pts.length - 1][0]} ${CHART_H} L ${pts[0][0]} ${CHART_H} Z`;
            return (
              <path
                key={`area-${si}`}
                d={areaPath}
                fill={`url(#grad-${si})`}
              />
            );
          })}

          {/* Lines */}
          {series.map((s, si) => {
            const pts = seriesPoints[si];
            const linePath = smoothPath(pts);
            return (
              <path
                key={`line-${si}`}
                d={linePath}
                fill="none"
                stroke={s.color}
                strokeWidth={1.8}
                strokeDasharray={s.dashed ? '6 4' : undefined}
              />
            );
          })}

          {/* X-axis labels */}
          {xLabels.map((label, i) => {
            const x = PAD_LEFT + (i / (xLabels.length - 1)) * (CHART_W - PAD_LEFT);
            return (
              <text
                key={i}
                x={x}
                y={CHART_H + X_LABEL_H}
                textAnchor={i === 0 ? 'start' : i === xLabels.length - 1 ? 'end' : 'middle'}
                fontSize={11}
                fill="#717680"
                fontFamily="Inter, sans-serif"
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap shrink-0">
        {series.map((s, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <svg width={10} height={10} viewBox="0 0 10 10" className="shrink-0">
              <circle cx={5} cy={5} r={5} fill={s.color} />
            </svg>
            <span className="text-caption text-secondary">{s.label}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default LineAreaChart;
