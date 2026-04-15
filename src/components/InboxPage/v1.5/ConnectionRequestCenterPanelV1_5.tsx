import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Icon } from '@circleco/compass/components/Icon';
import { Button } from '@circleco/compass/components/Button';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Badge } from '@circleco/compass/components/Badge';
import { Tabs } from '@circleco/compass/components/Tabs';
import { Menu } from '@circleco/compass/components/Menu';
import { CONNECTION_REQUEST_PROFILES } from './v1_5MockData';

interface ConnectionRequestCenterPanelV1_5Props {
  selectedId: string;
  onAccept: (id: string) => void;
  onIgnore: (id: string) => void;
  onBlock: (id: string) => void;
  onProfileOpen: (name: string) => void;
}

const ConnectionRequestCenterPanelV1_5: React.FC<ConnectionRequestCenterPanelV1_5Props> = ({
  selectedId,
  onAccept,
  onIgnore,
  onBlock,
  onProfileOpen,
}) => {
  const profile = CONNECTION_REQUEST_PROFILES[selectedId];
  const [activeTab, setActiveTab] = useState('about');

  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-primary">
        <div className="flex flex-col items-center gap-2">
          <Icon name="people-add" size="lg" color="tertiary" />
          <Typography variant="body-sm" color="tertiary">No pending requests</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-primary overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between h-14 pl-6 pr-4 border-b border-[#f0f3f5] shrink-0">
        <div className="flex flex-1 gap-3 h-6 items-center min-w-0 whitespace-nowrap">
          <Typography variant="heading-md" color="primary">Connection request</Typography>
          <Typography variant="body-sm" color="secondary">
            {profile.name} wants to connect with you.
          </Typography>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" size="sm" onClick={() => onIgnore(selectedId)}>Ignore</Button>
          <Button variant="primary" size="sm" onClick={() => onAccept(selectedId)}>Accept</Button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile hero with gradient */}
        <div className="relative">
          {/* Gradient background */}
          <div className="h-[180px] bg-gradient-to-b from-[#f3e8ff] via-[#faf5ff] to-white" />

          {/* Avatar overlapping the gradient */}
          <div className="flex flex-col items-center -mt-16 relative z-10">
            <div className="relative">
              <Avatar name={profile.name} size="3xl" />
              {/* Level badge */}
              <div className="absolute bottom-0 right-0 bg-[#faf5ff] rounded-full shadow-sm flex items-center justify-center size-6">
                <span className="text-[10.5px] font-bold text-[#ac61e7]">{profile.level}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile details */}
        <div className="flex flex-col items-center text-center gap-3 px-6 pt-3 pb-4">
          <div className="flex flex-col gap-1">
            <Typography variant="heading-md" color="primary">{profile.name}</Typography>
            <Typography variant="body-sm" color="secondary">{profile.role}</Typography>
          </div>

          {/* Last seen */}
          <div className="flex items-center gap-1">
            <Icon name="clock" size="sm" color="secondary" />
            <Typography variant="label-xs" color="secondary">{profile.lastSeen}</Typography>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {profile.badges.map((badge, i) => (
              <Badge key={i} variant="secondary" label={badge} />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button variant="primary" size="lg">Message</Button>
            <Button variant="outline" size="lg" onClick={() => onProfileOpen(profile.name)}>View profile</Button>
            <Menu
              options={[
                { label: 'View full profile', icon: 'people' as const, onClick: () => onProfileOpen(profile.name) },
                { label: 'Block user', icon: 'circle-x' as const, danger: true, onClick: () => onBlock(selectedId) },
              ]}
              trigger={<IconButton icon="dot-menu" size="lg" variant="outline" aria-label="More options" />}
            />
          </div>
        </div>

        {/* Tabs + body */}
        <div className="bg-primary rounded-b-xl px-6 pt-12 pb-6">
          <div className="max-w-[768px] mx-auto">
            <Tabs.Root
              tabs={[
                { value: 'about', label: 'About' },
                { value: 'posts', label: `Posts ${profile.posts}` },
                { value: 'comments', label: `Comments ${profile.comments}` },
                { value: 'spaces', label: `Spaces ${profile.spaces}` },
                { value: 'rewards', label: 'Rewards' },
              ]}
              selectedValue={activeTab}
              onValueChange={setActiveTab}
              size="md"
            />

            <div className="flex flex-col gap-6 pt-6">
              {/* Achievement tag */}
              <div className="inline-flex items-center gap-2 bg-[rgba(125,95,188,0.12)] rounded-lg px-3 py-1 w-fit">
                <span className="text-xs">🏆</span>
                <Typography variant="label-xs" color="primary" className="text-[#ac61e7]">{profile.level}</Typography>
                <div className="w-px h-3 bg-[#e1d8f5] rounded-full" />
                <Typography variant="label-xs" className="text-[#ac61e7]">Community Guru</Typography>
              </div>

              {/* Biography */}
              <div className="flex flex-col gap-2">
                <Typography variant="label-sm" color="primary">Biography</Typography>
                <Typography variant="body-sm" color="secondary" className="leading-5">
                  {profile.biography}
                </Typography>
              </div>

              {/* Contacts */}
              <div className="flex flex-col gap-2">
                <Typography variant="label-sm" color="primary">Contacts</Typography>
                <div className="flex items-center gap-2">
                  <Icon name="at" size="sm" color="secondary" />
                  <Typography variant="body-sm" color="secondary">{profile.email}</Typography>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="chain-link" size="sm" color="secondary" />
                  <Typography variant="body-sm" color="secondary">{profile.website}</Typography>
                </div>
              </div>

              {/* Custom fields */}
              {profile.customFields.map((field, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Typography variant="label-sm" color="primary">{field.label}</Typography>
                  <Typography variant="body-sm" color="secondary">{field.value}</Typography>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionRequestCenterPanelV1_5;
