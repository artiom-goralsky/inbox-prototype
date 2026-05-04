import React, { useState } from 'react';
import ContentContainer from '../ContentContainer/ContentContainer';
import { Button } from '@circleco/compass/components/Button';
import { Icon } from '@circleco/compass/components/Icon';
import AnalyticsTableCard, { type AnalyticsTableCardRow } from './AnalyticsTableCard';
import PopularDayTimeChart from './PopularDayTimeChart';
import LineAreaChart from './LineAreaChart';

interface AnalyticsContext {
  id: string;
  title: string;
  subtitle?: string;
}

interface AnalyticsOverviewProps {
  onToggleSidebar: () => void;
  context?: AnalyticsContext | null;
}

/* ── Design tokens ────────────────────────────────────────────────────── */
const BAR_COLORS = {
  presence:     '#92c4d3',  // brand/carolina-blue/400
  participation:'#bfdbfe',  // base/blue/200
  contribution: '#2563eb',  // base/blue/600
  connection:   '#1e3a8a',  // base/blue/900
};

/* ── Mock data ────────────────────────────────────────────────────────── */
const CARDS_ROW1 = [
  { label: 'Active members',  period: '30d', value: '2,817', trend: '+2.8%', up: true  },
  { label: 'New members',     period: '30d', value: '1,126', trend: '+2.8%', up: true  },
  { label: 'Retention rate',  period: '30d', value: '94%',   trend: '-2.8%', up: false },
];

/* ── Onboarding-specific data ─────────────────────────────────────────── */
const ONBOARDING_CARDS_ROW1 = [
  { label: 'Members started',    period: '7d', value: '1,126', trend: '+5.3%', up: true  },
  { label: 'Members completed',  period: '7d', value: '847',   trend: '+8.1%', up: true  },
  { label: 'Completion rate',    period: '7d', value: '75.2%', trend: '+1.4%', up: true  },
];
const ONBOARDING_CARDS_ROW2 = [
  { label: 'Drop-off rate',      period: '7d', value: '24.8%', trend: '-1.4%', up: true  },
  { label: 'Avg. time to complete', period: '7d', value: '3.2d', trend: '-0.6d', up: true },
  { label: 'Re-engaged',         period: '7d', value: '163',   trend: '+8.2%', up: true  },
];

const ONBOARDING_MEMBERS_ROWS: AnalyticsTableCardRow[] = [
  { avatar: '/images/avatars/1.png', name: 'Lieve Carter',   subtitle: 'Completed · 2.1d',  score: 10, scoreMax: 10, trend: '100%',  trendUp: true  },
  { avatar: '/images/avatars/2.png', name: 'Roger Culhane',  subtitle: 'Completed · 1.8d',  score: 10, scoreMax: 10, trend: '100%',  trendUp: true  },
  { avatar: '/images/avatars/3.png', name: 'Alena George',   subtitle: 'Completed · 3.4d',  score: 10, scoreMax: 10, trend: '100%',  trendUp: true  },
  { avatar: '/images/avatars/4.png', name: 'Zaire Stanton',  subtitle: 'Completed · 4.1d',  score: 9,  scoreMax: 10, trend: '+4.2%', trendUp: true  },
  { avatar: '/images/avatars/5.png', name: 'Alfredo Reyes',  subtitle: 'In progress · step 4', score: 6, scoreMax: 10, trend: '60%', trendUp: true  },
  { avatar: '/images/avatars/6.png', name: 'Omar Herwitz',   subtitle: 'Dropped off · step 2', score: 3, scoreMax: 10, trend: '30%', trendUp: false },
  { avatar: '/images/avatars/7.png', name: 'Phillip Rosser', subtitle: 'Dropped off · step 1', score: 1, scoreMax: 10, trend: '10%', trendUp: false },
];

