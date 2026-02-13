import "server-only"
import {
  fetchApi,
  ApiError,
  transformCompanion,
  type BackendCompanion,
  type BackendRelationship,
} from "@/lib/api-fetch"
import type { Companion } from "@/types/shared"

export async function getAllCompanions(): Promise<Companion[]> {
  const [companions, relationships] = await Promise.all([
    fetchApi<BackendCompanion[] | null>("/companions"),
    fetchApi<BackendRelationship[] | null>("/relationships").catch(() => null),
  ])

  const relMap = new Map((relationships ?? []).map((r) => [r.companion_id, r]))
  return (companions ?? []).map((c) => transformCompanion(c, relMap.get(c.id)))
}

export async function getMyCompanions(): Promise<Companion[]> {
  const [companions, relationships] = await Promise.all([
    fetchApi<BackendCompanion[] | null>("/companions"),
    fetchApi<BackendRelationship[] | null>("/relationships").catch(() => null),
  ])

  const rels = relationships ?? []
  if (rels.length === 0) return []

  const relMap = new Map(rels.map((r) => [r.companion_id, r]))
  return (companions ?? [])
    .filter((c) => relMap.has(c.id))
    .map((c) => transformCompanion(c, relMap.get(c.id)))
}

/**
 * Single fetch for dashboard — avoids redundant /companions + /relationships calls.
 */
export async function getDashboardCompanions(): Promise<{
  myCompanions: Companion[]
  allCompanions: Companion[]
}> {
  const [companions, relationships] = await Promise.all([
    fetchApi<BackendCompanion[] | null>("/companions"),
    fetchApi<BackendRelationship[] | null>("/relationships").catch(() => null),
  ])

  const rels = relationships ?? []
  const relMap = new Map(rels.map((r) => [r.companion_id, r]))

  const allCompanions = (companions ?? []).map((c) =>
    transformCompanion(c, relMap.get(c.id)),
  )

  const myCompanions =
    rels.length === 0
      ? []
      : allCompanions.filter((c) => relMap.has(c.id))

  return { myCompanions, allCompanions }
}

// ─── Public (anonymous) queries via /browse ─────────────────────────────────

export async function getPublicCompanions(): Promise<Companion[]> {
  const companions = await fetchApi<BackendCompanion[] | null>("/browse/companions")
  return (companions ?? []).map((c) => transformCompanion(c))
}

export async function getPublicCompanion(id: string): Promise<Companion | null> {
  try {
    const companion = await fetchApi<BackendCompanion>(`/browse/companions/${id}`)
    return transformCompanion(companion)
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null
    throw e
  }
}

// ─── Authenticated queries ──────────────────────────────────────────────────

export async function getCompanion(id: string): Promise<Companion | null> {
  let companion: BackendCompanion
  try {
    companion = await fetchApi<BackendCompanion>(`/companions/${id}`)
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null
    throw e
  }

  let relationship: BackendRelationship | undefined
  try {
    relationship = await fetchApi<BackendRelationship>(`/companions/${id}/relationship`)
  } catch {
    // No relationship yet — that's fine
  }

  return transformCompanion(companion, relationship)
}
