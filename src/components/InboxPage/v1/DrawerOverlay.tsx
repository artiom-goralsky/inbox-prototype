import React, { useEffect, useCallback, useRef, useState } from 'react';

interface DrawerOverlayProps {
  children: React.ReactNode;
  onClose: () => void;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
}

const DrawerOverlay: React.FC<DrawerOverlayProps> = ({
  children,
  onClose,
  width: defaultWidth = 368,
  minWidth = 280,
  maxWidth = 720,
}) => {
  const [width, setWidth] = useState(defaultWidth);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(defaultWidth);
  const isDragging = useRef(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartWidth.current = width;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = dragStartX.current - e.clientX;
      const next = Math.max(minWidth, Math.min(maxWidth, dragStartWidth.current + delta));
      setWidth(next);
    };
    const handleUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [minWidth, maxWidth]);

  return (
    <div
      className="absolute inset-y-0 right-0 z-[100] h-full bg-primary shadow-lg flex flex-col overflow-hidden border-l border-secondary animate-[slideInRight_200ms_ease-out]"
      style={{ width }}
    >
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize panel"
        onMouseDown={handleDragStart}
        className="absolute inset-y-0 left-0 w-[6px] -ml-[3px] cursor-col-resize z-10 group"
      >
        <div className="absolute inset-y-0 left-[2px] w-[2px] bg-transparent group-hover:bg-info/40 transition-colors rounded-full" />
      </div>
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
