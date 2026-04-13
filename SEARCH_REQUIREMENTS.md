# In-Conversation Search — Inline Pattern

## Context

The file to modify is:

```
src/components/InboxPage/DMCenterPanel.tsx
```

This component renders a DM conversation with a header, a scrollable message list, and a reply composer. It already uses Compass correctly (`IconButton`, `Typography`, `Avatar`).

There is no existing search UI. This document specifies adding it from scratch.

---

## Compass First

Every UI element must come from `@circleco/compass`. Before writing any code, verify the exact props for each component:

```bash
cat node_modules/@circleco/compass/components/SearchInput/index.d.ts
cat node_modules/@circleco/compass/components/IconButton/index.d.ts
cat node_modules/@circleco/compass/components/Typography/index.d.ts
```

Do not guess prop names. Do not create custom components.

---

## What to Build

Replace the current header in `DMCenterPanel` with a header that has two modes: **default** and **search**.

---

## Mode 1: Default Header (current state, slightly extended)

```
[ Avatar ]  [ Person name ]  ...  [ 🔍 search IconButton ]  [ × close IconButton ]
```

Add a search `IconButton` (icon: `"search"`) to the right side of the existing header, before the existing close button. Clicking it switches the header to search mode.

---

## Mode 2: Search Header (replaces the default header row)

```
[ SearchInput — auto-focused ]  [ "3 of 7" Typography ]  [ ↑ IconButton ]  [ ↓ IconButton ]  [ × IconButton ]
```

- **`SearchInput`** — use `@circleco/compass/components/SearchInput`. Auto-focus on mount. Placeholder: `"Search in conversation"`. Takes up remaining flex space.
- **Counter** — `Typography` showing `"3 of 7"`, `"No results"`, or nothing when query is empty.
- **Previous** — `IconButton` icon `"chevron-up"` or `"arrow-up"`, `variant="ghost"`, `size="sm"`. Goes to the previous match.
- **Next** — `IconButton` icon `"chevron-down"` or `"arrow-down"`, `variant="ghost"`, `size="sm"`. Goes to the next match.
- **Close** — `IconButton` icon `"cross"`, `variant="ghost"`, `size="sm"`. Exits search mode.

The header height and border must stay identical to the default header (`h-14 px-4 border-b border-secondary`).

---

## State

Add three state values to `DMCenterPanel`:

```ts
const [isSearchActive, setIsSearchActive] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const [activeMatchIndex, setActiveMatchIndex] = useState(0);
```

Derive everything else. No additional state.

---

## Search Logic

- Match is **case-insensitive substring** against `message.text` only.
- Compute `matchingIds: string[]` — an ordered list of message IDs whose `.text` contains the query.
- Run on every query change. Reset `activeMatchIndex` to `0` on every query change.

---

## Message Highlighting

Modify `MessageRow` to accept two extra optional props:

```ts
isMatch?: boolean;
isActiveMatch?: boolean;
matchQuery?: string;
```

Rendering rules:

- **No query active**: render normally.
- **Query active, message does not match** (`!isMatch`): wrap the `Typography` body text in a `div` with `className="opacity-40"`.
- **Query active, message matches but not active** (`isMatch && !isActiveMatch`): render the message body with the matched substring wrapped in `<mark className="bg-yellow-200 rounded-sm">`. The rest of the text renders normally. Do not use dangerouslySetInnerHTML — split the string and render spans.
- **Active match** (`isActiveMatch`): same as above but use `bg-yellow-400` for the `<mark>`.

---

## Scroll to Active Match

Each `MessageRow` needs a `ref` when it is the active match. On `activeMatchIndex` change, call:

```ts
activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
```

---

## Navigation Behavior

- **Next** button / `Enter` key: `setActiveMatchIndex(i => (i + 1) % matchingIds.length)`
- **Previous** button / `Shift+Enter`: `setActiveMatchIndex(i => (i - 1 + matchingIds.length) % matchingIds.length)`
- Both buttons are disabled (pass `disabled` prop if Compass supports it, otherwise render them at `opacity-40 pointer-events-none`) when `matchingIds.length === 0`.

---

## Counter Text

```ts
const counterText =
  searchQuery === ''        ? '' :
  matchingIds.length === 0  ? 'No results' :
                              `${activeMatchIndex + 1} of ${matchingIds.length}`;
```

---

## Closing Search

When the close `IconButton` is clicked or `Escape` is pressed:

```ts
setIsSearchActive(false);
setSearchQuery('');
setActiveMatchIndex(0);
```

Do not scroll. Leave the conversation at its current position.

---

## Keyboard Events

Attach a `keydown` listener to the search header container (or the `SearchInput` if it exposes `onKeyDown`):

- `Escape` → close search
- `Enter` → next match
- `Shift+Enter` → previous match

---

## Resetting on Thread Switch

When `selectedId` changes, reset all three search state values to their defaults. Add `selectedId` to the existing `useEffect` cleanup or add a new one:

```ts
useEffect(() => {
  setIsSearchActive(false);
  setSearchQuery('');
  setActiveMatchIndex(0);
}, [selectedId]);
```

---

## Out of Scope

- No filters (sender, date, type)
- No right-side results panel
- No animation on header transition
- No search of sender names or timestamps
- No persistence between sessions
