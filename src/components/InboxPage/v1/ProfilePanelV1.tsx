import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Icon } from '@circleco/compass/components/Icon';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Tabs } from '@circleco/compass/components/Tabs';
import type { ProfileData } from './v1MockData';
import DrawerOverlay from './DrawerOverlay';

interface ProfilePanelV1Props {
  data: ProfileData;
  onClose: () => void;
}

const TABS = [
  { value: 'about', label: 'About' },
  { value: 'posts', label: 'Posts' },
  { value: 'comments', label: 'Comments' },
  { value: 'spaces', label: 'Spaces' },
];

const ProfilePanelV1: React.FC<ProfilePanelV1Props> = ({ data, onClose }) => {
  return (
    <DrawerOverlay onClose={onClose}>
    <div className="flex-1 flex flex-col bg-primary overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-secondary shrink-0">
        <Typography variant="heading-md" color="primary">Profile</Typography>
        <IconButton icon="cross" size="sm" variant="ghost" aria-label="Close" onClick={onClose} />
      </div>

      {/* Profile content */}
      <div className="flex-1 overflow-y-auto">
        {/* Avatar + Name + Role + Tabs */}
        <div className="flex flex-col border-b border-secondary">
          <div className="flex items-start gap-4 pt-5 pb-3 px-6">
            <Avatar name={data.name} size="xl" />
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <Typography variant="heading-md" color="primary">{data.name}</Typography>
              <Typography variant="body-sm" color="tertiary">{data.role}</Typography>
              <div className="flex items-center gap-1 mt-1">
                <IconButton icon="chain-link" size="sm" variant="outline" aria-label="Copy link" />
                <IconButton icon="dot-menu" size="sm" variant="outline" aria-label="More" />
              </div>
            </div>
          </div>
          <div className="px-6">
          <Tabs.Root tabs={TABS} defaultValue="about" size="sm">
          <Tabs.Panel value="about">
            <div className="flex flex-col gap-6 p-6 -mx-6">
              {/* Contact info */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Icon name="at" size="sm" color="tertiary" />
                  <Typography variant="body-sm" color="primary">{data.email}</Typography>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="map-pin" size="sm" color="tertiary" />
                  <Typography variant="body-sm" color="primary">{data.location}</Typography>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="calendar" size="sm" color="tertiary" />
                  <Typography variant="body-sm" color="primary">{data.joinDate}</Typography>
                </div>
              </div>

              {/* Tags */}
              {data.tags.length > 0 && (
                <div className="flex flex-col gap-2">
                  <Typography variant="heading-sm" color="primary">Tags</Typography>
                  <div className="flex flex-wrap gap-2">
                    {data.tags.map((tag) => (
                      <span
                        key={tag.label}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-secondary rounded-full"
                      >
                        <span className="text-xs">{tag.emoji}</span>
                        <Typography variant="caption" color="primary">{tag.label}</Typography>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio */}
              {data.bio && (
                <div className="flex flex-col gap-2">
                  <Typography variant="heading-sm" color="primary">Bio</Typography>
                  <Typography variant="body-sm" color="secondary">{data.bio}</Typography>
                </div>
              )}

              {/* Social */}
              {data.socialLinks.length > 0 && (
                <div className="flex flex-col gap-2">
                  <Typography variant="heading-sm" color="primary">Social</Typography>
                  <div className="flex flex-col gap-2">
                    {data.socialLinks.map((link) => (
                      <div key={link.platform} className="flex items-center gap-3">
                        <Icon name="chain-link" size="sm" color="tertiary" />
                        <div className="flex flex-col">
                          <Typography variant="caption" color="tertiary">{link.platform}</Typography>
                          <Typography variant="body-sm" color="primary">{link.url}</Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="posts">
            <div className="flex items-center justify-center h-40 -mx-6">
              <Typography variant="body-sm" color="tertiary">No posts to show</Typography>
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="comments">
            <div className="flex items-center justify-center h-40 -mx-6">
              <Typography variant="body-sm" color="tertiary">No comments to show</Typography>
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="spaces">
            <div className="flex items-center justify-center h-40 -mx-6">
              <Typography variant="body-sm" color="tertiary">No spaces to show</Typography>
            </div>
          </Tabs.Panel>
          </Tabs.Root>
          </div>
        </div>
      </div>
    </div>
    </DrawerOverlay>
  );
};

export default ProfilePanelV1;
