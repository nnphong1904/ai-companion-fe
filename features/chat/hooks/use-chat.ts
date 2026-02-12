"use client"

import { useRef, useState } from "react"
import { sendMessage as sendMessageAction, saveMemory as saveMemoryAction } from "@/features/chat/actions"
import type { Message } from "../types"

type UseChatOptions = {
  companionId: string
  initialMessages: Message[]
}

export function useChat({ companionId, initialMessages }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

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
      const { userMessage, companionMessage } = await sendMessageAction(
        companionId,
        content.trim(),
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
    if (!msg || msg.isMemory) return

    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, isMemory: true } : m)),
    )

    try {
      await saveMemoryAction(companionId, msg.content)
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, isMemory: false } : m)),
      )
    }
  }

  return {
    messages,
    isLoading: false,
    isSending,
    scrollRef,
    sendMessage,
    saveMemory,
    scrollToBottom,
  }
}
