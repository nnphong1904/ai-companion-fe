import { Skeleton } from "@/components/ui/skeleton"

export function StoryRowSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden px-4">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <Skeleton className="h-[62px] w-[62px] rounded-full" />
          <Skeleton className="h-3 w-10" />
        </div>
      ))}
    </div>
  )
}
