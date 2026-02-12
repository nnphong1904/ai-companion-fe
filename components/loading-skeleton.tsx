import { Card, CardContent } from "@/components/ui/card"
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

export function CompanionCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 p-5">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-1.5 text-center">
          <Skeleton className="mx-auto h-4 w-20" />
          <Skeleton className="mx-auto h-3 w-14" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
        <div className="w-full space-y-1.5">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-1.5 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

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

export function ChatSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-3 p-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className={`flex gap-2 ${i % 2 === 1 ? "flex-row-reverse" : ""}`}>
          <Skeleton
            className={`h-16 rounded-2xl ${i % 2 === 1 ? "w-[60%] rounded-br-md" : "w-[75%] rounded-bl-md"}`}
          />
        </div>
      ))}
    </div>
  )
}

export function MemorySkeleton() {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 3 }, (_, i) => (
        <Card key={i}>
          <CardContent className="space-y-3 p-4">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
