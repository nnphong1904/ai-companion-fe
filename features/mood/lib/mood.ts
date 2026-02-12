import type { Mood } from "../types"

type MoodConfig = {
  emoji: string
  label: string
  color: string // Tailwind bg class
  textColor: string
}

export const MOOD_MAP: Record<Mood, MoodConfig> = {
  happy: { emoji: "😊", label: "Happy", color: "bg-emerald-500/20", textColor: "text-emerald-400" },
  sad: { emoji: "😢", label: "Sad", color: "bg-blue-500/20", textColor: "text-blue-400" },
  excited: { emoji: "🤩", label: "Excited", color: "bg-amber-500/20", textColor: "text-amber-400" },
  calm: { emoji: "😌", label: "Calm", color: "bg-cyan-500/20", textColor: "text-cyan-400" },
  anxious: { emoji: "😰", label: "Anxious", color: "bg-purple-500/20", textColor: "text-purple-400" },
  neutral: { emoji: "😐", label: "Neutral", color: "bg-zinc-500/20", textColor: "text-zinc-400" },
}

export function getRelationshipLabel(level: number): string {
  if (level >= 80) return "Soulmate"
  if (level >= 60) return "Close Friend"
  if (level >= 40) return "Good Friend"
  if (level >= 20) return "Acquaintance"
  return "Stranger"
}
