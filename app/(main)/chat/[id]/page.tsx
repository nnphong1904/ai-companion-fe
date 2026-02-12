import { notFound } from "next/navigation"
import { ChatRoom } from "@/features/chat"
import * as api from "@/lib/api"

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [companion, messages] = await Promise.all([
    api.getCompanion(id),
    api.getMessages(id),
  ])

  if (!companion) notFound()

  return <ChatRoom companion={companion} initialMessages={messages} />
}
