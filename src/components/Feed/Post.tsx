import React, { useState } from 'react';
import { Avatar } from '@circleco/compass/components/Avatar';

interface PostProps {
  id: number;
  author: string;
  avatar: string;
  timeAgo: string;
  content: string;
  image: string;
  likes: number;
  isSaved: boolean;
  onPostClick?: (post: any) => void;
  onUserClick?: (user: any) => void;
}

const Post: React.FC<PostProps> = ({
  id,
  author,
  avatar,
  timeAgo,
  content,
  image,
  likes,
  isSaved,
  onPostClick,
  onUserClick,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(isSaved);
  const [currentLikes, setCurrentLikes] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setCurrentLikes(prev => (isLiked ? prev - 1 : prev + 1));
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handlePostClick = (e: React.MouseEvent) => {
    if (onPostClick) {
      // Get the exact click position relative to the viewport
      const clickX = e.clientX;
      const clickY = e.clientY;

      // Create a small rect around the click point for the zoom origin
      const clickRect = {
        left: clickX - 2,
        top: clickY - 2,
        right: clickX + 2,
        bottom: clickY + 2,
        width: 4,
        height: 4,
        x: clickX - 2,
        y: clickY - 2,
      };

      onPostClick({
        id,
        author,
        handle: `@${author.toLowerCase().replace(/\s+/g, '')}`,
        avatar,
        content,
        images: [
          image,
          `https://picsum.photos/400/300?random=${id + 10}`,
          `https://picsum.photos/400/300?random=${id + 20}`,
        ],
        likes: currentLikes,
        timestamp: timeAgo,
        bio: 'Making places that make you feel | Artist, builder, dad | Sold @liveoaklake',
        socialLinks: {
          linkedin: 'in LinkedIn',
          twitter: `X @${author.toLowerCase().replace(/\s+/g, '')}`,
        },
        originRect: clickRect,
      });
    }
  };

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUserClick) {
      onUserClick({
        name: author,
        handle: `@${author.toLowerCase().replace(/\s+/g, '')}`,
        avatar,
        bio: 'Making places that make you feel | Artist, builder, dad | Sold @liveoaklake',
        socialLinks: {
          linkedin: 'in LinkedIn',
          twitter: `X @${author.toLowerCase().replace(/\s+/g, '')}`,
        },
        postCount: 3,
      });
    }
  };

  return (
    <div
      className="p-4 bg-primary hover:bg-secondary transition-colors cursor-pointer"
      onClick={handlePostClick}
    >
      {/* Post Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div onClick={handleUserClick} className="cursor-pointer">
            <Avatar src={avatar} name={author} size="md" />
          </div>
          <div>
            <h3
              className="font-semibold text-primary cursor-pointer hover:underline"
              onClick={handleUserClick}
            >
              {author}
            </h3>
            <p className="text-sm text-tertiary">{timeAgo}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-active rounded-full transition-colors">
          <svg
            className="w-5 h-5 text-disabled"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-primary leading-relaxed">{content}</p>
      </div>

      {/* Post Image */}
      {image && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={image}
            alt="Post content"
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked ? 'text-red-500' : 'text-tertiary hover:text-red-500'
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
            <span className="text-sm font-medium">{currentLikes}</span>
          </button>

          <button className="flex items-center space-x-2 text-tertiary hover:text-blue-500 transition-colors">
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-sm font-medium">Reply</span>
          </button>

          <button className="flex items-center space-x-2 text-tertiary hover:text-green-500 transition-colors">
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
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>

        <button
          onClick={handleBookmark}
          className={`p-2 rounded-full transition-colors ${
            isBookmarked
              ? 'text-blue-500 bg-blue-50'
              : 'text-tertiary hover:text-blue-500 hover:bg-blue-50'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill={isBookmarked ? 'currentColor' : 'none'}
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
    </div>
  );
};

export default Post;
