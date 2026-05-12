/* ── Admin Navigation Data (Shopify-style) ───────────────────────────── */

export interface AdminNavChildV5 {
  id: string;
  label: string;
}

export interface AdminNavItemV5 {
  id: string;
  label: string;
  iconName: string;
  activeIconName: string;
  badge?: number;
  /** The activeId to set when this L1 is clicked (landing page) */
  landingId?: string;
  children?: AdminNavChildV5[];
}

export interface AdminNavZoneV5 {
  zone: 'core' | 'workspaces';
  items: AdminNavItemV5[];
}

export const adminNavDataV5: AdminNavZoneV5[] = [
  {
    zone: 'core',
    items: [
      {
        id: 'dashboard',
        label: 'Circle AI',
        iconName: 'sparkles',
        activeIconName: 'sparkles-filled',
      },
      {
        id: 'v5-new-chat',
        label: 'New chat',
        iconName: 'circle-plus',
        activeIconName: 'circle-plus-filled',
      },
      {
        id: 'v5-inbox',
        label: 'Inbox',
        iconName: 'inbox-empty',
        activeIconName: 'inbox-empty-filled',
      },
      {
        id: 'v5-agents-management',
        label: 'Agents',
        iconName: 'sparkle-box',
        activeIconName: 'sparkle-box-filled',
      },
      {
        id: 'v5-agents-page',
        label: 'Skills',
        iconName: 'ai-box',
        activeIconName: 'ai-box-filled',
      },
      {
        id: 'v5-projects',
        label: 'Projects',
        iconName: 'folder',
        activeIconName: 'folder-filled',
      },
      {
        id: 'v5-library',
        label: 'Library',
        iconName: 'layers',
        activeIconName: 'layers-filled',
      },
    ],
  },
  {
    zone: 'workspaces',
    items: [
      {
        id: 'v5-ai-team',
        label: 'AI & Workflows',
        iconName: 'zap',
        activeIconName: 'zap-filled',
        landingId: 'all-agents',
        children: [
          { id: 'all-agents', label: 'Agents' },
          { id: 'knowledge', label: 'Knowledge' },
          { id: 'all-workflows', label: 'Workflows' },
          { id: 'v5-workflows-history', label: 'History' },
        ],
      },
      {
        id: 'v5-audience',
        label: 'Audience',
        iconName: 'group',
        activeIconName: 'group-filled',
        landingId: 'manage-audience',
        children: [
          { id: 'manage-audience', label: 'Audience' },
          { id: 'segments', label: 'Segments' },
          { id: 'invite-links', label: 'Invite links' },
        ],
      },
      {
        id: 'v5-marketing',
        label: 'Marketing',
        iconName: 'paper-plane',
        activeIconName: 'paper-plane-filled',
        landingId: 'marketing-overview',
        children: [
          { id: 'marketing-overview', label: 'Overview' },
          { id: 'broadcasts', label: 'Broadcasts' },
          { id: 'forms', label: 'Forms' },
        ],
      },
      {
        id: 'v5-spaces',
        label: 'Community',
        iconName: 'contacts',
        activeIconName: 'contacts',
        landingId: 'spaces',
        children: [
          { id: 'spaces', label: 'Spaces' },
          { id: 'posts', label: 'Posts' },
          { id: 'topics', label: 'Topics' },
        ],
      },
      {
        id: 'v5-manage-agents',
        label: 'Agents',
        iconName: 'sparkle',
        activeIconName: 'sparkle',
        landingId: 'all-agents',
        children: [{ id: 'knowledge', label: 'Knowledge' }],
      },
      {
        id: 'v5-events',
        label: 'Events',
        iconName: 'calendar',
        activeIconName: 'calendar',
        landingId: 'v5-events-overview',
        children: [{ id: 'events', label: 'All events' }],
      },
      {
        id: 'v5-courses',
        label: 'Courses',
        iconName: 'book',
        activeIconName: 'book-filled',
        landingId: 'v5-courses-overview',
        children: [
          { id: 'courses-list', label: 'All courses' },
          { id: 'lessons', label: 'Lessons' },
        ],
      },
      {
        id: 'v5-media',
        label: 'Media',
        iconName: 'play-circle',
        activeIconName: 'play-circle',
        landingId: 'media-manager',
        children: [{ id: 'v5-live', label: 'Live' }],
      },
      {
        id: 'v5-paywalls',
        label: 'Paywalls',
        iconName: 'money-hand',
        activeIconName: 'money-hand-filled',
        landingId: 'paywalls-list',
        children: [
          { id: 'paywalls-list', label: 'Paywalls' },
          { id: 'coupons', label: 'Coupons' },
          { id: 'subscription-groups', label: 'Subscriptions' },
          { id: 'transactions', label: 'Transactions' },
          { id: 'affiliates-list', label: 'Affiliates' },
        ],
      },
      {
        id: 'v5-workflows',
        label: 'Workflows',
        iconName: 'zap',
        activeIconName: 'zap-filled',
        landingId: 'all-workflows',
        children: [{ id: 'v5-workflows-history', label: 'History' }],
      },
      {
        id: 'v5-website',
        label: 'Website',
        iconName: 'window',
        activeIconName: 'window-filled',
        landingId: 'v5-website-overview',
        children: [{ id: 'v5-menus', label: 'Menus' }],
      },
      {
        id: 'v5-branded-app',
        label: 'Branded App',
        iconName: 'devices',
        activeIconName: 'devices',
      },
      {
        id: 'v5-analytics',
        label: 'Analytics',
        iconName: 'chart-square',
        activeIconName: 'chart-square-filled',
        landingId: 'analytics-overview',
        children: [
          { id: 'analytics-overview', label: 'Overview' },
          { id: 'analytics-reports', label: 'Reports' },
          { id: 'analytics-insights', label: 'Insights' },
        ],
      },
    ],
  },
];

