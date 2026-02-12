"use server"

import {
  fetchApi,
  transformMessage,
  transformMemory,
  type BackendMessage,
  type BackendMemory,
} from "@/lib/api-fetch"
import type { Message } from "@/features/chat/types"
import type { Memory } from "@/features/memories/types"

export async function sendMessage(
  companionId: string,
  content: string,
): Promise<{ userMessage: Message; companionMessage: Message }> {
  const data = await fetchApi<BackendMessage[]>(`/companions/${companionId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  })
  return {
    userMessage: transformMessage(data[0]),
    companionMessage: transformMessage(data[1]),
  }
}

export async function saveMemory(
  companionId: string,
  content: string,
): Promise<Memory> {
  const data = await fetchApi<BackendMemory>(`/companions/${companionId}/memories`, {
    method: "POST",
    body: JSON.stringify({ content }),
  })
  return transformMemory(data)
}
