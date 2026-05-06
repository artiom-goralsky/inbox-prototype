import React from 'react';
import { Icon } from '@circleco/compass/components/Icon';
import { Button } from '@circleco/compass/components/Button';

interface TicketLinkCardProps {
  subject: string;
  onView: () => void;
}

const TicketLinkCard: React.FC<TicketLinkCardProps> = ({ onView }) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-secondary border border-[#e4e7eb] rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] max-w-[332px] animate-[fadeInSlide_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
      <Icon name="inbox-empty" size="md" className="shrink-0 text-primary" />
      <span className="flex-1 min-w-0 truncate text-sm font-medium text-primary">Inbox</span>
      <Button type="button" variant="ghost" size="sm" onClick={onView}>
        View
      </Button>
    </div>
  );
};

export default TicketLinkCard;
