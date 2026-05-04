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
  lessonCoverUrl?: string;
  isUnanswered?: boolean;
  // AI Inbox
  aiStatus?: 'active' | 'paused' | 'resolved';
  agentId?: 'support' | 'clarity';
  priority?: 'attention' | 'routine';
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
  courseTitle: string;
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
  { id: 'dm-1', name: 'Emily Park', time: '9:45', preview: 'Hey Sarah! Just hit Lesson 5 \u2014 want to grab a virtual coffee to talk portrait lighting sometime?', unread: false, priority: 'routine' },
  { id: 'dm-2', name: 'Maya Rodriguez', time: '9:45', preview: "Please let me know if there's anything else you need for the critique circle session tomorrow \u2014 I'm bringing 3 pieces.", unread: false, priority: 'attention' },
  { id: 'dm-3', name: 'Alex Chen', time: '9:45', preview: "Hey Sarah, I'd like to request a refund on Advanced Lighting. Marcus has been inactive 3 weeks and I've barely gotten value out of it.", unread: true, priority: 'attention' },
  { id: 'dm-agent-1', name: 'Onboarding Assistant', time: '9:30', preview: 'Welcome to Photography Masterclass! Here are 3 things I recommend for your first week\u2026', unread: true, isAgent: true, priority: 'attention' },
  { id: 'dm-4', name: 'Amy Torres', time: '9:45', preview: "HAHAHA his face in the BTS clip from yesterday's live \u2014 priceless.", unread: false, priority: 'routine' },
  { id: 'dm-5', name: 'Chen Wei', time: '9:45', preview: 'Sarah, quick question on billing \u2014 when does my Pro renew? And is there an annual option?', unread: false, priority: 'attention' },
  { id: 'dm-agent-2', name: 'Support Bot', time: '8:12', preview: 'Your ticket #4821 has been resolved. Billing cycle updated as requested.', unread: false, isAgent: true, priority: 'routine' },
  { id: 'dm-6', name: 'Nina Patel', time: '9:45', preview: "I submitted the bug report on the mobile critique viewer \u2014 video doesn't autoplay on iOS 18.", unread: false, priority: 'attention' },
  { id: 'dm-7', name: 'James Liu', time: '9:45', preview: 'Hey Sarah, quick one: is there a Cohort 5 orientation session happening?', unread: false, priority: 'routine' },
  { id: 'dm-8', name: 'David Kim', time: '9:45', preview: 'Still working on the Lesson 9 street photography assignment \u2014 planning to post to critique circle Sunday.', unread: false, priority: 'routine' },
  { id: 'dm-agent-3', name: 'Content Coach', time: 'Yesterday', preview: 'Your post draft looks great! A few suggestions on the opening hook \u2014 want me to share?', unread: false, isAgent: true, priority: 'routine' },
  { id: 'dm-9', name: 'Priya Sharma', time: '9:45', preview: "Let me go grab some test shots \u2014 I'll send landscape attempts for the Lesson 7 exercise in an hour.", unread: false, priority: 'attention' },
  { id: 'dm-10', name: 'Tom Brown', time: '9:45', preview: "Haven't installed the Lightroom presets you sent yet \u2014 will try this weekend and report back.", unread: false, priority: 'routine' },
  { id: 'dm-11', name: 'Kenji Tanaka', time: '9:45', preview: 'Sarah, the star trail tutorial from last week was incredible. Any chance of a follow-up on Milky Way composition?', unread: false, priority: 'routine' },
  { id: 'dm-12', name: 'Lisa Wong', time: '9:45', preview: 'Wanted to check \u2014 can I switch my monthly Pro plan to annual? Trying to save a bit.', unread: false, priority: 'attention' },
  { id: 'dm-13', name: 'Omar Hassan', time: '9:45', preview: 'Payment failed on my renewal \u2014 card on file expired. Still want to stay, just need to update it.', unread: false, priority: 'routine' },
];

// ── DM Conversations ──

export const DM_CONVERSATIONS: Record<string, V1MessageGroup[]> = {
  'dm-3': [
    {
      label: 'Yesterday',
      messages: [
        { id: 'm1', senderName: 'Alex Chen', text: "Hey Sarah \u2014 wanted to flag something. I signed up for Advanced Lighting back in February and Marcus has only posted 2 of the 8 lessons.", time: '2:30 PM' },
        { id: 'm2', senderName: 'Alex Chen', text: "I understand life happens, but three weeks of silence feels rough for a $49 course.", time: '2:31 PM' },
        { id: 'm3', senderName: 'You', text: "Hey Alex, I hear you \u2014 that's not OK. Let me talk to Marcus today and get back to you by tomorrow with a real answer.", time: '3:15 PM' },
        { id: 'm4', senderName: 'Alex Chen', text: 'Appreciate it Sarah. I know you all care about quality \u2014 just wanted to make sure this was on your radar.', time: '3:20 PM' },
        { id: 'm5', senderName: 'You', text: "It absolutely is. Give me until tomorrow and I'll have a plan for you.", time: '3:25 PM' },
        { id: 'm6', senderName: 'Alex Chen', text: "Sounds good. Thanks for being responsive \u2014 one of the reasons I stuck around as a founding member.", time: '3:30 PM', replies: [
          { id: 'r1', senderName: 'You', text: "That means a lot, Alex. We'll make this right.", time: '3:35 PM' },
          { id: 'r2', senderName: 'Alex Chen', text: 'Looking forward to hearing back.', time: '3:40 PM' },
        ] },
      ],
    },
    {
      label: 'Today',
      messages: [
        { id: 'm7', senderName: 'Alex Chen', text: "Hi Sarah, any update? I've been patient but I'd like to request a refund on Advanced Lighting at this point.", time: '9:15 AM' },
        { id: 'm8', senderName: 'Alex Chen', text: "Marcus has been inactive 3 weeks and I've barely gotten value out of it. I'm a founding member and I hate to ask, but this one missed the mark.", time: '9:16 AM' },
        { id: 'm9', senderName: 'Alex Chen', text: "I'm not upset with the community \u2014 Photography Masterclass itself is amazing. But this add-on course hasn't delivered.", time: '9:30 AM' },
        { id: 'm10', senderName: 'Alex Chen', text: "If a refund isn't possible, I'd at least like to know when the remaining lessons are coming. Either way, I need a clear answer today.", time: '9:45 AM', replies: [
          { id: 'r3', senderName: 'You', text: "Alex, I spoke with Marcus. He's back and the next three lessons drop Thursday. Let me look into the refund option for you right now.", time: '9:50 AM' },
          { id: 'r4', senderName: 'Alex Chen', text: "OK, that's actually good to hear about the lessons. What are my options?", time: '10:02 AM' },
          { id: 'r5', senderName: 'You', text: 'I can do a full $49 refund or a 2-month membership extension. Let me know what works best.', time: '10:15 AM' },
        ] },
      ],
    },
  ],
  'dm-1': [
    {
      label: 'Today',
      messages: [
        { id: 'm10', senderName: 'Emily Park', text: 'Hey Sarah! Just hit Lesson 5 \u2014 want to grab a virtual coffee to talk portrait lighting sometime?', time: '9:45 AM' },
        { id: 'm11', senderName: 'You', text: "Love it Emily \u2014 let's do it! How's Friday afternoon your time?", time: '9:46 AM' },
      ],
    },
  ],
};

