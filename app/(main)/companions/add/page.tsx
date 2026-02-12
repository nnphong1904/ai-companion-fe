"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CompanionPickCard } from "@/components/companion"
import * as api from "@/lib/api"
import { getToken } from "@/lib/token"
import type { Companion } from "@/types/shared"

export default function AddCompanionPage() {
  const router = useRouter()
  const [available, setAvailable] = useState<Companion[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [, startTransition] = useTransition()

  useEffect(() => {
    const token = getToken() ?? undefined
    Promise.all([
      api.getAllCompanions(token),
      api.getMyCompanions(token),
    ]).then(([all, mine]) => {
      const myIds = new Set(mine.map((c) => c.id))
      setAvailable(all.filter((c) => !myIds.has(c.id)))
      setIsLoading(false)
    })
  }, [])

  function toggleCompanion(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleAdd() {
    if (selectedIds.size === 0 || isAdding) return
    setIsAdding(true)
    try {
      const token = getToken() ?? undefined
      await api.selectCompanions([...selectedIds], token)
      startTransition(() => router.push("/"))
      router.refresh()
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg py-4">
      <div className="px-4 pb-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="space-y-6 px-4">
        <div>
          <h1 className="text-2xl font-bold">Add Companion</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose new companions to connect with
          </p>
        </div>

        <div className="space-y-3">
          {isLoading
            ? Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
              ))
            : available.length === 0
              ? (
                  <p className="py-8 text-center text-muted-foreground">
                    You&apos;ve already added all available companions!
                  </p>
                )
              : available.map((companion) => (
                  <CompanionPickCard
                    key={companion.id}
                    companion={companion}
                    isSelected={selectedIds.has(companion.id)}
                    onSelect={() => toggleCompanion(companion.id)}
                  />
                ))}
        </div>

        {available.length > 0 ? (
          <Button
            size="lg"
            className="w-full"
            disabled={selectedIds.size === 0 || isAdding}
            onClick={handleAdd}
          >
            {isAdding
              ? "Adding..."
              : `Add ${selectedIds.size || ""} Companion${selectedIds.size !== 1 ? "s" : ""}`}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
