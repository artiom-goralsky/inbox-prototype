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
  priority?: 'high' | 'medium' | 'low';
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
    participants: ['Maya Rodriguez', 'Amy Torres'],
    channelName: '#golden-hour',
    channelEmoji: '\ud83c\udf05',
    channelLabel: 'Golden hour',
    parentPreview: "Finally got the warm tones right on this series \u2014 any tips for pushing the orange without losing skin detail?",
    lastReply: 'Try masking the skin separately with a radial filter, temp shifted 200K cooler.',
    time: '9:45',
    avatarName: 'Maya Rodriguez',
    priority: 'high',
  },
  {
    id: 'ct-2',
    participants: ['Kenji Tanaka', 'James Liu'],
    channelName: '#gear-marketplace',
    channelEmoji: '\ud83d\uded2',
    channelLabel: 'Gear marketplace',
    parentPreview: "Selling my barely-used 50mm f/1.4 \u2014 moving to the 35mm for street work. Priced below market, DM me.",
    lastReply: "I'll take it \u2014 sending a DM now. Can you post the serial for the marketplace log?",
    time: '9:45',
    avatarName: 'Kenji Tanaka',
    priority: 'medium',
  },
  {
    id: 'ct-3',
    participants: ['Emily Park', 'David Kim', 'Rudy Santino'],
    channelName: '#introductions',
    channelEmoji: '\ud83d\udc4b',
    channelLabel: 'Welcome',
    parentPreview: "Hey everyone! Just joined Cohort 5 \u2014 excited to finally start Photography Masterclass.",
    lastReply: 'Welcome! Cohort 5 starts May 6, so you have a couple weeks to warm up on Lessons 1\u20132.',
    time: '9:45',
    avatarName: 'Emily Park',
    priority: 'medium',
  },
  {
    id: 'ct-4',
    participants: ['Rudy Santino', 'Maya', 'James', 'Emily', 'David', 'Priya'],
    channelName: '#announcements',
    channelEmoji: '\ud83d\udce2',
    channelLabel: 'Announcements',
    parentPreview: "Cohort 5 kickoff is May 6 at 7pm EST. Topic: 'Seeing like a photographer.'",
    lastReply: "Can't wait! Adding to my calendar now.",
    time: '9:45',
    avatarName: 'Rudy Santino',
    priority: 'low',
  },
  {
    id: 'ct-5',
    participants: ['Amy Torres', 'you'],
    channelLabel: 'DM',
    parentPreview: 'Sarah, could you take a look at my portrait series when you have a sec?',
    lastReply: "Of course! Send them whenever. Happy to chime in here or in critique circle \u2014 your call.",
    time: '9:45',
    avatarName: 'Amy Torres',
    priority: 'low',
  },
  {
    id: 'ct-6',
    participants: ['Priya Sharma', 'Maya', 'Nina'],
    channelEmoji: '\ud83d\udcc5',
    channelLabel: 'Events',
    channelName: '#community-events',
    parentPreview: "Anyone up for a Lightroom sync session this Saturday? Thinking 2pm EST for ~90 min.",
    lastReply: 'Count me in too.',
    time: '9:45',
    avatarName: 'Priya Sharma',
    priority: 'medium',
  },
  {
    id: 'ct-7',
    participants: ['Nina Patel', 'you'],
    channelLabel: 'DM',
    parentPreview: 'Sarah, the iOS 18 autoplay bug \u2014 any update from engineering?',
    lastReply: "Checking now. I'll ping you when I hear back.",
    time: '9:45',
    avatarName: 'Nina Patel',
    priority: 'low',
  },
  {
    id: 'ct-8',
    participants: ['James Liu'],
    channelEmoji: '\ud83d\udcf8',
    channelLabel: 'Critique circle',
    channelName: '#critique-circle',
    parentPreview: 'First attempt at indoor action \u2014 kids basketball at 1/250. Feedback welcome!',
    lastReply: 'Great first attempt! The motion blur on the ball actually adds energy.',
    time: '9:45',
    avatarName: 'James Liu',
    priority: 'low',
  },
  {
    id: 'ct-9',
    participants: ['Tom Brown'],
    channelEmoji: '\u2753',
    channelLabel: 'Questions',
    channelName: '#questions',
    parentPreview: "Canon R50 \u2014 should I start with aperture priority or jump into manual?",
    lastReply: "Start with Av (aperture priority). Manual will make sense after Lesson 2.",
    time: '9:45',
    avatarName: 'Tom Brown',
    priority: 'medium',
  },
  {
    id: 'ct-10',
    participants: ['David Kim'],
    channelEmoji: '\ud83d\udcac',
    channelLabel: 'General',
    channelName: '#general',
    parentPreview: 'Loved the latest critique circle session. The community here is something special.',
    lastReply: "Agreed \u2014 best photography community I've been part of.",
    time: '9:45',
    avatarName: 'David Kim',
    priority: 'low',
  },
];

