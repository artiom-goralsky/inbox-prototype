/* ─── Message types ──────────────────────────────────────── */
export type ScenarioMessage =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'summary-item'; text: string }
  | { type: 'summary-deferred'; text: string }
  | { type: 'ready-to-send' }
  | { type: 'needs-you' };

export interface ScenarioPill {
  label: string;
  variant: 'recommended' | 'default' | 'muted';
  targetStep: number;
}

export interface InboxSyncCommand {
  activeTab?: 'dms' | 'moderation' | 'course-comments' | 'ai-inbox';
  selectedThread?: string | null;
  badgeUpdates?: Record<string, number>;
  markRead?: string;
  composerDraft?: { text: string; recipientName: string } | null;
}

export interface ScenarioStep {
  id: number;
  messages: ScenarioMessage[];
  pills: ScenarioPill[];
  inboxSync: InboxSyncCommand;
}

/* ─── Ready card data ────────────────────────────────────── */
export interface ReadyCard {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  snippet: string;
  tag: 'Thank you' | 'FAQ' | 'Support';
  memberContext: string;
  summary: string;
  draft: string;
  source: string;
}

export const readyCards: ReadyCard[] = [
  { id: 'james-liu', name: 'James Liu', initials: 'JL', avatarColor: '#BA7517', snippet: 'Thanks for the camera sett...', tag: 'Thank you', memberContext: 'Member 14mo \u00b7 3 courses \u00b7 Active', summary: 'Thanking you for camera settings tip from live session.', draft: 'Glad it helped, James! Try those settings during golden hour \u2014 the results are stunning.', source: 'Your reply to similar, Mar 20' },
  { id: 'emily-park', name: 'Emily Park', initials: 'EP', avatarColor: '#D4537E', snippet: 'The landscape composition...', tag: 'Thank you', memberContext: 'Member 6mo \u00b7 1 course \u00b7 Active', summary: 'Loved the landscape composition lesson.', draft: "So glad to hear that, Emily! Lesson 5 builds on those concepts \u2014 I think you'll love it.", source: 'Your reply to similar, Mar 18' },
  { id: 'david-kim', name: 'David Kim', initials: 'DK', avatarColor: '#D85A30', snippet: 'Community is awesome...', tag: 'Thank you', memberContext: 'Member 8mo \u00b7 2 courses \u00b7 Active', summary: 'Praising the community \u2014 learned more than 2 years of YouTube.', draft: 'That means a lot, David. The community learns from each other \u2014 your landscape shots have been inspiring others too.', source: 'Your reply to similar, Mar 15' },
  { id: 'amy-torres', name: 'Amy Torres', initials: 'AT', avatarColor: '#1D9E75', snippet: 'Thanks for the feedback...', tag: 'Thank you', memberContext: 'Member 4mo \u00b7 1 course \u00b7 Active', summary: 'Thanking you for feedback on portrait series.', draft: 'Your lighting choices in that series were really strong, Amy. Would love to see you experiment with rim lighting next.', source: 'Your feedback reply, Feb 20' },
  { id: 'chen-wei', name: 'Chen Wei', initials: 'CW', avatarColor: '#378ADD', snippet: 'How do I access lesson 3?', tag: 'FAQ', memberContext: 'Member 2mo \u00b7 1 course \u00b7 New', summary: "Can't find Lesson 3 in Landscape Basics dashboard.", draft: "Hi Chen! Go to your Dashboard \u2192 My Courses \u2192 Landscape Basics. Lesson 3 is in the \"Composition\" module. If it's not showing, try logging out and back in \u2014 sometimes the enrollment takes a moment to sync.", source: 'KB: Course Access FAQ' },
  { id: 'maria-santos', name: 'Maria Santos', initials: 'MS', avatarColor: '#534AB7', snippet: 'When is the next live ses...', tag: 'FAQ', memberContext: 'Member 3mo \u00b7 2 courses \u00b7 Active', summary: 'Asking when the next live session is.', draft: "Hi Maria! The next live session is this Thursday at 7pm EST \u2014 \"Night Photography Basics\" with instructor Jake. I'll make sure you get a reminder 1 hour before.", source: 'KB: Live Sessions Schedule' },
  { id: 'chris-lee', name: 'Chris Lee', initials: 'CL', avatarColor: '#1D9E75', snippet: 'Can I download lesson vid...', tag: 'FAQ', memberContext: 'Member 5mo \u00b7 1 course \u00b7 Active', summary: 'Wants to download lesson videos for offline viewing.', draft: "Hi Chris! Yes \u2014 on any lesson page, click the three-dot menu next to the video and select \"Download.\" Videos are available in 720p and 1080p. Note: downloads expire after 30 days for licensing reasons.", source: 'KB: Video Downloads FAQ' },
  { id: 'nina-patel', name: 'Nina Patel', initials: 'NP', avatarColor: '#BA7517', snippet: 'Video stops at 3:42...', tag: 'Support', memberContext: 'Member 9mo \u00b7 3 courses \u00b7 Active', summary: 'Video playback stops at 3:42 in Portrait Pro lesson 7. Tried multiple browsers.', draft: "Thanks for the detailed report, Nina. I've flagged this with our team \u2014 it looks like an encoding issue with that specific segment. We'll have it fixed within 24 hours. In the meantime, the lesson notes cover the same content if you want to keep going.", source: 'Your bug reply, Feb 12' },
  { id: 'omar-hassan', name: 'Omar Hassan', initials: 'OH', avatarColor: '#D85A30', snippet: 'Payment failed...', tag: 'Support', memberContext: 'Member 11mo \u00b7 2 courses \u00b7 Active', summary: 'Payment failed on renewal. Card expired. Wants to stay.', draft: "Hi Omar! I can see the payment attempt \u2014 it looks like your card on file expired. I've sent you a secure link to update your payment method. Once updated, the renewal will process automatically. Let me know if you hit any issues.", source: 'Template: Payment Issues' },
];

