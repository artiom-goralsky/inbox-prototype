import React from 'react';

// Template component that matches the design from the image
const GrowthNetworkTemplate: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <div className="bg-blue-600 py-20 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex-1 max-w-2xl">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Lead, learn, and grow — together
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Build meaningful connections inside a trusted professional
              network. Advance your career with expert support, exclusive
              resources, and opportunities to collaborate with like-minded
              professionals.
            </p>
            <div className="flex space-x-4">
              <button className="px-8 py-4 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors">
                Book a free session
              </button>
              <button className="px-8 py-4 bg-primary text-link rounded-lg font-semibold hover:bg-secondary transition-colors">
                Join the community
              </button>
            </div>
          </div>
          <div className="flex-1 max-w-md ml-12">
            <div className="relative">
              <div className="w-full h-96 bg-disabled rounded-lg overflow-hidden">
                <div className="w-full h-full bg-linear-to-br from-green-100 to-blue-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-tertiary"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <p className="text-secondary text-sm">
                      Professional woman with glasses
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Section */}
      <div className="py-20 px-8 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary mb-6">
            Build with structure. Grow with community.
          </h2>
          <p className="text-xl text-secondary leading-relaxed">
            Advance your program with expert support, exclusive resources, and
            opportunities to collaborate with like-minded professionals who
            share your vision for growth and success.
          </p>
        </div>
      </div>
    </div>
  );
};

// Blank template for starting from scratch
const BlankTemplate: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-disabled rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-disabled"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-primary mb-2">
          Start building your page
        </h3>
        <p className="text-tertiary">
          Add elements from the left toolbar to create your page
        </p>
      </div>
    </div>
  );
};

// Template registry
export const getTemplateComponent = (templateId: string) => {
  const templates: { [key: string]: React.ComponentType } = {
    blank: BlankTemplate,
    homepage: GrowthNetworkTemplate,
    sales: GrowthNetworkTemplate,
    about: GrowthNetworkTemplate,
    pricing: GrowthNetworkTemplate,
    testimonials: GrowthNetworkTemplate,
    contact: GrowthNetworkTemplate,
    'blog-listing': GrowthNetworkTemplate,
    blog: GrowthNetworkTemplate,
    'growth-network': GrowthNetworkTemplate,
    default: GrowthNetworkTemplate,
  };

  return templates[templateId] || templates['default'];
};
