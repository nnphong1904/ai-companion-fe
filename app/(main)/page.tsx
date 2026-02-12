import { CompanionsGrid } from "@/components/companion"
import { StoriesSection } from "@/features/stories"
import * as api from "@/lib/api"

export default async function DashboardPage() {
  const [companions, stories] = await Promise.all([
    api.getCompanions(),
    api.getStories(),
  ])

  return (
    <div className="space-y-8 py-6">
      <header className="px-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>

      {stories.length > 0 && <StoriesSection initialStories={stories} />}

      <CompanionsGrid companions={companions} />
    </div>
  )
}
