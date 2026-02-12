// Re-export hub — backward compatibility for lib/api.ts, lib/mock-data.ts, etc.
export type { User } from "@/features/auth/types"
export type { Mood } from "@/features/mood/types"
export { MOODS } from "@/features/mood/types"
export type { Story, StorySlide } from "@/features/stories/types"
export type { Message } from "@/features/chat/types"
export type { Memory } from "@/features/memories/types"
export type { Companion } from "./shared"
