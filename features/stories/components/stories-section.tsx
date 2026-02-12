"use client"

import { useState } from "react"
import { StoriesRow } from "./stories-row"
import { StoryViewer } from "./story-viewer"
import { useStoriesViewer } from "../hooks/use-stories"
import * as api from "@/lib/api"
import { getToken } from "@/lib/token"
import type { Story } from "../types"

export function StoriesSection({ initialStories }: { initialStories: Story[] }) {
  const [stories, setStories] = useState(initialStories)

  const storyViewer = useStoriesViewer({
    stories,
    onMarkViewed: (storyId) => {
      setStories((prev) =>
        prev.map((s) => (s.id === storyId ? { ...s, viewed: true } : s)),
      )
    },
    onReact: (storyId, slideId, emoji) => {
      const token = getToken() ?? undefined
      api.reactToStory(storyId, slideId, emoji, token)
    },
  })

  return (
    <>
      <StoriesRow stories={stories} onOpenStory={storyViewer.open} />
      <StoryViewer
        isOpen={storyViewer.isOpen}
        story={storyViewer.activeStory}
        slide={storyViewer.activeSlide}
        slideIndex={storyViewer.activeSlideIndex}
        progress={storyViewer.progress}
        isPaused={storyViewer.isPaused}
        onClose={storyViewer.close}
        onNext={storyViewer.goNext}
        onPrev={storyViewer.goPrev}
        onReact={storyViewer.react}
        onPause={storyViewer.pauseTimer}
        onResume={storyViewer.resumeTimer}
        onDurationResolved={storyViewer.setActiveSlideDuration}
      />
    </>
  )
}
