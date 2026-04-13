# Circle 4.0 (UI Prototype)

Compass-first UI prototype for Circle admin/community surfaces.

This repository is intentionally **UI-only**: no backend, no database, no authentication, no APIs.

## Features

- **Compass-first UI**: all interactive UI primitives come from `@circleco/compass`
- **Admin + Community views**: prototyping of multiple product areas using mock data
- **Theming**: light/dark theme via `ThemeContext` + Compass tokens
- **Tables**: `TableEnhanced` is an adapter around Compass `DataTable`
- **Filters & actions**: reusable patterns for table pages (Actions, Pagination, Filters)

## Project rules (non-negotiable)

- **Use Compass components for every UI element** (especially interactive ones)
- **No custom UI primitives** (no local Button/Input/Select components)
- **No raw HTML interactive elements** (`<button>`, `<input>`, `<select>`, `<textarea>`)
- **Tailwind is allowed only for layout/spacing** (composition), not for reinventing UI controls

## Tech stack

- **React + TypeScript**
- **Vite**
- **Tailwind (Compass preset/tokens)**
- **@circleco/compass** UI components

## Setup

### Prerequisites

- Node.js (see `package.json` engines implied by dependencies)
- npm

2. Install dependencies:

```bash
npm install
```

### Useful scripts (non-server)

```bash
npm run type-check
npm run lint
npm run build
```

Note: this repo is a Compass-first prototype; we avoid documenting dev-server commands here on purpose.

## Project Structure

```
src/
├── components/               # Screens + composed UI
│   ├── ContentContainer/     # Standard page shell (title, tabs, filters)
│   ├── ui/                   # Shared UI composition (Actions, Pagination, TableEnhanced)
│   └── ...                   # Feature pages (Workflows, Audience, Invite links, etc.)
├── context/                  # ThemeContext (light/dark)
├── data/                     # Mock data (prototype-only)
├── types/                    # Shared TypeScript types
├── App.tsx                   # Providers + routing
└── index.css                 # Tailwind + Compass CSS imports + a few globals
```

## Key Components

### `ThemeContext`

- Applies `dark` class + `data-theme="dark"` on `document.documentElement`
- `App.tsx` passes `portalClassName={theme}` into `CompassProvider` so portals match theme

### `ContentContainer`

- Standard page layout wrapper: header, optional tabs, optional filters, scroll container

### `TableEnhanced` (adapter)

- Located at `src/components/ui/table-enhanced.tsx`
- Wraps Compass `DataTable` while keeping legacy props shape used across pages
- Selection is bridged from Compass `onRowSelectionChange(selectedRowIds)` to existing `selectedItems/onSelectItem/onSelectAll`

### Compass `Select` value shape

- Compass `Select` expects `value` to be a **`SelectOption | null`**, not a raw string.
- Pages store strings in local state and map them to/from options at the component boundary.

## Notes

- This is a prototype repo; optimize for speed and correct UI composition over “production architecture”.
- If a Compass component exists for something, use it directly (no wrappers/re-exports).

## Technologies Used

- **@circleco/compass**
- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**

## License

MIT (see `LICENSE` if present).
