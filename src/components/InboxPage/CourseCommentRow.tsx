import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';

interface CourseCommentRowProps {
  lessonTitle: string;
  lastCommenter: string;
  lastCommentPreview: string;
  time: string;
}

const CourseCommentRow: React.FC<CourseCommentRowProps> = ({
  lessonTitle,
  lastCommenter,
  lastCommentPreview,
  time,
}) => (
  <>
    {/* Last commenter avatar */}
    <Avatar name={lastCommenter} size="md" />

    {/* Content */}
    <div className="flex-1 min-w-0 flex flex-col gap-1">
      {/* Top row: lesson title + time */}
      <div className="flex items-center gap-2">
        <Typography variant="heading-sm" color="primary" className="flex-1 min-w-0 truncate">
          {lessonTitle}
        </Typography>
        <Typography variant="caption" color="tertiary" className="shrink-0">
          {time}
        </Typography>
      </div>

      {/* Bottom row: commenter: comment preview */}
      <div className="flex items-center gap-1 min-w-0">
        <Typography variant="body-sm" color="secondary" className="shrink-0">
          {lastCommenter}:
        </Typography>
        <Typography variant="body-sm" color="secondary" className="flex-1 min-w-0 truncate">
          {lastCommentPreview}
        </Typography>
      </div>
    </div>
  </>
);

export default CourseCommentRow;
