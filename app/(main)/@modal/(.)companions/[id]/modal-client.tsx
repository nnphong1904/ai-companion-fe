"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CompanionProfileContent } from "@/features/companions"
import { MemoriesTimeline, MemoriesEmptyState } from "@/features/memories"
import { CompanionInsights } from "@/features/insights"
import { cn } from "@/lib/utils"
import type { Companion } from "@/types/shared"
import type { Memory } from "@/features/memories/types"
import type { InsightsData } from "@/features/insights/types"

type ModalView = "profile" | "memories" | "insights"

const VIEW_CONFIG: Record<
  Exclude<ModalView, "profile">,
  { title: string; icon: typeof BookOpen }
> = {
  memories: { title: "Memories", icon: BookOpen },
  insights: { title: "Relationship Insights", icon: Sparkles },
}

export function CompanionModalClient({
  companion,
  memories,
  insights,
  isAuthenticated = true,
}: {
  companion: Companion | null
  memories: Memory[]
  insights: InsightsData | null
  isAuthenticated?: boolean
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)
  const [view, setView] = useState<ModalView>("profile")

  function handleClose() {
    setIsOpen(false)
    router.back()
  }

  function handleNavigate(href: string) {
    if (href.startsWith("/memories/")) {
      setView("memories")
    } else if (href.startsWith("/insights/")) {
      setView("insights")
    } else {
      setIsOpen(false)
      window.location.href = href
    }
  }

  function handleBack() {
    setView("profile")
  }

  const isSubView = view !== "profile"

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
          className={cn(
            "gap-0 rounded-2xl border-border/50 bg-card p-0 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 slide-in-from-bottom-6 duration-300",
            "transition-[max-width] duration-300 ease-out overflow-hidden",
            view === "insights"
              ? "max-w-lg sm:max-w-xl"
              : "max-w-sm sm:max-w-md",
          )}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DialogTitle className="sr-only">
            {companion?.name ?? "Companion"} —{" "}
            {isSubView ? VIEW_CONFIG[view as keyof typeof VIEW_CONFIG].title : "Profile"}
          </DialogTitle>

          <div
            className={cn(
              "relative overflow-hidden transition-[min-height] duration-300 ease-out",
              view === "insights" ? "min-h-[80dvh]" : "min-h-0",
            )}
          >
            {/* Profile view */}
            <div
              className={cn(
                "transition-all duration-250 ease-out",
                isSubView
                  ? "-translate-x-full opacity-0"
                  : "translate-x-0 opacity-100",
              )}
            >
              <div className="pb-8 pt-4">
                {companion ? (
                  <CompanionProfileContent
                    companion={companion}
                    onNavigate={handleNavigate}
                    isAuthenticated={isAuthenticated}
                  />
                ) : (
                  <p className="py-12 text-center text-muted-foreground">
                    Companion not found.
                  </p>
                )}
              </div>
            </div>

            {/* Sub-view (memories / insights) */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col transition-all duration-250 ease-out",
                isSubView
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0",
              )}
            >
              {isSubView ? (
                <>
                  {/* Sub-view header */}
                  <div className="flex shrink-0 items-center gap-2 border-b border-border/50 px-4 py-3">
                    <button
                      onClick={handleBack}
                      className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <h3 className="text-sm font-medium">
                      {VIEW_CONFIG[view as keyof typeof VIEW_CONFIG].title}
                    </h3>
                  </div>

                  {/* Sub-view content */}
                  {view === "memories" ? (
                    <ScrollArea className="h-[min(65dvh,500px)]">
                      <div className="p-4">
                        {memories.length === 0 && companion ? (
                          <MemoriesEmptyState companionId={companion.id} />
                        ) : (
                          <MemoriesTimeline initialMemories={memories} />
                        )}
                      </div>
                    </ScrollArea>
                  ) : view === "insights" && companion && insights ? (
                    <ScrollArea className="flex-1 min-h-0">
                      <div className="pb-4">
                        <CompanionInsights
                          companion={companion}
                          insights={insights}
                        />
                      </div>
                    </ScrollArea>
                  ) : (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No data available.
                    </p>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
