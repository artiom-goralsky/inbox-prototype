import React, { useEffect, useCallback } from 'react';

interface DrawerOverlayProps {
  children: React.ReactNode;
  onClose: () => void;
  width?: number;
}

const DrawerOverlay: React.FC<DrawerOverlayProps> = ({ children, onClose, width = 368 }) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="absolute inset-y-0 right-0 z-[100] h-full bg-primary shadow-lg flex flex-col overflow-hidden border-l border-secondary animate-[slideInRight_200ms_ease-out]"
      style={{ width }}
    >
      {children}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default DrawerOverlay;
