"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { CompanionProfileContent } from "@/features/companions"
import type { Companion } from "@/types/shared"

export function CompanionModalClient({
  companion,
}: {
  companion: Companion | null
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)

  function handleClose() {
    setIsOpen(false)
    router.back()
  }

  function handleNavigate(href: string) {
    setIsOpen(false)
    window.location.href = href
  }

  return (
    <>
      {isOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/50 animate-in fade-in-0 duration-200"
          onClick={handleClose}
          aria-hidden
        />
      ) : null}
      <Dialog
        open={isOpen}
        modal={false}
        onOpenChange={(open) => {
          if (!open) handleClose()
        }}
      >
        <DialogContent
          className="max-w-sm gap-0 overflow-hidden rounded-2xl border-border/50 bg-card p-0 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 slide-in-from-bottom-6 duration-300 sm:max-w-md"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DialogTitle className="sr-only">
            {companion?.name ?? "Companion"} Profile
          </DialogTitle>

          <div className="pb-8 pt-4">
            {companion ? (
              <CompanionProfileContent
                companion={companion}
                onNavigate={handleNavigate}
              />
            ) : (
              <p className="py-12 text-center text-muted-foreground">
                Companion not found.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
