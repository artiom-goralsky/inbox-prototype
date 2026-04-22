export type AllViewItemType = 'dm' | 'chatThread' | 'connectionRequest' | 'moderation' | 'courseComment' | 'aiInbox';

export interface AllViewItem {
  id: string;
  type: AllViewItemType;
  name: string;
  avatarName: string;
  time: string;
  // DM fields
  preview?: string;
  unread?: boolean;
  // Chat Thread fields
  channelEmoji?: string;
  channelLabel?: string;
  parentPreview?: string;
  lastReply?: string;
  // Connection Request fields
  role?: string;
  roleDetail?: string;
  message?: string;
  // Moderation fields
  violationReason?: string;
  itemCount?: number;
  // Course Comment fields
  lessonLabel?: string;
  lessonCoverUrl?: string;
  commentPreview?: string;
  // AI Inbox fields
  agentName?: string;
  aiPreview?: string;
  // Priority
  priority: 'high' | 'medium' | 'low';
  // Resolution
  resolvedAt?: number | null;
}

// Map item type to the selectedId the existing center panels expect
export const TYPE_TO_CENTER_ID: Record<AllViewItemType, string> = {
  dm: 'dm-3',
  chatThread: 'ct-1',
  connectionRequest: 'cr-1',
  moderation: 'derek-hoffman',
  courseComment: '1',
  aiInbox: '1',
};

// Icon per type for the avatar modifier badge
export const TYPE_ICON: Record<AllViewItemType, string> = {
  dm: 'message-dots',
  chatThread: 'thread',
  connectionRequest: 'people-sparkle',
  moderation: 'flag',
  courseComment: 'graduate-cap',
  aiInbox: 'ai-box',
};

// Category label for grouped view headers
export const TYPE_LABEL: Record<AllViewItemType, string> = {
  dm: 'DMs',
  chatThread: 'Chat Threads',
  connectionRequest: 'Connection Requests',
  moderation: 'Moderation',
  courseComment: 'Course Comments',
  aiInbox: 'AI Inbox',
};

// Group order for grouped view
export const GROUP_ORDER: AllViewItemType[] = [
  'dm', 'chatThread', 'connectionRequest', 'moderation', 'courseComment', 'aiInbox',
];

// Map each All-view item ID to the center-panel selectedId
export const ITEM_CENTER_MAP: Record<string, { tab: string; selectedId: string }> = {
  'all-dm-1': { tab: 'dms', selectedId: 'dm-3' },
  'all-dm-2': { tab: 'dms', selectedId: 'dm-4' },
  'all-dm-3': { tab: 'dms', selectedId: 'dm-5' },
  'all-ct-1': { tab: 'chat-threads', selectedId: 'ct-1' },
  'all-ct-2': { tab: 'chat-threads', selectedId: 'ct-2' },
  'all-cr-1': { tab: 'connection-requests', selectedId: 'cr-1' },
  'all-cr-2': { tab: 'connection-requests', selectedId: 'cr-2' },
  'all-mod-1': { tab: 'moderation', selectedId: 'derek-hoffman' },
  'all-mod-2': { tab: 'moderation', selectedId: 'maria-santos' },
  'all-cc-1': { tab: 'course-comments', selectedId: 'cc-1' },
  'all-cc-2': { tab: 'course-comments', selectedId: 'cc-2' },
  'all-ai-1': { tab: 'ai-inbox', selectedId: 'ai-2' },
};

