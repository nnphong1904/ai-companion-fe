import { Skeleton } from "@/components/ui/skeleton"
import { MemorySkeleton } from "@/features/memories"

export default function MemoriesLoading() {
  return (
    <div className="mx-auto max-w-lg py-4">
      <div className="flex items-center gap-3 px-4 pb-4">
        <Skeleton className="h-9 w-9 rounded-md" />
        <div className="space-y-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <MemorySkeleton />
    </div>
  )
}