const ONBOARDING_DROPOFF_ROWS: AnalyticsTableCardRow[] = [
  { name: 'Step 1 · Welcome & profile setup',       subtitle: '1,126 started',   score: 9, scoreMax: 10, trend: '95.1%', trendUp: true  },
  { name: 'Step 2 · Join your first space',          subtitle: '1,071 reached',   score: 8, scoreMax: 10, trend: '88.3%', trendUp: true  },
  { name: 'Step 3 · Introduce yourself',             subtitle: '946 reached',     score: 7, scoreMax: 10, trend: '79.2%', trendUp: true  },
  { name: 'Step 4 · Complete goals survey',          subtitle: '847 reached',     score: 5, scoreMax: 10, trend: '75.2%', trendUp: false },
  { name: 'Step 5 · Connect with a member',          subtitle: '712 reached',     score: 4, scoreMax: 10, trend: '63.2%', trendUp: false },
  { name: 'Step 6 · First post or comment',          subtitle: '589 reached',     score: 3, scoreMax: 10, trend: '52.3%', trendUp: false },
  { name: 'Step 7 · Onboarding complete',            subtitle: '847 completed',   score: 8, scoreMax: 10, trend: '75.2%', trendUp: true  },
];
const CARDS_ROW2 = [
  { label: 'Posts created',   period: '30d', value: '483',   trend: '+5.1%', up: true  },
  { label: 'Comments',        period: '30d', value: '1,940', trend: '+12.3%',up: true  },
  { label: 'Avg. engagement', period: '30d', value: '38%',   trend: '-1.2%', up: false },
];

// Heights in px per segment, bars align to bottom of 197px chart area
const BAR_DATA = [
  { label: 'Jan 1',  presence: 5,  participation: 15, contribution: 59, connection: 27 },
  { label: 'Jan 29', presence: 5,  participation: 15, contribution: 43, connection: 27 },
  { label: 'Feb 13', presence: 5,  participation: 15, contribution: 43, connection: 27 },
  { label: 'Feb 28', presence: 5,  participation: 15, contribution: 43, connection: 27 },
  { label: 'Mar 11', presence: 5,  participation: 15, contribution: 43, connection: 27 },
];

const POPULAR_SPACES = [
  { name: 'General Discussion',       likes: 142, comments: 891, score: 5, scoreMax: 10, trend: '+2.8%' },
  { name: 'Announcements',            likes: 28,  comments: 340, score: 3, scoreMax: 10, trend: '+2.8%' },
  { name: 'Course: Getting Started',  likes: 65,  comments: 212, score: 7, scoreMax: 10, trend: '+2.8%' },
  { name: 'Member Introductions',     likes: 94,  comments: 502, score: 4, scoreMax: 10, trend: '+2.8%' },
  { name: 'Resources',                likes: 37,  comments: 98,  score: 2, scoreMax: 10, trend: '+2.8%' },
  { name: 'Events',                   likes: 58,  comments: 176, score: 6, scoreMax: 10, trend: '+2.8%' },
  { name: 'Coaching Sessions',        likes: 21,  comments: 63,  score: 3, scoreMax: 10, trend: '+2.8%' },
];

const POPULAR_MEMBERS = [
  { name: 'Alex Johnson',    likes: 89,  comments: 234, score: 9, scoreMax: 10, trend: '+5.1%' },
  { name: 'Maria Garcia',    likes: 76,  comments: 198, score: 8, scoreMax: 10, trend: '+3.2%' },
  { name: 'James Wilson',    likes: 54,  comments: 167, score: 7, scoreMax: 10, trend: '+1.8%' },
  { name: 'Emma Davis',      likes: 48,  comments: 143, score: 6, scoreMax: 10, trend: '+0.9%' },
  { name: 'Chris Martinez',  likes: 39,  comments: 121, score: 5, scoreMax: 10, trend: '+2.4%' },
  { name: 'Sarah Thompson',  likes: 31,  comments: 98,  score: 4, scoreMax: 10, trend: '-0.5%' },
  { name: 'David Brown',     likes: 22,  comments: 77,  score: 3, scoreMax: 10, trend: '-1.1%' },
];