/* ── V4 Admin Navigation Data (V4-specific renames & new items) ────── */

export const adminNavDataV4: AdminNavZoneV5[] = [
  {
    zone: 'core',
    items: [
      {
        id: 'dashboard',
        label: 'Home',
        iconName: 'sparkle',
        activeIconName: 'sparkle-filled',
      },
      {
        id: 'v5-inbox',
        label: 'Inbox',
        iconName: 'inbox-empty',
        activeIconName: 'inbox-empty-filled',
      },
      {
        id: 'v5-ai-team',
        label: 'Copilots',
        iconName: 'sparkle',
        activeIconName: 'sparkle-filled',
        landingId: 'all-agents',
        children: [{ id: 'knowledge', label: 'Knowledge' }],
      },
    ],
  },
  {
    zone: 'workspaces',
    items: [
      {
        id: 'v5-audience',
        label: 'Audience',
        iconName: 'people-circle',
        activeIconName: 'people-circle-filled',
        landingId: 'manage-audience',
        children: [
          { id: 'segments', label: 'Segments' },
          { id: 'invite-links', label: 'Invite links' },
        ],
      },
      {
        id: 'v5-marketing',
        label: 'Marketing',
        iconName: 'paper-plane',
        activeIconName: 'paper-plane-filled',
        landingId: 'marketing-overview',
        children: [
          { id: 'broadcasts', label: 'Broadcasts' },
          { id: 'forms', label: 'Forms' },
        ],
      },
      {
        id: 'v5-spaces',
        label: 'Community',
        iconName: 'contacts',
        activeIconName: 'contacts',
        landingId: 'spaces',
        children: [
          { id: 'posts', label: 'Posts' },
          { id: 'topics', label: 'Topics' },
        ],
      },
      {
        id: 'v5-events',
        label: 'Events',
        iconName: 'calendar',
        activeIconName: 'calendar',
        landingId: 'v5-events-overview',
        children: [{ id: 'events', label: 'All events' }],
      },
      {
        id: 'v5-courses',
        label: 'Courses',
        iconName: 'book',
        activeIconName: 'book-filled',
        landingId: 'v5-courses-overview',
        children: [
          { id: 'courses-list', label: 'All courses' },
          { id: 'lessons', label: 'Lessons' },
        ],
      },
      {
        id: 'v5-media',
        label: 'Videos',
        iconName: 'play-circle',
        activeIconName: 'play-circle',
        landingId: 'media-manager',
        children: [{ id: 'v5-live', label: 'Live' }],
      },
      {
        id: 'v5-paywalls',
        label: 'Paywalls',
        iconName: 'money-hand',
        activeIconName: 'money-hand-filled',
        landingId: 'paywalls-list',
        children: [
          { id: 'transactions', label: 'Transactions' },
          { id: 'subscription-groups', label: 'Subscriptions' },
        ],
      },
      {
        id: 'v5-ai-workflows',
        label: 'AI & Workflows',
        iconName: 'zap',
        activeIconName: 'zap-filled',
        landingId: 'all-workflows',
        children: [{ id: 'v5-workflows-history', label: 'History' }],
      },
      {
        id: 'v5-website',
        label: 'Site',
        iconName: 'window',
        activeIconName: 'window-filled',
        landingId: 'v5-website-overview',
        children: [{ id: 'v5-menus', label: 'Navigation' }],
      },
      {
        id: 'v5-branded-app',
        label: 'Branded apps',
        iconName: 'devices',
        activeIconName: 'devices',
        children: [{ id: 'push-notifications', label: 'Push notifications' }],
      },
      {
        id: 'v5-analytics',
        label: 'Analytics',
        iconName: 'chart-square',
        activeIconName: 'chart-square-filled',
      },
      {
        id: 'v5-developers',
        label: 'Developers',
        iconName: 'code-brackets',
        activeIconName: 'code-brackets',
      },
      {
        id: 'v5-plans',
        label: 'Plans',
        iconName: 'receipt',
        activeIconName: 'receipt',
      },
    ],
  },
];

