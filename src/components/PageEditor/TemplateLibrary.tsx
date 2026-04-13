import React, { useState } from 'react';
import { templates } from './templates';
import TemplatePreview from './TemplatePreview';

interface TemplateLibraryProps {
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  onClose,
  onSelectTemplate,
}) => {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const handleTemplateHover = (templateId: string) => {
    setHoveredTemplate(templateId);
  };

  const handleTemplateLeave = () => {
    setHoveredTemplate(null);
  };

  const handleTemplateSelect = (templateId: string) => {
    onSelectTemplate(templateId);
  };

  const handleStartFromScratch = () => {
    onSelectTemplate('blank'); // Pass 'blank' as template ID for starting from scratch
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{
        animation: 'fadeIn 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        animationFillMode: 'both',
      }}
    >
      <div
        className="bg-primary rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[95vh] overflow-hidden"
        style={{
          animation: 'zoomIn 200ms cubic-bezier(0.16, 1, 0.3, 1)',
          animationFillMode: 'both',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary">
          <h2 className="text-2xl font-bold text-primary">Template library</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleStartFromScratch}
              className="px-4 py-2 text-sm text-secondary border border-hover rounded-md hover:bg-secondary transition-colors"
            >
              Start from scratch
            </button>
            <button
              onClick={onClose}
              className="p-2 text-disabled hover:text-secondary rounded-md transition-colors"
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
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-primary">All templates</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {templates.map(template => (
              <div
                key={template.id}
                className="relative group cursor-pointer"
                onMouseEnter={() => handleTemplateHover(template.id)}
                onMouseLeave={handleTemplateLeave}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div
                  className={`border-2 rounded-lg overflow-hidden transition-[border-color,box-shadow] duration-300 ${
                    hoveredTemplate === template.id
                      ? 'border-blue-500 shadow-xl hover:bg-active'
                      : 'border-primary'
                  }`}
                >
                  <div className="aspect-4/3 bg-primary relative  hover:bg-active">
                    {/* Template Preview */}
                    <div className="absolute inset-0 bg-primary rounded overflow-hidden">
                      <TemplatePreview templateId={template.id} />
                    </div>
                  </div>
                </div>

                {/* Hover Actions */}
                {hoveredTemplate === template.id && (
                  <div className="absolute w-full h-full flex items-center justify-center rounded-lg">
                    <div className="flex flex-col bg-black bg-opacity-50 space-y-2">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleTemplateSelect(template.id);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Apply
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          // Handle preview
                        }}
                        className="px-4 py-2 bg-primary text-link text-sm rounded-md border border-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                )}

                {/* Template Info */}
                <div className="mt-4 text-center">
                  <div className="text-base font-semibold text-primary">
                    {template.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateLibrary;
