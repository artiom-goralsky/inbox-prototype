import { getFirstThreadId as _getFirstThreadId } from '../v1/v1MockData';

// Re-export everything needed from v1
export {
  type V1Category,
  type V1ThreadItem,
  type V1Message,
  type V1MessageGroup,
  type V1ModerationCard,
  type V1CourseComment,
  type V1CourseCommentThread,
  type V1AIConversation,
  type ProfileData,
  DM_THREADS,
  DM_CONVERSATIONS,
  MODERATION_THREADS,
  MODERATION_CARDS,
  COURSE_THREADS,
  COURSE_COMMENT_DATA,
  COURSE_THREAD_REPLIES,
  AI_THREADS,
  AI_CONVERSATIONS,
  PROFILE_DATA,
  INITIAL_REVIEWED_IDS,
  INITIAL_DECISIONS,
  getProfileData,
  getThreadsForCategory,
  getFirstThreadId,
} from '../v1/v1MockData';

// ---------- v1.5 types ----------

export type V1_5Category =
  | 'dms'
  | 'chat-threads'
  | 'connection-requests'
  | 'moderation'
  | 'course-comments'
  | 'ai-inbox';

export interface ChatThreadItem {
  id: string;
  participants: string[];
  channelName?: string;
  channelEmoji?: string;
  channelLabel?: string;
  isPrivate?: boolean;
  parentPreview: string;
  lastReply: string;
  time: string;
  unread?: boolean;
  hasReplied?: boolean;
  avatarName: string;
}

export interface ChatThreadMessage {
  id: string;
  senderName: string;
  text: string;
  time: string;
}

export interface ChatThreadConversation {
  channelName?: string;
  isPrivate?: boolean;
  participantNames: string[];
  parentMessage: ChatThreadMessage;
  replies: ChatThreadMessage[];
  hiddenReplyCount?: number;
}

// ---------- Chat thread mock data ----------

export const CHAT_THREAD_ITEMS: ChatThreadItem[] = [
  {
    id: 'ct-1',
    participants: ['Igor', 'Ceri'],
    channelName: '#design-private',
    channelEmoji: '🗓️',
    channelLabel: 'Events Channel',
    isPrivate: true,
    parentPreview: "We're here to help you achieve your goals!",
    lastReply: 'Hey, want to play?',
    time: '9:45',
    avatarName: 'Igor Kravchenko',
  },
  {
    id: 'ct-2',
    participants: ['Juan Vallejo'],
    channelName: '#dev-live-team',
    channelEmoji: '🎉',
    channelLabel: 'Wins Channel',
    parentPreview: "We're committed to providing a safe environment!",
    lastReply: 'Please let me know if you need any further information for the project.',
    time: '9:45',
    avatarName: 'Juan Vallejo',
  },
  {
    id: 'ct-3',
    participants: ['Karthik Menon', 'Michal', 'Artiom'],
    channelName: '#dev-live-team',
    channelEmoji: '⭐',
    channelLabel: 'Feature Requests',
    parentPreview: "We're proud to have you as a member!",
    lastReply: "Hi there! What's up?",
    time: '9:45',
    avatarName: 'Karthik Menon',
  },
  {
    id: 'ct-4',
    participants: ['Adriana', 'Luca', 'Maya', 'Chen', 'Sophie', 'James'],
    channelName: '#feedback-compass',
    channelEmoji: '📰',
    channelLabel: 'Industry News',
    parentPreview: "We're always looking for ways to improve the community!",
    lastReply: 'HAHAHA',
    time: '9:45',
    avatarName: 'Adriana Lopez',
  },
  {
    id: 'ct-5',
    participants: ['Adriana', 'you'],
    channelLabel: 'DM',
    parentPreview: 'We value your input and appreciate your participation!',
    lastReply: 'Let me go grab some snacks real quick.',
    time: '9:45',
    avatarName: 'Adriana Lopez',
  },
  {
    id: 'ct-6',
    participants: ['Maya', 'you', 'Chen', 'Luca'],
    channelEmoji: '📢',
    channelLabel: 'Announcements',
    channelName: '#announcements',
    parentPreview: "Let's work together to make this community great!",
    lastReply: "I don't have it installed yet.",
    time: '9:45',
    avatarName: 'Maya Patel',
  },
  {
    id: 'ct-7',
    participants: ['Wade', 'you'],
    channelLabel: 'DM',
    parentPreview: "We're here to help you succeed in the community!",
    lastReply: 'Still trying to play?',
    time: '9:45',
    avatarName: 'Wade Warren',
  },
  {
    id: 'ct-8',
    participants: ['Cody Fisher'],
    channelEmoji: '💼',
    channelLabel: 'Sales Channel',
    channelName: '#sales',
    parentPreview: 'Ask questions and share your thoughts with the community!',
    lastReply: 'Let me go grab some snacks real quick.',
    time: '9:45',
    avatarName: 'Cody Fisher',
  },
  {
    id: 'ct-9',
    participants: ['Dianne Russell'],
    channelEmoji: '🛠️',
    channelLabel: 'Product Feedback',
    channelName: '#product-feedback',
    parentPreview: "We're excited to see what you'll contribute!",
    lastReply: "I don't have it installed yet.",
    time: '9:45',
    avatarName: 'Dianne Russell',
  },
  {
    id: 'ct-10',
    participants: ['Jacob Jones'],
    channelEmoji: '📣',
    channelLabel: 'General Chat',
    channelName: '#general',
    parentPreview: 'Welcome! We are happy to have you in the community!',
    lastReply: "Hey! How's it going?",
    time: '9:45',
    avatarName: 'Jacob Jones',
  },
];

