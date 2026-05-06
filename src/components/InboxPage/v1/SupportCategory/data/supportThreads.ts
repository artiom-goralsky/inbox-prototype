export type SupportThreadState =
  | 'new_reply'
  | 'awaiting_circle'
  | 'has_draft'
  | 'resolved'
  | 'solved'
  | 'closed'
  | 'in_queue'
  | 'active'
  | 'awaiting_user';

export type SupportStatus = 'open' | 'resolved';

export function getThreadStatus(thread: { state: SupportThreadState }): SupportStatus {
  if (thread.state === 'resolved' || thread.state === 'solved' || thread.state === 'closed') return 'resolved';
  return 'open';
}

export type SupportChannel = 'email' | 'chat';

export type SupportSender = 'admin' | 'circle' | 'system';

export interface SupportMessage {
  id: string;
  sender: SupportSender;
  body: string;
  timestamp: string;
  agentName?: string;
  agentAvatar?: string | null;
}

export interface SupportThread {
  id: string;
  subject: string;
  channel: SupportChannel;
  state: SupportThreadState;
  lastActivity: string;
  draft?: string;
  messages: SupportMessage[];
  queueState?: { startedAt: number };
}

export function addSupportThread(thread: SupportThread): void {
  mockSupportThreads.unshift(thread);
}

export const mockSupportThreads: SupportThread[] = [
  {
    id: 'sup-1',
    subject: 'Billing — annual switch',
    channel: 'email',
    state: 'new_reply',
    lastActivity: '2h',
    messages: [
      {
        id: 'm1',
        sender: 'admin',
        body: "Hey team, can I switch from monthly to annual billing mid-cycle? What happens to my current month's payment?",
        timestamp: 'Yesterday 4:12 PM',
      },
      {
        id: 'm2',
        sender: 'circle',
        agentName: 'Calvin Parks',
        agentAvatar: '/images/avatars/5.png',
        body: "Switched your plan, refund is processing now. You'll see the prorated credit in 3-5 business days. Annual billing kicks in today and your next charge will be in 12 months.",
        timestamp: 'Today 1:55 PM',
      },
    ],
  },
  {
    id: 'sup-2',
    subject: 'SSO setup not working',
    channel: 'email',
    state: 'new_reply',
    lastActivity: '5h',
    messages: [
      {
        id: 'm1',
        sender: 'admin',
        body: "I'm trying to set up SAML SSO with Okta. Followed the docs but my members get a 'metadata mismatch' error on login. What am I missing?",
        timestamp: 'Today 9:02 AM',
      },
      {
        id: 'm2',
        sender: 'circle',
        agentName: 'Sarah Lin',
        agentAvatar: '/images/avatars/4.png',
        body: "Can you share the IdP metadata you uploaded? Specifically the entityID and the X.509 cert. Most often this error means the cert in our config doesn't match what Okta is signing assertions with.",
        timestamp: 'Today 11:30 AM',
      },
    ],
  },
  {
    id: 'sup-3',
    subject: 'Bulk member import limit',
    channel: 'email',
    state: 'awaiting_circle',
    lastActivity: '1d',
    messages: [
      {
        id: 'm1',
        sender: 'admin',
        body: "Hey, getting an error when uploading a CSV with 5k+ rows. Is there a hard limit? My community has 18k members and I'm migrating from Mighty.",
        timestamp: 'Yesterday 10:45 AM',
      },
    ],
  },
  {
    id: 'sup-4',
    subject: 'API rate limits',
    channel: 'email',
    state: 'has_draft',
    lastActivity: 'now',
    draft:
      "Hi team, hitting 429s on the members endpoint when running our nightly sync. We're well under the documented 1000/min limit — about 200/min sustained.",
    messages: [],
  },
  {
    id: 'sup-5',
    subject: 'Webhooks signature',
    channel: 'email',
    state: 'resolved',
    lastActivity: '3d',
    messages: [
      {
        id: 'm1',
        sender: 'admin',
        body: 'Webhook signature verification failing on my end. Using HMAC-SHA256 with the secret from settings, but signatures don\'t match.',
        timestamp: '3 days ago',
      },
      {
        id: 'm2',
        sender: 'circle',
        agentName: 'Calvin Parks',
        agentAvatar: '/images/avatars/5.png',
        body: 'You need to use the raw request body before any JSON parsing. Some frameworks parse it automatically — that breaks the signature.',
        timestamp: '3 days ago',
      },
      {
        id: 'm3',
        sender: 'admin',
        body: 'That was it! Thanks Calvin.',
        timestamp: '3 days ago',
      },
      {
        id: 'm4',
        sender: 'circle',
        agentName: 'Calvin Parks',
        agentAvatar: '/images/avatars/5.png',
        body: "Glad it's sorted! Closing this out.",
        timestamp: '3 days ago',
      },
    ],
  },
  {
    id: 'sup-6',
    subject: 'Setting up the feed',
    channel: 'chat',
    state: 'active',
    lastActivity: '5m',
    messages: [
      {
        id: 'm1',
        sender: 'admin',
        body: 'I need help setting up courses structure and paywalls',
        timestamp: 'Today 2:30 PM',
      },
      {
        id: 'm2',
        sender: 'system',
        body: 'Lucy Smith has joined the chat',
        timestamp: 'Today 2:32 PM',
      },
      {
        id: 'm3',
        sender: 'circle',
        agentName: 'Lucy Smith',
        agentAvatar: '/images/avatars/3.png',
        body: 'Hi! How can I help you?',
        timestamp: 'Today 2:32 PM',
      },
    ],
  },
  {
    id: 'sup-8',
    subject: 'Custom domain DNS issue',
    channel: 'email',
    state: 'closed',
    lastActivity: '2w',
    messages: [
      {
        id: 'm1',
        sender: 'admin',
        body: "Custom domain isn't pointing to my community. CNAME record looks right but visitors get a Circle 404.",
        timestamp: '2 weeks ago',
      },
      {
        id: 'm2',
        sender: 'circle',
        agentName: 'Sarah Lin',
        agentAvatar: '/images/avatars/4.png',
        body: 'Thanks for reaching out — could you share a screenshot of the DNS records you set up? We need entityID + CNAME target.',
        timestamp: '2 weeks ago',
      },
    ],
  },
  {
    id: 'sup-7',
    subject: 'Webhooks debugging',
    channel: 'chat',
    state: 'resolved',
    lastActivity: '4d',
    messages: [
      {
        id: 'm1',
        sender: 'admin',
        body: 'Webhooks are flaky, getting timeouts',
        timestamp: '4 days ago',
      },
      {
        id: 'm2',
        sender: 'system',
        body: 'Calvin Parks has joined the chat',
        timestamp: '4 days ago',
      },
      {
        id: 'm3',
        sender: 'circle',
        agentName: 'Calvin Parks',
        agentAvatar: '/images/avatars/5.png',
        body: 'Let me check the logs on our side',
        timestamp: '4 days ago',
      },
      {
        id: 'm4',
        sender: 'circle',
        agentName: 'Calvin Parks',
        agentAvatar: '/images/avatars/5.png',
        body: 'Found it — temporary issue with our queue. Should be fixed now. Try again?',
        timestamp: '4 days ago',
      },
      {
        id: 'm5',
        sender: 'admin',
        body: 'Working now, thanks!',
        timestamp: '4 days ago',
      },
    ],
  },
];

