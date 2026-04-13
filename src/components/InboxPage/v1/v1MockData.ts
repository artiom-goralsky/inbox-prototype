// ── Types ──

export type V1Category = 'dms' | 'moderation' | 'course-comments' | 'ai-inbox';

export interface V1ThreadItem {
  id: string;
  name: string;
  time: string;
  preview: string;
  unread?: boolean;
  /** True if this DM thread is with an AI agent */
  isAgent?: boolean;
  // Moderation
  badgeLabel?: string;
  // Course comments
  lessonName?: string;
  isUnanswered?: boolean;
  // AI Inbox
  aiStatus?: 'active' | 'paused' | 'resolved';
  agentId?: 'support' | 'clarity';
}

export interface V1Message {
  id: string;
  senderName: string;
  text: string;
  time: string;
  isBot?: boolean;
  /** Thread replies attached to this message */
  replies?: V1Message[];
}

export interface V1MessageGroup {
  label: string; // "Yesterday", "Today"
  messages: V1Message[];
}

export interface V1Report {
  reporterName: string;
  reason: string;
  date: string;
  comment: string;
  status?: 'removed' | 'approved' | 'pending';
  /** Links this report to another thread item so clicking navigates to it */
  linkedThreadId?: string;
}

/** IDs that start as already reviewed, with their decisions */
export const INITIAL_REVIEWED_IDS = new Set(['mod-6', 'mod-7', 'mod-8', 'mod-11', 'mod-13']);
export const INITIAL_DECISIONS: Record<string, 'approved' | 'removed'> = {
  'mod-6': 'approved',
  'mod-7': 'removed',
  'mod-8': 'approved',
  'mod-11': 'removed',
  'mod-13': 'removed',
};

export interface V1ModerationCard {
  authorName: string;
  postSpace: string;
  reportCount: number;
  alertTitle: string;
  alertDescription: string;
  reportStats: { posts: number; comments: number; connectionRequests: number; chatMessages: number };
  postTitle: string;
  postBody: string;
  reports: V1Report[];
}

export interface V1CourseComment {
  id: string;
  name: string;
  badges?: string[];
  bio: string;
  date: string;
  text: string;
  likes: number;
}

export interface V1CourseCommentThread {
  headerLabel: string;
  courseName: string;
  comments: V1CourseComment[];
}

export interface V1AIConversation {
  agentName: string;
  memberName: string;
  groups: V1MessageGroup[];
}

// ── DM Threads ──

export const DM_THREADS: V1ThreadItem[] = [
  { id: 'dm-1', name: 'Kathryn Murphy', time: '9:45', preview: 'Hey, want to play?', unread: false },
  { id: 'dm-2', name: 'Kristin Watson', time: '9:45', preview: 'Please let me know if yo...', unread: false },
  { id: 'dm-3', name: 'Calvin Parks', time: '9:45', preview: "Hi there! What's up?", unread: true },
  { id: 'dm-agent-1', name: 'Onboarding Assistant', time: '9:30', preview: 'Welcome! Here\u2019s how to get started...', unread: true, isAgent: true },
  { id: 'dm-4', name: 'Courtney Henry', time: '9:45', preview: 'HAHAHA', unread: false },
  { id: 'dm-5', name: 'Ralph Edwards', time: '9:45', preview: 'Let me go grab some sn...', unread: false },
  { id: 'dm-agent-2', name: 'Support Bot', time: '8:12', preview: 'Your ticket #4821 has been resolved.', unread: false, isAgent: true },
  { id: 'dm-6', name: 'Jane Cooper', time: '9:45', preview: "I don't have it installed y...", unread: false },
  { id: 'dm-7', name: 'Annette Black', time: '9:45', preview: "Hey! How's it going?", unread: false },
  { id: 'dm-8', name: 'Wade Warren', time: '9:45', preview: 'Still trying to play?', unread: false },
  { id: 'dm-agent-3', name: 'Content Coach', time: 'Yesterday', preview: 'Your post draft looks great! A few suggestions...', unread: false, isAgent: true },
  { id: 'dm-9', name: 'Cody Fisher', time: '9:45', preview: 'Let me go grab some sn...', unread: false },
  { id: 'dm-10', name: 'Dianne Russell', time: '9:45', preview: "I don't have it installed y...", unread: false },
  { id: 'dm-11', name: 'Jacob Jones', time: '9:45', preview: "Hey! How's it going?", unread: false },
  { id: 'dm-12', name: 'Albert Flores', time: '9:45', preview: 'Still trying to play?', unread: false },
  { id: 'dm-13', name: 'Ronald Richards', time: '9:45', preview: 'Let me go grab some sn...', unread: false },
];

// ── DM Conversations ──

export const DM_CONVERSATIONS: Record<string, V1MessageGroup[]> = {
  'dm-3': [
    {
      label: 'Yesterday',
      messages: [
        { id: 'm1', senderName: 'Mike Walero', text: "Hey team, what's up?", time: '2:30 PM' },
        { id: 'm2', senderName: 'Mike Walero', text: 'Hope everyone had a great weekend!', time: '2:31 PM' },
        { id: 'm3', senderName: 'Calvin Parks', text: 'We should start a mind-bending conversation about quantum mechanics and parallel worlds', time: '3:15 PM' },
        { id: 'm4', senderName: 'Andria Warren', text: 'We should start a mind-bending conversation about quantum mechanics and parallel worlds', time: '3:20 PM' },
        { id: 'm5', senderName: 'Calvin Parks', text: "I'm game!", time: '3:25 PM' },
        { id: 'm6', senderName: 'Rosetta Stoney', text: "Oooh! This is a good one. Let's dig in", time: '3:30 PM', replies: [
          { id: 'r1', senderName: 'Calvin Parks', text: 'Right? This could get deep.', time: '3:35 PM' },
          { id: 'r2', senderName: 'Andria Warren', text: 'I love these kinds of conversations!', time: '3:40 PM' },
        ] },
      ],
    },
    {
      label: 'Today',
      messages: [
        { id: 'm7', senderName: 'Calvin Parks', text: 'Something has always existed according to physics, there can never be true physical nothingness though there can be times when', time: '9:15 AM' },
        { id: 'm8', senderName: 'Calvin Parks', text: 'Even on computers deleted data is not actually tossed \ud83d\ude04', time: '9:16 AM' },
        { id: 'm9', senderName: 'Andria Warren', text: "Big Bang\u2014God, the universe in infinitesimal form, or both\u2014one thing is certain: it was there.", time: '9:30 AM' },
        { id: 'm10', senderName: 'Cameron Miller', text: "Such as a vacuum (the state of minimum possible energy). Creating a space where there are no quantum fluctuations requires an enormous amount of energy, and there would be a remnant of that energy in that...", time: '9:45 AM', replies: [
          { id: 'r3', senderName: 'Rosetta Stoney', text: 'That\u2019s a fascinating point about vacuum energy.', time: '9:50 AM' },
          { id: 'r4', senderName: 'Andria Warren', text: 'The idea of quantum fluctuations in a vacuum state is mind-blowing.', time: '10:02 AM' },
          { id: 'r5', senderName: 'Calvin Parks', text: 'So true \u2014 even emptiness isn\u2019t really empty!', time: '10:15 AM' },
        ] },
      ],
    },
  ],
  'dm-1': [
    {
      label: 'Today',
      messages: [
        { id: 'm10', senderName: 'Kathryn Murphy', text: 'Hey, want to play?', time: '9:45 AM' },
        { id: 'm11', senderName: 'You', text: "Sure! What did you have in mind?", time: '9:46 AM' },
      ],
    },
  ],
};