/* ─── Needs-you card data ────────────────────────────────── */
export interface NeedsYouCard {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  memberContext: string;
  summary: string;
  questionSnippet: string;
  tradeoff: string;
  tradeoffSource: string;
  draft?: string;
  source: string;
  draftOptions?: { label: string; draft: string }[];
}

export const needsYouCards: NeedsYouCard[] = [
  { id: 'tom-brown', name: 'Tom Brown', initials: 'TB', avatarColor: '#534AB7', questionSnippet: 'Guest pass for a friend?', memberContext: 'Member 5mo \u00b7 1 course \u00b7 Moderate activity', summary: 'Asking for a guest pass for a photographer friend.', tradeoff: '3 guest passes granted this month, 2 converted to members. Referral program alternative: both get a free month.', tradeoffSource: 'Community activity data + billing', source: 'No past match', draftOptions: [{ label: 'Yes \u2014 7-day pass', draft: "Absolutely, Tom! I've generated a 7-day guest pass for your friend. Here's the link: [guest-link]. They'll get full access to the community spaces and one free course preview." }, { label: 'No \u2014 offer referral', draft: "Thanks for thinking of us, Tom! We don't do guest passes, but we have a referral program \u2014 if your friend signs up with your link, you both get a month free. I'll DM you the referral link." }] },
  { id: 'lisa-wong', name: 'Lisa Wong', initials: 'LW', avatarColor: '#378ADD', questionSnippet: 'Switch monthly to annual...', memberContext: 'Member 8mo \u00b7 Monthly $29/mo \u00b7 Active', summary: 'Wants to switch from monthly to annual billing. Asking about immediate savings.', tradeoff: '$29/mo ($348/yr) vs $239/yr = $109 savings for her. 8 months on monthly \u2014 consistent engagement, likely to stay long-term.', tradeoffSource: 'Billing history + engagement data', source: 'No past match', draftOptions: [{ label: 'Approve switch', draft: "Great choice, Lisa! I've switched your plan to annual \u2014 you'll save $60/year. The prorated credit from your current month has been applied, so your next charge will reflect the new rate." }, { label: 'Confirm terms first', draft: "Happy to help with that, Lisa! The annual plan is $239/yr vs $29/mo \u2014 that's $109 savings. The switch takes effect at your next billing date. Want me to go ahead?" }] },
  { id: 'alex-chen', name: 'Alex Chen', initials: 'AC', avatarColor: '#1D9E75', questionSnippet: 'Refund request \u2014 Advanced Lighting', memberContext: 'Founding member \u00b7 $299/yr \u00b7 Renewed twice \u00b7 First complaint', summary: 'Refund request for Advanced Lighting ($49). Instructor inactive 3 weeks. First complaint. Polite but frustrated.', tradeoff: 'Founding member since Jun 2023. 47 posts, 2 completed courses. Zero previous complaints. Losing him costs more than the $49 refund.', tradeoffSource: 'Member profile + billing + activity history', draft: "Hi Alex, thanks for reaching out. You're right that the Advanced Lighting schedule has slipped \u2014 I've spoken with the instructor and new lessons are coming next week. I'd like to offer you a complimentary month extension rather than a refund, so you don't lose access while the content catches up. Would that work for you?", source: 'No past match \u2014 drafted from context' },
];

/* ─── Scenario (4 steps: 0-3, no auto-greeting) ─────────── */
export const inboxScenario: ScenarioStep[] = [
  {
    id: 0,
    messages: [
      { type: 'paragraph', text: "I've read all 12 DMs. 9 are routine \u2014 thank-yous, FAQ, and support issues. I have replies ready from your knowledge base and past messages. 3 need your decision." },
      { type: 'paragraph', text: "Let's clear the routine ones first:" },
      { type: 'ready-to-send' },
    ],
    pills: [],
    inboxSync: { activeTab: 'dms' },
  },
  {
    id: 1,
    messages: [
      { type: 'paragraph', text: '9 sent. Now the 3 that need you:' },
      { type: 'needs-you' },
    ],
    pills: [],
    inboxSync: { activeTab: 'dms' },
  },
  {
    id: 2,
    messages: [{ type: 'paragraph', text: '__DEFERRED_TEXT__' }],
    pills: [
      { label: 'Show remaining', variant: 'default', targetStep: 1 },
      { label: 'Done for now', variant: 'muted', targetStep: 3 },
    ],
    inboxSync: {},
  },
  {
    id: 3,
    messages: [
      { type: 'paragraph', text: 'Morning DMs done:' },
      { type: 'summary-item', text: '9 routine replies sent' },
      { type: 'summary-item', text: '1 guest pass approved for Tom Brown' },
      { type: 'summary-item', text: '1 plan switch for Lisa Wong' },
      { type: 'summary-item', text: '1 personal reply to Alex Chen' },
      { type: 'paragraph', text: '12 DMs handled.' },
    ],
    pills: [],
    inboxSync: { activeTab: 'dms', badgeUpdates: { dms: 0 } },
  },
];
