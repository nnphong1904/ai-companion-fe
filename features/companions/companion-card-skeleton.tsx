import { Skeleton } from "@/components/ui/skeleton"

export function CompanionCardSkeleton() {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/30">
      {/* Full background skeleton */}
      <Skeleton className="absolute inset-0 h-full w-full rounded-none" />

      {/* Bottom content area */}
      <div className="absolute inset-x-0 bottom-0 space-y-2 px-3.5 pb-3.5">
        <div className="space-y-1">
          <Skeleton className="h-4 w-20 bg-white/10" />
          <Skeleton className="h-3 w-14 bg-white/10" />
        </div>
        <div className="space-y-1">
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-1 flex-1 rounded-full bg-white/10" />
            ))}
          </div>
          <Skeleton className="h-3 w-14 bg-white/10" />
        </div>
      </div>
    </div>
  )
}
