import React, { useState } from 'react';

interface BrandedAppProps {
  onToggleSidebar: () => void;
}

const BrandedApp: React.FC<BrandedAppProps> = ({
  onToggleSidebar: _onToggleSidebar,
}) => {
  const [activeTab, setActiveTab] = useState('branded-app');

  const testimonials = [
    {
      quote:
        'Circle Plus has been a game-changer for our community. The branded app has significantly increased our member engagement.',
      author: 'Greg Pujak',
      title: 'Co-Founder',
      company: 'Whogga',
      avatar: '/images/avatars/1.png',
      logo: '/images/placeholders/image-1.png',
    },
    {
      quote:
        'The mobile app has transformed how our members interact with our content. Revenue has grown substantially.',
      author: 'Dave Gerhard',
      title: 'Founder',
      company: 'Exit Five',
      avatar: '/images/avatars/2.png',
      logo: '/images/placeholders/image-2.png',
    },
    {
      quote:
        'Circle Plus gave us the tools we needed to scale our community effectively. Highly recommended!',
      author: 'Ricky Rinder',
      title: 'Founder',
      company: 'Income School',
      avatar: '/images/avatars/3.png',
      logo: '/images/placeholders/image-3.png',
    },
  ];

  return (
    <div className="h-full overflow-auto">
      <div className="min-h-screen bg-primary">
        {/* Hero Section */}
        <div className="bg-primary py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h1 className="text-5xl font-bold text-primary leading-tight">
                  Unlock more growth, revenue, and brand power with Circle Plus
                </h1>
                <p className="text-xl text-secondary leading-relaxed">
                  Circle Plus is the advanced plan for launching your own
                  branded app, increasing engagement, and turning your community
                  into a business engine.
                </p>
                <button className="bg-inverse text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors">
                  Upgrade to Circle Plus
                </button>
              </div>
              <div className="relative">
                <div className="relative z-10">
                  <div className="w-80 h-96 bg-active rounded-3xl shadow-2xl transform rotate-3">
                    <div className="w-full h-full bg-linear-to-br from-blue-500 to-purple-600 rounded-3xl p-6">
                      <div className="bg-primary rounded-2xl h-full p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                          <div className="text-sm font-semibold">Live</div>
                        </div>
                        <div className="space-y-3">
                          <div className="h-32 bg-disabled rounded-lg"></div>
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 flex justify-around">
                          <div className="w-6 h-6 bg-gray-400 rounded"></div>
                          <div className="w-6 h-6 bg-gray-400 rounded"></div>
                          <div className="w-6 h-6 bg-gray-400 rounded"></div>
                          <div className="w-6 h-6 bg-gray-400 rounded"></div>
                          <div className="w-6 h-6 bg-gray-400 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -left-8 top-8 w-64 h-80 bg-active rounded-3xl shadow-xl transform -rotate-6">
                  <div className="w-full h-full bg-linear-to-br from-green-500 to-blue-600 rounded-3xl p-4">
                    <div className="bg-primary rounded-lg h-full p-3">
                      <div className="text-xs font-semibold mb-2">
                        Mindful Practices
                      </div>
                      <div className="h-24 bg-disabled rounded-lg mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-4 top-16 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">W</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-secondary py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-primary rounded-2xl p-8 text-center shadow-sm">
                <div className="text-5xl font-bold text-primary mb-4">37%</div>
                <p className="text-secondary text-lg">
                  Have a higher mobile app member engagement rate
                </p>
              </div>
              <div className="bg-primary rounded-2xl p-8 text-center shadow-sm">
                <div className="text-5xl font-bold text-primary mb-4">147%</div>
                <p className="text-secondary text-lg">
                  Membership growth seen by communities over the first 9 months
                </p>
              </div>
              <div className="bg-primary rounded-2xl p-8 text-center shadow-sm">
                <div className="text-5xl font-bold text-primary mb-4">6x</div>
                <p className="text-secondary text-lg">
                  More posts and 2x as many comments from their members
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Video and Learn More Section */}
        <div className="bg-primary py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="w-full h-80 bg-inverse rounded-2xl overflow-hidden">
                  <div className="w-full h-full bg-linear-to-br from-blue-600 to-purple-700 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M8 5v10l8-5-8-5z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold">
                        Earn more with your own Branded app
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-primary">
                  Learn more about Circle Plus
                </h2>
                <p className="text-xl text-secondary leading-relaxed">
                  Circle Plus provides everything you need for faster growth,
                  higher revenue, and standing out with your own community app.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-secondary py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-primary rounded-2xl p-8 shadow-sm"
                >
                  <p className="text-secondary mb-6 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div>
                      <div className="font-semibold text-primary">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-secondary">
                        {testimonial.title}, {testimonial.company}
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-disabled rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-primary py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-primary text-center mb-12">
              What you get with Circle Plus
            </h2>

            <div className="flex justify-center mb-8">
              <div className="bg-active rounded-lg p-1 flex">
                <button
                  onClick={() => setActiveTab('branded-app')}
                  className={`px-6 py-3 rounded-md font-medium transition-colors ${
                    activeTab === 'branded-app'
                      ? 'bg-primary text-primary shadow-sm'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  Branded app
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`px-6 py-3 rounded-md font-medium transition-colors ${
                    activeTab === 'notifications'
                      ? 'bg-primary text-primary shadow-sm'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  In-app notifications
                </button>
                <button
                  onClick={() => setActiveTab('expert')}
                  className={`px-6 py-3 rounded-md font-medium transition-colors ${
                    activeTab === 'expert'
                      ? 'bg-primary text-primary shadow-sm'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  Expert access
                </button>
              </div>
            </div>

            {activeTab === 'branded-app' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-primary">
                    Put your brand in their pocket
                  </h3>
                  <p className="text-xl text-secondary">
                    Boost visibility and credibility with a mobile app
                    that&apos;s 100% yours.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">
                        Set your own colors, logos, and icons
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">
                        Customize screens and navigation
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">
                        Get listed in the App Store and Google Play
                      </span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-80 h-96 bg-active rounded-3xl shadow-2xl mx-auto">
                    <div className="w-full h-full bg-linear-to-br from-blue-500 to-purple-600 rounded-3xl p-6">
                      <div className="bg-primary rounded-2xl h-full p-4">
                        <div className="text-center mb-4">
                          <div className="text-sm font-semibold text-primary">
                            Photography Network
                          </div>
                          <div className="text-xs text-secondary">
                            App of the Day
                          </div>
                          <div className="flex items-center justify-center space-x-1 mt-1">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className="w-3 h-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-secondary ml-1">
                              4.9
                            </span>
                          </div>
                        </div>
                        <div className="h-32 bg-disabled rounded-lg mb-4"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="bg-secondary py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-primary rounded-2xl p-12 shadow-sm">
              <h2 className="text-4xl font-bold text-primary mb-6">
                Get Circle Plus now
              </h2>
              <p className="text-xl text-secondary mb-8 leading-relaxed">
                Join thousands of communities already using Circle Plus to grow
                their revenue, increase engagement, and build stronger
                connections with their members.
              </p>
              <button className="bg-inverse text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors">
                Upgrade to Circle Plus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandedApp;
