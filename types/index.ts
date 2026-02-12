export type User = {
  id: string
  email: string
  name: string
  avatarUrl: string | null
}

export const MOODS = ["happy", "sad", "excited", "calm", "anxious", "neutral"] as const
export type Mood = (typeof MOODS)[number]

export type Companion = {
  id: string
  name: string
  avatarUrl: string
  description: string
  mood: Mood
  relationshipLevel: number // 0-100
  lastInteraction: string // ISO date
}

export type StorySlide = {
  id: string
  type: "text" | "image"
  content: string
  backgroundColor?: string
  duration: number // seconds
}

export type Story = {
  id: string
  companionId: string
  companionName: string
  companionAvatarUrl: string
  slides: StorySlide[]
  viewed: boolean
}

export type Message = {
  id: string
  companionId: string
  role: "user" | "assistant"
  content: string
  createdAt: string
  isMemory: boolean
}

export type Memory = {
  id: string
  companionId: string
  messageSnippet: string
  tag: string
  createdAt: string
}
