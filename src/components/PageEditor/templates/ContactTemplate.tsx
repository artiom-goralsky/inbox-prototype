import React from 'react';
import { TextArea } from '@circleco/compass/components/TextArea';
import { Link } from '@circleco/compass/components/Link';
import { TextInput } from '@circleco/compass/components/TextInput';

const ContactTemplate: React.FC = () => {
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
                className="text-primary hover:text-link transition-colors"
              >
                Contact
              </Link>
            </nav>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Join now
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">Get in touch</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Ready to start your journey? We&apos;re here to help you take the
            next step in your professional development.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-8">
                Let&apos;s start a conversation
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-link"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-primary">
                      Address
                    </h3>
                    <p className="text-secondary">
                      123 Business Street
                      <br />
                      San Francisco, CA 94105
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-link"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-primary">
                      Phone
                    </h3>
                    <p className="text-secondary">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-link"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-primary">
                      Email
                    </h3>
                    <p className="text-secondary">hello@clarity.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-secondary rounded-lg p-8">
              <h3 className="text-2xl font-bold text-primary mb-6">
                Send us a message
              </h3>

              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    label="First Name"
                    placeholder="John"
                    className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <TextInput
                    label="Last Name"
                    placeholder="Doe"
                    className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <TextInput
                  label="Email"
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <TextInput
                  label="Subject"
                  placeholder="How can we help?"
                  className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <TextArea
                    onChange={() => {}}
                    placeholder="Tell us about your goals and how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="bg-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Success stories of real clients
            </h2>
            <p className="text-xl text-secondary">
              See how we&apos;ve helped professionals achieve their goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-primary rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-disabled rounded-full flex items-center justify-center">
                  <span className="text-secondary font-semibold">JD</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-primary">John Doe</h4>
                  <p className="text-sm text-secondary">Marketing Director</p>
                </div>
              </div>
              <p className="text-secondary">
                &quot;The coaching program transformed my leadership approach
                and helped me build a stronger team.&quot;
              </p>
            </div>

            <div className="bg-primary rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-disabled rounded-full flex items-center justify-center">
                  <span className="text-secondary font-semibold">AS</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-primary">Alice Smith</h4>
                  <p className="text-sm text-secondary">Product Manager</p>
                </div>
              </div>
              <p className="text-secondary">
                &quot;I gained the confidence and skills needed to advance to a
                senior role within 6 months.&quot;
              </p>
            </div>

            <div className="bg-primary rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-disabled rounded-full flex items-center justify-center">
                  <span className="text-secondary font-semibold">MJ</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-primary">Mike Johnson</h4>
                  <p className="text-sm text-secondary">Sales Manager</p>
                </div>
              </div>
              <p className="text-secondary">
                &quot;The community support and expert guidance made all the
                difference in my career growth.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactTemplate;
