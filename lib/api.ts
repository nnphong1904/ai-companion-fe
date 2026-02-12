import type { Companion } from "@/types/shared"
import type { Memory } from "@/features/memories/types"
import type { Message } from "@/features/chat/types"
import type { Mood } from "@/features/mood/types"
import type { Story, StorySlide } from "@/features/stories/types"
import type { User } from "@/features/auth/types"

// ─── Config ─────────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL!

// ─── Internal fetch helper ──────────────────────────────────────────────────

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function fetchApi<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...init } = options
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { ...headers, ...Object.fromEntries(new Headers(init.headers).entries()) },
  })

  const json = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new ApiError(
      (json as { error?: string }).error || `API error: ${res.status}`,
      res.status,
    )
  }

  return (json as { data: T }).data
}

// ─── Backend types (internal) ───────────────────────────────────────────────

type BackendUser = {
  id: string
  email: string
  name: string
  avatar_url?: string
}

type BackendCompanion = {
  id: string
  name: string
  description: string
  avatar_url: string
  personality: string
  created_at: string
}

type BackendRelationship = {
  id: string
  user_id: string
  companion_id: string
  mood_score: number
  relationship_score: number
  mood_label: string
  last_interaction: string
  updated_at: string
}

type BackendStory = {
  id: string
  companion_id: string
  created_at: string
  expires_at: string
  media: BackendStoryMedia[]
}

type BackendStoryMedia = {
  id: string
  story_id: string
  media_url: string
  media_type: "image" | "video"
  duration: number
  sort_order: number
  created_at: string
}

type BackendMessage = {
  id: string
  user_id: string
  companion_id: string
  content: string
  role: "user" | "companion"
  created_at: string
}

type BackendMemory = {
  id: string
  user_id: string
  companion_id: string
  content: string
  tag?: string
  pinned: boolean
  created_at: string
}

// ─── Transforms ─────────────────────────────────────────────────────────────

function transformUser(u: BackendUser): User {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    avatarUrl: u.avatar_url ?? null,
  }
}

function transformCompanion(
  c: BackendCompanion,
  rel?: BackendRelationship,
): Companion {
  return {
    id: c.id,
    name: c.name,
    avatarUrl: c.avatar_url,
    description: c.description,
    mood: (rel?.mood_label?.toLowerCase() as Mood) ?? "neutral",
    relationshipLevel: rel?.relationship_score ?? 0,
    lastInteraction: rel?.last_interaction ?? c.created_at,
  }
}

function transformMessage(m: BackendMessage): Message {
  return {
    id: m.id,
    companionId: m.companion_id,
    role: m.role === "companion" ? "assistant" : "user",
    content: m.content,
    createdAt: m.created_at,
    isMemory: false,
  }
}

function transformMemory(m: BackendMemory): Memory {
  return {
    id: m.id,
    companionId: m.companion_id,
    content: m.content,
    tag: m.tag,
    pinned: m.pinned,
    createdAt: m.created_at,
  }
}

function transformStory(
  s: BackendStory,
  companion: BackendCompanion | undefined,
): Story {
  const slides: StorySlide[] = [...s.media]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((m) => ({
      id: m.id,
      type: m.media_type,
      content: m.media_url,
      duration: m.duration,
    }))

  return {
    id: s.id,
    companionId: s.companion_id,
    companionName: companion?.name ?? "Companion",
    companionAvatarUrl: companion?.avatar_url ?? "",
    slides,
    viewed: false,
  }
}

// ─── Reaction mapping ───────────────────────────────────────────────────────

const REACTION_MAP: Record<string, string> = {
  "❤️": "love",
  "😢": "sad",
  "😍": "heart_eyes",
  "😡": "angry",
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function login(
  email: string,
  password: string,
): Promise<{ token: string; user: User }> {
  const data = await fetchApi<{ token: string; user: BackendUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
  return { token: data.token, user: transformUser(data.user) }
}

export async function signup(
  email: string,
  password: string,
  name: string,
): Promise<{ token: string; user: User }> {
  const data = await fetchApi<{ token: string; user: BackendUser }>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  })
  return { token: data.token, user: transformUser(data.user) }
}

export async function logout(): Promise<void> {
  // No backend logout endpoint — token removal handled by client
}

export async function getMe(token?: string): Promise<User> {
  const data = await fetchApi<BackendUser>("/auth/me", { token })
  return transformUser(data)
}

// ─── Onboarding ──────────────────────────────────────────────────────────────

