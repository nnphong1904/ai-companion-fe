import { cookies } from "next/headers"
import { CompanionsGrid } from "@/components/companion"
import { StoriesSection } from "@/features/stories"
import * as api from "@/lib/api"

export default async function DashboardPage() {
  const token = (await cookies()).get("auth-token")?.value
  const [myCompanions, allCompanions, stories] = await Promise.all([
    api.getMyCompanions(token),
    api.getAllCompanions(token),
    api.getStories(token),
  ])

  const hasMore = allCompanions.length > myCompanions.length

  return (
    <div className="space-y-8 py-6">
      <header className="px-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>

      {stories.length > 0 ? <StoriesSection initialStories={stories} /> : null}

      <CompanionsGrid companions={myCompanions} showAdd={hasMore} />
    </div>
  )
}
