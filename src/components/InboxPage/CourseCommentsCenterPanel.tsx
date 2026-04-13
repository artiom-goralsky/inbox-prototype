import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Button } from '@circleco/compass/components/Button';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Icon } from '@circleco/compass/components/Icon';

type Role = 'Admin' | 'Editor' | 'Community manager' | null;

interface ThreadComment {
  id: string;
  name: string;
  role: Role;
  bio: string;
  time: string;
  text: string;
  likes: number;
  isSelected?: boolean;
}

interface CommentData {
  selectedName: string;
  courseLesson: string;
  lessonTitle: string;
  thread: ThreadComment[];
}

const COMMENT_DATA: Record<string, CommentData> = {
  '1': {
    selectedName: 'Calvin Parks',
    courseLesson: 'Intro to Photography',
    lessonTitle: 'Welcome to the training',
    thread: [
      {
        id: 'c1',
        name: 'Sarah Chen',
        role: 'Community manager',
        bio: 'Community Manager at Clarity',
        time: '2 days ago',
        text: "Welcome everyone to the Intro to Photography course! I'm so excited to have you all here. This lesson will walk you through the basics of composition and lighting. Feel free to drop any questions in the comments below — I check in daily.",
        likes: 12,
      },
      {
        id: 'c2',
        name: 'Calvin Parks',
        role: null,
        bio: 'Photographer & visual storyteller',
        time: '2m ago',
        text: "Excited to have you here for the training session! I've been waiting for this course for a while. Quick question — will the recordings be available after the live session ends? I might miss the last 20 minutes due to a conflict.",
        likes: 3,
        isSelected: true,
      },
      {
        id: 'c3',
        name: 'Ralph Edwards',
        role: null,
        bio: 'Hobbyist photographer',
        time: '1m ago',
        text: 'Let me go grab some snacks before we start, be right back!',
        likes: 1,
      },
    ],
  },
  '2': {
    selectedName: 'Kristin Watson',
    courseLesson: 'Intro to Photography',
    lessonTitle: 'Lesson 1: Camera basics',
    thread: [
      {
        id: 'd1',
        name: 'Sarah Chen',
        role: 'Community manager',
        bio: 'Community Manager at Clarity',
        time: '3 days ago',
        text: 'In this lesson we cover aperture, shutter speed, and ISO. Make sure you have your camera ready — we will do a live exercise at the end!',
        likes: 8,
      },
      {
        id: 'd2',
        name: 'Kristin Watson',
        role: null,
        bio: 'Learning photography from scratch',
        time: '15m ago',
        text: 'Please let me know if you cover mirrorless cameras too — I have a Sony A7 and I want to make sure the settings translate.',
        likes: 2,
        isSelected: true,
      },
      {
        id: 'd3',
        name: 'Albert Flores',
        role: null,
        bio: 'Street photographer, NYC',
        time: '10m ago',
        text: 'Still trying to play with manual mode, any tips for indoor shots without flash?',
        likes: 0,
      },
    ],
  },
};

const FALLBACK_DATA: CommentData = {
  selectedName: 'User',
  courseLesson: 'Course',
  lessonTitle: 'Lesson',
  thread: [],
};

const ROLE_STYLES: Record<NonNullable<Role>, string> = {
  Admin: 'bg-secondary',
  Editor: 'bg-secondary',
  'Community manager': 'bg-secondary',
};

interface CourseCommentsCenterPanelProps {
  selectedId: string;
  onOpenProfile?: (name: string) => void;
}

const CourseCommentsCenterPanel: React.FC<CourseCommentsCenterPanelProps> = ({ selectedId, onOpenProfile }) => {
  const data = COMMENT_DATA[selectedId] ?? FALLBACK_DATA;

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full bg-primary">
      {/* Header — two lines */}
      <div className="px-4 py-2.5 border-b border-secondary shrink-0">
        {/* Line 1: label + more button */}
        <div className="flex items-center gap-2">
          <Icon name="message" size="sm" color="secondary" />
          <Typography variant="label-sm" color="secondary">
            Comment
          </Typography>
        </div>

        {/* Line 2: course path + open lesson link */}
        <div className="flex items-center gap-2 mt-0.5">
          <Typography variant="caption" color="tertiary" className="truncate flex-1">
            {data.courseLesson} · {data.lessonTitle}
          </Typography>
          <Typography variant="caption" color="link" className="shrink-0 cursor-pointer">
            Open lesson ↗
          </Typography>
        </div>
      </div>

      {/* Comment thread */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col">
        {data.thread.map((comment, idx) => (
          <div key={comment.id}>
            <div className={`py-3 rounded-lg px-3 -mx-3 ${comment.isSelected ? 'bg-warning-light' : ''}`}>
              {/* Author row */}
              <div className="flex items-start gap-3">
                <button
                  className="focus:outline-none shrink-0"
                  onClick={() => onOpenProfile?.(comment.name)}
                  aria-label={`View ${comment.name}'s profile`}
                >
                  <Avatar name={comment.name} size="md" />
                </button>

                <div className="flex-1 min-w-0">
                  {/* Name + role + timestamp */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      className="focus:outline-none"
                      onClick={() => onOpenProfile?.(comment.name)}
                    >
                      <Typography variant="label-sm" color="primary">
                        {comment.name}
                      </Typography>
                    </button>
                    {comment.role && (
                      <div className={`px-2 py-0.5 rounded-full ${ROLE_STYLES[comment.role]}`}>
                        <Typography variant="caption" color="secondary">
                          {comment.role}
                        </Typography>
                      </div>
                    )}
                    <Typography variant="caption" color="tertiary" className="ml-auto shrink-0">
                      {comment.time}
                    </Typography>
                  </div>

                  {/* Bio */}
                  <Typography variant="caption" color="tertiary" className="truncate">
                    {comment.bio}
                  </Typography>

                  {/* Comment body */}
                  <div className="mt-1.5">
                    <Typography variant="body-sm" color="primary">
                      {comment.text}
                    </Typography>
                  </div>

                  {/* Action row */}
                  <div className="flex items-center gap-1 mt-2 -ml-2">
                    <Button variant="ghost" size="sm">Like</Button>
                    <Button variant="ghost" size="sm">Reply</Button>
                    {comment.likes > 0 && (
                      <div className="ml-auto">
                        <Typography variant="caption" color="tertiary">
                          {comment.likes} {comment.likes === 1 ? 'like' : 'likes'}
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Divider between comments */}
            {idx < data.thread.length - 1 && (
              <div className="border-b border-secondary" />
            )}
          </div>
        ))}

        {data.thread.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-16">
            <Typography variant="body-md" color="tertiary">
              No comments yet
            </Typography>
          </div>
        )}
      </div>

      {/* Reply composer */}
      <div className="shrink-0 border-t border-secondary">
        <div className="mx-4 my-3 border border-secondary rounded-2xl shadow-xs px-4 py-3 flex flex-col gap-3">
          <Typography variant="body-md" color="secondary">
            Type to reply...
          </Typography>
          <div className="flex items-center gap-1">
            <IconButton variant="outline" size="sm" icon="hashtag" aria-label="Add topic" />
            <IconButton variant="outline" size="sm" icon="paperclip" aria-label="Attach file" />
            <div className="ml-auto flex items-center gap-1">
              <IconButton variant="ghost" size="sm" icon="microphone" aria-label="Voice message" />
              <IconButton variant="primary" size="sm" icon="arrow-up" aria-label="Send message" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCommentsCenterPanel;
