# Inbox V2 Prototype — Mock Data Audit

> Read-only content inventory. Generated 2026-04-17.

## Files Examined (8 total)

| File | Location | Items | Purpose |
|---|---|---|---|
| allViewMockData.ts | InboxPage/ | 12 items | All-view unified inbox |
| mockModerationHistory.ts | InboxPage/ | 22 history items + 10 summaries | Moderation history panel |
| suggestedReplyMockData.ts | InboxPage/ | 7 replies | AI suggested reply widget |
| aiAssistMockData.ts | InboxPage/ | 8 interactions + follow-ups | AI assist sidebar |
| v1MockData.ts | InboxPage/v1/ | 46 items across 4 categories | V1 prototype |
| v1_5MockData.ts | InboxPage/v1.5/ | 14 items (10 threads + 4 connections) | V1.5 new categories |
| inboxScenarioData.ts | CopilotView/InboxSession/ | 10 ready + 3 needs-you cards | Copilot DM session |
| moderationScenarioData.ts | CopilotView/InboxSession/ | 8 confirm + 4 decide cards | Copilot moderation session |

---

## 1. allViewMockData.ts

### Exported Types

- `AllViewItemType` — Union: `'dm' | 'chatThread' | 'connectionRequest' | 'moderation' | 'courseComment' | 'aiInbox'`
- `AllViewItem` — Interface for mixed-category inbox items

### Exported Constants

- `TYPE_TO_CENTER_ID` — Maps item type to center panel selectedId
- `TYPE_ICON` — Icon badge per type (`message-dots`, `thread`, `people-sparkle`, `flag`, `graduate-cap`, `ai-box`)
- `TYPE_LABEL` — Display labels (DMs, Chat Threads, Connection Requests, Moderation, Course Comments, AI Inbox)
- `GROUP_ORDER` — Ordering for grouped view
- `ITEM_CENTER_MAP` — Maps all-view item IDs to `{ tab, selectedId }` pairs
- `ALL_VIEW_ITEMS` — Array of 12 mixed inbox items

### Data Shape — AllViewItem

**Required fields:**

| Field | Type |
|---|---|
| id | string |
| type | AllViewItemType |
| name | string |
| avatarName | string |
| time | string |
| priority | 'high' \| 'medium' \| 'low' |

**Optional fields (by type):**

| Field | Used by | Type |
|---|---|---|
| preview | DM | string |
| unread | DM | boolean |
| channelEmoji | Chat Thread | string |
| channelLabel | Chat Thread | string |
| parentPreview | Chat Thread | string |
| lastReply | Chat Thread | string |
| role | Connection Request | string |
| roleDetail | Connection Request | string |
| message | Connection Request | string |
| violationReason | Moderation | string |
| itemCount | Moderation | number |
| lessonLabel | Course Comment | string |
| commentPreview | Course Comment | string |
| agentName | AI Inbox | string |
| aiPreview | AI Inbox | string |
| resolvedAt | All | number \| null |

### Items (12 total)

| ID | Type | Name | Time | Priority | Key Fields |
|---|---|---|---|---|---|
| all-dm-1 | dm | Calvin Parks | 9:45 | HIGH | unread: true, preview: "Creating a space where there are no quantum fluctuations requires an enormous amount of energy..." |
| all-ct-1 | chatThread | Kristin Watson | 9:45 | MEDIUM | 👋 Introduction, parent: "Dolor culpa culpa exercitation…", lastReply: "Please let me know if you need any further information for the project." |
| all-cr-1 | connectionRequest | Leslie Alexander | 9:45 | MEDIUM | Full stack developer, Lisbon, Portugal, message: "Hey Artiom. I really like your profile!" |
| all-mod-1 | moderation | Calvin Parks | 9:45 | HIGH | Harassment, 5 items |
| all-cc-1 | courseComment | Ralph Edwards | 9:45 | MEDIUM | Lesson 1: Camera basics, "Let me go grab some snacks real quick." |
| all-ai-1 | aiInbox | Jane Cooper | 9:45 | HIGH | Support Agent, "I don't have it installed yet." |
| all-dm-2 | dm | Courtney Henry | 8:30 | MEDIUM | "Hey, can you review the latest design mockups when you get a chance?" |
| all-ct-2 | chatThread | Ralph Edwards | 6:20 | LOW | ⭐ Feature Requests, parent: "Can we add dark mode support to the dashboard?", lastReply: "Great idea, let me check with the team." |
| all-cr-2 | connectionRequest | Roberto Santos | 5:00 | LOW | Software engineer, Berlin, Germany |
| all-mod-2 | moderation | Maria Santos | 4:30 | LOW | Spam, 3 items |
| all-cc-2 | courseComment | Annette Black | 3:15 | LOW | Lesson 3: Composition rules, "This was really helpful, thank you!" |
| all-dm-3 | dm | Wade Warren | 7:15 | LOW | "The deployment went smoothly. All tests passed on staging." |

**State:** All 12 items unresolved (no `resolvedAt` timestamps).

### ITEM_CENTER_MAP

| All-View ID | Tab | Center Panel selectedId |
|---|---|---|
| all-dm-1 | dms | dm-3 |
| all-dm-2 | dms | dm-4 |
| all-dm-3 | dms | dm-5 |
| all-ct-1 | chat-threads | ct-1 |
| all-ct-2 | chat-threads | ct-2 |
| all-cr-1 | connection-requests | cr-1 |
| all-cr-2 | connection-requests | cr-2 |
| all-mod-1 | moderation | cp |
| all-mod-2 | moderation | maria-santos |
| all-cc-1 | course-comments | cc-1 |
| all-cc-2 | course-comments | cc-2 |
| all-ai-1 | ai-inbox | ai-1 |

---

## 2. mockModerationHistory.ts

### Exported Types

