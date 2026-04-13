import type { ScenarioPill, InboxSyncCommand } from './inboxScenarioData';

/* ─── Message types ──────────────────────────────────────── */
export type ModerationMessage =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'summary-item'; text: string }
  | { type: 'moderation-confirm-list' }
  | { type: 'moderation-decide-list' };

export interface ModerationStep {
  id: number;
  messages: ModerationMessage[];
  pills: ScenarioPill[];
  inboxSync: InboxSyncCommand;
}

/* ─── Confirm card data ──────────────────────────────────── */
export interface ModerationConfirmCard {
  id: string;
  author: string;
  authorGroup: string;
  type: 'Post' | 'Comment' | 'Message' | 'Connection';
  tag: 'Spam' | 'False positive';
  preAssignedAction: 'Remove' | 'Allow';
  contentPreview: string;
  fullContent: string;
  context: string;
  flaggedBy: string;
  copilotReasoning: string;
  memberContext: string;
}

export const confirmCards: ModerationConfirmCard[] = [
  // Maria Santos — 5 spam posts
  { id: 'm1', author: 'Maria Santos', authorGroup: 'Maria Santos', type: 'Post', tag: 'Spam', preAssignedAction: 'Remove', contentPreview: 'Check out these amazing deals on camera gear...', fullContent: 'Check out these amazing deals on camera gear at photogeardeals.store! Professional DSLRs starting at $299. Use code CIRCLE20 for 20% off. Limited time offer!', context: 'in Photography Basics', flaggedBy: 'Spam workflow + 3 reports', copilotReasoning: 'Account 14 days old. 5 posts, all external links to same domain. 0 comments, 0 reactions. Also sent 2 promo DMs this week.', memberContext: '14 days \u00b7 0 courses \u00b7 5 posts, all promotional' },
  { id: 'm2', author: 'Maria Santos', authorGroup: 'Maria Santos', type: 'Post', tag: 'Spam', preAssignedAction: 'Remove', contentPreview: 'Professional photographers swear by these len...', fullContent: 'Professional photographers swear by these lenses \u2014 get 20% off at photogeardeals.store! I\'ve been using them for months. Reply for my referral link!', context: 'in Landscape Tips', flaggedBy: 'Spam workflow', copilotReasoning: 'Same external domain. Referral link pattern.', memberContext: '14 days \u00b7 0 courses \u00b7 5 posts, all promotional' },
  { id: 'm3', author: 'Maria Santos', authorGroup: 'Maria Santos', type: 'Post', tag: 'Spam', preAssignedAction: 'Remove', contentPreview: 'Upgrade your street photography kit \u2014 exclusi...', fullContent: 'Upgrade your street photography kit \u2014 exclusive discounts at photogeardeals.store. These are the exact items used by the pros. Sale ends Sunday!', context: 'in Street Photography', flaggedBy: 'Spam workflow + 1 report', copilotReasoning: 'Third post to same domain in 2 days.', memberContext: '14 days \u00b7 0 courses \u00b7 5 posts, all promotional' },
  { id: 'm4', author: 'Maria Santos', authorGroup: 'Maria Santos', type: 'Post', tag: 'Spam', preAssignedAction: 'Remove', contentPreview: 'Best deals on tripods and stabilizers...', fullContent: 'Best deals on tripods and stabilizers at photogeardeals.store! Flash sale this weekend only. Professional grade at hobbyist prices.', context: 'in Gear Talk', flaggedBy: 'Spam workflow', copilotReasoning: 'Identical promotional pattern.', memberContext: '14 days \u00b7 0 courses \u00b7 5 posts, all promotional' },
  { id: 'm5', author: 'Maria Santos', authorGroup: 'Maria Santos', type: 'Post', tag: 'Spam', preAssignedAction: 'Remove', contentPreview: 'Flash sale on editing software \u2014 use code PHO...', fullContent: 'Flash sale on editing software \u2014 use code PHOTO50 at photogeardeals.store for 50% off! Professional tools at amateur prices.', context: 'in Post-Processing', flaggedBy: 'Spam workflow + 2 reports', copilotReasoning: 'Fifth post linking to same domain. Pattern is clear.', memberContext: '14 days \u00b7 0 courses \u00b7 5 posts, all promotional' },
  // Bot accounts — 3 items
  { id: 'b1', author: 'seo_expert_2025', authorGroup: 'Bot accounts', type: 'Post', tag: 'Spam', preAssignedAction: 'Remove', contentPreview: 'Top 10 SEO strategies for photographers in 2...', fullContent: 'Top 10 SEO strategies for photographers in 2025! Boost your online presence with these proven techniques. Visit seomaster.biz for free tools.', context: 'in Photography Basics', flaggedBy: 'Spam workflow', copilotReasoning: 'Bot profile: created 2 days ago, generic name, auto-generated bio, links to external SEO service.', memberContext: '2 days \u00b7 bot profile' },
  { id: 'b2', author: 'digital_growth_pro', authorGroup: 'Bot accounts', type: 'Post', tag: 'Spam', preAssignedAction: 'Remove', contentPreview: 'Maximize your online presence with these prov...', fullContent: 'Maximize your online presence with these proven strategies! Get free consultation at digitalgrowth.pro. Limited spots available!', context: 'in Landscape Tips', flaggedBy: 'Spam workflow', copilotReasoning: 'Bot profile: created 1 day ago, no avatar, promotional bio, single post with external link.', memberContext: '1 day \u00b7 bot profile' },
  { id: 'b3', author: 'seo_expert_2025', authorGroup: 'Bot accounts', type: 'Connection', tag: 'Spam', preAssignedAction: 'Remove', contentPreview: '\u2192 Rachel Torres (top contributor)', fullContent: 'Connection request to Rachel Torres (top contributor)', context: 'Connection request', flaggedBy: 'Spam workflow', copilotReasoning: 'Bot account sending connection requests to top contributors. Known spam tactic.', memberContext: '2 days \u00b7 bot profile' },
  // Jake Miller — 2 false positives
  { id: 'j1', author: 'Jake Miller', authorGroup: 'Jake Miller', type: 'Comment', tag: 'False positive', preAssignedAction: 'Allow', contentPreview: 'this is damn incredible work, the tones are...', fullContent: 'this is damn incredible work, the tones are absolutely perfect. How did you get that warm amber in the shadows?', context: 'on "Golden Hour Collection"', flaggedBy: 'Profanity filter', copilotReasoning: 'Positive, enthusiastic comment. "damn" used as expression of admiration. No hostility, no target. Jake has 23 posts, all constructive.', memberContext: '14mo \u00b7 23 posts \u00b7 3 courses' },
  { id: 'j2', author: 'Jake Miller', authorGroup: 'Jake Miller', type: 'Comment', tag: 'False positive', preAssignedAction: 'Allow', contentPreview: 'holy shit, the lighting in this one is perf...', fullContent: 'holy shit, the lighting in this one is perfect. The way you used the reflector is genius. Can you share your BTS setup?', context: 'on "Studio Setup Tutorial"', flaggedBy: 'Profanity filter', copilotReasoning: 'Same pattern \u2014 enthusiastic praise with casual language. Asking technical questions. No hostility.', memberContext: '14mo \u00b7 23 posts \u00b7 3 courses' },
];

