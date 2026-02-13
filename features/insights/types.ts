import type { Mood } from "@/features/mood/types"

export type MoodHistoryPoint = {
  date: string
  score: number
  mood: Mood
}

export type Milestone = {
  key: string
  title: string
  description: string
  achieved: boolean
}

export type InsightsData = {
  moodHistory: MoodHistoryPoint[]
  streak: {
    current: number
    longest: number
  }
  milestones: Milestone[]
  stats: {
    totalMessages: number
    totalMemories: number
    firstMessage: string | null
    daysTogether: number
  }
}