- `ModerationSummary` — `{ removedCount, allowedCount, firstEventDate }`
- `ModerationHistoryItem` — `{ id, type, outcome, date, contentSnippet, decidedBy, context? }`

### History Items by Author

#### Calvin Parks (`cp`) — 10 items

| ID | Type | Outcome | Date | Content Snippet | Decided By |
|---|---|---|---|---|---|
| h1 | Post | removed | 2025-03-10 | Check out this growth hack tool — got me 5k followers... | Alex |
| h2 | Comment | removed | 2025-03-02 | DM me for the link, completely free before it expires... | You |
| h3 | Message | removed | 2025-02-18 | Exclusive offer just for community members... | workflow |
| h4 | Post | removed | 2025-02-05 | You won't believe this photographer's secret tool... | Alex |
| h5 | Post | removed | 2025-01-28 | Triple your engagement in 30 days — DM me for the guide... | workflow |
| h6 | Comment | removed | 2024-12-15 | Get 50% off my editing presets — today only... | You |
| h7 | Post | removed | 2024-11-22 | Secret to viral photography content revealed... | Alex |
| h8 | Post | allowed | 2025-01-15 | Great point! I wrote about this on my photography blog... | You |
| h9 | Comment | allowed | 2024-12-20 | Thanks for sharing, really helpful for beginners! | Alex |
| h10 | Post | allowed | 2024-11-08 | Here's my take on community growth strategies... | workflow |

**Summary:** 7 removed, 3 allowed (since 2024-11-08)

#### Kathryn Murphy (`km`) — 7 items

| ID | Type | Outcome | Date | Content Snippet | Decided By |
|---|---|---|---|---|---|
| h11 | Post | removed | 2025-03-18 | Free webinar sign-up — limited spots available... | Alex |
| h12 | Post | removed | 2025-03-12 | Join my masterclass — early bird pricing ends soon... | Alex |
| h13 | Message | removed | 2025-02-28 | Anyone interested in 1-on-1 coaching sessions? | You |
| h14 | DM | removed | 2025-02-15 | Exclusive offer just for you — reply to claim... | workflow |
| h15 | Comment | allowed | 2025-01-22 | Great point about design systems, totally agree... | You |
| h16 | Post | allowed | 2024-11-15 | Here's my perspective on freelance design rates... | Alex |
| h17 | Comment | allowed | 2024-11-08 | Thanks for the feedback, really appreciate it! | workflow |

**Summary:** 4 removed, 3 allowed (since 2024-11-08)

#### Jake Miller (`jake-miller`) — 5 items (all allowed, all Comments)

| ID | Date | Content Snippet | Decided By |
|---|---|---|---|
| h18 | 2025-02-10 | This lighting setup is absolutely insane, love it... | workflow |
| h19 | 2025-01-18 | Hell yes, this is the best shot of the month... | You |
| h20 | 2024-12-05 | Damn, that bokeh is perfect — what lens did you use? | workflow |
| h21 | 2024-11-20 | That's badass composition, genuinely stunning work... | Alex |
| h22 | 2024-09-14 | Holy crap the colors in this are incredible... | workflow |

**Summary:** 0 removed, 5 allowed (since 2024-09-14)

### Summary-Only Authors (no detailed history items)

| Author ID | Removed | Allowed | First Event |
|---|---|---|---|
| derek-hoffman | 1 | 4 | 2024-08-20 |
| bot-accounts | 12 | 0 | 2025-01-15 |
| kw | 2 | 1 | 2024-10-12 |
| re | 1 | 2 | 2024-12-05 |
| ab | 3 | 1 | 2025-01-08 |
| ww | 1 | 1 | 2025-02-14 |
| maria-santos | 0 | 0 | 2025-03-16 |

---

## 3. suggestedReplyMockData.ts

### Exported Types

- `SuggestedReplyData` — `{ draftText, sources: Array<{title, category}>, reasoning }`

### Exported Constants

- `SUGGESTED_REPLIES` — Record keyed by thread selectedId
- `getSuggestedReply(selectedId)` — Helper function

### Suggested Replies (7 total)

#### DM-3 — Calvin Parks (Refund Request)

- **Draft:** "Hi Calvin! Thanks for reaching out about the refund. Since you're within the 7-day window, I can process a full refund for you right away. I'll initiate it now — you should see the credit back on your account within 3-5 business days.\n\nLet me know if you need anything else!"
- **Sources:** Refund policy — 7-day window (Circle Knowledge Base), Processing member refunds (Help Center)
- **Reasoning:** "Calvin asked about a refund within the first week of membership."

#### DM-5 — Ralph Edwards (Billing Inquiry)

- **Draft:** "Hey Ralph! Your billing cycle renews on the 15th of each month. I can see your current plan is the Pro tier at $29/mo. If you'd like to switch to annual billing (saves 20%), I can make that change for you — just say the word!"
- **Sources:** Billing cycles and renewal dates (Circle Knowledge Base), Plan comparison — Pro vs. Annual (Help Center)
- **Reasoning:** "Ralph asked about billing details and renewal date."

#### CT-1 — Chat Thread (Design Tokens)

- **Draft:** "Great question! You can find the design tokens in the Compass Storybook under the Tokens tab. Each component page has a 'Design Tokens' section showing the exact spacing, color, and typography values used.\n\nHere's the direct link: circleco.github.io/compass → Tokens."
- **Sources:** Compass design tokens documentation (Circle Knowledge Base), Using Storybook for component reference (Engineering Wiki)
- **Reasoning:** "Thread question about finding design token values in Compass."

#### CT-3 — Chat Thread (Onboarding)

- **Draft:** "Welcome to the team! To get started:\n\n1. Join the #introductions channel and say hi\n2. Check out the Getting Started guide pinned in #onboarding\n3. Set up your profile with a photo and bio\n\nFeel free to ask any questions here — everyone's super helpful!"
- **Sources:** New member onboarding checklist (Circle Knowledge Base), Community guidelines (Community Docs)
- **Reasoning:** "New member asking about onboarding steps in the welcome thread."

