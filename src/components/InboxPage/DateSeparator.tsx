import React from 'react';
import { getDateSeparatorText } from '../../utils/dateFormatter';

interface DateSeparatorProps {
  date: Date | string;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  const dateText = getDateSeparatorText(date);

  return (
    <div className="flex items-center justify-center my-6">
      <div className="flex items-center w-full">
        {/* Left line */}
        <div className="flex-1 h-px bg-gray-300"></div>

        {/* Date text */}
        <div className="px-4">
          <span className="text-sm font-medium text-secondary uppercase">
            {dateText}
          </span>
        </div>

        {/* Right line */}
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>
    </div>
  );
};

export default DateSeparator;