// ── Moderation Threads ──
// Authors with multiple items: Eliza Stone (mod-1, mod-4, mod-7), Hailey Mills (mod-3, mod-8),
// Kenna Weimann (mod-10, mod-13), Jordan Rivers (mod-2, mod-12)
// Pre-reviewed: mod-6, mod-7, mod-8, mod-11, mod-13 (see INITIAL_REVIEWED_IDS)

export const MODERATION_THREADS: V1ThreadItem[] = [
  { id: 'mod-1',  name: 'Eliza Stone',        time: '9:45',      preview: 'This is absolutely unacceptable...',   badgeLabel: 'Post' },
  { id: 'mod-2',  name: 'Jordan Rivers',       time: '9:45',      preview: "I can't believe this is allowed...",   badgeLabel: 'Comment' },
  { id: 'mod-3',  name: 'Hailey Mills',        time: '9:45',      preview: 'You should be ashamed...',             badgeLabel: 'Post' },
  { id: 'mod-4',  name: 'Eliza Stone',         time: '9:30',      preview: 'Stop wasting everyone\u2019s time...', badgeLabel: 'Comment' },
  { id: 'mod-5',  name: 'Britta Holt',         time: '9:45',      preview: "I'm blocking you...",                  badgeLabel: 'DM' },
  { id: 'mod-6',  name: 'Kenton Kunze',        time: '8:12',      preview: 'I hope you get banned...',             badgeLabel: 'Post' },
  { id: 'mod-7',  name: 'Eliza Stone',         time: 'Yesterday',  preview: 'Nobody asked for your opinion...',    badgeLabel: 'Post' },
  { id: 'mod-8',  name: 'Hailey Mills',        time: 'Yesterday',  preview: 'This community is a joke...',         badgeLabel: 'Post' },
  { id: 'mod-9',  name: 'Drew Essien',         time: '9:45',      preview: 'Get a life, seriously...',             badgeLabel: 'Post' },
  { id: 'mod-10', name: 'Kenna Weimann',       time: '9:45',      preview: 'Suspicious connection request...',     badgeLabel: 'Connection' },
  { id: 'mod-11', name: 'Lana Baumgartner',    time: 'Mon',        preview: 'Reported promotional content...',     badgeLabel: 'Post' },
  { id: 'mod-12', name: 'Jordan Rivers',       time: '9:45',      preview: 'This is why the internet is toxic...', badgeLabel: 'Post' },
  { id: 'mod-13', name: 'Kenna Weimann',       time: 'Mon',        preview: 'Spam link in bio...',                 badgeLabel: 'Post' },
];

// ── Moderation Cards ──

