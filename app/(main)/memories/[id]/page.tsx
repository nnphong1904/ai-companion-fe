"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { use, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { MemoryCard, MemorySkeleton, MemoriesEmptyState } from "@/features/memories"
import * as api from "@/lib/api"
import type { Companion, Memory } from "@/types"

export default function MemoriesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [memories, setMemories] = useState<Memory[]>([])
  const [companion, setCompanion] = useState<Companion | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getMemories(id), api.getCompanion(id)]).then(
      ([memoriesData, companionData]) => {
        setMemories(memoriesData)
        setCompanion(companionData)
        setIsLoading(false)
      },
    )
  }, [id])

  function handleDelete(memoryId: string) {
    setMemories((prev) => prev.filter((m) => m.id !== memoryId))
    api.deleteMemory(memoryId)
  }

  return (
    <div className="mx-auto max-w-lg py-4">
      <header className="flex items-center gap-3 px-4 pb-4">
        <Button asChild variant="ghost" size="icon" className="shrink-0">
          <Link href={companion ? `/companions/${companion.id}` : "/"}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-lg font-bold">
            Memories{companion ? ` with ${companion.name}` : ""}
          </h1>
          <p className="text-xs text-muted-foreground">
            {memories.length} {memories.length === 1 ? "memory" : "memories"} saved
          </p>
        </div>
      </header>

      {isLoading ? (
        <MemorySkeleton />
      ) : memories.length === 0 ? (
        <MemoriesEmptyState companionId={id} />
      ) : (
        <div className="relative space-y-4 px-4">
          {/* Timeline line */}
          <div className="absolute left-7 top-0 bottom-0 w-px bg-border" />

          {memories.map((memory) => (
            <div key={memory.id} className="relative pl-8">
              {/* Timeline dot */}
              <div className="absolute left-[25px] top-4 h-2.5 w-2.5 rounded-full border-2 border-primary bg-background" />
              <MemoryCard memory={memory} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
