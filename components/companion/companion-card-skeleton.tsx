import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CompanionCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 p-5">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-1 text-center">
          <Skeleton className="mx-auto h-4 w-20" />
          <Skeleton className="mx-auto h-3 w-14" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-6 w-full" />
      </CardContent>
    </Card>
  )
}