#### CC-1 — Course Comment (Exposure Triangle)

- **Draft:** "Great question about the exposure triangle! The three elements (aperture, shutter speed, and ISO) work together to control how much light reaches the sensor. Think of it like a water faucet:\n\n- Aperture = how wide the tap is open\n- Shutter speed = how long you leave it running\n- ISO = how sensitive the bucket is to water\n\nCheck out section 1.3 for the interactive diagram that shows how they balance."
- **Sources:** Lesson 1: Camera basics — Exposure triangle (Photography Masterclass), Student FAQ — Common exposure questions (Circle Knowledge Base)
- **Reasoning:** "Student asked about the exposure triangle concept from Lesson 1."

#### CC-2 — Course Comment (Composition Exercise)

- **Draft:** "For the composition exercise, try using the grid overlay on your camera (most phones have this in settings). Place key elements along the intersecting lines — that's the rule of thirds in action!\n\nThe bonus exercise at the end of Lesson 3 walks you through this step by step with everyday objects."
- **Sources:** Lesson 3: Composition rules — Rule of thirds (Photography Masterclass), Course exercise troubleshooting (Circle Knowledge Base)
- **Reasoning:** "Student having trouble with the composition exercise from Lesson 3."

#### AI-2 — AI Inbox (Password Reset Takeover)

- **Draft:** "Hi Kristin, I'm taking over from our AI agent to help you directly. I can see you were asking about resetting your password — here's the quickest way:\n\n1. Go to Settings → Account → Security\n2. Click \"Change password\"\n3. You'll get a verification email within 60 seconds\n\nIf the email doesn't arrive, check your spam folder. Let me know if you're still stuck!"
- **Sources:** Password reset procedures (Circle Knowledge Base), Agent pause rule: "password" keyword (Agent Config)
- **Reasoning:** "Agent paused on keyword \"password\" — member needs help with account access."

#### AI-5 — AI Inbox (API Integration Escalation)

- **Draft:** "Hey Ralph, I appreciate your patience. I'm stepping in personally to make sure we get this sorted. I can see the AI agent wasn't able to fully address your question about the API integration.\n\nCould you share which API endpoint you're trying to connect to? That'll help me point you to the right documentation."
- **Sources:** API integration guide (Circle Knowledge Base), Agent escalation — complex technical questions (Agent Config)
- **Reasoning:** "Agent paused due to complex technical question about API integration."

---

## 4. aiAssistMockData.ts

### Exported Types

- `ReferenceCategory` — `'dm' | 'chatThread' | 'courseComment' | 'aiInbox'`
- `ReferenceContext` — `{ messageId, authorName, snippet, category }`
- `AiAssistArtifact` — `{ id, type, title, body, hasAddToComposer, sources? }`
- `AssistInteraction` — `{ id, reference, artifact, followUp? }`

### Interactions (8 total)

| ID | Category | Reference Author | Snippet | Artifact Type | Follow-up? |
|---|---|---|---|---|---|
| assist-dm-1 | dm | Calvin Parks | "Hi there! What's up?" | draft | Yes |
| assist-dm-2 | dm | Courtney Henry | "Hey, can you review the latest design mockups?" | draft | No |
| assist-ct-1 | chatThread | Kristin Watson | "Please let me know if you need any further information" | draft | No |
| assist-ct-2 | chatThread | Ralph Edwards | "Can we add dark mode support to the dashboard?" | draft | Yes |
| assist-cc-1 | courseComment | Ralph Edwards | "Let me go grab some snacks real quick." | draft | Yes |
| assist-cc-2 | courseComment | Annette Black | "This was really helpful, thank you!" | draft | No |
| assist-ai-1 | aiInbox | Jane Cooper | "I don't have it installed yet." | takeover-draft | Yes |
| assist-ai-2 | aiInbox | Cody Fisher | "This is getting frustrating, I need..." | takeover-draft | No |

### Full Draft Content

**assist-dm-1 (Calvin Parks)**
- **Initial:** "Hey Calvin! Great to hear from you. I'm doing well — just wrapped up a design review. Is there something specific I can help with, or just catching up?"
- **Sources:** Send and manage DMs (Circle Knowledge Base), Community engagement tips (Help Center)
- **Follow-up prompt:** "make it shorter"
- **Revised:** "Hey Calvin! All good here. What's on your mind?"

**assist-dm-2 (Courtney Henry)**
- **Draft:** "Hi Courtney! Absolutely, I'd be happy to review the mockups. Could you share the Figma link? I'll aim to have feedback ready by end of day tomorrow."
- **Sources:** Design review process (Team Handbook), Figma collaboration guide (Circle Knowledge Base)

**assist-ct-1 (Kristin Watson)**
- **Draft:** "Thanks for the update, Kristin! I think we have everything we need. I'll loop in the design team and we can review together in tomorrow's standup."
- **Sources:** Thread reply best practices (Circle Knowledge Base), Team communication guidelines (Community Docs)

**assist-ct-2 (Ralph Edwards)**
- **Initial:** "Great suggestion, Ralph! Dark mode is on our roadmap for Q3. I've added your request to the tracker. In the meantime, browser-level dark mode works with most components."
- **Sources:** Feature request process (Product Docs), Dark mode implementation guide (Engineering Wiki)
- **Follow-up prompt:** "make it shorter"
- **Revised:** "Good idea! Dark mode is on the Q3 roadmap. I've logged your request. 👍"

