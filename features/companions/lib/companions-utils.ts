import type { Companion } from "@/types/shared"

/**
 * Returns companions sorted by relationship level (highest first).
 */
function sortByRelationship(companions: Companion[]): Companion[] {
  return [...companions].sort(
    (a, b) => b.relationshipLevel - a.relationshipLevel,
  )
}

/**
 * The hero companion is the one with the highest relationship level.
 */
export function getHeroCompanion(
  companions: Companion[],
): Companion | undefined {
  return sortByRelationship(companions)[0]
}

/**
 * All companions except the hero (highest relationship), sorted by relationship.
 */
export function getRemainingCompanions(companions: Companion[]): Companion[] {
  return sortByRelationship(companions).slice(1)
}

/**
 * Companions from `all` that are not in `mine` (available to onboard).
 */
export function getAvailableCompanions(
  all: Companion[],
  mine: Companion[],
): Companion[] {
  const myIds = new Set(mine.map((c) => c.id))
  return all.filter((c) => !myIds.has(c.id))
}
