import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Select } from '@circleco/compass/components/Select';

interface CourseComment {
  id: string;
  name: string;
  lesson: string;
  preview: string;
  time: string;
  unread?: boolean;
}

const COMMENTS: CourseComment[] = [
  { id: '1', name: 'Calvin Parks',  lesson: 'Camera basics',              preview: 'Creating a space where there are n...',     time: '9:45', unread: true },
  { id: '2', name: 'Priya Sharma',  lesson: 'Color grading fundamentals', preview: "I'm stuck on the export settings, ca...",   time: '8:30' },
  { id: '3', name: 'Nina Vasquez',  lesson: 'Composition techniques',     preview: 'This reminds me of illustration princ...', time: 'Yesterday', unread: true },
  { id: '4', name: 'Jason Yu',      lesson: 'Lighting setups',            preview: 'Quick question — do I need a softbox...', time: 'Mon' },
  { id: '5', name: 'Emily Park',    lesson: 'Portrait fundamentals',      preview: 'The depth of field exercise was...',       time: 'Mon' },
  { id: '6', name: 'James Liu',     lesson: 'Night photography',          preview: "I don't have it installed yet.",           time: '2d', unread: true },
];

const STATUS_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
];

interface CourseCommentsThreadListProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

const CourseCommentsThreadList: React.FC<CourseCommentsThreadListProps> = ({ selectedId, onSelect }) => {
  const [statusFilter, setStatusFilter] = useState('all');

  const visible = COMMENTS.filter(c => {
    return statusFilter === 'all' || (statusFilter === 'unread' && c.unread);
  });

  return (
    <div className="w-full h-full border-r border-secondary flex flex-col bg-primary">
      {/* Filter bar */}
      <div className="px-4 pt-4 pb-3 border-b border-secondary shrink-0">
        <Select
          aria-label="Filter by status"
          placeholder="All"
          options={STATUS_OPTIONS}
          onValueChange={v => setStatusFilter(v?.value ?? 'all')}
        />
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto p-2">
        {visible.map(comment => (
          <div
            key={comment.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(comment.id)}
            onKeyDown={e => e.key === 'Enter' && onSelect(comment.id)}
            className={`flex items-start gap-3 pl-4 pr-3 py-2 cursor-pointer transition-colors rounded-lg ${
              selectedId === comment.id ? 'bg-active' : 'hover:bg-hover'
            }`}
          >
            <Avatar name={comment.name} size="sm" />

            <div className="flex-1 min-w-0 flex flex-col gap-1">
              {/* Row 1: name + time */}
              <div className="flex items-center gap-2 min-w-0">
                <Typography variant="heading-sm" color="primary" className="truncate">
                  {comment.name}
                </Typography>
                <Typography variant="caption" color="disabled" className="shrink-0 ml-auto">
                  {comment.time}
                </Typography>
              </div>

              {/* Row 2: lesson name */}
              <Typography variant="caption" color="tertiary" className="truncate">
                {comment.lesson}
              </Typography>

              {/* Row 3: preview */}
              <Typography variant="body-sm" color="secondary" className="truncate">
                {comment.preview}
              </Typography>
            </div>

            {comment.unread && (
              <div className="w-1.5 h-1.5 rounded-full bg-info shrink-0 mt-1.5" />
            )}
          </div>
        ))}

        {visible.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <Typography variant="body-sm" color="tertiary">No comments</Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCommentsThreadList;