**assist-cc-1 (Ralph Edwards)**
- **Initial:** "No worries, Ralph! Take your time. When you're back, check out the exposure triangle diagram in section 1.3 — it covers the fundamentals for the next exercise."
- **Sources:** Lesson 1: Camera basics (Photography Masterclass), Student engagement tips (Circle Knowledge Base)
- **Follow-up prompt:** "make it shorter"
- **Revised:** "Take your time! Check section 1.3 when you're back. 📸"

**assist-cc-2 (Annette Black)**
- **Draft:** "So glad you found it helpful, Annette! 🎉 Try the bonus exercise at the end of Lesson 3 — it builds on these composition techniques."
- **Sources:** Lesson 3: Composition rules (Photography Masterclass), Positive reinforcement in courses (Circle Knowledge Base)

**assist-ai-1 (Jane Cooper)**
- **Initial:** "Hi Jane! I'm stepping in to help personally. Here's a step-by-step guide:\n\n1. Go to Settings → Integrations\n2. Click 'Install' next to the app\n3. Follow the authorization prompts\n\nLet me know if you run into any issues!"
- **Sources:** App installation guide (Circle Knowledge Base), Agent handoff procedures (Agent Config)
- **Follow-up prompt:** "make it shorter"
- **Revised:** "Hi Jane! Go to Settings → Integrations → click Install. Let me know if you need help!"

**assist-ai-2 (Cody Fisher)**
- **Draft:** "I completely understand your frustration, Cody. I'm taking over personally to make sure we resolve this. Could you describe the specific issue? I'll ensure it gets fixed."
- **Sources:** Escalation handling guide (Agent Config), Customer satisfaction recovery (Circle Knowledge Base)

---

## 5. v1MockData.ts

### Exported Types

- `V1Category` — `'dms' | 'moderation' | 'course-comments' | 'ai-inbox'`
- `V1ThreadItem` — `{ id, name, preview, time, unread?, priority?, isAgent? }`
- `V1Message` — `{ id, senderName, text, time, threadReplies? }`
- `V1MessageGroup` — `{ label, messages }`
- `V1Report` — `{ reporter, reason, timeAgo, comment, status? }`
- `V1ModerationCard` — Full moderation card with reports, alerts, and content
- `V1CourseComment` — `{ id, authorName, text, time, likes, badges?, isUnanswered?, threadReplyCount? }`
- `V1CourseCommentThread` — `{ id, name, preview, time, lessonTitle, unanswered? }`
- `V1AIConversation` — `{ agentName, memberName, timeGroups }`
- `ProfileData` — Full member profile

### Exported Constants & Helpers

- `DM_THREADS` (13 items), `DM_CONVERSATIONS` (2 conversations)
- `MODERATION_THREADS` (13 items), `MODERATION_CARDS` (13 cards)
- `COURSE_THREADS` (10 items), `COURSE_COMMENT_DATA` (10 threads), `COURSE_THREAD_REPLIES` (6 reply chains)
- `AI_THREADS` (10 items), `AI_CONVERSATIONS` (5 conversations)
- `PROFILE_DATA` (4 profiles)
- `INITIAL_REVIEWED_IDS` — Set of pre-reviewed moderation IDs
- `INITIAL_DECISIONS` — Map of pre-reviewed outcomes
- `getThreadsForCategory()`, `getFirstThreadId()`, `getProfileData()`

### DM Threads (13 items)

| ID | Name | Time | Preview | Unread | Priority | isAgent |
|---|---|---|---|---|---|---|
| dm-1 | Kathryn Murphy | 9:45 | Hey, want to play? | false | low | — |
| dm-2 | Kristin Watson | 9:45 | Please let me know if yo... | false | medium | — |
| dm-3 | Calvin Parks | 9:45 | Hi there! What's up? | true | high | — |
| dm-agent-1 | Onboarding Assistant | 9:30 | Welcome! Here's how to get started... | true | medium | ✓ |
| dm-4 | Courtney Henry | 9:45 | HAHAHA | false | low | — |
| dm-5 | Ralph Edwards | 9:45 | Let me go grab some sn... | false | medium | — |
| dm-agent-2 | Support Bot | 8:12 | Your ticket #4821 has been resolved. | false | low | ✓ |
| dm-6 | Jane Cooper | 9:45 | I don't have it installed y... | false | medium | — |
| dm-7 | Annette Black | 9:45 | Hey! How's it going? | false | low | — |
| dm-8 | Wade Warren | 9:45 | Still trying to play? | false | low | — |
| dm-agent-3 | Content Coach | Yesterday | Your post draft looks great! A few suggestions... | false | low | ✓ |
| dm-9 | Cody Fisher | 9:45 | Let me go grab some sn... | false | medium | — |
| dm-10 | Dianne Russell | 9:45 | I don't have it installed y... | false | low | — |

**State:** 2 unread (dm-3, dm-agent-1), 3 agent DMs

### DM Conversations (2 detailed)

**dm-3 (Calvin Parks) — 2 time groups:**

*Yesterday:*
- Mike Walero → Calvin Parks, Andria Warren, Rosetta Stoney: discussion about quantum mechanics
- Rosetta Stoney message includes 2 threaded replies

*Today:*
- Calvin Parks: vacuum energy and quantum fluctuations (long message)
- Cameron Miller: vacuum = minimum possible energy, with 3 threaded replies
- Topics: quantum mechanics, deleted data, Big Bang, vacuum states

**dm-1 (Kathryn Murphy) — Simple exchange:**
- Kathryn Murphy: "Hey, want to play?"
- You: "Sure! What did you have in mind?"

### Moderation Threads (13 items)

