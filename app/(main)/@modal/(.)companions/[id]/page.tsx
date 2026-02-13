import { getCompanion, getPublicCompanion } from "@/features/companions/queries"
import { getMemories } from "@/features/memories/queries"
import { getInsights } from "@/features/insights/queries"
import { getAuthToken } from "@/lib/api-fetch"
import { CompanionModalClient } from "./modal-client"

export default async function CompanionModalPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const token = await getAuthToken()

  const [companion, memories, insights] = await Promise.all([
    token ? getCompanion(id) : getPublicCompanion(id),
    token ? getMemories(id).catch(() => []) : Promise.resolve([]),
    token ? getInsights(id).catch(() => null) : Promise.resolve(null),
  ])

  return (
    <CompanionModalClient
      companion={companion}
      memories={memories}
      insights={insights}
      isAuthenticated={!!token}
    />
  )
}
