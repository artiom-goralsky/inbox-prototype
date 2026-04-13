import React from 'react';
import InboxPage from '../InboxPage/InboxPage';

interface AIInboxProps {
  onToggleSidebar: () => void;
}

const AIInbox: React.FC<AIInboxProps> = () => {
  return <InboxPage />;
};

export default AIInbox;