export const CHAT_THREAD_CONVERSATIONS: Record<string, ChatThreadConversation> = {
  'ct-1': {
    channelName: '#golden-hour',
    participantNames: ['Maya Rodriguez', 'Amy Torres', 'you'],
    parentMessage: {
      id: 'ct-1-p',
      senderName: 'Maya Rodriguez',
      text: 'Finally got the warm tones right on this series \u2014 any tips for pushing the orange without losing skin detail? I feel like I\'m 90% there but the skin is starting to look sunburnt at the warmest settings.',
      time: '9:45 AM',
    },
    replies: [
      {
        id: 'ct-1-r1',
        senderName: 'Amy Torres',
        text: 'Try masking the skin separately \u2014 I\'ve had the same problem. Radial filter on the face, shift temp 200K cooler, leaves the warmth everywhere else.',
        time: '10:12 AM',
      },
      {
        id: 'ct-1-r2',
        senderName: 'You',
        text: 'What Amy said. Rudy demos this in Lesson 5 minute 18 if you want to see it live. Your tones look beautiful already.',
        time: '10:30 AM',
      },
    ],
  },
  'ct-2': {
    channelName: '#gear-marketplace',
    participantNames: ['Kenji Tanaka', 'James Liu'],
    parentMessage: {
      id: 'ct-2-p',
      senderName: 'Kenji Tanaka',
      text: 'Selling my barely-used 50mm f/1.4 \u2014 moving to the 35mm for street work. Priced below market at $450, includes original box. DM me.',
      time: '11:30 AM',
    },
    replies: [
      {
        id: 'ct-2-r1',
        senderName: 'James Liu',
        text: "I'll take it \u2014 sending a DM now. Can you post the serial for the marketplace log?",
        time: '11:45 AM',
      },
    ],
  },
  'ct-3': {
    channelName: '#introductions',
    participantNames: ['Emily Park', 'David Kim', 'Rudy Santino'],
    parentMessage: {
      id: 'ct-3-p',
      senderName: 'Emily Park',
      text: 'Hey everyone! Just joined Cohort 5 \u2014 excited to finally start Photography Masterclass. Any tips for a total beginner shooting on a Canon R50? Would love to meet some fellow new folks too.',
      time: '2:00 PM',
    },
    hiddenReplyCount: 4,
    replies: [
      {
        id: 'ct-3-r1',
        senderName: 'David Kim',
        text: 'Welcome Emily! Canon R50 is a great start. Jump into Lesson 1 and post to critique circle whenever you\'re ready \u2014 feedback is genuinely kind here.',
        time: '2:15 PM',
      },
      {
        id: 'ct-3-r2',
        senderName: 'Rudy Santino',
        text: 'Welcome! Cohort 5 starts May 6, so you have a couple weeks to warm up on Lessons 1\u20132. See you in the live kickoff.',
        time: '2:30 PM',
      },
    ],
  },
  'ct-4': {
    channelName: '#announcements',
    participantNames: ['Rudy Santino', 'Maya', 'James', 'Emily', 'David', 'Priya'],
    parentMessage: {
      id: 'ct-4-p',
      senderName: 'Rudy Santino',
      text: "Cohort 5 kickoff is May 6 at 7pm EST. Topic: 'Seeing like a photographer \u2014 the mindset shift before the gear.' Live Q&A after. Add to calendar: [link].",
      time: '10:00 AM',
    },
    hiddenReplyCount: 6,
    replies: [
      {
        id: 'ct-4-r1',
        senderName: 'Maya Rodriguez',
        text: "Can't wait! Will there be a recording for those of us in different time zones?",
        time: '10:30 AM',
      },
      {
        id: 'ct-4-r2',
        senderName: 'James Liu',
        text: 'Adding to my calendar now. Super excited for this.',
        time: '11:00 AM',
      },
    ],
  },
  'ct-5': {
    participantNames: ['Amy Torres', 'you'],
    parentMessage: {
      id: 'ct-5-p',
      senderName: 'Amy Torres',
      text: 'Sarah, could you take a look at my portrait series when you have a sec? 5 shots from last weekend\'s session, would love feedback before I post to critique circle.',
      time: '3:00 PM',
    },
    replies: [
      {
        id: 'ct-5-r1',
        senderName: 'You',
        text: "Of course! Send them whenever. Happy to chime in here or in critique circle \u2014 your call.",
        time: '3:15 PM',
      },
    ],
  },
  'ct-6': {
    channelName: '#community-events',
    participantNames: ['Priya Sharma', 'Maya Rodriguez', 'Nina Patel'],
    parentMessage: {
      id: 'ct-6-p',
      senderName: 'Priya Sharma',
      text: "Anyone up for a Lightroom sync session this Saturday? Would love to go through the Lesson 7 edits together. Thinking 2pm EST for ~90 min.",
      time: '12:00 PM',
    },
    replies: [
      {
        id: 'ct-6-r1',
        senderName: 'Maya Rodriguez',
        text: "Yes! I'll be there. Want to share screens via Zoom?",
        time: '12:30 PM',
      },
      {
        id: 'ct-6-r2',
        senderName: 'Nina Patel',
        text: 'Count me in too.',
        time: '1:00 PM',
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
  priority?: 'high' | 'medium' | 'low';
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
    roleDetail: 'PM at Flux',
    message: "Hi Sarah, I've been lurking in critique circle for weeks \u2014 your community is doing great work. Would love to connect. I'm a PM at Flux, photography is my side obsession.",
    time: '9:45',
    priority: 'medium',
  },
  {
    id: 'cr-2',
    name: 'Ralph Edwards',
    role: 'Product lead',
    roleDetail: 'Product lead at Flux',
    message: "Hello Sarah, product lead at Flux here. I've appreciated the community's critiques on my landscape work. Let's connect.",
    time: '9:45',
    priority: 'low',
  },
  {
    id: 'cr-3',
    name: 'Paula Mora',
    role: 'UX designer',
    roleDetail: 'UX designer at Flux',
    message: "Hi Sarah, UX designer at Flux. Your community's visual-feedback culture has been inspiring \u2014 would love to be in your circle.",
    time: '9:45',
    priority: 'medium',
  },
  {
    id: 'cr-4',
    name: 'Roberto Santos',
    role: 'Software engineer',
    roleDetail: 'Senior SWE at Flux',
    time: '9:45',
    priority: 'low',
  },
];

export const CONNECTION_REQUEST_PROFILES: Record<string, ConnectionRequestProfile> = {
  'cr-1': {
    name: 'Leslie Alexander',
    role: 'Product manager',
    lastSeen: 'Last seen 10hr ago',
    level: 9,
    badges: ['\ud83d\udcaa Pro', '\u270d Editor', '+2 more'],
    biography: 'PM at Flux by day, portrait and street photographer by obsession. Shoots on a Fuji X-T5. Active in several online photography communities and always looking for constructive critique.',
    email: 'leslie.alexander@flux.dev',
    website: 'www.lesliealexander.com',
    customFields: [
      { label: 'Camera', value: 'Fuji X-T5' },
      { label: 'Genre', value: 'Portrait, Street' },
      { label: 'Location', value: 'San Francisco, CA' },
    ],
    posts: 12,
    comments: 34,
    spaces: 5,
  },
  'cr-2': {
    name: 'Ralph Edwards',
    role: 'Product lead',
    lastSeen: 'Last seen 3hr ago',
    level: 7,
    badges: ['\ud83d\udcaa Pro', '+1 more'],
    biography: 'Product lead at Flux. Landscape-focused photographer, active in online photography communities. Shoots on a Sony A7RV and loves chasing golden hour in the Pacific Northwest.',
    email: 'ralph.edwards@flux.dev',
    website: 'www.ralphedwards.com',
    customFields: [
      { label: 'Camera', value: 'Sony A7RV' },
      { label: 'Genre', value: 'Landscape' },
    ],
    posts: 8,
    comments: 19,
    spaces: 3,
  },
  'cr-3': {
    name: 'Paula Mora',
    role: 'UX designer',
    lastSeen: 'Last seen 10hr ago',
    level: 6,
    badges: ['\ud83d\udcaa Pro', '\u270d Editor'],
    biography: 'UX designer at Flux. Loves visual critique culture and minimalist photography. Shoots on a Leica Q2 \u2014 mostly architecture and abstract compositions.',
    email: 'paula.mora@flux.dev',
    website: 'www.paulamora.design',
    customFields: [
      { label: 'Camera', value: 'Leica Q2' },
      { label: 'Genre', value: 'Minimalism, Architecture' },
    ],
    posts: 4,
    comments: 11,
    spaces: 2,
  },
  'cr-4': {
    name: 'Roberto Santos',
    role: 'Software engineer',
    lastSeen: 'Last seen 1d ago',
    level: 2,
    badges: ['\ud83c\udf31 New'],
    biography: 'Senior SWE at Flux. Beginner photographer \u2014 just bought my first mirrorless (Sony ZV-E10). Hoping to learn the fundamentals and connect with people who know what they\u2019re doing.',
    email: 'roberto.santos@flux.dev',
    website: 'www.robertosantos.dev',
    customFields: [
      { label: 'Camera', value: 'Sony ZV-E10' },
    ],
    posts: 1,
    comments: 3,
    spaces: 1,
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
