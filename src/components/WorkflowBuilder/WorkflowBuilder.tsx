import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Plus, Minus, RotateCcw } from 'lucide-react';
import WorkflowBlock from './WorkflowBlock';
import { BreadCrumbs } from '@circleco/compass/components/BreadCrumbs';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'end';
  title: string;
  x: number;
  y: number;
}

interface WorkflowBuilderProps {
  onClose: () => void;
}

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ onClose }) => {
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isClosing, setIsClosing] = useState(false);
  const [nodes] = useState<WorkflowNode[]>([
    {
      id: 'trigger-1',
      type: 'trigger',
      title: 'Add a trigger',
      x: window.innerWidth, // 50% of screen width
      y: window.innerHeight - 100, // 50% of screen height minus offset
    },
    {
      id: 'end-1',
      type: 'end',
      title: 'End',
      x: window.innerWidth, // 50% of screen width
      y: window.innerHeight + 100, // 50% of screen height plus offset
    },
  ]);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Add global mouse events for better dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        setPan(prevPan => {
          const newPan = {
            x: prevPan.x + deltaX,
            y: prevPan.y + deltaY,
          };
          return newPan;
        });

        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart]);

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 20, 200);
    if (newZoom !== zoom) {
      // Zoom relative to center of CURRENT VIEW (not canvas center)
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight - 80; // Account for header

      // Center of current viewport
      const zoomPointX = viewportWidth / 2;
      const zoomPointY = viewportHeight / 2;

      // Calculate zoom point relative to current pan
      const zoomPointRelativeX = (zoomPointX - pan.x) / (zoom / 100);
      const zoomPointRelativeY = (zoomPointY - pan.y) / (zoom / 100);

      // Calculate new pan to keep zoom point under cursor
      const newPanX = zoomPointX - zoomPointRelativeX * (newZoom / 100);
      const newPanY = zoomPointY - zoomPointRelativeY * (newZoom / 100);

      setZoom(newZoom);
      setPan({ x: newPanX, y: newPanY });
    }
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 20, 25);
    if (newZoom !== zoom) {
      // Zoom relative to center of CURRENT VIEW (not canvas center)
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight - 80; // Account for header

      // Center of current viewport
      const zoomPointX = viewportWidth / 2;
      const zoomPointY = viewportHeight / 2;

      // Calculate zoom point relative to current pan
      const zoomPointRelativeX = (zoomPointX - pan.x) / (zoom / 100);
      const zoomPointRelativeY = (zoomPointY - pan.y) / (zoom / 100);

      // Calculate new pan to keep zoom point under cursor
      const newPanX = zoomPointX - zoomPointRelativeX * (newZoom / 100);
      const newPanY = zoomPointY - zoomPointRelativeY * (newZoom / 100);

      setZoom(newZoom);
      setPan({ x: newPanX, y: newPanY });
    }
  };

  const handleResetZoom = () => {
    // Center the view on the workflow components
    // Components are at 50% of screen width and height
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Calculate pan to center these components in the viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight - 80; // Account for header

    // Calculate the offset needed to center the components
    const targetPanX = viewportWidth / 2 - centerX;
    const targetPanY = viewportHeight / 2 - centerY;

    // Reset with smooth transition
    setZoom(100);
    setPan({ x: targetPanX, y: targetPanY });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Start dragging on any canvas area (we'll prevent on nodes separately)
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  };

  const handleMouseMove = (_e: React.MouseEvent) => {
    // Mouse move tracking (currently not used for zoom buttons)
  };

  // Mouse move and mouse up are now handled globally in useEffect

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -1 : 1; // 1% zoom step with mouse wheel
    const newZoom = Math.max(25, Math.min(200, zoom + delta));

    if (newZoom !== zoom) {
      // Get mouse position relative to canvas container
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate the point in canvas coordinates before zoom
      // With transformOrigin: '0 0', the calculation is simpler
      const canvasX = (mouseX - pan.x) / (zoom / 100);
      const canvasY = (mouseY - pan.y) / (zoom / 100);

      // Calculate new pan to keep the same point under cursor after zoom
      const newPanX = mouseX - canvasX * (newZoom / 100);
      const newPanY = mouseY - canvasY * (newZoom / 100);

      setZoom(newZoom);
      setPan({ x: newPanX, y: newPanY });
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  // const handleAddNode = (type: 'trigger' | 'action' | 'end') => {
  //   const newNode: WorkflowNode = {
  //     id: `${type}-${Date.now()}`,
  //     type,
  //     title:
  //       type === 'trigger'
  //         ? 'Add a trigger'
  //         : type === 'action'
  //         ? 'Add action'
  //         : 'End',
  //     x: 400 + Math.random() * 200 - 100,
  //     y: 300 + Math.random() * 200 - 100,
  //   };
  //   setNodes(prev => [...prev, newNode]);
  // };

  return (
    <div
      className={`fixed inset-0 bg-primary z-50 flex flex-col transition-[opacity,transform] duration-300 ${
        isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
      }`}
    >
      {/* Header - Figma Design */}
      <div className="flex items-center justify-between px-4 py-4  bg-primary">
        <div className="flex items-center gap-4">
          {/* Back Button */}
          <button
            onClick={handleClose}
            className="p-2 bg-primary border border-hover rounded-lg hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Breadcrumb Navigation */}
          <BreadCrumbs
            items={[
              { label: 'Workflows', href: '#' },
              { label: 'Moderate new posts' },
            ]}
            maxItems={4}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-primary border border-hover rounded-lg hover:bg-secondary transition-colors">
            Save draft
          </button>
          <button className="px-3 py-2 text-sm font-medium text-white bg-inverse border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
            Activate
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 relative overflow-hidden bg-secondary m-4 mt-0 rounded-2xl border border-primary">
        {/* Canvas */}
        <div
          ref={canvasRef}
          className="absolute cursor-grab active:cursor-grabbing canvas-background"
          style={{
            width: '200%',
            height: '200%',
            left: '-50%',
            top: '-50%',
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
        >
          {/* Grid Pattern Background - Figma Style */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
            onMouseDown={handleMouseDown}
          />

          {/* Workflow Nodes */}
          {nodes.map(node => (
            <div
              key={node.id}
              className="absolute"
              style={{
                left: node.x,
                top: node.y,
              }}
              onMouseDown={e => e.stopPropagation()}
              onClick={e => e.stopPropagation()}
            >
              <WorkflowBlock
                type={node.type}
                title={node.title}
                subtitle={node.type === 'action' ? 'AI Action' : undefined}
                status="success"
              />
            </div>
          ))}

          {/* Connection Lines */}
          <svg className="absolute inset-0 pointer-events-none">
            {nodes.map((node, index) => {
              if (index < nodes.length - 1) {
                const nextNode = nodes[index + 1];
                return (
                  <line
                    key={`line-${node.id}-${nextNode.id}`}
                    x1={node.x + 160} // Center of 320px wide block
                    y1={node.y + 60} // Middle of block height
                    x2={nextNode.x + 160}
                    y2={nextNode.y + 60}
                    stroke="#d1d5db"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                );
              }
              return null;
            })}
          </svg>
        </div>

        {/* Zoom Controls - Bottom Left - Figma Style */}
        <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            className="p-2 bg-primary border border-hover rounded-lg shadow-sm hover:bg-secondary transition-colors"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 bg-primary border border-hover rounded-lg shadow-sm hover:bg-secondary transition-colors"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-2 bg-primary border border-hover rounded-lg shadow-sm hover:bg-secondary transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
