import React, { useEffect, useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';

interface FlyingInputProps {
  message: string;
  sourceRect: DOMRect;
  targetRect: DOMRect;
  fading: boolean;
}

const FlyingInput: React.FC<FlyingInputProps> = ({ message, sourceRect, targetRect, fading }) => {
  const [moved, setMoved] = useState(false);

  useEffect(() => {
    const r1 = requestAnimationFrame(() => {
      const r2 = requestAnimationFrame(() => setMoved(true));
      return () => cancelAnimationFrame(r2);
    });
    return () => cancelAnimationFrame(r1);
  }, []);

  const dx = moved ? targetRect.left - sourceRect.left : 0;
  const dy = moved ? targetRect.top - sourceRect.top : 0;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      <div
        className="absolute bg-primary border border-[#e4e7eb] rounded-2xl flex flex-col justify-between px-4 py-3 overflow-hidden"
        style={{
          left: sourceRect.left,
          top: sourceRect.top,
          width: sourceRect.width,
          height: sourceRect.height,
          minHeight: 130,
          boxShadow: '0px 4px 20px 0px rgba(0,0,0,0.06), 0px 1px 4px 0px rgba(0,0,0,0.03)',
          transform: `translate(${dx}px, ${dy}px)`,
          opacity: fading ? 0 : 1,
          transition: 'transform 380ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <Typography variant="body-md" color={message ? 'primary' : 'tertiary'}>
          {message || 'Ask anything…'}
        </Typography>
        {/* Bottom row — decorative, matches dashboard input */}
        <div className="flex items-center justify-between gap-2 opacity-40">
          <div className="flex items-center gap-1">
            <div className="w-7 h-7 rounded-lg border border-secondary" />
            <div className="w-7 h-7 rounded-lg border border-secondary" />
            <div className="w-7 h-7 rounded-lg border border-secondary" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-7 h-7 rounded-lg" />
            <div className="w-7 h-7 rounded-lg bg-accent-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlyingInput;
