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
- `(main)/` — dashboard, companions/[id], chat/[id], memories/[id] (app shell with bottom nav)
- Root layout applies dark class, AuthProvider, Toaster

### Key Layers

- **`types/`** — All shared TypeScript types (User, Companion, Story, Message, Memory, Mood)
- **`lib/api.ts`** — API layer (currently returns mock data via `lib/mock-data.ts`). All data fetching goes through here.
- **`lib/mood.ts`** — Mood config (emoji, label, colors) and relationship level labels
- **`lib/format.ts`** — Date formatting utilities
- **`hooks/`** — Client-side state hooks:
  - `use-auth.tsx` — Auth context provider with login/signup/logout actions (composition pattern: state/actions interface)
  - `use-chat.ts` — Message state, optimistic send, memory toggling
  - `use-stories.ts` — Story viewer state machine (progress, navigation, auto-advance)
- **`components/`** — Shared UI components (mood-badge, companion-card, story-viewer, chat-message, etc.)
- **`components/ui/`** — shadcn/ui primitives (button, card, dialog, skeleton, etc.)

### Data Flow

All pages are client components that fetch via `lib/api.ts`. To swap in a real backend, replace the mock implementations in `api.ts` — the component layer doesn't change.

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
