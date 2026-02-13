"use client"

import { StoriesRow } from "./stories-row"
import { StoryViewer } from "./story-viewer"
import { useStoriesSection } from "../hooks/use-stories-section"
import type { Story } from "../types"

export function StoriesSection({ initialStories }: { initialStories: Story[] }) {
  const { stories, viewer } = useStoriesSection(initialStories)

  return (
    <>
      <StoriesRow stories={stories} onOpenStory={viewer.open} />
      <StoryViewer viewer={viewer} />
    </>
  )
}
