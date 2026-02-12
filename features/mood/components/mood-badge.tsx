import { cn } from "@/lib/utils"
import { MOOD_MAP } from "../lib/mood"
import type { Mood } from "../types"

export function MoodBadge({ mood, className }: { mood: Mood; className?: string }) {
  const config = MOOD_MAP[mood]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.color,
        config.textColor,
        className,
      )}
    >
      <span>{config.emoji}</span>
      {config.label}
    </span>
  )
}
