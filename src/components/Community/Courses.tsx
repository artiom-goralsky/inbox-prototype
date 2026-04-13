import React from 'react';
import { Badge } from '@circleco/compass/components/Badge';
import { Icon } from '@circleco/compass/components/Icon';
import { Typography } from '@circleco/compass/components/Typography';
import { CommunitySectionHeader } from '@/components/Community/CommunitySectionHeader';

interface Course {
  id: string;
  title: string;
  category: string;
  lessons: number;
  status: 'completed' | 'enrolled' | 'new' | 'upcoming';
  startDate?: string;
  progress?: {
    completed: number;
    total: number;
  };
  coverColor: string;
  coverImage?: string;
}

const Courses: React.FC = () => {
  // Mock data for courses
  const courses: Course[] = [
    {
      id: '1',
      title: 'Collaborative learning: unlocking features for business growth',
      category: 'Basics & Fundamentals',
      lessons: 20,
      status: 'completed',
      startDate: 'Jun 12, 2024',
      coverColor: '#1d74f7',
      coverImage:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
    },
    {
      id: '2',
      title: 'How to secure capital and manage business growth',
      category: 'Basics & Fundamentals',
      lessons: 16,
      status: 'upcoming',
      startDate: 'Jul 24, 2024',
      coverColor: '#0d2d5d',
      coverImage:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    },
    {
      id: '3',
      title: 'Strategies to grow your business without burning out',
      category: 'Expert Insights',
      lessons: 9,
      status: 'enrolled',
      progress: {
        completed: 4,
        total: 9,
      },
      coverColor: '#1d74f7',
      coverImage:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    },
    {
      id: '4',
      title: 'Building a brand that scales',
      category: 'Basics & Fundamentals',
      lessons: 16,
      status: 'new',
      startDate: 'Jul 24, 2024',
      coverColor: '#5d9bf9',
      coverImage:
        'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
    },
  ];

  const getStatusBadge = (status: Course['status']) => {
    switch (status) {
      case 'completed':
        return (
          <div className="absolute top-6 left-6">
            <Badge label="Completed" variant="secondary" />
          </div>
        );
      case 'enrolled':
        return (
          <div className="absolute top-6 left-6">
            <Badge label="Enrolled" variant="primary" />
          </div>
        );
      case 'new':
        return (
          <div className="absolute top-4 left-4">
            <Badge label="New" variant="destructive" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-secondary w-full h-full flex flex-col items-center gap-6 px-6 py-0 overflow-auto">
      {/* Header */}
      <CommunitySectionHeader
        title="Courses"
        actions={
          <>
            <button type="button" className="h-9 px-4 text-sm font-medium border border-primary rounded-lg hover:bg-hover transition-colors">
              Create a course
            </button>
            <button type="button" className="h-9 w-9 rounded-xl border border-primary flex items-center justify-center hover:bg-hover transition-colors" aria-label="More options">
              <Icon name="dot-menu" size="sm" />
            </button>
          </>
        }
      />

      {/* Cover Banner */}
      <div className="bg-primary max-w-[1280px] overflow-hidden relative rounded-2xl shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_3px_12px_-4px_rgba(0,0,0,0.1),0px_4px_16px_-8px_rgba(0,0,0,0.1)] w-full aspect-[894/254] max-h-[363.67px]">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
          alt="Learning"
          className="absolute inset-0 w-full h-full object-cover"
          onError={e => {
            // Fallback to a gradient if image fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-transparent" />

        {/* Content */}
        <div className="absolute left-[75px] top-1/2 -translate-y-1/2 w-[488px] flex flex-col gap-4">
          <Typography
            component="h2"
            variant="heading-2xl"
            color="primary"
          >
            <span className="leading-[48px] tracking-[-1px]">Start learning today.</span>
          </Typography>
          <Typography component="p" variant="body-md" color="secondary">
            <span className="leading-6">Explore expert-led courses designed to help you grow your skills and
            achieve your goals. Join our community and take the next step in
            your learning journey.</span>
          </Typography>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-10 px-5 text-sm font-medium bg-[#506cf0] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Enroll now
              <Icon name="chevron-right" size="sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="flex gap-9 items-start max-w-[1280px] w-full pb-6">
        {courses.map(course => (
          <div key={course.id} className="flex-1 flex flex-col gap-4">
            {/* Course Cover */}
            <div
              className="aspect-[317/200] overflow-hidden relative rounded-3xl w-full"
              style={{ backgroundColor: course.coverColor }}
            >
              {/* Cover Image */}
              {course.coverImage && (
                <img
                  src={course.coverImage}
                  alt={course.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              {/* Overlay for better contrast */}
              <div className="absolute inset-0 bg-black/20" />

              {/* Status Badge */}
              {getStatusBadge(course.status)}

              {/* Progress Bar for enrolled courses */}
              {course.status === 'enrolled' &&
                course.progress &&
                (() => {
                  const progress = course.progress;
                  return (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/20 p-4">
                      <div className="flex gap-[2px] items-center">
                        {Array.from({ length: progress.total }).map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 h-1 rounded-full ${
                              i < progress.completed
                                ? 'bg-[#506cf0]'
                                : 'bg-secondary'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })()}
            </div>

            {/* Course Info */}
            <div className="flex flex-col gap-2">
              <Typography
                component="h3"
                variant="label-lg"
                color="primary"
              >
                <span className="leading-6 tracking-[-0.3px]">{course.title}</span>
              </Typography>
              <div className="flex gap-2 items-center">
                <Typography component="span" variant="body-md" color="secondary">
                  <span className="leading-6">{course.category}</span>
                </Typography>
                <span className="w-[2.5px] h-[2.5px] bg-[#545861] rounded-full" />
                <Typography component="span" variant="body-md" color="secondary">
                  <span className="leading-6">{course.lessons} lessons</span>
                </Typography>
              </div>
              {course.status === 'completed' && course.startDate && (
                <Typography component="p" variant="body-sm" color="tertiary">
                  <span className="leading-5">Started on {course.startDate}</span>
                </Typography>
              )}
              {course.status === 'upcoming' && course.startDate && (
                <Typography component="p" variant="body-sm" color="tertiary">
                  <span className="leading-5">Starts on {course.startDate}</span>
                </Typography>
              )}
              {course.status === 'enrolled' && course.progress && (
                <Typography component="p" variant="body-md" color="secondary">
                  <span className="leading-6">{course.progress.completed} of {course.progress.total}{' '}
                  Completed</span>
                </Typography>
              )}
              {course.status === 'new' && course.startDate && (
                <Typography component="p" variant="body-sm" color="tertiary">
                  <span className="leading-5">Starts on {course.startDate}</span>
                </Typography>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