export const MODERATION_CARDS: Record<string, V1ModerationCard> = {
  'mod-1': {
    authorName: 'Eliza Stone',
    postSpace: 'General Discussion',
    reportCount: 2,
    alertTitle: 'Eliza Stone has 4 other reports',
    alertDescription: '3 posts \u00b7 1 comment \u00b7 0 connection requests \u00b7 0 chat messages',
    reportStats: { posts: 3, comments: 1, connectionRequests: 0, chatMessages: 0 },
    postTitle: 'This is absolutely unacceptable',
    postBody: 'I cannot believe the quality of content being shared in this community. The moderation team needs to step up and address this immediately.',
    reports: [
      { reporterName: 'Sarah Johnson', reason: 'Harassment', date: '1 day ago', comment: 'Aggressive language towards other members.', status: 'pending' },
      { reporterName: 'Eliza Stone', reason: 'Harassment', date: '9:30 AM', comment: 'Dismissive comment on a member\u2019s post.', status: 'pending', linkedThreadId: 'mod-4' },
      { reporterName: 'Eliza Stone', reason: 'Harassment', date: 'Yesterday', comment: 'Hostile post in Photography Basics.', status: 'removed', linkedThreadId: 'mod-7' },
    ],
  },
  'mod-2': {
    authorName: 'Jordan Rivers',
    postSpace: 'Beginner Tips',
    reportCount: 1,
    alertTitle: 'Jordan Rivers has 1 other report',
    alertDescription: '1 post \u00b7 1 comment \u00b7 0 connection requests \u00b7 0 chat messages',
    reportStats: { posts: 1, comments: 1, connectionRequests: 0, chatMessages: 0 },
    postTitle: 'Terrible advice',
    postBody: "I can't believe this is allowed here. This so-called \u2018tip\u2019 is completely wrong and will ruin people\u2019s settings.",
    reports: [
      { reporterName: 'Lena Park', reason: 'Harassment', date: '1 day ago', comment: 'Hostile and dismissive comment on my post.', status: 'pending' },
      { reporterName: 'Jordan Rivers', reason: 'Toxicity', date: '9:45 AM', comment: 'Toxic rant about the community.', status: 'pending', linkedThreadId: 'mod-12' },
    ],
  },
  'mod-3': {
    authorName: 'Hailey Mills',
    postSpace: 'Introductions',
    reportCount: 3,
    alertTitle: 'Hailey Mills has 1 other report',
    alertDescription: '2 posts \u00b7 0 comments \u00b7 0 connection requests \u00b7 0 chat messages',
    reportStats: { posts: 2, comments: 0, connectionRequests: 0, chatMessages: 0 },
    postTitle: 'You should be ashamed',
    postBody: 'You should be ashamed of the way this community is run. Nobody moderates anything and the quality keeps dropping.',
    reports: [
      { reporterName: 'Marcela Alves', reason: 'Harassment', date: '2 days ago', comment: 'Aggressive tone and personal attacks.', status: 'pending' },
      { reporterName: 'Corina McCoy', reason: 'Harassment', date: '2 days ago', comment: 'Unnecessarily hostile language.', status: 'pending' },
      { reporterName: 'Hailey Mills', reason: 'Negativity', date: 'Yesterday', comment: 'Follow-up rant calling the community a joke.', status: 'approved', linkedThreadId: 'mod-8' },
    ],
  },
  'mod-4': {
    authorName: 'Eliza Stone',
    postSpace: 'Photography Basics',
    reportCount: 1,
    alertTitle: 'Eliza Stone has 4 other reports',
    alertDescription: '3 posts \u00b7 1 comment \u00b7 0 connection requests \u00b7 0 chat messages',
    reportStats: { posts: 3, comments: 1, connectionRequests: 0, chatMessages: 0 },
    postTitle: 'Stop wasting everyone\u2019s time',
    postBody: 'Stop wasting everyone\u2019s time with these basic questions. Use the search function before posting.',
    reports: [
      { reporterName: 'Mike Chen', reason: 'Harassment', date: '9:30 AM', comment: 'Rude and unwelcoming to new members.', status: 'pending' },
      { reporterName: 'Eliza Stone', reason: 'Harassment', date: '9:45 AM', comment: 'Aggressive post in General Discussion.', status: 'pending', linkedThreadId: 'mod-1' },
      { reporterName: 'Eliza Stone', reason: 'Harassment', date: 'Yesterday', comment: 'Hostile post in Photography Basics.', status: 'removed', linkedThreadId: 'mod-7' },
    ],
  },
  'mod-5': {
    authorName: 'Britta Holt',
    postSpace: 'Direct Messages',
    reportCount: 1,
    alertTitle: 'Britta Holt has 0 other reports',
    alertDescription: '0 posts \u00b7 0 comments \u00b7 0 connection requests \u00b7 1 chat message',
    reportStats: { posts: 0, comments: 0, connectionRequests: 0, chatMessages: 1 },
    postTitle: 'Threatening DM',
    postBody: "I'm blocking you and reporting you to admin. You don\u2019t belong here and everyone knows it.",
    reports: [
      { reporterName: 'Alex Turner', reason: 'Threats', date: '9:45 AM', comment: 'Received a threatening direct message.', status: 'pending' },
    ],
  },
  'mod-6': {
    authorName: 'Kenton Kunze',
    postSpace: 'Street Photography',
    reportCount: 1,
    alertTitle: 'Kenton Kunze has 0 other reports',
    alertDescription: '1 post \u00b7 0 comments \u00b7 0 connection requests \u00b7 0 chat messages',
    reportStats: { posts: 1, comments: 0, connectionRequests: 0, chatMessages: 0 },
    postTitle: 'I hope you get banned',
    postBody: 'I hope you get banned for posting this garbage. The mods clearly don\u2019t care about quality control.',
    reports: [
      { reporterName: 'Profanity Filter', reason: 'Hostility', date: '8:12 AM', comment: 'Auto-flagged for hostile language toward another member.', status: 'approved' },
    ],
  },
  'mod-7': {
    authorName: 'Eliza Stone',
    postSpace: 'Photography Basics',
    reportCount: 1,
    alertTitle: 'Eliza Stone has 4 other reports',
    alertDescription: '3 posts \u00b7 1 comment \u00b7 0 connection requests \u00b7 0 chat messages',
    reportStats: { posts: 3, comments: 1, connectionRequests: 0, chatMessages: 0 },
    postTitle: 'Nobody asked for your opinion',
    postBody: 'Nobody asked for your opinion on this. Maybe sit this one out if you don\u2019t know what you\u2019re talking about.',
    reports: [
      { reporterName: 'Rachel Torres', reason: 'Harassment', date: 'Yesterday', comment: 'Aggressive and dismissive response to constructive feedback.', status: 'removed' },
      { reporterName: 'Eliza Stone', reason: 'Harassment', date: '9:45 AM', comment: 'Post in General Discussion.', status: 'pending', linkedThreadId: 'mod-1' },
      { reporterName: 'Eliza Stone', reason: 'Harassment', date: '9:30 AM', comment: 'Comment in Photography Basics.', status: 'pending', linkedThreadId: 'mod-4' },
    ],
  },
  'mod-8': {
    authorName: 'Hailey Mills',
    postSpace: 'General Discussion',
    reportCount: 1,
    alertTitle: 'Hailey Mills has 1 other report',
    alertDescription: '2 posts \u00b7 0 comments \u00b7 0 connection requests \u00b7 0 chat messages',
    reportStats: { posts: 2, comments: 0, connectionRequests: 0, chatMessages: 0 },
    postTitle: 'This community is a joke',
    postBody: 'This community is a joke. Nobody here actually knows what they\u2019re doing and the content keeps getting worse.',
    reports: [
      { reporterName: 'Wade Warren', reason: 'Negativity', date: 'Yesterday', comment: 'Constant negativity dragging down discussions.', status: 'approved' },
      { reporterName: 'Hailey Mills', reason: 'Harassment', date: '2 days ago', comment: 'Aggressive post in Introductions.', status: 'pending', linkedThreadId: 'mod-3' },
    ],
  },
  'mod-9': {
    authorName: 'Drew Essien',
    postSpace: 'Landscape Tips',
    reportCount: 2,
    alertTitle: 'Drew Essien has 0 other reports',
    alertDescription: '1 post \u00b7 0 comments \u00b7 0 connection requests \u00b7 0 chat messages',
    reportStats: { posts: 1, comments: 0, connectionRequests: 0, chatMessages: 0 },
    postTitle: 'Get a life, seriously',
    postBody: 'Get a life, seriously. If you have time to nitpick other people\u2019s photos you clearly have nothing better to do.',
    reports: [
      { reporterName: 'Calvin Parks', reason: 'Harassment', date: '9:45 AM', comment: 'Personal attack on another member.', status: 'pending' },
      { reporterName: 'Annette Black', reason: 'Harassment', date: '9:30 AM', comment: 'Rude and dismissive language.', status: 'pending' },
    ],
  },
  'mod-10': {
    authorName: 'Kenna Weimann',
    postSpace: 'Connections',
    reportCount: 1,
    alertTitle: 'Kenna Weimann has 1 other report',
    alertDescription: '1 post \u00b7 0 comments \u00b7 1 connection request \u00b7 0 chat messages',
    reportStats: { posts: 1, comments: 0, connectionRequests: 1, chatMessages: 0 },
    postTitle: 'Suspicious connection request',
    postBody: 'Connection request from account with no posts, no bio, and a stock photo avatar.',
    reports: [
      { reporterName: 'Spam Filter', reason: 'Spam', date: '9:45 AM', comment: 'Auto-flagged: suspicious profile with no activity.', status: 'pending' },
      { reporterName: 'Kenna Weimann', reason: 'Spam', date: 'Mon', comment: 'Spam link posted in General Discussion.', status: 'removed', linkedThreadId: 'mod-13' },
    ],
  },
  'mod-11': {
    authorName: 'Lana Baumgartner',
    postSpace: 'Gear Talk',
    reportCount: 2,
    alertTitle: 'Lana Baumgartner has 0 other reports',
    alertDescription: '1 post \u00b7 0 comments \u00b7 0 connection requests \u00b7 0 chat messages',
    reportStats: { posts: 1, comments: 0, connectionRequests: 0, chatMessages: 0 },
    postTitle: 'Promotional content',
    postBody: 'Check out my photography course at photopro-academy.com! Use code CIRCLE50 for 50% off. Best investment you\u2019ll make this year.',
    reports: [
      { reporterName: 'Jane Cooper', reason: 'Spam', date: 'Mon', comment: 'Unsolicited self-promotion with referral link.', status: 'removed' },
      { reporterName: 'Ralph Edwards', reason: 'Spam', date: 'Mon', comment: 'Promotional link drop without context.', status: 'removed' },
    ],
  },
  'mod-12': {
    authorName: 'Jordan Rivers',
    postSpace: 'General Discussion',
    reportCount: 1,
    alertTitle: 'Jordan Rivers has 1 other report',
    alertDescription: '1 post \u00b7 1 comment \u00b7 0 connection requests \u00b7 0 chat messages',
    reportStats: { posts: 1, comments: 1, connectionRequests: 0, chatMessages: 0 },
    postTitle: 'This is why the internet is toxic',
    postBody: 'This is why the internet is toxic. Every community starts fine and then devolves into people patting each other on the back for mediocre work.',
    reports: [
      { reporterName: 'Dianne Russell', reason: 'Negativity', date: '9:45 AM', comment: 'Toxic generalization about the community.', status: 'pending' },
      { reporterName: 'Jordan Rivers', reason: 'Harassment', date: '1 day ago', comment: 'Hostile comment in Beginner Tips.', status: 'pending', linkedThreadId: 'mod-2' },
    ],
  },
  'mod-13': {
    authorName: 'Kenna Weimann',
    postSpace: 'General Discussion',
    reportCount: 1,
    alertTitle: 'Kenna Weimann has 1 other report',
    alertDescription: '1 post \u00b7 0 comments \u00b7 1 connection request \u00b7 0 chat messages',
    reportStats: { posts: 1, comments: 0, connectionRequests: 1, chatMessages: 0 },
    postTitle: 'Spam link in bio',
    postBody: 'Posted a link to an external store with suspicious URL patterns. Profile appears to be a spam account.',
    reports: [
      { reporterName: 'Spam Filter', reason: 'Spam', date: 'Mon', comment: 'Auto-flagged: external link matching known spam patterns.', status: 'removed' },
      { reporterName: 'Kenna Weimann', reason: 'Spam', date: '9:45 AM', comment: 'Suspicious connection request.', status: 'pending', linkedThreadId: 'mod-10' },
    ],
  },
};

