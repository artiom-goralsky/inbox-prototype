import React, { useState } from 'react';
import ContentContainer from '../ContentContainer/ContentContainer';
import Collapse from '../ui/collapse';
import Button from '../Button/Button';
import { TextArea } from '@circleco/compass/components/TextArea';

interface CodeSnippetsProps {
  onToggleSidebar: () => void;
  onBack?: () => void;
}

const CodeSnippets: React.FC<CodeSnippetsProps> = ({ onToggleSidebar, onBack }) => {
  const [headSnippets, setHeadSnippets] = useState(`<style>
@media (max-width: 768px) {
  .view-homepage #standard-layout-v2-cover-image-container img {
    object-fit: contain;
  }
}
</style>`);
  const [javascriptSnippets, setJavascriptSnippets] = useState(
    'Insert your code here...'
  );

  const handleSave = () => {
    // Handle save logic here
  };

  return (
    <ContentContainer title="Code Snippets" onToggleSidebar={onToggleSidebar} breadcrumb="Configure" onBreadcrumbClick={onBack}>
      <div className="overflow-y-auto">
        <div className="max-w-4xl mx-auto py-6 px-6">
          <div className="bg-primary rounded-lg space-y-6">
            <Collapse title="Code Snippets" defaultOpen={true}>
              <div className="space-y-6">
                {/* Warning Box */}
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-orange-700">
                        <strong>Warning!</strong> We recommend restricting code
                        snippets to lightweight CSS customizations, custom meta
                        tags, and analytics tracking snippets. Unfortunately, we
                        do not offer customer support for customizations of any
                        kind, and we don&apos;t recommend making advanced
                        customizations. Any errors in your code snippets or
                        updates we make to our HTML/CSS markup may result in
                        your community being non-functional. Please tread with
                        caution!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Head Code Snippets Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      Head code snippets
                    </h3>
                    <p className="text-sm text-secondary mt-1">
                      This snippet will be added right before the{' '}
                      <code className="bg-active px-1 py-[2px] rounded text-xs">
                        &lt;/head&gt;
                      </code>{' '}
                      closing tag. Ideal for custom CSS and meta tags.
                    </p>
                  </div>

                  <div>
                    <TextArea
                      onChange={e => setHeadSnippets(e.target.value)}
                      placeholder="Enter your head code snippets here..."
                    />
                  </div>
                </div>

                {/* JavaScript Code Snippets Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      JavaScript code snippets
                    </h3>
                    <p className="text-sm text-secondary mt-1">
                      This JavaScript snippet will be executed inside a safe{' '}
                      <code className="bg-active px-1 py-[2px] rounded text-xs">
                        &lt;script&gt;
                      </code>{' '}
                      block. Ideal for custom analytics tracking snippets.
                      Please ensure you exclude the{' '}
                      <code className="bg-active px-1 py-[2px] rounded text-xs">
                        &lt;script&gt;
                      </code>{' '}
                      wrapper.
                    </p>
                  </div>

                  <div>
                    <TextArea
                      onChange={e => setJavascriptSnippets(e.target.value)}
                      placeholder="Enter your JavaScript code snippets here..."
                    />
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

export default CodeSnippets;
