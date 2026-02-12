"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { use, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatInput } from "@/components/chat-input"
import { ChatMessage } from "@/components/chat-message"
import { ChatSkeleton } from "@/components/loading-skeleton"
import { TypingIndicator } from "@/components/typing-indicator"
import { useChat } from "@/hooks/use-chat"
import * as api from "@/lib/api"
import type { Companion } from "@/types"

function ChatHeader({ companion }: { companion: Companion | null }) {
  return (
    <header className="flex items-center gap-3 border-b px-3 py-2">
      <Button asChild variant="ghost" size="icon" className="shrink-0">
        <Link href="/chat">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold">
          {companion?.name ?? "Chat"}
        </h1>
        {companion && (
          <p className="truncate text-xs text-muted-foreground">
            Feeling {companion.mood}
          </p>
        )}
      </div>
    </header>
  )
}

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
