"use client"

import { useState } from "react"
import { deleteMemory as deleteMemoryAction, toggleMemoryPin } from "@/features/memories/actions"
import type { Memory } from "../types"

export function useMemories(initialMemories: Memory[]) {
  const [memories, setMemories] = useState(initialMemories)

  function deleteMemory(memoryId: string) {
    setMemories((prev) => prev.filter((m) => m.id !== memoryId))
    deleteMemoryAction(memoryId)
  }

  async function togglePin(memoryId: string) {
    setMemories((prev) =>
      prev.map((m) => (m.id === memoryId ? { ...m, pinned: !m.pinned } : m)),
    )
    try {
      await toggleMemoryPin(memoryId)
    } catch {
      setMemories((prev) =>
        prev.map((m) => (m.id === memoryId ? { ...m, pinned: !m.pinned } : m)),
      )
    }
  }

  return { memories, deleteMemory, togglePin }
}
