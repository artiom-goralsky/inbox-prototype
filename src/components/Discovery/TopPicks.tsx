import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import type { CreatorData } from './CreatorProfilePage';

interface TopPicksProps {
  onCreatorClick?: (creator: CreatorData) => void;
}

const TopPicks: React.FC<TopPicksProps> = ({ onCreatorClick }) => {
  const topPicks = [
    {
      id: 1,
      title: 'The Entreprenista League',
      creator: 'Stephanie Cartin',
      category: 'Business',
      price: '$1,497',
      image: 'https://picsum.photos/60/60?random=11',
    },
    {
      id: 2,
      title: 'Exit Five',
      creator: 'Dave Gerhardt',
      category: 'Marketing',
      price: 'From $49 /month',
      image: 'https://picsum.photos/60/60?random=12',
    },
    {
      id: 3,
      title: 'TroopHR Membership',
      creator: 'Tracy Avin',
      category: 'HR',
      price: '$700 /year',
      image: 'https://picsum.photos/60/60?random=13',
    },
    {
      id: 4,
      title: 'Jay Shetty Certification School',
      creator: 'Jay Shetty',
      category: 'Self-development',
      price: '$2,997',
      image: 'https://picsum.photos/60/60?random=14',
    },
  ];

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Typography component="h2" variant="heading-lg" color="primary">
            Top picks
          </Typography>
          <Typography
            component="p"
            variant="body-sm"
            color="secondary"
            className="mt-1"
          >
            A handpicked list of the top performing creators and products.
          </Typography>
        </div>
        <button className="text-tertiary hover:text-gray-700 font-medium">
          See all &gt;
        </button>
      </div>

      {/* Top Picks List */}
      <div className="space-y-4">
        {topPicks.map(item => (
          <div
            key={item.id}
            className="flex items-center space-x-4 p-4 border border-primary rounded-lg hover:bg-secondary transition-colors cursor-pointer"
            onClick={() => onCreatorClick?.(item)}
          >
            {/* Number */}
            <Typography
              component="div"
              variant="heading-md"
              color="disabled"
              className="w-8"
            >
              {item.id}
            </Typography>

            {/* Image */}
            <div className="w-15 h-15 rounded-lg overflow-hidden shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <Typography
                component="h3"
                variant="label-lg"
                color="primary"
                className="truncate"
              >
                {item.title}
              </Typography>
              <Typography component="p" variant="body-sm" color="secondary">
                {item.creator}
              </Typography>
              <Typography component="p" variant="body-sm" color="tertiary">
                {item.category}
              </Typography>
            </div>

            {/* Price */}
            <div className="text-right">
              <Typography component="span" variant="label-md" color="primary">
                {item.price}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPicks;
