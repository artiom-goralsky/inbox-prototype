import React, { useState, useEffect } from 'react';
import HorizontalFilters from './HorizontalFilters';
// import Post from './Post'; // Zakomentarisano jer koristimo PostCard
import PostExpansion from './PostExpansion';
// import ContentCards from './ContentCards'; // Zakomentarisano horizontalni scroll sa preview image
import StartPost from './StartPost';
import PostCard from './PostCard';
import Community from '../Community';

export interface FeedProps {
  onUserClick?: (user: any) => void;
  onPostClick?: (post: any) => void;
  community?: string;
}

const Feed: React.FC<FeedProps> = ({
  onUserClick,
  onPostClick,
  community = 'circle',
}) => {
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isPostExpanded, setIsPostExpanded] = useState(false);
  const [isPostLoading, setIsPostLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handlePostClick = (post: any, event?: React.MouseEvent) => {
    // If onPostClick prop is provided, use it for navigation
    if (onPostClick) {
      onPostClick(post);
      return;
    }

    // Otherwise, use local expansion
    const postWithOrigin = {
      ...post,
      originRect: event?.currentTarget?.getBoundingClientRect?.() || null,
    };

    setSelectedPost(postWithOrigin);
    setIsPostExpanded(true);
    setIsPostLoading(true);

    // Simulate loading time
    setTimeout(() => {
      setIsPostLoading(false);
    }, 500);
  };

  // Zakomentarisano jer ne koristimo ContentCards
  // const handleCardClick = (card: any) => {
  //   // Convert card to post format for expansion
  //   const postForExpansion = {
  //     id: card.id,
  //     author: card.source,
  //     avatar: '/images/avatars/1.png',
  //     timeAgo: '1d',
  //     content: `This is a detailed article about "${card.title}". The content would be expanded here with full article text, insights, and analysis.`,
  //     image: card.thumbnail,
  //     likes: Math.floor(Math.random() * 500) + 100,
  //     isSaved: false,
  //     title: card.title,
  //     originRect: card.originRect, // Use the click position from the card
  //   };

  //   setSelectedPost(postForExpansion);
  //   setIsPostExpanded(true);
  //   setIsPostLoading(true);

  //   // Simulate loading time - make it faster
  //   setTimeout(() => {
  //     setIsPostLoading(false);
  //   }, 300);
  // };

  const handleClosePost = () => {
    setIsPostExpanded(false);
    setIsPostLoading(false);
    setSelectedPost(null);
  };

  // Novi postovi koji odgovaraju dizajnu iz Figme
  const [posts] = useState([
    {
      id: 1,
      communityName: 'Framer community',
      communityIcon: '/images/avatars/blue-icon.png',
      author: 'Melissa Emberson',
      authorBio: 'Framer Team Writer',
      avatar: '/images/avatars/1.png',
      timeAgo: 'Sep 10',
      title: "You're using ChatGPT wrong. Here's how to prompt like a pro",
      content:
        'Most people use ChatGPT for quick answers. But reframing the way I understand Large Language Models (LLMs) like ChatGPT or Gemini instantly improved the responses I was able to get. With the right prompts, my responses became sharper, more accurate, and more tailored to my needs.',
      image: undefined,
      likes: 1882,
      comments: 156,
      isSaved: false,
    },
    {
      id: 2,
      communityName: 'future founders community',
      communityIcon: '/images/avatars/black-icon.png',
      author: 'Calvin Parks',
      authorBio: 'Webflow genius',
      avatar: '/images/avatars/2.png',
      timeAgo: 'Sep 10',
      title: "Apple's iPhone 17 just BROKE camera rules forever!",
      content:
        'Apple has recently been accused of having lost its way and no longer innovating.\n\nHell, even I wrote a piece not that long ago saying that the leadership was past it and we needed new, fresh blood.',
      image: 'https://picsum.photos/680/315?random=2',
      likes: 1882,
      comments: 156,
      isSaved: false,
    },
    {
      id: 3,
      communityName: 'Webflow community',
      communityIcon: '/images/clarity-logo.png',
      author: 'Clavin Parks',
      authorBio: 'Webflow genius',
      avatar: '/images/avatars/3.png',
      timeAgo: 'Sep 10',
      title:
        'WTF is vibe marketing, and why is it the future of brand building?',
      content:
        "Welcome to the era of vibe marketing, where how your brand makes people feel isn't just nice-to-have, it's the entire game — especially if you're a challenger brand.",
      image: 'https://picsum.photos/680/315?random=3',
      likes: 1882,
      comments: 156,
      isSaved: false,
    },
  ]);

  // Handle scroll behavior for hiding top controls
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 100;

      if (currentScrollY > scrollThreshold && currentScrollY > lastScrollY) {
        // Scrolling down - hide controls
        setIsScrolled(true);
      } else if (
        currentScrollY < lastScrollY ||
        currentScrollY <= scrollThreshold
      ) {
        // Scrolling up or at top - show controls
        setIsScrolled(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Oprah community content
  if (community === 'oprah') {
    return <Community communityType="oprah" />;
  }

  // Webflow community content
  if (community === 'clarity') {
    return <Community communityType="clarity" />;
  }

  // Future Founders community content - new design based on Figma
  if (community === 'future-founders') {
    return (
      <div className="h-full bg-primary flex">
        {/* Sidebar */}
        <div className="w-[233px] border-r border-primary bg-primary h-full overflow-y-auto flex flex-col">
          <div className="p-5 flex flex-col gap-5">
            {/* Intro Section */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-[10px] py-0 rounded-md h-7 hover:bg-secondary cursor-pointer">
                <div className="w-4 h-4 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M6 1L1 4V10L6 13L11 10V4L6 1Z"
                      stroke="#545861"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-secondary">Feed</span>
              </div>
            </div>

            {/* Welcome Space Group */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-[10px] py-[2px] bg-primary rounded-md">
                <div className="flex items-center gap-[6px]">
                  <span className="text-sm font-semibold text-primary">
                    Welcome
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-[6px]">
                <div className="flex items-center gap-2 px-[10px] py-0 rounded-md h-7 bg-secondary hover:bg-active cursor-pointer">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M6 1L2 4V9L6 12L10 9V4L6 1Z"
                        stroke="#262626"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-secondary">
                    Start Here
                  </span>
                </div>
                <div className="flex items-center gap-2 px-[10px] py-0 rounded-md h-7 hover:bg-secondary cursor-pointer">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M6 1C8.21 1 10 2.79 10 5C10 7.21 8.21 9 6 9C3.79 9 2 7.21 2 5C2 2.79 3.79 1 6 1Z"
                        stroke="#262626"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1 11C1 9.34 3.24 8 6 8C8.76 8 11 9.34 11 11"
                        stroke="#262626"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-secondary">
                    Say Hello
                  </span>
                </div>
              </div>
            </div>

            {/* Community Space Group */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-[10px] py-[2px] bg-primary rounded-md">
                <div className="flex items-center gap-[6px]">
                  <span className="text-sm font-semibold text-primary">
                    Community
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-[6px]">
                {['Announcements', 'Resources', 'Discussions', 'Wins'].map(
                  item => (
                    <div
                      key={item}
                      className="flex items-center gap-2 px-[10px] py-0 rounded-md h-7 hover:bg-secondary cursor-pointer"
                    >
                      <div className="w-4 h-4 flex items-center justify-center">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <circle
                            cx="6"
                            cy="6"
                            r="2"
                            stroke="#2B2E33"
                            strokeWidth="1.2"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-secondary">
                        {item}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Events Space Group */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-[10px] py-[2px] bg-primary rounded-md">
                <div className="flex items-center gap-[6px]">
                  <span className="text-sm font-semibold text-primary">
                    Events
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-[6px]">
                <div className="flex items-center gap-2 px-[10px] py-0 rounded-md h-7 hover:bg-secondary cursor-pointer">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M1 3H11M3 1V5M9 1V5M2 3V10C2 10.55 2.45 11 3 11H9C9.55 11 10 10.55 10 10V3H2Z"
                        stroke="#262626"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-secondary">
                    Recordings
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Go Live Button */}
          <div className="border-t border-primary p-5 mt-auto">
            <button className="w-full h-8 border border-hover rounded-full flex items-center justify-center gap-2 hover:bg-secondary transition-colors">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="text-secondary"
              >
                <path
                  d="M8 2L2 5V11L8 14L14 11V5L8 2Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm font-medium text-secondary">
                Go live
              </span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-secondary">
          {/* Top Navigation */}
          <div className="bg-primary border-b border-primary px-[30px] py-[14px] flex items-center justify-between h-[60px]">
            <div className="flex items-center gap-[6px]">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span className="text-xl font-semibold text-primary">
                Start Here
              </span>
            </div>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                {/* Member Avatars */}
                <div className="flex items-center -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    >
                      {i === 1 ? 'TV' : i === 2 ? 'LC' : 'AB'}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-secondary">+ 233</span>
              </div>
              <button className="bg-blue-600 text-white px-3 py-[6px] rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
                New post
              </button>
              <button className="w-8 h-8 flex items-center justify-center hover:bg-active rounded-md transition-colors">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="text-secondary"
                >
                  <circle cx="8" cy="3" r="1" fill="currentColor" />
                  <circle cx="8" cy="8" r="1" fill="currentColor" />
                  <circle cx="8" cy="13" r="1" fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>

          {/* Cover Section */}
          <div className="relative h-[254px] bg-gradient-to-r from-blue-600 to-blue-700 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-between px-14">
              <div className="flex flex-col gap-2 z-10">
                <div className="inline-flex items-center justify-center px-[6px] py-1 border border-white/30 rounded-md w-fit">
                  <span className="text-xs font-semibold text-white">
                    Get Started
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-white leading-tight max-w-[330px]">
                  Welcome to the Growth Network community
                </h1>
              </div>
              {/* Floating cards */}
              <div className="absolute right-20 top-1/2 -translate-y-1/2 flex gap-2">
                {[
                  'Share your wins',
                  'Growth strategies',
                  'Introduce yourself',
                ].map((text, idx) => (
                  <div
                    key={idx}
                    className="backdrop-blur-sm bg-primary/92 border border-white/20 rounded-full px-3 py-1 flex items-center gap-[6px]"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-300 to-blue-500"></div>
                    <span className="text-xs font-semibold text-primary">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feed Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-[567px] mx-auto flex flex-col gap-[30px]">
              {/* Start a post */}
              <div className="bg-primary border border-primary rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[14px]">
                    <img
                      src="/images/avatars/1.png"
                      alt="Avatar"
                      className="w-[30px] h-[30px] rounded-full"
                    />
                    <span className="text-xs text-tertiary">Start a post</span>
                  </div>
                  <button className="w-[30px] h-[30px] bg-disabled rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      className="text-secondary"
                    >
                      <path
                        d="M6 1V11M1 6H11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Posts */}
              <div className="bg-primary border border-primary rounded-lg overflow-hidden">
                <div className="p-5 flex flex-col gap-5">
                  {/* Post Header */}
                  <div className="flex gap-[10px] items-start">
                    <img
                      src="/images/avatars/1.png"
                      alt="Avatar"
                      className="w-[34px] h-[34px] rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-[6px]">
                        <span className="text-sm font-semibold text-primary">
                          Aisha Khan
                        </span>
                        <button className="w-5 h-5 flex items-center justify-center hover:bg-active rounded transition-colors">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="text-secondary"
                          >
                            <circle cx="8" cy="3" r="1" fill="currentColor" />
                            <circle cx="8" cy="8" r="1" fill="currentColor" />
                            <circle cx="8" cy="13" r="1" fill="currentColor" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-tertiary">
                        <span>Jun 30</span>
                        <span>•</span>
                        <span>Business Expert</span>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="flex flex-col gap-[10px]">
                    <h2 className="text-xl font-semibold text-primary">
                      Welcome to the Business Growth Community!
                    </h2>
                    <p className="text-sm text-secondary leading-5">
                      Hey there! 👋 We&apos;re so excited to have you join us.
                      <br />
                      This space is all about learning, sharing, and growing
                      together as we navigate the world of business. Whether
                      you&apos;re an entrepreneur, freelancer, or part of a
                      growing team — you belong here.
                    </p>
                    <div className="w-full h-[295px] bg-blue-900 rounded-md mt-[10px] flex items-center justify-center">
                      <span className="text-white text-sm">Post Media</span>
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-[10px] border-t border-secondary">
                    <div className="flex items-center gap-[10px]">
                      <button className="w-5 h-5 flex items-center justify-center">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M8 2L10.5 6.5L15.5 7.5L12 11L12.5 16L8 13.5L3.5 16L4 11L0.5 7.5L5.5 6.5L8 2Z"
                            fill="#FF4D4D"
                          />
                        </svg>
                      </button>
                      <button className="w-5 h-5 flex items-center justify-center">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M2 3H14M2 8H14M2 13H14"
                            stroke="#545861"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center -space-x-1">
                        {[1, 2, 3].map(i => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full border-2 border-white bg-blue-400"
                          ></div>
                        ))}
                      </div>
                      <span className="text-xs text-secondary">153 likes</span>
                      <span className="text-xs text-disabled">•</span>
                      <span className="text-xs text-tertiary">29 comments</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default Circle community content
  return (
    <div className="h-full bg-primary flex flex-col main-content-container">
      {/* Horizontal Filters */}
      <div
        className={` transition-transform duration-300 ease-out ${
          isScrolled ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <HorizontalFilters />
      </div>

      {/* Content Cards Slider - Zakomentarisano horizontalni scroll sa preview image */}
      {/* <div className="px-6">
        <ContentCards onCardClick={handleCardClick} />
      </div> */}

      {/* Main Feed Content */}
      <div className="flex-1 overflow-y-auto overflow-x-visible mb-4 p-8">
        <div className="max-w-2xl mx-auto">
          {/* Start a post komponenta */}
          <div className="mb-9">
            <StartPost />
          </div>

          {/* Posts Feed */}
          <div className="flex flex-col gap-9">
            {posts.map(post => (
              <React.Fragment key={post.id}>
                <PostCard
                  communityName={post.communityName}
                  communityIcon={post.communityIcon}
                  authorName={post.author}
                  authorAvatar={post.avatar}
                  authorBio={post.authorBio}
                  date={post.timeAgo}
                  title={post.title}
                  content={post.content}
                  image={post.image}
                  likes={post.likes}
                  comments={post.comments}
                  onPostClick={(event: React.MouseEvent) =>
                    handlePostClick(post, event)
                  }
                  onUserClick={onUserClick}
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      {/* Post Expansion */}
      {isPostExpanded && selectedPost && (
        <PostExpansion
          post={selectedPost}
          isVisible={isPostExpanded}
          isLoading={isPostLoading}
          onClose={handleClosePost}
          originRect={selectedPost.originRect}
        />
      )}
    </div>
  );
};

export default Feed;
