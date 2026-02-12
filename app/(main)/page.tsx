"use client"

import { useEffect, useState } from "react"
import { CompanionsGrid } from "@/components/companion"
import { DashboardSkeleton } from "@/components/layout"
import { StoriesRow, StoryViewer, useStoriesViewer } from "@/features/stories"
import * as api from "@/lib/api"
import type { Companion, Story } from "@/types"

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
