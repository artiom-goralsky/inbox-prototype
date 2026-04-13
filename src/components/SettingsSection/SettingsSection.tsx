import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';

const SettingsSection: React.FC = () => {
  return (
    <div className="h-screen bg-secondary flex items-center justify-center">
      <div className="text-center">
        <Typography
          color="primary"
          component="h1"
          variant="heading-xl"
          className="mb-4"
        >
          Settings
        </Typography>
        <p className="text-xl text-secondary">
          Application settings coming soon.
        </p>
      </div>
    </div>
  );
};

export default SettingsSection;
