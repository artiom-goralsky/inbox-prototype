import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Button } from '@circleco/compass/components/Button';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Badge } from '@circleco/compass/components/Badge';
import { Icon } from '@circleco/compass/components/Icon';
import { SegmentedControl } from '@circleco/compass/components/SegmentedControl';

// ── Types ─────────────────────────────────────────────────────────────

interface Lesson {
  id: string;
  title: string;
  status: 'published' | 'draft';
  thumbnail: string;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

// ── Data ──────────────────────────────────────────────────────────────

const INITIAL_SECTIONS: Section[] = [
  {
    id: 's1',
    title: 'Arriving',
    lessons: [
      { id: 'l1',  title: 'Welcome — Why You\'re Here (And Why That\'s Enough)', status: 'published', thumbnail: '/images/course/course-1.png' },
      { id: 'l2',  title: 'Your First Sit — 5 Minutes of Breath Awareness',      status: 'published', thumbnail: '/images/course/course-2.png' },
      { id: 'l3',  title: 'The Wandering Mind — Why Distraction Isn\'t Failure', status: 'published', thumbnail: '/images/course/course-3.png' },
      { id: 'l4',  title: 'Morning Ritual — Building a Practice That Fits Your Life', status: 'draft', thumbnail: '/images/course/course-4.png' },
      { id: 'l5',  title: 'Journaling Prompt — What Does Stillness Feel Like?',  status: 'draft',     thumbnail: '/images/course/course-5.png' },
    ],
  },
  {
    id: 's2',
    title: 'Noticing',
    lessons: [
      { id: 'l6',  title: 'Body Scan — Listening to What\'s Already There',      status: 'published', thumbnail: '/images/course/course-6.png' },
      { id: 'l7',  title: 'Walking Meditation — Presence in Motion',             status: 'draft',     thumbnail: '/images/course/course-1.png' },
      { id: 'l8',  title: 'Emotions as Weather — Observing Without Reacting',    status: 'draft',     thumbnail: '/images/course/course-2.png' },
      { id: 'l9',  title: 'Partner Reflection — Sharing What You Noticed This Week', status: 'draft', thumbnail: '/images/course/course-3.png' },
      { id: 'l10', title: 'Letting Go of "Doing It Right"',                      status: 'draft',     thumbnail: '/images/course/course-4.png' },
    ],
  },
  {
    id: 's3',
    title: 'Staying',
    lessons: [
      { id: 'l11', title: 'Sitting Longer — From 5 Minutes to 15',               status: 'published', thumbnail: '/images/course/course-5.png' },
      { id: 'l12', title: 'Working With Resistance — The Days You Don\'t Want To', status: 'draft',   thumbnail: '/images/course/course-6.png' },
      { id: 'l13', title: 'Gratitude Practice — Closing the Loop',               status: 'draft',     thumbnail: '/images/course/course-1.png' },
      { id: 'l14', title: 'Your Practice Going Forward — A Letter to Yourself',  status: 'draft',     thumbnail: '/images/course/course-2.png' },
    ],
  },
];

// ── Main component ────────────────────────────────────────────────────

interface CourseDetailPanelProps {
  onClose: () => void;
  onSeeAllCourses?: () => void;
}

const CourseDetailPanel: React.FC<CourseDetailPanelProps> = ({ onClose, onSeeAllCourses }) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
  const [isPublishing, setIsPublishing] = useState(false);