// ── Moderation Threads ──
// Authors with multiple items: Derek Hoffman (mod-1, mod-3, mod-8, mod-12), Maria Santos (mod-2, mod-4, mod-9, mod-11),
// Jake Miller (mod-5, mod-6), Bots (mod-7, mod-10, mod-13)
// Pre-reviewed: mod-6, mod-7, mod-8, mod-11, mod-13 (see INITIAL_REVIEWED_IDS)

export const MODERATION_THREADS: V1ThreadItem[] = [
  { id: 'mod-1',  name: 'Derek Hoffman',       time: '9:45',      preview: 'My meetup group is running a $29 Lightroom preset pack drop \u2014 Circle members get 40% off\u2026',   badgeLabel: 'Post', priority: 'attention' },
  { id: 'mod-2',  name: 'Maria Santos',        time: '9:45',      preview: 'Pro DSLRs starting at $299 \u2014 photogeardeals.store, use CIRCLE20 for 20% off.',   badgeLabel: 'Post', priority: 'attention' },
  { id: 'mod-3',  name: 'Derek Hoffman',       time: '9:45',      preview: "That's a pretty ignorant take. Maybe try actually learning the fundamentals\u2026",             badgeLabel: 'Comment', priority: 'attention' },
  { id: 'mod-4',  name: 'Maria Santos',        time: '9:30',      preview: 'Best deals on tripods this weekend \u2014 photogeardeals.store. Flash sale ends Sunday.',            badgeLabel: 'Post', priority: 'attention' },
  { id: 'mod-5',  name: 'Jake Miller',         time: '9:45',      preview: 'holy shit this is perfect. How did you get that rim light on the edge of the face?',                  badgeLabel: 'Comment', priority: 'attention' },
  { id: 'mod-6',  name: 'Jake Miller',         time: '8:12',      preview: 'damn these tones are insane. Absolutely gorgeous work.',             badgeLabel: 'Comment', priority: 'attention' },
  { id: 'mod-7',  name: 'seo_expert_2026',     time: 'Yesterday',  preview: 'Top 10 SEO strategies for photographers in 2026 \u2014 free tools at seomaster.biz.',    badgeLabel: 'Post', priority: 'routine' },
  { id: 'mod-8',  name: 'Derek Hoffman',       time: 'Yesterday',  preview: 'Quick tip from last night\u2019s meetup \u2014 always carry a gray card for mixed lighting.',         badgeLabel: 'Post', priority: 'routine' },
  { id: 'mod-9',  name: 'Maria Santos',        time: '9:45',      preview: 'Flash sale on editing software \u2014 CIRCLE20 at photogeardeals.store for 50% off.',             badgeLabel: 'Post', priority: 'attention' },
  { id: 'mod-10', name: 'digital_growth_pro',  time: '9:45',      preview: 'Connection request to Rudy Santino',     badgeLabel: 'Connection', priority: 'routine' },
  { id: 'mod-11', name: 'Maria Santos',        time: 'Mon',        preview: 'Upgrade your kit \u2014 exclusive discounts at photogeardeals.store, reply for link.',     badgeLabel: 'Post', priority: 'routine' },
  { id: 'mod-12', name: 'Derek Hoffman',       time: '9:45',      preview: 'New urban grit preset pack out today \u2014 derekphoto.com/presets, $29 launch price.', badgeLabel: 'Post', priority: 'routine' },
  { id: 'mod-13', name: 'photo_tools_2026',    time: 'Mon',        preview: 'Free AI photo enhancer \u2014 try it free at photoai.tools, link in bio.',                 badgeLabel: 'Post', priority: 'routine' },
];

// ── Moderation Cards ──