export const CHAT_THREAD_CONVERSATIONS: Record<string, ChatThreadConversation> = {
  'ct-1': {
    channelName: '#design-private',
    isPrivate: true,
    participantNames: ['Igor', 'Ceri', 'you'],
    parentMessage: {
      id: 'ct-1-p',
      senderName: 'Igor Kravchenko',
      text: 'Hey @design-team-product we need a couple of screens for the new onboarding flow. Can someone take a look at the current Figma and see what we can reuse? I think the welcome screen and the profile setup can be adapted from the existing designs.',
      time: '3:42 PM',
    },
    replies: [
      {
        id: 'ct-1-r1',
        senderName: 'Ceri Williams',
        text: 'I can take a look at this tomorrow morning. The welcome screen should be straightforward to adapt.',
        time: '4:15 PM',
      },
      {
        id: 'ct-1-r2',
        senderName: 'You',
        text: 'cool, let us know',
        time: '4:30 PM',
      },
    ],
  },
  'ct-2': {
    channelName: '#dev-live-team',
    participantNames: ['Juan Vallejo', 'you'],
    parentMessage: {
      id: 'ct-2-p',
      senderName: 'Juan Vallejo',
      text: '@Artiom do we have new skeleton loaders for event spaces? The current ones look a bit off on mobile and I want to make sure we\'re using the latest patterns before shipping.',
      time: '11:20 AM',
    },
    replies: [
      {
        id: 'ct-2-r1',
        senderName: 'You',
        text: 'cool, let us know',
        time: '11:45 AM',
      },
    ],
  },
  'ct-3': {
    channelName: '#dev-live-team',
    participantNames: ['Karthik Menon', 'Michal', 'Artiom'],
    parentMessage: {
      id: 'ct-3-p',
      senderName: 'Karthik Menon',
      text: '@Artiom and Michal, Do we have the Figma designs ready for the new live events layout? Product wants to review them before the sprint planning on Monday.',
      time: '2:00 PM',
    },
    hiddenReplyCount: 4,
    replies: [
      {
        id: 'ct-3-r1',
        senderName: 'Michal Novak',
        text: 'I started working on the layout yesterday. Should have the first draft ready by EOD.',
        time: '2:30 PM',
      },
      {
        id: 'ct-3-r2',
        senderName: 'Karthik Menon',
        text: 'Lemme get back to you by tomorrow.',
        time: '3:00 PM',
      },
    ],
  },
  'ct-4': {
    channelName: '#feedback-compass',
    participantNames: ['Adriana', 'Luca', 'Maya', 'Chen', 'Sophie', 'James'],
    parentMessage: {
      id: 'ct-4-p',
      senderName: 'Adriana Lopez',
      text: 'Report: Could we have a Popover ghost variant? The current default Popover has too much padding for use in compact toolbars. A ghost variant with reduced padding would work much better for our use case in the action bar.',
      time: '10:00 AM',
    },
    hiddenReplyCount: 8,
    replies: [
      {
        id: 'ct-4-r1',
        senderName: 'Luca Romano',
        text: 'I think we should keep the existing padding for accessibility reasons. Maybe we can add a size prop instead?',
        time: '10:30 AM',
      },
      {
        id: 'ct-4-r2',
        senderName: 'Maya Patel',
        text: 'we agreed on keep the current Popover padding but add a compact size variant for toolbar use cases.',
        time: '11:00 AM',
      },
    ],
  },
  'ct-5': {
    participantNames: ['Adriana', 'you'],
    parentMessage: {
      id: 'ct-5-p',
      senderName: 'You',
      text: 'and another one from me: https://www.loom.com/share/design-review-feb — this covers the updated navigation patterns we discussed last week.',
      time: '9:15 AM',
    },
    replies: [
      {
        id: 'ct-5-r1',
        senderName: 'Adriana Lopez',
        text: 'Great walkthrough! I left a few comments on the Loom. Main thing — the breadcrumb behavior on mobile needs another pass.',
        time: '10:00 AM',
      },
      {
        id: 'ct-5-r2',
        senderName: 'You',
        text: 'thank you Adriana',
        time: '10:20 AM',
      },
    ],
  },
  'ct-6': {
    participantNames: ['Maya', 'you', 'Chen', 'Luca'],
    parentMessage: {
      id: 'ct-6-p',
      senderName: 'Maya Patel',
      text: 'Can we sync on the design review before Friday? I want to make sure we align on the component library updates before the release.',
      time: '2:00 PM',
    },
    replies: [
      {
        id: 'ct-6-r1',
        senderName: 'Chen Wei',
        text: 'Thursday works for me. What time zone are we targeting?',
        time: '2:15 PM',
      },
      {
        id: 'ct-6-r2',
        senderName: 'Luca Romano',
        text: 'Sure, let\'s do Thursday 3pm',
        time: '2:30 PM',
      },
    ],
  },
};

