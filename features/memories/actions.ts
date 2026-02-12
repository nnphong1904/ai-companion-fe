"use server"

import {
  fetchApi,
  transformMemory,
  type BackendMemory,
} from "@/lib/api-fetch"
import type { Memory } from "@/features/memories/types"

export async function deleteMemory(memoryId: string): Promise<void> {
  await fetchApi(`/memories/${memoryId}`, {
    method: "DELETE",
  })
}

export async function toggleMemoryPin(memoryId: string): Promise<Memory> {
  const data = await fetchApi<BackendMemory>(`/memories/${memoryId}/pin`, {
    method: "PATCH",
  })
  return transformMemory(data)
}
