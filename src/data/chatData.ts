export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatItem {
  id: string;
  date: string;
  title: string;
  description: string;
  messages: ChatMessage[];
}

export const CHAT_DATA: ChatItem[] = [
  {
    id: '0',
    date: 'Today',
    title: 'Copilot conversation improvements',
    description: 'Explored ways to improve Copilot response quality, conversation flow, and context retention across multi-turn interactions.',
    messages: [
      { role: 'user', content: 'What are some ways we could improve the Copilot conversation experience?' },
      {
        role: 'assistant',
        content: "A few high-impact areas to focus on:\n\n**Context retention**: Right now each conversation resets fully. Persisting key facts across sessions — member names, recurring topics, past decisions — would make follow-ups feel much more natural.\n\n**Proactive suggestions**: Instead of waiting to be asked, Copilot could surface relevant actions at the right moment. For example, flagging at-risk members before the user asks, or suggesting a campaign when engagement drops.\n\n**Response formatting**: Shorter, scannable responses for quick questions; detailed breakdowns only when complexity warrants it. The current default leans too long for simple queries.\n\n**Tone calibration**: Letting users set a preferred communication style (direct, conversational, detailed) that persists across sessions.\n\nWant me to prioritize these and draft a quick implementation plan?",
      },
    ],
  },
  {
    id: '1',
    date: 'Today',
    title: 'Weekly new member onboarding report',
    description: 'Reviewed onboarding completion rates and identified drop-off at the goals survey. Drafted a shorter variant showing 15% better completion.',
    messages: [
      { role: 'user', content: "What's the onboarding status for this week's new members?" },
      {
        role: 'assistant',
        content: "This week you had 12 new signups. 8 have completed onboarding (67% completion rate), and 3 have already posted introductions in the Welcome space.\n\nThe main drop-off is still at the goals survey step — 4 members stalled there. I've been running a shorter 3-question variant for the last batch and it's showing 15% better completion. Want me to switch all new members to the shorter version?",
      },
    ],
  },
  {
    id: '2',
    date: 'Yesterday',
    title: 'Members at risk of churning',
    description: 'Flagged 14 members inactive for 21+ days. Built a 3-email re-engagement sequence with personalized subject lines per segment.',
    messages: [
      { role: 'user', content: 'Which members are at risk of churning right now?' },
      {
        role: 'assistant',
        content: "I flagged 14 members as at-risk based on inactivity signals from the last 21 days. Here's how they break down:\n\nHigh risk (6 members): Haven't logged in for 28+ days. These are members who were active in their first week but went quiet after completing onboarding. Three of them opened your last broadcast but didn't click through.\n\nMedium risk (8 members): Login activity is down 70%+ from their first-month baseline. Most are from the January cohort — they joined during the sale and may have had lower intent than organic signups.\n\nI've drafted a 3-step re-engagement sequence for each segment with personalized subject lines based on their interest tags. The high-risk version leads with a direct check-in from you; the medium-risk version re-introduces the community with a \"best of\" digest.\n\nWant me to send these or review them first?",
      },
    ],
  },
  {
    id: '3',
    date: 'Mar 17',
    title: 'Re-engagement campaign for January',
    description: 'Drafted a 5-email sequence for lapsed members. First send hit a 47% open rate — above average for this segment.',
    messages: [
      { role: 'user', content: 'Can you help me put together a re-engagement campaign for the January dropoffs?' },
      {
        role: 'assistant',
        content: "I drafted a 5-email sequence targeting 31 members who joined in January but haven't been active in 30+ days.\n\nEmail 1 (Day 0): Personal check-in from you — conversational, no sales pressure.\nEmail 2 (Day 3): Highlights what's new since they joined.\nEmail 3 (Day 7): Curated content from their interest areas based on profile tags.\nEmail 4 (Day 12): A specific invitation — either an upcoming event or a relevant space.\nEmail 5 (Day 18): Final nudge with a clear CTA to explore one specific resource.\n\nFirst send is scheduled for tomorrow at 9 AM. Open rates for this segment usually land around 38–42% based on past campaigns. Want to review the copy first or go straight to send?",
      },
      { role: 'user', content: 'Looks good, go ahead and send.' },
      {
        role: 'assistant',
        content: "Sequence is live. First email sent to 31 members at 9:04 AM.\n\nI'll report back with open rates in 24 hours — and flag anyone who replies so you can respond personally.",
      },
    ],
  },
  {
    id: '4',
    date: 'Mar 15',
    title: 'Event follow-up action plan',
    description: 'Built post-event sequences for UX Mastery Bootcamp attendees and no-shows, including replay access and a feedback survey.',
    messages: [
      { role: 'user', content: 'UX Mastery Bootcamp just wrapped. What should I do for follow-up?' },
      {
        role: 'assistant',
        content: "Here's what I'd recommend in the next 48 hours:\n\nAttendees (28 showed up): Send a replay link and a feedback survey within 24 hours. Survey should be short — 3 questions max.\n\nNo-shows (6 members): Softer follow-up with just the replay link. No survey pressure. I'd lead with \"You missed it, but the recording is here\" — low friction, high value.\n\nHigh-engagement attendees: I flagged 9 members who asked questions or stayed through the Q&A. A short personal DM from you acknowledging their participation often converts to stronger retention.\n\nWant me to queue all three and schedule them?",
      },
      { role: 'user', content: 'Yes, queue them up.' },
      {
        role: 'assistant',
        content: "Done. All three sequences are queued:\n\n• Attendees: replay + survey going out tonight at 6 PM\n• No-shows: replay link tomorrow morning at 9 AM\n• High-engagement 9: DM drafts are in your queue for review before sending — they're personalized with a line about the specific question or moment each person contributed\n\nI'll surface the survey responses once they start coming in.",
      },
    ],
  },
  {
    id: '5',
    date: 'Mar 12',
    title: 'Revenue snapshot — Q1 overview',
    description: 'Pulled MRR, churn rate, and trial conversion data. Identified 3 at-risk accounts and drafted targeted upgrade offers.',
    messages: [
      { role: 'user', content: 'Give me a revenue snapshot for Q1.' },
      {
        role: 'assistant',
        content: "Here's where you stand through end of March:\n\nMRR: $14,840 — up 18% from Q4. The growth is driven mostly by annual plan conversions (7 this quarter vs. 3 in Q4) and a meaningful reduction in monthly churn.\n\nChurn rate: 3.2% monthly, down from 4.8% in January. The onboarding improvements from February are showing up here — members who completed the new flow are churning at 1.4%, vs. 6.1% for those who didn't.\n\nTrial conversions: 41% of trials started in March converted to paid. Best month since launch. The biggest driver was the free intro session offered during onboarding — members who took it converted at 63%.\n\nAt risk: 3 annual subscribers are up for renewal in the next 30 days. Two haven't logged in recently. I'd recommend personal outreach before the renewal date hits.\n\nOne thing worth watching: \"Advanced Branding\" drove $3,200 in Q1 revenue — 22% of your total. If that course ends without a follow-up offer, you'll likely see a revenue dip in Q2. Want me to model a Q2 forecast?",
      },
      { role: 'user', content: 'Yes, model the Q2 forecast. Also draft outreach for those 3 at-risk renewals.' },
      {
        role: 'assistant',
        content: "Q2 forecast: Based on your current 3.2% monthly churn and a conservative 8% MRR growth rate, you're on track for $17,200–$18,400 MRR by end of June. If churn stays flat and you land 2 more annual conversions, you could hit $19,000.\n\nAt-risk renewal outreach is drafted and in your queue. I personalized each one based on their activity history — the two inactive members get a softer, value-focused message; the active one gets an upgrade nudge.\n\nReady to send whenever you are.",
      },
    ],
  },
  {
    id: '6',
    date: 'Mar 8',
    title: 'Space structure and navigation setup',
    description: 'Reorganized 7 spaces into 3 categories, updated sidebar navigation order, and pinned 2 high-traffic spaces to the top.',
    messages: [
      { role: 'user', content: 'I want to clean up the space structure. It feels cluttered.' },
      {
        role: 'assistant',
        content: "Your current setup has 11 spaces across 4 categories, but 4 of those spaces have fewer than 3 posts in the last 60 days.\n\nHere's what I'd suggest:\n\nConsolidate: Merge \"Resources\" and \"Templates\" into a single \"Resource Library\" space. Same for \"Announcements\" and \"Updates\" — one space, two content types.\n\nArchive: \"Feedback (old)\" and \"Beta Testing\" haven't had new posts since November. I can archive those — content stays accessible but they get out of the sidebar.\n\nReorder: Your highest-traffic spaces (General Discussion, Weekly Check-ins, Resource Library) should be at the top of the sidebar. Right now they're scattered mid-list.\n\nThis gets you from 11 spaces to 7, with a cleaner structure. Want me to make these changes or show you a preview first?",
      },
      { role: 'user', content: 'Make the changes.' },
      {
        role: 'assistant',
        content: "Done. Spaces consolidated and archived. Navigation reordered with General Discussion, Weekly Check-ins, and Resource Library at the top. Your sidebar is now 7 spaces across 3 categories.\n\nOne thing I noticed while making the changes: the \"Getting Started\" space has a pinned welcome post from March last year. It still references your old onboarding flow. Worth refreshing that soon.",
      },
    ],
  },
  {
    id: '10',
    date: 'Today',
    title: 'New conversation',
    description: '',
    messages: [
      {
        role: 'assistant',
        content: "Hey! I'm Circle AI. I have full visibility into your community — member activity, onboarding, content, and revenue. What would you like to work on?",
      },
    ],
  },
];
