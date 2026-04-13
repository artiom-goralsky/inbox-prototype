import React from 'react';
import { Link } from '@circleco/compass/components/Link';

const HomepageTemplate: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-primary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
              </div>
              <span className="ml-2 text-xl font-bold text-primary">
                Clarity
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="#"
                className="text-primary hover:text-link transition-colors"
              >
                Home
              </Link>
              <Link
                href="#"
                className="text-secondary hover:text-link transition-colors"
              >
                About
              </Link>
              <Link
                href="#"
                className="text-secondary hover:text-link transition-colors"
              >
                Courses
              </Link>
              <Link
                href="#"
                className="text-secondary hover:text-link transition-colors"
              >
                Services
              </Link>
              <Link
                href="#"
                className="text-secondary hover:text-link transition-colors"
              >
                Membership
              </Link>
            </nav>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Enroll now
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Lead, learn, and grow — together
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Build meaningful connections inside a trusted professional
                network. Get the support you need to advance your career and
                achieve your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-primary text-link px-6 py-3 rounded-md font-semibold hover:bg-active transition-colors">
                  Book a free session
                </button>
                <button className="border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-primary hover:text-link transition-colors">
                  Join the community
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-primary rounded-lg p-8 shadow-xl">
                <div className="w-full h-64 bg-disabled rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-link"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-secondary text-sm">
                      Professional Network
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
              Build with structure. Grow with community.
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Advance your program with expert support, peer learning, and a
              network of professionals who understand your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-link"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Expert Coaching
              </h3>
              <p className="text-secondary">
                Get personalized guidance from industry experts who understand
                your challenges.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Peer Learning
              </h3>
              <p className="text-secondary">
                Connect with like-minded professionals and learn from each
                other&apos;s experiences.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Accelerated Growth
              </h3>
              <p className="text-secondary">
                Achieve your goals faster with structured programs and proven
                methodologies.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomepageTemplate;
