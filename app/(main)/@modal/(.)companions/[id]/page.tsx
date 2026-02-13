import { getCompanion, getPublicCompanion } from "@/features/companions/queries"
import { getMemories } from "@/features/memories/queries"
import { getInsights, getReactionSummary } from "@/features/insights/queries"
import { getAuthToken } from "@/lib/api-fetch"
import { CompanionModalClient } from "./modal-client"

export default async function CompanionModalPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ view?: string }>
}) {
  const { id } = await params
  const { view } = await searchParams
  const token = await getAuthToken()

  const [companion, memories, insights, reactions] = await Promise.all([
    token ? getCompanion(id) : getPublicCompanion(id),
    token ? getMemories(id).catch(() => []) : Promise.resolve([]),
    token ? getInsights(id).catch(() => null) : Promise.resolve(null),
    token ? getReactionSummary(id) : Promise.resolve(null),
  ])

  const initialView = view === "memories" || view === "insights" ? view : undefined

  return (
    <CompanionModalClient
      companion={companion}
      memories={memories}
      insights={insights}
      reactions={reactions}
      isAuthenticated={!!token}
      initialView={initialView}
    />
  )
}