// ── Course Comments Threads ──

export const COURSE_THREADS: V1ThreadItem[] = [
  { id: 'cc-1', name: 'Eliza Stone', time: '9:45', preview: "I don't understand this at all.", lessonName: 'Lesson 1: Basic Framing', isUnanswered: true },
  { id: 'cc-2', name: 'Jordan Rivers', time: '9:45', preview: "I'm so lost, can someone help?", lessonName: 'Intro to Photography', isUnanswered: true },
  { id: 'cc-3', name: 'Hailey Mills', time: '9:45', preview: 'This is not a good way to teach this.', lessonName: 'Lesson 4: Action Shots' },
  { id: 'cc-4', name: 'Lana Baumgartner', time: '9:45', preview: "I'm giving up on this lesson.", lessonName: 'Lesson 8: Black and White', isUnanswered: true },
  { id: 'cc-5', name: 'Britta Holt', time: '9:45', preview: "I'm going to need a tutor for this.", lessonName: 'Lesson 6: Night Photography', isUnanswered: true },
  { id: 'cc-6', name: 'Kenton Kunze', time: '9:45', preview: 'This is way too complicated for me.', lessonName: 'Lesson 2: Natural Lighting' },
  { id: 'cc-7', name: 'Jody Brekke', time: '9:45', preview: 'This is the worst lesson ever.', lessonName: 'Lesson 9: Street Photography' },
  { id: 'cc-8', name: 'Ricardo Archuleta', time: '9:45', preview: "I'm never going to understand this.", lessonName: 'Lesson 10: Still Life', isUnanswered: true },
  { id: 'cc-9', name: 'Drew Essien', time: '9:45', preview: 'I need a simpler explanation.', lessonName: 'Lesson 11: Photojournalism', isUnanswered: true },
  { id: 'cc-10', name: 'Tod Gerhold', time: '9:45', preview: "I'm done with this platform", lessonName: 'Lesson 1: Camera basics' },
];

// ── Course Comment Threads ──

