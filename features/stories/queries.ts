import "server-only"
import {
  fetchApi,
  transformStory,
  type BackendStory,
  type BackendCompanion,
} from "@/lib/api-fetch"
import type { Story } from "@/features/stories/types"

export async function getStories(): Promise<Story[]> {
  const [stories, companions] = await Promise.all([
    fetchApi<BackendStory[] | null>("/stories"),
    fetchApi<BackendCompanion[] | null>("/companions"),
  ])

  const companionMap = new Map((companions ?? []).map((c) => [c.id, c]))
  return (stories ?? []).map((s) => transformStory(s, companionMap.get(s.companion_id)))
}