/* ─── Decide card data ───────────────────────────────────── */
export interface ModerationDecideCard {
  id: string;
  author: string;
  type: 'Post' | 'Comment' | 'Message';
  tag: 'Self-promo' | 'Harassment' | 'Off-topic';
  fullContent: string;
  context: string;
  flaggedBy: string;
  tradeoff: string;
  tradeoffSource: string;
  actions: { label: string; actionType: string }[];
}

export const decideCards: ModerationDecideCard[] = [
  { id: 'd1', author: 'Derek Hoffman', type: 'Post', tag: 'Self-promo', fullContent: "Hey everyone! My meetup group just launched a free weekend workshop on portrait lighting. Open to all Circle members \u2014 sign up at derekphoto.com/workshop.", context: 'in Photography Basics', flaggedBy: '1 report: "self-promotion"', tradeoff: 'Free workshop, relevant to community, but external link + personal brand. Last 3 posts also mentioned his meetup. Allow = signals self-promo is ok. Remove = punishes contributing.', tradeoffSource: 'Guidelines \u00a7 "Self-promotion" \u2014 no explicit rule against free events', actions: [{ label: 'Allow', actionType: 'allow' }, { label: 'Remove', actionType: 'remove' }] },
  { id: 'd2', author: 'Derek Hoffman', type: 'Post', tag: 'Self-promo', fullContent: "New Lightroom preset pack \u2014 'Urban Grit' $29. Made specifically for street photography. Circle members get 40% off with code CIRCLE40.", context: 'in Street Photography', flaggedBy: '2 reports: "selling", "self-promotion"', tradeoff: 'Paid product promo \u2014 clearer violation. But Circle-exclusive discount shows community investment. Removing both vs. only paid one sends different signals.', tradeoffSource: 'Guidelines \u00a7 "Self-promotion" \u2014 "No selling without admin approval"', actions: [{ label: 'Allow', actionType: 'allow' }, { label: 'Remove', actionType: 'remove' }] },
  { id: 'd3', author: 'Derek Hoffman', type: 'Comment', tag: 'Harassment', fullContent: "That's a really ignorant take. Maybe try actually learning the fundamentals before giving advice that could mess up someone's settings.", context: 'reply to Lena Park in "Beginner Tips"', flaggedBy: '1 report: "hostile comment"', tradeoff: 'Not profanity, not identity attack \u2014 but dismissive. Lena disengaged after this. Remove = tone-policing precedent. Allow = dismissive language tolerated. DM about tone = middle path.', tradeoffSource: 'Guidelines \u00a7 "Be respectful" \u2014 borderline', actions: [{ label: 'Allow', actionType: 'allow' }, { label: 'Remove', actionType: 'remove' }, { label: 'DM Derek', actionType: 'dm' }] },
  { id: 'd4', author: 'Derek Hoffman', type: 'Message', tag: 'Off-topic', fullContent: "Off topic but I'm so frustrated with the platform upload speeds lately. Takes 5 minutes to post a photo. Anyone else having this issue? Circle team needs to fix this ASAP.", context: 'in Landscape Tips', flaggedBy: '1 report: "off-topic"', tradeoff: 'Legitimate frustration, wrong channel. 3 others agreed in replies. Remove = censoring criticism. Allow = off-topic clutter. Reply pointing to Bug Reports = best path.', tradeoffSource: 'No guideline match \u2014 operational feedback', actions: [{ label: 'Allow', actionType: 'allow' }, { label: 'Remove', actionType: 'remove' }, { label: 'Reply in thread', actionType: 'reply' }] },
];

