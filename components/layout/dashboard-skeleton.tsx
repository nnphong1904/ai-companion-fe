import { CompanionCardSkeleton } from "@/components/companion"
import { StoryRowSkeleton } from "@/features/stories"

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <StoryRowSkeleton />
      <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <CompanionCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
