"use client"

import { useCallback, useRef, useState } from "react"
import { toast } from "sonner"
import {
  sendMessage as sendMessageAction,
  saveMemory as saveMemoryAction,
  loadMoreMessages,
} from "@/features/chat/actions"
import type { Message } from "../types"

type UseChatOptions = {
  companionId: string
  initialMessages: Message[]
  initialCursor?: string | null
  initialHasMore?: boolean
}

export function useChat({
  companionId,
  initialMessages,
  initialCursor = null,
  initialHasMore = false,
}: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isSending, setIsSending] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const cursorRef = useRef<string | null>(initialCursor)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    })
  }, [])

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    setShowScrollButton(distanceFromBottom > 200)
  }, [])

  async function loadOlderMessages() {
    if (isLoadingMore || !hasMore || !cursorRef.current) return

    const el = scrollRef.current
    const prevHeight = el?.scrollHeight ?? 0

    setIsLoadingMore(true)
    try {
      const result = await loadMoreMessages(companionId, cursorRef.current)
      setMessages((prev) => [...result.messages, ...prev])
      cursorRef.current = result.nextCursor
      setHasMore(result.hasMore)

      // Preserve scroll position after prepending
      requestAnimationFrame(() => {
        if (el) {
          el.scrollTop = el.scrollHeight - prevHeight
        }
      })
    } catch {
      toast.error("Failed to load older messages")
    } finally {
      setIsLoadingMore(false)
    }
  }

  async function sendMessage(content: string) {
    if (!content.trim() || isSending) return

    const optimisticMsg: Message = {
      id: `opt-${Date.now()}`,
      companionId,
      role: "user",
      content: content.trim(),
      createdAt: new Date().toISOString(),
      isMemory: false,
    }
    setMessages((prev) => [...prev, optimisticMsg])
    setIsSending(true)
    scrollToBottom()

    try {
      const { userMessage, companionMessage } = await sendMessageAction(
        companionId,
        content.trim(),
      )

      setMessages((prev) => {
        const withoutOptimistic = prev.filter((m) => m.id !== optimisticMsg.id)
        return [...withoutOptimistic, userMessage, companionMessage]
      })
      scrollToBottom()
    } catch {
      toast.error("Failed to send message")
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id))
    } finally {
      setIsSending(false)
    }
  }

  async function saveMemory(messageId: string) {
    const msg = messages.find((m) => m.id === messageId)
    if (!msg || msg.isMemory) return

    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, isMemory: true } : m)),
    )

    try {
      await saveMemoryAction(companionId, msg.content)
      toast.success("Memory saved")
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, isMemory: false } : m)),
      )
      toast.error("Failed to save memory")
    }
  }

  return {
    messages,
    isLoading: false,
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
  }
}