/* ── Flat Navigation Data ─────────────────────────────────────────── */

export interface FlatNavSectionV5 {
  heading?: string;
  zone: 'core' | 'workspace';
  items: {
    id: string;
    label: string;
    iconName: string;
    activeIconName: string;
    badge?: number;
  }[];
}

export const flatNavDataV5: FlatNavSectionV5[] = [
  // ── Core standalone items (no heading) ──
  {
    zone: 'core',
    items: [
      {
        id: 'dashboard',
        label: 'Home',
        iconName: 'sparkle',
        activeIconName: 'sparkle-filled',
      },
      {
        id: 'v5-inbox',
        label: 'Inbox',
        iconName: 'inbox-empty',
        activeIconName: 'inbox-empty-filled',
      },
    ],
  },
  // ── AI Team ──
  {
    heading: 'AI Team',
    zone: 'core',
    items: [
      {
        id: 'all-agents',
        label: 'Agents',
        iconName: 'sparkle',
        activeIconName: 'sparkle-filled',
      },
      {
        id: 'knowledge',
        label: 'Knowledge',
        iconName: 'book',
        activeIconName: 'book-filled',
      },
    ],
  },
  // ── Audience ──
  {
    heading: 'Audience',
    zone: 'workspace',
    items: [
      {
        id: 'manage-audience',
        label: 'Members',
        iconName: 'people-circle',
        activeIconName: 'people-circle-filled',
      },
      {
        id: 'segments',
        label: 'Segments',
        iconName: 'filter',
        activeIconName: 'filter',
      },
      {
        id: 'invite-links',
        label: 'Invite links',
        iconName: 'chain-link',
        activeIconName: 'chain-link',
      },
    ],
  },
  // ── Marketing ──
  {
    heading: 'Marketing',
    zone: 'workspace',
    items: [
      {
        id: 'marketing-overview',
        label: 'Overview',
        iconName: 'paper-plane',
        activeIconName: 'paper-plane-filled',
      },
      {
        id: 'broadcasts',
        label: 'Broadcasts',
        iconName: 'megaphone',
        activeIconName: 'megaphone',
      },
      {
        id: 'forms',
        label: 'Forms',
        iconName: 'checklist',
        activeIconName: 'checklist',
      },
    ],
  },
  // ── Spaces ──
  {
    heading: 'Spaces',
    zone: 'workspace',
    items: [
      {
        id: 'spaces',
        label: 'All spaces',
        iconName: 'group',
        activeIconName: 'group',
      },
      { id: 'posts', label: 'Posts', iconName: 'page', activeIconName: 'page' },
      {
        id: 'topics',
        label: 'Topics',
        iconName: 'hashtag',
        activeIconName: 'hashtag',
      },
    ],
  },
  // ── Events ──
  {
    heading: 'Events',
    zone: 'workspace',
    items: [
      {
        id: 'events',
        label: 'All events',
        iconName: 'calendar',
        activeIconName: 'calendar',
      },
    ],
  },
  // ── Courses ──
  {
    heading: 'Courses',
    zone: 'workspace',
    items: [
      {
        id: 'courses-list',
        label: 'All courses',
        iconName: 'book',
        activeIconName: 'book-filled',
      },
      {
        id: 'lessons',
        label: 'Lessons',
        iconName: 'play-circle',
        activeIconName: 'play-circle',
      },
    ],
  },
  // ── Media ──
  {
    heading: 'Media',
    zone: 'workspace',
    items: [
      {
        id: 'media-manager',
        label: 'Media library',
        iconName: 'image',
        activeIconName: 'image',
      },
      {
        id: 'v5-live',
        label: 'Live',
        iconName: 'video',
        activeIconName: 'video',
      },
    ],
  },
  // ── Paywalls ──
  {
    heading: 'Paywalls',
    zone: 'workspace',
    items: [
      {
        id: 'paywalls-list',
        label: 'Paywalls',
        iconName: 'money-hand',
        activeIconName: 'money-hand-filled',
      },
      {
        id: 'coupons',
        label: 'Coupons',
        iconName: 'tag',
        activeIconName: 'tag',
      },
      {
        id: 'subscription-groups',
        label: 'Subscriptions',
        iconName: 'people',
        activeIconName: 'people',
      },
      {
        id: 'transactions',
        label: 'Transactions',
        iconName: 'receipt-tax',
        activeIconName: 'receipt-tax',
      },
      {
        id: 'affiliates-list',
        label: 'Affiliates',
        iconName: 'affiliates',
        activeIconName: 'affiliates',
      },
    ],
  },
  // ── Workflows ──
  {
    heading: 'Workflows',
    zone: 'workspace',
    items: [
      {
        id: 'all-workflows',
        label: 'All workflows',
        iconName: 'zap',
        activeIconName: 'zap-filled',
      },
      {
        id: 'v5-workflows-history',
        label: 'History',
        iconName: 'clock',
        activeIconName: 'clock',
      },
    ],
  },
  // ── Website ──
  {
    heading: 'Website',
    zone: 'workspace',
    items: [
      {
        id: 'v5-website-overview',
        label: 'Pages',
        iconName: 'window',
        activeIconName: 'window-filled',
      },
      {
        id: 'v5-menus',
        label: 'Navigation',
        iconName: 'hamburger-menu',
        activeIconName: 'hamburger-menu',
      },
    ],
  },
  // ── Branded App ──
  {
    heading: 'Branded App',
    zone: 'workspace',
    items: [
      {
        id: 'v5-branded-app',
        label: 'Branded App',
        iconName: 'devices',
        activeIconName: 'devices',
      },
    ],
  },
  // ── Analytics (standalone, no heading) ──
  {
    zone: 'workspace',
    items: [
      {
        id: 'v5-analytics',
        label: 'Analytics',
        iconName: 'chart-square',
        activeIconName: 'chart-square-filled',
      },
    ],
  },
];

