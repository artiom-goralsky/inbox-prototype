import { useState, useEffect, useRef } from 'react';

interface UseScrollHideTabsOptions {
  scrollContainerRef?: React.RefObject<HTMLElement>;
  enabled?: boolean;
  scrollThreshold?: number;
  hideAfterScroll?: number;
}

/**
 * Custom hook that hides/shows tabs based on scroll direction
 * @param options Configuration options
 * @returns Boolean indicating if tabs should be visible
 */
export const useScrollHideTabs = ({
  scrollContainerRef,
  enabled = true,
  scrollThreshold = 10,
  hideAfterScroll = 50,
}: UseScrollHideTabsOptions = {}) => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const scrollTop = scrollContainerRef?.current
        ? scrollContainerRef.current.scrollTop
        : window.scrollY;

      // Only trigger if scroll distance is significant
      if (Math.abs(scrollTop - lastScrollTop.current) < scrollThreshold) {
        return;
      }

      if (scrollTop > lastScrollTop.current && scrollTop > hideAfterScroll) {
        // Scrolling down - hide tabs
        setIsVisible(false);
      } else if (scrollTop < lastScrollTop.current) {
        // Scrolling up - show tabs
        setIsVisible(true);
      }

      lastScrollTop.current = scrollTop;
    };

    const scrollElement = scrollContainerRef?.current || window;
    scrollElement.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [enabled, scrollContainerRef, scrollThreshold, hideAfterScroll]);

  return isVisible;
};

