import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

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
