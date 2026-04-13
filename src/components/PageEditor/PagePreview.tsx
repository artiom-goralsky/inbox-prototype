import React from 'react';
import { getTemplateComponent } from './templateComponents';

interface PagePreviewProps {
  templateId: string;
  zoom: number;
  deviceType: 'desktop' | 'tablet' | 'mobile';
}

const PagePreview: React.FC<PagePreviewProps> = ({
  templateId,
  zoom,
  deviceType,
}) => {
  const TemplateComponent = getTemplateComponent(templateId);

  const getDeviceWidth = () => {
    switch (deviceType) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      case 'desktop':
      default:
        return '100%';
    }
  };

  return (
    <div className="flex-1 bg-active flex items-center justify-center">
      <div
        className="bg-primary overflow-hidden transition-[width] duration-300"
        style={{
          width: getDeviceWidth(),
          maxWidth: deviceType === 'desktop' ? '1200px' : '100%',
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'center top',
        }}
      >
        <div className="min-h-screen">
          <TemplateComponent />
        </div>
      </div>
    </div>
  );
};

export default PagePreview;
