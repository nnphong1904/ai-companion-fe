"use client"

import { cn } from "@/lib/utils"
import type { Milestone } from "../types"

const MILESTONE_ICONS: Record<string, string> = {
  first_message: "💬",
  messages_10: "🌱",
  messages_50: "🗣️",
  messages_100: "📢",
  memories_5: "🧠",
  memories_10: "📝",
  memories_20: "📖",
  streak_3: "✨",
  streak_7: "🔥",
  streak_30: "⚡",
  relationship_40: "🤝",
  relationship_60: "💛",
  relationship_80: "💫",
}

function getIcon(key: string): string {
  return MILESTONE_ICONS[key] ?? "🏆"
}

export function Milestones({ milestones }: { milestones: Milestone[] }) {
  const unlocked = milestones.filter((m) => m.achieved)

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Milestones</h3>
        <span className="text-xs text-muted-foreground">
          {unlocked.length}/{milestones.length} unlocked
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {milestones.map((milestone) => (
          <div
            key={milestone.key}
            className={cn(
              "relative overflow-hidden rounded-xl border p-3 transition-colors",
              milestone.achieved
                ? "border-primary/30 bg-primary/5"
                : "border-border/50 bg-card/50 opacity-50",
            )}
          >
            {/* Icon */}
            <div className="mb-2 text-2xl">
              {milestone.achieved ? (
                getIcon(milestone.key)
              ) : (
                <span className="grayscale">{getIcon(milestone.key)}</span>
              )}
            </div>

            {/* Text */}
            <p className={cn(
              "text-xs font-semibold leading-tight",
              !milestone.achieved && "text-muted-foreground",
            )}>
              {milestone.title}
            </p>
            <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
              {milestone.description}
            </p>

            {/* Unlocked badge */}
            {milestone.achieved ? (
              <div className="absolute right-2 top-2 text-xs text-primary">
                ✓
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
