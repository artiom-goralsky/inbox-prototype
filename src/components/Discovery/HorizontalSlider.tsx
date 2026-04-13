import React, { useState, useRef, useEffect } from 'react';
import { Typography } from '@circleco/compass/components/Typography';

interface HorizontalSliderProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showSeeAll?: boolean;
}

const HorizontalSlider: React.FC<HorizontalSliderProps> = ({
  children,
  title,
  subtitle,
  showSeeAll = true,
}) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -320,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 320,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();

      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Typography component="h2" variant="heading-lg" color="primary">
            {title}
          </Typography>
          {subtitle && (
            <Typography
              component="p"
              variant="body-sm"
              color="secondary"
              className="mt-1"
            >
              {subtitle}
            </Typography>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Navigation Arrows */}
          {showLeftArrow && (
            <button
              onClick={scrollLeft}
              className="w-8 h-8 bg-primary border border-hover rounded-full flex items-center justify-center shadow-sm hover:bg-secondary transition-colors"
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

          {showRightArrow && (
            <button
              onClick={scrollRight}
              className="w-8 h-8 bg-primary border border-hover rounded-full flex items-center justify-center shadow-sm hover:bg-secondary transition-colors"
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

          {showSeeAll && (
            <button className="text-tertiary hover:text-gray-700 font-medium ml-2">
              See all &gt;
            </button>
          )}
        </div>
      </div>

      {/* Slider Container */}
      <div
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </div>
  );
};

export default HorizontalSlider;