export const MODERATION_CARDS: Record<string, V1ModerationCard> = {
  'mod-1': {
    authorName: 'Derek Hoffman',
    postSpace: 'Gear Talk',
    reportCount: 2,
    alertTitle: 'Derek Hoffman has 3 other reports',
    alertDescription: '3 posts \u00b7 1 comment \u00b7 0 connection requests \u00b7 0 chat messages',
    reportStats: { posts: 3, comments: 1, connectionRequests: 0, chatMessages: 0 },
    postTitle: 'Urban Grit preset pack \u2014 40% off for Circle members',
    postBody: "Hey photographers \u2014 my local meetup group just launched a new Lightroom preset pack called 'Urban Grit.' $29 normally, but Circle members get 40% off with code CIRCLE40. DM me if you want a sample before buying. Always happy to support this community.",
    reports: [
      { reporterName: 'Kenji Tanaka', reason: 'Self-promotion', date: 'Today, 9:14 AM', comment: 'Self-promotion with external payment link.', status: 'pending' },
      { reporterName: 'Amy Torres', reason: 'Self-promotion', date: 'Today, 8:52 AM', comment: 'This is the third promo post from Derek this week.', status: 'pending' },
      { reporterName: 'Derek Hoffman', reason: 'Tone', date: 'Today, 9:45 AM', comment: 'Dismissive comment in #questions.', status: 'pending', linkedThreadId: 'mod-3' },
    ],
  },
  'mod-2': {
    authorName: 'Maria Santos',
    postSpace: 'Photography Basics',
    reportCount: 2,
    alertTitle: 'Maria Santos has 3 other reports',
    alertDescription: '4 posts \u00b7 0 comments \u00b7 0 connection requests \u00b7 0 chat messages',
    reportStats: { posts: 4, comments: 0, connectionRequests: 0, chatMessages: 0 },
    postTitle: 'Amazing deals on camera gear',
    postBody: 'Check out these amazing deals on camera gear at photogeardeals.store! Professional DSLRs starting at $299. Use code CIRCLE20 for 20% off. Limited time offer!',
    reports: [
      { reporterName: 'Spam Filter', reason: 'Spam', date: 'Today, 9:45 AM', comment: 'Auto-flagged: external link matching known spam patterns.', status: 'pending' },
      { reporterName: 'Kenji Tanaka', reason: 'Spam', date: 'Today, 9:30 AM', comment: 'Promotional link drop from brand-new account.', status: 'pending' },
    ],
  },
  'mod-3': {
    authorName: 'Derek Hoffman',
    postSpace: 'Questions',
    reportCount: 1,
    alertTitle: 'Derek Hoffman has 3 other reports',
    alertDescription: '3 posts \u00b7 1 comment \u00b7 0 connection requests \u00b7 0 chat messages',
    reportStats: { posts: 3, comments: 1, connectionRequests: 0, chatMessages: 0 },
    postTitle: 'Reply to beginner question',
    postBody: "That's a really ignorant take. Maybe try actually learning the fundamentals before giving advice that could mess up someone's settings.",
    reports: [
      { reporterName: 'Emily Park', reason: 'Harassment', date: 'Today, 9:45 AM', comment: 'Hostile and dismissive response to a beginner question.', status: 'pending' },
      { reporterName: 'Derek Hoffman', reason: 'Self-promotion', date: 'Today, 9:14 AM', comment: 'Self-promo preset pack in Gear Talk.', status: 'pending', linkedThreadId: 'mod-1' },
    ],
  },
  'mod-4': {
    authorName: 'Maria Santos',
    postSpace: 'Announcements',
    reportCount: 1,
    alertTitle: 'Maria Santos has 3 other reports',
    alertDescription: '4 posts \u00b7 0 comments \u00b7 0 connection requests \u00b7 0 chat messages',
    reportStats: { posts: 4, comments: 0, connectionRequests: 0, chatMessages: 0 },
    postTitle: 'Best deals on tripods',
    postBody: 'Best deals on tripods and stabilizers at photogeardeals.store! Flash sale this weekend only. Professional grade at hobbyist prices.',
    reports: [
      { reporterName: 'Spam Filter', reason: 'Spam', date: '9:30 AM', comment: 'Auto-flagged: second post linking to same external domain.', status: 'pending' },
      { reporterName: 'Maria Santos', reason: 'Spam', date: 'Today, 9:45 AM', comment: 'Spam post in Photography Basics.', status: 'pending', linkedThreadId: 'mod-2' },
    ],
  },
  'mod-5': {
    authorName: 'Jake Miller',
    postSpace: 'Golden Hour Collection',
    reportCount: 1,
    alertTitle: 'Jake Miller has 1 other report',
    alertDescription: '0 posts \u00b7 2 comments \u00b7 0 connection requests \u00b7 0 chat messages',
    reportStats: { posts: 0, comments: 2, connectionRequests: 0, chatMessages: 0 },
    postTitle: 'Comment on rim light portrait',
    postBody: 'holy shit this is perfect. How did you get that rim light on the edge of the face? The separation from the background is insane.',
    reports: [
      { reporterName: 'Profanity Filter', reason: 'Profanity', date: '9:45 AM', comment: 'Auto-flagged: contains profanity.', status: 'pending' },
      { reporterName: 'Jake Miller', reason: 'Profanity', date: '8:12 AM', comment: 'Auto-flagged comment on studio setup.', status: 'approved', linkedThreadId: 'mod-6' },
    ],
  },
  'mod-6': {
    authorName: 'Jake Miller',
    postSpace: 'Studio Setup Tutorial',
    reportCount: 1,
    alertTitle: 'Jake Miller has 1 other report',
    alertDescription: '0 posts \u00b7 2 comments \u00b7 0 connection requests \u00b7 0 chat messages',
    reportStats: { posts: 0, comments: 2, connectionRequests: 0, chatMessages: 0 },
    postTitle: 'Comment on studio tones',
    postBody: 'damn these tones are insane. Absolutely gorgeous work. What LUT are you using? The skin rendering is chef\u2019s kiss.',
    reports: [
      { reporterName: 'Profanity Filter', reason: 'Profanity', date: '8:12 AM', comment: 'Auto-flagged: contains word "damn".', status: 'approved' },
    ],
  },
  'mod-7': {
    authorName: 'seo_expert_2026',
    postSpace: 'Photography Basics',
    reportCount: 1,
    alertTitle: 'seo_expert_2026 has 0 other reports',
    alertDescription: '1 post \u00b7 0 comments \u00b7 0 connection requests \u00b7 0 chat messages',
    reportStats: { posts: 1, comments: 0, connectionRequests: 0, chatMessages: 0 },
    postTitle: 'SEO strategies for photographers',
    postBody: 'Top 10 SEO strategies for photographers in 2026! Boost your online presence with these proven techniques. Visit seomaster.biz for free tools.',
    reports: [
      { reporterName: 'Spam Filter', reason: 'Spam', date: 'Yesterday', comment: 'Bot profile: created 2 days ago, generic name, auto-generated bio, links to external SEO service.', status: 'removed' },
    ],
  },
  'mod-8': {
    authorName: 'Derek Hoffman',
    postSpace: 'Announcements',
    reportCount: 1,
    alertTitle: 'Derek Hoffman has 3 other reports',
    alertDescription: '3 posts \u00b7 1 comment \u00b7 0 connection requests \u00b7 0 chat messages',
    reportStats: { posts: 3, comments: 1, connectionRequests: 0, chatMessages: 0 },
    postTitle: 'Quick tip from meetup',
    postBody: "Quick tip from last night's meetup \u2014 always carry a gray card for mixed lighting. Saved me three times at indoor events this month alone.",
    reports: [
      { reporterName: 'Priya Sharma', reason: 'Off-topic', date: 'Yesterday', comment: 'Meetup self-promotion disguised as a tip.', status: 'approved' },
      { reporterName: 'Derek Hoffman', reason: 'Self-promotion', date: 'Today, 9:14 AM', comment: 'Preset pack promo in Gear Talk.', status: 'pending', linkedThreadId: 'mod-1' },
    ],
  },
  'mod-9': {
    authorName: 'Maria Santos',
    postSpace: 'Gear Talk',
    reportCount: 2,
    alertTitle: 'Maria Santos has 3 other reports',
    alertDescription: '4 posts \u00b7 0 comments \u00b7 0 connection requests \u00b7 0 chat messages',
    reportStats: { posts: 4, comments: 0, connectionRequests: 0, chatMessages: 0 },
    postTitle: 'Flash sale on editing software',
    postBody: 'Flash sale on editing software \u2014 use code CIRCLE20 at photogeardeals.store for 50% off! Professional tools at amateur prices. DM for referral link.',
    reports: [
      { reporterName: 'Spam Filter', reason: 'Spam', date: '9:45 AM', comment: 'Auto-flagged: third post linking to same external domain.', status: 'pending' },
      { reporterName: 'David Kim', reason: 'Spam', date: '9:30 AM', comment: 'Same store link again. Clearly a spam account.', status: 'pending' },
    ],
  },
  'mod-10': {
    authorName: 'digital_growth_pro',
    postSpace: 'Connections',
    reportCount: 1,
    alertTitle: 'digital_growth_pro has 0 other reports',
    alertDescription: '0 posts \u00b7 0 comments \u00b7 1 connection request \u00b7 0 chat messages',
    reportStats: { posts: 0, comments: 0, connectionRequests: 1, chatMessages: 0 },
    postTitle: 'Connection request to Rudy Santino',
    postBody: 'Connection request from account with no posts, no bio, and a stock photo avatar. Targeting community owner.',
    reports: [
      { reporterName: 'Spam Filter', reason: 'Spam', date: '9:45 AM', comment: 'Bot account sending connection requests to top contributors. Known spam tactic.', status: 'pending' },
    ],
  },
  'mod-11': {
    authorName: 'Maria Santos',
    postSpace: 'Landscape Tips',
    reportCount: 2,
    alertTitle: 'Maria Santos has 3 other reports',
    alertDescription: '4 posts \u00b7 0 comments \u00b7 0 connection requests \u00b7 0 chat messages',
    reportStats: { posts: 4, comments: 0, connectionRequests: 0, chatMessages: 0 },
    postTitle: 'Upgrade your kit',
    postBody: 'Upgrade your street photography kit \u2014 exclusive discounts at photogeardeals.store. These are exact items used by pros. Reply for my referral link!',
    reports: [
      { reporterName: 'Spam Filter', reason: 'Spam', date: 'Mon', comment: 'Auto-flagged: fourth post from same domain in 48 hours.', status: 'removed' },
      { reporterName: 'James Liu', reason: 'Spam', date: 'Mon', comment: 'Identical promotional pattern across multiple spaces.', status: 'removed' },
    ],
  },
  'mod-12': {
    authorName: 'Derek Hoffman',
    postSpace: 'Gear Marketplace',
    reportCount: 1,
    alertTitle: 'Derek Hoffman has 3 other reports',
    alertDescription: '3 posts \u00b7 1 comment \u00b7 0 connection requests \u00b7 0 chat messages',
    reportStats: { posts: 3, comments: 1, connectionRequests: 0, chatMessages: 0 },
    postTitle: 'Urban Grit preset launch',
    postBody: "New Lightroom preset pack \u2014 'Urban Grit' $29. Made specifically for street photography. Circle members get 40% off with code CIRCLE40.",
    reports: [
      { reporterName: 'Amy Torres', reason: 'Self-promotion', date: '9:45 AM', comment: 'Another paid product promotion from the same member.', status: 'pending' },
      { reporterName: 'Derek Hoffman', reason: 'Self-promotion', date: 'Today, 9:14 AM', comment: 'Same preset pack promo in Gear Talk.', status: 'pending', linkedThreadId: 'mod-1' },
    ],
  },
  'mod-13': {
    authorName: 'photo_tools_2026',
    postSpace: 'Photography Basics',
    reportCount: 1,
    alertTitle: 'photo_tools_2026 has 0 other reports',
    alertDescription: '1 post \u00b7 0 comments \u00b7 0 connection requests \u00b7 0 chat messages',
    reportStats: { posts: 1, comments: 0, connectionRequests: 0, chatMessages: 0 },
    postTitle: 'Free AI photo enhancer',
    postBody: 'Free AI photo enhancer \u2014 try it at photoai.tools! Professional results in one click. Link in bio for early access.',
    reports: [
      { reporterName: 'Spam Filter', reason: 'Spam', date: 'Mon', comment: 'Bot profile: created 1 day ago, no avatar, promotional bio, single post with external link.', status: 'removed' },
    ],
  },
};

