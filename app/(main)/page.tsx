import { Suspense } from "react";
import {
  CompanionsGrid,
  CompanionConstellation,
  HeroCompanionCard,
} from "@/features/companions";
import { CompanionCardSkeleton } from "@/features/companions";
import { StoriesSection } from "@/features/stories";
import { StoryRowSkeleton } from "@/features/stories";
import { CompanionAutoOpen } from "@/components/companion-auto-open";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getDashboardCompanions,
  getPublicCompanions,
} from "@/features/companions/queries";
import {
  getHeroCompanion,
  getRemainingCompanions,
  getAvailableCompanions,
} from "@/features/companions/lib/companions-utils";
import { getStories } from "@/features/stories/queries";
import { preloadStoryAssets } from "@/features/stories/lib/prefetch";
import { getAuthToken } from "@/lib/api-fetch";

async function StoriesBlock() {
  const token = await getAuthToken();
  if (!token) return null;

  const stories = await getStories().catch(() => []);
  if (stories.length === 0) return null;

  preloadStoryAssets(stories);

  return <StoriesSection initialStories={stories} />;
}

async function TopRow() {
  const token = await getAuthToken();
  if (!token) return null;

  const { myCompanions } = await getDashboardCompanions();
  if (myCompanions.length === 0) return null;

  const heroCompanion = getHeroCompanion(myCompanions);
  if (!heroCompanion) return null;
  const showConstellation = myCompanions.length >= 2;

  return (
    <div className="px-4">
      <div
        className={
          showConstellation
            ? "flex flex-col gap-4 lg:flex-row lg:items-end"
            : ""
        }
      >
        {/* Constellation */}
        {showConstellation && (
          <div className="lg:flex-1">
            <CompanionConstellation companions={myCompanions} />
          </div>
        )}

        {/* Hero companion */}
        <div className={showConstellation ? "lg:flex-1" : ""}>
          <HeroCompanionCard companion={heroCompanion} />
        </div>
      </div>
    </div>
  );
}

async function CompanionsBlock() {
  const token = await getAuthToken();

  if (!token) {
    const allCompanions = await getPublicCompanions();
    return (
      <CompanionsGrid
        companions={allCompanions}
        availableCompanions={[]}
        isAuthenticated={false}
      />
    );
  }

  const { myCompanions, allCompanions } = await getDashboardCompanions();
  const remainingCompanions = getRemainingCompanions(myCompanions);
  const available = getAvailableCompanions(allCompanions, myCompanions);

  return (
    <CompanionsGrid
      companions={remainingCompanions}
      availableCompanions={available}
      isAuthenticated
    />
  );
}

function TopRowSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4 lg:flex-row lg:items-center">
      <Skeleton className="h-[200px] rounded-2xl lg:flex-1" />
      <Skeleton className="h-[200px] rounded-2xl lg:flex-1" />
    </div>
  );
}

function CompanionsGridSkeleton() {
  return (
    <section className="px-4">
      <div className="mb-3 h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 4 }, (_, i) => (
          <CompanionCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 py-6">
      <Suspense>
        <CompanionAutoOpen />
      </Suspense>

      <header className="px-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>

      <Suspense fallback={<StoryRowSkeleton />}>
        <StoriesBlock />
      </Suspense>

      <Suspense fallback={<TopRowSkeleton />}>
        <TopRow />
      </Suspense>

      <Suspense fallback={<CompanionsGridSkeleton />}>
        <CompanionsBlock />
      </Suspense>
    </div>
  );
}
