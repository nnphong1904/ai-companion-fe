"use client"

import { cn } from "@/lib/utils"
import type { ReactionSummary, ReactionType } from "../types"

const REACTION_CONFIG: Record<
  ReactionType,
  { emoji: string; label: string; color: string; glow: string }
> = {
  love: {
    emoji: "\u2764\uFE0F",
    label: "Love",
    color: "#f43f5e",
    glow: "rgba(244,63,94,0.35)",
  },
  heart_eyes: {
    emoji: "\uD83D\uDE0D",
    label: "Adoration",
    color: "#ec4899",
    glow: "rgba(236,72,153,0.35)",
  },
  sad: {
    emoji: "\uD83D\uDE22",
    label: "Empathy",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.35)",
  },
  angry: {
    emoji: "\uD83D\uDE21",
    label: "Passion",
    color: "#f97316",
    glow: "rgba(249,115,22,0.35)",
  },
}

// Petals: top, right, bottom, left
const PETAL_ORDER: ReactionType[] = ["love", "heart_eyes", "sad", "angry"]
const PETAL_ANGLES = [270, 0, 90, 180] // degrees (SVG: 0=right, 90=down)

const CX = 100
const CY = 100
const MIN_LENGTH = 20
const MAX_LENGTH = 65
const PETAL_WIDTH = 14

/**
 * Builds an SVG path for a teardrop-shaped petal.
 * The petal starts at center, curves out to `length` at the given angle.
 */
function petalPath(angleDeg: number, length: number): string {
  const rad = (angleDeg * Math.PI) / 180

  // Tip of the petal
  const tipX = CX + Math.cos(rad) * length
  const tipY = CY + Math.sin(rad) * length

  // Perpendicular direction for width
  const perpX = -Math.sin(rad) * PETAL_WIDTH
  const perpY = Math.cos(rad) * PETAL_WIDTH

  // Side control points (at ~40% of length)
  const midFactor = 0.4
  const midX = CX + Math.cos(rad) * length * midFactor
  const midY = CY + Math.sin(rad) * length * midFactor

  const leftMidX = midX + perpX
  const leftMidY = midY + perpY
  const rightMidX = midX - perpX
  const rightMidY = midY - perpY

  return [
    `M ${CX} ${CY}`,
    `Q ${leftMidX} ${leftMidY} ${tipX} ${tipY}`,
    `Q ${rightMidX} ${rightMidY} ${CX} ${CY}`,
    "Z",
  ].join(" ")
}

function EmptyBloom() {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">
        Emotional Bloom
      </h3>
      <div className="rounded-xl border border-border/50 bg-card/50 p-6">
        <div className="flex flex-col items-center gap-3 py-4">
          <svg viewBox="0 0 200 200" className="h-32 w-32 opacity-20">
            {PETAL_ANGLES.map((angle, i) => (
              <path
                key={i}
                d={petalPath(angle, 40)}
                fill="currentColor"
                opacity="0.3"
              />
            ))}
            <circle
              cx={CX}
              cy={CY}
              r={22}
              fill="currentColor"
              opacity="0.15"
            />
          </svg>
          <p className="text-center text-xs text-muted-foreground">
            React to stories to see your emotional bloom grow
          </p>
        </div>
      </div>
    </div>
  )
}

export function EmotionBloom({
  reactions,
}: {
  reactions: ReactionSummary
}) {
  if (reactions.total === 0) return <EmptyBloom />

  const maxCount = Math.max(...Object.values(reactions.counts), 1)

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">
        Emotional Bloom
      </h3>
      <div className="rounded-xl border border-border/50 bg-card/50 p-3">
        <svg viewBox="0 0 200 200" className="mx-auto h-48 w-48">
          <defs>
            <filter id="bloom-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Glow layer (behind petals) */}
          {PETAL_ORDER.map((type, i) => {
            const count = reactions.counts[type]
            if (count === 0) return null
            const length =
              MIN_LENGTH + (count / maxCount) * (MAX_LENGTH - MIN_LENGTH)
            return (
              <path
                key={`glow-${type}`}
                d={petalPath(PETAL_ANGLES[i], length)}
                fill={REACTION_CONFIG[type].glow}
                filter="url(#bloom-glow)"
              />
            )
          })}

          {/* Petals */}
          {PETAL_ORDER.map((type, i) => {
            const count = reactions.counts[type]
            if (count === 0) return null
            const length =
              MIN_LENGTH + (count / maxCount) * (MAX_LENGTH - MIN_LENGTH)
            const { color } = REACTION_CONFIG[type]
            return (
              <path
                key={type}
                d={petalPath(PETAL_ANGLES[i], length)}
                fill={`${color}33`}
                stroke={color}
                strokeWidth="1.5"
              >
                <animate
                  attributeName="opacity"
                  values="0.8;1;0.8"
                  dur={`${3 + i * 0.5}s`}
                  repeatCount="indefinite"
                />
              </path>
            )
          })}

          {/* Emoji tips */}
          {PETAL_ORDER.map((type, i) => {
            const count = reactions.counts[type]
            if (count === 0) return null
            const length =
              MIN_LENGTH + (count / maxCount) * (MAX_LENGTH - MIN_LENGTH)
            const rad = (PETAL_ANGLES[i] * Math.PI) / 180
            const tx = CX + Math.cos(rad) * (length + 12)
            const ty = CY + Math.sin(rad) * (length + 12)
            return (
              <text
                key={`emoji-${type}`}
                x={tx}
                y={ty}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="14"
              >
                {REACTION_CONFIG[type].emoji}
              </text>
            )
          })}

          {/* Center circle */}
          <circle
            cx={CX}
            cy={CY}
            r={24}
            className="fill-card"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
          <text
            x={CX}
            y={CY - 4}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-foreground"
            fontSize="16"
            fontWeight="bold"
          >
            {reactions.total}
          </text>
          <text
            x={CX}
            y={CY + 10}
            textAnchor="middle"
            className="fill-muted-foreground"
            fontSize="7"
          >
            reactions
          </text>
        </svg>

        {/* Breakdown row */}
        <div className="mt-1 flex justify-center gap-4">
          {PETAL_ORDER.map((type) => (
            <div key={type} className="flex items-center gap-1">
              <span className="text-sm">{REACTION_CONFIG[type].emoji}</span>
              <span
                className={cn(
                  "text-xs tabular-nums",
                  type === reactions.dominantEmotion
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {reactions.counts[type]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
