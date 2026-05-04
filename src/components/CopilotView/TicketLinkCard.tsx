import React from 'react';
import { Icon } from '@circleco/compass/components/Icon';
import { Button } from '@circleco/compass/components/Button';

interface TicketLinkCardProps {
  subject: string;
  onView: () => void;
}

const TicketLinkCard: React.FC<TicketLinkCardProps> = ({ subject, onView }) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-secondary border border-secondary rounded-lg shadow-2xs max-w-[332px] animate-[fadeInSlide_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
      <Icon name="chain-link" size="md" className="shrink-0 text-primary" />
      <span className="flex-1 min-w-0 truncate text-sm font-medium text-primary">{subject}</span>
      <Button type="button" variant="ghost" size="sm" onClick={onView}>
        View
      </Button>
    </div>
  );
};

export default TicketLinkCard;
