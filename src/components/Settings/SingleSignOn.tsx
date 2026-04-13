import React from 'react';
import { TextInput } from '@circleco/compass/components/TextInput';
import ContentContainer from '../ContentContainer';
import { Link } from '@circleco/compass/components/Link';

interface SingleSignOnProps {
  onToggleSidebar: () => void;
  onBack?: () => void;
}

const SingleSignOn: React.FC<SingleSignOnProps> = ({ onToggleSidebar, onBack }) => {
  return (
    <ContentContainer title="Single sign-on" onToggleSidebar={onToggleSidebar} breadcrumb="Configure" onBreadcrumbClick={onBack}>
      <div className="overflow-auto">
        <div className="max-w-3xl mx-auto py-6 px-6">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-primary mb-2">
                Provide Single Sign-On (SSO) for your community with an OAuth
                provider.
              </h2>
              <Link href="#">Learn more</Link>
            </div>

            {/* Warning banner */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-sm text-yellow-800">
                If you plan to set up a custom domain, please do so before you
                set up your SSO Integration.
              </p>
            </div>

            {/* Enable SSO */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-primary mb-1">
                  Enable SSO
                </label>
                <p className="text-sm text-tertiary">
                  You can disable this at any time.
                </p>
              </div>
              <div className="ml-4">
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-inverse transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-primary transition-transform translate-x-6" />
                </button>
              </div>
            </div>

            {/* Enable state param */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-primary mb-1">
                  Enable state param
                </label>
                <p className="text-sm text-tertiary">
                  Increases security by storing state in the session, adding to
                  the authorization_url and verifying OAuth provider sends
                  correct state param back in the callback.
                </p>
              </div>
              <div className="ml-4">
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-inverse transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-primary transition-transform translate-x-6" />
                </button>
              </div>
            </div>

            {/* Allow members with Circle account */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-primary mb-1">
                  Allow members with a Circle account to sign in
                </label>
                <p className="text-sm text-tertiary">
                  If enabled, we&apos;ll still allow members with a Circle
                  account to sign in. Only members with your SSO account will be
                  able to sign in otherwise.
                </p>
              </div>
              <div className="ml-4">
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-inverse transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-primary transition-transform translate-x-6" />
                </button>
              </div>
            </div>

            {/* Allow members to sign up via custom URL */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-primary mb-1">
                  Allow members to sign up via a custom URL
                </label>
                <p className="text-sm text-tertiary">
                  After enabling SSO, members won&apos;t be able to sign up via
                  Circle. However, you can keep the Sign up button visible and
                  point it to a custom sign up URL.
                </p>
              </div>
              <div className="ml-4">
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-inverse transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-primary transition-transform translate-x-6" />
                </button>
              </div>
            </div>

            {/* Skip profile confirmation step */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-primary mb-1">
                  Skip profile confirmation step
                </label>
                <p className="text-sm text-tertiary">
                  If enabled, members with a preset name will not need to
                  confirm their profile information when they sign in via SSO
                  for the first time.
                </p>
              </div>
              <div className="ml-4">
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-inverse transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-primary transition-transform translate-x-6" />
                </button>
              </div>
            </div>

            {/* OAuth Provider section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-primary">
                OAuth Provider
              </h3>

              {/* Callback URL */}
              <div>
                <TextInput
                  label="Callback URL"
                  placeholder="https://circle.upfront.so/oauth/callback"
                  className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly
                />
              </div>

              {/* Provider Name */}
              <div>
                <p className="text-sm text-tertiary mb-2">
                  We&apos;ll use this name as the suffix of the Continue button.
                  For example, type &quot;Facebook&quot; if you want the button
                  to say &quot;Continue with Facebook&quot;.
                </p>
                <TextInput
                  label="Provider Name"
                  placeholder="Enter provider name..."
                  className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <h4 className="text-md font-medium text-primary">SSO tools</h4>

              {/* Client ID */}
              <div>
                <p className="text-sm text-tertiary mb-2">
                  The Client ID given to you by the OAuth provider.
                </p>
                <TextInput
                  label="Client ID"
                  placeholder="806be841-65db-49db-9898-d4f4743577a"
                  className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Secret Key */}
              <div>
                <p className="text-sm text-tertiary mb-2">
                  The Secret Key given to you by the OAuth provider.
                </p>
                <TextInput
                  label="Secret Key"
                  placeholder="925JVBV2BFG2F3356585BLLPHNCBTWI"
                  className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Scope */}
              <div>
                <p className="text-sm text-tertiary mb-2">
                  The scope given to you by the OAuth provider. We&apos;ll need
                  access to the user name and email.
                </p>
                <TextInput
                  label="Scope"
                  placeholder="Enter value..."
                  className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Authorization URL */}
              <div>
                <p className="text-sm text-tertiary mb-2">
                  The Authorization URL given to you by the OAuth provider.
                </p>
                <TextInput
                  label="Authorization URL"
                  placeholder="https://ldp.sso.tools/shailesh/oauth2/authorize"
                  className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Token Fetch URL */}
              <div>
                <p className="text-sm text-tertiary mb-2">
                  The Token Fetch URL given to you by the OAuth provider.
                </p>
                <TextInput
                  label="Token Fetch URL"
                  placeholder="https://ldp.sso.tools/shailesh/oauth2/token"
                  className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Profile info API URL */}
              <div>
                <p className="text-sm text-tertiary mb-2">
                  An API URL for Circle to fetch user profile information such
                  as email, name, and profile picture after authentication (e.g.
                  https://my-oauth.com/api/v1/me).
                </p>
                <TextInput
                  label="Profile info API URL"
                  placeholder="https://ldp.sso.tools/shailesh/api/users/me"
                  className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* User response paths */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-primary">
                User response paths
              </h3>

              {/* User ID response path */}
              <div>
                <p className="text-sm text-tertiary mb-2">
                  Example:{' '}
                  <code className="bg-active px-1 rounded">user_id</code>
                </p>
                <TextInput
                  label="User ID response path"
                  placeholder="openid"
                  className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* User Email response path */}
              <div>
                <p className="text-sm text-tertiary mb-2">
                  Example:{' '}
                  <code className="bg-active px-1 rounded">user_email</code>
                </p>
                <TextInput
                  label="User Email response path"
                  placeholder="email"
                  className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* User Name response path */}
              <div>
                <p className="text-sm text-tertiary mb-2">
                  Example:{' '}
                  <code className="bg-active px-1 rounded">user_name</code>
                </p>
                <TextInput
                  label="User Name response path"
                  placeholder="profile"
                  className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Profile Image URL response path */}
              <div>
                <p className="text-sm text-tertiary mb-2">
                  Example:{' '}
                  <code className="bg-active px-1 rounded">
                    user_avatar_url
                  </code>
                </p>
                <TextInput
                  label="Profile Image URL response path"
                  placeholder="Enter response path..."
                  className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Save button */}
            <div className="flex justify-end">
              <button className="bg-inverse text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </ContentContainer>
  );
};

export default SingleSignOn;
