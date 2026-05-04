import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@circleco/compass/components/Button';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Icon } from '@circleco/compass/components/Icon';
import { Typography } from '@circleco/compass/components/Typography';
import { Divider } from '@circleco/compass/components/Divider';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  timezone: string;
  coverImage?: string;
  description: string;
  tags: {
    type: 'countdown' | 'live' | 'host' | 'attendees' | 'price';
    label: string;
    value?: string;
  }[];
  status: 'upcoming' | 'past';
  rsvpStatus?:
    | 'rsvp'
    | 'going'
    | 'not-going'
    | 'sold-out'
    | 'event-full'
    | 'buy-ticket';
  month: string;
  year: number;
}

const Events: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => setIsScrolled(el.scrollTop > 10);
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  const [activeFilter, setActiveFilter] = useState<'upcoming' | 'past'>(
    'upcoming'
  );
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'calendar'>(
    'list'
  );

  // Local image URLs
  const monetizingImage =
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop';

  // Mock data for events
  const events: Event[] = [
    {
      id: '1',
      title: 'Monetizing your Circle 101',
      date: 'Saturday, Jul 29',
      time: '5:00 PM - 6:00 PM',
      timezone: '(GMT)',
      coverImage: monetizingImage,
      description:
        'We know that creating truly transformative learning experiences for your members requires a lot of intentional behind-the-scenes work. Between identifying a strong course topic and...',
      tags: [
        { type: 'countdown', label: 'Starts in 2 weeks' },
        { type: 'live', label: 'Live stream' },
        { type: 'host', label: 'Mathilde Leo' },
        { type: 'attendees', label: '43 Attendees' },
      ],
      status: 'upcoming',
      rsvpStatus: 'rsvp',
      month: 'July',
      year: 2024,
    },
    {
      id: '2',
      title: 'Engagement Resource Roundup',
      date: 'Wednesday, Sep 30',
      time: '8:00 pm',
      timezone: '(GMT)',
      coverImage:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
      description:
        'Join us for a comprehensive roundup of engagement resources and strategies to help grow your community.',
      tags: [{ type: 'live', label: 'Live stream' }],
      status: 'upcoming',
      rsvpStatus: 'rsvp',
      month: 'September',
      year: 2024,
    },
    {
      id: '3',
      title: 'Community Building Workshop',
      date: 'Wednesday, Sep 30',
      time: '8:00 pm',
      timezone: '(GMT)',
      coverImage:
        'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=600&fit=crop',
      description:
        'Learn the fundamentals of building and nurturing a thriving online community.',
      tags: [{ type: 'live', label: 'Live stream' }],
      status: 'upcoming',
      rsvpStatus: 'going',
      month: 'September',
      year: 2024,
    },
    {
      id: '4',
      title: 'Content Strategy Masterclass',
      date: 'Wednesday, Sep 30',
      time: '8:00 pm',
      timezone: '(GMT)',
      coverImage:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
      description:
        'Master the art of content creation and strategy to engage your audience effectively.',
      tags: [{ type: 'live', label: 'Live stream' }],
      status: 'upcoming',
      rsvpStatus: 'not-going',
      month: 'September',
      year: 2024,
    },
    {
      id: '5',
      title: 'Advanced Monetization Techniques',
      date: 'Wednesday, Sep 30',
      time: '8:00 pm',
      timezone: '(GMT)',
      coverImage:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      description:
        'Discover advanced strategies for monetizing your community and maximizing revenue.',
      tags: [
        { type: 'live', label: 'Live stream' },
        { type: 'price', label: '$49' },
      ],
      status: 'upcoming',
      rsvpStatus: 'sold-out',
      month: 'September',
      year: 2024,
    },
    {
      id: '6',
      title: 'Premium Community Management',
      date: 'Wednesday, Sep 30',
      time: '8:00 pm',
      timezone: '(GMT)',
      coverImage:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      description:
        'Learn premium techniques for managing and scaling your community successfully.',
      tags: [
        { type: 'live', label: 'Live stream' },
        { type: 'price', label: '$199' },
      ],
      status: 'upcoming',
      rsvpStatus: 'buy-ticket',
      month: 'September',
      year: 2024,
    },
    {
      id: '7',
      title: 'Member Retention Strategies',
      date: 'Wednesday, Oct 15',
      time: '8:00 pm',
      timezone: '(GMT)',
      coverImage:
        'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop',
      description:
        'Explore proven strategies to improve member retention and reduce churn.',
      tags: [{ type: 'live', label: 'Live stream' }],
      status: 'upcoming',
      rsvpStatus: 'event-full',
      month: 'October',
      year: 2024,
    },
    // Past events
    {
      id: '8',
      title: 'Getting Started with Circles',
      date: 'Wednesday, Aug 15',
      time: '8:00 pm',
      timezone: '(GMT)',
      coverImage:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      description:
        'A comprehensive introduction to creating and managing your first Circle community.',
      tags: [{ type: 'live', label: 'Live stream' }],
      status: 'past',
      month: 'August',
      year: 2024,
    },
    {
      id: '9',
      title: 'Growth Hacking for Communities',
      date: 'Friday, Aug 10',
      time: '6:00 pm',
      timezone: '(GMT)',
      coverImage:
        'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
      description:
        'Learn growth hacking techniques specifically tailored for community platforms.',
      tags: [{ type: 'live', label: 'Live stream' }],
      status: 'past',
      month: 'August',
      year: 2024,
    },
  ];

  const filteredEvents = events.filter(event => event.status === activeFilter);
  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const nextEvent = upcomingEvents[0];

  // Group events by month
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const key = `${event.month} ${event.year}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const renderEventCard = (event: Event) => {
    const iconNameByTagType: Record<
      Event['tags'][number]['type'],
      React.ComponentProps<typeof Icon>['name']
    > = {
      countdown: 'clock',
      live: 'live',
      host: 'people',
      attendees: 'people',
      price: 'ticket',
    };

    return (
      <div className="bg-primary rounded-2xl shadow-2xs p-5 w-full">
        {/* Cover Image */}
        <div className="h-[244px] w-full rounded-2xl overflow-hidden mb-5 bg-[#0d2d5d] relative">
          {event.coverImage ? (
            <img
              alt={event.title}
              className="w-full h-full object-cover"
              src={event.coverImage}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Typography
                component="p"
                variant="heading-xl"
                color="inverse"
              >
                <span className="opacity-20">Event Cover</span>
              </Typography>
            </div>
          )}
        </div>

        {/* Event Info */}
        <div className="flex gap-9 items-start mb-5">
          <div className="flex flex-1 flex-col gap-4 items-start">
            <div className="flex flex-col gap-3 items-start w-full">
              <Typography
                component="h3"
                variant="heading-lg"
                color="primary"
              >
                <span className="leading-[32px] tracking-[-0.6px]">{event.title}</span>
              </Typography>
              <div className="flex gap-3 items-center justify-end w-full text-sm font-medium">
                <Typography
                  component="p"
                  variant="body-sm"
                  color="tertiary"
                  className="flex-1"
                >
                  {event.date}, {event.time} {event.timezone}
                </Typography>
                {event.rsvpStatus === 'rsvp' && (
                  <Typography
                    component="p"
                    variant="body-sm"
                    color="secondary"
                  >
                    <span className="text-[#f5a607]">Only a few spots left</span>
                  </Typography>
                )}
                {event.rsvpStatus === 'sold-out' && (
                  <Typography
                    component="p"
                    variant="body-sm"
                    color="secondary"
                  >
                    <span className="text-[#f5a607]">Only a few spots left</span>
                  </Typography>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            {getRSVPButton(event)}
            <button type="button" className="h-8 w-8 rounded-lg border border-primary flex items-center justify-center hover:bg-hover transition-colors" aria-label="More options">
              <Icon name="dot-menu" size="sm" />
            </button>
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <div className="mb-5">
            <Typography
              component="p"
              variant="body-md"
              color="primary"
            >
              <span className="leading-6 line-clamp-3">{event.description}</span>
            </Typography>
          </div>
        )}

        {/* Tags */}
        <div className="flex gap-2 items-start flex-wrap">
          {event.tags.map((tag, index) => (
            <div
              key={index}
              className={`h-8 px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium uppercase ${
                tag.type === 'countdown'
                  ? 'bg-secondary text-secondary'
                  : 'bg-secondary text-tertiary'
              }`}
            >
              <div className="w-4 h-4"><Icon
                name={iconNameByTagType[tag.type]}
                size="sm"
              /></div>
              <Typography
                component="span"
                variant="label-sm"
              >
                <span className="uppercase">{tag.label}</span>
              </Typography>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getRSVPButton = (event: Event) => {
    switch (event.rsvpStatus) {
      case 'rsvp':
        return (
          <button type="button" className="h-8 px-3 text-sm font-medium bg-[#506cf0] text-white rounded-lg hover:opacity-90 transition-opacity">
            RSVP
          </button>
        );
      case 'going':
        return (
          <button type="button" className="text-sm font-semibold border border-primary rounded-lg px-3 h-8 flex items-center gap-2 hover:bg-hover transition-colors">
            Going
            <Icon name="chevron-down" size="sm" />
          </button>
        );
      case 'not-going':
        return (
          <button type="button" className="text-sm font-semibold border border-primary rounded-lg px-3 h-8 flex items-center gap-2 hover:bg-hover transition-colors">
            Not going
            <Icon name="chevron-down" size="sm" />
          </button>
        );
      case 'sold-out':
        return (
          <button type="button" disabled className="text-sm font-semibold bg-secondary rounded-lg px-3 h-8 opacity-50 cursor-not-allowed">
            Sold Out
          </button>
        );
      case 'event-full':
        return (
          <button type="button" disabled className="text-sm font-semibold bg-secondary rounded-lg px-3 h-8 opacity-50 cursor-not-allowed">
            Event is full
          </button>
        );
      case 'buy-ticket':
        return (
          <button type="button" className="text-sm font-semibold border border-primary rounded-lg px-3 h-8 hover:bg-hover transition-colors">
            Buy a ticket
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-secondary overflow-hidden min-w-0">
      {/* Sticky header */}
      <div className={`shrink-0 bg-secondary z-10 transition-all duration-200 ${isScrolled ? 'border-b border-secondary' : 'pt-3'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}>
        <div className="max-w-[1280px] mx-auto px-9">
          <div className={`flex items-center justify-between gap-3 transition-all duration-200 ${isScrolled ? 'py-3' : 'py-6'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}>
            <Typography variant={isScrolled ? 'heading-sm' : 'heading-xl'} color="primary">Events</Typography>
            <div className="flex items-center gap-2">
              <div className="bg-primary flex gap-1 h-9 items-center p-1 rounded-2xl shadow-2xs border border-primary">
                <IconButton variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" icon="bullet-list" aria-label="List view" onClick={() => setViewMode('list')} />
                <IconButton variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" icon="layout-grid" aria-label="Grid view" onClick={() => setViewMode('grid')} />
                <IconButton variant={viewMode === 'calendar' ? 'secondary' : 'ghost'} size="sm" icon="calendar" aria-label="Calendar view" onClick={() => setViewMode('calendar')} />
              </div>
              <Button variant="primary" size="sm">New event</Button>
              <IconButton variant="outline" size="sm" icon="dot-menu" aria-label="More options" />
            </div>
          </div>
        </div>
        {isScrolled && <Divider orientation="horizontal" />}
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
      <div className="flex flex-col gap-10 items-center max-w-[1280px] mx-auto px-9 pt-4 w-full">
      {/* Content */}
      <div className="flex flex-col gap-10 items-center max-w-[680px] w-full">
        {/* Tabs and Next Event Section */}
        <div className="flex flex-col gap-6 items-start w-full">
          {/* Tabs */}
          <div className="flex gap-1 items-center">
            <button
              type="button"
              className={`h-9 px-4 rounded-lg text-sm font-medium transition-colors ${activeFilter === 'upcoming' ? 'border border-primary bg-primary' : 'hover:bg-hover'}`}
              onClick={() => setActiveFilter('upcoming')}
            >
              Upcoming
            </button>
            <button
              type="button"
              className={`h-9 px-4 rounded-lg text-sm font-medium transition-colors ${activeFilter === 'past' ? 'border border-primary bg-primary' : 'hover:bg-hover'}`}
              onClick={() => setActiveFilter('past')}
            >
              Past
            </button>
          </div>

          {/* Next Event (only for upcoming) */}
          {activeFilter === 'upcoming' && nextEvent && (
            <>
              <Typography
                component="h2"
                variant="heading-md"
                color="primary"
              >
                <span className="leading-[28px] tracking-[-0.4px]">Next event</span>
              </Typography>
              {renderEventCard(nextEvent)}
            </>
          )}

          {/* Events by Month */}
          {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
            <div key={monthYear} className="w-full flex flex-col gap-4">
              <Typography
                component="h3"
                variant="heading-md"
                color="primary"
              >
                <span className="leading-[28px] tracking-[-0.4px]">{monthYear}</span>
              </Typography>
              <div className="flex flex-col gap-4">
                {monthEvents.map(event => (
                  <div key={event.id}>{renderEventCard(event)}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default Events;