| ID | Author | Type | Preview | Priority |
|---|---|---|---|---|
| mod-1 | Eliza Stone | Post | This is absolutely unacceptable... | high |
| mod-2 | Jordan Rivers | Comment | I can't believe this is allowed... | medium |
| mod-3 | Hailey Mills | Post | You should be ashamed... | high |
| mod-4 | Eliza Stone | Comment | Stop wasting everyone's time... | medium |
| mod-5 | Britta Holt | DM | I'm blocking you... | medium |
| mod-6 | Kenton Kunze | Post | I hope you get banned... | medium |
| mod-7 | Eliza Stone | Post | Nobody asked for your opinion... | low |
| mod-8 | Hailey Mills | Post | This community is a joke... | low |
| mod-9 | Drew Essien | Post | Get a life, seriously... | medium |
| mod-10 | Kenna Weimann | Connection | Suspicious connection request... | low |
| mod-11 | Lana Baumgartner | Post | Promotional content... | low |
| mod-12 | Jordan Rivers | Post | This is why the internet is toxic... | low |
| mod-13 | Kenna Weimann | Post | Spam link in bio... | low |

**Pre-reviewed (INITIAL_REVIEWED_IDS):**
- mod-6 → approved
- mod-7 → removed
- mod-8 → approved
- mod-11 → removed
- mod-13 → removed

**Author groupings:** Eliza Stone (mod-1, mod-4, mod-7 — 4 other reports), Hailey Mills (mod-3, mod-8), Kenna Weimann (mod-10, mod-13), Jordan Rivers (mod-2, mod-12)

### Course Comment Threads (10 items)

| ID | Author | Lesson | Unanswered | Priority |
|---|---|---|---|---|
| cc-1 | Eliza Stone | Lesson 1: Basic Framing | YES | high |
| cc-2 | Jordan Rivers | Intro to Photography | YES | medium |
| cc-3 | Hailey Mills | Lesson 4: Action Shots | NO | medium |
| cc-4 | Lana Baumgartner | Lesson 8: Black and White | YES | medium |
| cc-5 | Britta Holt | Lesson 6: Night Photography | YES | high |
| cc-6 | Kenton Kunze | Lesson 2: Natural Lighting | NO | low |
| cc-7 | Jody Brekke | Lesson 9: Street Photography | NO | low |
| cc-8 | Ricardo Archuleta | Lesson 10: Still Life | YES | medium |
| cc-9 | Drew Essien | Lesson 11: Photojournalism | YES | low |
| cc-10 | Tod Gerhold | Lesson 1: Camera basics | NO | low |

**State:** 6 unanswered, 4 answered

### AI Inbox Threads (10 items)

| ID | Name | Status | Agent | Priority |
|---|---|---|---|---|
| ai-1 | Kathryn Murphy | active | support | medium |
| ai-2 | Kristin Watson | paused | clarity | high |
| ai-3 | Calvin Parks | active | clarity | medium |
| ai-4 | Courtney Henry | active | support | low |
| ai-5 | Ralph Edwards | paused | support | high |
| ai-6 | Jane Cooper | active | clarity | medium |
| ai-7 | Annette Black | active | support | low |
| ai-8 | Wade Warren | active | clarity | low |
| ai-9 | Cody Fisher | paused | support | high |
| ai-10 | Dianne Russell | active | clarity | low |

**State:** 7 active, 3 paused

### AI Conversations (5 detailed)

**ai-1 (Kathryn Murphy — Support Agent):** Membership upgrade inquiry. 4 messages about Starter → Pro plan.

**ai-2 (Kristin Watson — Clarity Agent):** Password reset help. Agent paused after keyword trigger. 4 messages.

**ai-3 (Calvin Parks — Clarity Agent):** Connection issues troubleshooting. 4 messages about internet connectivity.

**ai-4 (Courtney Henry — Support Agent):** Course progress check-in. 4 messages about Portrait Photography course.

**ai-5 (Ralph Edwards — Support Agent):** API integration question. Agent paused due to complexity. 4 messages, member requests human help.

### Course Thread Replies (6 reply chains)

| Comment ID | Replies | Authors |
|---|---|---|
| c1 | 3 | Albert Flores, Kathryn Murphy, Jordan Rivers |
| c2 | 3 | Calvin Parks, Albert Flores, Kathryn Murphy |
| c3 | 2 | Jordan Rivers, Albert Flores |
| c3b | 2 | Albert Flores, Abram Wilson |
| cc3-2 | 2 | Abram Wilson, Calvin Parks |
| c13 | 2 | Abram Wilson, Albert Flores |

### Profile Data (4 members)

| Name | Role | Location | Join Date | Tags |
|---|---|---|---|---|
| Calvin Parks | Marketing Manager | California, CA | July 2020 | ✍️ Editor, 💪 Pro, 👻 Creator |
| Kathryn Murphy | Product Designer | New York, NY | March 2021 | 💪 Pro |
| Eliza Stone | Community Member | Austin, TX | January 2023 | 💪 Pro |
| Jordan Rivers | Student | Portland, OR | September 2024 | ✍️ Editor |

---

## 6. v1_5MockData.ts

Re-exports all v1 data and adds two new categories.

### New Exported Types

- `V1_5Category` — `'dms' | 'chat-threads' | 'connection-requests' | 'moderation' | 'course-comments' | 'ai-inbox'`
- `ChatThreadItem` — `{ id, participants, channelName?, channelEmoji?, channelLabel?, isPrivate?, parentPreview, lastReply, time, unread?, hasReplied?, avatarName, priority? }`
- `ChatThreadMessage` — `{ id, senderName, text, time }`
- `ChatThreadConversation` — `{ channelName?, isPrivate?, participantNames, parentMessage, replies, hiddenReplyCount? }`
- `ConnectionRequestItem` — `{ id, name, role?, roleDetail?, message?, time, priority? }`
- `ConnectionRequestProfile` — `{ name, role, lastSeen, level, badges, biography, email, website, customFields, posts, comments, spaces }`

### Chat Thread Items (10 items)

