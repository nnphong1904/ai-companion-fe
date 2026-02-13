import "server-only"
import { cookies } from "next/headers"
import type { Companion } from "@/types/shared"
import type { Memory } from "@/features/memories/types"
import type { Message } from "@/features/chat/types"
import type { Mood } from "@/features/mood/types"
import type { Story, StorySlide } from "@/features/stories/types"
import type { User } from "@/features/auth/types"

// ─── Config ─────────────────────────────────────────────────────────────────

const API_URL = process.env.API_URL!
const COOKIE_NAME = "auth-token"

// ─── Error class ────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// ─── Token resolution (server-only) ─────────────────────────────────────────

export async function getAuthToken(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies()
    return cookieStore.get(COOKIE_NAME)?.value
  } catch {
    return undefined
  }
}

// ─── Fetch helper ───────────────────────────────────────────────────────────

export async function fetchApi<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getAuthToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const url = `${API_URL}${path}`
  console.log(`[fetchApi] ${options.method ?? "GET"} ${url} (token: ${token ? "yes" : "no"})`)

  const res = await fetch(url, {
    ...options,
    headers: { ...headers, ...Object.fromEntries(new Headers(options.headers).entries()) },
  })

  const text = await res.text()
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    console.error(`[fetchApi] ${path} — non-JSON response (${res.status}):`, text.slice(0, 200))
    throw new ApiError(`Non-JSON response: ${res.status}`, res.status)
  }

  if (!res.ok) {
    const errMsg = (json as { error?: string }).error || `API error: ${res.status}`
    console.error(`[fetchApi] ${path} — error ${res.status}:`, errMsg)
    throw new ApiError(errMsg, res.status)
  }

  const data = (json as { data: T }).data
  console.log(`[fetchApi] ${path} — ${res.status} OK, data:`, data === null ? "null" : Array.isArray(data) ? `array(${data.length})` : typeof data)

  return data
}

// ─── Backend types ──────────────────────────────────────────────────────────

export type BackendUser = {
  id: string
  email: string
  name: string
  avatar_url?: string
}

export type BackendCompanion = {
  id: string
  name: string
  description: string
  avatar_url: string
  personality: string
  created_at: string
}

export type BackendRelationship = {
  id: string
  user_id: string
  companion_id: string
  mood_score: number
  relationship_score: number
  mood_label: string
  last_interaction: string
  updated_at: string
}

export type BackendStory = {
  id: string
  companion_id: string
  created_at: string
  expires_at: string
  media: BackendStoryMedia[]
}

export type BackendStoryMedia = {
  id: string
  story_id: string
  media_url: string
  media_type: "image" | "video"
  duration: number
  sort_order: number
  created_at: string
}

export type BackendMessage = {
  id: string
  user_id: string
  companion_id: string
  content: string
  role: "user" | "companion"
  created_at: string
}

export type BackendMemory = {
  id: string
  user_id: string
  companion_id: string
  content: string
  tag?: string
  pinned: boolean
  created_at: string
}

// ─── Transforms ─────────────────────────────────────────────────────────────

export function transformUser(u: BackendUser): User {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    avatarUrl: u.avatar_url ?? null,
  }
}

export function transformCompanion(
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

export function transformMessage(m: BackendMessage): Message {
  return {
    id: m.id,
    companionId: m.companion_id,
    role: m.role === "companion" ? "assistant" : "user",
    content: m.content,
    createdAt: m.created_at,
    isMemory: false,
  }
}

export function transformMemory(m: BackendMemory): Memory {
  return {
    id: m.id,
    companionId: m.companion_id,
    content: m.content,
    tag: m.tag,
    pinned: m.pinned,
    createdAt: m.created_at,
  }
}

export function transformStory(
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

export const REACTION_MAP: Record<string, string> = {
  "❤️": "love",
  "😢": "sad",
  "😍": "heart_eyes",
  "😡": "angry",
}
