"use client"

import { useState } from "react"
import { toast } from "sonner"
import { deleteMemory as deleteMemoryAction, toggleMemoryPin } from "@/features/memories/actions"
import type { Memory } from "../types"

export function useMemories(initialMemories: Memory[]) {
  const [memories, setMemories] = useState(initialMemories)

  async function deleteMemory(memoryId: string) {
    setMemories((prev) => prev.filter((m) => m.id !== memoryId))
    try {
      await deleteMemoryAction(memoryId)
    } catch {
      toast.error("Failed to delete memory")
    }
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
      toast.error("Failed to update pin")
    }
  }

  return { memories, deleteMemory, togglePin }
}
