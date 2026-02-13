"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CompanionCard } from "./companion-card"
import { CompanionPickCard } from "./companion-pick-card"
import { selectCompanions } from "@/features/companions/actions"
import type { Companion } from "@/types/shared"

export function CompanionsGrid({
  companions,
  availableCompanions,
  isAuthenticated = true,
}: {
  companions: Companion[]
  availableCompanions?: Companion[]
  isAuthenticated?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()

  function toggleCompanion(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleAdd() {
    if (selectedIds.size === 0 || isPending) return
    startTransition(async () => {
      await selectCompanions([...selectedIds])
      setOpen(false)
      window.location.reload()
    })
  }

  const available = availableCompanions ?? []

  return (
    <section className="px-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">Your Companions</h2>

        {available.length > 0 && !isAuthenticated ? (
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <Plus className="h-3.5 w-3.5" />
            Log in to Add
          </Link>
        ) : null}

        {available.length > 0 && isAuthenticated ? (
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) setSelectedIds(new Set()) }}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary">
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </DialogTrigger>
            <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Companion</DialogTitle>
                <DialogDescription>
                  Choose new companions to connect with
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-2">
                {available.map((companion) => (
                  <CompanionPickCard
                    key={companion.id}
                    companion={companion}
                    isSelected={selectedIds.has(companion.id)}
                    onSelect={() => toggleCompanion(companion.id)}
                  />
                ))}
              </div>

              <Button
                size="lg"
                className="w-full"
                disabled={selectedIds.size === 0 || isPending}
                onClick={handleAdd}
              >
                {isPending
                  ? "Adding..."
                  : `Add ${selectedIds.size || ""} Companion${selectedIds.size !== 1 ? "s" : ""}`}
              </Button>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companions.map((companion) => (
          <CompanionCard key={companion.id} companion={companion} />
        ))}
      </div>
    </section>
  )
}
