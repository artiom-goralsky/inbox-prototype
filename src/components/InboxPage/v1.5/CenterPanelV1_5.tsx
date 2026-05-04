import React from 'react';
import DMCenterPanelV1 from '../v1/DMCenterPanelV1';
import ModerationCenterPanelV1 from '../v1/ModerationCenterPanelV1';
import CourseCommentsCenterPanelV1 from '../v1/CourseCommentsCenterPanelV1';
import AIInboxCenterPanelV1 from '../v1/AIInboxCenterPanelV1';
import ChatThreadsCenterPanelV1_5 from './ChatThreadsCenterPanelV1_5';
import ConnectionRequestConversationCenterPanelV1_5 from './ConnectionRequestConversationCenterPanelV1_5';
import type { V1_5Category } from './v1_5MockData';

interface CenterPanelV1_5Props {
  category: V1_5Category;
  selectedId: string;
  onProfileOpen: (name: string) => void;
  onConnectionAction?: (id: string, action: 'accept' | 'ignore' | 'block') => void;
}

const CenterPanelV1_5: React.FC<CenterPanelV1_5Props> = ({ category, selectedId, onProfileOpen, onConnectionAction }) => {
  switch (category) {
    case 'dms':
      return <DMCenterPanelV1 selectedId={selectedId} onProfileOpen={onProfileOpen} />;
    case 'chat-threads':
      return <ChatThreadsCenterPanelV1_5 selectedId={selectedId} onProfileOpen={onProfileOpen} />;
    case 'connection-requests':
      return (
        <ConnectionRequestConversationCenterPanelV1_5
          selectedId={selectedId}
          onAccept={id => onConnectionAction?.(id, 'accept')}
          onIgnore={id => onConnectionAction?.(id, 'ignore')}
          onBlock={id => onConnectionAction?.(id, 'block')}
          onProfileOpen={onProfileOpen}
        />
      );
    case 'moderation':
      return <ModerationCenterPanelV1 selectedId={selectedId} onProfileOpen={onProfileOpen} />;
    case 'course-comments':
      return <CourseCommentsCenterPanelV1 selectedId={selectedId} onProfileOpen={onProfileOpen} />;
    case 'ai-inbox':
      return <AIInboxCenterPanelV1 selectedId={selectedId} onProfileOpen={onProfileOpen} />;
  }
};

export default CenterPanelV1_5;
