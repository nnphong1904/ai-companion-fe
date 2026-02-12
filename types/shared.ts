import type { Mood } from "@/features/mood/types"

export type Companion = {
  id: string
  name: string
  avatarUrl: string
  description: string
  mood: Mood
  relationshipLevel: number // 0-100
  lastInteraction: string // ISO date
}