export interface SupportPrefill {
  subject: string;
  message: string;
}

export type SupportNewVariant = 'email';

export const LIVE_CHAT_AGENT = {
  name: 'Lucy Smith',
  avatar: '/images/avatars/3.png',
} as const;

export const LIVE_CHAT_WAIT_LABEL = 'Wait time: ~15 min';

export const QUEUE_INITIAL_PEOPLE_AHEAD = 8;
export const QUEUE_TICK_MS = 625;

export function transitionThreadToActive(threadId: string): void {
  const thread = mockSupportThreads.find(t => t.id === threadId);
  if (!thread || thread.state !== 'in_queue') return;
  const base = thread.messages.length;
  thread.state = 'active';
  thread.lastActivity = 'now';
  thread.messages.push(
    { id: `${threadId}-m${base + 1}`, sender: 'system', body: `${LIVE_CHAT_AGENT.name} has joined the chat`, timestamp: 'Just now' },
    { id: `${threadId}-m${base + 2}`, sender: 'circle', agentName: LIVE_CHAT_AGENT.name, agentAvatar: LIVE_CHAT_AGENT.avatar, body: `Hi! I'm ${LIVE_CHAT_AGENT.name.split(' ')[0]} from Circle Support. How can I help you today?`, timestamp: 'Just now' },
  );
  window.dispatchEvent(new CustomEvent('support-thread-updated', { detail: { threadId } }));
}
