import React, { useState } from 'react';
import { TextInput } from '@circleco/compass/components/TextInput';
import ContentContainer from '../ContentContainer';
import { Button } from '@circleco/compass/components/Button';
import { TextArea } from '@circleco/compass/components/TextArea';

interface SEOProps {
  onToggleSidebar: () => void;
  onBack?: () => void;
}

const SEO: React.FC<SEOProps> = ({ onToggleSidebar, onBack }) => {
  const [isIndexingEnabled, setIsIndexingEnabled] = useState(true);
  const [robotsTxt, setRobotsTxt] = useState('');
  const [googleVerificationId, setGoogleVerificationId] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  return (
    <ContentContainer title="SEO" onToggleSidebar={onToggleSidebar} breadcrumb="Configure" onBreadcrumbClick={onBack}>
      <div className="overflow-y-auto">
        <div className="max-w-3xl mx-auto py-6">
          <div className="bg-primary rounded-lg p-6 space-y-8">
            {/* Indexing Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Indexing</h3>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-primary">
                    Let search engines index your site
                  </label>
                  <p className="text-sm text-secondary">
                    Keep this feature on for your site to appear in search
                    results.
                  </p>
                </div>
                <button
                  onClick={() => setIsIndexingEnabled(!isIndexingEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    isIndexingEnabled ? 'bg-inverse' : 'bg-disabled'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-primary transition-transform ${
                      isIndexingEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">
                  robots.txt
                </label>
                <TextArea
                  onChange={e => setRobotsTxt(e.target.value)}
                  placeholder="User-agent: *
Disallow: /admin/
Disallow: /private/"
                />
              </div>
            </div>

            {/* Google Site Verification Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">
                Google site verification
              </h3>
              <p className="text-sm text-secondary">
                Verify your site via Google Search Console to get access to your
                site&apos;s Google search data, and submit your sitemap for
                indexing.
              </p>
              <div className="space-y-2">
                <TextInput
                  label="Google site verification ID"
                  value={googleVerificationId}
                  onChange={e => setGoogleVerificationId(e.target.value)}
                  className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your Google site verification ID"
                />
              </div>
            </div>

            {/* Global Canonical Tag URL Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">
                Global canonical tag URL
              </h3>
              <p className="text-sm text-secondary">
                Set a global URL for the site&apos;s canonical tag. This tells
                search engines which URL to index, and avoids duplicate content.
              </p>
              <div className="space-y-2">
                <TextInput
                  label="Global canonical URL"
                  value={canonicalUrl}
                  onChange={e => setCanonicalUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-hover rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://example.com"
                />
                <p className="text-xs text-tertiary">
                  URL should match your default domain
                </p>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button variant="primary">Save</Button>
            </div>
          </div>
        </div>
      </div>
    </ContentContainer>
  );
};

export default SEO;