// Items are interleaved by type for the flat view \u2014 mixed, not grouped
export const ALL_VIEW_ITEMS: AllViewItem[] = [
  {
    id: 'all-dm-1',
    type: 'dm',
    name: 'Alex Chen',
    avatarName: 'Alex Chen',
    time: '9:45',
    preview: "Hey Sarah, I'd like to request a refund on Advanced Lighting. Marcus has been inactive 3 weeks and I've barely gotten value out of it. I'm a founding member and I hate to ask, but this one missed the mark.",
    unread: true,
    priority: 'high',
  },
  {
    id: 'all-ct-1',
    type: 'chatThread',
    name: 'Maya Rodriguez',
    avatarName: 'Maya Rodriguez',
    time: '9:45',
    channelEmoji: '\ud83c\udf05',
    channelLabel: 'Golden hour',
    parentPreview: "Finally got the warm tones right on this series \u2014 any tips for pushing the orange without losing skin detail?",
    lastReply: 'Try masking the skin separately with a radial filter, temp shifted 200K cooler.',
    priority: 'medium',
  },
  {
    id: 'all-cr-1',
    type: 'connectionRequest',
    name: 'Leslie Alexander',
    avatarName: 'Leslie Alexander',
    time: '9:45',
    role: 'Product manager',
    roleDetail: 'PM at Flux',
    message: "Hi Sarah, I've been lurking in critique circle for weeks \u2014 your community is doing great work. Would love to connect.",
    priority: 'medium',
  },
  {
    id: 'all-mod-1',
    type: 'moderation',
    name: 'Derek Hoffman',
    avatarName: 'Derek Hoffman',
    time: '9:45',
    violationReason: 'Self-promotion',
    itemCount: 4,
    priority: 'high',
  },
  {
    id: 'all-cc-1',
    type: 'courseComment',
    name: 'James Liu',
    avatarName: 'James Liu',
    time: '9:45',
    lessonLabel: 'Lesson 4: Action shots',
    lessonCoverUrl: 'https://picsum.photos/seed/action-shots/104/64',
    commentPreview: "Struggling to freeze motion indoor \u2014 shutter 1/500, ISO blown out. What am I missing?",
    priority: 'medium',
  },
  {
    id: 'all-ai-1',
    type: 'aiInbox',
    name: 'Maya Rodriguez',
    avatarName: 'Maya Rodriguez',
    time: '9:30',
    agentName: 'Clarity Agent',
    aiPreview: "I've tried the password reset three times and I'm still locked out. I have a cohort session in 20 minutes.",
    priority: 'high',
  },
  {
    id: 'all-dm-2',
    type: 'dm',
    name: 'Amy Torres',
    avatarName: 'Amy Torres',
    time: '8:30',
    preview: "Sarah, could you take a look at my portrait series when you have a sec? I'd love feedback before I post to critique circle.",
    priority: 'medium',
  },
  {
    id: 'all-ct-2',
    type: 'chatThread',
    name: 'Kenji Tanaka',
    avatarName: 'Kenji Tanaka',
    time: '6:20',
    channelEmoji: '\ud83d\uded2',
    channelLabel: 'Gear marketplace',
    parentPreview: 'Selling my barely-used 50mm f/1.4 \u2014 moving to the 35mm for street work. Priced below market, DM me.',
    lastReply: "I'll take it \u2014 sending a DM now.",
    priority: 'low',
  },
  {
    id: 'all-cr-2',
    type: 'connectionRequest',
    name: 'Roberto Santos',
    avatarName: 'Roberto Santos',
    time: '5:00',
    role: 'Software engineer',
    roleDetail: 'Senior SWE at Flux',
    priority: 'low',
  },
  {
    id: 'all-mod-2',
    type: 'moderation',
    name: 'Maria Santos',
    avatarName: 'Maria Santos',
    time: '4:30',
    violationReason: 'Spam',
    itemCount: 4,
    priority: 'low',
  },
  {
    id: 'all-cc-2',
    type: 'courseComment',
    name: 'Priya Sharma',
    avatarName: 'Priya Sharma',
    time: '3:15',
    lessonLabel: 'Lesson 7: Landscape basics',
    lessonCoverUrl: 'https://picsum.photos/seed/landscape/104/64',
    commentPreview: "For the foreground interest exercise \u2014 does it count if the foreground is isolated with a wide aperture, or should it be in focus too?",
    priority: 'low',
  },
  {
    id: 'all-dm-3',
    type: 'dm',
    name: 'Chen Wei',
    avatarName: 'Chen Wei',
    time: '7:15',
    preview: 'Sarah, quick question on billing \u2014 when does my Pro renew? And is there an annual option?',
    priority: 'low',
  },
];
