# AI Companion — Frontend Specification

## Stack

- Next.js 16 (App Router) with React 19
- TypeScript (strict mode)
- Tailwind CSS v4 with shadcn/ui components
- Bun as package manager
- Mobile-first responsive design (dark-only theme)

---

## Route Structure

Use Next.js route groups to separate auth and authenticated layouts:

```
app/
  (auth)/
    login/page.tsx
    signup/page.tsx
    layout.tsx              ← Centered card layout, no nav
  (main)/
    dashboard/page.tsx
    companions/[id]/page.tsx
    chat/[id]/page.tsx
    memories/[id]/page.tsx
    layout.tsx              ← App shell with bottom nav (mobile) / sidebar (desktop)
  layout.tsx                ← Root layout (fonts, theme, providers)
  middleware.ts             ← Auth guard: redirect unauthenticated users to /login
```

---

## Data Models

```typescript
type User = {
  id: string
  email: string
  name: string
  avatarUrl: string | null
}

type Companion = {
  id: string
  name: string
  avatarUrl: string
  description: string
  mood: "happy" | "sad" | "excited" | "calm" | "anxious" | "neutral"
  relationshipLevel: number  // 0-100
  lastInteraction: string    // ISO date
}

type Story = {
  id: string
  companionId: string
  companionName: string
  companionAvatarUrl: string
  slides: StorySlide[]
  viewed: boolean
}

type StorySlide = {
  id: string
  type: "text" | "image"
  content: string            // text content or image URL
  backgroundColor?: string
  duration: number           // seconds to display
}

type Message = {
  id: string
  companionId: string
  role: "user" | "assistant"
  content: string
  createdAt: string
  isMemory: boolean
}

type Memory = {
  id: string
  companionId: string
  messageSnippet: string
  tag: string
  createdAt: string
}
```

---

## API Layer

All API calls go through `lib/api.ts`. The backend is a REST API at `process.env.NEXT_PUBLIC_API_URL`.

Auth token is stored in an HttpOnly cookie **set by the backend** on login/signup responses. The frontend sends credentials via `fetch` with `credentials: "include"`. Middleware reads the cookie to gate routes.

### Endpoints

```
POST   /api/auth/login        { email, password }        → { user }
POST   /api/auth/signup       { email, password, name }  → { user }
POST   /api/auth/logout                                  → {}
GET    /api/auth/me                                      → { user }

GET    /api/companions                                   → { companions[] }
GET    /api/companions/:id                               → { companion }

GET    /api/companions/:id/stories                       → { stories[] }
POST   /api/stories/:id/react  { emoji }                 → {}
POST   /api/stories/:id/view                             → {}

GET    /api/chat/:companionId/messages?cursor=            → { messages[], nextCursor }
POST   /api/chat/:companionId/messages  { content }      → ReadableStream (SSE)

POST   /api/messages/:id/memory                          → { memory }
DELETE /api/messages/:id/memory                          → {}

GET    /api/companions/:id/memories                      → { memories[] }
DELETE /api/memories/:id                                 → {}
```

Chat responses stream via **Server-Sent Events** so the AI reply appears token-by-token.

---

## Page Specifications

### Login / Signup (`(auth)`)
- Email + password form
- Client-side validation (required fields, email format, min password length)
- On success: redirect to `/dashboard`
- On error: show inline error message
- Link between login ↔ signup

### Dashboard (`(main)/dashboard`)
- **Stories row**: Horizontal scroll of companion avatars with ring indicator (unseen = gradient ring). Tap opens story viewer modal.
- **Companion cards**: Grid (1 col mobile, 2 col tablet, 3 col desktop). Each card shows avatar, name, mood badge, relationship bar, and last interaction time. Tap navigates to `/companions/[id]`.
- Data fetched on the server (RSC) with `loading.tsx` skeleton.

### Story Viewer (Modal)
- Full-screen overlay with dark background
- Progress bars at top (one per slide, auto-advancing)
- Tap left side = previous slide, tap right side = next slide
- Swipe or tap past last slide = close or advance to next companion's story
- Reaction bar at bottom: ❤️ 😢 😍 😡
- Close button (X) top-right
- Mark story as viewed on open

### Companion Profile (`(main)/companions/[id]`)
- Large avatar
- Name + description
- Mood badge (colored pill with emoji + label)
- Relationship level (progress bar with label like "Close Friend")
- Two action buttons: "Chat" → `/chat/[id]`, "Memories" → `/memories/[id]`

### Chat (`(main)/chat/[id]`)
- Message list scrolled to bottom on load
- User messages right-aligned (accent color), AI messages left-aligned (muted)
- On send: optimistic insert of user message, then stream AI response token-by-token
- Each AI message has a "⭐ Save Memory" toggle button
- Cursor-based pagination: scroll up to load older messages
- Sticky input bar at bottom with text input + send button
- Show typing indicator while AI streams

### Memories (`(main)/memories/[id]`)
- Vertical timeline with alternating left/right cards (desktop), stacked (mobile)
- Each card: message snippet, date, tag pill, delete button
- Confirm before delete
- Empty state: "No memories yet — start chatting to create some"

---

## Component Architecture

```
components/
  ui/                  ← shadcn/ui primitives (button, input, dialog, skeleton, etc.)
  story-viewer.tsx     ← Full-screen story modal with progress + navigation
  story-avatar.tsx     ← Single avatar circle with seen/unseen ring
  companion-card.tsx   ← Dashboard card for a companion
  mood-badge.tsx       ← Colored pill showing mood emoji + label
  relationship-bar.tsx ← Progress bar with level label
  chat-message.tsx     ← Single message bubble
  chat-input.tsx       ← Sticky bottom input with send button
  memory-card.tsx      ← Timeline card for a memory
  loading-skeleton.tsx ← Reusable skeleton patterns
  bottom-nav.tsx       ← Mobile navigation bar
```

---

## Hooks

```
hooks/
  use-auth.ts          ← Auth context: user state, login, signup, logout
  use-chat.ts          ← Send message, stream response, mark memory
  use-stories.ts       ← Story navigation state, mark viewed, react
```

---

## UX Requirements

- **Animations**: Fade-in on page transitions, smooth progress bar in stories, typing indicator pulse in chat
- **Loading**: Skeleton screens on dashboard (cards + story avatars), spinner on chat send
- **Empty states**: Meaningful messages with suggested actions
- **Error handling**: Toast notifications for API failures, inline errors on forms, `error.tsx` boundaries per route
- **Mobile-first**: Touch targets ≥ 44px, bottom nav on mobile, no hover-dependent interactions

---

## Non-Goals (Out of Scope)

- Real-time push notifications
- Voice/audio messages
- Image upload in chat
- Companion creation/editing (admin feature)
- Light theme (dark-only for v1)
- PWA / offline support