export const COURSE_COMMENT_DATA: Record<string, V1CourseCommentThread> = {
  'cc-2': {
    headerLabel: 'Comment',
    courseName: 'Intro to Photography',
    comments: [
      {
        id: 'c1',
        name: 'Calvin Parks',
        badges: ['Pro', 'Editor', '+2'],
        bio: 'Helping grow businesses without destroying the planet through the OPF ...',
        date: 'Jan 29, 2026',
        text: 'Welcome to everyone just starting out! The key in the intro lesson is to not get overwhelmed — just focus on learning one concept at a time. The course builds on itself really well.',
        likes: 56,
      },
      {
        id: 'c2',
        name: 'Albert Flores',
        badges: [],
        bio: 'Helping grow businesses without destroying the planet through the OPF ...',
        date: 'Jan 31, 2026',
        text: 'I felt the same way at the start. Honestly the biggest unlock for me was just going outside with my camera for 30 minutes a day and shooting anything. Theory only clicks after you practice.',
        likes: 10,
      },
      {
        id: 'c3',
        name: 'Abram Wilson',
        badges: [],
        bio: 'Community manager',
        date: 'Jan 31, 2026',
        text: "Don't worry if it feels slow at first — everyone goes through that initial confusion. The instructor's style becomes easier to follow by lesson 3.",
        likes: 4,
      },
      {
        id: 'c3b',
        name: 'Kathryn Murphy',
        badges: ['Pro'],
        bio: 'Design systems enthusiast and amateur photographer',
        date: 'Feb 2, 2026',
        text: 'I found it helpful to pause the video often and try each technique right away. Re-watching with fresh eyes after actually attempting a shot makes everything click.',
        likes: 22,
      },
      {
        id: 'c4',
        name: 'Jordan Rivers',
        badges: ['Editor'],
        bio: 'Learning photography from scratch. Excited to be part of this community!',
        date: 'Today, 2:20PM',
        text: "I'm so lost, can someone help? I feel like I'm missing some fundamental context. Is there a recommended reading list before diving in?",
        likes: 5,
      },
    ],
  },
  'cc-1': {
    headerLabel: 'Comment',
    courseName: 'Lesson 1: Basic Framing',
    comments: [
      {
        id: 'c10',
        name: 'Calvin Parks',
        badges: ['Pro', 'Editor'],
        bio: 'Helping grow businesses without destroying the planet through the OPF ...',
        date: 'Jan 28, 2026',
        text: "Basic framing is honestly the foundation of everything. Spend an afternoon just shooting doorways, windows, and arches — you'll internalize it faster than any diagram.",
        likes: 34,
      },
      {
        id: 'c11',
        name: 'Abram Wilson',
        badges: [],
        bio: 'Community manager',
        date: 'Jan 29, 2026',
        text: "The rule of thirds grid overlay in your camera viewfinder is a game-changer when you're starting out. Enable it in your camera settings and leave it on for a week.",
        likes: 18,
      },
      {
        id: 'c12',
        name: 'Kathryn Murphy',
        badges: ['Pro'],
        bio: 'Design systems enthusiast and amateur photographer',
        date: 'Jan 30, 2026',
        text: 'Framing changed the way I see everything — even outside of photography. Once it clicks, you start noticing leading lines and natural frames everywhere you look.',
        likes: 11,
      },
      {
        id: 'c13',
        name: 'Eliza Stone',
        badges: ['Pro'],
        bio: 'Photography enthusiast and traveler',
        date: 'Today, 9:45AM',
        text: "I don't understand this at all. Can someone break down the rule of thirds in simpler terms? The video explanation felt really rushed.",
        likes: 3,
      },
    ],
  },
  'cc-3': {
    headerLabel: 'Comment',
    courseName: 'Lesson 4: Action Shots',
    comments: [
      {
        id: 'cc3-1',
        name: 'Calvin Parks',
        badges: ['Pro', 'Editor'],
        bio: 'Helping grow businesses without destroying the planet through the OPF ...',
        date: 'Feb 3, 2026',
        text: 'Action shots require you to think in fractions of a second. Start with 1/500s shutter speed and work your way up. Burst mode is your best friend here.',
        likes: 41,
      },
      {
        id: 'cc3-2',
        name: 'Wade Warren',
        badges: [],
        bio: 'Sports photography hobbyist',
        date: 'Feb 4, 2026',
        text: 'Continuous autofocus (AF-C on Nikon, AI Servo on Canon) makes a huge difference. Most beginners leave their camera on single-point AF and wonder why their shots are blurry.',
        likes: 29,
      },
      {
        id: 'cc3-3',
        name: 'Abram Wilson',
        badges: [],
        bio: 'Community manager',
        date: 'Feb 5, 2026',
        text: 'Pre-focusing on where the action will happen is an underrated technique. Predict the movement and have your camera ready before the moment occurs.',
        likes: 7,
      },
      {
        id: 'cc3-4',
        name: 'Hailey Mills',
        badges: [],
        bio: 'Aspiring sports photographer',
        date: 'Today, 11:15AM',
        text: "This is not a good way to teach this. The lesson jumps straight into burst mode without explaining shutter priority first. I had no idea what settings to even start with.",
        likes: 2,
      },
    ],
  },
  'cc-4': {
    headerLabel: 'Comment',
    courseName: 'Lesson 8: Black and White',
    comments: [
      {
        id: 'cc4-1',
        name: 'Albert Flores',
        badges: [],
        bio: 'Helping grow businesses without destroying the planet through the OPF ...',
        date: 'Feb 6, 2026',
        text: 'Black and white photography strips away color as a crutch and forces you to think about light, texture, and form. It made me a significantly better color photographer.',
        likes: 38,
      },
      {
        id: 'cc4-2',
        name: 'Kathryn Murphy',
        badges: ['Pro'],
        bio: 'Design systems enthusiast and amateur photographer',
        date: 'Feb 7, 2026',
        text: "The contrast slider in Lightroom is your playground in B&W. Don't be afraid to push the highlights and shadows to extremes — that's where the drama lives.",
        likes: 15,
      },
      {
        id: 'cc4-3',
        name: 'Abram Wilson',
        badges: [],
        bio: 'Community manager',
        date: 'Feb 8, 2026',
        text: "Shoot in RAW + JPEG with your camera's B&W filter applied. You get the B&W preview in-camera but keep all the color data for post-processing.",
        likes: 9,
      },
      {
        id: 'cc4-4',
        name: 'Lana Baumgartner',
        badges: [],
        bio: 'Hobbyist photographer, lover of film',
        date: 'Today, 10:05AM',
        text: "I'm giving up on this lesson. I've watched it three times and still can't figure out how to get that classic high-contrast film look. None of the settings mentioned seem to work.",
        likes: 1,
      },
    ],
  },
  'cc-5': {
    headerLabel: 'Comment',
    courseName: 'Lesson 6: Night Photography',
    comments: [
      {
        id: 'cc5-1',
        name: 'Calvin Parks',
        badges: ['Pro', 'Editor'],
        bio: 'Helping grow businesses without destroying the planet through the OPF ...',
        date: 'Feb 9, 2026',
        text: "A sturdy tripod is non-negotiable for night work. Even a slight wobble at 2-second exposures will ruin the shot. Also use a remote shutter or your camera's 2s timer.",
        likes: 52,
      },
      {
        id: 'cc5-2',
        name: 'Wade Warren',
        badges: [],
        bio: 'Sports photography hobbyist',
        date: 'Feb 10, 2026',
        text: "ISO noise is real but don't be afraid of it. Modern cameras handle ISO 3200 incredibly well, and a bit of grain adds character especially to city night shots.",
        likes: 20,
      },
      {
        id: 'cc5-3',
        name: 'Kathryn Murphy',
        badges: ['Pro'],
        bio: 'Design systems enthusiast and amateur photographer',
        date: 'Feb 11, 2026',
        text: 'The "500 rule" for star shots: divide 500 by your focal length to get the max exposure time before stars start trailing. Super useful formula.',
        likes: 33,
      },
      {
        id: 'cc5-4',
        name: 'Britta Holt',
        badges: [],
        bio: 'Nightscape photography beginner',
        date: 'Today, 8:50AM',
        text: "I'm going to need a tutor for this. The manual mode explanation goes way too fast and I can't figure out the exposure triangle when everything is dark.",
        likes: 4,
      },
    ],
  },
  'cc-6': {
    headerLabel: 'Comment',
    courseName: 'Lesson 2: Natural Lighting',
    comments: [
      {
        id: 'cc6-1',
        name: 'Abram Wilson',
        badges: [],
        bio: 'Community manager',
        date: 'Feb 2, 2026',
        text: 'Golden hour is the most forgiving light for beginners. Set an alarm for 30 minutes before sunset and go outside — even mediocre compositions look stunning in that warm light.',
        likes: 47,
      },
      {
        id: 'cc6-2',
        name: 'Albert Flores',
        badges: [],
        bio: 'Helping grow businesses without destroying the planet through the OPF ...',
        date: 'Feb 3, 2026',
        text: 'Overcast days are massively underrated. The clouds act like a giant softbox — perfect diffused light with no harsh shadows. Ideal for portraits.',
        likes: 31,
      },
      {
        id: 'cc6-3',
        name: 'Calvin Parks',
        badges: ['Pro', 'Editor'],
        bio: 'Helping grow businesses without destroying the planet through the OPF ...',
        date: 'Feb 4, 2026',
        text: 'Learn to read the direction of light first. Once you understand front, side, and back lighting, everything else — reflectors, fill cards — makes immediate sense.',
        likes: 19,
      },
      {
        id: 'cc6-4',
        name: 'Kenton Kunze',
        badges: [],
        bio: 'Photography enthusiast from Portland',
        date: 'Today, 1:30PM',
        text: "This is way too complicated for me. There are five different concepts introduced in 10 minutes with no exercises to practice any of them. I'm completely overwhelmed.",
        likes: 2,
      },
    ],
  },
  'cc-7': {
    headerLabel: 'Comment',
    courseName: 'Lesson 9: Street Photography',
    comments: [
      {
        id: 'cc7-1',
        name: 'Albert Flores',
        badges: [],
        bio: 'Helping grow businesses without destroying the planet through the OPF ...',
        date: 'Feb 12, 2026',
        text: 'The biggest barrier to street photography is psychological, not technical. Zone focusing on a 35mm lens and just walking with confidence gets better results than overthinking settings.',
        likes: 60,
      },
      {
        id: 'cc7-2',
        name: 'Calvin Parks',
        badges: ['Pro', 'Editor'],
        bio: 'Helping grow businesses without destroying the planet through the OPF ...',
        date: 'Feb 13, 2026',
        text: "Shoot at 1/250s minimum to freeze incidental motion, and keep your aperture between f/8–f/11 so you're not constantly hunting for focus. This lets you react instantly.",
        likes: 28,
      },
      {
        id: 'cc7-3',
        name: 'Kathryn Murphy',
        badges: ['Pro'],
        bio: 'Design systems enthusiast and amateur photographer',
        date: 'Feb 14, 2026',
        text: "Don't neglect the context around your subject. The best street photos tell a story — the expression, the environment, and the lighting all working together.",
        likes: 14,
      },
      {
        id: 'cc7-4',
        name: 'Jody Brekke',
        badges: [],
        bio: 'Film school dropout, aspiring street photographer',
        date: 'Today, 3:10PM',
        text: "This is the worst lesson ever. There's zero guidance on how to approach strangers comfortably. It just says 'be confident' without any actual technique.",
        likes: 1,
      },
    ],
  },
  'cc-8': {
    headerLabel: 'Comment',
    courseName: 'Lesson 10: Still Life',
    comments: [
      {
        id: 'cc8-1',
        name: 'Abram Wilson',
        badges: [],
        bio: 'Community manager',
        date: 'Feb 14, 2026',
        text: "Still life is the perfect way to practice composition when you can't get outside. You can spend an hour rearranging the same three objects and learn more than a full day shooting.",
        likes: 36,
      },
      {
        id: 'cc8-2',
        name: 'Wade Warren',
        badges: [],
        bio: 'Sports photography hobbyist',
        date: 'Feb 15, 2026',
        text: 'A piece of white foam board from the dollar store works as a fantastic reflector and fill card. Cheap and instantly elevates your setup.',
        likes: 24,
      },
      {
        id: 'cc8-3',
        name: 'Albert Flores',
        badges: [],
        bio: 'Helping grow businesses without destroying the planet through the OPF ...',
        date: 'Feb 16, 2026',
        text: 'Texture is everything in still life. Side lighting from a window at 90 degrees to your subject brings out incredible detail that front lighting completely destroys.',
        likes: 17,
      },
      {
        id: 'cc8-4',
        name: 'Ricardo Archuleta',
        badges: [],
        bio: 'Commercial photography student',
        date: 'Today, 12:00PM',
        text: "I'm never going to understand this. My photos keep looking flat and boring no matter what I try. The lesson doesn't explain how to create depth.",
        likes: 2,
      },
    ],
  },
  'cc-9': {
    headerLabel: 'Comment',
    courseName: 'Lesson 11: Photojournalism',
    comments: [
      {
        id: 'cc9-1',
        name: 'Calvin Parks',
        badges: ['Pro', 'Editor'],
        bio: 'Helping grow businesses without destroying the planet through the OPF ...',
        date: 'Feb 17, 2026',
        text: 'Photojournalism is about being present and invisible at the same time. A 50mm lens at eye level with available light is the most honest way to document a moment.',
        likes: 45,
      },
      {
        id: 'cc9-2',
        name: 'Kathryn Murphy',
        badges: ['Pro'],
        bio: 'Design systems enthusiast and amateur photographer',
        date: 'Feb 18, 2026',
        text: 'Ethics matter enormously here. The lesson is right to emphasize consent and context — a photograph without context can easily mislead. Always think about how an image will be interpreted.',
        likes: 39,
      },
      {
        id: 'cc9-3',
        name: 'Abram Wilson',
        badges: [],
        bio: 'Community manager',
        date: 'Feb 19, 2026',
        text: 'Start by covering local events — farmers markets, community meetings, school plays. Low stakes, lots of variety, and people are generally open to being photographed.',
        likes: 12,
      },
      {
        id: 'cc9-4',
        name: 'Drew Essien',
        badges: [],
        bio: 'Journalism student with a camera',
        date: 'Today, 4:00PM',
        text: "I need a simpler explanation. The lecture jumps between ethics, composition, and gear without a clear structure. Can anyone summarize the three most important takeaways?",
        likes: 6,
      },
    ],
  },
  'cc-10': {
    headerLabel: 'Comment',
    courseName: 'Lesson 1: Camera Basics',
    comments: [
      {
        id: 'cc10-1',
        name: 'Albert Flores',
        badges: [],
        bio: 'Helping grow businesses without destroying the planet through the OPF ...',
        date: 'Mar 1, 2026',
        text: 'Start by memorizing just three things: aperture controls depth of field, shutter speed controls motion blur, ISO controls noise. Everything else is a variation of those three.',
        likes: 88,
      },
      {
        id: 'cc10-2',
        name: 'Calvin Parks',
        badges: ['Pro', 'Editor'],
        bio: 'Helping grow businesses without destroying the planet through the OPF ...',
        date: 'Mar 2, 2026',
        text: "Don't buy more gear. The camera you have is more capable than you are right now, and that's okay. Focus 100% on understanding light before thinking about lenses.",
        likes: 74,
      },
      {
        id: 'cc10-3',
        name: 'Abram Wilson',
        badges: [],
        bio: 'Community manager',
        date: 'Mar 3, 2026',
        text: "Use Aperture Priority mode (Av/A) while you're learning. It handles shutter speed automatically so you can focus on just one variable at a time.",
        likes: 21,
      },
      {
        id: 'cc10-4',
        name: 'Tod Gerhold',
        badges: [],
        bio: 'Frustrated beginner trying to learn',
        date: 'Today, 7:30AM',
        text: "I'm done with this platform. Every time I finally understand something, the next lesson assumes knowledge I don't have. There are huge gaps between chapters.",
        likes: 3,
      },
    ],
  },
};

