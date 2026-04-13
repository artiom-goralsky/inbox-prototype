import React, { useState } from 'react';
import { TextInput } from '@circleco/compass/components/TextInput';
import { Select } from '@circleco/compass/components/Select';
import ContentContainer from '../ContentContainer';
import { Button } from '@circleco/compass/components/Button';

interface Redirect {
  id: string;
  oldUrl: string;
  newUrl: string;
}

interface RedirectsProps {
  onToggleSidebar: () => void;
  onBack?: () => void;
}

const Redirects: React.FC<RedirectsProps> = ({ onToggleSidebar, onBack }) => {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [oldUrl, setOldUrl] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newUrlError, setNewUrlError] = useState('');

  const handleAddRedirect = () => {
    if (!newUrl.trim()) {
      setNewUrlError('Please enter a to URL');
      return;
    }

    if (!oldUrl.trim()) {
      return;
    }

    const newRedirect: Redirect = {
      id: Date.now().toString(),
      oldUrl,
      newUrl,
    };

    setRedirects([...redirects, newRedirect]);
    setOldUrl('');
    setNewUrl('');
    setNewUrlError('');
  };

  const handleNewUrlChange = (value: string) => {
    setNewUrl(value);
    if (value.trim()) {
      setNewUrlError('');
    }
  };

  return (
    <ContentContainer title="Redirects" onToggleSidebar={onToggleSidebar} breadcrumb="Configure" onBreadcrumbClick={onBack}>
      <div className="overflow-y-auto">
        <div className="max-w-4xl mx-auto py-6 px-6">
          <div className="bg-primary rounded-lg space-y-6">
            {/* Create redirect section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-primary">
                  Create redirect
                </h3>
                <p className="text-sm text-secondary">
                  Redirect existing URLs to new ones to maintain search engine
                  ranking.
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {/* Old URL */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Old URL
                  </label>
                  <Select
                    aria-label="Old URL"
                    value={
                      [
                        { label: 'Select a page', value: '' },
                        { label: 'Untitled page', value: 'untitled-page' },
                        { label: 'About', value: 'about' },
                        { label: 'Contact', value: 'contact' },
                        { label: 'Home', value: 'home' },
                      ].find(o => o.value === oldUrl) ?? null
                    }
                    onValueChange={option => setOldUrl(option?.value ?? '')}
                    options={[
                      { label: 'Select a page', value: '' },
                      { label: 'Untitled page', value: 'untitled-page' },
                      { label: 'About', value: 'about' },
                      { label: 'Contact', value: 'contact' },
                      { label: 'Home', value: 'home' },
                    ]}
                    placeholder="Select a page"
                  />
                </div>

                {/* Arrow */}
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-disabled"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>

                {/* New URL */}
                <div className="flex-1">
                  <TextInput
                    label="New URL"
                    value={newUrl}
                    onChange={e => handleNewUrlChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      newUrlError ? 'border-red-300' : 'border-hover'
                    }`}
                    placeholder="Enter new URL"
                  />
                  {newUrlError && (
                    <p className="text-red-500 text-sm mt-1">{newUrlError}</p>
                  )}
                </div>

                {/* Add button */}
                <div className="flex items-end">
                  <Button
                    variant="primary"
                    onClick={handleAddRedirect}
                    disabled={!oldUrl.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Redirects list */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary">
                  {redirects.length} redirects
                </h3>
              </div>

              {redirects.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-tertiary text-sm">No data available</div>
                </div>
              ) : (
                <div className="border border-primary rounded-lg overflow-hidden">
                  <div className="bg-secondary px-4 py-3 border-b border-primary">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="font-medium text-primary">OLD URL</div>
                      <div className="font-medium text-primary">NEW URL</div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {redirects.map(redirect => (
                      <div key={redirect.id} className="px-4 py-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-primary">{redirect.oldUrl}</div>
                          <div className="text-primary">{redirect.newUrl}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ContentContainer>
  );
};

export default Redirects;
