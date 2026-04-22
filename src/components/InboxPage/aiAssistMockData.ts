export type ReferenceCategory = 'dm' | 'chatThread' | 'courseComment' | 'aiInbox';

export type ReferenceContext = {
  messageId: string;
  authorName: string;
  snippet: string;
  category: ReferenceCategory;
};

export type AiAssistArtifact = {
  id: string;
  type: 'draft' | 'summary' | 'context' | 'takeover-draft' | 'pause-explanation';
  title: string;
  body: string;
  sources?: Array<{ title: string; category: string }>;
  hasAddToComposer: boolean;
};

export type AssistInteraction = {
  id: string;
  reference: ReferenceContext;
  artifact: AiAssistArtifact;
  followUp?: {
    prompt: string;
    artifact: AiAssistArtifact;
  };
};

export const ASSIST_INTERACTIONS: AssistInteraction[] = [
  // DM 1 — Alex Chen refund
  {
    id: 'assist-dm-1',
    reference: { messageId: 'msg-dm-alex-001', authorName: 'Alex Chen', snippet: "Hey Sarah, quick question about the refund policy for Advanced Lighting", category: 'dm' },
    artifact: {
      id: 'art-dm-1-draft',
      type: 'draft',
      title: 'Draft reply',
      body: "Hi Alex, absolutely \u2014 you're within the refund window for Advanced Lighting. I can process a full $49 refund right now, or if you'd prefer to keep access, I can offer a 2-month membership extension to make up for the delayed content. Which works better?",
      sources: [
        { title: 'Refund policy \u2014 Advanced Lighting', category: 'Circle Knowledge Base' },
        { title: 'Alex Chen \u2014 membership history', category: 'Member context' },
      ],
      hasAddToComposer: true,
    },
    followUp: {
      prompt: 'make it shorter',
      artifact: {
        id: 'art-dm-1-shorter',
        type: 'draft',
        title: 'Draft reply (shorter)',
        body: "Hi Alex \u2014 happy to refund the $49 right now, or offer a 2-month extension instead. Which works?",
        sources: [{ title: 'Refund policy \u2014 Advanced Lighting', category: 'Circle Knowledge Base' }],
        hasAddToComposer: true,
      },
    },
  },

  // DM 2 — Amy Torres portrait series
  {
    id: 'assist-dm-2',
    reference: { messageId: 'msg-dm-amy-001', authorName: 'Amy Torres', snippet: "Sarah, could you take a look at my portrait series?", category: 'dm' },
    artifact: {
      id: 'art-dm-2-draft',
      type: 'draft',
      title: 'Draft reply',
      body: "Hi Amy, absolutely \u2014 send them over whenever they're ready. For portrait critique I'll focus on light direction, skin rendering, and subject expression. If you want to post to #critique-circle instead, you'll get the whole community's eyes on it (happy to chime in there too).",
      sources: [
        { title: 'Portrait critique framework', category: 'Circle Knowledge Base' },
        { title: '#critique-circle \u2014 posting guidelines', category: 'Community Docs' },
      ],
      hasAddToComposer: true,
    },
  },

  // Chat Thread 1 — Kenji Tanaka gear marketplace
  {
    id: 'assist-ct-1',
    reference: { messageId: 'ct-2-r1', authorName: 'Kenji Tanaka', snippet: "Selling my 50mm f/1.4 \u2014 priced below market, DM me", category: 'chatThread' },
    artifact: {
      id: 'art-ct-1-draft',
      type: 'draft',
      title: 'Draft reply',
      body: "Thanks for the heads up, Kenji. Quick reminder to include the serial number and proof of ownership when you finalize the sale \u2014 keeps everyone safe. And post the final price in the thread for transparency so other members know the market rate.",
      sources: [
        { title: '#gear-marketplace guidelines', category: 'Community Docs' },
        { title: 'Member-to-member sale best practices', category: 'Circle Knowledge Base' },
      ],
      hasAddToComposer: true,
    },
  },

  // Chat Thread 2 — Maya Rodriguez dark mode request
  {
    id: 'assist-ct-2',
    reference: { messageId: 'ct-1-r1', authorName: 'Maya Rodriguez', snippet: "Can we add dark mode to the critique viewer? Would help at night.", category: 'chatThread' },
    artifact: {
      id: 'art-ct-2-draft',
      type: 'draft',
      title: 'Draft reply',
      body: "Good call, Maya. Dark mode for the critique viewer is on our product roadmap for next quarter \u2014 I've added your request to the tracker. In the meantime, browser-level dark mode works for most of the app if you want a workaround.",
      sources: [
        { title: 'Product roadmap \u2014 Q3 2026', category: 'Product Docs' },
        { title: 'Browser dark mode workarounds', category: 'Help Center' },
      ],
      hasAddToComposer: true,
    },
    followUp: {
      prompt: 'make it shorter',
      artifact: {
        id: 'art-ct-2-shorter',
        type: 'draft',
        title: 'Draft reply (shorter)',
        body: "Good call \u2014 it's on the Q3 roadmap. Added your request. Browser dark mode works as a temp fix.",
        sources: [{ title: 'Product roadmap \u2014 Q3 2026', category: 'Product Docs' }],
        hasAddToComposer: true,
      },
    },
  },

  // Course Comment 1 — James Liu action shots
  {
    id: 'assist-cc-1',
    reference: { messageId: 'cc-comment-1', authorName: 'James Liu', snippet: "Shutter 1/500, ISO blown out, what am I missing?", category: 'courseComment' },
    artifact: {
      id: 'art-cc-1-draft',
      type: 'draft',
      title: 'Draft reply',
      body: "James, you're shooting indoor so light is the bottleneck. Try: (1) open up to f/2.8 or wider, (2) drop shutter to 1/250 and pre-focus rather than chase action, (3) embrace a bit of motion blur if the moment is right \u2014 Rudy talks about this in Lesson 4.3. Indoor sports at 1/500 demands ISO 6400+, which is where most sensors fall apart.",
      sources: [
        { title: 'Lesson 4.3: Action shots \u2014 Light constraints', category: 'Photography Masterclass' },
        { title: 'Indoor low-light shooting FAQ', category: 'Circle Knowledge Base' },
      ],
      hasAddToComposer: true,
    },
    followUp: {
      prompt: 'make it shorter',
      artifact: {
        id: 'art-cc-1-shorter',
        type: 'draft',
        title: 'Draft reply (shorter)',
        body: "Indoor light is the bottleneck. Open up to f/2.8, drop to 1/250, pre-focus. Rudy covers this in Lesson 4.3.",
        sources: [{ title: 'Lesson 4.3: Action shots \u2014 Light constraints', category: 'Photography Masterclass' }],
        hasAddToComposer: true,
      },
    },
  },

  // Course Comment 2 — Priya Sharma foreground
  {
    id: 'assist-cc-2',
    reference: { messageId: 'cc-comment-2', authorName: 'Priya Sharma', snippet: "Does the foreground need to be in focus too, or does wide aperture separation count?", category: 'courseComment' },
    artifact: {
      id: 'art-cc-2-draft',
      type: 'draft',
      title: 'Draft reply',
      body: "Priya, wide-aperture separation is fine as long as the foreground reads as an anchor \u2014 silhouettes, blurred grass, tree edges all work. If you want both sharp, focus-stacking is the move (Lesson 7.4). For a single exposure, trust what reads compositionally.",
      sources: [
        { title: 'Lesson 7.4: Focus stacking basics', category: 'Photography Masterclass' },
        { title: 'Lesson 7: Landscape basics', category: 'Photography Masterclass' },
      ],
      hasAddToComposer: true,
    },
  },

  // AI Inbox 1 — Maya Rodriguez password reset takeover
  {
    id: 'assist-ai-1',
    reference: { messageId: 'ai-msg-maya-001', authorName: 'Maya Rodriguez', snippet: "I've tried the password reset three times and I'm still locked out", category: 'aiInbox' },
    artifact: {
      id: 'art-ai-1-takeover',
      type: 'takeover-draft',
      title: 'Draft reply',
      body: "Maya, Sarah taking over \u2014 sorry for the back and forth. I've just manually reset your password on our end; you should have a temporary login in your email right now (subject line: \"Temporary access \u2014 Photography Masterclass\"). Use it, then set a new password in Settings \u2192 Security. Let me know the moment you're in and I'll confirm your cohort session access.",
      sources: [
        { title: 'Emergency password reset procedure', category: 'Circle Knowledge Base' },
        { title: 'Maya Rodriguez \u2014 cohort schedule', category: 'Member context' },
        { title: 'Agent pause rule: repeated failures', category: 'Agent Config' },
      ],
      hasAddToComposer: true,
    },
    followUp: {
      prompt: 'make it shorter',
      artifact: {
        id: 'art-ai-1-shorter',
        type: 'takeover-draft',
        title: 'Draft reply (shorter)',
        body: "Maya \u2014 I manually reset your password. Check your email for temporary login, then update in Settings \u2192 Security. Reply when you're in.",
        sources: [{ title: 'Emergency password reset procedure', category: 'Circle Knowledge Base' }],
        hasAddToComposer: true,
      },
    },
  },

  // AI Inbox 2 — Derek Hoffman frustration escalation
  {
    id: 'assist-ai-2',
    reference: { messageId: 'ai-msg-derek-001', authorName: 'Derek Hoffman', snippet: "This is getting frustrating, I've explained this three times", category: 'aiInbox' },
    artifact: {
      id: 'art-ai-2-takeover',
      type: 'takeover-draft',
      title: 'Draft reply',
      body: "Derek, Sarah here \u2014 jumping in personally. I can see you've been going back and forth and that's not OK. Can you give me the short version: what's the actual issue you're trying to resolve? I'll make sure we sort it today, no more loops.",
      sources: [
        { title: 'Escalation handling \u2014 member frustration', category: 'Agent Config' },
        { title: 'Derek Hoffman \u2014 recent activity', category: 'Member context' },
      ],
      hasAddToComposer: true,
    },
  },
];

export function getInteractionByMessageId(messageId: string, category?: ReferenceCategory): AssistInteraction | undefined {
  // Try exact messageId match first
  const exact = ASSIST_INTERACTIONS.find(i => i.reference.messageId === messageId);
  if (exact) return exact;
  // Fallback: first interaction for this category (demo always returns a draft)
  if (category) return ASSIST_INTERACTIONS.find(i => i.reference.category === category);
  // Last resort: first interaction
  return ASSIST_INTERACTIONS[0];
}