/* ── Accordion layout: top → Shortcuts → Manage → Show more → Settings ── */

export const ACCORDION_TOP_IDS = [
  'dashboard',
  'v5-new-chat',
  'v5-inbox',
  'v5-agents-page',
  'v5-projects',
  'v5-library',
];

export const ACCORDION_MANAGE_IDS = [
  'v5-spaces',
  'v5-manage-agents',
  'v5-workflows',
  'v5-marketing',
  'v5-paywalls',
  'v5-branded-app',
];

export const ACCORDION_SHOW_MORE_IDS = [
  'v5-events',
  'v5-courses',
  'v5-media',
  'v5-website',
];

/** Inset mode Build section — matches Figma expanded nav design */
export const INSET_BUILD_IDS = [
  'v5-spaces',
  'v5-ai-team',
  'v5-audience',
  'v5-marketing',
  'v5-paywalls',
  'v5-analytics',
];

export const INSET_BUILD_MORE_IDS = [
  'v5-courses',
  'v5-events',
  'v5-workflows',
  'v5-media',
  'v5-website',
  'v5-branded-app',
];

/* ── Helper: find the parent L1 item for a given child ID ──────────── */

export function findParentL1(
  childId: string,
  navData: AdminNavZoneV5[] = adminNavDataV5
): AdminNavItemV5 | null {
  for (const zone of navData) {
    for (const item of zone.items) {
      if (item.id === childId) return item;
      if (item.landingId === childId) return item;
      if (item.children?.some(c => c.id === childId)) return item;
    }
  }
  return null;
}

