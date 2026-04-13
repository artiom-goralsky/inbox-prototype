import React from 'react';
import HorizontalSlider from './HorizontalSlider';
import { Typography } from '@circleco/compass/components/Typography';

const TopCreators: React.FC = () => {
  const creators = [
    {
      id: 1,
      name: 'Brendon Burchard',
      title: 'High Performance Coach',
      image: 'https://picsum.photos/300/400?random=15',
      gradient: 'from-blue-600 to-blue-800',
    },
    {
      id: 2,
      name: 'Jay Shetty',
      title: 'Life Coach',
      image: 'https://picsum.photos/300/400?random=16',
      gradient: 'from-green-600 to-green-800',
    },
    {
      id: 3,
      name: 'Dana Malstaff',
      title: 'Business Woman',
      image: 'https://picsum.photos/300/400?random=17',
      gradient: 'from-purple-600 to-purple-800',
    },
    {
      id: 4,
      name: 'Pat Flynn',
      title: 'Entrepreneur',
      image: 'https://picsum.photos/300/400?random=18',
      gradient: 'from-gray-600 to-gray-800',
    },
  ];

  return (
    <HorizontalSlider
      title="Top creators"
      subtitle="Creators who inspire millions are ready to help you grow."
    >
      {creators.map(creator => (
        <div key={creator.id} className="shrink-0 w-80">
          <div className="relative rounded-lg overflow-hidden h-96">
            <img
              src={creator.image}
              alt={creator.name}
              className="w-full h-full object-cover"
            />
            <div
              className={`absolute inset-0 bg-linear-to-t ${creator.gradient} opacity-80`}
            ></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <Typography
                component="h3"
                variant="heading-sm"
                color="inverse"
                className="mb-1"
              >
                {creator.name}
              </Typography>
              <Typography component="p" variant="body-sm" color="inverse">
                {creator.title}
              </Typography>
            </div>
          </div>
        </div>
      ))}
    </HorizontalSlider>
  );
};

export default TopCreators;
