import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ChatRoom } from "@/features/chat/components/chat-room"
import { getCompanion } from "@/features/companions/queries"
import { getMessages } from "@/features/chat/queries"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const companion = await getCompanion(id)
  return {
    title: companion ? `Chat with ${companion.name}` : "Chat",
  }
}

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [companion, data] = await Promise.all([
    getCompanion(id),
    getMessages(id),
  ])

  if (!companion) notFound()

  return (
    <ChatRoom
      companion={companion}
      initialMessages={data.messages}
      initialCursor={data.nextCursor}
      initialHasMore={data.hasMore}
    />
  )
}