/* ── Helper: resolve display title from any activeId ──────────────── */

export function resolveTitle(
  activeId: string,
  navData: AdminNavZoneV5[] = adminNavDataV5
): string {
  for (const zone of navData) {
    for (const item of zone.items) {
      if (item.id === activeId) return item.label;
      if (item.landingId === activeId) return item.label;
      const child = item.children?.find(c => c.id === activeId);
      if (child) return child.label;
    }
  }
  // Check flat nav
  for (const section of flatNavDataV5) {
    const item = section.items.find(i => i.id === activeId);
    if (item) return item.label;
  }
  // Check settings
  for (const section of settingsNavDataV5) {
    const item = section.items.find(i => i.id === activeId);
    if (item) return item.label;
  }
  return activeId;
}

/* ── Settings Navigation Data ─────────────────────────────────────── */

export interface SettingsNavSectionV5 {
  heading: string;
  items: {
    id: string;
    label: string;
    iconName: string;
    description?: string;
  }[];
}

export const settingsNavDataV5: SettingsNavSectionV5[] = [
  {
    heading: 'Audience',
    items: [
      { id: 'onboarding', label: 'Onboarding', iconName: 'compass' },
      { id: 'access-groups', label: 'Access groups', iconName: 'shield-check' },
      { id: 'tags', label: 'Tags', iconName: 'tag' },
      {
        id: 'profile-fields',
        label: 'Profile fields',
        iconName: 'people-edit',
      },
      { id: 'gamification', label: 'Gamification', iconName: 'trophy' },
      { id: 'activity-logs', label: 'Activity logs', iconName: 'clock' },
      { id: 'bulk-logs', label: 'Bulk logs', iconName: 'files' },
    ],
  },
  {
    heading: 'Community',
    items: [
      { id: 'topics', label: 'Topics', iconName: 'hashtag' },
      { id: 'weekly-digest', label: 'Weekly digest', iconName: 'email' },
      { id: 'embed', label: 'Embed', iconName: 'code-brackets' },
      { id: 'single-sign-on', label: 'SSO', iconName: 'lock' },
      { id: 'messaging', label: 'Messaging', iconName: 'message' },
      { id: 'community-ai', label: 'Community AI', iconName: 'sparkle' },
    ],
  },
  {
    heading: 'Payments',
    items: [
      {
        id: 'payment-settings',
        label: 'Payment settings',
        iconName: 'payment',
      },
      { id: 'taxes', label: 'Taxes', iconName: 'receipt-tax' },
      { id: 'coupons-settings', label: 'Coupons', iconName: 'tag' },
      {
        id: 'subscription-groups-settings',
        label: 'Subscription groups',
        iconName: 'people',
      },
      {
        id: 'affiliates-settings',
        label: 'Affiliates',
        iconName: 'affiliates',
      },
      { id: 'export-logs', label: 'Export logs', iconName: 'arrow-box-down' },
    ],
  },
  {
    heading: 'AI',
    items: [{ id: 'ai-settings', label: 'AI settings', iconName: 'ai-box' }],
  },
  {
    heading: 'Site',
    items: [
      { id: 'general', label: 'General', iconName: 'settings-gear' },
      { id: 'code-snippets', label: 'Code snippets', iconName: 'code-syntax' },
      { id: 'seo', label: 'SEO', iconName: 'magnifying-glass' },
      { id: 'redirects', label: 'Redirects', iconName: 'arrow-rotate' },
      { id: 'custom-domain', label: 'Custom domain', iconName: 'earth' },
      { id: 'legal', label: 'Legal', iconName: 'page' },
    ],
  },
  {
    heading: 'Email',
    items: [
      { id: 'email-settings', label: 'Email settings', iconName: 'email' },
    ],
  },
  {
    heading: 'Subscription',
    items: [
      { id: 'v5-billing', label: 'Billing', iconName: 'credit-card' },
      {
        id: 'v5-change-plan',
        label: 'Change plan',
        iconName: 'arrow-bottom-top',
      },
      {
        id: 'v5-branded-app-billing',
        label: 'Branded App billing',
        iconName: 'phone',
      },
    ],
  },
  {
    heading: 'Developers',
    items: [
      { id: 'v5-dev-overview', label: 'Overview', iconName: 'code-brackets' },
      { id: 'v5-dev-tokens', label: 'Tokens', iconName: 'lock' },
    ],
  },
];

