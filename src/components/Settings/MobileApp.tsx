import React from 'react';
import ContentContainer from '../ContentContainer';
import { Link } from '@circleco/compass/components/Link';

interface MobileAppProps {
  onToggleSidebar: () => void;
  onBack?: () => void;
}

const MobileApp: React.FC<MobileAppProps> = ({ onToggleSidebar, onBack }) => {
  return (
    <ContentContainer title="Mobile app" onToggleSidebar={onToggleSidebar} breadcrumb="Configure" onBreadcrumbClick={onBack}>
      <div className="overflow-auto">
        <div className="max-w-3xl mx-auto py-6 px-6">
          <div className="space-y-6">
            {/* Boost engagement banner */}
            <div className="bg-inverse rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Boost your engagement by 32%
                  </h3>
                  <button className="bg-primary text-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-active transition-colors">
                    Learn more
                  </button>
                </div>
                <div className="flex space-x-2">
                  <div className="w-16 h-24 bg-inverse-hover rounded-lg flex items-center justify-center">
                    <div className="w-8 h-12 bg-gray-600 rounded"></div>
                  </div>
                  <div className="w-16 h-24 bg-inverse-hover rounded-lg flex items-center justify-center">
                    <div className="w-8 h-12 bg-gray-600 rounded"></div>
                  </div>
                  <div className="w-16 h-24 bg-inverse-hover rounded-lg flex items-center justify-center">
                    <div className="w-8 h-12 bg-gray-600 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary rounded-lg border border-primary p-6">
              <h3 className="text-lg font-medium text-primary mb-6">
                Manage the mobile app experience for your community.
              </h3>

              <div className="space-y-6">
                {/* Allow members to access from Circle's app */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-primary mb-1">
                      Allow my members to access my community from Circle&apos;s
                      iOS and Android app
                    </label>
                    <p className="text-sm text-tertiary">
                      If enabled, your members will be able to sign in to your
                      community via the Circle Communities{' '}
                      <Link href="#">iOS</Link> and{' '}
                      <Link href="#">Android app</Link>.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-inverse transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-primary transition-transform translate-x-6" />
                    </button>
                  </div>
                </div>

                {/* Reorder Home tabs */}
                <div>
                  <h4 className="text-sm font-medium text-primary mb-2">
                    Reorder Home tabs
                  </h4>
                  <p className="text-sm text-tertiary mb-4">
                    Drag and drop to reorder top navigation your members will
                    see in the mobile app.
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border border-primary rounded-lg hover:bg-secondary">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 text-disabled cursor-move">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-primary">
                          Courses
                        </span>
                      </div>
                      <svg
                        className="w-4 h-4 text-disabled"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-primary rounded-lg hover:bg-secondary">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 text-disabled cursor-move">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-primary">
                          Feed
                        </span>
                      </div>
                      <svg
                        className="w-4 h-4 text-disabled"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-primary rounded-lg hover:bg-secondary">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 text-disabled cursor-move">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-primary">
                          Community
                        </span>
                      </div>
                      <svg
                        className="w-4 h-4 text-disabled"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-primary rounded-lg hover:bg-secondary">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 text-disabled cursor-move">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                          </svg>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-primary">
                            Members
                          </span>
                          <span className="bg-active text-secondary px-2 py-1 rounded text-xs">
                            Private
                          </span>
                        </div>
                      </div>
                      <svg
                        className="w-4 h-4 text-disabled"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-primary rounded-lg hover:bg-secondary">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 text-disabled cursor-move">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-primary">
                          Leaderboard
                        </span>
                      </div>
                      <svg
                        className="w-4 h-4 text-disabled"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-primary rounded-lg hover:bg-secondary">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 text-disabled cursor-move">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-primary">
                          Events
                        </span>
                      </div>
                      <svg
                        className="w-4 h-4 text-disabled"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Show app download banner */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-primary mb-1">
                      Show app download banner on mobile browsers and outbound
                      emails
                    </label>
                    <p className="text-sm text-tertiary">
                      If enabled, members will see a banner to download
                      Circle&apos;s <Link href="#">iOS</Link> and{' '}
                      <Link href="#">Android app</Link> for easy access to your
                      community across web browsers and in outbound emails.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-inverse transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-primary transition-transform translate-x-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Save button */}
              <div className="flex justify-end mt-6">
                <button className="bg-inverse text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentContainer>
  );
};

export default MobileApp;
