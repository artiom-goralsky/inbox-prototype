import React, { useState } from 'react';
import { TextInput } from '@circleco/compass/components/TextInput';
import { Avatar } from '@circleco/compass/components/Avatar';

interface Post {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  images: string[];
  likes: number;
  timestamp: string;
  bio: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
  };
}

interface PostDetailProps {
  post: Post;
  onBack: () => void;
  onUserClick: (user: {
    name: string;
    handle: string;
    avatar: string;
    bio: string;
    socialLinks: any;
  }) => void;
}

const PostDetail: React.FC<PostDetailProps> = ({
  post,
  onBack,
  onUserClick,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleUserClick = () => {
    onUserClick({
      name: post.author,
      handle: post.handle,
      avatar: post.avatar,
      bio: post.bio,
      socialLinks: post.socialLinks,
    });
  };

  return (
    <div className="h-full bg-primary flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-primary">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-active rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-primary">Post</h1>
          </div>
        </div>

        {/* Post Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-2xl mx-auto">
            {/* Author Info */}
            <div className="flex items-center space-x-3 mb-4">
              <div onClick={handleUserClick} className="cursor-pointer">
                <Avatar src={post.avatar} name={post.author} size="md" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleUserClick}
                    className="font-semibold text-primary hover:underline cursor-pointer"
                  >
                    {post.author}
                  </button>
                  <span className="text-tertiary">@{post.handle}</span>
                </div>
                <p className="text-sm text-tertiary">{post.timestamp}</p>
              </div>
              <button className="p-2 hover:bg-active rounded-full transition-colors">
                <svg
                  className="w-5 h-5 text-disabled"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>
            </div>

            {/* Post Text */}
            <div className="mb-6">
              <p className="text-primary text-lg leading-relaxed">
                {post.content}
              </p>
            </div>

            {/* Images Grid */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
                <div className="aspect-4/3">
                  <img
                    src={post.images[0]}
                    alt="Post image 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-rows-2 gap-2">
                  <div className="aspect-4/3">
                    <img
                      src={post.images[1]}
                      alt="Post image 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-4/3">
                    <img
                      src={post.images[2]}
                      alt="Post image 3"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement */}
            <div className="flex items-center justify-between pt-4 border-t border-primary">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center space-x-2 transition-colors ${
                    isLiked
                      ? 'text-red-500'
                      : 'text-disabled hover:text-red-500'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={isLiked ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>

                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`flex items-center space-x-2 transition-colors ${
                    isSaved
                      ? 'text-blue-500'
                      : 'text-disabled hover:text-blue-500'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={isSaved ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Save</span>
                </button>
              </div>

              <button className="flex items-center space-x-2 text-disabled hover:text-secondary transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
                <span className="text-sm font-medium">See post</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l border-primary p-4">
        {/* User Profile Card */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div onClick={handleUserClick} className="cursor-pointer">
              <Avatar src={post.avatar} name={post.author} size="md" />
            </div>
            <div className="flex-1">
              <button
                onClick={handleUserClick}
                className="font-semibold text-primary hover:underline cursor-pointer block"
              >
                {post.author}
              </button>
              <span className="text-tertiary text-sm">@{post.handle}</span>
            </div>
          </div>

          <p className="text-gray-700 text-sm mb-4">{post.bio}</p>

          <div className="flex space-x-2 mb-4">
            {post.socialLinks.linkedin && (
              <button className="px-3 py-1 bg-active text-gray-700 text-sm rounded-full hover:bg-disabled transition-colors">
                in LinkedIn
              </button>
            )}
            {post.socialLinks.twitter && (
              <button className="px-3 py-1 bg-active text-gray-700 text-sm rounded-full hover:bg-disabled transition-colors">
                X @{post.handle}
              </button>
            )}
          </div>

          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
            Follow
          </button>
        </div>

        {/* Ask my AI */}
        <div className="mb-6">
          <h3 className="font-semibold text-primary mb-3">Ask my AI</h3>
          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
            Start a chat
          </button>
        </div>

        {/* Newsletter */}
        <div className="mb-6">
          <h3 className="font-semibold text-primary mb-3">
            Subscribe to my newsletter
          </h3>
          <div className="space-y-2">
            <TextInput
              placeholder="sid@lorenipsum.com"
              className="w-full px-3 py-2 border border-hover rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button className="w-full bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        {/* Join Community */}
        <div>
          <h3 className="font-semibold text-primary mb-3">
            Join Experiential Hospitality
          </h3>
          <p className="text-secondary text-sm mb-4">
            The expert guidance you need to create and operate world-class,
            one-of-a-kind destinations
          </p>
          <div className="bg-active rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-disabled rounded flex items-center justify-center">
                <span className="text-xs font-bold text-secondary">EH</span>
              </div>
              <div className="flex-1">
                <div className="w-full h-2 bg-disabled rounded mb-1"></div>
                <div className="w-3/4 h-2 bg-disabled rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
