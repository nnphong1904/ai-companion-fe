import "server-only"
import {
  fetchApi,
  transformMessage,
  type BackendMessage,
} from "@/lib/api-fetch"
import type { Message } from "@/features/chat/types"

export async function getMessages(
  companionId: string,
): Promise<Message[]> {
  const data = await fetchApi<{ messages: BackendMessage[]; next_cursor: string; has_more: boolean } | null>(
    `/companions/${companionId}/messages?limit=50`,
  )
  return (data?.messages ?? []).map(transformMessage).reverse()
}