/* ── V3 Sidebar Constants ────────────────────────────────────────────── */

/** Daily Drivers — always visible in V3 sidebar */
export const V3_DAILY_DRIVER_IDS = [
  'dashboard',
  'v5-inbox',
  'v5-ai-team',
  'v5-audience',
  'v5-marketing',
  'v5-analytics',
];

/** Additional items — hidden behind "Show more" in V3 */
export const V3_ADDITIONAL_IDS = [
  'v5-spaces',
  'v5-events',
  'v5-courses',
  'v5-media',
  'v5-paywalls',
  'v5-workflows',
  'v5-website',
  'v5-branded-app',
];

/** Default pre-populated shortcut IDs for the V3 prototype */
export const V3_DEFAULT_SHORTCUT_IDS = [
  'courses-list',
  'lessons',
  'events',
  'paywalls-list',
];

/* ── V4 Sidebar Constants ────────────────────────────────────────────── */

/** Daily Drivers — V4 (no Marketing) */
export const V4_DAILY_DRIVER_IDS = [
  'dashboard',
  'v5-inbox',
  'v5-ai-team',
  'v5-audience',
  'v5-analytics',
];

/** Manage section — visible items in V4 */
export const V4_MANAGE_VISIBLE_IDS = [
  'v5-spaces',
  'v5-manage-agents',
  'v5-ai-team',
  'v5-ai-workflows',
  'v5-marketing',
  'v5-paywalls',
  'v5-branded-app',
];

/** Manage section — items behind "Show more" in V4 */
export const V4_MANAGE_MORE_IDS = [
  'v5-website',
  'v5-courses',
  'v5-events',
  'v5-media',
  'v5-developers',
  'v5-plans',
];

/** Resolved shortcut item data */
export interface ShortcutItemData {
  id: string;
  label: string;
  iconName: string;
}

/** Resolve a shortcut ID (L1 landing, child, or settings item) to display data */
export function resolveShortcutItem(
  id: string,
  navData: AdminNavZoneV5[] = adminNavDataV5
): ShortcutItemData | null {
  for (const zone of navData) {
    for (const item of zone.items) {
      if (item.id === id || item.landingId === id)
        return { id, label: item.label, iconName: item.iconName };
      const child = item.children?.find(c => c.id === id);
      if (child) return { id, label: child.label, iconName: item.iconName };
    }
  }
  for (const section of settingsNavDataV5) {
    const item = section.items.find(i => i.id === id);
    if (item) return { id, label: item.label, iconName: item.iconName };
  }
  return null;
}

