"use client"

import type { Mood } from "@/features/mood/types"
import type { MoodHistoryPoint } from "../types"

const LINE_COLOR: Record<Mood, string> = {
  distant: "#a1a1aa",
  neutral: "#60a5fa",
  happy: "#34d399",
  attached: "#f472b6",
}

const FILL_COLOR: Record<Mood, string> = {
  distant: "rgba(161,161,170,0.15)",
  neutral: "rgba(96,165,250,0.15)",
  happy: "rgba(52,211,153,0.15)",
  attached: "rgba(244,114,182,0.15)",
}

export function MoodSparkline({
  data,
  currentMood,
}: {
  data: MoodHistoryPoint[]
  currentMood: Mood
}) {
  if (data.length < 2) return null

  const W = 320
  const H = 80
  const PAD_X = 8
  const PAD_Y = 8

  const scores = data.map((d) => d.score)
  const min = Math.min(...scores)
  const max = Math.max(...scores)
  const range = max - min || 1

  const points = data.map((d, i) => ({
    x: PAD_X + (i / (data.length - 1)) * (W - PAD_X * 2),
    y: PAD_Y + (1 - (d.score - min) / range) * (H - PAD_Y * 2),
  }))

  // Build smooth bezier path
  let linePath = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const cpx = (points[i - 1].x + points[i].x) / 2
    linePath += ` C ${cpx} ${points[i - 1].y}, ${cpx} ${points[i].y}, ${points[i].x} ${points[i].y}`
  }

  // Closed fill path
  const fillPath = `${linePath} L ${points[points.length - 1].x} ${H} L ${points[0].x} ${H} Z`

  const lineColor = LINE_COLOR[currentMood]
  const fillColor = FILL_COLOR[currentMood]

  const firstDate = new Date(data[0].date)
  const lastDate = new Date(data[data.length - 1].date)
  const formatShort = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" })

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Mood History</h3>
        <span className="text-xs text-muted-foreground">
          {formatShort(firstDate)} — {formatShort(lastDate)}
        </span>
      </div>

      <div className="rounded-xl border border-border/50 bg-card/50 p-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-20 w-full">
          {/* Fill */}
          <path d={fillPath} fill={fillColor} />
          {/* Line */}
          <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" />
          {/* Dots */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === points.length - 1 ? 4 : 2.5}
              fill={i === points.length - 1 ? lineColor : "transparent"}
              stroke={lineColor}
              strokeWidth={i === points.length - 1 ? 0 : 1.5}
            />
          ))}
        </svg>

        {/* Score labels */}
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>Low: {min}</span>
          <span>Current: {scores[scores.length - 1]}</span>
          <span>High: {max}</span>
        </div>
      </div>
    </div>
  )
}
