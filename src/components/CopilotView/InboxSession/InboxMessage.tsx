import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Icon } from '@circleco/compass/components/Icon';
import ReadyToSend from './ReadyToSend';
import NeedsYou from './NeedsYou';
import type { ScenarioMessage } from './inboxScenarioData';

interface InboxMessageProps {
  message: ScenarioMessage;
  isFirst: boolean;
  onBatchSent?: () => void;
  onNeedsComplete?: (sentCount: number, remainingNames: string[]) => void;
}

const InboxMessage: React.FC<InboxMessageProps> = ({ message, isFirst, onBatchSent, onNeedsComplete }) => {
  if (message.type === 'heading') {
    return (
      <div className="mt-3">
        <Typography variant="label-md" color="primary">{message.text}</Typography>
      </div>
    );
  }

  if (message.type === 'summary-item') {
    return (
      <div className="flex items-start gap-2 mt-1">
        <div className="shrink-0 mt-0.5">
          <Icon name="circle-check-filled" color="success" size="sm" />
        </div>
        <Typography variant="body-md" color="primary">{message.text}</Typography>
      </div>
    );
  }

  if (message.type === 'summary-deferred') {
    return (
      <div className="flex items-start gap-2 mt-1">
        <div className="shrink-0 mt-0.5 w-4 h-4 rounded-full border-[1.5px] border-secondary" />
        <Typography variant="body-md" color="tertiary">{message.text}</Typography>
      </div>
    );
  }

  if (message.type === 'ready-to-send') {
    return <ReadyToSend onBatchSent={onBatchSent ?? (() => {})} />;
  }

  if (message.type === 'needs-you') {
    return <NeedsYou onComplete={onNeedsComplete ?? (() => {})} />;
  }

  // paragraph
  return (
    <Typography variant="body-md" color="primary" className="px-1 whitespace-pre-line">
      {message.text}
    </Typography>
  );
};

export default InboxMessage;
