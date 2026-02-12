import { CompanionsGrid } from "@/features/companions"
import { StoriesSection } from "@/features/stories"
import { getMyCompanions, getAllCompanions } from "@/features/companions/queries"
import { getStories } from "@/features/stories/queries"

export default async function DashboardPage() {
  const [myCompanions, allCompanions, stories] = await Promise.all([
    getMyCompanions(),
    getAllCompanions(),
    getStories().catch(() => []),
  ])

  const myIds = new Set(myCompanions.map((c) => c.id))
  const availableCompanions = allCompanions.filter((c) => !myIds.has(c.id))

  return (
    <div className="space-y-8 py-6">
      <header className="px-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>

      {stories.length > 0 ? <StoriesSection initialStories={stories} /> : null}

      <CompanionsGrid companions={myCompanions} availableCompanions={availableCompanions} />
    </div>
  )
}
