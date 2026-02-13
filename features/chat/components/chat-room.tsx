"use client"

import { useEffect } from "react"
import { ArrowDown, Loader2, MessageCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
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
  initialCursor,
  initialHasMore,
}: {
  companion: Companion
  initialMessages: Message[]
  initialCursor?: string | null
  initialHasMore?: boolean
}) {
  const {
    messages,
    isLoading,
    isSending,
    isLoadingMore,
    hasMore,
    showScrollButton,
    scrollRef,
    sendMessage,
    saveMemory,
    scrollToBottom,
    handleScroll,
    loadOlderMessages,
  } = useChat({
    companionId: companion.id,
    initialMessages,
    initialCursor,
    initialHasMore,
  })

  useEffect(() => {
    if (!isLoading) scrollToBottom()
  }, [isLoading, scrollToBottom])

  return (
    <div className="flex h-dvh flex-col">
      <ChatHeader companion={companion} />

      <div className="relative flex-1 overflow-hidden">
        <ScrollArea ref={scrollRef} className="h-full" onScrollCapture={handleScroll}>
          {isLoading ? (
            <ChatSkeleton />
          ) : (
            <div className="space-y-3 p-4">
              {hasMore ? (
                <div className="flex justify-center pb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isLoadingMore}
                    onClick={loadOlderMessages}
                    className="text-xs text-muted-foreground"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load older messages"
                    )}
                  </Button>
                </div>
              ) : null}
              {messages.length === 0 && !isSending ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                    <MessageCircle className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">No messages yet</p>
                    <p className="max-w-[200px] text-xs text-muted-foreground">
                      Say hi to {companion.name} to start the conversation!
                    </p>
                  </div>
                </div>
              ) : null}
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

        {showScrollButton ? (
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-3 left-1/2 z-10 h-8 w-8 -translate-x-1/2 rounded-full shadow-lg"
            onClick={scrollToBottom}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      <ChatInput onSend={sendMessage} disabled={isSending} />
    </div>
  )
}
