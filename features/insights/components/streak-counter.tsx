"use client"

import { cn } from "@/lib/utils"

export function StreakCounter({
  current,
  longest,
}: {
  current: number
  longest: number
}) {
  const isActive = current > 0

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Interaction Streak</h3>

      <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-card/50 p-4">
        {/* Fire + count */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-3xl transition-transform",
              isActive && "animate-bounce",
            )}
            style={isActive ? { animationDuration: "1.5s" } : undefined}
          >
            {isActive ? "🔥" : "❄️"}
          </span>
          <div>
            <span className="text-3xl font-bold tabular-nums">{current}</span>
            <p className="text-xs text-muted-foreground">
              {current === 1 ? "day" : "days"} in a row
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-border/50" />

        {/* Best streak */}
        <div className="text-center">
          <span className="text-lg font-semibold tabular-nums">{longest}</span>
          <p className="text-xs text-muted-foreground">best streak</p>
        </div>

        {/* Streak dots */}
        <div className="ml-auto flex gap-1">
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-colors",
                i < current % 7
                  ? "bg-orange-400"
                  : "bg-muted",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
