"use client"

import { useEffect, useState } from "react"
import { CompanionCard } from "@/components/companion-card"
import { DashboardSkeleton } from "@/components/loading-skeleton"
import { StoryAvatar } from "@/components/story-avatar"
import { StoryViewer } from "@/components/story-viewer"
import { useStoriesViewer } from "@/hooks/use-stories"
import * as api from "@/lib/api"
import type { Companion, Story } from "@/types"

function StoriesRow({
  stories,
  onOpenStory,
}: {
  stories: Story[]
  onOpenStory: (index: number) => void
}) {
  return (
    <section className="px-4">
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">Stories</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        {stories.map((story, i) => (
          <StoryAvatar
            key={story.id}
            name={story.companionName}
            avatarUrl={story.companionAvatarUrl}
            viewed={story.viewed}
            onClick={() => onOpenStory(i)}
          />
        ))}
      </div>
    </section>
  )
}

function CompanionsGrid({ companions }: { companions: Companion[] }) {
  return (
    <section className="px-4">
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">Your Companions</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companions.map((companion) => (
          <CompanionCard key={companion.id} companion={companion} />
        ))}
      </div>
    </section>
  )
}

export default function DashboardPage() {
  const [companions, setCompanions] = useState<Companion[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getCompanions(), api.getStories()]).then(
      ([companionsData, storiesData]) => {
        setCompanions(companionsData)
        setStories(storiesData)
        setIsLoading(false)
      },
    )
  }, [])

  const storyViewer = useStoriesViewer({
    stories,
    onMarkViewed: (storyId) => {
      setStories((prev) =>
        prev.map((s) => (s.id === storyId ? { ...s, viewed: true } : s)),
      )
      api.markStoryViewed(storyId)
    },
    onReact: (storyId, emoji) => {
      api.reactToStory(storyId, emoji)
    },
  })

  if (isLoading) return <DashboardSkeleton />

  return (
    <div className="space-y-8 py-6">
      <header className="px-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>

      {stories.length > 0 && (
        <StoriesRow stories={stories} onOpenStory={storyViewer.open} />
      )}

      <CompanionsGrid companions={companions} />

      <StoryViewer
        isOpen={storyViewer.isOpen}
        story={storyViewer.activeStory}
        slide={storyViewer.activeSlide}
        slideIndex={storyViewer.activeSlideIndex}
        progress={storyViewer.progress}
        onClose={storyViewer.close}
        onNext={storyViewer.goNext}
        onPrev={storyViewer.goPrev}
        onReact={storyViewer.react}
      />
    </div>
  )
}
