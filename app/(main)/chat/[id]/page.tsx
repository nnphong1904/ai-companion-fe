"use client"

import { use, useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatHeader, ChatInput, ChatMessage, ChatSkeleton, TypingIndicator, useChat } from "@/features/chat"
import * as api from "@/lib/api"
import type { Companion } from "@/types"

export default function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [companion, setCompanion] = useState<Companion | null>(null)
  const { messages, isLoading, isSending, scrollRef, sendMessage, toggleMemory, scrollToBottom } =
    useChat(id)

  useEffect(() => {
    api.getCompanion(id).then(setCompanion)
  }, [id])

  useEffect(() => {
    if (!isLoading) scrollToBottom()
  }, [isLoading, scrollToBottom])

  return (
    <div className="flex h-dvh flex-col">
      <ChatHeader companion={companion} />

      <ScrollArea ref={scrollRef} className="flex-1">
        {isLoading ? (
          <ChatSkeleton />
        ) : (
          <div className="space-y-3 p-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onToggleMemory={toggleMemory}
              />
            ))}
            {isSending && <TypingIndicator />}
          </div>
        )}
      </ScrollArea>

      <ChatInput onSend={sendMessage} disabled={isSending} />
    </div>
  )
}
