import "server-only"
import {
  fetchApi,
  transformStory,
  type BackendStory,
  type BackendCompanion,
  type BackendRelationship,
} from "@/lib/api-fetch"
import type { Story } from "@/features/stories/types"
import { buildMockStories } from "./mock-data"

type StoriesPage = {
  stories: BackendStory[]
  next_cursor?: string
  has_more: boolean
}

export async function getStories(): Promise<Story[]> {
  const [page, companions, relationships] = await Promise.all([
    fetchApi<StoriesPage | null>("/stories").catch(() => null),
    fetchApi<BackendCompanion[] | null>("/companions").catch(() => null),
    fetchApi<BackendRelationship[] | null>("/relationships").catch(() => null),
  ])

  const stories = page?.stories ?? []
  const companionList = companions ?? []

  // Filter stories to only the user's selected companions
  const myCompanionIds = relationships
    ? new Set(relationships.map((r) => r.companion_id))
    : null

  const filteredStories = myCompanionIds
    ? stories.filter((s) => myCompanionIds.has(s.companion_id))
    : stories

  if (filteredStories.length > 0) {
    const companionMap = new Map(companionList.map((c) => [c.id, c]))
    return filteredStories.map((s) => transformStory(s, companionMap.get(s.companion_id)))
  }

  // Fallback to mock stories built from user's companion data
  const myCompanions = myCompanionIds
    ? companionList.filter((c) => myCompanionIds.has(c.id))
    : companionList
  return buildMockStories(myCompanions)
}
