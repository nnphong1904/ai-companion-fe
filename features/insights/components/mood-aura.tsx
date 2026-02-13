"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Mood } from "@/features/mood/types"
import { MOOD_MAP } from "@/features/mood/lib/mood"

const AURA: Record<Mood, { colors: [string, string, string]; glow: string }> = {
  distant: { colors: ["#71717a", "#a1a1aa", "#52525b"], glow: "rgba(161,161,170,0.25)" },
  neutral: { colors: ["#3b82f6", "#60a5fa", "#2563eb"], glow: "rgba(96,165,250,0.3)" },
  happy: { colors: ["#10b981", "#34d399", "#059669"], glow: "rgba(52,211,153,0.3)" },
  attached: { colors: ["#ec4899", "#f472b6", "#db2777"], glow: "rgba(244,114,182,0.35)" },
}

export function MoodAura({
  mood,
  moodScore,
  name,
  avatarUrl,
}: {
  mood: Mood
  moodScore: number
  name: string
  avatarUrl: string
}) {
  const { colors, glow } = AURA[mood]
  const { emoji, label } = MOOD_MAP[mood]

  // Faster pulse for higher mood scores
  const pulseDuration = 3 - (moodScore / 100) * 1.5

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex items-center justify-center">
        {/* Glow layer */}
        <div
          className="absolute h-36 w-36 rounded-full"
          style={{
            boxShadow: `0 0 60px 10px ${glow}, 0 0 120px 40px ${glow}`,
            animation: `aura-pulse ${pulseDuration}s ease-in-out infinite`,
          }}
        />

        {/* Rotating gradient ring */}
        <div
          className="absolute h-36 w-36 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, ${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[1]}, ${colors[0]})`,
            animation: "aura-spin 6s linear infinite",
          }}
        />

        {/* Inner mask — creates the ring */}
        <div className="absolute h-[132px] w-[132px] rounded-full bg-card" />

        {/* Avatar */}
        <Avatar className="relative h-[124px] w-[124px]">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="text-3xl">{name[0]}</AvatarFallback>
        </Avatar>
      </div>

      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold">{name}</h2>
        <p className="text-sm text-muted-foreground">
          {emoji} {label} &middot; Mood {moodScore}%
        </p>
      </div>

      {/* Injected keyframes */}
      <style jsx global>{`
        @keyframes aura-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes aura-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
      `}</style>
    </div>
  )
}
