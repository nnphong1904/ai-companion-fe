"use client"

import { useState, useTransition } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
}: {
  companions: Companion[]
  availableCompanions?: Companion[]
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
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">Your Companions</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companions.map((companion) => (
          <CompanionCard key={companion.id} companion={companion} />
        ))}
        {available.length > 0 ? (
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) setSelectedIds(new Set()) }}>
            <DialogTrigger asChild>
              <button className="text-left">
                <Card className="group h-full cursor-pointer border-dashed transition-colors hover:bg-accent/50">
                  <CardContent className="flex flex-col items-center justify-center gap-3 p-5 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-primary/10">
                      <Plus className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold leading-none">Add Companion</h3>
                      <p className="text-xs text-muted-foreground">Connect with someone new</p>
                    </div>
                  </CardContent>
                </Card>
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
    </section>
  )
}
