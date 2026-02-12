import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Companion } from "@/types/shared"

export function ChatHeader({ companion }: { companion: Companion | null }) {
  return (
    <header className="flex items-center gap-3 border-b px-3 py-2">
      <Button asChild variant="ghost" size="icon" className="shrink-0">
        <Link href="/chat">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold">
          {companion?.name ?? "Chat"}
        </h1>
        {companion ? (
          <p className="truncate text-xs text-muted-foreground">
            Feeling {companion.mood}
          </p>
        ) : null}
      </div>
    </header>
  )
}
