import { Brain } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function MemoriesEmptyState({ companionId }: { companionId: string }) {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-20 text-center">
      <div className="rounded-full bg-muted p-4">
        <Brain className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="font-medium">No memories yet</p>
        <p className="text-sm text-muted-foreground">
          Start chatting to create some
        </p>
      </div>
      <Button asChild>
        <Link href={`/chat/${companionId}`}>Start chatting</Link>
      </Button>
    </div>
  )
}
