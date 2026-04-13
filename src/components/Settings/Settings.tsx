import React from 'react';
import ContentContainer from '../ContentContainer';

interface SettingsProps {
  onToggleSidebar: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onToggleSidebar }) => {
  return (
    <ContentContainer title="Settings" onToggleSidebar={onToggleSidebar}>
      <div className="overflow-auto">
        <div className="max-w-3xl mx-auto py-6 px-6">
          <div className="space-y-6">
            <p>Settings content will be provided by user.</p>
          </div>
        </div>
      </div>
    </ContentContainer>
  );
};

export default Settings;
