import React from 'react';

interface StartPostProps {
  className?: string;
}

const StartPost: React.FC<StartPostProps> = ({ className }) => {
  return (
    <div
      className={`flex flex-col gap-3 items-start justify-center relative rounded-2xl shadow-sm w-full ${className}`}
    >
      <div className="bg-primary border border-primary flex flex-col gap-3 items-start justify-center px-6 py-5 relative rounded-2xl w-full">
        <div className="flex gap-4 items-center w-full">
          <div className="relative w-6 h-6" data-name="Avatar">
            <img
              alt=""
              className="w-full h-full rounded-full object-cover"
              src="/images/avatars/1.png"
            />
          </div>
          <p className="flex-1 font-normal leading-6 text-tertiary text-base">
            What&apos;s on your mind?
          </p>
          <div className="bg-primary border border-primary flex items-center justify-center p-2 rounded-lg w-8 h-8">
            <svg
              className="w-4 h-4 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPost;
