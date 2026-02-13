"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, MessageCircle, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MOOD_MAP, getRelationshipLabel } from "@/features/mood"
import { formatRelativeTime } from "@/lib/format"
import type { Companion } from "@/types/shared"
import type { Mood } from "@/features/mood/types"

// ─── Mood-specific hero styling ─────────────────────────────────────────────

const HERO_MOOD: Record<
  Mood,
  {
    gradient: string
    auraColors: [string, string, string]
    auraGlow: string
    dotClass: string
    accentText: string
    particleColor: string
  }
> = {
  distant: {
    gradient:
      "radial-gradient(ellipse at 30% 50%, rgba(161,161,170,0.12) 0%, transparent 70%)",
    auraColors: ["#71717a", "#a1a1aa", "#52525b"],
    auraGlow: "rgba(161,161,170,0.25)",
    dotClass: "bg-zinc-400",
    accentText: "text-zinc-400",
    particleColor: "#a1a1aa",
  },
  neutral: {
    gradient:
      "radial-gradient(ellipse at 30% 50%, rgba(96,165,250,0.15) 0%, transparent 70%)",
    auraColors: ["#3b82f6", "#60a5fa", "#2563eb"],
    auraGlow: "rgba(96,165,250,0.3)",
    dotClass: "bg-blue-400",
    accentText: "text-blue-400",
    particleColor: "#60a5fa",
  },
  happy: {
    gradient:
      "radial-gradient(ellipse at 30% 50%, rgba(52,211,153,0.15) 0%, transparent 70%)",
    auraColors: ["#10b981", "#34d399", "#059669"],
    auraGlow: "rgba(52,211,153,0.3)",
    dotClass: "bg-emerald-400",
    accentText: "text-emerald-400",
    particleColor: "#34d399",
  },
  attached: {
    gradient:
      "radial-gradient(ellipse at 30% 50%, rgba(244,114,182,0.18) 0%, transparent 70%)",
    auraColors: ["#ec4899", "#f472b6", "#db2777"],
    auraGlow: "rgba(244,114,182,0.35)",
    dotClass: "bg-pink-400",
    accentText: "text-pink-400",
    particleColor: "#f472b6",
  },
}

// ─── Deterministic background stars ─────────────────────────────────────────

function fract(n: number) {
  return Math.round((n - Math.floor(n)) * 1e6) / 1e6
}

function generateStars(count: number) {
  const seed = 77
  const stars: { x: number; y: number; r: number; delay: number }[] = []
  for (let i = 0; i < count; i++) {
    const f1 = fract(Math.sin(seed + i * 127.1) * 43758.5453)
    const f2 = fract(Math.sin(seed + i * 269.5) * 12345.6789)
    const f3 = fract(Math.sin(seed + i * 419.2) * 98765.4321)
    stars.push({
      x: Math.round(f1 * 100 * 100) / 100, // percentage
      y: Math.round(f2 * 100 * 100) / 100,
      r: Math.round((0.4 + f3 * 0.8) * 100) / 100,
      delay: Math.round(f1 * 5 * 100) / 100,
    })
  }
  return stars
}

const BG_STARS = generateStars(25)

// ─── Component ──────────────────────────────────────────────────────────────

