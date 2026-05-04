import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Button } from '@circleco/compass/components/Button';
import { Badge } from '@circleco/compass/components/Badge';
import { Icon } from '@circleco/compass/components/Icon';
import type { CommunityContext, ThreadArtifact } from './launchProjectData';

/* ── Instructions modal ──────────────────────────────────────────── */

const InstructionsModal: React.FC<{
  open: boolean;
  value: string;
  onClose: () => void;
  onSave: (value: string) => void;
}> = ({ open, value, onClose, onSave }) => {
  const [draft, setDraft] = useState(value);
  React.useEffect(() => { if (open) setDraft(value); }, [open, value]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-primary rounded-2xl shadow-2xl w-full max-w-[560px] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-secondary">
          <Typography variant="label-lg" color="primary"><span className="font-semibold">Edit instructions</span></Typography>
          <IconButton variant="ghost" size="sm" icon="cross" aria-label="Close" onClick={onClose} />
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <Typography variant="body-sm" color="secondary">
            Instructions tell Circle AI how to behave in this project — its tone, focus areas, and constraints.
          </Typography>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            rows={6}
            className="w-full rounded-xl border border-tertiary px-4 py-3 text-sm text-primary placeholder:text-disabled resize-none focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
          />
        </div>
        <div className="flex items-center justify-end gap-2 px-6 pb-5">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={() => { onSave(draft); onClose(); }}>Save</Button>
        </div>
      </div>
    </div>
  );
};

/* ── Component ───────────────────────────────────────────────────── */

interface LaunchProjectRightPanelProps {
  instructions: string;
  onInstructionsChange: (instructions: string) => void;
  files: { id: string; name: string; size: string }[];
  artifacts: ThreadArtifact[];
  communityContext: CommunityContext;
}

const LaunchProjectRightPanel: React.FC<LaunchProjectRightPanelProps> = ({
  instructions,
  onInstructionsChange,
  files,
  artifacts,
  communityContext,
}) => {
  const [instructionsModalOpen, setInstructionsModalOpen] = useState(false);

  // Build memory note text from community context
  const memoryLines = [
    `Community type: ${communityContext.typeLabel}`,
    ...communityContext.answers
      .filter(qa => qa.answer !== 'N/A')
      .map(qa => {
        const label = qa.question.includes('audience') ? 'Audience'
          : qa.question.includes('charge') ? 'Monetization'
          : 'Priority';
        return `${label}: ${qa.answer}`;
      }),
  ];

  return (
    <aside className="w-[470px] shrink-0 border-l border-secondary flex flex-col gap-4 p-4 overflow-y-auto">

      {/* Instructions card — simple text + edit modal */}
      <div className="rounded-2xl border border-secondary bg-primary p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <Typography variant="label-md" color="primary">
            <span className="font-semibold">Instructions</span>
          </Typography>
          <IconButton
            variant="ghost"
            size="sm"
            icon="pencil"
            aria-label="Edit instructions"
            onClick={() => setInstructionsModalOpen(true)}
          />
        </div>
        <Typography variant="body-sm" color={instructions ? 'tertiary' : 'disabled'}>
          {instructions || 'No instructions yet. Click edit to add guidance for Circle AI.'}
        </Typography>
      </div>

      {/* Files card */}
      <div className="rounded-2xl border border-secondary bg-primary p-5 flex flex-col gap-3">
        <Typography variant="label-md" color="primary">
          <span className="font-semibold">Files</span>
        </Typography>
        {files.length > 0 && (
          <div className="flex flex-col gap-1">
            {files.map(file => (
              <div key={file.id} className="flex items-center gap-3 px-2 py-2 rounded-lg">
                <Icon name="file" size="sm" className="text-tertiary shrink-0" />
                <Typography variant="body-sm" color="primary" className="flex-1 min-w-0 truncate">{file.name}</Typography>
                <Typography variant="caption" color="tertiary" className="shrink-0">{file.size}</Typography>
                <IconButton variant="ghost" size="sm" icon="cross" aria-label="Remove" />
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          className="w-full rounded-lg border border-dashed border-secondary px-4 py-3 text-sm text-tertiary hover:bg-hover transition-colors text-center"
        >
          + Upload file
        </button>
        <Typography variant="caption" color="tertiary">
          Brand guides, existing content, surveys — anything that helps the AI understand your community.
        </Typography>
      </div>

      {/* Artifacts card */}
      <div className="rounded-2xl border border-secondary bg-primary p-5 flex flex-col gap-3">
        <Typography variant="label-md" color="primary">
          <span className="font-semibold">Artifacts</span>
        </Typography>
        {artifacts.length > 0 ? (
          <div className="flex flex-col gap-1">
            {artifacts.map(artifact => (
              <div key={artifact.id} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-hover transition-colors cursor-pointer">
                <Icon name="file" size="sm" className="text-primary shrink-0" />
                <Typography variant="body-sm" color="primary" className="flex-1 min-w-0 truncate">{artifact.title}</Typography>
                {artifact.sourceStepNumber && (
                  <Badge label={`Step ${artifact.sourceStepNumber}`} variant="secondary" className="shrink-0" />
                )}
                <Badge
                  label={artifact.status === 'draft' ? 'Draft' : 'Applied'}
                  variant={artifact.status === 'draft' ? 'warning' : 'success'}
                  className="shrink-0"
                />
              </div>
            ))}
          </div>
        ) : (
          <Typography variant="body-sm" color="tertiary">
            Artifacts will appear here as you work through steps.
          </Typography>
        )}
      </div>

      {/* Memory note — read-only community context from onboarding */}
      <div className="rounded-2xl border border-secondary bg-hover p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Icon name="sparkle" size="sm" className="text-tertiary shrink-0" />
          <Typography variant="label-md" color="primary">
            <span className="font-semibold">Memory</span>
          </Typography>
        </div>
        <Typography variant="body-sm" color="secondary">
          {memoryLines.join(' · ')}
        </Typography>
        <Typography variant="caption" color="tertiary">
          Saved from onboarding. Ask Circle AI to update this context.
        </Typography>
      </div>

      <InstructionsModal
        open={instructionsModalOpen}
        value={instructions}
        onClose={() => setInstructionsModalOpen(false)}
        onSave={onInstructionsChange}
      />
    </aside>
  );
};

export default LaunchProjectRightPanel;
