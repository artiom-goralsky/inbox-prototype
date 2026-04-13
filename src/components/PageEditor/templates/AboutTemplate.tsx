import React from 'react';
import { Link } from '@circleco/compass/components/Link';

const AboutTemplate: React.FC = () => {
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
                className="text-secondary hover:text-link transition-colors"
              >
                Home
              </Link>
              <Link
                href="#"
                className="text-primary hover:text-link transition-colors"
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
              Join now
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6">
              Our journey to helping you grow with community
            </h1>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              We believe that professional growth happens best when you&apos;re
              surrounded by the right people, resources, and support systems.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">
                Clarity coaching elevate your leadership journey
              </h2>
              <p className="text-lg text-secondary mb-8">
                Founded in 2020, we&apos;ve helped thousands of professionals
                unlock their potential through structured coaching programs and
                community support.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-link mb-2">94%</div>
                  <div className="text-sm text-secondary">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-link mb-2">150+</div>
                  <div className="text-sm text-secondary">Coaches</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-link mb-2">12+</div>
                  <div className="text-sm text-secondary">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-link mb-2">30+</div>
                  <div className="text-sm text-secondary">Programs</div>
                </div>
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
                    <p className="text-secondary text-sm">Team Collaboration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">Our Values</h2>
            <p className="text-xl text-secondary">
              The principles that guide everything we do
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Excellence
              </h3>
              <p className="text-secondary">
                We strive for the highest standards in everything we do, from
                our coaching programs to our community support.
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Community
              </h3>
              <p className="text-secondary">
                We believe in the power of community to drive growth and create
                lasting professional relationships.
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
                Growth
              </h3>
              <p className="text-secondary">
                We&apos;re committed to continuous learning and helping our
                members achieve their full potential.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutTemplate;
