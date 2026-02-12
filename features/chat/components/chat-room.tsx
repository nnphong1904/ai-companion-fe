"use client"

import { useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatHeader } from "./chat-header"
import { ChatInput } from "./chat-input"
import { ChatMessage } from "./chat-message"
import { ChatSkeleton } from "./chat-skeleton"
import { TypingIndicator } from "./typing-indicator"
import { useChat } from "../hooks/use-chat"
import type { Companion } from "@/types/shared"
import type { Message } from "../types"

export function ChatRoom({
  companion,
  initialMessages,
}: {
  companion: Companion
  initialMessages: Message[]
}) {
  const { messages, isLoading, isSending, scrollRef, sendMessage, saveMemory, scrollToBottom } =
    useChat({ companionId: companion.id, initialMessages })

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
                onToggleMemory={saveMemory}
              />
            ))}
            {isSending ? <TypingIndicator /> : null}
          </div>
        )}
      </ScrollArea>

      <ChatInput onSend={sendMessage} disabled={isSending} />
    </div>
  )
}
