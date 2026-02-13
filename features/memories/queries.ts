import "server-only";
import { fetchApi, transformMemory, type BackendMemory } from "@/lib/api-fetch";
import type { Memory } from "@/features/memories/types";

export async function getMemories(companionId: string): Promise<Memory[]> {
  const data = await fetchApi<{
    memories: BackendMemory[];
    next_cursor?: string;
    has_more: boolean;
  } | null>(`/companions/${companionId}/memories`);
  return (data?.memories ?? []).map(transformMemory);
}
