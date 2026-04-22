export type RefinementMock = {
  prompt: string;
  refinedText: string;
};

export interface SuggestedReplyData {
  draftText: string;
  sources: Array<{ title: string; category: string }>;
  reasoning: string;
  refinements?: RefinementMock[];
}

// Keyed by thread/conversation selectedId
export const SUGGESTED_REPLIES: Record<string, SuggestedReplyData> = {
  // DMs
  'dm-3': {
    draftText: "Hi Alex, thanks for reaching out \u2014 and I'm sorry Advanced Lighting hasn't delivered the value you expected. You're right that Marcus's schedule slipped; he's back online and the next three lessons drop this Thursday.\n\nGiven you're a founding member with a great track record, I'd rather make this right than lose you. Two options: a full refund on Advanced Lighting ($49), OR a complimentary 2-month extension on your membership so you don't lose access while the course catches up. Which works for you?",
    sources: [
      { title: 'Refund policy \u2014 founding members', category: 'Circle Knowledge Base' },
      { title: 'Alex Chen \u2014 membership history', category: 'Member context' },
      { title: 'Advanced Lighting \u2014 schedule update', category: 'Course Status' },
    ],
    reasoning: 'Alex is a founding member with no prior complaints. Refund request is valid (Marcus was inactive 3 weeks). Offering extension preserves relationship.',
    refinements: [
      {
        prompt: 'make it shorter',
        refinedText: "Hi Alex \u2014 Marcus was silent 3 weeks, that's on us. Two options: full $49 refund, or a 2-month membership extension since you're a founding member. Which works?",
      },
      {
        prompt: 'more empathetic',
        refinedText: "Hi Alex \u2014 first, thank you for flagging this instead of just walking away. You deserved better from Advanced Lighting, and I'm genuinely sorry Marcus's silence made you feel unseen. You're a founding member who's always shown up for this community, and I want to make this right. Let me offer two options: a full $49 refund, OR a 2-month complimentary extension so you don't lose access while the course catches up. Whichever you prefer \u2014 I'll honor it today.",
      },
    ],
  },
  'dm-5': {
    draftText: "Hey Chen, happy to help! Your Pro membership renews on the 15th at $29/month. If you want to switch to annual, you'd save about $60/year ($239 vs $348). I can make the change whenever you're ready \u2014 just say the word.",
    sources: [
      { title: 'Billing cycles and renewal dates', category: 'Circle Knowledge Base' },
      { title: 'Plan comparison \u2014 Pro monthly vs annual', category: 'Help Center' },
    ],
    reasoning: 'Chen asked about billing renewal date and upgrade options.',
    refinements: [
      {
        prompt: 'make it shorter',
        refinedText: "Hey Chen \u2014 Pro renews on the 15th at $29/mo. Annual is $239 ($60 savings). Switch anytime.",
      },
    ],
  },

  // Chat Threads
  'ct-1': {
    draftText: "Great question, Maya. Try masking the skin separately \u2014 soft radial filter on the face, shifted 200\u2013300K cooler. Then push warmth on the background layer without affecting skin. Rudy demonstrates this in Lesson 5, minute 18.\n\nYour tones look beautiful already \u2014 this will clean up the last bit of oversaturation.",
    sources: [
      { title: 'Lesson 5: Portrait photography \u2014 Color grading', category: 'Photography Masterclass' },
      { title: "Rudy's LUT pack (member exclusive)", category: 'Resources' },
    ],
    reasoning: "Maya is working on golden hour portrait color grading, already competent \u2014 needs a technique tip, not a basics explanation.",
    refinements: [
      {
        prompt: 'make it shorter',
        refinedText: "Try a radial filter on the skin, shifted 200-300K cooler. Lesson 5, min 18 shows it.",
      },
    ],
  },
  'ct-3': {
    draftText: "Welcome Emily! A few things to get you started:\n\n1. Introduce yourself in #introductions \u2014 community is super welcoming\n2. Start with Lesson 1 of Photography Masterclass\n3. Post to #critique-circle when you're ready \u2014 feedback is constructive here\n\nCohort 5 kicks off in 2 weeks so you'll have a dedicated group going through the course together. Any questions, just ping me.",
    sources: [
      { title: 'New member onboarding checklist', category: 'Circle Knowledge Base' },
      { title: 'Cohort 5 \u2014 upcoming schedule', category: 'Community Events' },
    ],
    reasoning: 'Emily is a new member posting in the welcome thread, asking how to get started.',
    refinements: [
      {
        prompt: 'make it shorter',
        refinedText: "Welcome Emily! Start with Lesson 1 of Photography Masterclass, post to #critique-circle when you're ready. Cohort 5 kicks off in 2 weeks.",
      },
    ],
  },

  // Course Comments
  'cc-1': {
    draftText: "Good question, James. Indoor events are tough because you're fighting two things at once: limited light and fast action.\n\nTwo ideas: (1) Open up to f/2.8 or wider if your lens allows \u2014 buys you a stop of ISO room. (2) Don't chase every moment. Pre-focus where action will be (end zones, doorways), shoot in short bursts. 1/500 is fine for most indoor sports if you nail timing instead of panning.\n\nRudy covers pre-focus in Lesson 4, section 2.",
    sources: [
      { title: 'Lesson 4: Action shots \u2014 Pre-focus technique', category: 'Photography Masterclass' },
      { title: 'Low-light sports shooting FAQ', category: 'Circle Knowledge Base' },
    ],
    reasoning: "James is completing Lesson 4, hit a practical problem with indoor motion \u2014 needs applied technique, not theory.",
    refinements: [
      {
        prompt: 'make it shorter',
        refinedText: "Indoor light is the bottleneck. Open to f/2.8, drop to 1/250, pre-focus \u2014 Lesson 4.3 covers it.",
      },
    ],
  },
  'cc-2': {
    draftText: "Great question, Priya. The exercise is about foreground as anchor, not necessarily tack-sharp foreground. Wide-aperture separation works if the foreground shape/color reads clearly \u2014 think silhouette of rocks, blurred grass, a foreground tree edge.\n\nIf you want both foreground and background sharp, focus-stacking is the move (Rudy shows this in Lesson 7.4). But for a single exposure, trust what reads compositionally.",
    sources: [
      { title: 'Lesson 7.4: Focus stacking basics', category: 'Photography Masterclass' },
      { title: 'Lesson 7: Landscape basics \u2014 Foreground interest', category: 'Photography Masterclass' },
    ],
    reasoning: "Priya is on Lesson 7, asking about the foreground exercise \u2014 needs an answer that respects her technical level.",
    refinements: [
      {
        prompt: 'make it shorter',
        refinedText: "Wide-aperture separation works if the foreground reads as an anchor. For both sharp, focus-stack (Lesson 7.4).",
      },
    ],
  },

  // AI Inbox
  'ai-2': {
    draftText: "Hi Maya, Sarah here \u2014 I'm stepping in from the agent. I can see you were trying to reset your password ahead of your cohort session. Quickest fix:\n\n1. Settings \u2192 Account \u2192 Security \u2192 Change password\n2. Verification email should arrive within a minute (check spam)\n3. If you're still stuck in 3 minutes, reply here and I'll manually reset it for you\n\nYou won't miss the session \u2014 we can always catch you up.",
    sources: [
      { title: 'Password reset procedures', category: 'Circle Knowledge Base' },
      { title: 'Agent pause rule: "password"', category: 'Agent Config' },
      { title: 'Maya Rodriguez \u2014 Cohort 3 schedule', category: 'Member context' },
    ],
    reasoning: 'Agent paused on "password" keyword. Maya has a cohort session in 20 minutes \u2014 time-sensitive, needs both the fix and reassurance.',
    refinements: [
      {
        prompt: 'make it shorter',
        refinedText: "Maya \u2014 Settings \u2192 Account \u2192 Security \u2192 Change password. Check spam. If stuck in 3 min, I'll reset manually.",
      },
    ],
  },
  'ai-5': {
    draftText: "Hey Kenji, Sarah taking over from the agent. The API integration question is specific enough that I want to make sure we get you the right answer.\n\nCould you share the exact error response you're getting? For webhook auth, there's actually a separate token in Settings \u2192 Developer \u2192 Webhooks, not the one from your profile. If that doesn't solve it, I'll grab our engineering lead.",
    sources: [
      { title: 'API integration guide', category: 'Circle Knowledge Base' },
      { title: 'Agent escalation \u2014 technical questions', category: 'Agent Config' },
      { title: 'Webhook setup for third-party tools', category: 'Developer Docs' },
    ],
    reasoning: 'Agent paused on technical complexity. Member needs either escalation to engineering or a specific doc.',
    refinements: [
      {
        prompt: 'make it shorter',
        refinedText: "Hey Kenji \u2014 webhook auth uses a separate token (Settings \u2192 Developer \u2192 Webhooks), not the profile API key. Try that first, I'll grab eng if it doesn't fix it.",
      },
    ],
  },
};

export function getSuggestedReply(selectedId: string): SuggestedReplyData | null {
  return SUGGESTED_REPLIES[selectedId] ?? null;
}

export function getRefinementResponse(conversationId: string, prompt: string): string {
  const suggested = SUGGESTED_REPLIES[conversationId];
  if (!suggested?.refinements) return getFallbackRefinement(prompt);

  const normalized = prompt.trim().toLowerCase();
  const match = suggested.refinements.find(r =>
    r.prompt.toLowerCase() === normalized ||
    normalized.includes(r.prompt.toLowerCase())
  );

  return match?.refinedText ?? getFallbackRefinement(prompt);
}

function getFallbackRefinement(prompt: string): string {
  return `(Mock refinement \u2014 no pre-scripted response for "${prompt}". In production, the AI would regenerate the draft based on this prompt.)`;
}