// ---------- Connection Request types ----------

export interface ConnectionRequestItem {
  id: string;
  name: string;
  role?: string;
  roleDetail?: string;
  message?: string;
  time: string;
}

export interface ConnectionRequestProfile {
  name: string;
  role: string;
  lastSeen: string;
  level: number;
  badges: string[];
  biography: string;
  email: string;
  website: string;
  customFields: { label: string; value: string }[];
  posts: number;
  comments: number;
  spaces: number;
}

export const CONNECTION_REQUEST_ITEMS: ConnectionRequestItem[] = [
  {
    id: 'cr-1',
    name: 'Leslie Alexander',
    role: 'Product manager',
    roleDetail: 'Product manager, Flux',
    message: "Hi Artiom, I'm a big fan of your work. Let's connect!",
    time: '9:45',
  },
  {
    id: 'cr-2',
    name: 'Ralph Edwards',
    role: 'Product lead',
    roleDetail: 'Product lead, Flux',
    message: "Hello Artiom, I'd love to add you to my professional network.",
    time: '9:45',
  },
  {
    id: 'cr-3',
    name: 'Paula Mora',
    role: 'UX designer',
    roleDetail: 'UX designer, Flux',
    message: "Hi Artiom, I'm impressed with your experience. Connect with me!",
    time: '9:45',
  },
  {
    id: 'cr-4',
    name: 'Roberto Santos',
    role: 'Software engineer',
    roleDetail: 'Software engineer, Flux',
    message: "Hi Artiom, your background is impressive. I'd like to connect.",
    time: '9:45',
  },
];

