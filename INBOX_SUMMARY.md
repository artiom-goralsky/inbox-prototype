# Project Summary: agentic-4.0-eclipse (Circle 4.0 Prototype)

## 1. Tech Stack

**Framework:** React 18 + Vite 7 (НЕ Next.js — pure SPA, нет SSR)
**Language:** TypeScript 5.9
**Routing:** `react-router-dom` v7 (`BrowserRouter`)
**CSS:** Tailwind CSS v3 + `@circleco/compass` (собственная design system Circle)
**UI Library:** `@circleco/compass@0.0.74` — **единственный источник UI примитивов**
**Прочее:** `motion` (Framer Motion), `@xyflow/react`, `@dnd-kit/*`

**Правило проекта (строгое):** никаких raw HTML-элементов (`<button>`, `<input>`, `<select>`). Только Compass компоненты. Tailwind — только для layout/spacing.

---

## 2. Файловая структура (полный список)

```
src/
├── App.tsx                          # Root: ThemeProvider + Router + layout shell
├── index.css                        # Tailwind base + Compass CSS + shimmer animations
├── index.tsx                        # Entry point
├── context/ThemeContext.tsx         # light/dark theme
├── data/                            # Mock data (chatData, mockData, firstLevelNavigation)
├── hooks/useScrollHideTabs.ts
├── lib/utils.ts
├── types/index.ts
├── utils/                           # csvExport, dateFormatter, filterHelpers
│
├── components/
│   ├── InboxPage/                   # ← ОСНОВНАЯ ЗОНА
│   │   ├── InboxPage.tsx            # Root orchestrator
│   │   ├── InboxNavbar.tsx          # Left nav sidebar (220px)
│   │   ├── ChatList.tsx             # Conversation list (260px)
│   │   ├── ChatWindow.tsx           # Main chat area (flex-1)
│   │   ├── UserProfile.tsx          # Right details panel (300px)
│   │   ├── DateSeparator.tsx
│   │   └── index.ts
│   │
│   ├── AIInbox/AIInbox.tsx          # Отдельный AI Inbox компонент
│   │
│   ├── shared/                      # AI/Copilot shared components
│   │   ├── AgentMessageBox.tsx
│   │   ├── AssetDetailSidebar.tsx
│   │   ├── ClarifyingQuestions.tsx
│   │   ├── PlanCard.tsx
│   │   ├── FlyingInput.tsx
│   │   └── ...
│   │
│   ├── ui/                          # Table/filter utilities
│   │   ├── table-enhanced.tsx       # DataTable wrapper
│   │   ├── pagination.tsx
│   │   ├── actions.tsx
│   │   ├── filters.tsx / filter-modal.tsx
│   │   ├── bulk-actions-dropdown.tsx
│   │   ├── switch.tsx
│   │   ├── sidebar.tsx
│   │   └── index.ts
│   │
│   ├── ContentContainer/            # Page wrapper (header + tabs + filters)
│   ├── CopilotView/                 # Copilot conversation UI
│   ├── Dashboard/
│   ├── AdminSection/                # Admin shell
│   └── ...                          # ~40+ других feature-компонентов
```

---

## 3. Inbox компонент — архитектура

**Корневой файл:** `src/components/InboxPage/InboxPage.tsx`

```tsx
// InboxPage.tsx — orchestrator, 4-колоночный layout
const InboxPage: React.FC = () => {
  const [activeNav, setActiveNav] = useState('all');
  const [navClosed, setNavClosed] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(…);

  return (
    <div className="h-full bg-primary flex min-h-0">
      {!navClosed && <InboxNavbar … />}   {/* 220px */}
      <ChatList … />                       {/* 260px, shrink-0 */}
      <ChatWindow … />                     {/* flex-1 */}
      <DetailsPanel />                     {/* 300px, shrink-0 */}
    </div>
  );
};
```

**Состояния:** все локальные (`useState`), нет Redux/Zustand/Context для Inbox.

---

## 4. Субкомпоненты Inbox + их импорты

### `InboxNavbar.tsx` — `src/components/InboxPage/InboxNavbar.tsx`
```tsx
import { Typography } from '@circleco/compass/components/Typography';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Tooltip } from '@circleco/compass/components/Tooltip';
```
Ширина: `w-[220px]`. Содержит: header, nav items (MAIN_NAV, VIEWS, FIN_AI_NAV), collapsible sections. Кнопка-affordance для закрытия (анимированная полоска).

Nav items (MAIN_NAV):
- `all` — All (count: 11)
- `my-dms` — My DMs (count: 3)
- `content-moderation` — Content moderation (count: 2)
- `course-engagement` — Course engagement (count: 5)
- `ai-inbox` — AI Inbox (count: 8)

### `ChatList.tsx` — `src/components/InboxPage/ChatList.tsx`
```tsx
import { Typography } from '@circleco/compass/components/Typography';
import { IconButton } from '@circleco/compass/components/IconButton';
```
Ширина: `w-[260px] shrink-0`. Данные: 11 mock-разговоров (`CONVERSATIONS[]`). Поддерживает `selectedId` highlight (`bg-active`) и hover (`bg-hover`). View toggle grid/list внизу.

### `ChatWindow.tsx` — `src/components/InboxPage/ChatWindow.tsx`
```tsx
import { Typography } from '@circleco/compass/components/Typography';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Button } from '@circleco/compass/components/Button';
import { Avatar } from '@circleco/compass/components/Avatar';
import type { Conversation } from './ChatList';
```
Ширина: `flex-1`. Три типа сообщений:
- `outgoing` — right-aligned, `bg-[#eef2ff]`, rounded-2xl rounded-tr-sm
- `incoming` — left, `bg-secondary`, rounded-2xl rounded-tl-sm
- `system` — centered divider с текстом

