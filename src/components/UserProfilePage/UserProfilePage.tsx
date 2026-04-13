import React, { useState } from 'react';
import { TextInput } from '@circleco/compass/components/TextInput';
import { Avatar } from '@circleco/compass/components/Avatar';

interface User {
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
  };
  postCount: number;
}

interface Post {
  id: string;
  content: string;
  images: string[];
  likes: number;
  timestamp: string;
}

interface UserProfilePageProps {
  user: User;
  onBack: () => void;
  onPostClick: (post: Post) => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({
  user,
  onBack,
  onPostClick,
}) => {
  const [activeTab, setActiveTab] = useState('activity');

  // Mock posts data
  const posts: Post[] = [
    {
      id: '1',
      content:
        "Most of rural America is sitting on a goldmine: untapped land, untold stories, and unpolished beauty. And of all the experiential hospitality concepts I've come across, this is the one I'm most bullish on: Farm Hospitality",
      images: [
        'https://picsum.photos/400/300?random=1',
        'https://picsum.photos/400/300?random=2',
        'https://picsum.photos/400/300?random=3',
      ],
      likes: 926,
      timestamp: '2d',
    },
    {
      id: '2',
      content:
        'Another amazing post about rural development and hospitality innovation. The potential is truly incredible when we think about sustainable tourism.',
      images: [
        'https://picsum.photos/400/300?random=4',
        'https://picsum.photos/400/300?random=5',
      ],
      likes: 342,
      timestamp: '5d',
    },
    {
      id: '3',
      content:
        'Building communities through thoughtful design and authentic experiences. This is what drives me every day.',
      images: ['https://picsum.photos/400/300?random=6'],
      likes: 189,
      timestamp: '1w',
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'activity':
        return (
          <div className="space-y-6">
            {posts.map(post => (
              <div
                key={post.id}
                className="border border-primary rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onPostClick(post)}
              >
                {/* Post Header */}
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar src={user.avatar} name={user.name} size="md" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-primary">
                        {user.name}
                      </span>
                      <span className="text-tertiary text-sm">
                        {post.timestamp}
                      </span>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-active rounded-full transition-colors">
                    <svg
                      className="w-4 h-4 text-disabled"
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

                {/* Post Content */}
                <p className="text-primary mb-4">{post.content}</p>

                {/* Post Images */}
                {post.images.length > 0 && (
                  <div className="mb-4">
                    {post.images.length === 1 ? (
                      <img
                        src={post.images[0]}
                        alt="Post"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {post.images.slice(0, 4).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Post ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Engagement */}
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 text-disabled hover:text-red-500 transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="none"
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
                    <span className="text-sm">{post.likes}</span>
                  </button>

                  <button className="flex items-center space-x-2 text-disabled hover:text-blue-500 transition-colors">
                    <svg
                      className="w-4 h-4"
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
                    <span className="text-sm">Save</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'products':
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-active rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-disabled"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-primary mb-2">
              No products yet
            </h3>
            <p className="text-tertiary">
              Products will appear here when available
            </p>
          </div>
        );

      case 'highlights':
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-active rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-disabled"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-primary mb-2">
              No highlights yet
            </h3>
            <p className="text-tertiary">
              Highlights will appear here when available
            </p>
          </div>
        );

      default:
        return null;
    }
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
            <h1 className="text-lg font-semibold text-primary">{user.name}</h1>
            <span className="text-tertiary">{user.postCount} posts</span>
          </div>
        </div>

        {/* Profile Section */}
        <div className="p-4 border-b border-primary">
          <div className="flex items-start space-x-4">
            <Avatar
              src={user.avatar}
              name={user.name}
              size="lg"
              className="w-20 h-20"
            />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-primary">
                {user.name}
              </h2>
              <p className="text-tertiary">@{user.handle}</p>
              <p className="text-gray-700 mt-2">{user.bio}</p>

              <div className="flex items-center space-x-4 mt-4">
                {user.socialLinks.linkedin && (
                  <button className="px-3 py-1 bg-active text-gray-700 text-sm rounded-full hover:bg-disabled transition-colors">
                    in LinkedIn
                  </button>
                )}
                {user.socialLinks.twitter && (
                  <button className="px-3 py-1 bg-active text-gray-700 text-sm rounded-full hover:bg-disabled transition-colors">
                    X @{user.handle}
                  </button>
                )}
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Follow
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-primary">
          <div className="flex space-x-8 px-4">
            {[
              { id: 'activity', label: 'Activity' },
              { id: 'products', label: 'Products' },
              { id: 'highlights', label: 'Highlights' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-tertiary hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-2xl mx-auto">{renderContent()}</div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l border-primary p-4">
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

export default UserProfilePage;
