"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Companion } from "@/types/shared"
import type { Mood } from "@/features/mood/types"

// ─── Mood → Color mapping ───────────────────────────────────────────────────

const STAR_COLORS: Record<Mood, { core: string; glow: string }> = {
  distant: { core: "#a1a1aa", glow: "rgba(161,161,170,0.5)" },
  neutral: { core: "#60a5fa", glow: "rgba(96,165,250,0.5)" },
  happy: { core: "#34d399", glow: "rgba(52,211,153,0.5)" },
  attached: { core: "#f472b6", glow: "rgba(244,114,182,0.5)" },
}

const LINE_COLORS: Record<Mood, string> = {
  distant: "rgba(161,161,170,0.15)",
  neutral: "rgba(96,165,250,0.2)",
  happy: "rgba(52,211,153,0.25)",
  attached: "rgba(244,114,182,0.3)",
}

// ─── Background stars ────────────────────────────────────────────────────────

function fract(n: number) {
  return Math.round((n - Math.floor(n)) * 1e6) / 1e6
}

function generateBgStars(count: number, w: number, h: number) {
  const seed = 42
  const stars: { x: number; y: number; r: number; delay: number }[] = []
  for (let i = 0; i < count; i++) {
    const f1 = fract(Math.sin(seed + i * 127.1) * 43758.5453)
    const f2 = fract(Math.sin(seed + i * 269.5) * 12345.6789)
    const f3 = fract(Math.sin(seed + i * 419.2) * 98765.4321)
    stars.push({
      x: Math.round(f1 * w * 100) / 100,
      y: Math.round(f2 * h * 100) / 100,
      r: Math.round((0.5 + f3) * 100) / 100,
      delay: Math.round(f1 * 5 * 100) / 100,
    })
  }
  return stars
}

// ─── Position companions in a circle ─────────────────────────────────────────

function getCompanionPositions(
  companions: Companion[],
  cx: number,
  cy: number,
  maxRadius: number,
) {
  return companions.map((c, i) => {
    const angle = (i / companions.length) * Math.PI * 2 - Math.PI / 2
    // Closer relationship = closer to center
    const minR = maxRadius * 0.35
    const range = maxRadius - minR
    const dist = maxRadius - (c.relationshipLevel / 100) * range
    return {
      companion: c,
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      size: 6 + (c.relationshipLevel / 100) * 10,
    }
  })
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CompanionConstellation({
  companions,
}: {
  companions: Companion[]
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 400, h: 300 })
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const measure = useCallback(() => {
    if (containerRef.current) {
      setDims({
        w: containerRef.current.offsetWidth,
        h: containerRef.current.offsetHeight,
      })
    }
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [measure])

  const cx = dims.w / 2
  const cy = dims.h / 2
  const maxRadius = Math.min(cx, cy) - 30

  const positions = getCompanionPositions(companions, cx, cy, maxRadius)
  const bgStars = generateBgStars(60, dims.w, dims.h)

  return (
    <section className="px-4">
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">
        Constellation
      </h2>

      <div
        ref={containerRef}
        className="relative h-[280px] overflow-hidden rounded-2xl border border-border/50 bg-[#0a0a12] sm:h-[340px]"
      >
        <svg
          viewBox={`0 0 ${dims.w} ${dims.h}`}
          className="h-full w-full"
          style={{ width: dims.w, height: dims.h }}
        >
          <defs>
            {/* Glow filter */}
            <filter id="star-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="center-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background stars */}
          {bgStars.map((s, i) => (
            <circle
              key={`bg-${i}`}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill="white"
              opacity={0.3}
            >
              <animate
                attributeName="opacity"
                values="0.15;0.5;0.15"
                dur={`${2.5 + s.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* Connection lines */}
          {positions.map(({ companion, x, y }) => {
            const isHovered = hoveredId === companion.id
            const opacity = isHovered ? 0.6 : companion.relationshipLevel / 200
            return (
              <line
                key={`line-${companion.id}`}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke={LINE_COLORS[companion.mood]}
                strokeWidth={isHovered ? 2 : 1}
                opacity={opacity}
                className="transition-all duration-300"
              />
            )
          })}

          {/* Center node (You) */}
          <circle
            cx={cx}
            cy={cy}
            r={8}
            fill="white"
            filter="url(#center-glow)"
            opacity={0.9}
          >
            <animate
              attributeName="opacity"
              values="0.7;1;0.7"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          <text
            x={cx}
            y={cy + 22}
            textAnchor="middle"
            fill="rgba(255,255,255,0.5)"
            fontSize="10"
            fontFamily="inherit"
          >
            You
          </text>

          {/* Companion stars */}
          {positions.map(({ companion, x, y, size }) => {
            const { core, glow } = STAR_COLORS[companion.mood]
            const isHovered = hoveredId === companion.id

            return (
              <g
                key={companion.id}
                onMouseEnter={() => setHoveredId(companion.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Glow ring on hover */}
                <circle
                  cx={x}
                  cy={y}
                  r={size + 8}
                  fill="none"
                  stroke={core}
                  strokeWidth={1}
                  opacity={isHovered ? 0.4 : 0}
                  className="transition-opacity duration-300"
                />

                {/* Outer glow */}
                <circle
                  cx={x}
                  cy={y}
                  r={size + 2}
                  fill={glow}
                  filter="url(#star-glow)"
                >
                  <animate
                    attributeName="r"
                    values={`${size + 1};${size + 3};${size + 1}`}
                    dur={`${2.5 + (companion.relationshipLevel % 3)}s`}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Core */}
                <circle cx={x} cy={y} r={size} fill={core}>
                  <animate
                    attributeName="opacity"
                    values="0.8;1;0.8"
                    dur={`${2 + (companion.relationshipLevel % 2)}s`}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Companion name */}
                <text
                  x={x}
                  y={y + size + 14}
                  textAnchor="middle"
                  fill={isHovered ? "white" : "rgba(255,255,255,0.6)"}
                  fontSize="11"
                  fontWeight={isHovered ? "600" : "400"}
                  fontFamily="inherit"
                  className="pointer-events-none transition-all duration-200"
                >
                  {companion.name}
                </text>

                {/* Mood label on hover */}
                {isHovered ? (
                  <text
                    x={x}
                    y={y - size - 8}
                    textAnchor="middle"
                    fill={core}
                    fontSize="10"
                    fontFamily="inherit"
                    className="pointer-events-none animate-in fade-in duration-200"
                  >
                    {companion.mood} · {companion.relationshipLevel}%
                  </text>
                ) : null}
              </g>
            )
          })}
        </svg>

        {/* Link overlays — positioned on top of each star for Next.js client navigation */}
        {positions.map(({ companion, x, y, size }) => (
          <Link
            key={`link-${companion.id}`}
            href={`/companions/${companion.id}`}
            scroll={false}
            className="absolute rounded-full"
            style={{
              left: x - size - 8,
              top: y - size - 8,
              width: (size + 8) * 2,
              height: (size + 8) * 2,
            }}
            onMouseEnter={() => setHoveredId(companion.id)}
            onMouseLeave={() => setHoveredId(null)}
          />
        ))}
      </div>
    </section>
  )
}