const TOP_CONTENT_ROWS: AnalyticsTableCardRow[] = [
  { name: 'Getting Started: Your Community Guide', subtitle: 'General Discussion', score: 9, scoreMax: 10, trend: '+8.2%', trendUp: true },
  { name: 'Weekly Check-in: Goals & Wins',         subtitle: 'General Discussion', score: 7, scoreMax: 10, trend: '+3.5%', trendUp: true },
  { name: 'Introducing the Resource Library',      subtitle: 'Resources',          score: 7, scoreMax: 10, trend: '+5.1%', trendUp: true },
  { name: 'AMA: Building Your First Product',      subtitle: 'Events',             score: 6, scoreMax: 10, trend: '+1.9%', trendUp: true },
  { name: 'Member Spotlight: March 2024',          subtitle: 'Announcements',      score: 5, scoreMax: 10, trend: '+0.7%', trendUp: true },
  { name: 'Course Kickoff: Module 1 Intro',        subtitle: 'Course: Getting Started', score: 4, scoreMax: 10, trend: '-0.3%', trendUp: false },
  { name: 'Community Guidelines & Values',         subtitle: 'Announcements',      score: 3, scoreMax: 10, trend: '-1.1%', trendUp: false },
];

const POST_STARTERS_ROWS: AnalyticsTableCardRow[] = [
  { avatar: '/images/avatars/1.png', name: 'Lieve Carter',   subtitle: 'lieve.c@mail.com',   score: 5, scoreMax: 10, trend: '+2.8%', trendUp: true },
  { avatar: '/images/avatars/2.png', name: 'Roger Culhane',  subtitle: 'roger.c@mail.com',   score: 5, scoreMax: 10, trend: '+2.8%', trendUp: true },
  { avatar: '/images/avatars/3.png', name: 'Alena George',   subtitle: 'alena.g@mail.com',   score: 5, scoreMax: 10, trend: '+2.8%', trendUp: true },
  { avatar: '/images/avatars/4.png', name: 'Zaire Stanton',  subtitle: 'zaire.s@mail.com',   score: 5, scoreMax: 10, trend: '+2.8%', trendUp: true },
  { avatar: '/images/avatars/5.png', name: 'Alfredo Reyes',  subtitle: 'alfredo.r@mail.com', score: 4, scoreMax: 10, trend: '+0.5%', trendUp: true },
  { avatar: '/images/avatars/6.png', name: 'Omar Herwitz',   subtitle: 'omar.h@mail.com',    score: 3, scoreMax: 10, trend: '-0.8%', trendUp: false },
  { avatar: '/images/avatars/7.png', name: 'Phillip Rosser', subtitle: 'phillip.r@mail.com', score: 2, scoreMax: 10, trend: '-1.5%', trendUp: false },
];

