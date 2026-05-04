import React, { useState } from 'react';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Button } from '@circleco/compass/components/Button';
import { Typography } from '@circleco/compass/components/Typography';
import { Icon } from '@circleco/compass/components/Icon';

export interface AnalyticsTableCardRow {
  avatar?: string;
  name: string;
  subtitle?: string;
  score: number;
  scoreMax: number;
  trend: string;
  trendUp?: boolean;
}

interface AnalyticsTableCardProps {
  title: string;
  period?: string;
  nameLabel?: string;
  scoreLabel?: string;
  rows: AnalyticsTableCardRow[];
  total?: number;
  pageSize?: number;
}

const AnalyticsTableCard: React.FC<AnalyticsTableCardProps> = ({
  title,
  period = '30d',
  nameLabel = 'Name',
  scoreLabel = 'Score',
  rows,
  total,
  pageSize = 20,
}) => {
  const [page, setPage] = useState(1);
  const totalCount = total ?? rows.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div className="flex-1 min-w-0 bg-primary border border-primary rounded-xl p-6 flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center gap-2 shrink-0">
        <Typography variant="label-md" color="primary">
          {title}
        </Typography>
        <span className="text-caption text-secondary pt-0.5">{period}</span>
      </div>

      {/* Table */}
      <div className="flex items-start overflow-hidden rounded-md w-full shrink-0">

        {/* Name column — flex-1 */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header cell */}
          <div className="h-10 flex items-center border-b border-primary pr-3">
            <Typography variant="label-sm" color="secondary">{nameLabel}</Typography>
          </div>
          {/* Data cells */}
          {rows.map((row, i) => (
            <div
              key={i}
              className="h-14 flex items-center gap-2 border-b border-primary pr-3"
            >
              {row.avatar && (
                <Avatar
                  src={row.avatar}
                  name={row.name}
                  size="xs"
                  className="shrink-0"
                />
              )}
              {!row.avatar && (
                <div className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-secondary">
                  <Icon name="file" size="sm" />
                </div>
              )}
              <div className="flex flex-col min-w-0 overflow-hidden">
                <span className="text-body-sm font-medium text-primary truncate leading-5">
                  {row.name}
                </span>
                {row.subtitle && (
                  <span className="text-body-sm text-secondary truncate leading-5">
                    {row.subtitle}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Score column — fixed 150px */}
        <div className="w-[150px] shrink-0 flex flex-col">
          {/* Header cell */}
          <div className="h-10 flex items-center border-b border-primary px-4">
            <Typography variant="label-sm" color="secondary">{scoreLabel}</Typography>
          </div>
          {/* Data cells */}
          {rows.map((row, i) => (
            <div
              key={i}
              className="h-14 flex items-center gap-2 border-b border-primary px-4"
            >
              <span className="text-body-sm text-primary shrink-0 tabular-nums">
                {row.score}
              </span>
              {/* Progress bar */}
              <div className="w-[41px] h-1.5 bg-secondary rounded-full overflow-hidden shrink-0">
                <div
                  className="h-full bg-brand rounded-full"
                  style={{ width: `${(row.score / row.scoreMax) * 100}%` }}
                />
              </div>
              {/* Trend */}
              <span
                className={`text-label-xs font-medium shrink-0 ${
                  row.trendUp !== false && !row.trend.startsWith('-')
                    ? 'text-success'
                    : 'text-warning'
                }`}
                style={{ fontSize: 12 }}
              >
                {row.trend}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Pagination footer */}
      <div className="flex items-center shrink-0">
        <span className="flex-1 text-body-sm text-secondary">
          Showing{' '}
          <span className="font-medium text-primary">{start}–{end}</span>
          {' '}of{' '}
          <span className="font-medium text-primary">{totalCount}</span>
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            startIcon="chevron-left"
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            endIcon="chevron-right"
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>

    </div>
  );
};

export default AnalyticsTableCard;
