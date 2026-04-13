import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { mergeClasses } from '../../lib/utils';
import { FilterOption } from './filter-modal';

interface FilterPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOption[];
  onFilterSelect: (filter: FilterOption) => void;
  buttonRef?: HTMLButtonElement | null;
}

const FilterPickerModal: React.FC<FilterPickerModalProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterSelect,
  buttonRef,
}) => {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  // Calculate position based on button ref
  const updatePosition = () => {
    if (buttonRef) {
      const rect = buttonRef.getBoundingClientRect();
      const modalWidth = 256; // w-64 = 256px
      const viewportWidth = window.innerWidth;

      // Position modal starting from the bottom-left corner of the button, extending to the right
      let left = rect.left;

      // Ensure modal doesn't go off the right edge
      if (left + modalWidth > viewportWidth) {
        left = viewportWidth - modalWidth - 8; // Small margin from right edge
      }

      // Ensure modal doesn't go off the left edge
      if (left < 0) {
        left = 8; // Small margin from left edge
      }

      setPosition({
        top: rect.bottom + 8, // bottom edge of button + 8px gap
        left: left,
      });
    }
  };

  useLayoutEffect(() => {
    if (buttonRef && isOpen) {
      updatePosition();
    }
  }, [buttonRef, isOpen]);

  useEffect(() => {
    if (buttonRef && isOpen) {
      // Update position on scroll and resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [buttonRef, isOpen]);

  // Handle content visibility with delay (snappy animation)
  useEffect(() => {
    if (isOpen) {
      // Show content after panel expands (faster animation)
      setTimeout(() => {
        setIsContentVisible(true);
      }, 40);
    } else {
      // Hide content immediately when closing
      setIsContentVisible(false);
    }
  }, [isOpen]);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        buttonRef &&
        !buttonRef.contains(event.target as Node)
      ) {
        // Hide content first, then close modal
        setIsContentVisible(false);
        setTimeout(() => {
          onClose();
        }, 50);
      }
    };

    if (isOpen) {
      // Add small delay before attaching listener to prevent immediate close
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, buttonRef, onClose]);

  if (!buttonRef) return null;

  return (
    <div
      className={mergeClasses(
        'fixed z-[9999] transition-opacity duration-75',
        isOpen && position.top > 0 && position.left > 0
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {/* Panel - expands from top left corner */}
      <div
        ref={modalRef}
        className={mergeClasses(
          'bg-primary border border-primary rounded-xl shadow-xl p-6 w-64 transition-[transform,opacity] duration-75 ease-[cubic-bezier(0.16,1,0.3,1)]',
          isOpen
            ? 'translate-x-0 translate-y-0 opacity-100 scale-100'
            : 'translate-y-[-2px] opacity-0 scale-[0.98]'
        )}
        style={{
          transformOrigin: 'bottom left',
        }}
      >
        {/* Header */}
        <div
          className={mergeClasses(
            'flex items-center justify-between mb-4 transition-opacity duration-75 ease-out',
            isContentVisible ? 'opacity-100' : 'opacity-0'
          )}
        >
          <h3 className="text-lg font-bold text-primary">Add filter</h3>
          <button
            onClick={() => {
              // Hide content first, then close modal for smooth transition
              setIsContentVisible(false);
              setTimeout(() => {
                onClose();
              }, 50);
            }}
            className="text-disabled hover:text-secondary p-2 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter List */}
        <div
          className={mergeClasses(
            'max-h-64 overflow-auto divide-y divide-gray-100 scrollbar-hide-x transition-opacity duration-75 ease-out',
            isContentVisible ? 'opacity-100' : 'opacity-0'
          )}
        >
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => {
                onFilterSelect(f);
              }}
              className="w-full text-left px-2 py-2 text-sm hover:bg-secondary transition-colors"
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPickerModal;
