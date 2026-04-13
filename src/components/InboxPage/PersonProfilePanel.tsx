import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Button } from '@circleco/compass/components/Button';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Badge } from '@circleco/compass/components/Badge';
import { Icon } from '@circleco/compass/components/Icon';

interface ProfileData {
  localTime: string;
  email: string;
  joinedDate: string;
  lastActive: string;
  badges: string[];
  fields: { label: string; value: string }[];
}

const PROFILES: Record<string, ProfileData> = {
  'Calvin Parks': {
    localTime: '2:14 PM · New York, NY',
    email: 'calvin.parks@example.com',
    joinedDate: '15 Mar 2024',
    lastActive: 'Last active 2m ago',
    badges: ['Member'],
    fields: [
      { label: 'Profession:', value: 'Photographer' },
      { label: 'Skill level:', value: 'Intermediate' },
      { label: 'Courses:', value: '3 enrolled' },
      { label: 'Posts:', value: '12' },
      { label: 'Replies:', value: '47' },
      { label: 'Likes received:', value: '83' },
    ],
  },
  'Kathryn Murphy': {
    localTime: '11:14 AM · London, UK',
    email: 'kathryn.murphy@example.com',
    joinedDate: '8 Sep 2023',
    lastActive: 'Last active 15m ago',
    badges: ['Member', 'Contact'],
    fields: [
      { label: 'Profession:', value: 'Designer' },
      { label: 'Skill level:', value: 'Advanced' },
      { label: 'Courses:', value: '5 enrolled' },
      { label: 'Posts:', value: '34' },
      { label: 'Replies:', value: '91' },
      { label: 'Likes received:', value: '120' },
    ],
  },
};

const DEFAULT_PROFILE: ProfileData = {
  localTime: '8:23 PM · Los Angeles, CA',
  email: 'member@example.com',
  joinedDate: '22 Jan 2025',
  lastActive: 'Last active 3h ago',
  badges: ['Member', 'Contact'],
  fields: [
    { label: 'Profile field:', value: 'Field input' },
    { label: 'Profile field:', value: 'Field input' },
    { label: 'Profile field:', value: 'Field input' },
    { label: 'Profile field:', value: 'Field input' },
    { label: 'Profile field:', value: 'Field input' },
    { label: 'Profile field:', value: 'Field input' },
  ],
};

interface PersonProfilePanelProps {
  name: string | null;
  onClose: () => void;
}

const PersonProfilePanel: React.FC<PersonProfilePanelProps> = ({ name, onClose }) => {
  const isOpen = name !== null;
  const profile = (name ? PROFILES[name] : null) ?? DEFAULT_PROFILE;

  return (
    <div
      className={`absolute top-0 right-0 bottom-0 w-[368px] z-30 pointer-events-none transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col bg-primary rounded-tl-2xl rounded-bl-2xl border-l border-[#e4e7eb] shadow-md overflow-hidden">
        {/* Header */}
        <div className="h-14 flex items-center px-6 border-b border-secondary shrink-0 gap-2">
          <Typography variant="heading-sm" color="primary">Member details</Typography>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">Edit</Button>
            <IconButton
              variant="outline"
              size="sm"
              icon="cross"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-5">
          {/* Avatar + name */}
          <div className="flex flex-col gap-4">
            <Avatar name={name ?? 'Member'} size="xl" />
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <Typography variant="heading-md" color="primary">{name ?? 'Member'}</Typography>
                <Typography variant="label-xs" color="secondary">{profile.localTime}</Typography>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {profile.badges.map(b => (
                  <Badge key={b} variant="secondary" label={b} />
                ))}
              </div>
            </div>
          </div>

          {/* Info rows */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Icon name="email" size="sm" color="secondary" />
              <Typography variant="body-sm" color="secondary">{profile.email}</Typography>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="calendar" size="sm" color="secondary" />
              <Typography variant="body-sm" color="secondary">{profile.joinedDate}</Typography>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="clock" size="sm" color="secondary" />
              <Typography variant="body-sm" color="secondary">{profile.lastActive}</Typography>
            </div>
          </div>

          {/* Divider */}
          <div className="border-b border-secondary" />

          {/* Profile fields */}
          <div className="flex flex-col gap-2">
            {profile.fields.map((f, i) => (
              <div key={i} className="flex gap-2 items-start">
                <Typography variant="label-sm" color="primary" className="w-[120px] shrink-0">
                  {f.label}
                </Typography>
                <Typography variant="body-sm" color="secondary">
                  {f.value}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonProfilePanel;