  const totalLessons = sections.reduce((n, s) => n + s.lessons.length, 0);
  const subtitle = `${sections.length} sections · ${totalLessons} lessons`;

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setSections(prev =>
        prev.map(section => ({
          ...section,
          lessons: section.lessons.map(lesson => ({ ...lesson, status: 'published' as const })),
        }))
      );
      setIsPublishing(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-primary border-l border-secondary min-w-0">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="shrink-0 grid grid-cols-3 items-center gap-2 px-4 py-3 border-b border-secondary">
        <Typography variant="label-sm" color="secondary" className="truncate font-semibold">
          Course
        </Typography>

        <div className="flex justify-center">
          <SegmentedControl
            required
            value={mode}
            onValueChange={(val) => setMode(val as 'view' | 'edit')}
            options={[
              { value: 'view', label: 'View' },
              { value: 'edit', label: 'Edit' },
            ]}
          />
        </div>

        <div className="flex items-center justify-end gap-1">
          {onSeeAllCourses && (
            <Button type="button" variant="ghost" size="sm" onClick={onSeeAllCourses}>
              See all courses
            </Button>
          )}
          <IconButton
            type="button"
            variant="ghost"
            size="sm"
            icon="cross"
            aria-label="Close"
            onClick={onClose}
          />
        </div>
      </div>

      {/* ── Edit toolbar ─────────────────────────────────────────────── */}
      {mode === 'edit' && (
        <div className="shrink-0 flex items-center gap-1 px-4 py-2 border-b border-secondary">
          <Button type="button" variant="ghost" size="sm">Public</Button>
          <div className="w-px h-4 bg-secondary mx-1" />
          <Button type="button" variant="ghost" size="sm">Structured</Button>
          <div className="w-px h-4 bg-secondary mx-1" />
          <Button type="button" variant="ghost" size="sm">Free</Button>
          <div className="flex-1" />
          <Button type="button" variant="outline" size="sm">Add lesson</Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            loading={isPublishing}
            onClick={handlePublish}
          >
            Publish
          </Button>
        </div>
      )}

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {mode === 'view' ? (
          <ViewContent sections={sections} subtitle={subtitle} />
        ) : (
          <EditContent sections={sections} setSections={setSections} subtitle={subtitle} />
        )}
      </div>
    </div>
  );
};

// ── View mode ─────────────────────────────────────────────────────────

