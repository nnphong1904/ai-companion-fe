import Link from "next/link"
import { cn } from "@/lib/utils"
import { MOOD_MAP, getRelationshipLabel } from "@/features/mood"
import { formatRelativeTime } from "@/lib/format"
import type { Companion } from "@/types/shared"
import type { Mood } from "@/features/mood/types"

// ─── Mood-specific card styling ──────────────────────────────────────────────

const CARD_MOOD: Record<
  Mood,
  {
    glowColor: string
    borderClass: string
    dotClass: string
    accentText: string
  }
> = {
  distant: {
    glowColor: "rgba(161,161,170,0.15)",
    borderClass: "border-zinc-500/20",
    dotClass: "bg-zinc-400",
    accentText: "text-zinc-400",
  },
  neutral: {
    glowColor: "rgba(96,165,250,0.2)",
    borderClass: "border-blue-500/20",
    dotClass: "bg-blue-400",
    accentText: "text-blue-400",
  },
  happy: {
    glowColor: "rgba(52,211,153,0.2)",
    borderClass: "border-emerald-500/20",
    dotClass: "bg-emerald-400",
    accentText: "text-emerald-400",
  },
  attached: {
    glowColor: "rgba(244,114,182,0.25)",
    borderClass: "border-pink-500/20",
    dotClass: "bg-pink-400",
    accentText: "text-pink-400",
  },
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CompanionCard({ companion }: { companion: Companion }) {
  const mood = CARD_MOOD[companion.mood]
  const moodConfig = MOOD_MAP[companion.mood]
  const relationshipLabel = getRelationshipLabel(companion.relationshipLevel)

  return (
    <Link href={`/companions/${companion.id}`} scroll={false}>
      <div className="group relative rounded-2xl">
        {/* Glow layer — visible on hover */}
        <div
          className="absolute -inset-[1px] rounded-2xl opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-70"
          style={{ background: mood.glowColor }}
        />

        {/* Card body */}
        <div
          className={cn(
            "relative aspect-[4/5] overflow-hidden rounded-2xl border transition-all duration-300",
            "group-hover:-translate-y-0.5",
            mood.borderClass,
          )}
        >
          {/* Full background avatar */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={companion.avatarUrl}
            alt={companion.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Dark gradient overlay — heavier at bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

          {/* Activity dot — top right */}
          <span
            className={cn(
              "absolute right-3 top-3 h-2.5 w-2.5 rounded-full border-[1.5px] border-black/40",
              mood.dotClass,
            )}
            style={{ animation: "card-glow-pulse 2.5s ease-in-out infinite" }}
          />

          {/* Mood badge — top left */}
          <div
            className={cn(
              "absolute left-3 top-3 flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium backdrop-blur-sm",
              moodConfig.color,
              moodConfig.textColor,
            )}
          >
            <span>{moodConfig.emoji}</span>
            <span>{moodConfig.label}</span>
          </div>

          {/* Bottom content — overlaid on gradient */}
          <div className="absolute inset-x-0 bottom-0 space-y-2 px-3.5 pb-3.5">
            {/* Name + time */}
            <div className="space-y-0.5">
              <h3 className="font-semibold leading-tight tracking-tight text-white">
                {companion.name}
              </h3>
              <p className="text-[11px] text-white/60">
                {formatRelativeTime(companion.lastInteraction)}
              </p>
            </div>

            {/* Relationship level — segmented bar */}
            <div className="space-y-1">
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
                        "h-1 flex-1 rounded-full transition-colors",
                        isFilled
                          ? mood.dotClass
                          : isPartial
                            ? cn(mood.dotClass, "opacity-40")
                            : "bg-white/15",
                      )}
                    />
                  )
                })}
              </div>
              <span className={cn("text-[10px] font-medium", mood.accentText)}>
                {relationshipLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
