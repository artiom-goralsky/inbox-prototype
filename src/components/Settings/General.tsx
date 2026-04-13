import React from 'react';
import ContentContainer from '../ContentContainer';
import { Link } from '@circleco/compass/components/Link';
import { TextInput } from '@circleco/compass/components/TextInput';
import { Select } from '@circleco/compass/components/Select';
import { Switch } from '@circleco/compass/components/Switch';
import { Button } from '@circleco/compass/components/Button';

interface GeneralProps {
  onToggleSidebar: () => void;
  onBack?: () => void;
}

const General: React.FC<GeneralProps> = ({ onToggleSidebar, onBack }) => {
  return (
    <ContentContainer title="General" onToggleSidebar={onToggleSidebar} breadcrumb="Configure" onBreadcrumbClick={onBack}>
      <div className="overflow-auto">
        <div className="max-w-3xl mx-auto py-6 px-6">
          <div className="space-y-8">
            {/* Manage general settings */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Community name
                  </label>
                  <p className="text-sm text-tertiary mb-2">
                    Choose a name that personalizes your community
                  </p>
                  <TextInput
                    placeholder="HappyTravels"
                    className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Default language
                  </label>
                  <p className="text-sm text-tertiary mb-2">
                    This will be the default language for new community members.
                  </p>
                  <Select
                    aria-label="Default language"
                    options={[
                      { label: 'English', value: 'en' },
                      { label: 'Spanish', value: 'es' },
                      { label: 'French', value: 'fr' },
                      { label: 'German', value: 'de' },
                    ]}
                    placeholder="Select language"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Community ID
                  </label>
                  <p className="text-sm text-tertiary mb-2">
                    Customer support may ask for your unique community ID when
                    troubleshooting
                  </p>
                  <TextInput
                    placeholder="5"
                    className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Visibility section */}
              <div className="border-t border-primary pt-6">
                <h3 className="text-lg font-medium text-primary mb-4">
                  Visibility
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Community URL
                    </label>
                    <div className="flex items-center space-x-2">
                      <TextInput
                        placeholder="circle.upfront.so"
                        className="flex-1 px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Link href="#">Set up your custom domain here</Link>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-primary">
                        Make this a private community
                      </label>
                      <p className="text-sm text-tertiary">
                        Your community will not be accessible to visitors.
                        Members will have to be invited by you and sign in to
                        access your community.
                      </p>
                    </div>
                    <div className="ml-4">
                      <Switch checked={false} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-primary">
                        Allow visitors to sign up
                      </label>
                      <p className="text-sm text-tertiary">
                        Public communities can choose to disable sign-ups. If
                        you toggle this off, your public spaces will be visible
                        to visitors, but visitors won&apos;t be able to sign up
                        to your community.
                      </p>
                    </div>
                    <div className="ml-4">
                      <Switch checked={false} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-primary">
                        Accessible on Circle&apos;s desktop app
                      </label>
                      <p className="text-sm text-tertiary">
                        If enabled, your community will be accessible to members
                        using Circle&apos;s desktop app.
                      </p>
                    </div>
                    <div className="ml-4">
                      <Switch checked={true} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Branding section */}
            <div className="border-t border-primary pt-8">
              <h3 className="text-lg font-medium text-primary mb-6">
                Branding
              </h3>

              <div className="space-y-6">
                {/* Launch branded app card */}
                <div className="bg-inverse rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium mb-2">
                        Launch your own branded app
                      </h4>
                      <Button variant="secondary" size="sm">
                        Learn more
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-16 h-24 bg-inverse-hover rounded-lg flex items-center justify-center">
                        <div className="w-8 h-12 bg-gray-600 rounded"></div>
                      </div>
                      <div className="w-16 h-24 bg-inverse-hover rounded-lg flex items-center justify-center">
                        <div className="w-8 h-12 bg-gray-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Brand color
                    </label>
                    <p className="text-sm text-tertiary mb-2">
                      Customize your button color to match your brand.
                    </p>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-8 h-8 rounded border border-hover"
                        style={{ backgroundColor: '#2567EB' }}
                      ></div>
                      <TextInput
                        placeholder="#2567EB"
                        className="flex-1 px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Brand color (dark mode)
                    </label>
                    <p className="text-sm text-tertiary mb-2">
                      Customize your button color to match your brand in dark
                      mode.
                    </p>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-8 h-8 rounded border border-hover"
                        style={{ backgroundColor: '#8583FF' }}
                      ></div>
                      <TextInput
                        placeholder="#8583FF"
                        className="flex-1 px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Logo
                    </label>
                    <p className="text-sm text-tertiary mb-2">
                      Recommended dimensions: 240 x 60, 4:1 aspect ratio
                    </p>
                    <div className="w-full h-20 border-2 border-dashed border-hover rounded-lg flex items-center justify-center">
                      <span className="text-tertiary">Circle</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Icon
                    </label>
                    <p className="text-sm text-tertiary mb-2">
                      Recommended dimensions: 32 x 32
                    </p>
                    <div className="w-16 h-16 border-2 border-dashed border-hover rounded-lg flex items-center justify-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        C
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Default Open Graph Image
                  </label>
                  <p className="text-sm text-tertiary mb-2">
                    This image will be used as the default when your community
                    link is shared on social media.
                  </p>
                  <div className="w-full h-32 border-2 border-dashed border-hover rounded-lg flex items-center justify-center bg-secondary">
                    <div className="w-24 h-16 bg-disabled rounded flex items-center justify-center">
                      <span className="text-disabled text-xs">Image</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Reply-to email
                  </label>
                  <p className="text-sm text-tertiary mb-2">
                    When a member tries to reply to a notification email, this
                    is the email they&apos;ll be writing to.
                  </p>
                  <TextInput
                    placeholder="roberto@circle.co"
                    className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Default notifications section */}
            <div className="border-t border-primary pt-8">
              <h3 className="text-lg font-medium text-primary mb-4">
                Default notifications
              </h3>
              <p className="text-sm text-tertiary mb-6">
                Default notifications settings will apply to all new members in
                your Community. Every member will be able to modify these
                individually after they join.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-3">
                    Notify about new community activity
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="notification-method"
                        value="email"
                        defaultChecked
                        className="h-4 w-4 text-link focus:ring-blue-500 border-hover"
                      />
                      <span className="ml-2 text-sm text-primary">Email</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="notification-method"
                        value="in-app"
                        className="h-4 w-4 text-link focus:ring-blue-500 border-hover"
                      />
                      <span className="ml-2 text-sm text-primary">In-app</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentContainer>
  );
};

export default General;
