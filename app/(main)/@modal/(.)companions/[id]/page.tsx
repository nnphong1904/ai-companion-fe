import { getCompanion } from "@/features/companions/queries"
import { CompanionModalClient } from "./modal-client"

export default async function CompanionModalPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const companion = await getCompanion(id)

  return <CompanionModalClient companion={companion} />
}
