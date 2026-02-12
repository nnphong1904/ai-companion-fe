import { Brain, MessageCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function MemoriesEmptyState({ companionId }: { companionId: string }) {
  return (
    <div className="flex flex-col items-center gap-5 px-4 py-24 text-center">
      <div className="rounded-2xl bg-muted/50 p-5">
        <Brain className="h-10 w-10 text-muted-foreground/60" />
      </div>
      <div className="space-y-2">
        <p className="text-lg font-semibold">No memories yet</p>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          Memories are created from your conversations. Start chatting to build your shared history.
        </p>
      </div>
      <Button asChild className="mt-2">
        <Link href={`/chat/${companionId}`}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Start chatting
        </Link>
      </Button>
    </div>
  )
}
