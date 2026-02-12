"use client"

import { useState } from "react"
import { MemoryCard } from "./memory-card"
import * as api from "@/lib/api"
import type { Memory } from "../types"

export function MemoriesTimeline({ initialMemories }: { initialMemories: Memory[] }) {
  const [memories, setMemories] = useState(initialMemories)

  function handleDelete(memoryId: string) {
    setMemories((prev) => prev.filter((m) => m.id !== memoryId))
    api.deleteMemory(memoryId)
  }

  if (memories.length === 0) return null

  return (
    <div className="relative space-y-4 px-4">
      <div className="absolute left-7 top-0 bottom-0 w-px bg-border" />
      {memories.map((memory) => (
        <div key={memory.id} className="relative pl-8">
          <div className="absolute left-[25px] top-4 h-2.5 w-2.5 rounded-full border-2 border-primary bg-background" />
          <MemoryCard memory={memory} onDelete={handleDelete} />
        </div>
      ))}
    </div>
  )
}
