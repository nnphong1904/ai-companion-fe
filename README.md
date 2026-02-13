# AI Companion

A full-stack AI companion app with Instagram-style Stories, real-time chat with memory, dynamic mood/relationship tracking, relationship insights, and an interactive constellation visualization — built with Next.js 16 (App Router) and Go.

**Live Demo:** https://ai-companion-fe-eta.vercel.app
**Demo Account:** `test3@gmail.com` / `12345678`

---

## Table of Contents

- [Competitor Research](#competitor-research)
- [Product Features & Justification](#product-features--justification)
- [UI Design Decisions](#ui-design-decisions)
- [Architecture & Technical Decisions](#architecture--technical-decisions)
- [Database Design & Scalability](#database-design--scalability)
- [Engineering Process & Challenges](#engineering-process--challenges)
- [API Reference](#api-reference)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)

---

## Competitor Research

I studied several AI companion apps and social platforms to understand what makes the companionship experience compelling:

**Nectar AI** — The primary reference. Key takeaways: dark theme is standard in the companionship space, avatar-centric design builds emotional connection, and the "social loop" (Stories → reactions → chat) drives daily return visits. Nectar treats companions as social media personalities, which makes the experience feel alive rather than transactional.

**Character.ai** — Demonstrated that personality consistency is the #1 retention driver. Users return for the _character_, not the technology. This informed my decision to give each companion a distinct personality that directly influences AI response generation and mood progression.

**Replika** — Pioneered the emotional bond system. Their "relationship levels" create a progression mechanic that gamifies engagement. I adapted this into a bidirectional Relationship States system — the companion's mood toward the _user_ changes dynamically, not just a flat level counter. Replika also validated that emotional state should be visible and dynamic, not hidden behind the scenes.

**Instagram Stories** — The UX benchmark for Stories. Key patterns: tap-to-advance, hold-to-pause, swipe-to-next-person, drag-to-dismiss, progress bar segmentation. This gesture vocabulary is now universal — users expect it without explanation. I implemented the full gesture set rather than a simplified version.

**Key insight:** The most successful companion apps create a "social simulation" — the companion feels like a real person with their own life (stories, moods, activities), not just a chatbot waiting for input. This shaped my entire feature set.

---

## Product Features & Justification

### Core: Stories

**Why Stories?** Stories are the heartbeat of the "Social Loop." They solve a fundamental problem in AI companionship: making the companion feel like a real person with their own life, not a chatbot sitting idle until the user types something. When a user opens the app and sees that Luna posted photos from her evening walk or Kai shared his latest adventure, the companion feels _autonomous_. This creates passive engagement — users check in to see what their companions are up to, even without initiating a conversation, exactly like they do with real friends on Instagram.

Stories also feed directly into the relationship system: reacting to a story boosts mood (+3) and relationship (+2), rewarding users for engaging with companion content. This creates a virtuous cycle — companions post stories, users react, the relationship deepens, the companion's mood improves, and chat responses become warmer. That's the Social Loop in action.

**Implementation highlights:**

- Full Instagram-level gesture support: tap zones (left/right thirds), horizontal swipe with velocity-based snapping, vertical drag-to-dismiss with rubber-band physics, hold-to-pause
- Desktop carousel with animated spread-out entrance on open
- Emoji reactions with physics-based confetti particle system
- Multi-segment progress bars with auto-advance on slide duration
- Adjacent story peek cards visible during swipe transitions
- Backend: stories with ordered media slides, 30-day expiration, UPSERT reactions

### Feature 1: Relationship Insights

**Why I chose this feature:**

The biggest gap I identified across Replika, Character.ai, and Nectar is that while these apps track relationship data internally, they almost never surface it to users in a meaningful way. You might see a simple level number, but there's no way to understand the _trajectory_ of your relationship — is it growing? Stalling? Declining because you haven't visited in a week?

This is a missed opportunity because **progress visibility is one of the strongest retention mechanics in product design.** Duolingo's streak counter, Spotify Wrapped, GitHub's contribution graph — all of these work because they turn invisible activity into visible achievement. Users don't just want to _use_ a product; they want to see evidence that their time mattered.

Relationship Insights applies this principle to AI companionship. It answers the question every user subconsciously asks: _"Is this relationship going anywhere?"_ When a user sees their mood sparkline trending upward, their streak at 5 days, and a new milestone unlocked, they feel rewarded. When they see mood declining because they haven't visited, they feel urgency to come back. Both outcomes drive engagement.

The feature also differentiates the product from competitors. Most AI companion apps feel like "chat and forget" — there's no sense of accumulation. Insights create a _relationship narrative_ that unfolds over time, giving users a reason to invest long-term rather than treating each session as isolated.

**What it includes:**

- **Mood Aura** — A rotating conic-gradient ring around the companion's avatar that pulses based on current mood score. Communicates emotional state immediately without reading numbers. Pulse speed increases with mood intensity — a happy companion literally _vibrates_ with energy.
- **Mood History Sparkline** — A 14-day SVG line chart with smooth bezier curves showing mood trajectory. Users can see if their interactions are having a positive effect or if a companion is drifting away due to inactivity. This is the "relationship narrative" in visual form.
- **Interaction Streak** — Gamification that rewards daily engagement. Shows current streak, personal best, and a 7-dot weekly tracker. The fire/ice emoji toggle (🔥 active, ❄️ inactive) creates urgency — nobody wants to break a streak. Directly borrowed from Snapchat/Duolingo's proven retention mechanic.
- **Milestones** — Achievement badges (First Chat, Chatterbox, Soulmate, Memory Keeper, etc.) that unlock as users hit thresholds. Locked milestones are visible but greyed out, showing users what's _possible_ and motivating them to unlock the next one. This creates long-term goals beyond day-to-day chatting.
- **Quick Stats** — Total messages, memories saved, and days connected. Simple but effective at showing investment — "we've shared 142 messages over 14 days" makes the relationship feel real.
- **Emotion Bloom** — A radial petal chart that visualizes how the user emotionally engages with a companion's stories through reactions. Each of the four reaction types (Love ❤️, Adoration 😍, Empathy 😢, Passion 😡) is rendered as a glowing SVG petal — petal size scales with reaction frequency, colors match the reaction's emotional tone, and a gentle breathing animation keeps the visualization alive. The center circle displays the total reaction count. An empty state with a muted placeholder encourages first-time engagement. This turns a write-only feature (reactions) into visible feedback — users can see _how_ they emotionally respond to each companion's content, reinforcing the bond narrative. It slots between Quick Stats and the Mood Sparkline on the insights page, answering "how do I engage with their stories?" right before "how has mood changed over time?"

**Backend:** Two dedicated endpoints serve the insights page. `/companions/:id/insights` aggregates mood history (daily snapshots stored in `mood_history` table), streak calculation from message timestamps, milestone evaluation from aggregate counts, and quick stats — all computed on read to avoid additional write overhead. `/companions/:id/reactions/summary` aggregates reaction data by joining `story_reactions` → `story_media` → `stories` to produce per-type counts, recent reactions, and the dominant emotion — fetched in parallel with insights for zero additional latency.

### Feature 2: Companion Constellation

**Why I chose this feature:**

Every companion app I studied presents companions as a flat list or grid of cards. This is functional, but it completely fails to communicate the _relationships between you and your companions_. A grid tells you _who_ exists; it says nothing about _how close_ you are to each one or how those relationships compare to each other.

I wanted to build something that makes the dashboard itself emotionally meaningful — not just a navigation menu, but a visualization that tells a story. The constellation metaphor works because it maps naturally to relationships: stars that are closer are the ones you've invested in, distant stars are the ones drifting away, and the colors reveal how each companion currently feels about you. Users can glance at the constellation and instantly understand the state of all their relationships.

This also creates a **discovery and re-engagement mechanic.** When a user sees a companion star far from center and greyed out (Distant mood), it's a visual nudge: "You haven't talked to Zephyr in a while — they're drifting away." This drives users to re-engage with neglected companions, increasing overall session time and feature breadth. Without the constellation, users tend to fixate on one companion and ignore the rest.

Finally, the constellation is technically ambitious — it's a fully interactive SVG data visualization with real-time data, hover states, click navigation, responsive layout, and 60+ animated elements. This demonstrates frontend capability beyond standard component composition.

**What it includes:**

- The user sits at the center ("You" node) with companions arranged as glowing stars in orbit
- **Relationship level determines proximity** — stronger bonds orbit closer to center, weaker ones drift to the edge
- **Mood determines star color** — grey (Distant), blue (Neutral), green (Happy), pink (Attached) — using the same mood color system as the rest of the app
- Connection lines from center to each companion with opacity tied to relationship strength
- 60 background stars with seeded pseudo-random positions and staggered twinkle animations
- Hover reveals a glow ring, brightened name, and mood label + relationship percentage
- Click navigates to the companion's profile page
- Fully responsive — measures container on resize and adapts the SVG viewport
- Only renders for authenticated users with 2+ companions (needs at least 2 stars to be meaningful)

### Supporting Features

- **Chat with AI** — Context-aware conversations powered by OpenAI GPT-4o-mini. The system prompt dynamically incorporates companion personality, current mood label, and relationship depth — so a "Distant" companion gives cold, short replies while an "Attached" companion is deeply caring and uses pet names. A fallback response matrix handles OpenAI outages so the companion never goes silent. Frontend uses optimistic UI for instant message display.
- **Memory Timeline** — Users can save meaningful moments from conversations as curated text snapshots with optional tags. Memories can be pinned to keep important moments at the top. This creates a scrapbook of the relationship — users feel invested because they can see everything they've shared. It also serves as a nostalgia mechanism that deepens emotional attachment over time.
- **Mood & Relationship System** — Two independent dynamic scores per user-companion pair: Mood Score (how the companion currently _feels_ about the user, 0-100) and Relationship Score (overall bond depth, 0-100). Interactions boost scores (+2 mood / +1 relationship per message, +3 / +2 per story reaction). Mood decays with inactivity (-0.5 points/hour), creating urgency to maintain the connection. Mood labels shift dynamically (Distant → Neutral → Happy → Attached) and directly influence AI response tone. This makes every interaction feel consequential — the companion _remembers_ whether you've been present or absent.
- **Anonymous Browsing** — Unauthenticated users can browse companions and view profiles via public `/browse` endpoints. Reduces friction to conversion — users can explore before committing to sign up.
- **Onboarding Flow** — Multi-step companion selection with animated transitions and a welcome screen.

---

## UI Design Decisions

**Dark theme, mobile-first:** The AI companion space is overwhelmingly dark-themed. Users engage with these apps in private, often at night. A dark UI feels intimate and premium. I used a slate-based color palette with subtle border opacity for depth without harshness. All layouts are designed mobile-first and scale up to desktop.

**Bottom navigation (mobile) + sidebar (desktop):** Follows established mobile app patterns. The bottom nav has 4 tabs — Home, Chat, Memories, Profile — matching the core user flows. Desktop gets a sidebar because horizontal space allows it without sacrificing content area.

**Avatar-centric design:** Companion avatars are prominent everywhere — story circles, chat headers, profile pages, constellation nodes, mood aura rings. The avatar is the emotional anchor. Users form attachment to faces, not names or text descriptions.

**Mood colors as a design system:** Rather than treating mood as a simple badge, I threaded mood colors throughout the entire app. The same mood → color mapping (zinc/blue/emerald/pink) appears in: companion cards, constellation stars, connection lines, mood aura, sparkline charts, and mood badges. This creates visual consistency — users learn to "read" mood by color intuitively.

**Skeleton loading states on every page:** Every route has a `loading.tsx` or component-level skeleton. Combined with per-section Suspense boundaries, users never see a blank screen. Skeletons match the layout of actual content to prevent layout shift.

**Intercepting route modal for companion profiles:** On the dashboard, clicking a companion opens a modal overlay (Next.js intercepting route `(.)companions/[id]`). This preserves context — users can quickly peek at a profile without losing their dashboard scroll position. Direct URL navigation still works as a full page.

---

## Architecture & Technical Decisions

### Frontend Architecture

```
app/                          # Next.js App Router
  (auth)/                     # Public routes (login, signup, onboarding)
  (main)/                     # Authenticated shell (bottom nav, sidebar)
    @modal/                   # Parallel route for intercepting modals
features/                     # Feature modules (7 features)
  {feature}/
    components/               # UI components
    hooks/                    # Client-side state
    queries.ts                # Server-side data fetching (server-only)
    actions.ts                # Server Actions (mutations)
    types.ts                  # Feature-specific types
    index.ts                  # Barrel exports
lib/                          # Shared utilities
  api-fetch.ts                # Centralized fetch with auth token forwarding
components/
  ui/                         # shadcn/ui primitives (14 components)
  layout/                     # App shell (bottom nav, sidebar)
types/                        # Shared TypeScript types
```

**Key decisions:**

- **Feature-based modules** over layer-based folders. Each feature (`chat`, `stories`, `insights`, `companions`, `memories`, `mood`, `auth`) is self-contained with its own components, hooks, queries, and types. This scales better than flat `components/`, `hooks/`, `services/` folders that become dumping grounds.
- **`server-only` directive on all query files** prevents accidental client-side imports that would leak auth tokens or bundle server code.
- **Server Components by default.** Pages fetch data on the server and pass to client components only when interactivity is needed. This eliminates client-side loading waterfalls and reduces JavaScript shipped to the browser.
- **Suspense boundaries per section.** The dashboard has independent Suspense wrappers for Stories, Constellation, and Companions Grid — they stream in independently rather than blocking each other.
- **Backend type transforms in the query layer.** The Go backend uses `snake_case`; the frontend uses `camelCase`. Transform functions live in `api-fetch.ts`, keeping components clean of serialization concerns.

### Backend Architecture (Clean Layered Separation)

```
cmd/server/main.go            # Entry point, dependency injection
internal/
  handler/                    # HTTP request/response, input validation
  service/                    # Business logic, orchestration
  repository/                 # Data access, SQL queries
  models/                     # Domain objects, request/response types
  middleware/                  # JWT auth, request context
  ai/                         # OpenAI client wrapper
  config/                     # Environment configuration
  database/                   # Connection pool, migrations
  router/                     # Route definitions
migrations/                   # Idempotent SQL migrations
```

**Why this structure?**

- **Testability:** Each layer depends on interfaces, not implementations. Repositories implement interfaces that services consume, enabling mock-based unit testing without a database.
- **Separation of concerns:** Handlers never touch SQL. Services never touch `http.Request`. This prevents the "fat handler" antipattern where business logic leaks into HTTP handlers.
- **Dependency injection:** All wiring happens in `main.go`. Services receive repository interfaces through constructors. No global state, no service locator.

### Why Go? (First-Time Go Developer)

Go was a requirement for this assessment, and this was my first project in the language. I used AI tools extensively to learn Go idioms, best practices, and the standard library as I built. Rather than fighting the unfamiliarity, I treated it as a learning accelerator — studying each generated pattern, understanding _why_ Go does things differently (explicit error handling, interfaces over inheritance, composition over hierarchy), and iterating until the code felt idiomatic rather than "translated from another language."

What I learned and why Go was the right choice for this domain:

- **Low latency:** Sub-millisecond overhead per request. Critical for a real-time social app where users expect instant story loads and chat responses.
- **Concurrency model:** Goroutines handle thousands of concurrent connections without the thread-per-request overhead of traditional servers. Important for a mass-audience social product.
- **Small memory footprint:** A compiled Go binary uses ~10MB of RAM at idle vs ~100MB+ for Node.js. Lower infrastructure costs at scale.
- **No runtime dependencies:** Single static binary deployment. The Docker image is 15MB (Alpine-based).
- **Explicit error handling:** Go forces you to handle every error at the call site. Coming from languages with try/catch, this felt verbose initially, but it produces more predictable, debuggable code — every failure path is visible.

### Why Raw SQL + pgx Over an ORM or Supabase SDK?

I deliberately chose raw SQL with the `pgx` driver instead of an ORM (GORM) or the Supabase client SDK:

- **ORMs can't express the queries this project needs.** Cursor-based pagination (`WHERE created_at < $cursor`), atomic UPSERT (`ON CONFLICT DO UPDATE`), and batch loading (`WHERE story_id = ANY($1::uuid[])`) either aren't supported or require falling back to raw SQL anyway, defeating the ORM's purpose.
- **ORMs hide N+1 problems.** I solved N+1 explicitly with batch loading. GORM's lazy association loading would silently reintroduce it.
- **PgBouncer compatibility.** GORM uses prepared statements by default, which break in Supabase's transaction-mode pooler. pgx lets me switch to simple protocol (`QueryExecModeExec`) for pooler mode while keeping extended protocol for direct connections.
- **No official Supabase Go SDK.** The community library routes queries through the PostgREST HTTP API, adding an extra network hop per query. A direct Postgres connection via pgx avoids this overhead entirely. The Supabase SDK is designed for client-side use (browsers/mobile), not server-to-database communication.
- **Repository interfaces provide the same abstraction.** Services depend on interfaces like `StoryRepository`, not on SQL. This gives the same decoupling benefit an ORM would, without the performance trade-offs.

### OpenAI Integration

The chat system uses GPT-4o-mini with a carefully crafted system prompt that incorporates:

1. The companion's personality traits (from the database)
2. The current mood label derived from the relationship state
3. Character guidelines that prevent the AI from breaking character

A fallback response matrix handles OpenAI outages — pre-written mood-aware responses keyed by personality trait ensure the companion never goes silent. This is a resilience pattern: the external API dependency is non-blocking for the core UX.

### Supabase Storage for Media Assets

Companion avatars and story media (images, videos) are hosted on Supabase Storage in two public buckets:

- **`avatars`** — AI-generated companion profile images
- **`stories`** — Story slides organized by companion (`stories/{companion}/{filename}`)

Public read policies allow the frontend to load media directly via CDN URLs without authentication. This avoids proxying binary data through the Go backend and leverages Supabase's edge caching.

### User-Scoped Story Feed

The stories feed (`GET /api/stories`) only returns stories from companions the authenticated user has connected with. This is achieved by joining `stories` with `relationship_states` on `(companion_id, user_id)` at the database level — no application-side filtering needed. Users who haven't selected any companions see an empty feed rather than content from strangers.

### Message–Memory Linking

Memories can optionally reference the source message via `message_id`. This enables two features:

1. **`is_memorized` flag on messages** — The chat history query uses a correlated `EXISTS` subquery against the `memories` table to annotate each message with whether it has been saved as a memory. This avoids a separate API call and keeps the chat UI in sync.
2. **Traceability** — When a user saves a message as a memory, the FK link preserves the origin. The partial index `idx_memories_message_id WHERE message_id IS NOT NULL` keeps the `EXISTS` lookup fast without indexing the majority of rows where `message_id` is NULL.

---

## Database Design & Scalability

### Why PostgreSQL (Supabase)?

- **Relational model fits the domain:** Users, companions, stories, reactions, and relationships have clear entity-relationship structures with foreign key constraints. A document store would require duplicating relationship data or sacrificing referential integrity.
- **ACID transactions:** Mood and relationship score updates need to be atomic. When a user sends a message, the backend inserts the message, generates an AI reply, updates mood/relationship scores, and records a mood snapshot — all of which must succeed or fail together. Eventually-consistent stores risk partial state.
- **Row Level Security (RLS):** Supabase's RLS provides database-enforced multi-tenancy. Even if the application layer has a bug, users can never see each other's messages, reactions, or relationship states. This is defense-in-depth — critical for a social app handling personal conversations.
- **Connection pooling built-in:** Supabase provides PgBouncer in transaction mode, which the backend is specifically configured to support (disabling prepared statement caching, using simple protocol mode).
- **UPSERT support:** Story reactions use `ON CONFLICT DO UPDATE` for atomic insert-or-update without race conditions.
- **Mature indexing:** Composite indexes, partial indexes, and hash indexes provide the query optimization flexibility needed for the various access patterns (cursor pagination, batch loading, multi-column sorts).

### Why Supabase (Over Self-Hosted PostgreSQL or Other Providers)

I evaluated several database hosting options:

- **Self-hosted PostgreSQL (Docker/AWS RDS):** Full control, but requires managing backups, connection pooling (setting up PgBouncer manually), monitoring, and scaling. Overkill for a take-home assessment and adds infrastructure complexity without product value.
- **CockroachDB:** Distributed SQL, great for multi-region. But the data model here doesn't need distributed transactions, and CockroachDB's PostgreSQL compatibility layer has gaps (no RLS, limited index types). Over-engineered for the use case.
- **Supabase:** Managed PostgreSQL with zero infrastructure setup. Chose it for these specific reasons:

1. **Built-in PgBouncer connection pooling** on port 6543. The Go backend connects through the transaction-mode pooler, which multiplexes thousands of client connections over a small number of actual database connections. This is essential for serverless/containerized deployments where each request may open a new connection. No need to self-host PgBouncer.
2. **Full PostgreSQL feature set.** Unlike managed services that expose a subset (e.g., Supabase's own PostgREST API), connecting directly via pgx gives access to every PostgreSQL feature — RLS policies, composite indexes, UPSERT, window functions, `ANY()` array operators. The Go backend bypasses PostgREST entirely and connects to the raw database.
3. **Row-Level Security built into the platform.** Supabase's dashboard makes it easy to define and test RLS policies. All 9 tables have RLS enabled.
4. **Generous free tier** with 500MB storage, unlimited API requests, and shared compute — more than sufficient for development and demo purposes.
5. **Migration-friendly.** Since the backend connects via standard PostgreSQL protocol (not a proprietary SDK), migrating to any other PostgreSQL host (RDS, Neon, self-hosted) requires only changing the `DATABASE_URL` environment variable. Zero vendor lock-in.

### Schema Overview

9 tables with Row Level Security on all of them:

| Table                 | Purpose                       | Key Index Strategy                                                                                                                  |
| --------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `users`               | Authentication                | Hash index on email for O(1) login lookup                                                                                           |
| `companions`          | AI character profiles         | Full table scan (5 rows, cached)                                                                                                    |
| `stories`             | Story metadata + expiry       | `(companion_id, created_at DESC)` for per-companion feed; joined with `relationship_states` to scope to user's connected companions |
| `story_media`         | Ordered slides within stories | `(story_id, sort_order)` for batch loading                                                                                          |
| `story_reactions`     | Emoji reactions (UPSERT)      | `UNIQUE(user_id, media_id)` for atomic upsert                                                                                       |
| `messages`            | Chat history                  | `(user_id, companion_id, created_at DESC)` for cursor pagination                                                                    |
| `relationship_states` | Mood + relationship scores    | `UNIQUE(user_id, companion_id)` for single-row lookup                                                                               |
| `memories`            | Curated moments               | `(user_id, companion_id, pinned DESC, created_at DESC, message_id)` for pinned-first timeline                                       |
| `mood_history`        | Daily mood snapshots          | `(user_id, companion_id, recorded_date)` for trend queries                                                                          |

### Scalability Decisions

**Cursor-based pagination over OFFSET.** Messages and stories use keyset/cursor pagination (`WHERE created_at < $cursor ORDER BY created_at DESC LIMIT $N`). Unlike OFFSET, this is O(1) regardless of page depth — page 10,000 is exactly as fast as page 1. This is critical for chat history (thousands of messages) and the global story feed.

**Composite indexes following the left-prefix rule.** Every multi-column query has a matching composite index with equality columns first and range/sort columns last. For example, `idx_messages_conversation (user_id, companion_id, created_at DESC)` serves both the equality filter (`WHERE user_id = $1 AND companion_id = $2`) and the sort (`ORDER BY created_at DESC`) in a single index scan.

**Redundant index elimination.** After the initial schema, I audited every index against actual query patterns and dropped 6 redundant indexes:

- Single-column indexes that were already covered as left-prefixes of composite indexes (e.g., `idx_stories_companion_id` was redundant with `idx_stories_companion_created`)
- A hash index on email that was redundant with the UNIQUE btree constraint
- FK indexes on `companion_id` columns where no query ever filters by `companion_id` alone

Each redundant index slows every INSERT/UPDATE/DELETE for zero read benefit. Removing them directly improves write throughput.

**N+1 query elimination via batch loading.** Story media is loaded in a single batch query using `WHERE story_id = ANY($1::uuid[])` instead of one query per story. Loading 20 stories with their media takes exactly 2 queries regardless of media count, not 21+.

**Time-decay calculated on read, not stored.** Mood decay (-0.5 points/hour of inactivity) is computed when the relationship is fetched, not via a background cron job. This eliminates job scheduling complexity and scales to any number of users without periodic batch processing.

**UPSERT for atomic operations.** Story reactions use `INSERT ... ON CONFLICT (user_id, media_id) DO UPDATE SET reaction = $5` — a single atomic operation that handles both first-time reactions and reaction changes. No race conditions, no check-then-insert patterns.

**Connection pooling with PgBouncer compatibility.** The database layer explicitly supports Supabase's transaction-mode PgBouncer:

- Disables pgx prepared statement caching (`QueryExecModeExec`)
- Uses simple protocol to avoid "prepared statement does not exist" errors
- Maintains a pool of 20 max / 2 min connections

This allows the backend to handle thousands of concurrent users through a small connection pool rather than exhausting Postgres connections.

**Expired story cleanup.** A `cleanup_expired_stories()` SQL function deletes stories that expired over an hour ago. Can be scheduled via pg_cron or called from an edge function. CASCADE on `story_media` ensures media is cleaned up automatically. Without this, expired stories would bloat the table indefinitely.

**RLS as defense-in-depth.** Every table has Row Level Security policies. User-scoped tables (messages, reactions, memories, relationships) use `USING (user_id = (select current_setting('app.current_user_id', true))::uuid)` with the `(select ...)` wrapper for per-query caching (100x+ faster than calling the function per-row on large tables).

---

## Engineering Process & Challenges

### Process

1. **Research phase:** Studied Nectar AI, Character.ai, Replika, and Instagram to understand what makes companion apps compelling and what the "Social Loop" means in practice.
2. **Schema-first design:** Designed the database schema and API contract before writing code. TypeScript types and endpoint signatures were defined upfront so frontend and backend could develop in parallel.
3. **Learning Go with AI:** Since this was my first Go project, I used AI tools to learn the language while building. I'd study generated patterns (interface-based polymorphism, `context.Context` propagation, struct embedding), understand the _why_, and refactor until idiomatic. Key learnings: Go's explicit error handling philosophy, how `pgx` handles connection pooling differently from ORMs, and the "accept interfaces, return structs" principle.
4. **Backend layer-by-layer:** Built bottom-up — database → repositories → services → handlers → router. Each layer was tested before adding the next.
5. **Frontend with real server components:** Pages use async Server Components fetching from the Go backend from day one. No mock data layer to swap later.
6. **Iterate on interactions:** The Stories gesture system required multiple rounds of refinement (tap detection, swipe thresholds, drag physics).
7. **Creative features last:** Relationship Insights and Companion Constellation were built after core flows (auth, chat, stories, memories) were solid and integrated.
8. **Optimization pass:** Audited queries against indexes, dropped redundant indexes, added cursor-based pagination where queries were unbounded.

### Challenges & Debugging

**PgBouncer prepared statement conflicts (Backend):**
Early in development, queries intermittently failed with "prepared statement does not exist" errors. Supabase's default pooler runs in transaction mode, where connections are shared between requests. pgx's default extended protocol caches prepared statements per-connection, but in transaction mode you might get a different connection on the next query.

_Fix:_ Set `QueryExecModeExec` to use simple protocol when the pooler is enabled. Added a `DB_USE_POOLER` environment flag to toggle between pooler-safe and direct-connection modes.

**Story viewer first-render animation bug (Frontend):**
The desktop carousel's spread-out entrance animation didn't play on first open. Root cause: `isDesktop` was initialized to `false`, so the mobile viewer rendered on the first frame. When `useEffect` set `isDesktop = true` and `isVisible = true` simultaneously, the desktop carousel mounted already in its final position — no initial state to transition _from_.

_Fix:_ Changed `isDesktop` to start as `null` (layout unknown). The component renders nothing until layout detection completes. Then a double `requestAnimationFrame` ensures the browser paints the initial collapsed state before triggering the spread-out animation.

**Anonymous user crash on `/me` endpoint (Full-stack):**
The `AuthProvider` called `getMe()` on component mount for all users, including unauthenticated visitors. This hit the `/me` backend endpoint without a token, returning a 401 that crashed the React error boundary.

_Fix:_ Moved auth resolution entirely server-side. The root layout is an async Server Component that checks for a cookie token, resolves the user if present, and passes `initialUser` to `AuthProvider`. The client never makes a `/me` call — auth state is available on first render with zero loading flicker.

**Relationship state in story reactions (Backend):**
The `updateRelationshipOnReaction` function originally called `GetActiveStories()` — fetching _all_ active stories just to find one story's `companion_id`. This was a hidden O(n) lookup that would degrade as stories accumulated.

_Fix:_ Added a `GetByID` method to the story repository — a single primary key lookup instead of a full table scan.

**Story gesture conflicts — tap vs. swipe vs. hold (Frontend):**
On mobile, a single pointer interaction could be a tap (advance slide), horizontal swipe (change story), vertical drag (dismiss), or hold (pause). These gestures conflict — a swipe starts as a potential tap, a hold starts as a potential tap.

_Fix:_ Implemented a gesture state machine: a 10px "slop" threshold differentiates taps from drags, axis locking prevents diagonal confusion, a 200ms timer separates taps from holds, and velocity-based thresholds determine whether a swipe should snap or spring back.

**Mood sparkline curve overshooting (Frontend):**
The cubic bezier interpolation between data points produced curves that visually exceeded the 0-100 Y-axis range when adjacent points had large score differences (e.g., 20 → 80).

_Fix:_ Clamped bezier control point Y values to the chart bounds and reduced the tension factor for smoother, bounded curves.

**Migration idempotency (Backend):**
All migrations use `IF NOT EXISTS` / `IF EXISTS` guards and `ON CONFLICT DO NOTHING` for seed data. This allows migrations to be re-run safely on every server start without failing on duplicate objects.

---

## API Reference

### Authentication

| Method | Endpoint           | Description                  |
| ------ | ------------------ | ---------------------------- |
| `POST` | `/api/auth/signup` | Register a new user          |
| `POST` | `/api/auth/login`  | Authenticate and receive JWT |
| `GET`  | `/api/auth/me`     | Get current user profile     |

### Browse (Public, No Auth)

| Method | Endpoint                     | Description                       |
| ------ | ---------------------------- | --------------------------------- |
| `GET`  | `/api/browse/companions`     | List all companions (anonymous)   |
| `GET`  | `/api/browse/companions/:id` | Get companion details (anonymous) |

### Companions

| Method | Endpoint              | Description           |
| ------ | --------------------- | --------------------- |
| `GET`  | `/api/companions`     | List all companions   |
| `GET`  | `/api/companions/:id` | Get companion details |

### Stories

| Method | Endpoint                      | Description                      |
| ------ | ----------------------------- | -------------------------------- |
| `GET`  | `/api/stories`                | Active stories feed (paginated)  |
| `GET`  | `/api/companions/:id/stories` | Stories for a specific companion |
| `POST` | `/api/stories/:id/react`      | React to a story slide           |

### Messages

| Method | Endpoint                       | Description                     |
| ------ | ------------------------------ | ------------------------------- |
| `GET`  | `/api/companions/:id/messages` | Chat history (cursor-paginated) |
| `POST` | `/api/companions/:id/messages` | Send message, receive AI reply  |

### Relationships

| Method | Endpoint                           | Description                          |
| ------ | ---------------------------------- | ------------------------------------ |
| `GET`  | `/api/relationships`               | All user relationship states         |
| `GET`  | `/api/companions/:id/relationship` | Relationship with specific companion |
| `POST` | `/api/onboarding/select-companion` | Select companion during onboarding   |

### Memories

| Method   | Endpoint                       | Description                    |
| -------- | ------------------------------ | ------------------------------ |
| `GET`    | `/api/companions/:id/memories` | Memory timeline (pinned first) |
| `POST`   | `/api/companions/:id/memories` | Create a memory                |
| `DELETE` | `/api/memories/:id`            | Delete a memory                |
| `PATCH`  | `/api/memories/:id/pin`        | Toggle pin status              |

### Insights

| Method | Endpoint                                  | Description                             |
| ------ | ----------------------------------------- | --------------------------------------- |
| `GET`  | `/api/companions/:id/insights`            | Mood history, streak, milestones, stats |
| `GET`  | `/api/companions/:id/reactions/summary`   | Reaction counts, recent, dominant emotion |

All protected endpoints require `Authorization: Bearer <jwt>`.

---

## Tech Stack

| Layer               | Technology               | Justification                                                 |
| ------------------- | ------------------------ | ------------------------------------------------------------- |
| **Frontend**        | Next.js 16 (App Router)  | Server Components, Suspense streaming, intercepting routes    |
| **Styling**         | Tailwind CSS + shadcn/ui | Rapid iteration, consistent design system, dark mode built-in |
| **Backend**         | Go 1.24 + Chi v5         | High performance, low memory, stdlib-compatible routing       |
| **Database**        | PostgreSQL (Supabase)    | Relational data, ACID transactions, RLS, managed hosting      |
| **Storage**         | Supabase Storage         | CDN-backed media hosting for avatars and story slides         |
| **DB Driver**       | pgx/v5 (raw SQL)         | Direct SQL control, no ORM overhead, PgBouncer-compatible     |
| **AI**              | OpenAI GPT-4o-mini       | Context-aware responses with personality + mood injection     |
| **Auth**            | JWT (HS256, 24h expiry)  | Stateless auth, cookie-forwarded through Next.js API routes   |
| **Package Manager** | Bun                      | Fast installs, native TypeScript execution                    |

---

## Getting Started

### Prerequisites

- Node.js 18+ and [Bun](https://bun.sh)
- Go 1.24+
- PostgreSQL (or a [Supabase](https://supabase.com) account)

### Backend

```bash
cd ai-companion-be
cp .env.example .env    # Configure DATABASE_URL, JWT_SECRET, OPENAI_KEY
```

**Option 1: Docker (Recommended)**

```bash
docker compose up --build
```

This builds a multi-stage Alpine image (~15MB) and starts the server on `:8080` with automatic health checks. The container reads all config from your `.env` file.

**Option 2: Without Docker**

```bash
go mod download
make run
```

The server starts on `http://localhost:8080`. Migrations run automatically on startup.

### Frontend

```bash
cd ai-companion
bun install
bun dev
```

The app starts on `http://localhost:3000`.

### Environment Variables

**Backend (.env):**

| Variable               | Required | Default                 | Description                                    |
| ---------------------- | -------- | ----------------------- | ---------------------------------------------- |
| `DATABASE_URL`         | Yes      | —                       | PostgreSQL connection string (Supabase pooler) |
| `JWT_SECRET`           | Yes      | —                       | Secret key for JWT signing                     |
| `OPENAI_KEY`           | Yes      | —                       | OpenAI API key                                 |
| `OPENAI_MODEL`         | No       | `gpt-4o-mini`           | Model for companion responses                  |
| `SERVER_PORT`          | No       | `8080`                  | HTTP server port                               |
| `DB_USE_POOLER`        | No       | `true`                  | Enable PgBouncer compatibility mode            |
| `CORS_ALLOWED_ORIGINS` | No       | `http://localhost:3000` | Allowed CORS origins                           |

**Frontend (.env.local):**

| Variable              | Required | Default                     | Description          |
| --------------------- | -------- | --------------------------- | -------------------- |
| `NEXT_PUBLIC_API_URL` | No       | `http://localhost:8080/api` | Backend API base URL |
