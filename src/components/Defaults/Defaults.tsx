import React, { useState } from 'react';
import ContentContainer from '../ContentContainer/ContentContainer';
import Collapse from '../ui/collapse';
import Button from '../Button/Button';
import { Select } from '@circleco/compass/components/Select';

interface DefaultsProps {
  onToggleSidebar: () => void;
  onBack?: () => void;
}

const Defaults: React.FC<DefaultsProps> = ({ onToggleSidebar, onBack }) => {
  const [enableFeed, setEnableFeed] = useState(true);
  const [defaultPageExisting, setDefaultPageExisting] = useState('feed');
  const [defaultPageNew, setDefaultPageNew] = useState('feed');
  const [loggedOutDefault, setLoggedOutDefault] = useState('feed');

  const defaultPageOptions = [
    { label: 'Feed', value: 'feed' },
    { label: 'Spaces', value: 'spaces' },
    { label: 'Members', value: 'members' },
  ];

  const handleSave = () => {
    // Handle save logic here
  };

  return (
    <ContentContainer title="Defaults" onToggleSidebar={onToggleSidebar} breadcrumb="Configure" onBreadcrumbClick={onBack}>
      <div className="overflow-y-auto">
        <div className="max-w-4xl mx-auto py-6 px-6">
          <div className="bg-primary rounded-lg space-y-8">
            <Collapse title="Defaults" defaultOpen={true}>
              <div className="space-y-8">
                {/* Enable Feed section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-primary">
                        Enable Feed
                      </h3>
                      <p className="text-sm text-secondary mt-1">
                        If enabled, members will see a &apos;Feed&apos;
                        navigation option with a personalized feed of all posts
                        that are visible to them.
                      </p>
                    </div>
                    <button
                      onClick={() => setEnableFeed(!enableFeed)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        enableFeed ? 'bg-gray-800' : 'bg-disabled'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-primary transition-transform ${
                          enableFeed ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Logged in defaults */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-primary">
                    Logged in defaults
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default page for existing members
                      </label>
                      <p className="text-sm text-secondary mb-3">
                        When an existing member visits your community, this is
                        the space they&apos;ll be taken to.
                      </p>
                      <Select
                        aria-label="Default page for existing members"
                        value={
                          defaultPageOptions.find(
                            o => o.value === defaultPageExisting
                          ) ?? null
                        }
                        onValueChange={option =>
                          setDefaultPageExisting(option?.value ?? 'feed')
                        }
                        options={defaultPageOptions}
                        placeholder="Select default page"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default page for new members
                      </label>
                      <p className="text-sm text-secondary mb-3">
                        When a new member signs up to your community, this is
                        the page they&apos;ll be taken to for the first time.
                      </p>
                      <Select
                        aria-label="Default page for new members"
                        value={
                          defaultPageOptions.find(
                            o => o.value === defaultPageNew
                          ) ?? null
                        }
                        onValueChange={option =>
                          setDefaultPageNew(option?.value ?? 'feed')
                        }
                        options={defaultPageOptions}
                        placeholder="Select default page"
                      />
                    </div>
                  </div>
                </div>

                {/* Logged out defaults */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-primary">
                    Logged out defaults
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default page for logged out visitors
                      </label>
                      <p className="text-sm text-secondary mb-4">
                        You can set the feed, a space or a custom page for
                        logged out visitors to be taken to. If your community is
                        private and you select the feed or a space, they&apos;ll
                        always be taken to the sign in page.
                      </p>

                      <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="loggedOutDefault"
                            value="feed"
                            checked={loggedOutDefault === 'feed'}
                            onChange={e => setLoggedOutDefault(e.target.value)}
                            className="h-4 w-4 text-link focus:ring-blue-500 border-hover"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-700">
                              Feed
                            </span>
                            <p className="text-sm text-secondary">
                              All visible posts
                            </p>
                          </div>
                        </label>

                        <label className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="loggedOutDefault"
                            value="space"
                            checked={loggedOutDefault === 'space'}
                            onChange={e => setLoggedOutDefault(e.target.value)}
                            className="h-4 w-4 text-link focus:ring-blue-500 border-hover"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-700">
                              Space
                            </span>
                            <p className="text-sm text-secondary">
                              Select specific space to display
                            </p>
                          </div>
                        </label>

                        <label className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="loggedOutDefault"
                            value="page"
                            checked={loggedOutDefault === 'page'}
                            onChange={e => setLoggedOutDefault(e.target.value)}
                            className="h-4 w-4 text-link focus:ring-blue-500 border-hover"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-700">
                              Page
                            </span>
                            <p className="text-sm text-secondary">
                              Select a specific page to display
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save button */}
                <div className="flex justify-end pt-6 border-t border-primary">
                  <Button variant="primary" onClick={handleSave}>
                    Save changes
                  </Button>
                </div>
              </div>
            </Collapse>
          </div>
        </div>
      </div>
    </ContentContainer>
  );
};

export default Defaults;