// ── Course Comments Threads ──

export const COURSE_THREADS: V1ThreadItem[] = [
  { id: 'cc-1', name: 'James Liu', time: '9:45', preview: "Struggling to freeze motion indoor \u2014 shutter 1/500, ISO blown out. What am I missing?", lessonName: 'Lesson 4: Action shots', lessonCoverUrl: 'https://picsum.photos/seed/action-shots/104/64', isUnanswered: true, priority: 'attention' },
  { id: 'cc-2', name: 'Priya Sharma', time: '9:45', preview: "For the foreground interest exercise \u2014 does it count if the foreground is isolated with a wide aperture, or should it be in focus too?", lessonName: 'Lesson 7: Landscape basics', lessonCoverUrl: 'https://picsum.photos/seed/landscape/104/64', isUnanswered: true, priority: 'attention' },
  { id: 'cc-3', name: 'Maya Rodriguez', time: '9:45', preview: "Would love to see how Rudy handles mixed color temperature with tungsten + daylight \u2014 the demo was brief.", lessonName: 'Lesson 5: Portrait photography', lessonCoverUrl: 'https://picsum.photos/seed/portrait/104/64', priority: 'attention' },
  { id: 'cc-4', name: 'Kenji Tanaka', time: '9:45', preview: "The color-channel mixing section went fast. Is there a cheat sheet for which filter emulation to use for sky vs skin?", lessonName: 'Lesson 8: Black and white', lessonCoverUrl: 'https://picsum.photos/seed/blackwhite/104/64', isUnanswered: true, priority: 'attention' },
  { id: 'cc-5', name: 'Amy Torres', time: '9:45', preview: "Using a Sony A7IV \u2014 the live view goes almost black at the apertures Rudy recommends. Is there a setting I'm missing?", lessonName: 'Lesson 6: Night photography', lessonCoverUrl: 'https://picsum.photos/seed/nightphoto/104/64', isUnanswered: true, priority: 'attention' },
  { id: 'cc-6', name: 'Emily Park', time: '9:45', preview: "Just wanted to say the golden hour window explanation finally clicked for me \u2014 thanks.", lessonName: 'Lesson 2: Natural lighting', lessonCoverUrl: 'https://picsum.photos/seed/lighting/104/64', priority: 'routine' },
  { id: 'cc-7', name: 'David Kim', time: '9:45', preview: "Love the 'pre-focus and wait' technique. Tried it at Union Square yesterday, 3 keepers out of 40 \u2014 best ratio I've ever had.", lessonName: 'Lesson 9: Street photography', lessonCoverUrl: 'https://picsum.photos/seed/street/104/64', priority: 'routine' },
  { id: 'cc-8', name: 'Nina Patel', time: '9:45', preview: "Would a homemade light tent work for the product shot exercise, or does reflection quality depend on pro equipment?", lessonName: 'Lesson 10: Still life', lessonCoverUrl: 'https://picsum.photos/seed/stilllife/104/64', isUnanswered: true, priority: 'attention' },
  { id: 'cc-9', name: 'Tom Brown', time: '9:45', preview: "Coming from iPhone-only \u2014 any reason to not jump straight into manual mode, or should I start with aperture priority?", lessonName: 'Lesson 1: Camera basics', lessonCoverUrl: 'https://picsum.photos/seed/camera-basics/104/64', isUnanswered: true, priority: 'routine' },
  { id: 'cc-10', name: 'Chen Wei', time: '9:45', preview: "Finished! The exposure triangle analogy made it click \u2014 thanks Rudy.", lessonName: 'Lesson 1: Camera basics', lessonCoverUrl: 'https://picsum.photos/seed/camera-basics/104/64', priority: 'routine' },
];

// ── Course Comment Threads ──

