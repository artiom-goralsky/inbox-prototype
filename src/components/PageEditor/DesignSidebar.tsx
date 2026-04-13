import React from 'react';

interface DesignSidebarProps {
  onClose: () => void;
}

const DesignSidebar: React.FC<DesignSidebarProps> = ({ onClose }) => {
  return (
    <div className="absolute left-[52px] top-0 bg-primary rounded-lg shadow-xl w-96 h-full z-50 animate-slideInFromLeft">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary">
          <h2 className="text-2xl font-bold text-primary">Design</h2>
          <button
            onClick={onClose}
            className="p-2 text-disabled hover:text-secondary hover:bg-active rounded-md transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Brand Section */}
          <div>
            <h3 className="text-lg font-medium text-primary mb-4">Brand</h3>
            <div className="bg-primary border border-primary rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">e</span>
                </div>
                <span className="text-lg font-medium text-primary">
                  ElevateAcademy
                </span>
              </div>
              <button className="flex items-center space-x-2 text-sm text-secondary hover:text-gray-800 transition-colors">
                <span>Manage brand</span>
                <svg
                  className="w-4 h-4"
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
            </div>
          </div>

          {/* Themes Section */}
          <div>
            <h3 className="text-lg font-medium text-primary mb-4">Themes</h3>
            <div className="bg-primary border border-primary rounded-lg p-4">
              <h4 className="font-semibold text-primary mb-2">Site theme</h4>
              <p className="text-sm text-secondary mb-4">
                This is your paragraph
              </p>

              {/* Color Swatches */}
              <div className="flex space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary border border-hover rounded cursor-pointer"></div>
                <div className="w-8 h-8 bg-active border border-hover rounded cursor-pointer"></div>
                <div className="w-8 h-8 bg-gray-300 border border-hover rounded cursor-pointer"></div>
                <div className="w-8 h-8 bg-gray-600 border border-hover rounded cursor-pointer"></div>
                <div className="w-8 h-8 bg-black border border-hover rounded cursor-pointer"></div>
                <div className="w-8 h-8 bg-green-600 border-2 border-gray-800 rounded cursor-pointer"></div>
              </div>

              <button className="flex items-center space-x-2 text-sm text-secondary hover:text-gray-800 transition-colors">
                <span>Change theme</span>
                <svg
                  className="w-4 h-4"
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
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="p-6 border-t border-primary">
          <div className="flex space-x-3">
            <button className="flex-1 px-4 py-2 text-sm font-medium text-black bg-primary border border-hover rounded-md hover:bg-secondary transition-colors">
              Discard
            </button>
            <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-inverse transition-colors">
              Update site theme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSidebar;
