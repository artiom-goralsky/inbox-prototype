import { useState } from 'react';
import type { InboxView, InboxCategory, ViewFilter } from './viewTypes';

const DEFAULT_VIEWS: InboxView[] = [
  {
    id: 'view-vip',
    name: 'VIP DMs',
    icon: '👑',
    category: 'dms',
    filters: [
      {
        id: 'f1',
        field: 'memberTier',
        fieldLabel: 'Member tier',
        operator: 'is',
        operatorLabel: 'is',
        value: 'vip',
        valueLabel: 'VIP',
      },
    ],
    count: 4,
  },
  {
    id: 'view-cohort1',
    name: 'Cohort 1',
    icon: '🎓',
    category: 'comments',
    filters: [
      {
        id: 'f2',
        field: 'course',
        fieldLabel: 'Course',
        operator: 'is',
        operatorLabel: 'is',
        value: 'intro-photo',
        valueLabel: 'Intro to Photography',
      },
    ],
    count: 11,
  },
  {
    id: 'view-cohort2',
    name: 'Cohort 2',
    icon: '🎓',
    category: 'comments',
    filters: [],
    count: 7,
  },
];

export function useViews(initialViews?: InboxView[]) {
  const [views, setViews] = useState<InboxView[]>(initialViews ?? DEFAULT_VIEWS);
  const [activeViewId, setActiveViewId] = useState<string | null>(null);

  const activeView = views.find(v => v.id === activeViewId) ?? null;

  const addView = (viewData: Omit<InboxView, 'id' | 'count'>) => {
    const newView: InboxView = {
      ...viewData,
      id: `view-${Date.now()}`,
      count: Math.floor(Math.random() * 20) + 1,
    };
    setViews(prev => [...prev, newView]);
    setActiveViewId(newView.id);
  };

  const removeView = (viewId: string) => {
    setViews(prev => prev.filter(v => v.id !== viewId));
    if (activeViewId === viewId) setActiveViewId(null);
  };

  const selectView = (viewId: string | null) => setActiveViewId(viewId);

  const getViewsForCategory = (category: InboxCategory) =>
    views.filter(v => v.category === 'all' || v.category === category);

  return { views, activeView, activeViewId, addView, removeView, selectView, getViewsForCategory };
}

export type UseViewsReturn = ReturnType<typeof useViews>;
