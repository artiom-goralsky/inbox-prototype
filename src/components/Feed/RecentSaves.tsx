import React from 'react';

const RecentSaves: React.FC = () => {
  const savedItems = [
    {
      id: 1,
      title:
        'someone pinch me please... my publisher is ordering a 2,500 copy reprint of Tiny Experiments!! 🙏 social media can make us focus on the wrong metrics of success. this is a beautiful reminder of the power of communities. thanks so much for your support!',
      image: 'https://picsum.photos/300/150?random=7',
      type: 'Email Summary',
    },
    {
      id: 2,
      title:
        "Most of rural America is sitting on a goldmine: untapped land, untold stories, and unpolished beauty. And of all the experiential hospitality concepts I've seen, none capture the essence of authentic rural living quite like what we're building here.",
      image: 'https://picsum.photos/300/150?random=8',
      type: 'Rural America',
    },
    {
      id: 3,
      title:
        'In my 30s, I took up gymnastics. No background. Limited flexibility. Just curiosity... and a lot of drive. The journey has been incredible - from barely touching my toes to doing handstands!',
      image: 'https://picsum.photos/300/150?random=9',
      type: 'Gymnastics Journey',
    },
    {
      id: 4,
      title:
        "3.5 Years And It's Finally Ready... After countless late nights, endless revisions, and more coffee than I care to admit, my book 'Feel-Good Productivity' is finally hitting the shelves!",
      image: 'https://picsum.photos/300/150?random=10',
      type: 'Book Launch',
    },
  ];

  return (
    <div className="p-4 bg-secondary border border-primary rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-primary">Recent Saves</h2>
        <button className="text-sm text-link hover:text-link-hover font-medium">
          See all
        </button>
      </div>

      {/* Grid of Saved Items */}
      <div className="grid grid-cols-2 gap-4">
        {savedItems.map(item => (
          <div
            key={item.id}
            className="bg-primary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Image */}
            <div className="aspect-video">
              <img
                src={item.image}
                alt={item.type}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-3">
              <p className="text-sm text-primary line-clamp-3 mb-3">
                {item.title}
              </p>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                See post
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSaves;
