"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  CompanionProfileContent,
  CompanionProfileSkeleton,
} from "@/components/companion-profile"
import * as api from "@/lib/api"
import type { Companion } from "@/types"

export default function CompanionModal({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [companion, setCompanion] = useState<Companion | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api.getCompanion(id).then((data) => {
      setCompanion(data)
      setIsLoading(false)
    })
  }, [id])

  return (
    <Dialog
      open
      modal={false}
      onOpenChange={(open) => {
        if (!open) router.back()
      }}
    >
      {/* Manual overlay since modal={false} disables the built-in one */}
      <div
        className="fixed inset-0 z-50 bg-black/50 animate-in fade-in-0 duration-200"
        onClick={() => router.back()}
        aria-hidden
      />
      <DialogContent
        className="max-w-sm gap-0 overflow-hidden rounded-2xl border-border/50 bg-card p-0 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 slide-in-from-bottom-6 duration-300 sm:max-w-md"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">
          {companion?.name ?? "Companion"} Profile
        </DialogTitle>

        <div className="pb-8 pt-4">
          {isLoading ? (
            <CompanionProfileSkeleton />
          ) : companion ? (
            <CompanionProfileContent
              companion={companion}
              onNavigate={() => router.back()}
            />
          ) : (
            <p className="py-12 text-center text-muted-foreground">
              Companion not found.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
