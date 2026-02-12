export const MOODS = ["happy", "sad", "excited", "calm", "anxious", "neutral"] as const
export type Mood = (typeof MOODS)[number]
