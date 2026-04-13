import React, { useState, useRef } from 'react';
import { Modal } from '@circleco/compass/components/Modal';
import type { FirstLevelNavItem } from '@/data/firstLevelNavigation';

const DragHandleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0 text-secondary"
    aria-hidden
  >
    <circle cx="5" cy="4" r="1.25" fill="currentColor" />
    <circle cx="11" cy="4" r="1.25" fill="currentColor" />
    <circle cx="5" cy="8" r="1.25" fill="currentColor" />
    <circle cx="11" cy="8" r="1.25" fill="currentColor" />
    <circle cx="5" cy="12" r="1.25" fill="currentColor" />
    <circle cx="11" cy="12" r="1.25" fill="currentColor" />
  </svg>
);

interface MyCommunitiesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityItems: FirstLevelNavItem[];
  onReorder: (reordered: FirstLevelNavItem[]) => void;
  getItemIcon: (item: FirstLevelNavItem) => React.ReactNode;
}

export function MyCommunitiesModal({
  open,
  onOpenChange,
  communityItems,
  onReorder,
  getItemIcon,
}: MyCommunitiesModalProps) {
  const [items, setItems] = useState<FirstLevelNavItem[]>(communityItems);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Sync local state when modal opens with fresh list from parent
  React.useEffect(() => {
    if (open) {
      setItems(communityItems);
    }
  }, [open, communityItems]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
    // Celu karticu prikaži kao drag sliku (ide za mišem)
    const row = rowRefs.current[index];
    if (row) {
      const rect = row.getBoundingClientRect();
      e.dataTransfer.setDragImage(
        row,
        e.clientX - rect.left,
        e.clientY - rect.top
      );
    }
  };

  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex === null || targetIndex === draggedIndex) return;
    const newItems = [...items];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, removed);
    setItems(newItems);
    setDraggedIndex(targetIndex);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedIndex(null);
    onReorder(items);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange} size="md">
      <Modal.Content>
        <Modal.Header
          title="My communities"
          showCloseButton
          closeButtonLabel="Close"
        />
        <Modal.Body>
          <div
            className="flex flex-col gap-2 px-6 pb-6"
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                ref={el => {
                  rowRefs.current[index] = el;
                }}
                draggable
                onDragStart={e => handleDragStart(e, index)}
                onDragOver={e => handleDragOver(e, index)}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                className={`flex cursor-grab active:cursor-grabbing touch-none select-none items-center gap-3 rounded-lg border border-primary bg-primary px-3 py-3 duration-200 [transition-property:transform,box-shadow,background-color,border-color] ${
                  draggedIndex === index
                    ? 'scale-[0.98] border-primary bg-secondary shadow-md'
                    : 'hover:border-hover hover:bg-secondary/50'
                }`}
                role="button"
                tabIndex={0}
                aria-label={`${item.title}, drag to reorder`}
              >
                <div
                  className="flex shrink-0 touch-none rounded p-1 -m-1 text-secondary"
                  aria-hidden
                >
                  <DragHandleIcon />
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                  {getItemIcon(item)}
                </div>
                <span className="min-w-0 flex-1 truncate text-body-md text-primary antialiased">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
