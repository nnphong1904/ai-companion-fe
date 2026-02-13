# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Companion — a Next.js 16 app for chatting with AI companions, featuring Instagram-style stories, mood/relationship tracking, chat with memory saving, and a memory timeline. Dark-only theme, mobile-first.

## Commands

```bash
bun dev          # Start dev server on http://localhost:3000
bun run build    # Production build
bun start        # Start production server
bun run lint     # Run ESLint
```

Package manager is **Bun**. Use `bunx shadcn add <component>` to add shadcn/ui components.

## Architecture

### Route Structure

Uses Next.js App Router with route groups to separate auth and authenticated layouts:

- `(auth)/` — login, signup (centered card layout, no nav)
- `(main)/` — dashboard, companions/[id], chat/[id], memories/[id], insights/[id] (app shell with bottom nav)
- Root layout applies dark class, AuthProvider, Toaster

### Key Layers

- **`types/`** — All shared TypeScript types (User, Companion, Story, Message, Memory, Mood)
- **`lib/api-fetch.ts`** — Centralized API layer with `fetchApi<T>()`, backend types, and transforms. All data fetching goes through here.
- **`lib/mood.ts`** — Mood config (emoji, label, colors) and relationship level labels
- **`lib/format.ts`** — Date formatting utilities
- **`hooks/`** — Client-side state hooks:
  - `use-auth.tsx` — Auth context provider with login/signup/logout actions (composition pattern: state/actions interface)
  - `use-chat.ts` — Message state, optimistic send, memory toggling
  - `use-stories.ts` — Story viewer state machine (progress, navigation, auto-advance)
- **`components/`** — Shared UI components (mood-badge, companion-card, story-viewer, chat-message, etc.)
- **`components/ui/`** — shadcn/ui primitives (button, card, dialog, skeleton, etc.)

### Data Flow

Server components fetch data via feature-scoped query files (e.g., `features/companions/queries.ts`) which call `fetchApi()`. Data is transformed from backend snake_case to frontend camelCase. Client components receive initial data as props and use hooks for mutations.

### Patterns

- Auth context uses the **state/actions/meta** composition pattern for dependency injection
- Story viewer uses a **ref-based callback pattern** (`advanceRef`) to avoid stale closures in intervals
- Chat uses **optimistic UI** — user message is inserted immediately before API response
- shadcn/ui components are used as-is from `components/ui/`; custom components compose them

## Path Aliases

`@/*` maps to project root (e.g., `@/lib/utils`, `@/components/ui/button`).

## shadcn/ui Configuration

Configured in `components.json`:

- Components go in `components/ui/`
- Hooks go in `hooks/`
- Style: new-york, base color: slate, icon library: lucide
- RSC and TSX enabled

  ***

  # Backend API Reference

  ## Server
  - Base URL: http://localhost:8080/api
  - CORS allowed origin: http://localhost:3000

  ## Authentication
  - POST /api/auth/signup — body: { email, password, name } → { data: { token, user } }
  - POST /api/auth/login — body: { email, password } → { data: { token, user } }
  - GET /api/auth/me → { data: user }
  - All protected routes require header: Authorization: Bearer <JWT_TOKEN>
  - Token expires in 24 hours

  ## Companions
  - GET /api/companions → { data: Companion[] }
  - GET /api/companions/:id → { data: Companion }

  Companion: { id, name, description, avatar_url, personality, created_at }

  Pre-seeded companions: Luna, Kai, Nova, Ember, Zephyr

  ## Onboarding
  - POST /api/onboarding/select-companion — body: { companion_id } → { data: RelationshipState }

  ## Messages (Chat)
  - POST /api/companions/:id/messages — body: { content } → { data: [userMessage, companionMessage] }
    Returns both the user message and AI-generated companion reply as an array of 2 messages.
  - GET /api/companions/:id/messages?cursor=<timestamp>&limit=20 → { data: { messages, next_cursor, has_more
    } }
    Cursor-based pagination, newest first. cursor is RFC3339Nano timestamp.

  Message: { id, user_id, companion_id, content, role ("user"|"companion"), created_at }

  ## Stories
  - GET /api/stories → { data: Story[] } (active stories with media)
  - GET /api/companions/:id/stories → { data: Story[] }
  - POST /api/stories/:id/react — body: { media_id, reaction } → { data: { status: "ok" } }
    Valid reactions: "love", "sad", "heart_eyes", "angry"

  Story: { id, companion_id, created_at, expires_at, media: StoryMedia[] }
  StoryMedia: { id, story_id, media_url, media_type ("image"|"video"), duration, sort_order, created_at }

  ## Relationships
  - GET /api/relationships → { data: RelationshipState[] }
  - GET /api/companions/:id/relationship → { data: RelationshipState }

  RelationshipState: { id, user_id, companion_id, mood_score (0-100), relationship_score (0-100), mood_label,
  last_interaction, updated_at }

  Mood labels: <20 "Distant", 20-50 "Neutral", 50-80 "Happy", 80+ "Attached"
  Time decay: -0.5 mood points per hour of inactivity (calculated at read time)

  ## Memories
  - GET /api/companions/:id/memories → { data: Memory[] } (ordered: pinned first, then newest)
  - POST /api/companions/:id/memories — body: { content, tag? } → { data: Memory }
  - DELETE /api/memories/:id → { data: { status: "deleted" } }
  - PATCH /api/memories/:id/pin → { data: Memory } (toggles pinned)

  Memory: { id, user_id, companion_id, content, tag?, pinned, created_at }

  ## Anonymous Browsing
  - GET /api/browse/companions → { data: Companion[] } (no auth required)
  - GET /api/browse/companions/:id → { data: Companion } (no auth required)

  ## Insights
  - GET /api/companions/:id/insights → { data: InsightsResponse }

  InsightsResponse: {
    mood_history: [{ date, mood_score, mood_label }],
    streak: { current, longest },
    milestones: [{ key, title, description, achieved }],
    stats: { total_messages, total_memories, first_message, days_together }
  }

  ## Response Format
  - Success: { data: ... }
  - Error: { error: "message" }
  - All responses are application/json

  ## Side Effects
  - Sending a message: mood_score +2, relationship_score +1
  - Reacting to a story: mood_score +3, relationship_score +2
  - Story reactions have UNIQUE constraint on (user_id, media_id)
