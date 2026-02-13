import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MemoriesEmptyState, MemoriesTimeline } from "@/features/memories"
import { getCompanion } from "@/features/companions/queries"
import { getMemories } from "@/features/memories/queries"
import { getAuthToken } from "@/lib/api-fetch"

export default async function MemoriesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const token = await getAuthToken()
  if (!token) redirect("/login")

  const { id } = await params
  const [memories, companion] = await Promise.all([
    getMemories(id),
    getCompanion(id),
  ])

  if (!companion) notFound()

  return (
    <div className="mx-auto max-w-lg py-4">
      <header className="flex items-center gap-3 px-4 pb-6">
        <Button asChild variant="ghost" size="icon" className="shrink-0">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <Avatar className="h-10 w-10 border-2 border-primary/20">
          <AvatarImage src={companion.avatarUrl} alt={companion.name} />
          <AvatarFallback>{companion.name[0]}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold leading-tight">
            {companion.name}
          </h1>
          <p className="text-xs text-muted-foreground">
            {memories.length} {memories.length === 1 ? "memory" : "memories"}
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
