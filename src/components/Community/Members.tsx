import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Badge } from '@circleco/compass/components/Badge';
import { Button } from '@circleco/compass/components/Button';
import { Icon } from '@circleco/compass/components/Icon';
import { Typography } from '@circleco/compass/components/Typography';
import { Divider } from '@circleco/compass/components/Divider';

interface Member {
  id: string;
  name: string;
  title: string;
  location: string;
  mutualConnections?: number;
  avatar?: string;
  tags?: string[];
  bio?: string;
  isConnected?: boolean;
  message?: string;
}

const Members: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => setIsScrolled(el.scrollTop > 10);
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  // Mock data
  const currentUser = {
    name: 'Carlos Ramirez',
    title: 'Customer support specialist',
    location: 'Seattle, WA',
    avatar: '/images/avatars/1.png',
    coverImage: '/images/placeholders/image-1.png',
    stats: {
      allMembers: 489,
      myConnections: 8,
    },
  };

  const connectionRequests: Member[] = [
    {
      id: '1',
      name: 'Javier Morales',
      title: 'Customer support specialist',
      location: 'San Francisco, CA',
      mutualConnections: 23,
      avatar: '/images/avatars/2.png',
      message:
        'Hi Sarah! I really enjoyed your recent post about design systems in the Product group—your insi ... See more',
    },
    {
      id: '2',
      name: 'Trish Stefano',
      title: 'Full stack developer',
      location: 'San Francisco, CA',
      mutualConnections: 23,
      avatar: '/images/avatars/3.png',
    },
  ];

  const recommendations: Member[] = [
    {
      id: '3',
      name: 'Macy Graham',
      title: 'Full stack developer',
      location: 'San Francisco, CA',
      mutualConnections: 23,
      avatar: '/images/avatars/4.png',
    },
    {
      id: '4',
      name: 'Lisa Carter',
      title: 'Full stack developer',
      location: 'San Francisco, CA',
      mutualConnections: 23,
      avatar: '/images/avatars/5.png',
    },
  ];

  const allMembers: Member[] = [
    {
      id: '5',
      name: 'Emma Johnson',
      title: 'Full stack developer',
      location: 'San Francisco, CA',
      mutualConnections: 23,
      avatar: '/images/avatars/6.png',
      tags: ['Pro', 'Editor'],
      isConnected: true,
    },
    {
      id: '6',
      name: 'Naomi Smith',
      title: 'Full stack developer',
      location: 'San Francisco, CA',
      mutualConnections: 23,
      avatar: '/images/avatars/7.png',
      tags: ['Pro', 'Editor'],
      isConnected: true,
    },
    {
      id: '7',
      name: 'Liam Carter',
      title: 'Full stack developer',
      location: 'San Francisco, CA',
      mutualConnections: 23,
      avatar: '/images/avatars/8.png',
      tags: ['Pro', 'Editor'],
      isConnected: true,
      bio: "Longtime Ayurvedic practitioner, and yoga teacher. She's on a mission to dispel dietary myths and make healthy habits accessible to ever and this bio will go full width and will look like this when you are not able to truncate and this allows us to show two li... See more",
    },
    {
      id: '8',
      name: 'Isabella Martinez',
      title: 'Full stack developer',
      location: 'San Francisco, CA',
      mutualConnections: 23,
      avatar: '/images/avatars/1.png',
      tags: ['Pro', 'Editor'],
      isConnected: true,
    },
  ];

  return (
    <div className="flex-1 h-full flex flex-col bg-secondary overflow-hidden min-w-0">
      {/* Sticky header */}
      <div className={`shrink-0 bg-secondary z-10 transition-all duration-200 ${isScrolled ? 'border-b border-secondary' : 'pt-3'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}>
        <div className="max-w-[1280px] mx-auto px-9">
          <div className={`flex items-center justify-between gap-3 transition-all duration-200 ${isScrolled ? 'py-3' : 'py-6'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}>
            <Typography variant={isScrolled ? 'heading-sm' : 'heading-xl'} color="primary">Members</Typography>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Manage</Button>
            </div>
          </div>
        </div>
        {isScrolled && <Divider orientation="horizontal" />}
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
      <div className="flex flex-col items-center gap-6 px-9 pt-4 max-w-[1280px] mx-auto w-full">
      {/* Main Content */}
      <div className="flex flex-1 gap-6 items-start max-w-[1280px] w-full">
        {/* Left Sidebar - Profile Info */}
        <div className="flex flex-col gap-6 items-start w-[296px] shrink-0">
          <div className="bg-primary border border-primary rounded-2xl shadow-2xs w-full">
            <div className="flex flex-col gap-7 items-center overflow-hidden pb-3 pt-6 px-3">
              {/* Profile Picture */}
              <div className="flex flex-col gap-4 items-center justify-center">
                <div className="shrink-0 size-[88px]">
                  <Avatar
                    src={currentUser.avatar}
                    name={currentUser.name}
                  />
                </div>
                <div className="flex flex-col gap-8 items-center w-[187px]">
                  <div className="flex flex-col gap-3 items-start w-full">
                    <div className="flex flex-col gap-1 items-center text-center w-full">
                      <Typography
                        component="p"
                        variant="label-lg"
                        color="primary"
                      >
                        <span className="leading-6">{currentUser.name}</span>
                      </Typography>
                      <Typography
                        component="p"
                        variant="body-sm"
                        color="secondary"
                      >
                        <span className="leading-5">{currentUser.title}</span>
                      </Typography>
                    </div>
                    <div className="flex gap-1 items-center justify-center w-full">
                      <div className="w-4 h-4 text-tertiary"><Icon
                        name="map-pin"
                        size="sm"
                      /></div>
                      <Typography
                        component="p"
                        variant="label-sm"
                        color="secondary"
                      >
                        {currentUser.location}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-col gap-2 items-start w-full mt-4">
                <div className="bg-secondary h-px shrink-0 w-full" />
                <div className="flex flex-col items-start w-full">
                  <div className="flex flex-col h-10 items-start w-full">
                    <div className="bg-secondary flex gap-2 h-10 items-center overflow-hidden px-3 py-3 rounded-lg w-full">
                      <div className="flex flex-1 items-center justify-between">
                        <Typography
                          component="p"
                          variant="label-md"
                          color="primary"
                        >
                          All members
                        </Typography>
                        <Typography
                          component="p"
                          variant="body-sm"
                          color="secondary"
                        >
                          {currentUser.stats.allMembers}
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col h-10 items-start w-full">
                    <div className="bg-primary flex gap-2 h-10 items-center overflow-hidden px-3 py-3 rounded-lg w-full">
                      <div className="flex flex-1 items-center justify-between">
                        <Typography
                          component="p"
                          variant="label-md"
                          color="primary"
                        >
                          My connections
                        </Typography>
                        <Typography
                          component="p"
                          variant="body-sm"
                          color="secondary"
                        >
                          {currentUser.stats.myConnections}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex flex-1 flex-col gap-10 h-full items-start">
          {/* Requests Section */}
          <div className="flex flex-col gap-8 items-start w-full">
            <div className="bg-primary border border-primary rounded-2xl shadow-2xs w-full">
              <div className="flex flex-col gap-1 items-start overflow-hidden w-full">
                {/* Header */}
                <div className="bg-primary border-b border-primary  rounded-2xl relative shrink-0 w-full ">
                  <div className="flex items-center justify-between overflow-hidden px-6 py-3 w-full">
                    <div className="flex gap-2 h-7 items-center px-0 py-1.5">
                      <Typography
                        component="p"
                        variant="label-lg"
                        color="primary"
                      >
                        Requests
                      </Typography>
                      <Badge label="3" variant="destructive" />
                    </div>
                  </div>
                </div>

                {/* Request Items */}
                <div className="flex flex-col items-start w-full">
                  {connectionRequests.map((request, index) => (
                    <div
                      key={request.id}
                      className={`bg-primary border-b border-primary relative shrink-0 w-full ${
                        index === connectionRequests.length - 1
                          ? ''
                          : 'border-b'
                      }`}
                    >
                      <div className="flex items-center justify-between overflow-hidden px-6 py-5 w-full">
                        <div className="flex flex-1 gap-4 items-start">
                          <div className="shrink-0 size-10">
                            <Avatar
                              src={request.avatar}
                              name={request.name}
                            />
                          </div>
                          <div className="flex flex-1 gap-6 items-start">
                            <div className="flex flex-1 flex-col gap-2 items-start">
                              <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col gap-2 items-start">
                                  <Typography
                                    component="p"
                                    variant="label-md"
                                    color="primary"
                                  >
                                    {request.name}
                                  </Typography>
                                  <Typography
                                    component="p"
                                    variant="body-sm"
                                    color="secondary"
                                  >
                                    {request.title}
                                  </Typography>
                                </div>
                                <div className="flex gap-2 items-start">
                                  <button type="button" className="h-8 px-4 rounded-3xl text-sm font-medium border border-primary hover:bg-hover transition-colors">
                                    Ignore
                                  </button>
                                  <button type="button" className="h-8 px-4 rounded-3xl text-sm font-medium bg-[#506cf0] text-white hover:opacity-90 transition-opacity">
                                    Accept
                                  </button>
                                </div>
                              </div>
                              <div className="flex gap-4 items-start">
                                <div className="flex gap-1 items-center">
                                  <div className="w-4 h-4 text-tertiary"><Icon
                                    name="map-pin"
                                    size="sm"
                                  /></div>
                                  <Typography
                                    component="p"
                                    variant="label-sm"
                                    color="secondary"
                                  >
                                    {request.location}
                                  </Typography>
                                </div>
                                {request.mutualConnections && (
                                  <div className="flex gap-1 items-center">
                                    <div className="w-4 h-4 text-tertiary"><Icon
                                      name="people"
                                      size="sm"
                                    /></div>
                                    <Typography
                                      component="p"
                                      variant="label-sm"
                                      color="secondary"
                                    >
                                      {request.mutualConnections} mutual
                                      connections
                                    </Typography>
                                  </div>
                                )}
                              </div>
                              {request.message && (
                                <div className="bg-secondary flex gap-2 items-center overflow-hidden px-3 py-2.5 rounded-xl w-full">
                                  <Typography
                                    component="p"
                                    variant="body-sm"
                                    color="primary"
                                    className="flex-1"
                                  >
                                    <span className="leading-4">{request.message}</span>
                                  </Typography>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="bg-secondary flex items-center justify-center overflow-hidden rounded-b-2xl px-6 py-1 w-full">
                    <button type="button" className="h-8 px-4 rounded-3xl text-sm font-medium hover:bg-hover transition-colors">
                      Show more
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations Section */}
            <div className="bg-primary border border-primary rounded-2xl shadow-2xs w-full">
              <div className="flex flex-col gap-1 items-start overflow-hidden w-full">
                {/* Header */}
                <div className="bg-primary border-b border-primary relative shrink-0 w-full  rounded-2xl">
                  <div className="flex items-center justify-between overflow-hidden px-6 py-3 w-full">
                    <div className="flex gap-2 h-7 items-center px-0 py-1.5">
                      <Typography
                        component="p"
                        variant="label-lg"
                        color="primary"
                      >
                        Recommendations
                      </Typography>
                      <Badge label="16" variant="secondary" />
                    </div>
                  </div>
                </div>

                {/* Recommendation Items */}
                <div className="flex flex-col items-start w-full">
                  {recommendations.map((rec, index) => (
                    <div
                      key={rec.id}
                      className={`bg-primary border-b border-primary relative shrink-0 w-full ${
                        index === recommendations.length - 1 ? '' : 'border-b'
                      }`}
                    >
                      <div className="flex items-center justify-between overflow-hidden px-6 py-5 w-full">
                        <div className="flex flex-1 gap-4 items-start">
                          <div className="shrink-0 size-10">
                            <Avatar
                              src={rec.avatar}
                              name={rec.name}
                            />
                          </div>
                          <div className="flex flex-1 gap-6 items-start">
                            <div className="flex flex-1 flex-col gap-2.5 items-start">
                              <div className="flex gap-2.5 items-start w-full">
                                <div className="flex flex-1 flex-col gap-2.5 items-start">
                                  <Typography
                                    component="p"
                                    variant="label-md"
                                    color="primary"
                                  >
                                    {rec.name}
                                  </Typography>
                                  <Typography
                                    component="p"
                                    variant="body-sm"
                                    color="secondary"
                                  >
                                    {rec.title}
                                  </Typography>
                                </div>
                                <div className="flex gap-2 items-start">
                                  <button type="button" className="h-8 px-4 rounded-3xl text-sm font-medium border border-primary flex items-center gap-2 hover:bg-hover transition-colors">
                                    <Icon name="plus" size="sm" />
                                    Connect
                                  </button>
                                  <button type="button" className="size-8 rounded-full flex items-center justify-center hover:bg-hover transition-colors" aria-label="Dismiss recommendation">
                                    <Icon name="cross" size="sm" />
                                  </button>
                                </div>
                              </div>
                              <div className="flex gap-4 items-start">
                                <div className="flex gap-1 items-center">
                                  <div className="w-4 h-4 text-tertiary"><Icon
                                    name="map-pin"
                                    size="sm"
                                  /></div>
                                  <Typography
                                    component="p"
                                    variant="label-sm"
                                    color="secondary"
                                  >
                                    {rec.location}
                                  </Typography>
                                </div>
                                {rec.mutualConnections && (
                                  <div className="flex gap-1 items-center">
                                    <div className="w-4 h-4 text-tertiary"><Icon
                                      name="people"
                                      size="sm"
                                    /></div>
                                    <Typography
                                      component="p"
                                      variant="label-sm"
                                      color="secondary"
                                    >
                                      {rec.mutualConnections} mutual connections
                                    </Typography>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="bg-secondary flex items-center justify-center overflow-hidden rounded-b-2xl px-6 py-1 w-full">
                    <button type="button" className="h-8 px-4 rounded-3xl text-sm font-medium hover:bg-hover transition-colors">
                      Show more
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* All Members Section */}
          <div className="flex flex-col gap-6 items-start w-full">
            <div className="flex gap-2 items-center">
              <Typography
                component="p"
                variant="heading-md"
                color="primary"
              >
                <span className="leading-7">All members</span>
              </Typography>
              <div className="bg-secondary flex flex-col gap-2 items-center justify-center overflow-hidden px-1.5 py-0.5 rounded-3xl">
                <Typography component="p" variant="label-sm" color="primary">
                  489
                </Typography>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 items-start w-full">
              <div className="flex gap-2 items-center">
                <button type="button" className="h-8 rounded-full pl-2.5 pr-3 py-1.5 text-sm font-medium border border-primary flex items-center gap-2 hover:bg-hover transition-colors">
                  <Icon name="map-pin" size="sm" />
                  Near me
                </button>
                {['Name', 'Headline', 'Bio', 'Location', 'Role'].map(filter => (
                  <button
                    key={filter}
                    type="button"
                    className="h-8 px-[18px] py-1.5 rounded-full text-sm font-medium border border-primary hover:bg-hover transition-colors"
                  >
                    {filter}
                  </button>
                ))}
                <button type="button" className="size-8 rounded-3xl border border-primary flex items-center justify-center hover:bg-hover transition-colors" aria-label="Add filter">
                  <Icon name="plus" size="sm" />
                </button>
              </div>
            </div>

            {/* Members List */}
            <div className="flex flex-1 flex-col gap-8 items-start w-full">
              <div className="flex flex-col gap-6 items-start w-full">
                {allMembers.map(member => (
                  <div
                    key={member.id}
                    className="bg-primary border border-primary rounded-2xl shadow-2xs w-full"
                  >
                    <div className="flex flex-col gap-5 items-start justify-center overflow-hidden p-6 w-full">
                      <div className="flex gap-6 items-start w-full">
                        <div className="shrink-0 size-16">
                          <Avatar
                            src={member.avatar}
                            name={member.name}
                          />
                        </div>
                        <div className="flex flex-1 flex-col gap-4 items-start">
                          <div className="flex flex-col gap-2.5 items-start w-full">
                            <div className="flex gap-2.5 items-start w-full">
                              <div className="flex flex-1 flex-col gap-1 items-start">
                                <Typography
                                  component="p"
                                  variant="label-lg"
                                  color="primary"
                                >
                                  <span className="leading-6">{member.name}</span>
                                </Typography>
                                <Typography
                                  component="p"
                                  variant="body-sm"
                                  color="secondary"
                                >
                                  <span className="leading-4">{member.title}</span>
                                </Typography>
                              </div>
                              <div className="flex gap-2 items-center justify-end">
                                {member.isConnected && (
                                  <Badge
                                    label="Connected"
                                    variant="secondary"
                                    icon="checkmark-small"
                                  />
                                )}
                                <button type="button" className="h-8 w-8 rounded-3xl border border-primary flex items-center justify-center hover:bg-hover transition-colors" aria-label="Member options">
                                  <Icon name="dot-menu" size="sm" />
                                </button>
                              </div>
                            </div>
                            <div className="flex gap-4 items-start">
                              <div className="flex gap-1 items-center">
                                <div className="w-4 h-4 text-tertiary"><Icon
                                  name="map-pin"
                                  size="sm"
                                /></div>
                                <Typography
                                  component="p"
                                  variant="label-sm"
                                  color="secondary"
                                >
                                  {member.location}
                                </Typography>
                              </div>
                              {member.mutualConnections && (
                                <div className="flex gap-1 items-center">
                                  <div className="w-4 h-4 text-tertiary"><Icon
                                    name="people"
                                    size="sm"
                                  /></div>
                                  <Typography
                                    component="p"
                                    variant="label-sm"
                                    color="secondary"
                                  >
                                    {member.mutualConnections} mutual
                                    connections
                                  </Typography>
                                </div>
                              )}
                            </div>
                            {member.bio && (
                              <Typography
                                component="p"
                                variant="body-sm"
                                color="secondary"
                              >
                                <span className="leading-5">{member.bio}</span>
                              </Typography>
                            )}
                          </div>
                          {member.tags && member.tags.length > 0 && (
                            <div className="flex gap-1.25 items-center">
                              {member.tags.slice(0, 2).map((tag, index) => (
                                <Badge
                                  key={index}
                                  label={tag}
                                  variant="secondary"
                                  emoji={tag === 'Pro' ? '💪' : '✍️'}
                                />
                              ))}
                              {member.tags.length > 2 && (
                                <Badge
                                  label={`+${member.tags.length - 2} more`}
                                  variant="secondary"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default Members;