export const COURSE_COMMENT_DATA: Record<string, V1CourseCommentThread> = {
  'cc-2': {
    headerLabel: 'Comment',
    courseTitle: 'Photography Masterclass',
    courseName: 'Lesson 7: Landscape basics',
    comments: [
      {
        id: 'c1',
        name: 'Rudy Santino',
        badges: ['Instructor'],
        bio: 'Professional photographer and educator \u2014 Photography Masterclass creator',
        date: 'Jan 29, 2026',
        text: "For the foreground interest exercise, you want something that anchors the viewer's eye before they move into the scene. A rock, a branch, a patch of wildflowers \u2014 anything that gives depth and scale.",
        likes: 56,
      },
      {
        id: 'c2',
        name: 'Maya Rodriguez',
        badges: ['Pro'],
        bio: 'Cohort 3 \u00b7 Landscape photographer \u00b7 Denver, CO',
        date: 'Jan 31, 2026',
        text: "I found that shooting at f/11 with a wide-angle lens keeps both foreground and background sharp without needing focus stacking. Rudy\u2019s tip about hyperfocal distance in Lesson 7.2 was the unlock for me.",
        likes: 10,
      },
      {
        id: 'c3',
        name: 'David Kim',
        badges: [],
        bio: 'Community booster \u00b7 1 year member',
        date: 'Jan 31, 2026',
        text: "Don't overthink it at first \u2014 just get low and put something interesting in the bottom third. The technique refines itself after you shoot enough foregrounds.",
        likes: 4,
      },
      {
        id: 'c3b',
        name: 'Amy Torres',
        badges: ['Pro'],
        bio: 'Portrait specialist \u00b7 Cohort 2',
        date: 'Feb 2, 2026',
        text: "I actually like using wide aperture separation for foreground \u2014 it creates a dreamy look with blurred grass or flowers framing the subject. Different vibe but still reads as 'foreground interest.'",
        likes: 22,
      },
      {
        id: 'c4',
        name: 'Priya Sharma',
        badges: ['Pro'],
        bio: 'Cohort 3 \u00b7 Landscape photographer',
        date: 'Today, 2:20PM',
        text: "For the foreground interest exercise \u2014 does it count if the foreground is isolated with a wide aperture, or should it be in focus too? I want to make sure I'm doing this right.",
        likes: 5,
      },
    ],
  },
  'cc-1': {
    headerLabel: 'Comment',
    courseTitle: 'Photography Masterclass',
    courseName: 'Lesson 4: Action shots',
    comments: [
      {
        id: 'c10',
        name: 'Rudy Santino',
        badges: ['Instructor'],
        bio: 'Professional photographer and educator \u2014 Photography Masterclass creator',
        date: 'Jan 28, 2026',
        text: "Indoor action is the hardest genre for beginners because you're fighting two things: limited light and fast movement. The trick is to stop chasing shutter speed and start chasing light.",
        likes: 34,
      },
      {
        id: 'c11',
        name: 'Maya Rodriguez',
        badges: ['Pro'],
        bio: 'Cohort 3 \u00b7 Landscape photographer \u00b7 Denver, CO',
        date: 'Jan 29, 2026',
        text: "I shoot kids indoor sports at 1/250 and get a better keeper ratio than 1/500 because I'm not chasing every moment. Pre-focus where the action will be.",
        likes: 18,
      },
      {
        id: 'c12',
        name: 'David Kim',
        badges: [],
        bio: 'Community booster \u00b7 1 year member',
        date: 'Jan 30, 2026',
        text: "Opening up to f/2.8 or wider buys you a full stop of ISO room. That's often the difference between a usable shot and a noisy mess.",
        likes: 11,
      },
      {
        id: 'c13',
        name: 'James Liu',
        badges: [],
        bio: 'Cohort 5 \u00b7 Action photography enthusiast',
        date: 'Today, 9:45AM',
        text: "Struggling to freeze motion indoor \u2014 shutter 1/500, ISO blown out. What am I missing? I've tried burst mode but everything is either noisy or blurry.",
        likes: 3,
      },
    ],
  },
  'cc-3': {
    headerLabel: 'Comment',
    courseTitle: 'Photography Masterclass',
    courseName: 'Lesson 5: Portrait photography',
    comments: [
      {
        id: 'cc3-1',
        name: 'Rudy Santino',
        badges: ['Instructor'],
        bio: 'Professional photographer and educator \u2014 Photography Masterclass creator',
        date: 'Feb 3, 2026',
        text: "Mixed color temperature is one of the trickiest challenges in portrait work. The key is deciding which light source is your 'key' and gelling the others to match \u2014 or embracing the color contrast intentionally.",
        likes: 41,
      },
      {
        id: 'cc3-2',
        name: 'Amy Torres',
        badges: ['Pro'],
        bio: 'Portrait specialist \u00b7 Cohort 2',
        date: 'Feb 4, 2026',
        text: "I've found that shooting with a custom white balance on-site (gray card) and then fine-tuning in post gives the most natural skin tones. Auto WB struggles with tungsten + daylight every time.",
        likes: 29,
      },
      {
        id: 'cc3-3',
        name: 'Emily Park',
        badges: [],
        bio: 'Cohort 5 \u00b7 Beginner',
        date: 'Feb 5, 2026',
        text: "This is really helpful context. I've been relying on auto WB and wondering why my indoor portraits always look orange. Going to try the gray card approach this weekend.",
        likes: 7,
      },
      {
        id: 'cc3-4',
        name: 'Maya Rodriguez',
        badges: ['Pro'],
        bio: 'Cohort 3 \u00b7 Landscape photographer \u00b7 Denver, CO',
        date: 'Today, 11:15AM',
        text: "Would love to see how Rudy handles mixed color temperature with tungsten + daylight \u2014 the demo in the lesson was brief. Could we get an extended walkthrough?",
        likes: 2,
      },
    ],
  },
  'cc-4': {
    headerLabel: 'Comment',
    courseTitle: 'Photography Masterclass',
    courseName: 'Lesson 8: Black and white',
    comments: [
      {
        id: 'cc4-1',
        name: 'Rudy Santino',
        badges: ['Instructor'],
        bio: 'Professional photographer and educator \u2014 Photography Masterclass creator',
        date: 'Feb 6, 2026',
        text: "B&W strips away color as a crutch and forces you to think about light, texture, and form. The color-channel mixer is where the magic happens \u2014 red filter for dramatic skies, green for lighter foliage, orange for flattering skin.",
        likes: 38,
      },
      {
        id: 'cc4-2',
        name: 'David Kim',
        badges: [],
        bio: 'Community booster \u00b7 1 year member',
        date: 'Feb 7, 2026',
        text: "Don't be afraid to push contrast to extremes in B&W. The drama lives in the highlights and shadows \u2014 that's where the emotion is.",
        likes: 15,
      },
      {
        id: 'cc4-3',
        name: 'Priya Sharma',
        badges: ['Pro'],
        bio: 'Cohort 3 \u00b7 Landscape photographer',
        date: 'Feb 8, 2026',
        text: "Shoot in RAW + JPEG with your camera's B&W filter applied. You get the preview in-camera but keep all the color data for post-processing flexibility.",
        likes: 9,
      },
      {
        id: 'cc4-4',
        name: 'Kenji Tanaka',
        badges: [],
        bio: 'Night photographer \u00b7 Technical enthusiast',
        date: 'Today, 10:05AM',
        text: "The color-channel mixing section went fast. Is there a cheat sheet for which filter emulation to use for sky vs skin? I keep over-darkening the blues and the sky goes black.",
        likes: 1,
      },
    ],
  },
  'cc-5': {
    headerLabel: 'Comment',
    courseTitle: 'Photography Masterclass',
    courseName: 'Lesson 6: Night photography',
    comments: [
      {
        id: 'cc5-1',
        name: 'Rudy Santino',
        badges: ['Instructor'],
        bio: 'Professional photographer and educator \u2014 Photography Masterclass creator',
        date: 'Feb 9, 2026',
        text: "A sturdy tripod is non-negotiable for night work. Even a slight wobble at 2-second exposures will ruin the shot. Use a remote shutter or your camera's 2s timer to eliminate vibration.",
        likes: 52,
      },
      {
        id: 'cc5-2',
        name: 'Kenji Tanaka',
        badges: [],
        bio: 'Night photographer \u00b7 Technical enthusiast',
        date: 'Feb 10, 2026',
        text: "ISO noise is real but don't be afraid of it. Modern sensors handle ISO 3200 incredibly well, and a bit of grain adds character to city night shots.",
        likes: 20,
      },
      {
        id: 'cc5-3',
        name: 'Priya Sharma',
        badges: ['Pro'],
        bio: 'Cohort 3 \u00b7 Landscape photographer',
        date: 'Feb 11, 2026',
        text: "The '500 rule' for star shots: divide 500 by your focal length to get the max exposure time before stars start trailing. Super useful formula.",
        likes: 33,
      },
      {
        id: 'cc5-4',
        name: 'Amy Torres',
        badges: ['Pro'],
        bio: 'Portrait specialist \u00b7 Cohort 2',
        date: 'Today, 8:50AM',
        text: "Using a Sony A7IV \u2014 the live view goes almost black at the apertures Rudy recommends. Is there a setting I'm missing? I can barely see to compose.",
        likes: 4,
      },
    ],
  },
  'cc-6': {
    headerLabel: 'Comment',
    courseTitle: 'Photography Masterclass',
    courseName: 'Lesson 2: Natural lighting',
    comments: [
      {
        id: 'cc6-1',
        name: 'Rudy Santino',
        badges: ['Instructor'],
        bio: 'Professional photographer and educator \u2014 Photography Masterclass creator',
        date: 'Feb 2, 2026',
        text: "Golden hour is the most forgiving light for beginners. Set an alarm for 30 minutes before sunset and go outside \u2014 even mediocre compositions look stunning in that warm light.",
        likes: 47,
      },
      {
        id: 'cc6-2',
        name: 'Maya Rodriguez',
        badges: ['Pro'],
        bio: 'Cohort 3 \u00b7 Landscape photographer \u00b7 Denver, CO',
        date: 'Feb 3, 2026',
        text: "Overcast days are massively underrated. The clouds act like a giant softbox \u2014 perfect diffused light with no harsh shadows. Ideal for portraits.",
        likes: 31,
      },
      {
        id: 'cc6-3',
        name: 'James Liu',
        badges: [],
        bio: 'Cohort 5 \u00b7 Action photography enthusiast',
        date: 'Feb 4, 2026',
        text: "Learn to read the direction of light first. Once you understand front, side, and back lighting, everything else \u2014 reflectors, fill cards \u2014 makes immediate sense.",
        likes: 19,
      },
      {
        id: 'cc6-4',
        name: 'Emily Park',
        badges: [],
        bio: 'Cohort 5 \u00b7 Beginner',
        date: 'Today, 1:30PM',
        text: "Just wanted to say the golden hour window explanation finally clicked for me. Shot my first sunset set yesterday and the warm tones were incredible. Thanks Rudy!",
        likes: 2,
      },
    ],
  },
  'cc-7': {
    headerLabel: 'Comment',
    courseTitle: 'Photography Masterclass',
    courseName: 'Lesson 9: Street photography',
    comments: [
      {
        id: 'cc7-1',
        name: 'Rudy Santino',
        badges: ['Instructor'],
        bio: 'Professional photographer and educator \u2014 Photography Masterclass creator',
        date: 'Feb 12, 2026',
        text: "The biggest barrier to street photography is psychological, not technical. Zone focusing on a 35mm lens and just walking with confidence gets better results than overthinking settings.",
        likes: 60,
      },
      {
        id: 'cc7-2',
        name: 'Kenji Tanaka',
        badges: [],
        bio: 'Night photographer \u00b7 Technical enthusiast',
        date: 'Feb 13, 2026',
        text: "Shoot at 1/250s minimum to freeze incidental motion, and keep your aperture between f/8\u2013f/11 so you're not constantly hunting for focus. This lets you react instantly.",
        likes: 28,
      },
      {
        id: 'cc7-3',
        name: 'Amy Torres',
        badges: ['Pro'],
        bio: 'Portrait specialist \u00b7 Cohort 2',
        date: 'Feb 14, 2026',
        text: "Don't neglect the context around your subject. The best street photos tell a story \u2014 the expression, the environment, and the lighting all working together.",
        likes: 14,
      },
      {
        id: 'cc7-4',
        name: 'David Kim',
        badges: [],
        bio: 'Community booster \u00b7 1 year member',
        date: 'Today, 3:10PM',
        text: "Love the 'pre-focus and wait' technique. Tried it at Union Square yesterday, 3 keepers out of 40 \u2014 best ratio I've ever had. This lesson was a breakthrough.",
        likes: 1,
      },
    ],
  },
  'cc-8': {
    headerLabel: 'Comment',
    courseTitle: 'Photography Masterclass',
    courseName: 'Lesson 10: Still life',
    comments: [
      {
        id: 'cc8-1',
        name: 'Rudy Santino',
        badges: ['Instructor'],
        bio: 'Professional photographer and educator \u2014 Photography Masterclass creator',
        date: 'Feb 14, 2026',
        text: "Still life is the perfect way to practice composition when you can't get outside. You can spend an hour rearranging the same three objects and learn more than a full day of random shooting.",
        likes: 36,
      },
      {
        id: 'cc8-2',
        name: 'James Liu',
        badges: [],
        bio: 'Cohort 5 \u00b7 Action photography enthusiast',
        date: 'Feb 15, 2026',
        text: "A piece of white foam board from the dollar store works as a fantastic reflector and fill card. Cheap and instantly elevates your setup.",
        likes: 24,
      },
      {
        id: 'cc8-3',
        name: 'Maya Rodriguez',
        badges: ['Pro'],
        bio: 'Cohort 3 \u00b7 Landscape photographer \u00b7 Denver, CO',
        date: 'Feb 16, 2026',
        text: "Texture is everything in still life. Side lighting from a window at 90 degrees to your subject brings out incredible detail that front lighting completely destroys.",
        likes: 17,
      },
      {
        id: 'cc8-4',
        name: 'Nina Patel',
        badges: [],
        bio: 'Bug reporter \u00b7 Technical photographer',
        date: 'Today, 12:00PM',
        text: "Would a homemade light tent work for the product shot exercise, or does reflection quality depend on pro equipment? Trying to keep this budget-friendly.",
        likes: 2,
      },
    ],
  },
  'cc-9': {
    headerLabel: 'Comment',
    courseTitle: 'Photography Masterclass',
    courseName: 'Lesson 1: Camera basics',
    comments: [
      {
        id: 'cc9-1',
        name: 'Rudy Santino',
        badges: ['Instructor'],
        bio: 'Professional photographer and educator \u2014 Photography Masterclass creator',
        date: 'Feb 17, 2026',
        text: "Start by memorizing just three things: aperture controls depth of field, shutter speed controls motion blur, ISO controls noise. Everything else is a variation of those three.",
        likes: 45,
      },
      {
        id: 'cc9-2',
        name: 'David Kim',
        badges: [],
        bio: 'Community booster \u00b7 1 year member',
        date: 'Feb 18, 2026',
        text: "Don't buy more gear. The camera you have is more capable than you are right now, and that's okay. Focus 100% on understanding light before thinking about lenses.",
        likes: 39,
      },
      {
        id: 'cc9-3',
        name: 'Emily Park',
        badges: [],
        bio: 'Cohort 5 \u00b7 Beginner',
        date: 'Feb 19, 2026',
        text: "Use Aperture Priority mode (Av/A) while you're learning. It handles shutter speed automatically so you can focus on just one variable at a time.",
        likes: 12,
      },
      {
        id: 'cc9-4',
        name: 'Tom Brown',
        badges: [],
        bio: 'Regular member \u00b7 5 months',
        date: 'Today, 4:00PM',
        text: "Coming from iPhone-only \u2014 any reason to not jump straight into manual mode, or should I start with aperture priority? I want to learn properly but don't want to overwhelm myself.",
        likes: 6,
      },
    ],
  },
  'cc-10': {
    headerLabel: 'Comment',
    courseTitle: 'Photography Masterclass',
    courseName: 'Lesson 1: Camera basics',
    comments: [
      {
        id: 'cc10-1',
        name: 'Rudy Santino',
        badges: ['Instructor'],
        bio: 'Professional photographer and educator \u2014 Photography Masterclass creator',
        date: 'Mar 1, 2026',
        text: "The exposure triangle is the foundation of everything. Think of it like a water faucet: aperture is how wide the tap is open, shutter speed is how long you leave it running, ISO is how sensitive the bucket is.",
        likes: 88,
      },
      {
        id: 'cc10-2',
        name: 'Maya Rodriguez',
        badges: ['Pro'],
        bio: 'Cohort 3 \u00b7 Landscape photographer \u00b7 Denver, CO',
        date: 'Mar 2, 2026',
        text: "Don't skip the exercises at the end of this lesson. Shooting in full manual for an afternoon teaches more than a week of theory.",
        likes: 74,
      },
      {
        id: 'cc10-3',
        name: 'James Liu',
        badges: [],
        bio: 'Cohort 5 \u00b7 Action photography enthusiast',
        date: 'Mar 3, 2026',
        text: "Just finished Lesson 1 \u2014 the aperture priority suggestion saved me. Being able to focus on one variable at a time made everything way less overwhelming.",
        likes: 21,
      },
      {
        id: 'cc10-4',
        name: 'Chen Wei',
        badges: [],
        bio: 'Beginner \u00b7 New to photography',
        date: 'Today, 7:30AM',
        text: "Finished! The exposure triangle analogy made it click \u2014 thanks Rudy. Moving on to Lesson 2 tonight.",
        likes: 3,
      },
    ],
  },
};

