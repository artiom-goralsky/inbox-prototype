import React from 'react';
import Sidebar from '../ui/sidebar';

interface ContentSidebarProps {
  onToggleSidebar: () => void;
  onItemClick: (itemId: string, subItemId?: string) => void;
  activeSubItem: string;
}

const ContentSidebar: React.FC<ContentSidebarProps> = ({
  onToggleSidebar,
  onItemClick,
  activeSubItem,
}) => {
  const contentItems = [
    { id: 'posts', title: 'Posts' },
    { id: 'spaces', title: 'Spaces' },
    { id: 'topics', title: 'Topics' },
    { id: 'moderation', title: 'Moderation' },
    { id: 'media-manager', title: 'Media Manager' },
  ];

  return (
    <Sidebar
      title="Content"
      items={contentItems}
      activeItem={activeSubItem}
      onToggleSidebar={onToggleSidebar}
      onItemClick={onItemClick}
    />
  );
};

export default ContentSidebar;