const ViewContent: React.FC<{ sections: Section[]; subtitle: string }> = ({ sections, subtitle }) => (
  <div className="bg-secondary min-h-full flex flex-col items-center py-8 px-6">
    <div className="w-full max-w-[880px] flex flex-col gap-6">
    {/* Hero */}
    <img
      src="/images/course-hero.png"
      alt="Course hero"
      className="w-full rounded-2xl object-cover shrink-0"
      style={{ height: 278 }}
    />

    {/* Title */}
    <div className="flex flex-col gap-1">
      <Typography variant="heading-lg" color="primary">
        <span className="font-bold">Finding calm: a journey to inner peace</span>
      </Typography>
      <Typography variant="body-sm" color="secondary">{subtitle}</Typography>
    </div>

    {/* Lesson list */}
    <div
      className="bg-primary border border-secondary rounded-xl overflow-hidden"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      {sections.map((section, sIdx) => (
        <React.Fragment key={section.id}>
          {/* Section row */}
          <div className={`flex items-center gap-3 px-5 py-3 ${sIdx > 0 ? 'border-t border-secondary' : ''}`}>
            <Typography variant="label-sm" color="primary">
              <span className="font-semibold">{section.title}</span>
            </Typography>
            <Typography variant="body-sm" color="tertiary">
              {section.lessons.length} lessons
            </Typography>
          </div>

          {/* Lesson rows */}
          {section.lessons.map(lesson => (
            <div
              key={lesson.id}
              className="flex items-center gap-3 px-5 py-2.5 pl-10 border-t border-secondary"
            >
              <img
                src={lesson.thumbnail}
                alt={lesson.title}
                className="shrink-0 rounded-md object-cover"
                style={{ width: 64, height: 40 }}
              />
              <Typography variant="body-sm" color="primary">
                {lesson.title}
              </Typography>
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
    </div>
  </div>
);

// ── Edit mode ─────────────────────────────────────────────────────────

interface EditContentProps {
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  subtitle: string;
}

const EditContent: React.FC<EditContentProps> = ({ sections, setSections, subtitle }) => {
  const [dragging, setDragging] = useState<{ sectionId: string; lessonId: string } | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = (sectionId: string, lessonId: string) => {
    setDragging({ sectionId, lessonId });
  };

  const handleDragOver = (e: React.DragEvent, lessonId: string) => {
    e.preventDefault();
    setDragOverId(lessonId);
  };

  const handleDrop = (e: React.DragEvent, tgtSectionId: string, tgtLessonId: string) => {
    e.preventDefault();
    if (!dragging || dragging.lessonId === tgtLessonId) return;

    setSections(prev => {
      const next = prev.map(s => ({ ...s, lessons: [...s.lessons] }));
      const src = next.find(s => s.id === dragging.sectionId)!;
      const tgt = next.find(s => s.id === tgtSectionId)!;

      const srcIdx = src.lessons.findIndex(l => l.id === dragging.lessonId);
      if (srcIdx === -1) return prev;
      const [lesson] = src.lessons.splice(srcIdx, 1);

      const tgtIdx = tgt.lessons.findIndex(l => l.id === tgtLessonId);
      tgt.lessons.splice(tgtIdx, 0, lesson);
      return next;
    });

    setDragging(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDragging(null);
    setDragOverId(null);
  };

  return (
    <div className="flex flex-col items-center py-8 px-6 gap-5">
      <div className="w-full max-w-[880px] flex flex-col gap-6">
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <Typography variant="heading-lg" color="primary">
          <span className="font-bold">Lessons</span>
        </Typography>
        <Typography variant="body-sm" color="secondary">{subtitle}</Typography>
      </div>

      {/* Sections card */}
      <div
        className="bg-primary border border-secondary rounded-xl overflow-hidden"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      >
        {sections.map((section, sIdx) => (
          <React.Fragment key={section.id}>
            {/* Section header */}
            <div className={`flex items-center gap-2 px-4 py-3 ${sIdx > 0 ? 'border-t border-secondary' : ''}`}>
              <span className="shrink-0 text-tertiary cursor-grab">
                <Icon name="drag" size="sm" />
              </span>
              <Typography variant="label-sm" color="primary">
                <span className="font-semibold">{section.title}</span>
              </Typography>
            </div>

            {/* Lesson rows */}
            {section.lessons.map(lesson => (
              <div
                key={lesson.id}
                draggable
                onDragStart={() => handleDragStart(section.id, lesson.id)}
                onDragOver={e => handleDragOver(e, lesson.id)}
                onDrop={e => handleDrop(e, section.id, lesson.id)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 px-4 py-2.5 pl-10 border-t border-secondary transition-colors cursor-grab select-none ${
                  dragOverId === lesson.id && dragging?.lessonId !== lesson.id
                    ? 'bg-hover'
                    : dragging?.lessonId === lesson.id
                    ? 'opacity-40 bg-secondary'
                    : ''
                }`}
              >
                <span className="shrink-0 text-tertiary">
                  <Icon name="drag" size="sm" />
                </span>

                <img
                  src={lesson.thumbnail}
                  alt={lesson.title}
                  className="shrink-0 rounded-md object-cover"
                  style={{ width: 64, height: 40 }}
                />

                <Typography variant="body-sm" color="primary" className="flex-1 min-w-0 truncate">
                  {lesson.title}
                </Typography>

                <Badge
                  label={lesson.status === 'published' ? 'Published' : 'Draft'}
                  variant={lesson.status === 'published' ? 'success' : 'secondary'}
                />

                <IconButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon="dot-menu"
                  aria-label="More options"
                />
              </div>
            ))}

            {/* Add new */}
            <div className="pl-10 pr-4 py-2 border-t border-secondary">
              <Button type="button" variant="ghost" size="sm" startIcon="plus">
                Add new
              </Button>
            </div>
          </React.Fragment>
        ))}
      </div>
      </div>
    </div>
  );
};

export default CourseDetailPanel;
