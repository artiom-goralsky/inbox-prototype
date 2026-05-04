import React from 'react';
import { TextInput } from '@circleco/compass/components/TextInput';
import { Typography } from '@circleco/compass/components/Typography';

const HeroSection: React.FC = () => {
  return (
    <div className="text-center py-12">
      <Typography
        component="h1"
        variant="heading-2xl"
        color="primary"
        className="mb-4"
      >
        Your journey starts here
      </Typography>
      <Typography
        component="p"
        variant="body-md"
        color="secondary"
        className="mb-8 max-w-2xl mx-auto"
      >
        Find communities, creators, and products that transform your life.
      </Typography>

      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <TextInput
          placeholder="Search"
          icon="magnifying-glass"
        />
      </div>
    </div>
  );
};

export default HeroSection;
