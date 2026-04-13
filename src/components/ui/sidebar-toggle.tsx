import React from 'react';
import { IconButton } from '@circleco/compass/components/IconButton';

interface SidebarToggleProps {
  onToggle: () => void;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({ onToggle }) => {
  return (
    <IconButton
      variant="secondary"
      size="sm"
      icon="chevron-triangle-left"
      aria-label="Toggle sidebar"
      onClick={onToggle}
    />
  );
};

export default SidebarToggle;
