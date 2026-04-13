import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Button } from '@circleco/compass/components/Button';
import { TextInput } from '@circleco/compass/components/TextInput';
import { X } from 'lucide-react';
import { mergeClasses } from '../../lib/utils';

export interface FilterOption {
  id: string;
  label: string;
  type: 'text' | 'boolean' | 'select';
  options?: string[];
}

export interface FilterCondition {
  field: string;
  operator: string;
  value: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filter: FilterOption;
  onApply: (condition: FilterCondition) => void;
  className?: string;
  buttonRef?: HTMLButtonElement | null;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filter,
  onApply,
  className,
  buttonRef,
}) => {
  const [operator, setOperator] = useState<string>('contains');
  const [value, setValue] = useState<string>('');
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  const textOperators = [
    { value: 'contains', label: 'contains' },
    { value: 'does not contain', label: 'does not contain' },
    { value: 'is', label: 'is' },
    { value: 'is not', label: 'is not' },
  ];

  const booleanOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  // Calculate position based on button ref
  const updatePosition = () => {
    if (buttonRef) {
      const rect = buttonRef.getBoundingClientRect();
      const modalWidth = 320; // w-80 = 320px
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
        top: rect.bottom + 8, // bottom edge of button - 2px (overlap slightly)
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

  const handleApply = () => {
    if (filter.type === 'boolean') {
      onApply({
        field: filter.id,
        operator: 'is',
        value: operator,
      });
    } else if (filter.type === 'select') {
      onApply({
        field: filter.id,
        operator: 'is',
        value: value,
      });
    } else {
      onApply({
        field: filter.id,
        operator,
        value,
      });
    }
    // Hide content first, then close modal for smooth transition
    setIsContentVisible(false);
    setTimeout(() => {
      onClose();
    }, 50);
  };

  if (!buttonRef || !isOpen) return null;

  return (
    <div
      className={mergeClasses(
        'fixed z-[9999] transition-opacity duration-75 rounded-xl border border-primary',
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
          'bg-primary rounded-xl shadow-xl p-4 w-80 max-w-sm transition-[transform,opacity] duration-75 ease-[cubic-bezier(0.16,1,0.3,1)]',
          isOpen
            ? 'translate-x-0 translate-y-0 opacity-100 scale-100'
            : 'translate-y-[-2px] opacity-0 scale-[0.98]',
          className
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
          <h3 className="text-lg font-bold text-primary">{filter.label}</h3>
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

        {/* Filter Options */}
        <div
          className={mergeClasses(
            'space-y-4 transition-opacity duration-75 ease-out',
            isContentVisible ? 'opacity-100' : 'opacity-0'
          )}
        >
          {filter.type === 'boolean' ? (
            // Boolean filter (Yes/No)
            <div className="space-y-3">
              {booleanOptions.map(option => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="boolean-option"
                    value={option.value}
                    checked={operator === option.value}
                    onChange={e => setOperator(e.target.value)}
                    className="w-4 h-4 text-primary border-hover focus:ring-gray-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          ) : filter.type === 'select' ? (
            // Select filter (dropdown options)
            <div className="space-y-3">
              {filter.options?.map(option => (
                <label
                  key={option}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="select-option"
                    value={option}
                    checked={value === option}
                    onChange={e => setValue(e.target.value)}
                    className="w-4 h-4 text-primary border-hover focus:ring-gray-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          ) : (
            // Text filter
            <div className="space-y-2">
              {textOperators.map(op => (
                <label
                  key={op.value}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="text-operator"
                    value={op.value}
                    checked={operator === op.value}
                    onChange={e => setOperator(e.target.value)}
                    className="w-4 h-4 accent-gray-900 text-primary border-hover focus:ring-gray-500"
                  />
                  <span className="text-sm text-gray-700">{op.label}</span>
                </label>
              ))}

              {/* Value input */}
              <div className="mt-3">
                <TextInput
                  placeholder="eg. Designer"
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Apply Button */}
        <div
          className={mergeClasses(
            'mt-3 transition-opacity duration-75 ease-out',
            isContentVisible ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Button
            onClick={handleApply}
            className="w-full bg-[#1A1D24] hover:bg-[#1A1D24]/90 text-white"
          >
            {filter.type === 'boolean' || filter.type === 'select'
              ? 'Apply'
              : 'Done'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
