import React from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  emailMarketing: boolean;
  score: number;
  role: 'Member' | 'Moderator' | 'Admin';
  invitationStatus: 'Profile complete' | 'Invited' | 'Pending';
  dateAdded: string;
}

export interface AudienceData {
  all: User[];
  contacts: User[];
  members: User[];
  invited: User[];
  moderators: User[];
}

export type ViewMode = 'Admin' | 'Community';

export interface SidebarItem {
  id: string;
  title: string;
  icon: string | React.ReactNode;
  activeIcon?: string | React.ReactNode;
  subItems?: {
    id: string;
    title: string;
    active?: boolean;
  }[];
}

export interface FilterOption {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date';
  options?: string[];
}