/* ── FilterBar ────────────────────────────────────────────────────────── */
function FilterBar() {
  const [chips, setChips] = useState([
    { label: 'Member type', modifier: 'is', value: 'Member' },
  ]);
  return (
    <div className="flex items-center flex-wrap gap-2 py-3 border-b border-primary">
      <div className="flex-1 flex items-center flex-wrap gap-2">
        {chips.map((chip, i) => (
          <div key={i} className="flex items-center h-7 bg-hover border border-hover rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)] overflow-hidden shrink-0">
            <span className="px-2 py-1 text-label-xs text-primary border-r border-primary">{chip.label}</span>
            <span className="px-2 py-1 text-label-xs text-tertiary border-r border-primary">{chip.modifier}</span>
            <span className="px-2 py-1 text-label-xs text-primary border-r border-primary">{chip.value}</span>
            <button
              type="button"
              onClick={() => setChips(c => c.filter((_, idx) => idx !== i))}
              className="flex items-center justify-center px-2 py-1 hover:bg-active rounded-sm transition-colors"
              aria-label="Remove filter"
            >
              <Icon name="cross" size="sm" />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="flex items-center justify-center w-7 h-7 bg-primary border border-primary rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)] hover:bg-hover transition-colors"
          aria-label="Add filter"
        >
          <Icon name="filter" size="sm" />
        </button>
      </div>
      {chips.length > 0 && (
        <button
          type="button"
          onClick={() => setChips([])}
          className="px-2 py-1 text-label-xs text-tertiary hover:bg-hover rounded-lg transition-colors shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

/* ── NumberCard ───────────────────────────────────────────────────────── */
function NumberCard({ label, period, value, trend, up }: typeof CARDS_ROW1[0]) {
  return (
    <div className="flex-1 bg-primary border border-primary rounded-xl p-6 overflow-hidden">
      {/* Title row */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-label-md font-semibold text-primary tracking-tight">{label}</span>
        <span className="text-caption text-secondary pt-0.5">{period}</span>
      </div>
      {/* Number */}
      <div className="mt-2 mb-2">
        <span className="text-[32px] font-bold leading-10 tracking-tight text-primary">{value}</span>
      </div>
      {/* Trend badge */}
      <div
        className={`inline-flex items-center px-2 py-0.5 rounded-lg text-label-xs font-medium border max-w-[184px] ${
          up
            ? 'bg-success-subtle border-success text-success'
            : 'bg-warning-subtle border-warning text-warning'
        }`}
        style={{ fontSize: 12 }}
      >
        {trend}
      </div>
    </div>
  );
}

/* ── BarChart ─────────────────────────────────────────────────────────── */
const Y_LABELS = [10, 8, 6, 4, 2, 0];
const CHART_H = 197; // px — the bar drawing area height

function BarChart({ title, period }: { title: string; period: string }) {
  return (
    <div className="bg-primary border border-primary rounded-xl p-6 flex flex-col gap-6">
      {/* Title */}
      <div className="flex items-start">
        <div className="flex items-center gap-2">
          <span className="text-label-md font-semibold text-primary tracking-tight">{title}</span>
          <span className="text-caption text-secondary pt-0.5">{period}</span>
        </div>
      </div>

      {/* Chart body */}
      <div className="flex items-start w-full" style={{ height: CHART_H + 26 }}>
        {/* Y axis */}
        <div
          className="flex flex-col justify-between items-end shrink-0 bg-primary pr-3 text-caption text-tertiary"
          style={{ height: CHART_H, minWidth: 36 }}
        >
          {Y_LABELS.map(v => <span key={v} className="leading-[18px]">{v}</span>)}
        </div>

        {/* Bars + x labels */}
        <div className="flex-1 flex flex-col relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none" style={{ height: CHART_H }}>
            {Y_LABELS.map(v => (
              <div key={v} className="w-full border-t border-primary opacity-70" />
            ))}
          </div>

          {/* Bars row, bottom-aligned */}
          <div className="flex items-end justify-between px-5 relative" style={{ height: CHART_H }}>
            {BAR_DATA.map(d => (
              <div key={d.label} className="flex flex-col items-center justify-end" style={{ height: CHART_H }}>
                <div
                  className="flex flex-col overflow-hidden rounded-sm w-5"
                  style={{ height: d.presence + d.participation + d.contribution + d.connection }}
                >
                  <div style={{ height: d.presence,      background: BAR_COLORS.presence      }} />
                  <div style={{ height: d.participation, background: BAR_COLORS.participation }} />
                  <div style={{ height: d.contribution,  background: BAR_COLORS.contribution  }} />
                  <div style={{ height: d.connection,    background: BAR_COLORS.connection    }} />
                </div>
              </div>
            ))}
          </div>

          {/* X axis labels */}
          <div className="flex items-center justify-between px-5 pt-2">
            {BAR_DATA.map(d => (
              <span key={d.label} className="text-caption text-tertiary text-center w-20">{d.label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {([
          { key: 'presence',     color: BAR_COLORS.presence,     label: 'Presence'      },
          { key: 'participation',color: BAR_COLORS.participation, label: 'Participation' },
          { key: 'contribution', color: BAR_COLORS.contribution,  label: 'Contribution'  },
          { key: 'connection',   color: BAR_COLORS.connection,    label: 'Connection'    },
        ] as const).map(({ key, color, label }) => (
          <div key={key} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
            <span className="text-caption text-secondary">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SpacesTable ──────────────────────────────────────────────────────── */
interface TableRow {
  name: string;
  likes: number;
  comments: number;
  score: number;
  scoreMax: number;
  trend: string;
}

function AnalyticsTable({ title, period, rows }: { title: string; period: string; rows: TableRow[] }) {
  return (
    <div className="flex-1 bg-primary border border-primary rounded-xl p-6 flex flex-col gap-6 min-w-0">
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="text-label-md font-semibold text-primary tracking-tight">{title}</span>
        <span className="text-caption text-secondary pt-0.5">{period}</span>
      </div>

      {/* Columns-based table */}
      <div className="flex items-start overflow-hidden rounded-md w-full">
        {/* Name column — flex-1 */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="h-10 flex items-center border-b border-primary pr-3">
            <span className="text-label-sm text-secondary tracking-tight">Name</span>
          </div>
          {rows.map((r, i) => (
            <div key={i} className="h-14 flex items-center border-b border-primary pr-3">
              <span className="text-body-sm text-primary truncate">{r.name}</span>
            </div>
          ))}
        </div>

        {/* Likes column */}
        <div className="w-[100px] shrink-0 flex flex-col">
          <div className="h-10 flex items-center border-b border-primary px-4">
            <span className="text-label-sm text-secondary tracking-tight">Likes</span>
          </div>
          {rows.map((r, i) => (
            <div key={i} className="h-14 flex items-center border-b border-primary px-4">
              <span className="text-body-sm text-primary">{r.likes}</span>
            </div>
          ))}
        </div>

        {/* Comments column */}
        <div className="w-[110px] shrink-0 flex flex-col">
          <div className="h-10 flex items-center border-b border-primary px-4">
            <span className="text-label-sm text-secondary tracking-tight">Comments</span>
          </div>
          {rows.map((r, i) => (
            <div key={i} className="h-14 flex items-center border-b border-primary px-4">
              <span className="text-body-sm text-primary">{r.comments}</span>
            </div>
          ))}
        </div>

        {/* Score column — number + progress + trend */}
        <div className="w-[160px] shrink-0 flex flex-col">
          <div className="h-10 flex items-center border-b border-primary px-4">
            <span className="text-label-sm text-secondary tracking-tight">Score</span>
          </div>
          {rows.map((r, i) => (
            <div key={i} className="h-14 flex items-center gap-2 border-b border-primary px-4">
              <span className="text-body-sm text-primary shrink-0">{r.score}</span>
              <div className="flex-1 h-1.5 bg-primary-subtle rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-[30px]"
                  style={{ width: `${(r.score / r.scoreMax) * 100}%` }}
                />
              </div>
              <span
                className="text-label-xs font-medium text-success shrink-0"
                style={{ fontSize: 12 }}
              >
                {r.trend}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center">
        <span className="flex-1 text-body-sm text-secondary">
          Showing <span className="font-medium text-primary">1–{rows.length}</span> of{' '}
          <span className="font-medium text-primary">{rows.length}</span>
        </span>
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" size="sm" startIcon="chevron-left">
            Previous
          </Button>
          <Button type="button" variant="secondary" size="sm" endIcon="chevron-right">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────────────── */
const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ onToggleSidebar, context }) => {
  const isOnboarding = context?.id === 'onboarding';
  const cardsRow1 = isOnboarding ? ONBOARDING_CARDS_ROW1 : CARDS_ROW1;
  const cardsRow2 = isOnboarding ? ONBOARDING_CARDS_ROW2 : CARDS_ROW2;

  return (
    <ContentContainer
      title="Overview"
      onToggleSidebar={onToggleSidebar}
      actions={
        <Button type="button" variant="secondary" size="sm" endIcon="chevron-down">
          CSV
        </Button>
      }
    >
      <div className="py-6 flex flex-col gap-6">
        <FilterBar />

        {/* Number cards row 1 */}
        <div className="flex gap-6">
          {cardsRow1.map(c => <NumberCard key={c.label} {...c} />)}
        </div>

        {/* Number cards row 2 */}
        <div className="flex gap-6">
          {cardsRow2.map(c => <NumberCard key={c.label} {...c} />)}
        </div>

        {/* Bar charts */}
        <BarChart title={isOnboarding ? 'Onboarding completion by step' : 'Bar chart standard'} period={isOnboarding ? '7d' : '30d'} />
        {!isOnboarding && <PopularDayTimeChart />}
        <LineAreaChart title={isOnboarding ? 'Weekly onboarding completions' : 'Monthly active members'} period={isOnboarding ? '7d' : '30d'} />
        <LineAreaChart
          title={isOnboarding ? 'Weekly new members started' : 'Monthly new members'}
          period={isOnboarding ? '7d' : '30d'}
          series={[
            {
              label: 'Oct 28 – Dec 28',
              color: '#3b82f6',
              fill: true,
              dashed: false,
              data: [1.2, 0.9, 2.1, 1.8, 3.0, 2.4, 1.1, 2.8, 2.6, 1.3, 1.5, 0.8, 3.4,
                     2.9, 2.2, 2.5, 1.2, 1.4, 1.1, 1.6, 3.1, 2.3, 1.9, 1.4, 0.9, 1.3,
                     2.7, 2.4, 0.8, 1.1, 3.2, 3.3, 1.0, 1.2, 3.5],
            },
            {
              label: 'Sep 28 – Oct 28',
              color: '#93c5fd',
              fill: false,
              dashed: true,
              data: [0.8, 0.6, 1.2, 1.0, 1.9, 1.5, 0.7, 1.7, 1.6, 0.8, 0.9, 0.5, 2.1,
                     1.8, 1.4, 1.6, 0.7, 0.9, 0.7, 1.0, 1.9, 1.4, 1.2, 0.9, 0.5, 0.8,
                     1.7, 1.5, 0.5, 0.7, 2.0, 2.1, 0.6, 0.7, 2.2],
            },
          ]}
          yMax={4}
          yStep={1}
        />

        {/* Tables row 1 */}
        {!isOnboarding && (
          <div className="flex gap-6">
            <AnalyticsTable title="Popular spaces"  period="30d" rows={POPULAR_SPACES} />
            <AnalyticsTable title="Popular members" period="30d" rows={POPULAR_MEMBERS} />
          </div>
        )}

        {/* Tables row 2 */}
        <div className="flex gap-6">
          <AnalyticsTableCard
            title={isOnboarding ? 'Members completing onboarding' : 'Top content'}
            period={isOnboarding ? '7d' : '30d'}
            nameLabel={isOnboarding ? 'Member' : 'Name'}
            scoreLabel={isOnboarding ? 'Progress' : 'Score'}
            rows={isOnboarding ? ONBOARDING_MEMBERS_ROWS : TOP_CONTENT_ROWS}
            total={isOnboarding ? 1126 : 21}
          />
          <AnalyticsTableCard
            title={isOnboarding ? 'Drop-off analysis by step' : 'Post starters'}
            period={isOnboarding ? '7d' : '30d'}
            nameLabel={isOnboarding ? 'Step' : 'Member'}
            scoreLabel={isOnboarding ? 'Completion' : 'Posts'}
            rows={isOnboarding ? ONBOARDING_DROPOFF_ROWS : POST_STARTERS_ROWS}
            total={isOnboarding ? 7 : 21}
          />
        </div>

        <div className="pb-6" />
      </div>
    </ContentContainer>
  );
};

export default AnalyticsOverview;
