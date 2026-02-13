"use client"

import { MoodAura } from "./mood-aura"
import { MoodSparkline } from "./mood-sparkline"
import { StreakCounter } from "./streak-counter"
import { QuickStats } from "./quick-stats"
import { Milestones } from "./milestones"
import { EmotionBloom } from "./emotion-bloom"
import type { Companion } from "@/types/shared"
import type { InsightsData, ReactionSummary } from "../types"

export function CompanionInsights({
  companion,
  insights,
  reactions,
}: {
  companion: Companion
  insights: InsightsData
  reactions: ReactionSummary | null
}) {
  const currentScore = insights.moodHistory.length > 0
    ? insights.moodHistory[insights.moodHistory.length - 1].score
    : companion.relationshipLevel

  return (
    <div className="flex flex-col gap-6 px-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Mood Aura + Avatar */}
      <MoodAura
        mood={companion.mood}
        moodScore={currentScore}
        name={companion.name}
        avatarUrl={companion.avatarUrl}
      />

      {/* Quick Stats */}
      <QuickStats
        totalMessages={insights.stats.totalMessages}
        totalMemories={insights.stats.totalMemories}
        daysTogether={insights.stats.daysTogether}
      />

      {/* Emotion Bloom — Reaction Visualization */}
      {reactions && <EmotionBloom reactions={reactions} />}

      {/* Mood History Sparkline */}
      <MoodSparkline
        data={insights.moodHistory}
        currentMood={companion.mood}
      />

      {/* Interaction Streak */}
      <StreakCounter
        current={insights.streak.current}
        longest={insights.streak.longest}
      />

      {/* Milestones */}
      <Milestones milestones={insights.milestones} />
    </div>
  )
}
