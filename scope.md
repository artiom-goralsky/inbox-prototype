# Prototype Scope — Design Building Blocks

## Navigation

### Community Dock (72px)
- Circle logo at top (36px, rounded-xl, shadow offset)
- Discover button (blue sparkle icon)
- Separator line (24px wide, 1px)
- Community logos (selected: white bg + border + shadow-xs)
- Separator line
- Add community button (+)
- Fixed width, full height, `bg-secondary`

### Admin Nav — Expanded (232px)
- Circle logo at top (36px, hover → back arrow)
- **Top items** (icon + label, 36px height, px-3, rounded-xl):
  - New chat (`sparkle`)
  - Inbox (`inbox-empty`)
  - Skills (`sparkle`)
  - Projects (`folder`)
  - Library (`layers`)
- **Shortcuts section** (label-xs header "Shortcuts"):
  - Members, Manage audience, Lessons
  - Each: icon + label, same row style
- **Build section** (label-xs header "Build"):
  - Community, AI Agents, Audience, Marketing, Analytics, Courses, More
  - Each: icon + label + chevron-right
- **Settings** pinned at bottom (icon + label + chevron-right)
- White bg, border-r `#f0f3f5`

### Admin Nav — Collapsed (68px)
- Circle logo at top (36px, centered, hover → back arrow)
- Icon buttons only (`ghost`, `md`):
  - New chat (`sparkle`)
  - Inbox (`inbox-empty`)
  - Skills (`sparkle`)
  - Projects (`folder`)
  - Library (`layers`)
- Settings icon at bottom
- White bg, border-r `#f0f3f5`
- **Only visible when copilot conversation is open**

### Transition: Community → Admin
- Admin nav overlays dock via absolute positioning
- Fade in + translateY(0) from translateY(-12px)
- 300ms ease-out
- Dock always renders underneath
- Content card stays at constant width

---

## Conversation (Copilot)

### States
1. **Maximized** — full width, content card hidden (flex: 7 / 0)
2. **Condensed** — side panel (flex: 3 / 7), with content card visible
3. **Closed** — hidden (flex: 0), content card full width

### Header
- Clock icon (recent chats drawer toggle)
- Conversation title (breadcrumb, single level)
- Expand/minimize icon (`expand`)
- Collapse icon (`arrow-wall-left`) — closes conversation

### Message Types
- **Agent message**: avatar (16px) + text body + action buttons (thumbup, x, copy)
- **User message**: right-aligned bubble, `bg-secondary`, rounded-2xl
- **Asset card**: icon + title + subtitle, border + rounded-md, shadow-2xs
- **Clarifying questions**: inline card with options, progress indicator, skip button
- **Plan card**: structured sections with collapsible details

### Input (AgentMessageBox)
- Min height: 131px
- Rounded-2xl, border `#e4e7eb`
- Shadow: `0px 4px 20px rgba(0,0,0,0.06), 0px 1px 4px rgba(0,0,0,0.03)`
- Bottom bar: hashtag + paperclip (outline) | microphone (ghost) + send (primary)

### Recent Chats Drawer
- Left slide-in, 300px wide, border-r
- List of chat titles (clickable)
- Close button in header

### Conversation Open Behaviors
- Starting from dashboard input/shortcuts → **maximized**
- Sparkle toggle in admin header → **condensed** (not maximized)
- Clicking nav item while maximized → **condenses** back
- Collapse button → **closes** completely

---

## Content Card

### Container
- Rounded-2xl, border border-primary
- Default shadow: `shadow-2xs`
- Copilot condensed shadow: `shadow-[0px_12px_60px...]`
- Copilot maximized: border-0, shadow-none, flex: 0
- 12px padding on top, right, bottom (gap from nav)

### Transition
- `transition: flex 600ms cubic-bezier(0.4, 0, 0.2, 1)`
- Smooth resize between maximized/condensed/closed copilot states

---

## Pages (Top 5)

### 1. Dashboard / Home (New Chat)
- **Heading**: "What do you want to do today?" (heading-xl)
- **Compose box**: 131px height, rounded-2xl, shadow, border
  - Text input (body-md placeholder)
  - Bottom: hashtag + paperclip | microphone + send
- **Action pills**: 6 buttons (outline, md, rounded-full)
  - Set up, Members, Content, Monetize, Grow, Strategize
  - Click expands category → shows list of actions
- **Recent chats**: 3 cards below pills
  - Title (label-sm) + subtitle (body-sm, tertiary)
  - Border secondary, rounded-xl, px-5 py-4

### 2. Inbox
- Three-column layout:
  - Left nav sidebar (conversation types)
  - Chat list (conversations with badges)
  - Chat window (messages + input)
- Optional right panel (user profile details)

### 3. Skills (Agents Page)
- Grid layout: `repeat(auto-fill, minmax(200px, 1fr))`
- Grouped by category (Setup, Members, Content, Monetize, Grow, Strategize)
- **Skill card**: icon + name + mode badge + phase indicator + description
- Click → opens AssetDetailSidebar (flyover overlay, 550px)
- "Start conversation" button in detail → opens copilot maximized

### 4. Projects
- Tab navigation: All / Active / Completed
- **Project card**: emoji + title + description + agent avatars + stats
  - Border secondary, rounded-xl, p-5
  - Hover shadow
- **Project detail view**: full page with conversations + artifacts
- Breadcrumb navigation back to list

### 5. Library
- Segmented control filter: All / Insights / Drafts / Files / Media
- **Library item card**: type icon + title + description + agent info
  - Border secondary, rounded-lg, p-4
- Click → opens AssetDetailSidebar (push style, resizable 320-960px)

---

## Overlays & Panels

### Asset Detail Sidebar
- **Push style** (regular assets): slides in from right, pushes content
  - Width: 550px default, resizable 320-960px
  - Drag handle on left edge
- **Flyover style** (skills/agents): absolute overlay on right
  - Fixed 550px width
  - translate-x transition
- Header: title + close button
- Content: scrollable details
- Footer: action buttons

### Community Inset
- Full Community component rendered inside content card
- Own header (logo, tabs: Home/Courses/Events/Members/Leaderboard)
- Own spaces sidebar + feed
- Admin Navbar hidden when community inset is showing
- Triggered via sparkle from community header (`initialView='community'`)

---

## Shared Components

| Component | Purpose | Key Visual |
|-----------|---------|------------|
| AgentMessageBox | Reply input | 131px, rounded-2xl, shadow, bottom bar |
| ClarifyingQuestions | Multi-step Q&A | Animated card, options + custom input |
| PlanCard | Structured plan display | Sections with collapsible details |
| AssetDetailSidebar | Detail panel | Resizable push/flyover sidebar |
| Navbar | Admin header bar | Logo + search + actions + sparkle toggle |
| ContentContainer | Page wrapper | Title + tabs + filters, scroll-hide header |
