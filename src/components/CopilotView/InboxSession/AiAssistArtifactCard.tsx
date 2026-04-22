import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Button } from '@circleco/compass/components/Button';
import type { AiAssistArtifact } from '../../InboxPage/aiAssistMockData';

interface AiAssistArtifactCardProps {
  artifact: AiAssistArtifact;
  targetCategory: string;
  referenceMessageId: string;
  recipientName?: string;
}

const AiAssistArtifactCard: React.FC<AiAssistArtifactCardProps> = ({
  artifact,
  targetCategory,
  referenceMessageId,
  recipientName,
}) => {
  const [added, setAdded] = useState(false);

  const handleAddToComposer = () => {
    window.dispatchEvent(new CustomEvent('composer-set-draft', {
      detail: { text: artifact.body },
    }));
    setAdded(true);
  };

  return (
    <div className="bg-secondary border border-[#e4e7eb] rounded-xl shadow-2xs overflow-hidden flex flex-col w-full">
      {/* Header */}
      <div className="bg-secondary flex items-center gap-2 px-4 py-2">
        <Typography variant="label-sm" color="primary" className="flex-1 min-w-0">
          Suggested reply
        </Typography>
        {added ? (
          <Button variant="ghost" size="sm" startIcon="checkmark" disabled>
            Added
          </Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={handleAddToComposer}>
            Add to composer
          </Button>
        )}
      </div>

      {/* Body */}
      <div className="bg-primary border border-[#f0f3f5] rounded-xl px-4 py-3">
        <Typography variant="body-sm" color="primary" className="whitespace-pre-line leading-5">
          {artifact.body}
        </Typography>
      </div>
    </div>
  );
};

export default AiAssistArtifactCard;
