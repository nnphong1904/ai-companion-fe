import { Skeleton } from "@/components/ui/skeleton"
import { ChatSkeleton } from "@/features/chat"

export default function ChatDetailLoading() {
  return (
    <div className="flex h-dvh flex-col">
      <div className="flex items-center gap-3 border-b px-3 py-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
      <ChatSkeleton />
    </div>
  )
}
