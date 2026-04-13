import React, { useRef, useState } from 'react';

interface ContentCard {
  id: string;
  title: string;
  source: string;
  thumbnail: string;
  type: 'video' | 'article';
  duration: string;
  originRect?: {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
    x: number;
    y: number;
  } | null;
}

interface ContentCardsProps {
  onCardClick: (card: ContentCard) => void;
}

const ContentCards: React.FC<ContentCardsProps> = ({ onCardClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const cards: ContentCard[] = [
    {
      id: '1',
      title: 'ChatGPT 101: The No BS Guide to...',
      source: "Nate's Substack",
      thumbnail: 'https://picsum.photos/300/200?random=10',
      type: 'video',
      duration: '24m watch',
    },
    {
      id: '2',
      title: 'Liquid and Illiquid Careers, 5 AI...',
      source: 'The VC Corner',
      thumbnail: 'https://picsum.photos/300/200?random=11',
      type: 'article',
      duration: '6m read',
    },
    {
      id: '3',
      title: 'How Linear Implemented Multi...',
      source: 'ByteByteGo Ne...',
      thumbnail: 'https://picsum.photos/300/200?random=12',
      type: 'article',
      duration: '10m read',
    },
    {
      id: '4',
      title: 'The Real Talk Guide to Using AI Agents...',
      source: "Nate's Substack",
      thumbnail: 'https://picsum.photos/300/200?random=13',
      type: 'video',
      duration: '22m watch',
    },
    {
      id: '5',
      title: 'What makes a shopping...',
      source: 'On Substack',
      thumbnail: 'https://picsum.photos/300/200?random=14',
      type: 'article',
      duration: '8m read',
    },
    {
      id: '6',
      title: 'Building Scalable Systems...',
      source: 'Tech Weekly',
      thumbnail: 'https://picsum.photos/300/200?random=15',
      type: 'article',
      duration: '12m read',
    },
    {
      id: '7',
      title: 'AI in Healthcare: Future Trends',
      source: 'Health Tech',
      thumbnail: 'https://picsum.photos/300/200?random=16',
      type: 'video',
      duration: '18m watch',
    },
    {
      id: '8',
      title: 'The Future of Remote Work',
      source: 'Product Hunt',
      thumbnail: 'https://picsum.photos/300/200?random=17',
      type: 'article',
      duration: '7m read',
    },
    {
      id: '9',
      title: 'Startup Funding in 2024',
      source: 'TechCrunch',
      thumbnail: 'https://picsum.photos/300/200?random=18',
      type: 'video',
      duration: '15m watch',
    },
    {
      id: '10',
      title: 'Design Systems That Scale',
      source: 'Figma Blog',
      thumbnail: 'https://picsum.photos/300/200?random=19',
      type: 'article',
      duration: '9m read',
    },
    {
      id: '11',
      title: 'Machine Learning for Beginners',
      source: 'Towards Data Science',
      thumbnail: 'https://picsum.photos/300/200?random=20',
      type: 'video',
      duration: '28m watch',
    },
    {
      id: '12',
      title: 'Building Your First SaaS',
      source: 'Indie Hackers',
      thumbnail: 'https://picsum.photos/300/200?random=21',
      type: 'article',
      duration: '11m read',
    },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const currentScroll = scrollRef.current.scrollLeft;
      const targetScroll =
        direction === 'left'
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <div className="relative">
      {/* Left Fade Gradient */}
      {showLeftArrow && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
      )}

      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 bg-primary rounded-full shadow-lg flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <svg
            className="w-4 h-4 text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Right Fade Gradient */}
      {showRightArrow && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />
      )}

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 bg-primary rounded-full shadow-lg flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <svg
            className="w-4 h-4 text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* Cards Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex space-x-4 overflow-x-auto scrollbar-hide py-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {cards.map(card => (
          <div
            key={card.id}
            onClick={e => {
              // Get the exact click position relative to the viewport
              const clickX = e.clientX;
              const clickY = e.clientY;

              // Create a small rect around the click point for the zoom origin
              const clickRect = {
                left: clickX - 2,
                top: clickY - 2,
                right: clickX + 2,
                bottom: clickY + 2,
                width: 4,
                height: 4,
                x: clickX - 2,
                y: clickY - 2,
              };

              // Pass the card with click position
              onCardClick({ ...card, originRect: clickRect });
            }}
            className="shrink-0 w-48 bg-primary rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          >
            {/* Thumbnail */}
            <div className="relative">
              <img
                src={card.thumbnail}
                alt={card.title}
                className="w-full h-24 object-cover rounded-t-lg"
              />
            </div>

            {/* Content */}
            <div className="p-[10px]">
              <div className="text-xs text-tertiary mb-1">{card.source}</div>
              <h3 className="font-medium text-primary mb-[6px] line-clamp-2 text-xs">
                {card.title}
              </h3>
              <div className="flex items-center text-xs text-tertiary">
                {card.type === 'video' ? (
                  <svg
                    className="w-[10px] h-[10px] mr-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <div className="w-1 h-1 bg-gray-400 rounded-full mr-1"></div>
                )}
                <span>{card.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentCards;