export const CONNECTION_REQUEST_PROFILES: Record<string, ConnectionRequestProfile> = {
  'cr-1': {
    name: 'Leslie Alexander',
    role: 'Product manager',
    lastSeen: 'Last seen 10hr ago',
    level: 9,
    badges: ['💪 Pro', '✍ Editor', '+2 more'],
    biography: "I'm Alexandea Sifferlin wanted to post this quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in volup velit esse cillum dolore eu fugiat nulla pariatur.",
    email: 'lesliea@example.com',
    website: 'www.lesliealexander.com',
    customFields: [
      { label: 'Custom field', value: 'Value for the above field' },
      { label: 'Custom field', value: 'Value for the above field' },
      { label: 'Custom field', value: 'Value for the above field' },
    ],
    posts: 99,
    comments: 99,
    spaces: 99,
  },
  'cr-2': {
    name: 'Ralph Edwards',
    role: 'Product lead',
    lastSeen: 'Last seen 3hr ago',
    level: 7,
    badges: ['💪 Pro', '+1 more'],
    biography: 'Experienced product lead with a passion for building scalable products. Previously at Google and Stripe.',
    email: 'ralph.edwards@example.com',
    website: 'www.ralphedwards.com',
    customFields: [
      { label: 'Custom field', value: 'Value for the above field' },
      { label: 'Custom field', value: 'Value for the above field' },
    ],
    posts: 45,
    comments: 128,
    spaces: 12,
  },
  'cr-3': {
    name: 'Paula Mora',
    role: 'Customer support specialist',
    lastSeen: 'Last seen 10hr ago',
    level: 9,
    badges: ['💪 Pro', '✍ Editor', '+2 more'],
    biography: "I'm Alexandea Sifferlin wanted to post this quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in volup velit esse cillum dolore eu fugiat nulla pariatur.",
    email: 'paulomora@example.com',
    website: 'www.paulomora.com',
    customFields: [
      { label: 'Custom field', value: 'Value for the above field' },
      { label: 'Custom field', value: 'Value for the above field' },
      { label: 'Custom field', value: 'Value for the above field' },
      { label: 'Custom field', value: 'Value for the above field' },
      { label: 'Custom field', value: 'Value for the above field' },
    ],
    posts: 99,
    comments: 99,
    spaces: 99,
  },
  'cr-4': {
    name: 'Roberto Santos',
    role: 'Software engineer',
    lastSeen: 'Last seen 1d ago',
    level: 5,
    badges: ['💪 Pro'],
    biography: 'Full-stack engineer focused on React and TypeScript. Open source contributor and community builder.',
    email: 'roberto.santos@example.com',
    website: 'www.robertosantos.dev',
    customFields: [
      { label: 'Custom field', value: 'Value for the above field' },
    ],
    posts: 22,
    comments: 67,
    spaces: 8,
  },
};

// ---------- Helpers ----------

/** Format participants for display in thread list. */
export function formatParticipants(participants: string[]): string {
  if (participants.length <= 2) return participants.join(' and ');
  const first = participants[0];
  const rest = participants.length - 1;
  return `${first} & ${rest} others`;
}

export function getFirstThreadIdV1_5(category: V1_5Category): string {
  switch (category) {
    case 'chat-threads':
      return CHAT_THREAD_ITEMS[0]?.id ?? '';
    case 'connection-requests':
      return CONNECTION_REQUEST_ITEMS[0]?.id ?? '';
    default:
      // Delegate to v1 for shared categories
      return _getFirstThreadId(category as import('../v1/v1MockData').V1Category);
  }
}
