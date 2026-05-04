import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import type { SupportMessage } from './data/supportThreads';

const ADMIN_AVATAR_SRC = '/images/avatars/1.png';
const ADMIN_NAME = 'Rudy';

interface SupportConversationViewProps {
  messages: SupportMessage[];
}

const SupportConversationView: React.FC<SupportConversationViewProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-2">
      <div className="max-w-[768px] mx-auto">
        {messages.length > 0 && (
          <div className="flex items-center pt-6 pb-2 px-3 border-b border-[#f0f3f5] mb-2">
            <Typography variant="label-xs" color="tertiary">Today</Typography>
          </div>
        )}
        {messages.map(msg =>
          msg.sender === 'system' ? (
            <SystemSeparator key={msg.id} body={msg.body} />
          ) : (
            <SupportMessageRow key={msg.id} message={msg} />
          ),
        )}
      </div>
    </div>
  );
};

function SystemSeparator({ body }: { body: string }) {
  return (
    <div className="flex items-center justify-center py-3">
      <Typography variant="caption" color="tertiary">{body}</Typography>
    </div>
  );
}

function SupportMessageRow({ message }: { message: SupportMessage }) {
  const isAdmin = message.sender === 'admin';
  const senderName = isAdmin ? 'You' : (message.agentName ?? 'Circle Support');

  return (
    <div className="flex gap-3 items-start px-3 py-2 rounded-2xl">
      {isAdmin ? (
        <Avatar src={ADMIN_AVATAR_SRC} name={ADMIN_NAME} size="md" />
      ) : message.agentAvatar ? (
        <Avatar src={message.agentAvatar} name={senderName} size="md" />
      ) : (
        <Avatar name={senderName} size="md" />
      )}
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center gap-2">
          <Typography variant="heading-sm" color="primary">{senderName}</Typography>
          {!isAdmin && (
            <Typography variant="caption" color="tertiary">· Circle Support</Typography>
          )}
          <Typography variant="caption" color="disabled">{message.timestamp}</Typography>
        </div>
        <Typography variant="body-sm" color="primary" className="whitespace-pre-wrap">
          {message.body}
        </Typography>
      </div>
    </div>
  );
}

export default SupportConversationView;
