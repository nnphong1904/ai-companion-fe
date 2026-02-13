"use client"

import dynamic from "next/dynamic"
import { StoriesRow } from "./stories-row"
import { useStoriesSection } from "../hooks/use-stories-section"
import type { Story } from "../types"

const StoryViewer = dynamic(() =>
  import("./story-viewer").then((m) => m.StoryViewer),
)

export function StoriesSection({ initialStories }: { initialStories: Story[] }) {
  const { stories, viewer } = useStoriesSection(initialStories)

  return (
    <>
      <StoriesRow stories={stories} onOpenStory={viewer.open} />
      <StoryViewer viewer={viewer} />
    </>
  )
}
