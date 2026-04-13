import React from 'react';
import DMCenterPanelV1 from './DMCenterPanelV1';
import ModerationCenterPanelV1 from './ModerationCenterPanelV1';
import CourseCommentsCenterPanelV1 from './CourseCommentsCenterPanelV1';
import AIInboxCenterPanelV1 from './AIInboxCenterPanelV1';
import type { V1Category } from './v1MockData';

interface CenterPanelV1Props {
  category: V1Category;
  selectedId: string;
  onProfileOpen: (name: string) => void;
}

const CenterPanelV1: React.FC<CenterPanelV1Props> = ({ category, selectedId, onProfileOpen }) => {
  switch (category) {
    case 'dms':
      return <DMCenterPanelV1 selectedId={selectedId} onProfileOpen={onProfileOpen} />;
    case 'moderation':
      return <ModerationCenterPanelV1 selectedId={selectedId} onProfileOpen={onProfileOpen} />;
    case 'course-comments':
      return <CourseCommentsCenterPanelV1 selectedId={selectedId} onProfileOpen={onProfileOpen} />;
    case 'ai-inbox':
      return <AIInboxCenterPanelV1 selectedId={selectedId} onProfileOpen={onProfileOpen} />;
  }
};

export default CenterPanelV1;
