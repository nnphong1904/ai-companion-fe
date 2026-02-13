import type { Companion } from "@/types/shared"

export type StarPosition = {
  companion: Companion
  x: number
  y: number
  size: number
}

export type BgStar = {
  x: number
  y: number
  r: number
  delay: number
}

function fract(n: number) {
  return Math.round((n - Math.floor(n)) * 1e6) / 1e6
}

export function generateBgStars(count: number, w: number, h: number): BgStar[] {
  const seed = 42
  const stars: BgStar[] = []
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

export function getCompanionPositions(
  companions: Companion[],
  cx: number,
  cy: number,
  maxRadius: number,
): StarPosition[] {
  return companions.map((c, i) => {
    const angle = (i / companions.length) * Math.PI * 2 - Math.PI / 2
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