/* ── Map SidebarV2 activeId ↔ App admin route (sectionId, subItemId) ─── */

export function activeIdToAppRoute(activeId: string): {
  sectionId: string;
  subItemId?: string;
} {
  const map: Record<string, { sectionId: string; subItemId?: string }> = {
    dashboard: { sectionId: 'dashboard' },
    'v5-new-chat': { sectionId: 'dashboard' },
    'v5-inbox': { sectionId: 'ai-inbox' },
    'v5-agents-management': { sectionId: 'agents-management' },
    'v5-agents-page': { sectionId: 'agents-page' },
    'v5-team': { sectionId: 'team' },
    'v5-library': { sectionId: 'library' },
    'v5-projects': { sectionId: 'projects' },
    'v5-ai-team': { sectionId: 'ai-agents', subItemId: 'agents' },
    'all-agents': { sectionId: 'ai-agents', subItemId: 'agents' },
    knowledge: { sectionId: 'ai-agents', subItemId: 'knowledge' },
    'v5-audience': { sectionId: 'audience', subItemId: 'manage-audience' },
    'manage-audience': { sectionId: 'audience', subItemId: 'manage-audience' },
    segments: { sectionId: 'audience', subItemId: 'segments' },
    'invite-links': { sectionId: 'audience', subItemId: 'invite-links' },
    'access-groups': { sectionId: 'audience', subItemId: 'access-groups' },
    'bulk-logs': { sectionId: 'audience', subItemId: 'bulk-logs' },
    onboarding: { sectionId: 'audience', subItemId: 'onboarding' },
    tags: { sectionId: 'audience', subItemId: 'tags' },
    'profile-fields': { sectionId: 'audience', subItemId: 'profile-fields' },
    gamification: { sectionId: 'audience', subItemId: 'gamification' },
    'activity-logs': { sectionId: 'audience', subItemId: 'activity-logs' },
    'v5-marketing': { sectionId: 'marketing', subItemId: 'overview' },
    'marketing-overview': { sectionId: 'marketing', subItemId: 'overview' },
    broadcasts: { sectionId: 'marketing', subItemId: 'broadcasts' },
    forms: { sectionId: 'marketing', subItemId: 'forms' },
    'v5-spaces': { sectionId: 'content', subItemId: 'spaces' },
    spaces: { sectionId: 'content', subItemId: 'spaces' },
    posts: { sectionId: 'content', subItemId: 'posts' },
    pages: { sectionId: 'content', subItemId: 'pages' },
    topics: { sectionId: 'content', subItemId: 'topics' },
    moderation: { sectionId: 'content', subItemId: 'moderation' },
    'media-manager': { sectionId: 'content', subItemId: 'media-manager' },
    live: { sectionId: 'content', subItemId: 'live' },
    'v5-live': { sectionId: 'content', subItemId: 'live' },
    'v5-events': { sectionId: 'content', subItemId: 'events' },
    'v5-events-overview': { sectionId: 'content', subItemId: 'events' },
    events: { sectionId: 'content', subItemId: 'events' },
    'v5-courses': { sectionId: 'content', subItemId: 'live' },
    'v5-courses-overview': { sectionId: 'content', subItemId: 'live' },
    'courses-list': { sectionId: 'content', subItemId: 'live' },
    lessons: { sectionId: 'content', subItemId: 'live' },
    'v5-media': { sectionId: 'content', subItemId: 'media-manager' },
    'v5-paywalls': { sectionId: 'paywalls', subItemId: 'paywalls' },
    'paywalls-list': { sectionId: 'paywalls', subItemId: 'paywalls' },
    coupons: { sectionId: 'paywalls', subItemId: 'coupons' },
    'subscription-groups': {
      sectionId: 'paywalls',
      subItemId: 'subscription-groups',
    },
    transactions: { sectionId: 'paywalls', subItemId: 'transactions' },
    subscriptions: { sectionId: 'paywalls', subItemId: 'subscriptions' },
    'affiliates-list': { sectionId: 'paywalls', subItemId: 'affiliates' },
    'v5-workflows': { sectionId: 'workflows', subItemId: 'all-workflows' },
    'v5-ai-workflows': { sectionId: 'workflows', subItemId: 'all-workflows' },
    'all-workflows': { sectionId: 'workflows', subItemId: 'all-workflows' },
    'v5-workflows-history': { sectionId: 'workflows', subItemId: 'history' },
    'v5-website': { sectionId: 'content', subItemId: 'pages' },
    'v5-website-overview': { sectionId: 'content', subItemId: 'pages' },
    'v5-menus': { sectionId: 'content', subItemId: 'pages' },
    'v5-branded-app': { sectionId: 'content', subItemId: 'live' },
    'v5-analytics': { sectionId: 'analytics', subItemId: 'analytics-overview' },
    'analytics-overview': { sectionId: 'analytics', subItemId: 'analytics-overview' },
    'analytics-reports': { sectionId: 'analytics', subItemId: 'analytics-reports' },
    'analytics-insights': { sectionId: 'analytics', subItemId: 'analytics-insights' },
    'v5-developers': { sectionId: 'content', subItemId: 'live' },
    'v5-plans': { sectionId: 'paywalls', subItemId: 'paywalls' },
    // Settings
    general: { sectionId: 'settings', subItemId: 'general' },
    'custom-domain': { sectionId: 'settings', subItemId: 'custom-domain' },
    'community-ai': { sectionId: 'settings', subItemId: 'community-ai' },
    'mobile-app': { sectionId: 'settings', subItemId: 'mobile-app' },
    'weekly-digest': { sectionId: 'settings', subItemId: 'weekly-digest' },
    embed: { sectionId: 'settings', subItemId: 'embed' },
    'single-sign-on': { sectionId: 'settings', subItemId: 'single-sign-on' },
    messaging: { sectionId: 'settings', subItemId: 'messaging' },
    legal: { sectionId: 'settings', subItemId: 'legal' },
    'code-snippets': { sectionId: 'settings', subItemId: 'code-snippets' },
    seo: { sectionId: 'settings', subItemId: 'seo' },
    redirects: { sectionId: 'settings', subItemId: 'redirects' },
    'ai-settings': { sectionId: 'settings', subItemId: 'community-ai' },
    'email-settings': { sectionId: 'settings', subItemId: 'weekly-digest' },
    'v5-billing': { sectionId: 'settings', subItemId: 'defaults' },
    'v5-change-plan': { sectionId: 'settings', subItemId: 'defaults' },
    'v5-branded-app-billing': { sectionId: 'settings', subItemId: 'defaults' },
    'v5-dev-overview': { sectionId: 'settings', subItemId: 'code-snippets' },
    'v5-dev-tokens': { sectionId: 'settings', subItemId: 'code-snippets' },
  };
  return map[activeId] ?? { sectionId: 'dashboard' };
}

/** Resolve app (sectionId, activeSubItem) to SidebarV2 activeId for highlighting */
export function appRouteToActiveId(
  sectionId: string,
  activeSubItem?: string
): string {
  if (sectionId === 'dashboard') return 'dashboard';
  if (sectionId === 'settings') return activeSubItem ?? 'general';
  if (activeSubItem) return activeSubItem;
  const fallbacks: Record<string, string> = {
    audience: 'manage-audience',
    content: 'spaces',
    marketing: 'overview',
    'ai-agents': 'agents',
    workflows: 'all-workflows',
    paywalls: 'paywalls',
    analytics: 'dashboard',
    'ai-inbox': 'v5-inbox',
    'agents-page': 'v5-agents-page',
    team: 'v5-team',
    library: 'v5-library',
    projects: 'v5-projects',
  };
  return fallbacks[sectionId] ?? sectionId;
}

/* ── Recent Chats — re-exported from shared chatData ────────────────── */

export type { ChatItem as RecentChatItem } from '../../data/chatData';
export { CHAT_DATA as RECENT_CHATS } from '../../data/chatData';
