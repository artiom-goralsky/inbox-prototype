import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@circleco/compass/components/Button';
import { IconButton } from '@circleco/compass/components/IconButton';

const HorizontalFilters: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('For you');
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filters = [
    'For you',
    'Featured',
    'Boost mental health',
    'Grow wealth',
    'Learn new tech skills',
    'Keep up with trends',
    'Get creative',
    'Explore science',
    'Live longer',
    'Enjoy food & cooking',
    'Manage money better',
    'Lead with confidence',
  ];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      // Show/hide left arrow
      setShowLeftArrow(scrollLeft > 0);

      // Show/hide right arrow
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check

      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <div className="relative bg-primary px-9 py-6">
      <div className="flex items-center h-full">
        {/* Left Fade Gradient */}
        {showLeftArrow && (
          <div className="absolute left-6 top-0 bottom-0 w-20 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
        )}

        {/* Left Arrow */}
        {showLeftArrow && (
          <IconButton
            variant="outline"
            onClick={scrollLeft}
            aria-label="Scroll left"
            icon="chevron-left"
          />
        )}

        {/* Filters Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide flex-1 px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filters.map(filter => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'primary' : 'secondary'}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Right Fade Gradient */}
        {showRightArrow && (
          <div className="absolute z-10 right-20 top-0 bottom-0 w-20 bg-linear-to-r from-transparent via-white/90 to-white z-10 pointer-events-none" />
        )}

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 ml-2 z-20">
          {/* Chevron Right Button */}
          {showRightArrow && (
            <IconButton
              variant="outline"
              onClick={scrollRight}
              aria-label="Scroll right"
              icon="chevron-right"
            />
          )}

          {/* Settings Button */}
          <IconButton
            variant="outline"
            aria-label="Settings"
            icon="settings-gear"
          />
        </div>
      </div>
    </div>
  );
};

export default HorizontalFilters;