Reply composer внизу: `border rounded-xl`, contentEditable textarea, кнопка Send с `endIcon="chevron-down"`.

### `UserProfile.tsx` (DetailsPanel) — `src/components/InboxPage/UserProfile.tsx`
```tsx
import { Typography } from '@circleco/compass/components/Typography';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Button } from '@circleco/compass/components/Button';
```
Ширина: `w-[300px] shrink-0`. Tabs: Details / Copilot (tab indicator: `bg-[#ef4444]`). Содержит: Assignee, Team Inbox, Links (collapsible), Conversation attributes (collapsible).

---

## 5. Layout / Shell

**Файл:** `src/App.tsx`

```
┌──────────────────────────────────────────────────────────────┐
│  h-screen, bg-secondary, overflow-hidden                     │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ flex, app-main-flex                                    │  │
│  │  ┌──────────────┐  ┌────────────────────────────────┐ │  │
│  │  │ Nav column   │  │ Content inset (flex-1, min-w-0)│ │  │
│  │  │ w: 68px      │  │  ┌───────────┐ ┌────────────┐  │ │  │
│  │  │ (community   │  │  │ Copilot   │ │ Content    │  │ │  │
│  │  │ dock)        │  │  │ panel     │ │ card       │  │ │  │
│  │  │ OR           │  │  │ (flex: 3  │ │ (flex: 7   │  │ │  │
│  │  │ w: 222px     │  │  │ when open)│ │ default)   │  │ │  │
│  │  │ (admin nav)  │  │  └───────────┘ └────────────┘  │ │  │
│  │  └──────────────┘  └────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**Inbox** рендерится как `renderContent()` → `case 'inbox': return <InboxPage />` внутри content card. Content card — `overflow-hidden`, `border-x border-primary`, `shadow-2xs`. InboxPage сам по себе `h-full flex`.

---

## 6. Роутинг

**Тип:** URL-based routing через `react-router-dom`. Нет `<Route>` компонентов — `AppContent` парсит `location.pathname` вручную через `pathSegments`.

```
/inbox          → InboxPage
/manage/*       → AdminSection
/clarity        → Community (light theme)
/framer         → Community (dark theme)
/discover       → Discovery
```

InboxPage не имеет вложенного роутинга — все переходы между вкладками через локальный `useState`.

---

## 7. UI-примитивы (Compass + shared)

**Compass компоненты** (все из `@circleco/compass/components/...`):

| Компонент | Импорт | Ключевые пропы |
|-----------|--------|----------------|
| `Typography` | `.../Typography` | `variant`: heading-xl/lg/md/sm, label-md/sm/xs, body-md/sm, caption; `color`: primary, secondary, tertiary |
| `IconButton` | `.../IconButton` | `variant`: ghost/outline/primary; `size`: sm/md/lg; `icon`: строка-имя |
| `Button` | `.../Button` | `variant`: primary/ghost/outline; `size`: sm/md; `endIcon`, `startIcon` |
| `Avatar` | `.../Avatar` | используется в ChatWindow/UserProfile |
| `Tooltip` | `.../Tooltip` | `content`, `side`, `sideOffset` |

**Shared компоненты** (`src/components/shared/`):
- `AgentMessageBox.tsx` — reply input с shimmer-эффектом
- `AssetDetailSidebar.tsx` — resizable push/flyover panel
- `ClarifyingQuestions.tsx` — multi-step Q&A card
- `PlanCard.tsx` — structured plan display

**UI утилиты** (`src/components/ui/`):
- `TableEnhanced` — Compass DataTable wrapper
- `Pagination`, `Actions`, `Filters`, `FilterModal`, `FilterChip`, `EnhancedFilters`
- `BulkActionsDropdown`, `Switch`, `SidebarToggle`, `Sidebar`

---

## 8. Стилизация — паттерны

**Подход:** Tailwind utility classes через `className`. CSS-modules не используются. Inline styles — только для динамических значений (цвета из данных, flex ratios).

**Compass semantic tokens (меняются с темой light/dark):**
```tsx
className="bg-primary"         // фон страницы
className="bg-secondary"       // приподнятые поверхности
className="bg-active"          // выбранный элемент
className="bg-hover"           // hover state
className="border-secondary"   // dividers
className="border-primary"     // внешние границы
// Цвет текста — через Typography color prop, не className
```

**Статические цвета — только когда Compass токена нет:**
```tsx
className="bg-[#eef2ff]"            // outgoing message bubble (indigo-50)
className="bg-[#ef4444]"            // tab active indicator
className="bg-[#3b82f6]"            // notification dot
style={{ backgroundColor: conv.color }}  // динамический цвет из данных
```

**Inline styles используются для:**
- `flex` ratio (copilot panel: `flex: 3`, content: `flex: 7`)
- `width` с пиксельными значениями (`width: 222`)
- Кастомные `transition` с cubic-bezier

---

## Ключевые ограничения для промптов

1. **Никаких `<button>`, `<input>`, `<select>`** — только `Button`, `IconButton`, `Select` из Compass
2. **Все иконки** — через `icon="icon-name"` prop в `IconButton` (строки, не SVG-импорты), кроме случаев когда нужен нестандартный SVG
3. **Все цвета** — через Compass токены (`bg-primary`, `text-tertiary`), только если токена нет — `bg-[#hex]`
4. **Вся типографика** — только `<Typography variant="..." color="...">`
5. **Состояние** — локальный `useState`, никакого глобального store
6. **Layout Inbox:** `flex` row, фиксированные ширины: `220px` (nav) + `260px` (list) + `flex-1` (chat) + `300px` (details)
7. **Tailwind только для layout/spacing** — не для кастомизации цветов кнопок, инпутов и т.д.