| ID | Avatar Name | Channel | Emoji | Label | Participants | Priority |
|---|---|---|---|---|---|---|
| ct-1 | Igor Kravchenko | #design-private | 🗓️ | Events Channel | Igor, Ceri | high |
| ct-2 | Juan Vallejo | #dev-live-team | 🎉 | Wins Channel | Juan Vallejo | medium |
| ct-3 | Karthik Menon | #dev-live-team | ⭐ | Feature Requests | Karthik, Michal, Artiom | medium |
| ct-4 | Adriana Lopez | #feedback-compass | 📰 | Industry News | Adriana, Luca, Maya, Chen, Sophie, James | low |
| ct-5 | Adriana Lopez | — | — | DM | Adriana, you | low |
| ct-6 | Maya Patel | #announcements | 📢 | Announcements | Maya, you, Chen, Luca | medium |
| ct-7 | Wade Warren | — | — | DM | Wade, you | low |
| ct-8 | Cody Fisher | #sales | 💼 | Sales Channel | Cody Fisher | low |
| ct-9 | Dianne Russell | #product-feedback | 🛠️ | Product Feedback | Dianne Russell | medium |
| ct-10 | Jacob Jones | #general | 📣 | General Chat | Jacob Jones | low |

### Chat Thread Conversations (6 detailed)

