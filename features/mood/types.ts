export const MOODS = ["distant", "neutral", "happy", "attached"] as const
export type Mood = (typeof MOODS)[number]
