import React from 'react';
import { Button } from '@circleco/compass/components/Button';
import type { ScenarioPill } from './inboxScenarioData';

const VARIANT_MAP = {
  recommended: 'outline',
  default: 'outline',
  muted: 'outline',
} as const;

interface InboxPillsProps {
  pills: ScenarioPill[];
  onPillClick: (pill: ScenarioPill) => void;
}

const InboxPills: React.FC<InboxPillsProps> = ({ pills, onPillClick }) => (
  <div className="flex flex-wrap gap-2 mt-3">
    {pills.map(pill => (
      <Button
        key={pill.label}
        variant={VARIANT_MAP[pill.variant]}
        size="sm"
        onClick={() => onPillClick(pill)}
      >
        {pill.label}
      </Button>
    ))}
  </div>
);

export default InboxPills;