**ct-1 (Igor Kravchenko — #design-private):**
- Parent: "Hey @design-team-product we need a couple of screens for the new onboarding flow. Can someone take a look at the current Figma and see what we can reuse?"
- Reply 1 (Ceri Williams, 4:15 PM): "I can take a look at this tomorrow morning. The welcome screen should be straightforward to adapt."
- Reply 2 (You, 4:30 PM): "cool, let us know"

**ct-2 (Juan Vallejo — #dev-live-team):**
- Parent: "@Artiom do we have new skeleton loaders for event spaces? The current ones look a bit off on mobile."
- Reply 1 (You, 11:45 AM): "cool, let us know"

**ct-3 (Karthik Menon — #dev-live-team):**
- Parent: "@Artiom and Michal, Do we have the Figma designs ready for the new live events layout? Product wants to review them before the sprint planning on Monday."
- Hidden: 4 more replies
- Reply 1 (Michal Novak, 2:30 PM): "I started working on the layout yesterday. Should have the first draft ready by EOD."
- Reply 2 (Karthik Menon, 3:00 PM): "Lemme get back to you by tomorrow."

**ct-4 (Adriana Lopez — #feedback-compass):**
- Parent: "Report: Could we have a Popover ghost variant? The current default Popover has too much padding for use in compact toolbars."
- Hidden: 8 more replies
- Reply 1 (Luca Romano, 10:30 AM): "I think we should keep the existing padding for accessibility reasons. Maybe we can add a size prop instead?"
- Reply 2 (Maya Patel, 11:00 AM): "we agreed on keep the current Popover padding but add a compact size variant for toolbar use cases."

**ct-5 (Adriana Lopez — DM):**
- Parent (You): "and another one from me: https://www.loom.com/share/design-review-feb — this covers the updated navigation patterns we discussed last week."
- Reply 1 (Adriana, 10:00 AM): "Great walkthrough! I left a few comments on the Loom. Main thing — the breadcrumb behavior on mobile needs another pass."
- Reply 2 (You, 10:20 AM): "thank you Adriana"

**ct-6 (Maya Patel — #announcements):**
- Parent: "Can we sync on the design review before Friday? I want to make sure we align on the component library updates before the release."
- Reply 1 (Chen Wei, 2:15 PM): "Thursday works for me. What time zone are we targeting?"
- Reply 2 (Luca Romano, 2:30 PM): "Sure, let's do Thursday 3pm"

### Connection Request Items (4 items)

| ID | Name | Role | Role Detail | Message | Priority |
|---|---|---|---|---|---|
| cr-1 | Leslie Alexander | Product manager | PM, Flux | "Hi Artiom, I'm a big fan of your work. Let's connect!" | medium |
| cr-2 | Ralph Edwards | Product lead | Product lead, Flux | "Hello Artiom, I'd love to add you to my professional network." | low |
| cr-3 | Paula Mora | UX designer | UX designer, Flux | "Hi Artiom, I'm impressed with your experience. Connect with me!" | medium |
| cr-4 | Roberto Santos | Software engineer | Software engineer, Flux | "Hi Artiom, your background is impressive. I'd like to connect." | low |

### Connection Request Profiles (4 detailed)

| Name | Role | Last Seen | Level | Badges | Posts | Comments | Spaces |
|---|---|---|---|---|---|---|---|
| Leslie Alexander | Product manager | 10hr ago | 9 | Pro, Editor, +2 | 99 | 99 | 99 |
| Ralph Edwards | Product lead | 3hr ago | 7 | Pro, +1 | 45 | 128 | 12 |
| Paula Mora | Customer support specialist | 10hr ago | 9 | Pro, Editor, +2 | 99 | 99 | 99 |
| Roberto Santos | Software engineer | 1d ago | 5 | Pro | 22 | 67 | 8 |

---

## 7. inboxScenarioData.ts (Copilot DM Session)

### Exported Types

- `ScenarioMessage` — Union: heading, paragraph, summary-item, summary-deferred, ready-to-send, needs-you
- `ScenarioPill` — `{ label, variant, targetStep }`
- `InboxSyncCommand` — `{ activeTab?, selectedThread?, markRead?, badgeUpdates? }`
- `ScenarioStep` — `{ messages, pills?, inboxSync? }`
- `ReadyCard` — Pre-built draft suggestion
- `NeedsYouCard` — Card requiring human decision

### Scenario Flow (4 steps)

**Step 0 — Analysis & Ready Cards:**
- Message: "I've read all 12 DMs. 9 are routine — thank-yous, FAQ, and support issues. I have replies ready from your knowledge base and past messages. 3 need your decision."
- Displays: 10 ready cards
- Sync: DMs tab active

**Step 1 — Needs-You Cards:**
- Message: "9 sent. Now the 3 that need you:"
- Displays: 3 needs-you cards
- Sync: DMs tab active

**Step 2 — Decision Point:**
- Pills: "Show remaining" → Step 1, "Done for now" → Step 3

**Step 3 — Summary:**
- "9 routine replies sent"
- "1 guest pass approved for Tom Brown"
- "1 plan switch for Lisa Wong"
- "1 personal reply to Alex Chen"
- "12 DMs handled."
- Sync: Badge update (dms: 0)

### Ready Cards (10 auto-send drafts)

| ID | Name | Tag | Summary | Draft | Source |
|---|---|---|---|---|---|
| james-liu | James Liu | Thank you | Thanking for camera settings tip | "Glad it helped, James! Try those settings during golden hour — the results are stunning." | Your reply to similar, Mar 20 |
| emily-park | Emily Park | Thank you | Loved landscape composition lesson | "So glad to hear that, Emily! Lesson 5 builds on those concepts — I think you'll love it." | Your reply to similar, Mar 18 |
| david-kim | David Kim | Thank you | Praising the community | "That means a lot, David. The community learns from each other — your landscape shots have been inspiring others too." | Your reply to similar, Mar 15 |
| amy-torres | Amy Torres | Thank you | Thanks for portrait series feedback | "Your lighting choices in that series were really strong, Amy. Would love to see you experiment with rim lighting next." | Your feedback reply, Feb 20 |
| chen-wei | Chen Wei | FAQ | Can't find Lesson 3 | "Hi Chen! Go to your Dashboard → My Courses → Landscape Basics. Lesson 3 is in the 'Composition' module. If it's not showing, try logging out and back in — sometimes enrollment takes a moment to sync." | KB: Course Access FAQ |
| maria-santos | Maria Santos | FAQ | When is next live session | "Hi Maria! The next live session is this Thursday at 7pm EST — 'Night Photography Basics' with instructor Jake. I'll make sure you get a reminder 1 hour before." | KB: Live Sessions Schedule |
| chris-lee | Chris Lee | FAQ | Download lesson videos | "Hi Chris! Yes — on any lesson page, click the three-dot menu next to the video and select 'Download.' Videos are available in 720p and 1080p. Note: downloads expire after 30 days for licensing reasons." | KB: Video Downloads FAQ |
| nina-patel | Nina Patel | Support | Video stops at 3:42 | "Thanks for the detailed report, Nina. I've flagged this with our team — it looks like an encoding issue with that specific segment. We'll have it fixed within 24 hours. In the meantime, the lesson notes cover the same content if you want to keep going." | Your bug reply, Feb 12 |
| omar-hassan | Omar Hassan | Support | Payment failed on renewal | "Hi Omar! I can see the payment attempt — it looks like your card on file expired. I've sent you a secure link to update your payment method. Once updated, the renewal will process automatically. Let me know if you hit any issues." | Template: Payment Issues |
| sam-rodriguez | Sam Rodriguez | Support | Certificate not showing | "Hi Sam! I can see you completed the course — congratulations! The certificate usually generates within 24 hours. I've triggered a manual refresh on your account, so it should appear shortly. Check under Profile → Achievements." | KB: Certificate Issues |

### Needs-You Cards (3 decision cards)

**Tom Brown — Guest Pass Request:**
- Context: Member 5mo, 1 course, moderate activity
- Summary: "Asking for a guest pass for a photographer friend."
- Tradeoff: "3 guest passes granted this month, 2 converted to members. Referral program alternative: both get a free month."
- Option 1 ("Yes — 7-day pass"): "Absolutely, Tom! I've generated a 7-day guest pass for your friend. Here's the link: [guest-link]. They'll get full access to community spaces and one free course preview."
- Option 2 ("No — offer referral"): "Thanks for thinking of us, Tom! We don't do guest passes, but we have a referral program — if your friend signs up with your link, you both get a month free."

**Lisa Wong — Monthly to Annual Switch:**
- Context: Member 8mo, Monthly $29/mo, Active
- Summary: "Wants to switch from monthly to annual billing."
- Tradeoff: "$29/mo ($348/yr) vs $239/yr = $109 savings. 8 months on monthly — consistent engagement, likely long-term stay."
- Option 1 ("Approve switch"): "Great choice, Lisa! I've switched your plan to annual — you'll save $60/year. Prorated credit from current month applied."
- Option 2 ("Confirm terms first"): "Happy to help, Lisa! Annual is $239/yr vs $29/mo — that's $109 savings. Switch takes effect at next billing date. Want me to go ahead?"

**Alex Chen — Refund Request (Advanced Lighting):**
- Context: Founding member, $299/yr, renewed twice, first complaint
- Summary: "Refund request for Advanced Lighting ($49). Instructor inactive 3 weeks. Polite but frustrated."
- Tradeoff: "Founding member since Jun 2023. 47 posts, 2 completed courses. Zero previous complaints. Losing him costs more than the $49 refund."
- Draft: "Hi Alex, thanks for reaching out. You're right that Advanced Lighting schedule has slipped — I've spoken with instructor, new lessons coming next week. I'd like to offer complimentary month extension rather than refund, so you don't lose access while content catches up. Would that work for you?"

---

## 8. moderationScenarioData.ts (Copilot Moderation Session)

### Exported Types

- `ModerationMessage` — Extended message types: moderation-confirm-list, moderation-decide-list
- `ModerationStep` — Step with moderation-specific messages
- `ModerationConfirmCard` — `{ id, author, authorGroup, type, tag, preAssigned, contentPreview, fullContent, context, flaggedBy, copilotReasoning, memberContext }`
- `ModerationDecideCard` — `{ id, author, type, tag, fullContent, context, flaggedBy, tradeoff, tradeoffSource, actions }`

### Scenario Flow (4 steps)

**Step 0 — Overview & Confirm:**
- Message: "14 moderation items from the weekend, 4 people. 10 are clear-cut, 4 need your judgment."
- Displays: 8 confirm cards
- Sync: Moderation tab active, badge 14

**Step 1 — Judgment Calls:**
- Message: "10 confirmed. Now 4 items from Derek Hoffman that need your judgment."
- Displays: 4 decide cards

**Step 2 — Member Action Decision:**
- Message: "All 4 items handled. I don't think a member action is needed yet — Derek is generally a positive contributor."
- Pills: "No action needed" (recommended) → Step 3, "Flag for future moderation" → Step 3

**Step 3 — Summary:**
- "5 spam posts removed from Maria Santos"
- "3 bot items removed, accounts flagged"
- "2 comments from Jake Miller allowed (false positives)"
- "4 items from Derek Hoffman resolved"
- "14 items handled. Moderation queue clear."
- Pills: "Review course comments" → exit, "Done" → exit
- Sync: Badge update (moderation: 0)

### Confirm Cards (8 clear-cut decisions)

**Maria Santos — 5 Spam Posts (all REMOVE):**

| ID | Context | Content | Flagged By |
|---|---|---|---|
| m1 | Photography Basics | "Check out these amazing deals on camera gear at photogeardeals.store! Professional DSLRs starting at $299. Use code CIRCLE20 for 20% off." | Spam workflow + 3 reports |
| m2 | Landscape Tips | "Professional photographers swear by these lenses — get 20% off at photogeardeals.store! Reply for my referral link!" | Spam workflow |
| m3 | Street Photography | "Upgrade your street photography kit — exclusive discounts at photogeardeals.store. Sale ends Sunday!" | Spam workflow + 1 report |
| m4 | Gear Talk | "Best deals on tripods and stabilizers at photogeardeals.store! Flash sale this weekend only." | Spam workflow |
| m5 | Post-Processing | "Flash sale on editing software — use code PHOTO50 at photogeardeals.store for 50% off!" | Spam workflow + 2 reports |

Copilot reasoning: "Account 14 days old. 5 posts, all external links to same domain. 0 comments, 0 reactions. Also sent 2 promo DMs this week."

**Bot Accounts — 3 Items (all REMOVE):**

| ID | Author | Type | Content | Context |
|---|---|---|---|---|
| b1 | seo_expert_2025 | Post | "Top 10 SEO strategies for photographers in 2025! Visit seomaster.biz for free tools." | Photography Basics |
| b2 | digital_growth_pro | Post | "Maximize your online presence! Get free consultation at digitalgrowth.pro." | Landscape Tips |
| b3 | seo_expert_2025 | Connection | Connection request to Rachel Torres (top contributor) | Connection request |

Reasoning: Bot profiles, created 1-2 days ago, generic names, auto-generated bios, external links.

**Jake Miller — 2 False Positives (both ALLOW):**

| ID | Context | Content | Flagged By |
|---|---|---|---|
| j1 | on "Golden Hour Collection" | "this is damn incredible work, the tones are absolutely perfect. How did you get that warm amber in the shadows?" | Profanity filter |
| j2 | on "Studio Setup Tutorial" | "holy shit, the lighting in this one is perfect. The way you used the reflector is genius. Can you share your BTS setup?" | Profanity filter |

Reasoning: "Positive, enthusiastic comment. Casual language used as admiration. No hostility. Jake has 23 posts, all constructive."

### Decide Cards (4 judgment calls — all Derek Hoffman)

**Derek Hoffman context:** "8-month member, $99/yr, 31 posts, 2 courses completed. Runs a local photography meetup. Generally active and helpful, lately pushing boundaries."

| ID | Type | Tag | Content | Flagged By | Tradeoff |
|---|---|---|---|---|---|
| d1 | Post | Self-promo | "My meetup group launched a free weekend workshop on portrait lighting. Sign up at derekphoto.com/workshop." | 1 report: self-promotion | Free workshop, relevant, but external link + personal brand. Last 3 posts mentioned his meetup. |
| d2 | Post | Self-promo | "New Lightroom preset pack — 'Urban Grit' $29. Circle members get 40% off with code CIRCLE40." | 2 reports: selling, self-promo | Paid product promo — clearer violation. But Circle-exclusive discount shows community investment. |
| d3 | Comment | Harassment | "That's a really ignorant take. Maybe try actually learning the fundamentals before giving advice." | 1 report: hostile | Not profanity, not identity attack — but dismissive. Lena disengaged after this. |
| d4 | Message | Off-topic | "Off topic but I'm so frustrated with the platform upload speeds lately. Takes 5 minutes to post a photo." | 1 report: off-topic | Legitimate frustration, wrong channel. 3 others agreed in replies. |

Actions per card: Allow, Remove, (d3: DM Derek), (d4: Reply in thread)

---

## Summary Table

| Category | v1 | v1.5 | All-View | Copilot Scenario | Total |
|---|---|---|---|---|---|
| DMs | 13 | — | 3 | 13 (10 ready + 3 needs-you) | 13 |
| Chat Threads | — | 10 | 2 | — | 10 |
| Connections | — | 4 | 2 | — | 4 |
| Moderation | 13 | — | 2 | 12 (8 confirm + 4 decide) | 13 |
| Course Comments | 10 | — | 2 | — | 10 |
| AI Inbox | 10 | — | 1 | — | 10 |
| **Total unique** | **46** | **14** | **12** | **25** | **60** |

**Pre-built drafts:** 7 suggested replies + 8 AI assist interactions + 10 ready cards + 3 needs-you cards + 12 moderation scenario cards = **40 total**

**Moderation history:** 22 detailed records + 10 summary-only authors = **50 documented decisions**

**Member profiles:** 4 full (v1) + 4 connection request profiles (v1.5) = **8 total**
