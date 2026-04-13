import React from 'react';

interface Filter {
  id: string;
  label: string;
}

interface FiltersProps {
  filters: Filter[];
}

const Filters: React.FC<FiltersProps> = ({ filters }) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 text-[#191B1F]">
        {filters.map(filter => (
          <button
            key={filter.id}
            className="flex items-center gap-2 px-3 py-2 bg-active rounded-lg text-sm text-gray-700 hover:bg-disabled transition-colors"
          >
            <span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.9999 1.8999C8.33127 1.8999 8.5999 2.16853 8.5999 2.4999V7.3999H13.4999C13.8313 7.3999 14.0999 7.66853 14.0999 7.9999C14.0999 8.33127 13.8313 8.5999 13.4999 8.5999H8.5999V13.4999C8.5999 13.8313 8.33127 14.0999 7.9999 14.0999C7.66853 14.0999 7.3999 13.8313 7.3999 13.4999V8.5999H2.4999C2.16853 8.5999 1.8999 8.33127 1.8999 7.9999C1.8999 7.66853 2.16853 7.3999 2.4999 7.3999H7.3999V2.4999C7.3999 2.16853 7.66853 1.8999 7.9999 1.8999Z"
                  fill="#191B1F"
                />
              </svg>
            </span>
            <span>{filter.label}</span>
          </button>
        ))}
        <button className="flex items-center gap-2 px-3 py-2 bg-active rounded-lg text-sm text-gray-700 hover:bg-disabled transition-colors">
          <span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.9999 1.8999C8.33127 1.8999 8.5999 2.16853 8.5999 2.4999V7.3999H13.4999C13.8313 7.3999 14.0999 7.66853 14.0999 7.9999C14.0999 8.33127 13.8313 8.5999 13.4999 8.5999H8.5999V13.4999C8.5999 13.8313 8.33127 14.0999 7.9999 14.0999C7.66853 14.0999 7.3999 13.8313 7.3999 13.4999V8.5999H2.4999C2.16853 8.5999 1.8999 8.33127 1.8999 7.9999C1.8999 7.66853 2.16853 7.3999 2.4999 7.3999H7.3999V2.4999C7.3999 2.16853 7.66853 1.8999 7.9999 1.8999Z"
                fill="#191B1F"
              />
            </svg>
          </span>
          <span>Add filter</span>
        </button>
      </div>
    </div>
  );
};

export default Filters;