// ── AI Inbox Threads ──

export const AI_THREADS: V1ThreadItem[] = [
  { id: 'ai-1',  name: 'Maya Rodriguez',   time: '9:45',      preview: "I'd like to upgrade to annual \u2014 can you walk me through it?",       aiStatus: 'active',  agentId: 'support', priority: 'attention' },
  { id: 'ai-2',  name: 'Maya Rodriguez',   time: '9:30',      preview: "I've tried the password reset three times and I'm still locked out.",     aiStatus: 'paused',  agentId: 'clarity', priority: 'attention' },
  { id: 'ai-3',  name: 'Priya Sharma',     time: '9:15',      preview: "My connection keeps dropping during the live session\u2026",    aiStatus: 'active',  agentId: 'clarity', priority: 'attention' },
  { id: 'ai-4',  name: 'Emily Park',       time: '8:50',      preview: 'Your course progress looks great! You\u2019re 40% through Lesson 3\u2026',    aiStatus: 'active',  agentId: 'support', priority: 'routine' },
  { id: 'ai-5',  name: 'Kenji Tanaka',     time: '8:30',      preview: "Getting 401 Unauthorized on the course-events webhook\u2026",       aiStatus: 'paused',  agentId: 'support', priority: 'attention' },
  { id: 'ai-6',  name: 'Nina Patel',       time: 'Yesterday',  preview: "Following up on the iOS 18 autoplay bug \u2014 any update?",    aiStatus: 'active',  agentId: 'clarity', priority: 'attention' },
  { id: 'ai-7',  name: 'James Liu',        time: 'Yesterday',  preview: 'Cohort 5 starts May 6 \u2014 here\u2019s your orientation schedule\u2026',    aiStatus: 'active',  agentId: 'support', priority: 'routine' },
  { id: 'ai-8',  name: 'David Kim',        time: 'Yesterday',  preview: "I've updated your assignment submission \u2014 it's now marked received.",      aiStatus: 'active',  agentId: 'clarity', priority: 'routine' },
  { id: 'ai-9',  name: 'Derek Hoffman',    time: 'Mon',        preview: "This is getting frustrating \u2014 I've explained this three times already.",  aiStatus: 'paused',  agentId: 'support', priority: 'attention' },
  { id: 'ai-10', name: 'Tom Brown',        time: 'Mon',        preview: "Can I get a guest pass for a photographer friend?",     aiStatus: 'active',  agentId: 'clarity', priority: 'routine' },
];

