import "server-only"
import { fetchApi } from "@/lib/api-fetch"
import type { Mood } from "@/features/mood/types"
import type { InsightsData, ReactionSummary, ReactionType } from "./types"

// ─── Backend types ───────────────────────────────────────────────────────────

type BackendMoodHistory = {
  date: string
  mood_score: number
  mood_label: string
}

type BackendStreak = {
  current: number
  longest: number
}

type BackendMilestone = {
  key: string
  title: string
  description: string
  achieved: boolean
}

type BackendStats = {
  total_messages: number
  total_memories: number
  first_message: string | null
  days_together: number
}

type BackendInsights = {
  mood_history: BackendMoodHistory[] | null
  streak: BackendStreak
  milestones: BackendMilestone[] | null
  stats: BackendStats
}

// ─── Transform ───────────────────────────────────────────────────────────────

function labelToMood(label: string): Mood {
  const lower = label.toLowerCase()
  if (lower === "attached") return "attached"
  if (lower === "happy") return "happy"
  if (lower === "neutral") return "neutral"
  return "distant"
}

function transformInsights(b: BackendInsights): InsightsData {
  return {
    moodHistory: (b.mood_history ?? []).map((h) => ({
      date: h.date,
      score: Math.round(h.mood_score),
      mood: labelToMood(h.mood_label),
    })),
    streak: {
      current: b.streak.current,
      longest: b.streak.longest,
    },
    milestones: (b.milestones ?? []).map((m) => ({
      key: m.key,
      title: m.title,
      description: m.description,
      achieved: m.achieved,
    })),
    stats: {
      totalMessages: b.stats.total_messages,
      totalMemories: b.stats.total_memories,
      firstMessage: b.stats.first_message,
      daysTogether: b.stats.days_together,
    },
  }
}

// ─── Query ───────────────────────────────────────────────────────────────────

export async function getInsights(companionId: string): Promise<InsightsData> {
  const data = await fetchApi<BackendInsights>(`/companions/${companionId}/insights`)
  return transformInsights(data)
}

// ─── Reaction Summary ───────────────────────────────────────────────────────

type BackendReactionSummary = {
  total: number
  counts: Record<string, number>
  recent: { reaction: string; reacted_at: string }[] | null
  dominant_emotion: string | null
}

function transformReactionSummary(b: BackendReactionSummary): ReactionSummary {
  return {
    total: b.total,
    counts: {
      love: b.counts.love ?? 0,
      sad: b.counts.sad ?? 0,
      heart_eyes: b.counts.heart_eyes ?? 0,
      angry: b.counts.angry ?? 0,
    },
    recent: (b.recent ?? []).map((r) => ({
      reaction: r.reaction as ReactionType,
      reactedAt: r.reacted_at,
    })),
    dominantEmotion: (b.dominant_emotion as ReactionType) ?? null,
  }
}

export async function getReactionSummary(
  companionId: string,
): Promise<ReactionSummary | null> {
  const data = await fetchApi<BackendReactionSummary>(
    `/companions/${companionId}/reactions/summary`,
  ).catch(() => null)
  if (!data) return null
  return transformReactionSummary(data)
}
