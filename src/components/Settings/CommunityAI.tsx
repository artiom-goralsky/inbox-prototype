import React from 'react';
import ContentContainer from '../ContentContainer';
import { TextArea } from '@circleco/compass/components/TextArea';
import { Link } from '@circleco/compass/components/Link';
import { Select } from '@circleco/compass/components/Select';

interface CommunityAIProps {
  onToggleSidebar: () => void;
  onBack?: () => void;
}

const CommunityAI: React.FC<CommunityAIProps> = ({ onToggleSidebar, onBack }) => {
  return (
    <ContentContainer title="Community AI" onToggleSidebar={onToggleSidebar} breadcrumb="Configure" onBreadcrumbClick={onBack}>
      <div className="overflow-auto">
        <div className="max-w-3xl mx-auto py-6 px-6">
          <div className="space-y-6">
            {/* AI Summaries */}
            <div className="bg-primary rounded-lg border border-primary p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-primary">
                      AI Summaries
                    </h3>
                    <p className="text-sm text-tertiary">
                      On-demand content summaries your members can generate for
                      posts, comments and spaces.
                    </p>
                    <Link href="#">Learn more</Link>
                  </div>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-inverse transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-primary transition-transform translate-x-6" />
                </button>
              </div>
            </div>

            {/* Content co-pilot */}
            <div className="bg-primary rounded-lg border border-primary p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-primary">
                      Content co-pilot
                    </h3>
                    <p className="text-sm text-tertiary">
                      Content co-pilot is an AI-powered writing companion
                      integrated in our text editor for new posts and lessons.
                      Use our co-pilot to help you overcome writer&apos;s block,
                      edit your content, and supercharge your writing process.
                    </p>
                    <Link href="#">Learn more</Link>
                  </div>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-inverse transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-primary transition-transform translate-x-6" />
                </button>
              </div>
              <div className="mt-4">
                <TextArea
                  onChange={() => {}}
                  placeholder="Describe your community in a few words for better results..."
                />
              </div>
            </div>

            {/* Activity scores */}
            <div className="bg-primary rounded-lg border border-primary p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-primary">
                      Activity scores
                    </h3>
                    <p className="text-sm text-tertiary">
                      An activity score will be generated for each of your
                      members every week. To generate the score, our machine
                      learning model analyzes a member&apos;s activity data over
                      the last 30 days based on factors you define below, and
                      benchmarks it to members across every Circle community.
                      You can access these scores from the member management
                      tab, member filters, workflow filters, or on an individual
                      profile.
                    </p>
                    <Link href="#">Learn more</Link>
                  </div>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-inverse transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-primary transition-transform translate-x-6" />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-inverse rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-primary">Presence</span>
                  <svg
                    className="w-4 h-4 text-disabled"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-inverse rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-primary">Participation</span>
                  <svg
                    className="w-4 h-4 text-disabled"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-inverse rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-primary">Contribution</span>
                  <svg
                    className="w-4 h-4 text-disabled"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-inverse rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-primary">Connection</span>
                  <svg
                    className="w-4 h-4 text-disabled"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Automated transcriptions */}
            <div className="bg-primary rounded-lg border border-primary p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-primary">
                      Automated transcriptions
                    </h3>
                    <p className="text-sm text-tertiary">
                      Use AI to automatically generate transcripts for media you
                      upload in posts and lessons. Transcripts make your media
                      searchable and more accessible.
                    </p>
                    <Link href="#">Learn more</Link>
                  </div>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-disabled transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-primary transition-transform translate-x-1" />
                </button>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-primary mb-2">
                  Language
                </label>
                <Select
                  aria-label="Language"
                  options={[
                    { label: 'English', value: 'en' },
                    { label: 'Spanish', value: 'es' },
                    { label: 'French', value: 'fr' },
                    { label: 'German', value: 'de' },
                  ]}
                  placeholder="Select language"
                />
              </div>
            </div>

            {/* Save button */}
            <div className="flex justify-end">
              <button className="bg-inverse text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </ContentContainer>
  );
};

export default CommunityAI;
