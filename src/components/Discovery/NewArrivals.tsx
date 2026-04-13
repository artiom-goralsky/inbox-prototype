import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';

const NewArrivals: React.FC = () => {
  const newArrivals = [
    {
      id: 1,
      title: 'The Entreprenista League',
      creator: 'Stephanie Cartin',
      category: 'Business',
      price: '$1,497',
      image: 'https://picsum.photos/40/40?random=22',
    },
    {
      id: 2,
      title: 'Exit Five',
      creator: 'Dave Gerhardt',
      category: 'Marketing',
      price: 'From $49 /month',
      image: 'https://picsum.photos/40/40?random=23',
    },
    {
      id: 3,
      title: 'TroopHR Membership',
      creator: 'Tracy Avin',
      category: 'HR',
      price: '$700 /year',
      image: 'https://picsum.photos/40/40?random=24',
    },
    {
      id: 4,
      title: 'Jay Shetty Certification School',
      creator: 'Jay Shetty',
      category: 'Self-development',
      price: '$2,997',
      image: 'https://picsum.photos/40/40?random=25',
    },
    {
      id: 5,
      title: 'God Tier Ads',
      creator: 'Christian Bullock',
      category: 'Marketing',
      price: 'From $597 /month',
      image: 'https://picsum.photos/40/40?random=26',
    },
    {
      id: 6,
      title: 'Productivity Lab',
      creator: 'Ali Abdaal',
      category: 'Productivity',
      price: '$997 /year',
      image: 'https://picsum.photos/40/40?random=27',
    },
    {
      id: 7,
      title: 'Photography & Friends Community',
      creator: 'Phil Ebiner',
      category: 'Photography',
      price: 'FREE',
      image: 'https://picsum.photos/40/40?random=28',
    },
    {
      id: 8,
      title: 'Golf Swing Simplified',
      creator: 'Tom Saguto, PGA',
      category: 'Sports',
      price: 'From $19 /month',
      image: 'https://picsum.photos/40/40?random=29',
    },
  ];

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Typography component="h2" variant="heading-lg" color="primary">
            New arrivals
          </Typography>
          <Typography
            component="p"
            variant="body-sm"
            color="secondary"
            className="mt-1"
          >
            Newest products to go live.
          </Typography>
        </div>
        <button className="text-tertiary hover:text-gray-700 font-medium">
          See all &gt;
        </button>
      </div>

      {/* New Arrivals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {newArrivals.map(item => (
          <div
            key={item.id}
            className="flex items-center space-x-4 p-4 border border-primary rounded-lg hover:bg-secondary transition-colors"
          >
            {/* Number */}
            <Typography
              component="div"
              variant="label-lg"
              color="disabled"
              className="w-6"
            >
              {item.id}
            </Typography>

            {/* Image */}
            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
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

export default NewArrivals;
