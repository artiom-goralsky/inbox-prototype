import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Icon } from '@circleco/compass/components/Icon';
import { Button } from '@circleco/compass/components/Button';

interface SupportEmptyStateProps {
  onStart: () => void;
}

const SupportEmptyState: React.FC<SupportEmptyStateProps> = ({ onStart }) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-primary">
      <div className="flex flex-col items-center gap-4 text-center max-w-md px-6">
        <div className="size-16 rounded-full bg-secondary flex items-center justify-center">
          <Icon name="email" size="lg" color="tertiary" />
        </div>
        <div className="flex flex-col gap-1">
          <Typography variant="heading-md" color="primary">Need help with Circle?</Typography>
          <Typography variant="body-sm" color="secondary">
            Start a conversation with our team. We typically reply within a business day.
          </Typography>
        </div>
        <Button variant="primary" size="md" onClick={onStart}>Start a conversation</Button>
      </div>
    </div>
  );
};

export default SupportEmptyState;
