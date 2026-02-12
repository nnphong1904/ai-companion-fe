"use client"

import { MemoryCard } from "./memory-card"
import { useMemories } from "../hooks/use-memories"
import type { Memory } from "../types"

export function MemoriesTimeline({ initialMemories }: { initialMemories: Memory[] }) {
  const { memories, deleteMemory, togglePin } = useMemories(initialMemories)

  if (memories.length === 0) return null

  const pinned = memories.filter((m) => m.pinned)
  const unpinned = memories.filter((m) => !m.pinned)

  return (
    <div className="space-y-6 px-4">
      {pinned.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-wider text-amber-400">
            Pinned
          </h3>
          {pinned.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onDelete={deleteMemory}
              onTogglePin={togglePin}
            />
          ))}
        </div>
      ) : null}

      {unpinned.length > 0 ? (
        <div className="space-y-3">
          {pinned.length > 0 ? (
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              All Memories
            </h3>
          ) : null}
          {unpinned.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onDelete={deleteMemory}
              onTogglePin={togglePin}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