export const derekContext = '8-month member \u00b7 $99/yr \u00b7 31 posts \u00b7 2 courses completed. Runs a local photography meetup. Generally active and helpful, lately pushing boundaries.';

/* ─── Scenario steps ─────────────────────────────────────── */
export const moderationScenario: ModerationStep[] = [
  {
    id: 0,
    messages: [
      { type: 'paragraph', text: '14 moderation items from the weekend, 4 people. 10 are clear-cut, 4 need your judgment.' },
      { type: 'moderation-confirm-list' },
    ],
    pills: [],
    inboxSync: { activeTab: 'moderation', badgeUpdates: { moderation: 14 } },
  },
  {
    id: 1,
    messages: [
      { type: 'paragraph', text: '10 confirmed. Now 4 items from Derek Hoffman that need your judgment.' },
      { type: 'moderation-decide-list' },
    ],
    pills: [],
    inboxSync: { activeTab: 'moderation' },
  },
  {
    id: 2,
    messages: [
      { type: 'paragraph', text: "All 4 items handled. I don't think a member action is needed yet \u2014 Derek is generally a positive contributor. If his self-promotion continues, 'Moderate future posts' would catch new posts before they go live." },
    ],
    pills: [
      { label: 'No action needed', variant: 'recommended', targetStep: 3 },
      { label: 'Flag for future moderation', variant: 'default', targetStep: 3 },
    ],
    inboxSync: {},
  },
  {
    id: 3,
    messages: [
      { type: 'paragraph', text: 'Moderation done:' },
      { type: 'summary-item', text: '5 spam posts removed from Maria Santos' },
      { type: 'summary-item', text: '3 bot items removed, accounts flagged' },
      { type: 'summary-item', text: '2 comments from Jake Miller allowed (false positives)' },
      { type: 'summary-item', text: '4 items from Derek Hoffman resolved' },
      { type: 'paragraph', text: '14 items handled. Moderation queue clear.' },
    ],
    pills: [
      { label: 'Review course comments', variant: 'default', targetStep: -1 },
      { label: 'Done', variant: 'muted', targetStep: -1 },
    ],
    inboxSync: { activeTab: 'moderation', badgeUpdates: { moderation: 0 } },
  },
];
