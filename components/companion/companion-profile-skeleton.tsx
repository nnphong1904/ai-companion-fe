import { Skeleton } from "@/components/ui/skeleton"

export function CompanionProfileSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6 px-4 pt-8">
      <Skeleton className="h-28 w-28 rounded-full" />
      <div className="space-y-2 text-center">
        <Skeleton className="mx-auto h-7 w-32" />
        <Skeleton className="mx-auto h-4 w-64" />
        <Skeleton className="mx-auto h-4 w-48" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-12 w-full max-w-xs" />
      <div className="flex w-full max-w-xs gap-3">
        <Skeleton className="h-11 flex-1" />
        <Skeleton className="h-11 flex-1" />
      </div>
    </div>
  )
}