// ── AI Inbox Threads ──

export const AI_THREADS: V1ThreadItem[] = [
  { id: 'ai-1',  name: 'Kathryn Murphy',  time: '9:45',      preview: "I'd be happy to help! Could you...",       aiStatus: 'active',  agentId: 'support' },
  { id: 'ai-2',  name: 'Kristin Watson',  time: '9:30',      preview: 'Can someone real help me with this?',     aiStatus: 'paused',  agentId: 'clarity' },
  { id: 'ai-3',  name: 'Calvin Parks',    time: '9:15',      preview: "Let's troubleshoot that connection...",    aiStatus: 'active',  agentId: 'clarity' },
  { id: 'ai-4',  name: 'Courtney Henry',  time: '8:50',      preview: 'Your course progress looks great!...',    aiStatus: 'active',  agentId: 'support' },
  { id: 'ai-5',  name: 'Ralph Edwards',   time: '8:30',      preview: "I'd rather talk to a human please",       aiStatus: 'paused',  agentId: 'support' },
  { id: 'ai-6',  name: 'Jane Cooper',     time: 'Yesterday',  preview: "Here's a guide on installing the...",    aiStatus: 'active',  agentId: 'clarity' },
  { id: 'ai-7',  name: 'Annette Black',   time: 'Yesterday',  preview: 'Your membership has been renewed...',    aiStatus: 'active',  agentId: 'support' },
  { id: 'ai-8',  name: 'Wade Warren',     time: 'Yesterday',  preview: "I've updated your notification...",      aiStatus: 'active',  agentId: 'clarity' },
  { id: 'ai-9',  name: 'Cody Fisher',     time: 'Mon',        preview: 'This is getting frustrating, I need...',  aiStatus: 'paused',  agentId: 'support' },
  { id: 'ai-10', name: 'Dianne Russell',  time: 'Mon',        preview: "Here's a summary of this week's...",     aiStatus: 'active',  agentId: 'clarity' },
];

