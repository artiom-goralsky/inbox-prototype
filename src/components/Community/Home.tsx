import React, { useRef, useEffect, useState } from 'react';
import { Avatar } from '@circleco/compass/components/Avatar';
import { AvatarGroup } from '@circleco/compass/components/AvatarGroup';
import { Icon } from '@circleco/compass/components/Icon';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Button } from '@circleco/compass/components/Button';
import { Divider } from '@circleco/compass/components/Divider';
import { Typography } from '@circleco/compass/components/Typography';
import PostCard from '@/components/Feed/PostCard';

const POSTS = [
  {
    id: 1,
    spaceName: 'Start Here',
    author: 'Melissa Emberson',
    avatar: '/images/avatars/5.png',
    timeAgo: '2d',
    title: 'Welcome to the Clarity Community!',
    content:
      "Hey there! 👋 We're so excited to have you join us.\n\nThis space is all about learning, sharing, and growing together as we navigate the world of business. Whether you're an entrepreneur, freelancer, or part of a growing team — you belong here.",
    image: '/images/placeholders/image-1.png',
    likes: 1882,
    comments: 156,
  },
  {
    id: 2,
    spaceName: 'Discussions',
    author: 'Calvin Parks',
    avatar: '/images/avatars/2.png',
    timeAgo: 'Sep 10',
    title: "You're using ChatGPT wrong. Here's how to prompt like a pro",
    content:
      'Most people use ChatGPT for quick answers. But reframing the way I understand Large Language Models (LLMs) like ChatGPT or Gemini instantly improved the responses I was able to get.',
    image: undefined,
    likes: 743,
    comments: 89,
  },
  {
    id: 3,
    spaceName: 'Resources',
    author: 'Ava Johnson',
    avatar: '/images/avatars/3.png',
    timeAgo: 'Sep 8',
    title: "Apple's iPhone 17 just BROKE camera rules forever!",
    content:
      'Apple has recently been accused of having lost its way and no longer innovating. Hell, even I wrote a piece not that long ago saying that the leadership was past it.',
    image: 'https://picsum.photos/544/315?random=2',
    likes: 1204,
    comments: 231,
  },
];

interface HomeProps {
  communityType?: 'oprah' | 'clarity' | 'framer' | 'default';
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

const Home: React.FC<HomeProps> = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => setIsScrolled(el.scrollTop > 10);
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="flex-1 h-full flex flex-col bg-secondary overflow-hidden min-w-0">

      {/* ── Sticky header ── */}
      <div className={`shrink-0 bg-secondary z-10 transition-all duration-200 ${isScrolled ? 'border-b border-secondary' : 'pt-3'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}>
        <div className="max-w-[1280px] mx-auto px-9">
          <div className={`flex items-center justify-between gap-3 transition-all duration-200 ${isScrolled ? 'py-3' : 'py-6'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}>
            {/* Space label */}
            <Typography variant={isScrolled ? 'heading-sm' : 'heading-xl'} color="primary">Feed</Typography>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <div className="pr-1">
                <AvatarGroup size="xs" spacing={-4} aria-label="Active members">
                  <Avatar size="xs" src="/images/avatars/1.png" name="Samantha" />
                  <Avatar size="xs" src="/images/avatars/2.png" name="Ava" />
                  <Avatar size="xs" src="/images/avatars/3.png" name="Oliver" />
                </AvatarGroup>
              </div>
              <IconButton
                type="button"
                variant="ghost"
                size="sm"
                icon="sparkle"
                aria-label="Members"
              />
              <Button variant="primary" size="sm">
                New post
              </Button>
              <IconButton
                type="button"
                variant="outline"
                size="sm"
                icon="dot-menu"
                aria-label="More options"
              />
            </div>
          </div>
        </div>

        {/* Divider — only when scrolled */}
        {isScrolled && <Divider orientation="horizontal" />}
      </div>

      {/* ── Scrollable content ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto px-9 pt-4 flex justify-center">
          <div className="w-full max-w-[678px] flex flex-col gap-4">

            {/* Welcome / featured card */}
            <div className="bg-primary border border-primary rounded-2xl overflow-hidden shadow-2xs">
              {/* Illustration header */}
              <div className="bg-[#c8d4f7] h-[200px] relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#8fa6ee] via-[#c8d4f7] to-[#dce4fa]" />
                <div className="relative flex items-center justify-center gap-4 opacity-80">
                  <div className="w-16 h-16 rounded-2xl bg-white/40 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-[#4a6bc8]"><Icon name="group" size="lg" /></span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/40 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-[#4a6bc8]"><Icon name="sparkle-filled" size="md" /></span>
                  </div>
                </div>
              </div>

              {/* Card content */}
              <div className="px-6 py-6 flex flex-col gap-4">
                <Typography variant="heading-2xl" color="primary">
                  Start connecting with other community builders
                </Typography>
                <p className="text-base text-secondary leading-6">
                  Hey there! 👋 We&apos;re so excited to have you join us.
                </p>
                <p className="text-base text-secondary leading-6">
                  This space is all about learning, sharing, and growing together as we
                  navigate the world of business. Whether you&apos;re an entrepreneur,
                  freelancer, or part of a growing team — you belong here.
                </p>
                <button
                  type="button"
                  className="w-fit flex items-center gap-2 px-4 h-9 rounded-lg border border-primary text-sm font-medium text-primary hover:bg-hover transition-colors"
                >
                  Start connecting
                  <Icon name="arrow-right" size="sm" />
                </button>
              </div>
            </div>

            {/* Start a post */}
            <div className="bg-primary border border-primary rounded-2xl shadow-2xs">
              <div className="flex items-center gap-4 px-6 py-5">
                <Avatar size="sm" src="/images/avatars/4.png" name="Me" />
                <span className="flex-1 text-base text-tertiary">Start a post...</span>
                <button
                  type="button"
                  className="size-8 rounded-xl bg-secondary hover:bg-hover transition-colors flex items-center justify-center"
                  aria-label="Create post"
                >
                  <Icon name="arrow-up" size="sm" />
                </button>
              </div>
            </div>

            {/* Post feed */}
            {POSTS.map(post => (
              <PostCard
                key={post.id}
                spaceName={post.spaceName}
                authorName={post.author}
                authorAvatar={post.avatar}
                timeAgo={post.timeAgo}
                title={post.title}
                content={post.content}
                image={post.image}
                likes={post.likes}
                comments={post.comments}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