export async function selectCompanions(
  companionIds: string[],
  token?: string,
): Promise<void> {
  await Promise.all(
    companionIds.map((id) =>
      fetchApi("/onboarding/select-companion", {
        method: "POST",
        body: JSON.stringify({ companion_id: id }),
        token,
      }),
    ),
  )
}

// ─── Companions ──────────────────────────────────────────────────────────────

export async function getAllCompanions(token?: string): Promise<Companion[]> {
  const [companions, relationships] = await Promise.all([
    fetchApi<BackendCompanion[] | null>("/companions", { token }),
    fetchApi<BackendRelationship[] | null>("/relationships", { token }).catch(() => null),
  ])

  const relMap = new Map((relationships ?? []).map((r) => [r.companion_id, r]))
  return (companions ?? []).map((c) => transformCompanion(c, relMap.get(c.id)))
}

export async function getMyCompanions(token?: string): Promise<Companion[]> {
  const [companions, relationships] = await Promise.all([
    fetchApi<BackendCompanion[] | null>("/companions", { token }),
    fetchApi<BackendRelationship[] | null>("/relationships", { token }).catch(() => null),
  ])

  const rels = relationships ?? []
  if (rels.length === 0) return []

  const relMap = new Map(rels.map((r) => [r.companion_id, r]))
  return (companions ?? [])
    .filter((c) => relMap.has(c.id))
    .map((c) => transformCompanion(c, relMap.get(c.id)))
}

export async function getCompanion(
  id: string,
  token?: string,
): Promise<Companion | null> {
  let companion: BackendCompanion
  try {
    companion = await fetchApi<BackendCompanion>(`/companions/${id}`, { token })
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null
    throw e
  }

  let relationship: BackendRelationship | undefined
  try {
    relationship = await fetchApi<BackendRelationship>(`/companions/${id}/relationship`, { token })
  } catch {
    // No relationship yet — that's fine
  }

  return transformCompanion(companion, relationship)
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export async function getStories(token?: string): Promise<Story[]> {
  const [stories, companions] = await Promise.all([
    fetchApi<BackendStory[] | null>("/stories", { token }),
    fetchApi<BackendCompanion[] | null>("/companions", { token }),
  ])

  const companionMap = new Map((companions ?? []).map((c) => [c.id, c]))
  return (stories ?? []).map((s) => transformStory(s, companionMap.get(s.companion_id)))
}

export async function reactToStory(
  storyId: string,
  mediaId: string,
  emoji: string,
  token?: string,
): Promise<void> {
  const reaction = REACTION_MAP[emoji] ?? "love"
  await fetchApi(`/stories/${storyId}/react`, {
    method: "POST",
    body: JSON.stringify({ media_id: mediaId, reaction }),
    token,
  })
}

// ─── Chat ────────────────────────────────────────────────────────────────────

export async function getMessages(
  companionId: string,
  token?: string,
): Promise<Message[]> {
  const data = await fetchApi<{ messages: BackendMessage[]; next_cursor: string; has_more: boolean } | null>(
    `/companions/${companionId}/messages?limit=50`,
    { token },
  )
  // Backend returns newest first — reverse for display (oldest first)
  return (data?.messages ?? []).map(transformMessage).reverse()
}

export async function sendMessage(
  companionId: string,
  content: string,
  token?: string,
): Promise<{ userMessage: Message; companionMessage: Message }> {
  const data = await fetchApi<BackendMessage[]>(`/companions/${companionId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
    token,
  })
  return {
    userMessage: transformMessage(data[0]),
    companionMessage: transformMessage(data[1]),
  }
}

// ─── Memories ────────────────────────────────────────────────────────────────

export async function getMemories(
  companionId: string,
  token?: string,
): Promise<Memory[]> {
  const data = await fetchApi<BackendMemory[] | null>(`/companions/${companionId}/memories`, {
    token,
  })
  return (data ?? []).map(transformMemory)
}

export async function saveMemory(
  companionId: string,
  content: string,
  tag?: string,
  token?: string,
): Promise<Memory> {
  const data = await fetchApi<BackendMemory>(`/companions/${companionId}/memories`, {
    method: "POST",
    body: JSON.stringify({ content, tag }),
    token,
  })
  return transformMemory(data)
}

export async function deleteMemory(
  memoryId: string,
  token?: string,
): Promise<void> {
  await fetchApi(`/memories/${memoryId}`, {
    method: "DELETE",
    token,
  })
}

export async function toggleMemoryPin(
  memoryId: string,
  token?: string,
): Promise<Memory> {
  const data = await fetchApi<BackendMemory>(`/memories/${memoryId}/pin`, {
    method: "PATCH",
    token,
  })
  return transformMemory(data)
}
