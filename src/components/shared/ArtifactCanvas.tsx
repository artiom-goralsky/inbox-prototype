/**
 * ArtifactCanvas — adapted from ai-elements (elements.ai-sdk.dev/components/canvas)
 * React Flow canvas with pan-on-scroll, no double-click zoom, sensible defaults
 * for displaying page/artifact content as a zoomable canvas.
 */
import React, { useCallback, type ReactNode } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  useReactFlow,
  ReactFlowProvider,
  type Node,
  type NodeTypes,
  type ReactFlowProps,
} from '@xyflow/react';

/* ── Canvas ─────────────────────────────────────────────────────────── */
const DELETE_KEY = ['Backspace', 'Delete'];

interface ArtifactCanvasProps extends Omit<ReactFlowProps, 'nodes' | 'nodeTypes'> {
  children?: ReactNode;
  nodeTypes?: NodeTypes;
  initialNodes?: Node[];
}

const ArtifactCanvasInner = ({
  children,
  nodeTypes,
  initialNodes = [],
  ...props
}: ArtifactCanvasProps) => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);

  return (
    <ReactFlow
      nodes={nodes}
      edges={[]}
      onNodesChange={onNodesChange}
      nodeTypes={nodeTypes}
      deleteKeyCode={DELETE_KEY}
      fitView
      panOnDrag={false}
      panOnScroll
      selectionOnDrag
      zoomOnDoubleClick={false}
      minZoom={0.25}
      maxZoom={2}
      {...props}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={20}
        size={1}
        color="rgba(0,0,0,0.07)"
        style={{ background: 'var(--color-background-secondary, #f7f9fa)' }}
      />
      {children}
    </ReactFlow>
  );
};

/**
 * Wrap with ReactFlowProvider so consumers can optionally use useReactFlow()
 * hooks in child components (e.g. for connecting zoom toolbar).
 */
export const ArtifactCanvas = (props: ArtifactCanvasProps) => (
  <ReactFlowProvider>
    <ArtifactCanvasInner {...props} />
  </ReactFlowProvider>
);

/* ── Zoom toolbar hook — connect our UI controls to ReactFlow ────── */
export const useCanvasZoom = () => {
  const { zoomIn, zoomOut, getZoom, setViewport, getViewport } = useReactFlow();

  const handleZoomIn = useCallback(() => zoomIn({ duration: 200 }), [zoomIn]);
  const handleZoomOut = useCallback(() => zoomOut({ duration: 200 }), [zoomOut]);
  const handleReset = useCallback(() => {
    const vp = getViewport();
    setViewport({ x: vp.x, y: vp.y, zoom: 1 }, { duration: 200 });
  }, [getViewport, setViewport]);

  return { handleZoomIn, handleZoomOut, handleReset, getZoom };
};
