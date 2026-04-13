import React from 'react';
import { Divider } from '@circleco/compass/components/Divider';
import { Typography } from '@circleco/compass/components/Typography';
import { mergeClasses } from '../../lib/utils';

interface CommunitySectionHeaderProps {
  title: string;
  actions?: React.ReactNode;
  className?: string;
}

export const CommunitySectionHeader: React.FC<CommunitySectionHeaderProps> = ({
  title,
  actions,
  className,
}) => {
  return (
    <div className={mergeClasses('w-full max-w-[1280px]', className)}>
      <div className="min-h-[84px] py-6 flex items-center justify-between gap-3">
        <Typography component="h1" variant="heading-xl" color="primary">
          {title}
        </Typography>
        {actions ? (
          <div className="flex items-center gap-2">{actions}</div>
        ) : null}
      </div>

      <Divider orientation="horizontal" />
    </div>
  );
};
