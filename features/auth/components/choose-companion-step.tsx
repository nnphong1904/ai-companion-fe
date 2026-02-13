"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CompanionPickCard } from "@/features/companions/companion-pick-card"
import { selectCompanions } from "@/features/companions/actions"
import type { Companion } from "@/types/shared"

export function ChooseCompanionStep({
  companions,
}: {
  companions: Companion[]
}) {
  const router = useRouter()
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

  function handleConfirm() {
    if (selectedIds.size === 0 || isPending) return
    startTransition(async () => {
      await selectCompanions([...selectedIds])
      router.push("/")
    })
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-6 flex w-full max-w-lg flex-col gap-6 px-4 duration-500">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Choose your companion</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick the companions you&apos;d like to connect with
        </p>
      </div>

      <div className="space-y-3">
        {companions.map((companion) => (
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
        disabled={selectedIds.size === 0 || isPending}
        onClick={handleConfirm}
        className="w-full"
      >
        {isPending ? "Setting up..." : "Start your journey"}
      </Button>
    </div>
  )
}
