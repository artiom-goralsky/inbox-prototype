/** Skill definitions for slash command picker */

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

export const SKILLS: Skill[] = [
  // Set up
  { id: 'spaces', name: 'Create spaces', description: 'Creates your initial community structure based on your type and audience', icon: 'layout-grid', category: 'Set up' },
  { id: 'access-groups', name: 'Access groups', description: 'Controls which members see which spaces with access groups', icon: 'lock', category: 'Set up' },
  { id: 'domain-branding', name: 'Domain & branding', description: 'Configures your custom domain and brand identity', icon: 'globe', category: 'Set up' },
  { id: 'landing-page', name: 'Landing page', description: 'Sets up navigation and landing pages for your community', icon: 'window', category: 'Set up' },
  { id: 'restructure', name: 'Restructure community', description: 'Audits and reorganizes your existing community structure', icon: 'arrow-rotate', category: 'Set up' },

  // Members
  { id: 'invite-onboard', name: 'Invite & onboard', description: 'Invites and onboards your first members with a great first experience', icon: 'people-add', category: 'Members' },
  { id: 'tag-segment', name: 'Tag & segment', description: 'Tags and segments members for targeting and personalization', icon: 'tag', category: 'Members' },
  { id: 'manage-roles', name: 'Manage roles', description: 'Manages roles, moderators, and permissions', icon: 'people', category: 'Members' },

  // Content
  { id: 'create-post', name: 'Create post', description: 'Creates and publishes posts to your community', icon: 'edit', category: 'Content' },
  { id: 'build-course', name: 'Build course', description: 'Builds a course with lessons and modules', icon: 'graduate-cap', category: 'Content' },
  { id: 'schedule-events', name: 'Schedule events', description: 'Schedules events and livestreams for your community', icon: 'calendar', category: 'Content' },
  { id: 'content-calendar', name: 'Content calendar', description: 'Plans a content calendar for sustained engagement', icon: 'calendar-clock', category: 'Content' },

  // Monetize
  { id: 'setup-paywall', name: 'Setup paywall', description: 'Sets up your paywall and pricing tiers', icon: 'money-hand', category: 'Monetize' },
  { id: 'pricing-strategy', name: 'Pricing strategy', description: 'Helps figure out the right pricing strategy for your offering', icon: 'chart-square', category: 'Monetize' },
  { id: 'connect-stripe', name: 'Connect Stripe', description: 'Connects Stripe and configures payment processing', icon: 'credit-card', category: 'Monetize' },

  // Grow
  { id: 'engagement-metrics', name: 'Engagement metrics', description: 'Reviews engagement metrics and identifies what is working', icon: 'chart-square', category: 'Grow' },
  { id: 'gamification', name: 'Gamification', description: 'Sets up gamification to boost community participation', icon: 'star', category: 'Grow' },
  { id: 'growth-strategy', name: 'Growth strategy', description: 'Builds a growth strategy for your community', icon: 'target', category: 'Grow' },

  // Strategize
  { id: 'business-model', name: 'Business model', description: 'Helps build the right business model for your community', icon: 'compass', category: 'Strategize' },
  { id: 'workflows', name: 'Workflows & automations', description: 'Sets up automated workflows and email sequences', icon: 'zap', category: 'Strategize' },
  { id: 'community-audit', name: 'Community audit', description: 'Runs a community health audit with actionable recommendations', icon: 'checkmark-circle', category: 'Strategize' },
];

/** Filter skills by search query (matches name or category) */
export function filterSkills(query: string): Skill[] {
  const lower = query.toLowerCase();
  return SKILLS.filter(
    s => s.name.toLowerCase().includes(lower) || s.category.toLowerCase().includes(lower)
  );
}