export function HeroCompanionCard({
  companion,
}: {
  companion: Companion
}) {
  const router = useRouter()
  const mood = HERO_MOOD[companion.mood]
  const moodConfig = MOOD_MAP[companion.mood]
  const relationshipLabel = getRelationshipLabel(companion.relationshipLevel)
  const pulseDuration = 3 - (companion.relationshipLevel / 100) * 1.5

  return (
    <div
      className="group relative h-[200px] overflow-hidden rounded-2xl border border-white/[0.06] sm:h-[240px]"
      style={{ animation: "hero-entrance 0.5s ease-out both" }}
    >
      {/* Dark base + mood gradient */}
      <div
        className="absolute inset-0 bg-[#0a0a12]"
        style={{ backgroundImage: mood.gradient }}
      />

      {/* Twinkling star particles */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        {BG_STARS.map((s, i) => (
          <circle
            key={i}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.r}
            fill={mood.particleColor}
            opacity={0.3}
          >
            <animate
              attributeName="opacity"
              values="0.1;0.5;0.1"
              dur={`${2.5 + s.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>

      {/* Content */}
      <div className="relative flex h-full flex-col items-center justify-center gap-3 px-5 py-4 sm:flex-row sm:gap-5 sm:px-6">
        {/* Avatar with aura ring */}
        <Link
          href={`/companions/${companion.id}`}
          scroll={false}
          className="shrink-0"
        >
          <div className="relative flex items-center justify-center">
            {/* Glow layer */}
            <div
              className="absolute h-20 w-20 rounded-full sm:h-24 sm:w-24"
              style={{
                boxShadow: `0 0 40px 8px ${mood.auraGlow}, 0 0 80px 30px ${mood.auraGlow}`,
                animation: `aura-pulse ${pulseDuration}s ease-in-out infinite`,
              }}
            />

            {/* Rotating gradient ring */}
            <div
              className="absolute h-20 w-20 rounded-full sm:h-24 sm:w-24"
              style={{
                background: `conic-gradient(from 0deg, ${mood.auraColors[0]}, ${mood.auraColors[1]}, ${mood.auraColors[2]}, ${mood.auraColors[1]}, ${mood.auraColors[0]})`,
                animation: "aura-spin 6s linear infinite",
              }}
            />

            {/* Inner mask — creates the ring */}
            <div className="absolute h-[72px] w-[72px] rounded-full bg-[#0a0a12] sm:h-[88px] sm:w-[88px]" />

            {/* Avatar */}
            <Avatar className="relative h-16 w-16 sm:h-20 sm:w-20">
              <AvatarImage src={companion.avatarUrl} alt={companion.name} />
              <AvatarFallback className="text-2xl">
                {companion.name[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </Link>

        {/* Info section */}
        <div className="flex min-w-0 flex-1 flex-col items-center gap-2 sm:items-start">
          {/* Name + mood */}
          <div className="space-y-1 text-center sm:text-left">
            <Link
              href={`/companions/${companion.id}`}
              scroll={false}
              className="block"
            >
              <h3 className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-white/90 sm:text-xl">
                {companion.name}
              </h3>
            </Link>
            <p className="line-clamp-2 text-sm text-white/50">
              {companion.description}
            </p>
          </div>

          {/* Mood badge + last interaction */}
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm",
                moodConfig.color,
                moodConfig.textColor,
              )}
            >
              {moodConfig.emoji} {moodConfig.label}
            </span>
            <span className="text-xs text-white/40">
              {formatRelativeTime(companion.lastInteraction)}
            </span>
          </div>

          {/* Relationship bar */}
          <div className="w-full max-w-[240px] space-y-1">
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => {
                const threshold = i * 20
                const isFilled =
                  companion.relationshipLevel >= threshold + 10
                const isPartial =
                  !isFilled && companion.relationshipLevel >= threshold
                return (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-colors",
                      isFilled
                        ? mood.dotClass
                        : isPartial
                          ? cn(mood.dotClass, "opacity-40")
                          : "bg-white/10",
                    )}
                  />
                )
              })}
            </div>
            <div className="flex items-center justify-between">
              <span className={cn("text-xs font-medium", mood.accentText)}>
                {relationshipLabel}
              </span>
              <span className="text-[11px] text-white/30">
                {companion.relationshipLevel}%
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex shrink-0 gap-2 sm:self-center">
          <Link
            href={`/chat/${companion.id}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:border-white/20 hover:bg-white/10"
          >
            <MessageCircle className="h-4 w-4" />
          </Link>
          <button
            onClick={() => router.push(`/companions/${companion.id}?view=memories`, { scroll: false })}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:border-white/20 hover:bg-white/10"
          >
            <BookOpen className="h-4 w-4" />
          </button>
          <button
            onClick={() => router.push(`/companions/${companion.id}?view=insights`, { scroll: false })}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:border-white/20 hover:bg-white/10"
          >
            <TrendingUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