// ── AI Conversations ──

export const AI_CONVERSATIONS: Record<string, V1AIConversation> = {
  'ai-1': {
    agentName: 'Support Agent',
    memberName: 'Maya Rodriguez',
    groups: [
      {
        label: 'Today',
        messages: [
          { id: 'a10', senderName: 'Maya Rodriguez', text: "Hi! I'm currently on the Pro monthly plan. I'd like to switch to annual \u2014 can you walk me through the savings?", time: '9:40 AM' },
          { id: 'a11', senderName: 'Support Agent', text: "Hi Maya! Happy to help. Your Pro plan is $29/month ($348/year). Annual billing is $239/year \u2014 that's a savings of $109. Would you like me to switch you over?", time: '9:41 AM', isBot: true },
          { id: 'a12', senderName: 'Maya Rodriguez', text: "That's a solid savings. Does the switch happen immediately or at the next billing cycle?", time: '9:43 AM' },
          { id: 'a13', senderName: 'Support Agent', text: "It takes effect at your next billing date (May 15). You'll get a prorated credit for the remaining days on monthly. Want me to go ahead and schedule the switch?", time: '9:45 AM', isBot: true },
        ],
      },
    ],
  },
  'ai-2': {
    agentName: 'Clarity Agent',
    memberName: 'Maya Rodriguez',
    groups: [
      {
        label: 'Today',
        messages: [
          { id: 'a20', senderName: 'Maya Rodriguez', text: "I can't log in \u2014 I need to reset my password.", time: '9:10 AM' },
          { id: 'a21', senderName: 'Clarity Agent', text: "I can help with that. What email address is associated with your account?", time: '9:12 AM', isBot: true },
          { id: 'a22', senderName: 'Maya Rodriguez', text: "maya.rodriguez@gmail.com \u2014 I've tried the reset link twice, nothing comes through.", time: '9:20 AM' },
          { id: 'a23', senderName: 'Clarity Agent', text: "Let me check \u2014 your account shows that email on file. Can you check your spam folder?", time: '9:22 AM', isBot: true },
          { id: 'a24', senderName: 'Maya Rodriguez', text: "Already did. Nothing. I have a cohort session in 20 minutes, I really need access to the live room.", time: '9:30 AM' },
        ],
      },
    ],
  },
  'ai-3': {
    agentName: 'Clarity Agent',
    memberName: 'Priya Sharma',
    groups: [
      {
        label: 'Yesterday',
        messages: [
          { id: 'a1', senderName: 'Priya Sharma', text: "My connection keeps dropping during live sessions. I missed half of Tuesday's landscape critique.", time: '1:55 PM' },
          { id: 'a2', senderName: 'Clarity Agent', text: "I'm sorry to hear that. Let's troubleshoot. Are you on Wi-Fi or a wired connection? And which browser are you using?", time: '1:56 PM', isBot: true },
          { id: 'a3', senderName: 'Priya Sharma', text: "Wi-Fi, Chrome on Mac. I've restarted the router already.", time: '1:58 PM' },
          { id: 'a4', senderName: 'Clarity Agent', text: "Try connecting via ethernet if possible \u2014 Wi-Fi can be unstable during video streams. You can also lower the stream quality in Settings > Video > Quality. Would you like step-by-step instructions?", time: '1:59 PM', isBot: true },
          { id: 'a5', senderName: 'Priya Sharma', text: "I'll try the ethernet cable. Thanks!", time: '2:05 PM' },
          { id: 'a6', senderName: 'Clarity Agent', text: "Great choice! Let me know if the issue persists after switching. I'm here to help anytime.", time: '2:06 PM', isBot: true },
        ],
      },
    ],
  },
  'ai-5': {
    agentName: 'Support Agent',
    memberName: 'Kenji Tanaka',
    groups: [
      {
        label: 'Today',
        messages: [
          { id: 'a50', senderName: 'Kenji Tanaka', text: "I'm trying to sync course completion events to a Zapier webhook. Getting 401 Unauthorized every time.", time: '8:10 AM' },
          { id: 'a51', senderName: 'Support Agent', text: "Let me check the auth requirements for the course-events endpoint. Can you confirm which API key you're using?", time: '8:12 AM', isBot: true },
          { id: 'a52', senderName: 'Kenji Tanaka', text: "I'm using the key from my profile settings. Is there a separate token for webhook auth?", time: '8:15 AM' },
          { id: 'a53', senderName: 'Support Agent', text: "The profile API key is for read-only access. For webhooks, you'll need the token from Settings \u2192 Developer \u2192 Webhooks. Let me find the documentation link.", time: '8:18 AM', isBot: true },
          { id: 'a54', senderName: 'Kenji Tanaka', text: "I've already tried that path and there's no Developer section in my settings. Is it a permissions thing?", time: '8:30 AM' },
        ],
      },
    ],
  },
  'ai-9': {
    agentName: 'Support Agent',
    memberName: 'Derek Hoffman',
    groups: [
      {
        label: 'Monday',
        messages: [
          { id: 'a90', senderName: 'Derek Hoffman', text: "I've been trying to upload my assignment for 3 days now and it keeps failing. This is a paid course.", time: '10:00 AM' },
          { id: 'a91', senderName: 'Support Agent', text: "I'm sorry for the trouble. What file format and size are you trying to upload? Our system supports files up to 50MB in PDF, JPEG, and PNG formats.", time: '10:02 AM', isBot: true },
          { id: 'a92', senderName: 'Derek Hoffman', text: "It's a 12MB PDF. Well within the limits. I've tried Chrome and Firefox.", time: '10:05 AM' },
          { id: 'a93', senderName: 'Support Agent', text: "That should work fine. Could you try clearing your browser cache? There's also a known issue with some ad blockers interfering with uploads.", time: '10:08 AM', isBot: true },
          { id: 'a94', senderName: 'Derek Hoffman', text: "This is getting frustrating \u2014 I've explained this three times already. I need to submit by tomorrow and nothing is working.", time: '10:15 AM' },
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
  'Alex Chen': {
    name: 'Alex Chen',
    role: 'Founding member \u00b7 Portrait photographer',
    email: 'alex.chen@example.com',
    location: 'San Francisco, CA',
    joinDate: 'Member since January 2023',
    bio: 'Founding member of Photography Masterclass. Portrait and editorial photographer. Two courses completed, active in critique circle. Passionate about lighting and storytelling through images.',
    tags: [
      { emoji: '\u2728', label: 'Founding' },
      { emoji: '\ud83d\udcaa', label: 'Pro' },
      { emoji: '\ud83d\udcf7', label: '2 courses' },
    ],
    socialLinks: [
      { platform: 'Web', url: 'alexchenphotography.com' },
      { platform: 'Instagram', url: '@alexchen_portraits' },
    ],
  },
  'Maya Rodriguez': {
    name: 'Maya Rodriguez',
    role: 'Cohort 3 \u00b7 Landscape photographer',
    email: 'maya.rodriguez@example.com',
    location: 'Denver, CO',
    joinDate: 'Member since September 2025',
    bio: 'Landscape and golden hour specialist. Cohort 3 alumna, now helping new members in critique circle. Currently working on a Colorado wilderness series.',
    tags: [
      { emoji: '\ud83d\udcaa', label: 'Pro' },
      { emoji: '\ud83c\udf05', label: 'Critique regular' },
    ],
    socialLinks: [
      { platform: 'Web', url: 'mayarodriguezphoto.com' },
      { platform: 'Instagram', url: '@maya_landscapes' },
    ],
  },
  'Derek Hoffman': {
    name: 'Derek Hoffman',
    role: 'Community member \u00b7 Meetup host',
    email: 'derek.hoffman@example.com',
    location: 'Austin, TX',
    joinDate: 'Member since August 2025',
    bio: 'Street and urban photographer. Runs a local Austin photography meetup. Two courses completed, active in gear talk. Sometimes pushes self-promotion boundaries.',
    tags: [
      { emoji: '\ud83d\udcaa', label: 'Pro' },
      { emoji: '\ud83d\udc65', label: 'Meetup host' },
    ],
    socialLinks: [
      { platform: 'Web', url: 'derekphoto.com' },
      { platform: 'Instagram', url: '@derek_street' },
    ],
  },
  'Emily Park': {
    name: 'Emily Park',
    role: 'Cohort 5 \u00b7 Beginner',
    email: 'emily.park@example.com',
    location: 'Portland, OR',
    joinDate: 'Member since February 2026',
    bio: 'Brand new to photography, shooting on a Canon R50. Joined Cohort 5 and excited to learn from scratch. Looking forward to meeting fellow beginners!',
    tags: [
      { emoji: '\ud83c\udf31', label: 'New member' },
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
    { id: 'ct1', senderName: 'Maya Rodriguez', text: "Shooting at f/11 with a wide-angle keeps both planes sharp without stacking. Rudy\u2019s hyperfocal tip in 7.2 was the unlock.", time: '2:10 PM' },
    { id: 'ct2', senderName: 'David Kim', text: "Don't overthink it \u2014 just get low and put something interesting in the bottom third.", time: '3:45 PM' },
    { id: 'ct3', senderName: 'Priya Sharma', text: 'This is exactly what I needed. Going to try the foreground exercise again this weekend.', time: '5:00 PM' },
  ],
  'c2': [
    { id: 'ct5', senderName: 'Priya Sharma', text: "f/11 hyperfocal changed everything for me. Practice > theory when starting landscapes.", time: '3:00 PM' },
    { id: 'ct6', senderName: 'James Liu', text: 'How long before the foreground framing starts feeling natural? Still feels forced for me.', time: '4:15 PM' },
  ],
  'c3': [
    { id: 'ct4', senderName: 'Maya Rodriguez', text: "Getting low was the breakthrough for me too. Everything looks more dynamic from knee height.", time: '4:20 PM' },
  ],
  'c3b': [
    { id: 'ct7', senderName: 'Priya Sharma', text: 'The wide-aperture foreground approach is underrated. Love that dreamy look.', time: '5:30 PM' },
    { id: 'ct8', senderName: 'Maya Rodriguez', text: "It works beautifully for golden hour shots \u2014 blurred wildflowers in the foreground, sharp mountains behind.", time: '6:00 PM' },
    { id: 'ct9', senderName: 'Emily Park', text: 'Going to try this approach starting today. Thanks for the inspo!', time: '7:10 PM' },
  ],
  'cc3-2': [
    { id: 'ct10', senderName: 'Maya Rodriguez', text: 'Gray card custom WB is a game changer for mixed-light portraits!', time: '11:00 AM' },
    { id: 'ct11', senderName: 'Rudy Santino', text: "Also try shooting a test frame with your phone's color checker app \u2014 it gives you an exact Kelvin value to dial into manual WB.", time: '11:30 AM' },
  ],
  'c13': [
    { id: 'ct12', senderName: 'Rudy Santino', text: "James \u2014 Lesson 4.3 covers exactly this. Short version: indoor light is always the bottleneck, so don't fight it with shutter speed. Pre-focus, shoot bursts, embrace slight motion blur.", time: '10:00 AM' },
    { id: 'ct13', senderName: 'Maya Rodriguez', text: "+1 on pre-focus. I shoot kids indoor sports at 1/250 and get a better keeper ratio than 1/500 because I'm not chasing.", time: '10:15 AM' },
  ],
};
