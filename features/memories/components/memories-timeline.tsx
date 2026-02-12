"use client"

import { useState } from "react"
import { MemoryCard } from "./memory-card"
import * as api from "@/lib/api"
import { getToken } from "@/lib/token"
import type { Memory } from "../types"

export function MemoriesTimeline({ initialMemories }: { initialMemories: Memory[] }) {
  const [memories, setMemories] = useState(initialMemories)

  function handleDelete(memoryId: string) {
    setMemories((prev) => prev.filter((m) => m.id !== memoryId))
    const token = getToken() ?? undefined
    api.deleteMemory(memoryId, token)
  }

  async function handleTogglePin(memoryId: string) {
    // Optimistic update
    setMemories((prev) =>
      prev.map((m) => (m.id === memoryId ? { ...m, pinned: !m.pinned } : m)),
    )
    try {
      const token = getToken() ?? undefined
      await api.toggleMemoryPin(memoryId, token)
    } catch {
      // Revert on failure
      setMemories((prev) =>
        prev.map((m) => (m.id === memoryId ? { ...m, pinned: !m.pinned } : m)),
      )
    }
  }

  if (memories.length === 0) return null

  return (
    <div className="relative space-y-4 px-4">
      <div className="absolute left-7 top-0 bottom-0 w-px bg-border" />
      {memories.map((memory) => (
        <div key={memory.id} className="relative pl-8">
          <div className="absolute left-[25px] top-4 h-2.5 w-2.5 rounded-full border-2 border-primary bg-background" />
          <MemoryCard
            memory={memory}
            onDelete={handleDelete}
            onTogglePin={handleTogglePin}
          />
        </div>
      ))}
    </div>
  )
}
