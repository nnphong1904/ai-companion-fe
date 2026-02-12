import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MemoriesEmptyState, MemoriesTimeline } from "@/features/memories"
import * as api from "@/lib/api"

export default async function MemoriesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const token = (await cookies()).get("auth-token")?.value
  const [memories, companion] = await Promise.all([
    api.getMemories(id, token),
    api.getCompanion(id, token),
  ])

  if (!companion) notFound()

  return (
    <div className="mx-auto max-w-lg py-4">
      <header className="flex items-center gap-3 px-4 pb-4">
        <Button asChild variant="ghost" size="icon" className="shrink-0">
          <Link href={`/companions/${companion.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-lg font-bold">
            Memories with {companion.name}
          </h1>
          <p className="text-xs text-muted-foreground">
            {memories.length} {memories.length === 1 ? "memory" : "memories"} saved
          </p>
        </div>
      </header>

      {memories.length === 0 ? (
        <MemoriesEmptyState companionId={id} />
      ) : (
        <MemoriesTimeline initialMemories={memories} />
      )}
    </div>
  )
}
