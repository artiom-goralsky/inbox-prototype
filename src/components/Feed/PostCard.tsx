import React from 'react';
import { Avatar } from '@circleco/compass/components/Avatar';
import { AvatarGroup } from '@circleco/compass/components/AvatarGroup';

interface PostCardProps {
  communityName: string;
  communityIcon?: string;
  authorName: string;
  authorAvatar: string;
  authorBio: string;
  date: string;
  title: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  liked?: boolean;
  onPostClick?: (event: React.MouseEvent) => void;
  onUserClick?: (user: any) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  communityName,
  communityIcon,
  authorName,
  authorAvatar,
  authorBio,
  date,
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
      className="bg-primary border border-primary rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={onPostClick}
    >
      {/* Community Header */}
      <div className="flex gap-2 h-11 items-center px-6 py-0">
        {communityIcon ? (
          <div className="w-6 h-6 rounded-lg overflow-hidden">
            <img
              src={communityIcon}
              alt={communityName}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {communityName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <p className="flex-1 text-xs font-semibold text-secondary uppercase tracking-wider">
          {communityName}
        </p>
      </div>

      {/* Divider */}
      <div className="bg-disabled h-px w-full" />

      {/* Image (if provided) */}
      {image && (
        <div className="w-full h-64 relative">
          <img
            src={image}
            alt="Post image"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Post Body */}
      <div className="px-6 py-6">
        <div className="flex flex-col gap-6">
          {/* Author Info & Post Content */}
          <div className="flex flex-col gap-5">
            {/* Author Info & Content */}
            <div className="flex flex-col gap-5">
              {/* Avatar & Info */}
              <div className="flex gap-3 items-center w-full">
                <div
                  className="cursor-pointer hover:ring-2 hover:ring-blue-500 transition-shadow rounded-full"
                  onClick={e => {
                    e.stopPropagation(); // Sprečava otvaranje post modala
                    onUserClick?.({
                      name: authorName,
                      avatar: authorAvatar,
                      bio: authorBio,
                    });
                  }}
                >
                  <Avatar src={authorAvatar} name={authorName} size="md" />
                </div>
                <div className="flex flex-1 flex-col">
                  {/* Top Row */}
                  <div className="flex h-[22px] items-start justify-between w-full">
                    <div className="flex flex-1 gap-2 items-start">
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold text-primary leading-5">
                          {authorName}
                        </p>
                      </div>
                    </div>
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.0042 9.61512C16.0042 10.38 15.3844 10.9998 14.6195 10.9998C13.8547 10.9998 13.2349 10.38 13.2349 9.61512C13.2349 8.85055 13.8547 8.23047 14.6195 8.23047C15.3844 8.23047 16.0042 8.85055 16.0042 9.61512Z"
                          fill="#545861"
                        />
                        <path
                          d="M11.387 9.61512C11.387 10.38 10.7672 10.9998 10.0023 10.9998C9.23748 10.9998 8.61768 10.38 8.61768 9.61512C8.61768 8.85055 9.23748 8.23047 10.0023 8.23047C10.7672 8.23047 11.387 8.85055 11.387 9.61512Z"
                          fill="#545861"
                        />
                        <path
                          d="M6.76931 9.61509C6.76931 10.3799 6.14938 10.9997 5.38465 10.9997C4.61993 10.9997 4 10.3799 4 9.61509C4 8.85053 4.61993 8.23047 5.38465 8.23047C6.14938 8.23047 6.76931 8.85053 6.76931 9.61509Z"
                          fill="#545861"
                        />
                      </svg>
                    </div>
                  </div>
                  {/* Meta Info */}
                  <div className="flex gap-2 items-center">
                    <div className="flex gap-[10px] items-center justify-center">
                      <p className="text-sm text-tertiary leading-5">{date}</p>
                    </div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full" />
                    <div className="flex gap-[10px] items-center justify-center">
                      <p className="text-sm text-tertiary leading-5 text-ellipsis overflow-hidden whitespace-nowrap max-w-96">
                        {authorBio}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="flex flex-col items-center w-full">
                <div className="flex flex-col gap-4 items-start w-full">
                  {/* Post Title */}
                  <div className="flex gap-[10px] items-center justify-center w-full">
                    <p className="flex-1 text-[2rem] font-bold text-primary leading-10 tracking-tight">
                      {title}
                    </p>
                  </div>
                  {/* Post Body */}
                  <div className="flex gap-[10px] items-center justify-center w-full">
                    <p className="flex-1 text-base text-tertiary leading-6">
                      {content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Post Actions */}
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-3 items-start">
              {/* Like Button */}
              <button
                className={`w-9 h-9 flex items-center justify-center hover:scale-110 rounded-lg bg-secondary transition-transform ${
                  liked ? 'text-red-500' : 'text-disabled'
                }`}
                onClick={e => {
                  e.stopPropagation(); // Sprečava otvaranje post modala
                  // TODO: Implementirati like funkcionalnost
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 8.08577C10 2.12845 2.5 2.91724 2.5 8.9464C2.5 14.9756 12 20 12 20C12 20 21.5 14.9755 21.5 8.94639C21.5 2.91723 14 2.12845 12 8.08577Z"
                    stroke="#545861"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {/* Comment Button */}
              <button
                className="w-9 h-9 flex items-center justify-center text-disabled rounded-lg bg-secondary hover:scale-110 transition-transform"
                onClick={e => {
                  e.stopPropagation(); // Sprečava otvaranje post modala
                  // TODO: Implementirati comment funkcionalnost
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.50977 19.8018C8.83126 20.5639 10.3645 21 11.9996 21C16.9702 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.6351 3.43604 15.1684 4.19819 16.4899L4.20114 16.495C4.27448 16.6221 4.31146 16.6863 4.32821 16.7469C4.34401 16.804 4.34842 16.8554 4.34437 16.9146C4.34003 16.9781 4.3186 17.044 4.27468 17.1758L3.50586 19.4823L3.50489 19.4853C3.34268 19.9719 3.26157 20.2152 3.31938 20.3774C3.36979 20.5187 3.48169 20.6303 3.62305 20.6807C3.78482 20.7384 4.02705 20.6577 4.51155 20.4962L4.51758 20.4939L6.82405 19.7251C6.95537 19.6813 7.02214 19.6591 7.08559 19.6548C7.14475 19.6507 7.19578 19.6561 7.25293 19.6719C7.31368 19.6887 7.37783 19.7257 7.50563 19.7994L7.50977 19.8018Z"
                    stroke="#545861"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Meta Info */}
            <div className="flex gap-2 items-center justify-center">
              <div className="flex gap-1 items-start">
                {/* Avatar Group */}
                <AvatarGroup
                  size="xs"
                  spacing={-4}
                  aria-label="Users who liked"
                >
                  <Avatar src="/images/avatars/1.png" name="User 1" />
                  <Avatar src="/images/avatars/2.png" name="User 2" />
                  <Avatar src="/images/avatars/3.png" name="User 3" />
                </AvatarGroup>
                <div className="flex px-2 items-center">
                  <p className="text-sm font-medium text-primary leading-5 text-right">
                    {likes.toLocaleString()} likes
                  </p>
                </div>
              </div>
              <div className="flex gap-[10px] px-4 items-center">
                <p className="text-sm font-medium text-primary leading-5 text-right">
                  {comments.toLocaleString()} comments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