// ── AI Conversations ──

export const AI_CONVERSATIONS: Record<string, V1AIConversation> = {
  'ai-1': {
    agentName: 'Support Agent',
    memberName: 'Kathryn Murphy',
    groups: [
      {
        label: 'Today',
        messages: [
          { id: 'a10', senderName: 'Kathryn Murphy', text: 'Hi! I have a question about upgrading my membership plan.', time: '9:40 AM' },
          { id: 'a11', senderName: 'Support Agent', text: "Hi Kathryn! I'd be happy to help with that. We have three plans available: Starter, Pro, and Business. Which one are you currently on?", time: '9:41 AM', isBot: true },
          { id: 'a12', senderName: 'Kathryn Murphy', text: "I'm on Starter right now. What does Pro include?", time: '9:43 AM' },
          { id: 'a13', senderName: 'Support Agent', text: "Pro includes unlimited course access, priority support, custom profile badges, and the ability to host live sessions. It's $29/month or $249/year. Would you like me to walk you through the upgrade process?", time: '9:45 AM', isBot: true },
        ],
      },
    ],
  },
  'ai-2': {
    agentName: 'Clarity Bot',
    memberName: 'Kristin Watson',
    groups: [
      {
        label: 'Today',
        messages: [
          { id: 'a20', senderName: 'Kristin Watson', text: "I can't find the download link for the course materials.", time: '9:10 AM' },
          { id: 'a21', senderName: 'Clarity Bot', text: "The course materials can be found under each lesson's Resources tab. Which course are you looking for specifically?", time: '9:12 AM', isBot: true },
          { id: 'a22', senderName: 'Kristin Watson', text: 'Intro to Photography. But the Resources tab is empty for me.', time: '9:20 AM' },
          { id: 'a23', senderName: 'Clarity Bot', text: "That might be a caching issue. Try clearing your browser cache or using an incognito window. If the problem persists, I can escalate this to the course instructor.", time: '9:22 AM', isBot: true },
          { id: 'a24', senderName: 'Kristin Watson', text: 'Can someone real help me with this? The incognito thing didn\u2019t work either.', time: '9:30 AM' },
        ],
      },
    ],
  },
  'ai-3': {
    agentName: 'Clarity Bot',
    memberName: 'Calvin Parks',
    groups: [
      {
        label: 'Yesterday',
        messages: [
          { id: 'a1', senderName: 'Calvin Parks', text: "Hello, I'm having trouble with my connection. It keeps dropping during live sessions.", time: '1:55 PM' },
          { id: 'a2', senderName: 'Clarity Bot', text: "I'm sorry to hear that. Let's troubleshoot. Have you tried restarting your modem and router? Also, are you on Wi-Fi or a wired connection?", time: '1:56 PM', isBot: true },
          { id: 'a3', senderName: 'Calvin Parks', text: 'Yes I restarted both. I\u2019m on Wi-Fi.', time: '1:58 PM' },
          { id: 'a4', senderName: 'Clarity Bot', text: "Wi-Fi can be unstable during video streams. If possible, try connecting via ethernet cable. You can also lower the stream quality in Settings > Video > Quality. Would you like step-by-step instructions?", time: '1:59 PM', isBot: true },
          { id: 'a5', senderName: 'Calvin Parks', text: "I'll try the ethernet cable. Thanks!", time: '2:05 PM' },
          { id: 'a6', senderName: 'Clarity Bot', text: "Great choice! Let me know if the issue persists after switching. I'm here to help anytime.", time: '2:06 PM', isBot: true },
        ],
      },
    ],
  },
  'ai-5': {
    agentName: 'Support Agent',
    memberName: 'Ralph Edwards',
    groups: [
      {
        label: 'Today',
        messages: [
          { id: 'a50', senderName: 'Ralph Edwards', text: 'I was charged twice for my subscription this month.', time: '8:10 AM' },
          { id: 'a51', senderName: 'Support Agent', text: "I understand your concern. Let me look into your billing history. Can you confirm the email address associated with your account?", time: '8:12 AM', isBot: true },
          { id: 'a52', senderName: 'Ralph Edwards', text: 'ralph.edwards@email.com', time: '8:15 AM' },
          { id: 'a53', senderName: 'Support Agent', text: "Thank you. I can see a duplicate charge on April 3rd. I've initiated a refund which should appear in 3\u20135 business days. Is there anything else I can help with?", time: '8:18 AM', isBot: true },
          { id: 'a54', senderName: 'Ralph Edwards', text: "I'd rather talk to a human please. I want to make sure this doesn\u2019t happen again.", time: '8:30 AM' },
        ],
      },
    ],
  },
  'ai-9': {
    agentName: 'Support Agent',
    memberName: 'Cody Fisher',
    groups: [
      {
        label: 'Monday',
        messages: [
          { id: 'a90', senderName: 'Cody Fisher', text: "I've been trying to upload my assignment for 3 days now and it keeps failing.", time: '10:00 AM' },
          { id: 'a91', senderName: 'Support Agent', text: "I'm sorry for the trouble. What file format and size are you trying to upload? Our system supports files up to 50MB in PDF, JPEG, and PNG formats.", time: '10:02 AM', isBot: true },
          { id: 'a92', senderName: 'Cody Fisher', text: "It's a 12MB PDF. Well within the limits.", time: '10:05 AM' },
          { id: 'a93', senderName: 'Support Agent', text: "That should work fine. Could you try uploading from a different browser? There's a known issue with Safari\u2019s file picker on macOS 15.", time: '10:08 AM', isBot: true },
          { id: 'a94', senderName: 'Cody Fisher', text: 'This is getting frustrating. I need to submit by tomorrow and nothing is working.', time: '10:15 AM' },
        ],
      },
    ],
  },
};

