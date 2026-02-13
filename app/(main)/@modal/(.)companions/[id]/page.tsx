import { getCompanion, getPublicCompanion } from "@/features/companions/queries"
import { getAuthToken } from "@/lib/api-fetch"
import { CompanionModalClient } from "./modal-client"

export default async function CompanionModalPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const token = await getAuthToken()
  const companion = await (token ? getCompanion(id) : getPublicCompanion(id))

  return <CompanionModalClient companion={companion} isAuthenticated={!!token} />
}
