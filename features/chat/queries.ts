import "server-only"
import {
  fetchApi,
  transformMessage,
  type BackendMessage,
} from "@/lib/api-fetch"
import type { Message } from "@/features/chat/types"

export type InitialMessages = {
  messages: Message[]
  nextCursor: string | null
  hasMore: boolean
}

export async function getMessages(
  companionId: string,
): Promise<InitialMessages> {
  const data = await fetchApi<{ messages: BackendMessage[]; next_cursor: string; has_more: boolean } | null>(
    `/companions/${companionId}/messages?limit=50`,
  )
  return {
    messages: (data?.messages ?? []).map(transformMessage).reverse(),
    nextCursor: data?.has_more ? data.next_cursor : null,
    hasMore: data?.has_more ?? false,
  }
}
