import { Suspense } from "react"
import { CompanionsGrid } from "@/features/companions"
import { CompanionCardSkeleton } from "@/features/companions"
import { StoriesSection } from "@/features/stories"
import { StoryRowSkeleton } from "@/features/stories"
import { getDashboardCompanions, getPublicCompanions } from "@/features/companions/queries"
import { getStories } from "@/features/stories/queries"
import { getAuthToken } from "@/lib/api-fetch"

async function StoriesBlock() {
  const stories = await getStories().catch(() => [])
  if (stories.length === 0) return null
  return <StoriesSection initialStories={stories} />
}

async function CompanionsBlock() {
  const token = await getAuthToken()

  if (!token) {
    const allCompanions = await getPublicCompanions()
    return (
      <CompanionsGrid
        companions={allCompanions}
        availableCompanions={[]}
        isAuthenticated={false}
      />
    )
  }

  const { myCompanions, allCompanions } = await getDashboardCompanions()
  const myIds = new Set(myCompanions.map((c) => c.id))
  const availableCompanions = allCompanions.filter((c) => !myIds.has(c.id))
  return (
    <CompanionsGrid
      companions={myCompanions}
      availableCompanions={availableCompanions}
      isAuthenticated
    />
  )
}

function CompanionsGridSkeleton() {
  return (
    <section className="px-4">
      <div className="mb-3 h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <CompanionCardSkeleton key={i} />
        ))}
      </div>
    </section>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-8 py-6">
      <header className="px-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>

      <Suspense fallback={<StoryRowSkeleton />}>
        <StoriesBlock />
      </Suspense>

      <Suspense fallback={<CompanionsGridSkeleton />}>
        <CompanionsBlock />
      </Suspense>
    </div>
  )
}
