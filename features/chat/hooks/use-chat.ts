"use client"

import { useEffect, useRef, useState } from "react"
import * as api from "@/lib/api"
import { getToken } from "@/lib/token"
import type { Message } from "../types"

type UseChatOptions = {
  companionId: string
  initialMessages?: Message[]
}

export function useChat({ companionId, initialMessages }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>(initialMessages ?? [])
  const [isLoading, setIsLoading] = useState(!initialMessages)
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialMessages) return
    let cancelled = false
    setIsLoading(true)
    const token = getToken() ?? undefined
    api.getMessages(companionId, token).then((msgs) => {
      if (!cancelled) {
        setMessages(msgs)
        setIsLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [companionId, initialMessages])

  function scrollToBottom() {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    })
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
      const token = getToken() ?? undefined
      const { userMessage, companionMessage } = await api.sendMessage(
        companionId,
        content.trim(),
        token,
      )

      setMessages((prev) => {
        const withoutOptimistic = prev.filter((m) => m.id !== optimisticMsg.id)
        return [...withoutOptimistic, userMessage, companionMessage]
      })
      scrollToBottom()
    } finally {
      setIsSending(false)
    }
  }

  async function saveMemory(messageId: string) {
    const msg = messages.find((m) => m.id === messageId)
    if (!msg) return

    if (msg.isMemory) {
      // Already saved — no unsave for now (would need memory ID tracking)
      return
    }

    // Optimistically mark as saved
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, isMemory: true } : m)),
    )

    try {
      const token = getToken() ?? undefined
      await api.saveMemory(companionId, msg.content, undefined, token)
    } catch {
      // Revert on failure
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, isMemory: false } : m)),
      )
    }
  }

  return {
    messages,
    isLoading,
    isSending,
    scrollRef,
    sendMessage,
    saveMemory,
    scrollToBottom,
  }
}
