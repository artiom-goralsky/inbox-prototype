import React from 'react';
import { Icon } from '@circleco/compass/components/Icon';
import circleLogo from '../circle-logo.svg';

export interface FirstLevelNavItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
}

export const firstLevelNavItems: FirstLevelNavItem[] = [
  {
    id: 'circle',
    title: 'Circle',
    icon: (
      <img src={circleLogo} alt="Circle" className="w-[30px] h-[30px] rounded-md" />
    ),
    activeIcon: (
      <img src={circleLogo} alt="Circle" className="w-[30px] h-[30px] rounded-md" />
    ),
  },
  {
    id: 'copilot',
    title: 'Circle AI',
    icon: (
      <Icon
        name="sparkles"
        size="md"
      />
    ),
    activeIcon: <Icon name="sparkles-filled" size="md" />,
  },
  {
    id: 'inbox',
    title: 'Inbox',
    icon: <Icon name="inbox-empty" size="lg" className="w-6 h-6" />,
    activeIcon: (
      <Icon name="inbox-empty-filled" size="lg" className="w-6 h-6" />
    ),
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: <Icon name="bell" size="lg" className="w-6 h-6" />,
    activeIcon: <Icon name="bell-filled" size="lg" className="w-6 h-6" />,
  },
  {
    id: 'manage',
    title: 'Manage',
    icon: <Icon name="settings-gear" size="lg" className="w-6 h-6" />,
    activeIcon: (
      <Icon name="settings-gear-filled" size="lg" className="w-6 h-6" />
    ),
  },
  {
    id: 'clarity',
    title: 'Clarity',
    icon: (
      <img
        src="/images/clarity-logo.png"
        alt="Clarity"
        className="h-6 w-6 object-contain"
      />
    ),
    activeIcon: (
      <img
        src="/images/clarity-logo.png"
        alt="Clarity"
        className="h-6 w-6 object-contain"
      />
    ),
  },
  {
    id: 'framer',
    title: 'Framer',
    icon: (
      <img
        src="/images/framer-logo.png"
        alt="Framer"
        className="h-6 w-6 object-contain"
      />
    ),
    activeIcon: (
      <img
        src="/images/framer-logo.png"
        alt="Framer"
        className="h-6 w-6 object-contain"
      />
    ),
  },
  {
    id: 'more',
    title: 'More',
    icon: <Icon name="circle-dots-center" size="lg" className="w-6 h-6" />,
    activeIcon: (
      <Icon name="circle-dots-center" size="lg" className="w-6 h-6" />
    ),
  },
];
