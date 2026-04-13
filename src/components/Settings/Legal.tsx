import React from 'react';
import { TextInput } from '@circleco/compass/components/TextInput';
import { Switch } from '@circleco/compass/components/Switch';
import { Button } from '@circleco/compass/components/Button';
import ContentContainer from '../ContentContainer';
import { TextArea } from '@circleco/compass/components/TextArea';

interface LegalProps {
  onToggleSidebar: () => void;
  onBack?: () => void;
}

const Legal: React.FC<LegalProps> = ({ onToggleSidebar, onBack }) => {
  return (
    <ContentContainer title="Legal" onToggleSidebar={onToggleSidebar} breadcrumb="Configure" onBreadcrumbClick={onBack}>
      <div className="overflow-auto">
        <div className="max-w-3xl mx-auto py-6 px-6">
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-primary">
              Manage your community legal notices
            </h2>

            {/* Legal email */}
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Legal email
              </label>
              <p className="text-sm text-tertiary mb-2">
                This email address will be shown in your terms of service and
                privacy policy.
              </p>
              <TextInput
                placeholder="rohit@circle.co"
                className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Legal address */}
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Legal address
              </label>
              <p className="text-sm text-tertiary mb-2">
                This address will be shown in your terms of service and privacy
                policy.
              </p>
              <TextInput
                placeholder="Pune, India"
                className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Terms of service */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-primary">
                  Terms of service
                </label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Copy URL
                  </Button>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
              <p className="text-sm text-tertiary">
                New members will have to agree to these terms to be able to sign
                up to your community.
              </p>

              {/* Additional terms toggle */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-primary mb-1">
                    Add additional terms to the terms of service
                  </label>
                  <p className="text-sm text-tertiary">
                    Your custom terms will be displayed at the bottom as Exhibit
                    A.
                  </p>
                </div>
                <div className="ml-4">
                  <Switch checked={true} />
                </div>
              </div>

              {/* Additional terms text area */}
              <div>
                <TextArea
                  onChange={() => {}}
                  placeholder="Enter your additional terms..."
                />
              </div>
            </div>

            {/* Privacy policy */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-primary">
                  Privacy policy
                </label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Copy URL
                  </Button>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
              <p className="text-sm text-tertiary">
                New members will have to agree to this privacy notice to be able
                to sign up to your community.
              </p>

              {/* Privacy policy options */}
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="privacy-policy"
                    value="template"
                    defaultChecked
                    className="h-4 w-4 text-link focus:ring-blue-500 border-hover"
                  />
                  <span className="ml-2 text-sm text-primary">
                    Use Circle&apos;s privacy policy template
                    <svg
                      className="inline w-4 h-4 ml-1 text-disabled"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="privacy-policy"
                    value="custom"
                    className="h-4 w-4 text-link focus:ring-blue-500 border-hover"
                  />
                  <span className="ml-2 text-sm text-primary">
                    Create your own privacy policy (Recommended)
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="privacy-policy"
                    value="link"
                    className="h-4 w-4 text-link focus:ring-blue-500 border-hover"
                  />
                  <span className="ml-2 text-sm text-primary">
                    Please provide a link to your own privacy policy page
                  </span>
                </label>
              </div>
            </div>

            {/* Save button */}
            <div className="flex justify-end">
              <Button variant="primary" size="md">
                Save changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ContentContainer>
  );
};

export default Legal;
