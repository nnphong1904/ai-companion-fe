"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CompanionPickCard } from "@/components/companion"
import * as api from "@/lib/api"
import type { Companion } from "@/types/shared"

export function ChooseCompanionStep() {
  const router = useRouter()
  const [companions, setCompanions] = useState<Companion[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [isSelecting, setIsSelecting] = useState(false)

  useEffect(() => {
    api.getCompanions().then((data) => {
      setCompanions(data)
      setIsLoading(false)
    })
  }, [])

  async function handleConfirm() {
    if (!selectedId || isSelecting) return
    setIsSelecting(true)
    try {
      await api.selectCompanion(selectedId)
      startTransition(() => router.push("/"))
    } finally {
      setIsSelecting(false)
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-6 flex w-full max-w-lg flex-col gap-6 px-4 duration-500">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Choose your companion</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick someone you&apos;d like to connect with
        </p>
      </div>

      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: 5 }, (_, i) => (
              <Card key={i} className="py-0">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-full animate-pulse rounded bg-muted" />
                  </div>
                </CardContent>
              </Card>
            ))
          : companions.map((companion) => (
              <CompanionPickCard
                key={companion.id}
                companion={companion}
                isSelected={selectedId === companion.id}
                onSelect={() => setSelectedId(companion.id)}
              />
            ))}
      </div>

      <Button
        size="lg"
        disabled={!selectedId || isSelecting || isPending}
        onClick={handleConfirm}
        className="w-full"
      >
        {isSelecting ? "Setting up..." : "Start your journey"}
      </Button>
    </div>
  )
}
