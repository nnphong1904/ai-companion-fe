import type { Mood } from "../types"

type MoodConfig = {
  emoji: string
  label: string
  color: string // Tailwind bg class
  textColor: string
}

export const MOOD_MAP: Record<Mood, MoodConfig> = {
  distant: { emoji: "😶", label: "Distant", color: "bg-zinc-500/20", textColor: "text-zinc-400" },
  neutral: { emoji: "😐", label: "Neutral", color: "bg-blue-500/20", textColor: "text-blue-400" },
  happy: { emoji: "😊", label: "Happy", color: "bg-emerald-500/20", textColor: "text-emerald-400" },
  attached: { emoji: "💕", label: "Attached", color: "bg-pink-500/20", textColor: "text-pink-400" },
}

export function getRelationshipLabel(level: number): string {
  if (level >= 80) return "Soulmate"
  if (level >= 60) return "Close Friend"
  if (level >= 40) return "Good Friend"
  if (level >= 20) return "Acquaintance"
  return "Stranger"
}
