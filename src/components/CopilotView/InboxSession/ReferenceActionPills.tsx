import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';

interface ReferenceActionPill {
  label: string;
  action: string;
}

interface ReferenceActionPillsProps {
  pills: ReferenceActionPill[];
  onPillClick: (pill: ReferenceActionPill) => void;
}

const ReferenceActionPills: React.FC<ReferenceActionPillsProps> = ({ pills, onPillClick }) => {
  if (pills.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {pills.map(pill => (
        <button
          key={pill.action}
          onClick={() => onPillClick(pill)}
          className="inline-flex items-center px-3 py-1.5 bg-primary border border-secondary rounded-full hover:bg-hover transition-colors"
        >
          <Typography variant="body-sm" color="primary">{pill.label}</Typography>
        </button>
      ))}
    </div>
  );
};

export default ReferenceActionPills;
