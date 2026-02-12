"use client"

import { useEffect, useRef, useState } from "react"
import * as api from "@/lib/api"
import type { Message } from "../types"

export function useChat(companionId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    api.getMessages(companionId).then((msgs) => {
      if (!cancelled) {
        setMessages(msgs)
        setIsLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [companionId])

  function scrollToBottom() {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    })
  }

  async function sendMessage(content: string) {
    if (!content.trim() || isSending) return

    // Optimistic insert of user message
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
      const { userMessage, aiResponse } = await api.sendMessage(companionId, content.trim())

      // Replace optimistic with real user message + add AI response
      setMessages((prev) => {
        const withoutOptimistic = prev.filter((m) => m.id !== optimisticMsg.id)
        return [
          ...withoutOptimistic,
          userMessage,
          {
            id: `ai-${Date.now()}`,
            companionId,
            role: "assistant" as const,
            content: aiResponse,
            createdAt: new Date().toISOString(),
            isMemory: false,
          },
        ]
      })
      scrollToBottom()
    } finally {
      setIsSending(false)
    }
  }

  async function toggleMemory(messageId: string) {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, isMemory: !m.isMemory } : m)),
    )
    const msg = messages.find((m) => m.id === messageId)
    if (msg) {
      await api.toggleMemory(messageId, !msg.isMemory)
    }
  }

  return {
    messages,
    isLoading,
    isSending,
    scrollRef,
    sendMessage,
    toggleMemory,
    scrollToBottom,
  }
}