// ── Profile Data ──

export interface ProfileData {
  name: string;
  role: string;
  email: string;
  location: string;
  joinDate: string;
  bio: string;
  tags: { emoji: string; label: string }[];
  socialLinks: { platform: string; url: string }[];
}

export const PROFILE_DATA: Record<string, ProfileData> = {
  'Calvin Parks': {
    name: 'Calvin Parks',
    role: 'Marketing Manager',
    email: 'calvin.parks@example.com',
    location: 'California, CA',
    joinDate: 'Member since July 2020',
    bio: 'Passionate about growth marketing and community building. Love connecting with fellow creators and sharing insights on digital strategy.',
    tags: [
      { emoji: '\u270d\ufe0f', label: 'Editor' },
      { emoji: '\ud83c\udff5\ufe0f', label: 'Pro' },
      { emoji: '\ud83d\udc7b', label: 'Creator' },
    ],
    socialLinks: [
      { platform: 'Web', url: 'calvinparks.com' },
      { platform: 'Facebook', url: 'facebook.com/calvinparks' },
      { platform: 'Instagram', url: '@calvinparks' },
    ],
  },
  'Kathryn Murphy': {
    name: 'Kathryn Murphy',
    role: 'Product Designer',
    email: 'kathryn.murphy@example.com',
    location: 'New York, NY',
    joinDate: 'Member since March 2021',
    bio: 'Design systems enthusiast. Building beautiful products one pixel at a time.',
    tags: [
      { emoji: '\ud83c\udff5\ufe0f', label: 'Pro' },
    ],
    socialLinks: [
      { platform: 'Web', url: 'kathrynmurphy.design' },
      { platform: 'Tumblr', url: 'kathrynm.tumblr.com' },
    ],
  },
  'Eliza Stone': {
    name: 'Eliza Stone',
    role: 'Community Member',
    email: 'eliza.stone@example.com',
    location: 'Austin, TX',
    joinDate: 'Member since January 2023',
    bio: 'Photography enthusiast and avid traveler. Always looking for the next great shot.',
    tags: [
      { emoji: '\ud83c\udff5\ufe0f', label: 'Pro' },
    ],
    socialLinks: [
      { platform: 'Instagram', url: '@elizastone_photo' },
    ],
  },
  'Jordan Rivers': {
    name: 'Jordan Rivers',
    role: 'Student',
    email: 'jordan.rivers@example.com',
    location: 'Portland, OR',
    joinDate: 'Member since September 2024',
    bio: 'Learning photography from scratch. Excited to be part of this community!',
    tags: [
      { emoji: '\u270d\ufe0f', label: 'Editor' },
    ],
    socialLinks: [],
  },
};

export function getProfileData(name: string): ProfileData {
  return PROFILE_DATA[name] ?? {
    name,
    role: 'Community Member',
    email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    location: 'United States',
    joinDate: 'Member since 2024',
    bio: 'Active community member.',
    tags: [],
    socialLinks: [],
  };
}

// ── Helper: get threads for a category ──

export function getThreadsForCategory(category: V1Category): V1ThreadItem[] {
  switch (category) {
    case 'dms': return DM_THREADS;
    case 'moderation': return MODERATION_THREADS;
    case 'course-comments': return COURSE_THREADS;
    case 'ai-inbox': return AI_THREADS;
  }
}

export function getFirstThreadId(category: V1Category): string {
  const threads = getThreadsForCategory(category);
  return threads[0]?.id ?? '';
}

/** Thread replies for course comments, keyed by comment id */
export const COURSE_THREAD_REPLIES: Record<string, V1Message[]> = {
  'c1': [
    { id: 'ct1', senderName: 'Albert Flores', text: 'Totally agree \u2014 one concept at a time is the way to go.', time: '2:10 PM' },
    { id: 'ct2', senderName: 'Kathryn Murphy', text: 'This advice got me through lesson 2!', time: '3:45 PM' },
    { id: 'ct3', senderName: 'Jordan Rivers', text: 'Wish I read this before rushing through everything.', time: '5:00 PM' },
  ],
  'c2': [
    { id: 'ct5', senderName: 'Calvin Parks', text: 'Exactly this. Practice > theory when starting out.', time: '3:00 PM' },
    { id: 'ct6', senderName: 'Eliza Stone', text: 'How long did it take you before things started clicking?', time: '4:15 PM' },
  ],
  'c3': [
    { id: 'ct4', senderName: 'Calvin Parks', text: 'Lesson 3 is where it all started making sense for me too.', time: '4:20 PM' },
  ],
  'c3b': [
    { id: 'ct7', senderName: 'Abram Wilson', text: 'Great tip! Pausing and practicing is so underrated.', time: '5:30 PM' },
    { id: 'ct8', senderName: 'Albert Flores', text: 'I do the same thing. Re-watching after shooting makes a huge difference.', time: '6:00 PM' },
    { id: 'ct9', senderName: 'Jordan Rivers', text: 'Going to try this approach starting today.', time: '7:10 PM' },
  ],
  'cc3-2': [
    { id: 'ct10', senderName: 'Hailey Mills', text: 'AF-C was a game changer for me at sports events!', time: '11:00 AM' },
    { id: 'ct11', senderName: 'Calvin Parks', text: 'Also try back-button focus \u2014 separates focus from shutter and gives way more control.', time: '11:30 AM' },
  ],
  'c13': [
    { id: 'ct12', senderName: 'Calvin Parks', text: 'The rule of thirds is basically: divide your frame into a 3\u00d73 grid and place key elements along the lines or intersections.', time: '10:00 AM' },
    { id: 'ct13', senderName: 'Abram Wilson', text: 'Think of it like placing the subject off-center for a more dynamic shot. The video goes fast but once you try it with your camera it clicks instantly.', time: '10:15 AM' },
  ],
};
