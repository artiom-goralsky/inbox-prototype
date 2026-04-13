import React, { useState, useEffect } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Icon } from '@circleco/compass/components/Icon';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Button } from '@circleco/compass/components/Button';
import { Menu } from '@circleco/compass/components/Menu';
import { COURSE_THREADS, COURSE_COMMENT_DATA, COURSE_THREAD_REPLIES, type V1Message } from './v1MockData';
import ThreadPanelV1 from './ThreadPanelV1';

function CommentRow({ comment, onProfileOpen, threadReplies, onOpenThread }: {
  comment: { id: string; name: string; date: string; text: string };
  onProfileOpen: (name: string) => void;
  threadReplies?: V1Message[];
  onOpenThread?: (parentMsg: V1Message, replies: V1Message[]) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const hasReplies = threadReplies && threadReplies.length > 0;

  const handleOpenThread = () => {
    const parentMsg: V1Message = { id: comment.id, senderName: comment.name, text: comment.text, time: comment.date };
    onOpenThread?.(parentMsg, threadReplies ?? []);
  };

  return (
    <div
      className={`flex gap-3 items-start px-3 py-2 rounded-2xl relative ${hovered ? 'bg-secondary' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button className="shrink-0 focus:outline-none" onClick={() => onProfileOpen(comment.name)}>
        <Avatar name={comment.name} size="md" />
      </button>
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <button className="focus:outline-none" onClick={() => onProfileOpen(comment.name)}>
            <Typography variant="heading-sm" color="primary">{comment.name}</Typography>
          </button>
          <Typography variant="caption" color="disabled">{comment.date}</Typography>
        </div>
        <Typography variant="body-sm" color="primary">{comment.text}</Typography>
        {/* Thread indicator */}
        {hasReplies && (
          <button
            className="flex items-center gap-1 px-2 py-1 border border-secondary rounded-2xl w-fit hover:bg-hover"
            onClick={handleOpenThread}
          >
            <div className="flex -space-x-1">
              {threadReplies!.slice(0, 3).map(r => (
                <Avatar key={r.id} name={r.senderName} size="xxs" />
              ))}
            </div>
            <Typography variant="label-xs" color="info">{threadReplies!.length} {threadReplies!.length === 1 ? 'reply' : 'replies'}</Typography>
            <Typography variant="caption" color="tertiary">just now</Typography>
          </button>
        )}
      </div>
      {hovered && (
        <div className="absolute -top-4 right-2 flex items-center bg-primary border border-secondary rounded-lg shadow-2xs z-10 overflow-hidden">
          <IconButton icon="emoji-smiley" size="sm" variant="ghost" aria-label="React" />
          <IconButton icon="thread" size="sm" variant="ghost" aria-label="Reply in thread" onClick={handleOpenThread} />
          <Menu
            options={[
              { label: 'Edit', icon: 'pencil' as const, onClick: () => {} },
              { label: 'Mark unread', icon: 'page-edit' as const, onClick: () => {} },
              { label: 'Pin', icon: 'pin' as const, onClick: () => {} },
              { label: 'Copy link', icon: 'chain-link' as const, onClick: () => {} },
              { label: 'Report', icon: 'flag' as const, onClick: () => {} },
              { label: 'Delete', icon: 'trash-can' as const, danger: true, onClick: () => {} },
            ]}
            trigger={<IconButton icon="dot-menu" size="sm" variant="ghost" aria-label="More" />}
          />
        </div>
      )}
    </div>
  );
}

interface CourseCommentsCenterPanelV1Props {
  selectedId: string;
  onProfileOpen: (name: string) => void;
}

const CourseCommentsCenterPanelV1: React.FC<CourseCommentsCenterPanelV1Props> = ({ selectedId, onProfileOpen }) => {
  const thread = COURSE_THREADS.find((t) => t.id === selectedId);
  const commentData = COURSE_COMMENT_DATA[selectedId];
  const [composerText, setComposerText] = useState('');
  const [activeThread, setActiveThread] = useState<{ parent: V1Message; replies: V1Message[] } | null>(null);

  // Close thread panel when conversation changes
  useEffect(() => {
    setActiveThread(null);
  }, [selectedId]);

  useEffect(() => {
    const handler = () => setActiveThread(null);
    window.addEventListener('drawer-open', handler);
    return () => window.removeEventListener('drawer-open', handler);
  }, []);

  const openThread = (parent: V1Message, replies: V1Message[]) => {
    window.dispatchEvent(new CustomEvent('drawer-open'));
    setActiveThread({ parent, replies });
  };

  if (!thread) {
    return (
      <div className="flex-1 flex items-center justify-center bg-primary">
        <Typography variant="body-sm" color="tertiary">Select a comment</Typography>
      </div>
    );
  }

  const headerLabel = commentData?.headerLabel ?? 'Comment';
  const courseName = commentData?.courseName ?? thread.lessonName ?? '';
  const comments = commentData?.comments ?? [];

  return (
    <div className="flex-1 flex flex-col bg-primary overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 h-14 px-6 border-b border-[#f0f3f5] shrink-0">
          <Icon name="message-dots" size="sm" />
          <Typography variant="heading-md" color="primary">{headerLabel}</Typography>
          <Typography variant="body-sm" color="tertiary" className="flex-1">{courseName}</Typography>
          <Button variant="ghost" size="sm" onClick={() => {}}>Open Lesson</Button>
        </div>

        {/* Messages — DM-style layout */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="max-w-[768px] mx-auto">
          <div className="flex flex-col">
            {/* Timestamp header */}
            <div className="flex items-center pt-6 pb-2 px-3 border-b border-[#f0f3f5] mb-2">
              <Typography variant="label-xs" color="tertiary">Today</Typography>
            </div>
            {comments.map((comment) => (
              <CommentRow
                key={comment.id}
                comment={comment}
                onProfileOpen={onProfileOpen}
                threadReplies={COURSE_THREAD_REPLIES[comment.id]}
                onOpenThread={openThread}
              />
            ))}
            {comments.length === 0 && (
              <div className="flex gap-3 items-start px-3 py-2">
                <Avatar name={thread.name} size="md" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <Typography variant="heading-sm" color="primary">{thread.name}</Typography>
                  <Typography variant="body-sm" color="primary">{thread.preview}</Typography>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>

        {/* Composer */}
        <div className="px-4 pb-4 shrink-0">
          <div className="max-w-[768px] mx-auto">
          <div className="border border-[#f0f3f5] rounded-2xl overflow-hidden">
            <textarea
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
              placeholder="Message #Discussions"
              className="w-full px-4 py-3 text-sm resize-none outline-none bg-primary min-h-[44px]"
              rows={1}
            />
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center">
                <IconButton icon="hashtag" size="md" variant="ghost" aria-label="Hashtag" />
                <IconButton icon="paperclip" size="md" variant="ghost" aria-label="Attach" />
              </div>
              <IconButton icon="arrow-up" size="md" variant="secondary" disabled aria-label="Send" />
            </div>
          </div>
          </div>
        </div>
      {activeThread && (
        <ThreadPanelV1
          parentMessage={activeThread.parent}
          replies={activeThread.replies}
          onClose={() => setActiveThread(null)}
        />
      )}
    </div>
  );
};

export default CourseCommentsCenterPanelV1;
