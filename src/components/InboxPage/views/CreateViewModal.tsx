import React, { useState, useEffect } from 'react';
import { Modal } from '@circleco/compass/components/Modal';
import { Typography } from '@circleco/compass/components/Typography';
import { TextInput } from '@circleco/compass/components/TextInput';
import { Select } from '@circleco/compass/components/Select';
import { Button } from '@circleco/compass/components/Button';
import { Popover } from '@circleco/compass/components/Popover';
import FilterBuilder from './FilterBuilder';
import type { InboxCategory, InboxView, ViewFilter } from './viewTypes';
import { getFieldsForCategory } from './viewFiltersConfig';

const CATEGORY_OPTIONS = [
  { value: 'dms', label: 'My DMs' },
  { value: 'moderation', label: 'Moderation' },
  { value: 'comments', label: 'Course comments' },
  { value: 'connections', label: 'Connections' },
  { value: 'ai', label: 'AI Inbox' },
];

const COMMON_EMOJIS = [
  '⭐', '🔥', '💬', '📌', '👑', '🎯', '🚀', '💡',
  '🎓', '❤️', '✅', '⚡', '🌟', '🔔', '📊', '🛡️',
  '🌍', '🎵', '🦁', '🐦', '🎪', '🌈', '📝', '🔮',
  '💎', '🏆', '🎨', '🔑', '🌿', '🦋',
];

interface CreateViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (view: Omit<InboxView, 'id' | 'count'>) => void;
  currentCategory?: InboxCategory;
}

const CreateViewModal: React.FC<CreateViewModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentCategory,
}) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('⭐');
  const [category, setCategory] = useState<InboxCategory | 'all'>(currentCategory ?? 'dms');
  const [filters, setFilters] = useState<ViewFilter[]>([]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setIcon('⭐');
      setCategory(currentCategory ?? 'dms');
      setFilters([]);
    }
  }, [isOpen, currentCategory]);

  const handleCategoryChange = (newCategory: InboxCategory | 'all') => {
    setCategory(newCategory);
    // Remove filters incompatible with the new category
    const validFields = getFieldsForCategory(newCategory).map(f => f.field);
    setFilters(prev => prev.filter(f => validFields.includes(f.field)));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), icon, category, filters });
    onClose();
  };

  return (
    <Modal.Root
      open={isOpen}
      onOpenChange={open => { if (!open) onClose(); }}
      size="md"
    >
      <Modal.Content>
      <Modal.Header title="Create view" />
      <Modal.Body>
        <div className="flex flex-col gap-6">
          {/* Description */}
          <Typography variant="body-sm" color="secondary">
            Views let you save filters for inbox items, displaying matching conversations in real-time.
          </Typography>

          {/* Name section */}
          <div className="flex flex-col gap-1">
            <Typography variant="label-sm" color="primary">Name your view</Typography>
            <Typography variant="caption" color="tertiary">
              How the view will show in your sidebar
            </Typography>
            <div className="flex items-center gap-2 mt-2">
              {/* Emoji picker */}
              <Popover
                trigger={
                  <Button variant="outline" size="sm" className="min-w-[36px] h-9 px-2 text-base shrink-0">
                    {icon}
                  </Button>
                }
                side="bottom"
                align="start"
                closeOnContentClick
              >
                <div className="p-2 grid grid-cols-6 gap-0.5 w-[200px]">
                  {COMMON_EMOJIS.map(e => (
                    <Button
                      key={e}
                      variant="ghost"
                      size="sm"
                      className="px-1 text-base h-8 min-w-0"
                      onClick={() => setIcon(e)}
                    >
                      {e}
                    </Button>
                  ))}
                </div>
              </Popover>
              <div className="flex-1">
                <TextInput
                  value={name}
                  onChange={e => setName((e.target as HTMLInputElement).value)}
                  placeholder="Enter view name..."
                  aria-label="View name"
                  onKeyDown={e => { if (e.key === 'Enter' && name.trim()) handleSave(); }}
                />
              </div>
            </div>
          </div>

          {/* Category section */}
          <div className="flex flex-col gap-1">
            <Typography variant="label-sm" color="primary">Category</Typography>
            <Typography variant="caption" color="tertiary">
              Which inbox category this view applies to
            </Typography>
            <div className="mt-2">
              <Select
                options={CATEGORY_OPTIONS}
                value={CATEGORY_OPTIONS.find(o => o.value === category) ?? null}
                onValueChange={opt =>
                  handleCategoryChange((opt?.value ?? 'all') as InboxCategory | 'all')
                }
                placeholder="Select category"
                aria-label="Category"
              />
            </div>
          </div>

          {/* Filters section */}
          <div className="flex flex-col gap-1">
            <Typography variant="label-sm" color="primary">Filters</Typography>
            <Typography variant="caption" color="tertiary">
              Choose the criteria for items to appear in your view
            </Typography>
            <div className="mt-2">
              <FilterBuilder
                filters={filters}
                category={category}
                onFiltersChange={setFilters}
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer
        primaryAction={{
          label: 'Save',
          onClick: handleSave,
          disabled: !name.trim(),
        }}
        secondaryAction={{
          label: 'Cancel',
          onClick: onClose,
        }}
      />
      </Modal.Content>
    </Modal.Root>
  );
};

export default CreateViewModal;
