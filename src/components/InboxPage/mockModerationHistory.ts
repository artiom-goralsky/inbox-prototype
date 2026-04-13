export interface ModerationSummary {
  removedCount: number;
  allowedCount: number;
  firstEventDate: string; // ISO date
}

export interface ModerationHistoryItem {
  id: string;
  type: 'Post' | 'Comment' | 'Message' | 'DM' | 'Connection';
  outcome: 'removed' | 'allowed';
  date: string; // ISO date
  contentSnippet: string;
  decidedBy: string;
  context?: string;
}

export const HISTORY_ITEMS: Record<string, ModerationHistoryItem[]> = {
  cp: [
    { id: 'h1', type: 'Post',    outcome: 'removed', date: '2025-03-10', contentSnippet: 'Check out this growth hack tool — got me 5k followers...', decidedBy: 'Alex' },
    { id: 'h2', type: 'Comment', outcome: 'removed', date: '2025-03-02', contentSnippet: 'DM me for the link, completely free before it expires...', decidedBy: 'You' },
    { id: 'h3', type: 'Message', outcome: 'removed', date: '2025-02-18', contentSnippet: 'Exclusive offer just for community members...', decidedBy: 'workflow' },
    { id: 'h4', type: 'Post',    outcome: 'removed', date: '2025-02-05', contentSnippet: 'You won\'t believe this photographer\'s secret tool...', decidedBy: 'Alex' },
    { id: 'h5', type: 'Post',    outcome: 'removed', date: '2025-01-28', contentSnippet: 'Triple your engagement in 30 days — DM me for the guide...', decidedBy: 'workflow' },
    { id: 'h6', type: 'Comment', outcome: 'removed', date: '2024-12-15', contentSnippet: 'Get 50% off my editing presets — today only...', decidedBy: 'You' },
    { id: 'h7', type: 'Post',    outcome: 'removed', date: '2024-11-22', contentSnippet: 'Secret to viral photography content revealed...', decidedBy: 'Alex' },
    { id: 'h8', type: 'Post',    outcome: 'allowed', date: '2025-01-15', contentSnippet: 'Great point! I wrote about this on my photography blog...', decidedBy: 'You' },
    { id: 'h9', type: 'Comment', outcome: 'allowed', date: '2024-12-20', contentSnippet: 'Thanks for sharing, really helpful for beginners!', decidedBy: 'Alex' },
    { id: 'h10', type: 'Post',   outcome: 'allowed', date: '2024-11-08', contentSnippet: 'Here\'s my take on community growth strategies...', decidedBy: 'workflow' },
  ],
  km: [
    { id: 'h11', type: 'Post',    outcome: 'removed', date: '2025-03-18', contentSnippet: 'Free webinar sign-up — limited spots available...', decidedBy: 'Alex' },
    { id: 'h12', type: 'Post',    outcome: 'removed', date: '2025-03-12', contentSnippet: 'Join my masterclass — early bird pricing ends soon...', decidedBy: 'Alex' },
    { id: 'h13', type: 'Message', outcome: 'removed', date: '2025-02-28', contentSnippet: 'Anyone interested in 1-on-1 coaching sessions?', decidedBy: 'You' },
    { id: 'h14', type: 'DM',      outcome: 'removed', date: '2025-02-15', contentSnippet: 'Exclusive offer just for you — reply to claim...', decidedBy: 'workflow' },
    { id: 'h15', type: 'Comment', outcome: 'allowed', date: '2025-01-22', contentSnippet: 'Great point about design systems, totally agree...', decidedBy: 'You' },
    { id: 'h16', type: 'Post',    outcome: 'allowed', date: '2024-11-15', contentSnippet: 'Here\'s my perspective on freelance design rates...', decidedBy: 'Alex' },
    { id: 'h17', type: 'Comment', outcome: 'allowed', date: '2024-11-08', contentSnippet: 'Thanks for the feedback, really appreciate it!', decidedBy: 'workflow' },
  ],
  'jake-miller': [
    { id: 'h18', type: 'Comment', outcome: 'allowed', date: '2025-02-10', contentSnippet: 'This lighting setup is absolutely insane, love it...', decidedBy: 'workflow' },
    { id: 'h19', type: 'Comment', outcome: 'allowed', date: '2025-01-18', contentSnippet: 'Hell yes, this is the best shot of the month...', decidedBy: 'You' },
    { id: 'h20', type: 'Comment', outcome: 'allowed', date: '2024-12-05', contentSnippet: 'Damn, that bokeh is perfect — what lens did you use?', decidedBy: 'workflow' },
    { id: 'h21', type: 'Comment', outcome: 'allowed', date: '2024-11-20', contentSnippet: 'That\'s badass composition, genuinely stunning work...', decidedBy: 'Alex' },
    { id: 'h22', type: 'Comment', outcome: 'allowed', date: '2024-09-14', contentSnippet: 'Holy crap the colors in this are incredible...', decidedBy: 'workflow' },
  ],
};

export const HISTORY_SUMMARIES: Record<string, ModerationSummary> = {
  cp:              { removedCount: 7,  allowedCount: 3, firstEventDate: '2024-11-08' },
  km:              { removedCount: 4,  allowedCount: 3, firstEventDate: '2024-11-08' },
  'jake-miller':   { removedCount: 0,  allowedCount: 5, firstEventDate: '2024-09-14' },
  'derek-hoffman': { removedCount: 1,  allowedCount: 4, firstEventDate: '2024-08-20' },
  'bot-accounts':  { removedCount: 12, allowedCount: 0, firstEventDate: '2025-01-15' },
  kw:              { removedCount: 2,  allowedCount: 1, firstEventDate: '2024-10-12' },
  re:              { removedCount: 1,  allowedCount: 2, firstEventDate: '2024-12-05' },
  ab:              { removedCount: 3,  allowedCount: 1, firstEventDate: '2025-01-08' },
  ww:              { removedCount: 1,  allowedCount: 1, firstEventDate: '2025-02-14' },
  'maria-santos':  { removedCount: 0,  allowedCount: 0, firstEventDate: '2025-03-16' },
};
