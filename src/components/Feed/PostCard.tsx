import React from 'react';
import { Avatar } from '@circleco/compass/components/Avatar';
import { AvatarGroup } from '@circleco/compass/components/AvatarGroup';
import { Icon } from '@circleco/compass/components/Icon';
import { IconButton } from '@circleco/compass/components/IconButton';

interface PostCardProps {
  spaceName?: string;
  authorName: string;
  authorAvatar: string;
  timeAgo: string;
  title: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  liked?: boolean;
  onPostClick?: (event: React.MouseEvent) => void;
  onUserClick?: (user: any) => void;
  // kept for compat but unused in new design
  communityName?: string;
  communityIcon?: string;
  authorBio?: string;
  date?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  spaceName = 'Start Here',
  authorName,
  authorAvatar,
  timeAgo,
  title,
  content,
  image,
  likes,
  comments,
  liked = false,
  onPostClick,
  onUserClick,
}) => {
  return (
    <div
      className="bg-primary border border-primary rounded-2xl overflow-hidden cursor-pointer shadow-2xs hover:shadow-sm transition-shadow"
      onClick={onPostClick}
    >
      <div className="px-6 py-6 flex flex-col gap-6">
        {/* Author row */}
        <div className="flex gap-3 items-start w-full">
          <div
            className="shrink-0 cursor-pointer"
            onClick={e => {
              e.stopPropagation();
              onUserClick?.({ name: authorName, avatar: authorAvatar });
            }}
          >
            <Avatar src={authorAvatar} name={authorName} size="sm" />
          </div>

          <div className="flex flex-1 flex-col gap-0.5 min-w-0">
            {/* Name + time inline, actions on right */}
            <div className="flex items-start justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-primary leading-5">{authorName}</span>
                <span className="text-sm text-tertiary leading-5">{timeAgo}</span>
              </div>
              <div className="flex items-center gap-0.5 shrink-0 ml-2">
                <button
                  type="button"
                  className="h-8 px-3 rounded-lg flex items-center text-sm font-medium text-primary hover:bg-hover transition-colors"
                  onClick={e => e.stopPropagation()}
                >
                  Share
                </button>
                <IconButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon="bookmark"
                  aria-label="Save"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                />
                <IconButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon="dot-menu"
                  aria-label="More"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                />
              </div>
            </div>
            {/* Space name */}
            <span className="text-sm text-tertiary leading-5">Posted in {spaceName}</span>
          </div>
        </div>

        {/* Post content */}
        <div className="flex flex-col gap-4">
          <p
            className="text-[20px] font-semibold text-primary leading-7"
            style={{ letterSpacing: '-0.4px' }}
          >
            {title}
          </p>
          <p className="text-base text-secondary leading-6">
            {content}
          </p>
          {image && (
            <div className="w-full rounded-xl overflow-hidden mt-1">
              <img
                src={image}
                alt="Post image"
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </div>

        {/* Reactions row */}
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-2 items-center">
            <button
              type="button"
              className={`size-9 rounded-xl flex items-center justify-center bg-secondary hover:bg-hover transition-colors ${liked ? 'text-red-500' : ''}`}
              onClick={e => e.stopPropagation()}
              aria-label="Like"
            >
              <Icon name="heart" size="sm" />
            </button>
            <button
              type="button"
              className="size-9 rounded-xl flex items-center justify-center bg-secondary hover:bg-hover transition-colors"
              onClick={e => e.stopPropagation()}
              aria-label="Comment"
            >
              <Icon name="message-text" size="sm" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <div className="pr-1">
              <AvatarGroup size="xxs" spacing={-4} aria-label="Users who liked">
                <Avatar size="xxs" src="/images/avatars/1.png" name="User 1" />
                <Avatar size="xxs" src="/images/avatars/2.png" name="User 2" />
                <Avatar size="xxs" src="/images/avatars/3.png" name="User 3" />
              </AvatarGroup>
            </div>
            <button
              type="button"
              className="h-8 px-2 rounded-lg flex items-center text-sm font-medium text-primary hover:bg-hover transition-colors"
              onClick={e => e.stopPropagation()}
            >
              {likes.toLocaleString()} likes
            </button>
            <button
              type="button"
              className="h-8 px-2 rounded-lg flex items-center text-sm font-medium text-primary hover:bg-hover transition-colors"
              onClick={e => e.stopPropagation()}
            >
              {comments.toLocaleString()} comments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
