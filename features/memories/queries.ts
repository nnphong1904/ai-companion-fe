import "server-only"
import {
  fetchApi,
  transformMemory,
  type BackendMemory,
} from "@/lib/api-fetch"
import type { Memory } from "@/features/memories/types"

export async function getMemories(
  companionId: string,
): Promise<Memory[]> {
  const data = await fetchApi<BackendMemory[] | null>(`/companions/${companionId}/memories`)
  return (data ?? []).map(transformMemory)
}
