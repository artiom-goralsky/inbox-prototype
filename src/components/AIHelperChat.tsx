import React, { useState } from 'react';
import { TextInput } from '@circleco/compass/components/TextInput';
import { Icon } from '@circleco/compass/components/Icon';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Button } from '@circleco/compass/components/Button';
import { Typography } from '@circleco/compass/components/Typography';
import { Box } from '@circleco/compass/components/Box';

interface AIHelperChatProps {
  onClose: () => void;
}

const AIHelperChat: React.FC<AIHelperChatProps> = ({ onClose }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle message submission here
      setMessage('');
    }
  };

  const quickActions = [
    'Report a bug',
    'Invite new members',
    'Grow revenue',
    'Build email marketing funnel',
  ];

  return (
    <div className="bg-primary border-l border-secondary h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-[22px] h-[60px] shrink-0">
        <div className="flex items-center gap-2">
          <Icon
            name="sparkle-filled"
            size="sm"
            color="primary"
            className="shrink-0"
          />
          <Typography variant="heading-sm" color="primary">
            Let&apos;s build!
          </Typography>
        </div>
        <div className="flex items-center gap-1">
          <IconButton
            variant="ghost"
            size="sm"
            icon="clock-dash"
            aria-label="Download"
          />
          <IconButton
            variant="ghost"
            size="sm"
            icon="expand"
            aria-label="Expand"
          />
          <IconButton
            variant="ghost"
            size="sm"
            icon="cross"
            aria-label="Close"
            onClick={onClose}
          />
        </div>
      </div>

      {/* Quick Actions & Input Area */}
      <div className="flex-1 flex flex-col gap-4 px-3 py-4 min-h-0">
        {/* Quick Action Buttons */}
        <div className="flex flex-col gap-2 mt-auto items-start">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
            >
              {action}
            </Button>
          ))}
        </div>

        {/* Input Area – Box with TextInput + 3 IconButtons */}
        <Box
          as="form"
          onSubmit={handleSubmit}
          className="bg-primary p-3 px-3 flex flex-col gap-3"
        >
          <TextInput
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type to reply..."
          />
          <div className="flex items-center gap-2">
            <IconButton
              type="button"
              variant="outline"
              size="sm"
              icon="hashtag"
              aria-label="Tag"
            />
            <IconButton
              type="button"
              variant="outline"
              size="sm"
              icon="paperclip"
              aria-label="Attach file"
            />
            <IconButton
              type="submit"
              variant="outline"
              size="sm"
              icon="arrow-up"
              aria-label="Send"
              className="ml-auto"
            />
          </div>
        </Box>
      </div>
    </div>
  );
};

export default AIHelperChat;
