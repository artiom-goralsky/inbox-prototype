import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { IconButton } from '@circleco/compass/components/IconButton';
import type { V1Message } from './v1MockData';
import DrawerOverlay from './DrawerOverlay';

interface ThreadPanelV1Props {
  parentMessage: V1Message;
  replies: V1Message[];
  onClose: () => void;
}

const ThreadPanelV1: React.FC<ThreadPanelV1Props> = ({ parentMessage, replies, onClose }) => {
  const [replyText, setReplyText] = useState('');

  return (
    <DrawerOverlay onClose={onClose}>
    <div className="flex-1 flex flex-col bg-primary overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between h-14 pl-6 pr-4 border-b border-primary shrink-0">
        <Typography variant="heading-md" color="primary">Thread</Typography>
        <IconButton icon="cross" size="md" variant="ghost" aria-label="Close thread" onClick={onClose} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* Parent message */}
        <div className="flex gap-3 items-start px-3 py-2 rounded-2xl">
          <Avatar name={parentMessage.senderName} size="md" />
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Typography variant="heading-sm" color="primary">{parentMessage.senderName}</Typography>
              <Typography variant="caption" color="disabled">{parentMessage.time}</Typography>
            </div>
            <Typography variant="body-sm" color="primary">{parentMessage.text}</Typography>
          </div>
        </div>

        {/* Reply count divider */}
        <div className="flex items-center px-3 pb-2 border-b border-primary mb-1">
          <Typography variant="label-xs" color="primary">
            {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
          </Typography>
        </div>

        {/* Replies */}
        {replies.map((reply) => (
          <div key={reply.id} className="flex gap-3 items-start px-3 py-2 rounded-2xl">
            <Avatar name={reply.senderName} size="md" />
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Typography variant="heading-sm" color="primary">{reply.senderName}</Typography>
                <Typography variant="caption" color="disabled">{reply.time}</Typography>
              </div>
              <Typography variant="body-sm" color="primary">{reply.text}</Typography>
            </div>
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="p-4 shrink-0">
        <div className="border border-secondary rounded-2xl overflow-hidden">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Reply..."
            className="w-full px-4 py-3 text-sm resize-none outline-none bg-primary min-h-[44px]"
            rows={1}
          />
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center">
              <IconButton icon="paperclip" size="md" variant="ghost" aria-label="Attach" />
              <IconButton icon="emoji-smiley" size="md" variant="ghost" aria-label="Emoji" />
            </div>
            <IconButton icon="arrow-up" size="md" variant="secondary" disabled={!replyText.trim()} aria-label="Send" />
          </div>
        </div>
      </div>
    </div>
    </DrawerOverlay>
  );
};

export default ThreadPanelV1;
